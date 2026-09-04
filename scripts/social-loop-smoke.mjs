const baseUrl = process.env.SOCIAL_QA_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";

const targets = await fetch(`${debuggerUrl}/json`).then((response) => response.json());
const target = targets.find((candidate) => candidate.type === "page");
if (!target) throw new Error("No Chrome page target found");

const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let requestId = 0;
const pending = new Map();
let browserErrors = [];
socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") browserErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") browserErrors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "));
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

async function evaluate(source) {
  const result = await send("Runtime.evaluate", { expression: `(${source})()`, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
async function navigate(path) {
  browserErrors = [];
  await send("Page.navigate", { url: new URL(path, baseUrl).href });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try { if (await evaluate(`() => document.readyState === "complete"`)) break; } catch { /* navigation in progress */ }
    await wait(50);
  }
  await wait(250);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 412, height: 915, deviceScaleFactor: 1, mobile: true });

await navigate("/tools/telepathy-game");
const telepathy = await evaluate(`async () => {
  window.__qaEvents = []; window.gtag = (_command, name) => window.__qaEvents.push(name);
  localStorage.removeItem("telepathy:last-created");
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  const inputs = [...document.querySelectorAll('input[placeholder="내 답을 먼저 입력"]')];
  inputs.forEach((input, index) => { setter.call(input, "답" + (index + 1)); input.dispatchEvent(new Event("input", { bubbles: true })); });
  await new Promise((resolve) => setTimeout(resolve, 80));
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("초대 링크 만들기"))?.click();
  await new Promise((resolve) => setTimeout(resolve, 150));
  const events = window.__qaEvents;
  return { ready: document.body.innerText.includes("초대 링크가 준비됐어요"), answerCount: inputs.length, shareMethods: ["카카오톡·앱 공유", "문자로 보내기", "링크 복사"].every((label) => [...document.querySelectorAll("button")].some((button) => button.textContent.includes(label))), event: events.includes("invite_create"), overflow: document.documentElement.scrollWidth > innerWidth };
}`);
assert(telepathy.ready && telepathy.answerCount === 5 && telepathy.shareMethods && telepathy.event && !telepathy.overflow && browserErrors.length === 0, `Telepathy failed: ${JSON.stringify({ telepathy, browserErrors })}`);

await navigate("/tools/never-have-i-ever");
const never = await evaluate(`async () => {
  window.__qaEvents = []; window.gtag = (_command, name) => window.__qaEvents.push(name);
  const topLabels = [...document.querySelectorAll("button")].map((button) => button.textContent.trim());
  const safeDefault = [...document.querySelectorAll("span")].some((span) => span.textContent.trim() === "일반");
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("있다!"))?.click();
  await new Promise((resolve) => setTimeout(resolve, 80));
  const hasShare = ["카카오톡·앱 공유", "문자로 보내기", "링크 복사"].every((label) => [...document.querySelectorAll("button")].some((button) => button.textContent.includes(label)));
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("만 19세 이상"))?.click();
  await new Promise((resolve) => setTimeout(resolve, 80));
  const events = window.__qaEvents;
  return { adultNotTopTab: !topLabels.includes("19금"), safeDefault, adultOpened: [...document.querySelectorAll("span")].some((span) => span.textContent.trim() === "19금"), hasShare, saved: Number(localStorage.getItem("never-have-i-ever:answers")) > 0, event: events.includes("tool_start"), overflow: document.documentElement.scrollWidth > innerWidth };
}`);
assert(never.adultNotTopTab && never.safeDefault && never.adultOpened && never.hasShare && never.saved && never.event && !never.overflow && browserErrors.length === 0, `Never Have I Ever failed: ${JSON.stringify({ never, browserErrors })}`);

await navigate("/tools/nunchi-game");
const nunchi = await evaluate(`async () => {
  window.__qaEvents = []; window.gtag = (_command, name) => window.__qaEvents.push(name);
  [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "교실")?.click();
  await new Promise((resolve) => setTimeout(resolve, 40));
  const settingSelected = document.body.innerText.includes("교실 규칙:");
  const input = document.querySelector('input[placeholder="이름 입력"]');
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  for (const name of ["하나", "둘"]) { setter.call(input, name); input.dispatchEvent(new Event("input", { bubbles: true })); await new Promise((resolve) => setTimeout(resolve, 30)); [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "추가")?.click(); await new Promise((resolve) => setTimeout(resolve, 30)); }
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("게임 시작!"))?.click();
  await new Promise((resolve) => setTimeout(resolve, 3500));
  const playerButtons = [...document.querySelectorAll("button")].filter((button) => button.textContent.includes("벌칙"));
  playerButtons.forEach((button) => button.click());
  await new Promise((resolve) => setTimeout(resolve, 120));
  [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "종료")?.click();
  await new Promise((resolve) => setTimeout(resolve, 100));
  const events = window.__qaEvents;
  return { setting: settingSelected, result: document.body.innerText.includes("최종 결과"), share: document.body.innerText.includes("문자로 보내기"), start: events.includes("tool_start"), complete: events.includes("tool_complete"), overflow: document.documentElement.scrollWidth > innerWidth };
}`);
assert(nunchi.setting && nunchi.result && nunchi.share && nunchi.start && nunchi.complete && !nunchi.overflow && browserErrors.length === 0, `Nunchi failed: ${JSON.stringify({ nunchi, browserErrors })}`);

await navigate("/tools/block-escape");
const block = await evaluate(`async () => {
  window.__qaEvents = []; window.gtag = (_command, name) => window.__qaEvents.push(name);
  const target = document.querySelector('[aria-label^="빨간 목표"]');
  target.focus();
  target.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 80));
  document.querySelector('[aria-label^="빨간 목표"]')?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 80));
  document.querySelector('[aria-label^="빨간 목표"]')?.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
  await new Promise((resolve) => setTimeout(resolve, 250));
  const events = window.__qaEvents;
  return { win: document.body.innerText.includes("레벨 1 클리어"), best: Boolean(localStorage.getItem("block-escape:best:0")), share: document.body.innerText.includes("문자로 보내기"), start: events.includes("tool_start"), complete: events.includes("tool_complete"), overflow: document.documentElement.scrollWidth > innerWidth };
}`);
assert(block.win && block.best && block.share && block.start && block.complete && !block.overflow && browserErrors.length === 0, `Block Escape failed: ${JSON.stringify({ block, browserErrors })}`);

socket.close();
console.log(JSON.stringify({ viewport: 412, telepathy, never, nunchi, block, browserErrors: 0 }, null, 2));
