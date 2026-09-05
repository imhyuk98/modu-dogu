import { readFile } from "node:fs/promises";

const baseUrl = process.env.A11Y_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const routes = [
  "/",
  "/calculators/salary",
  "/calculators/annual-leave",
  "/calculators/deposit",
  "/calculators/loan",
  "/calculators/savings",
  "/tools/telepathy-game",
  "/tools/never-have-i-ever",
  "/tools/fuel-map",
  "/tools/image-to-pdf",
  "/en",
];
const axeSource = await readFile(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");

const targets = await fetch(`${debuggerUrl}/json`).then((response) => response.json());
const target = targets.find((candidate) => candidate.type === "page");
if (!target) throw new Error("No Chrome page target found.");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const waiter = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message)); else waiter.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

async function navigate(route) {
  await send("Page.navigate", { url: new URL(route, baseUrl).href });
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if (await evaluate("document.readyState === 'complete'")) break;
    } catch { /* navigation in progress */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  await new Promise((resolve) => setTimeout(resolve, 350));
}

await navigate("/");
await evaluate("localStorage.removeItem('modu:optional-consent:v1')");

const failures = [];
for (const route of routes) {
  await navigate(route);
  await evaluate(axeSource);
  const violations = await evaluate(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } }).then((result) => result.violations.filter((item) => item.impact === 'critical' || item.impact === 'serious').map((item) => ({ id: item.id, impact: item.impact, help: item.help, nodes: item.nodes.length, examples: item.nodes.slice(0, 5).map((node) => ({ target: node.target.join(' '), html: node.html, summary: node.failureSummary })) })))`);
  if (violations.length) failures.push({ route, violations });
}

socket.close();
if (failures.length) {
  console.error(JSON.stringify(failures, null, 2));
  process.exit(1);
}
console.log(`Accessibility smoke passed: ${routes.length} representative routes, no serious or critical WCAG A/AA violations.`);
