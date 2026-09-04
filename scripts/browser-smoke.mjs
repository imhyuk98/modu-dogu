const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const targets = await fetch(`${debuggerUrl}/json`).then((response) => response.json());
const target = targets.find((candidate) => candidate.type === "page" && candidate.url.startsWith(baseUrl));
if (!target) throw new Error(`No Chrome page found for ${baseUrl}`);

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
  const { resolve, reject } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) reject(new Error(message.error.message));
  else resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const response = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const navigate = async (url) => {
  await send("Page.navigate", { url });
  await wait(900);
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

await navigate(`${baseUrl}/`);
const home = await evaluate(`({
  title: document.title,
  heading: document.querySelector("h1")?.textContent?.trim(),
  viewport: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  navLinks: document.querySelectorAll("header a").length
})`);

await navigate(`${baseUrl}/tools/telepathy-game.html`);
await evaluate(`(() => {
  Object.defineProperty(navigator, "share", { configurable: true, value: async (data) => { window.__smokeShared = data; } });
  const inputs = [...document.querySelectorAll("section input")];
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  inputs.forEach((input, index) => {
    setter.call(input, index < 2 ? (index === 0 ? "코덱스" : "친구") : "같은답");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
})()`);
await wait(100);
await evaluate(`[...document.querySelectorAll("button")].find((button) => button.textContent.includes("초대 링크 만들기"))?.click()`);
await wait(250);
const created = await evaluate(`({
  ready: document.body.textContent.includes("초대 링크가 준비됐어요"),
  viewport: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  createButtonDisabled: [...document.querySelectorAll("button")].find((button) => button.textContent.includes("초대 링크 만들기"))?.disabled
})`);
await evaluate(`[...document.querySelectorAll("button")].find((button) => button.textContent.includes("카카오톡·앱 공유"))?.click()`);
await wait(150);
const inviteUrl = await evaluate(`window.__smokeShared?.url`);
if (!inviteUrl) throw new Error("Invite URL was not created or shared");

await navigate(inviteUrl);
await evaluate(`(() => {
  const inputs = [...document.querySelectorAll("section input")];
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  inputs.forEach((input) => {
    setter.call(input, "같은답");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
})()`);
await wait(100);
await evaluate(`[...document.querySelectorAll("button")].find((button) => button.textContent.includes("답 비교하기"))?.click()`);
await wait(250);
const challenge = await evaluate(`({
  received: document.body.textContent.includes("텔레파시 도착"),
  score: [...document.querySelectorAll("strong")].find((element) => element.textContent.includes("100%"))?.textContent,
  resultUrl: [...document.querySelectorAll("a")].find((anchor) => anchor.textContent.includes("전체 결과 보기"))?.href,
  scrollWidth: document.documentElement.scrollWidth
})`);
if (!challenge.resultUrl) throw new Error(`Result URL was not created: ${JSON.stringify({ home, created, challenge })}`);

await navigate(challenge.resultUrl);
const result = await evaluate(`({
  title: document.title,
  heading: document.querySelector("h1")?.textContent?.trim(),
  hasAnswers: document.body.textContent.includes("답변 비교"),
  score: [...document.querySelectorAll("p")].find((element) => element.textContent.trim() === "100%")?.textContent,
  scrollWidth: document.documentElement.scrollWidth
})`);

await evaluate(`localStorage.removeItem("daily-return:daily-fortune")`);
await navigate(`${baseUrl}/calculators/daily-fortune.html`);
await evaluate(`(() => {
  [...document.querySelectorAll("button")].find((button) => button.textContent.includes("쥐"))?.click();
})()`);
await wait(900);
const fortune = await evaluate(`({
  completed: document.body.textContent.includes("오늘의 운세 기록 완료"),
  streak: JSON.parse(localStorage.getItem("daily-return:daily-fortune") || "[]").length,
  resultVisible: document.body.textContent.includes("오늘의 한마디"),
  scrollWidth: document.documentElement.scrollWidth
})`);

socket.close();
console.log(JSON.stringify({ home, created, challenge, result, fortune }, null, 2));
