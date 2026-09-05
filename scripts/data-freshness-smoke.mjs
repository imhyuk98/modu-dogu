const baseUrl = process.env.DATA_QA_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
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
  if (message.error) waiter.reject(new Error(message.error.message));
  else waiter.resolve(message.result);
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

async function inspect(route) {
  await send("Page.navigate", { url: new URL(route, baseUrl).href });
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      if (await evaluate("document.readyState === 'complete'")) break;
    } catch { /* navigation in progress */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const result = await evaluate(`(() => ({
      rate: document.querySelector('[data-testid="interest-rate-input"]')?.value || '',
      warning: document.querySelector('[role="alert"]')?.textContent?.trim() || '',
    }))()`);
    if (result.warning.includes("자동 갱신이 7일 넘게 지연")) return result;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return evaluate(`(() => ({ rate: document.querySelector('[data-testid="interest-rate-input"]')?.value || '', warning: document.querySelector('[role="alert"]')?.textContent?.trim() || '' }))()`);
}

const checks = [
  ["/calculators/deposit", "3.5"],
  ["/calculators/loan", "3.5"],
  ["/calculators/savings", "4.0"],
];
const results = {};
for (const [route, expectedRate] of checks) {
  const result = await inspect(route);
  results[route] = result;
  if (result.rate !== expectedRate || !result.warning.includes("자동 갱신이 7일 넘게 지연")) {
    throw new Error(`Stale reference protection failed for ${route}: ${JSON.stringify(result)}`);
  }
}

socket.close();
console.log(JSON.stringify({ message: "Stale interest-rate data was warned about and not auto-applied.", results }, null, 2));
