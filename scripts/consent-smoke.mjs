const baseUrl = process.env.CONSENT_QA_BASE_URL ?? "http://127.0.0.1:3000";
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
async function navigate(url) {
  await send("Page.navigate", { url });
  for (let attempt = 0; attempt < 100; attempt++) {
    try { if (await evaluate("document.readyState === 'complete'")) break; } catch { /* navigation */ }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  await new Promise((resolve) => setTimeout(resolve, 300));
}

await navigate(new URL("/privacy", baseUrl).href);
await evaluate("localStorage.removeItem('modu:optional-consent:v1')");
await navigate(new URL("/tools/telepathy-game?invite=private-test#secret", baseUrl).href);
const before = await evaluate(`({ banner: Boolean(document.querySelector('[data-testid="consent-banner"]')), analyticsScript: Boolean(document.querySelector('script[src*="googletagmanager"]')), consent: localStorage.getItem('modu:optional-consent:v1') })`);
if (!before.banner || before.analyticsScript || before.consent) throw new Error(`Consent default failed: ${JSON.stringify(before)}`);

await evaluate(`document.querySelector('[data-testid="consent-grant"]').click()`);
await new Promise((resolve) => setTimeout(resolve, 500));
const after = await evaluate(`(() => {
  const entries = window.dataLayer || [];
  const pageView = entries.find((entry) => (entry?.[0] === 'event' && entry?.[1] === 'page_view'));
  return { analyticsScript: Boolean(document.querySelector('script[src*="googletagmanager"]')), consent: localStorage.getItem('modu:optional-consent:v1'), pageLocation: pageView?.[2]?.page_location || '' };
})()`);
if (!after.analyticsScript || after.consent !== "granted" || after.pageLocation.includes("?") || after.pageLocation.includes("#") || !after.pageLocation.endsWith("/tools/telepathy-game")) {
  throw new Error(`Consent grant or URL scrubbing failed: ${JSON.stringify(after)}`);
}

await evaluate(`window.dispatchEvent(new Event('modu:consent-open'))`);
await new Promise((resolve) => setTimeout(resolve, 100));
await evaluate(`document.querySelector('[data-testid="consent-deny"]').click()`);
const revoked = await evaluate(`(() => {
  const entries = window.dataLayer || [];
  const update = [...entries].reverse().find((entry) => entry?.[0] === 'consent' && entry?.[1] === 'update');
  return { consent: localStorage.getItem('modu:optional-consent:v1'), analyticsStorage: update?.[2]?.analytics_storage || '' };
})()`);
if (revoked.consent !== "denied" || revoked.analyticsStorage !== "denied") {
  throw new Error(`Consent revocation failed: ${JSON.stringify(revoked)}`);
}

socket.close();
console.log("Consent smoke passed: default blocking, URL scrubbing, opt-in, and revocation verified.");
