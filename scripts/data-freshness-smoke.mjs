import { readFile } from "node:fs/promises";

const baseUrl = process.env.DATA_QA_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const staleInterestRates = JSON.parse(await readFile("public/interest-rates.json", "utf8"));
staleInterestRates.updatedAt = "2000-01-01";
const staleInterestRatesBody = Buffer.from(JSON.stringify(staleInterestRates)).toString("base64");
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
  if (message.method === "Fetch.requestPaused") {
    void send("Fetch.fulfillRequest", {
      requestId: message.params.requestId,
      responseCode: 200,
      responseHeaders: [{ name: "Content-Type", value: "application/json; charset=utf-8" }],
      body: staleInterestRatesBody,
    });
    return;
  }
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

await send("Fetch.enable", {
  patterns: [{ urlPattern: "*interest-rates.json*", requestStage: "Request" }],
});

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

const fuelRegion = await evaluate(`fetch(${JSON.stringify(new URL("/fuel-stations/20.json", baseUrl).href)})
  .then((response) => response.json())
  .then((data) => ({ area: data.area, stations: data.stations.length }))`);
if (fuelRegion.area !== "전남·광주" || fuelRegion.stations === 0) {
  throw new Error(`Current Opinet region mapping failed: ${JSON.stringify(fuelRegion)}`);
}

socket.close();
console.log(JSON.stringify({
  message: "Stale interest-rate protection and current Opinet region mapping passed.",
  results,
  fuelRegion,
}, null, 2));
