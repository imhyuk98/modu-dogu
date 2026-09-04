import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.MOBILE_QA_BASE_URL ?? "http://127.0.0.1:3000";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const outputDir = process.env.MOBILE_QA_SCREEN_DIR ?? process.env.TEMP ?? ".";

mkdirSync(outputDir, { recursive: true });

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
const browserErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);

  if (message.method === "Runtime.exceptionThrown") {
    browserErrors.push(message.params.exceptionDetails.text ?? "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    browserErrors.push(
      message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "),
    );
  }
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
    browserErrors.push(
      [message.params.entry.text, message.params.entry.url].filter(Boolean).join(" · "),
    );
  }

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
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function navigate(url, width, height = 800) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await send("Page.navigate", { url });
  await wait(1100);
}

async function capture(name) {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  const path = join(outputDir, name);
  writeFileSync(path, Buffer.from(result.data, "base64"));
  return path;
}

async function runAtWidth(width) {
  browserErrors.length = 0;
  await navigate(baseUrl, width);

  const layout = await evaluate(`(() => {
    const descriptions = [...document.querySelectorAll(".store-tool-info small")];
    const menuButton = document.querySelector(".site-menu-button")?.getBoundingClientRect();
    const tabs = [...document.querySelectorAll(".home-category-tab")];
    return {
      path: location.pathname,
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      cards: document.querySelectorAll(".store-tool-card").length,
      columns: getComputedStyle(document.querySelector(".store-tool-grid")).gridTemplateColumns.split(" ").length,
      clippedDescriptions: descriptions.filter((node) => node.scrollHeight > node.clientHeight + 1).length,
      menuButton: menuButton ? { width: Math.round(menuButton.width), height: Math.round(menuButton.height) } : null,
      shortestTabHeight: Math.round(Math.min(...tabs.map((tab) => tab.getBoundingClientRect().height))),
    };
  })()`);

  await evaluate(`document.querySelector(".site-menu-button")?.click()`);
  await wait(120);
  const menu = await evaluate(`(() => {
    const node = document.querySelector(".site-mobile-menu");
    const rect = node?.getBoundingClientRect();
    return {
      visible: Boolean(node && getComputedStyle(node).display !== "none"),
      links: node?.querySelectorAll("a").length ?? 0,
      insideViewport: Boolean(rect && rect.left >= 0 && rect.right <= innerWidth),
    };
  })()`);
  await evaluate(`document.querySelector(".site-menu-button")?.click()`);

  await evaluate(`(() => {
    const input = document.querySelector("#home-tool-search");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "연봉");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);
  await wait(180);
  const search = await evaluate(`({
    value: document.querySelector("#home-tool-search")?.value,
    results: document.querySelectorAll(".home-search-result").length,
    firstResult: document.querySelector(".home-search-result strong")?.textContent?.trim(),
    visibleCards: document.querySelectorAll(".store-tool-card").length,
  })`);
  await evaluate(`document.querySelector(".home-search-clear")?.click()`);
  await wait(120);

  await evaluate(`(() => {
    [...document.querySelectorAll(".home-category-tab")]
      .find((button) => button.querySelector("span")?.textContent === "금융")?.click();
  })()`);
  await wait(150);
  const filter = await evaluate(`({
    selected: document.querySelector('.home-category-tab[aria-selected="true"]')?.textContent?.trim(),
    sections: document.querySelectorAll(".store-tool-section").length,
    cards: document.querySelectorAll(".store-tool-card").length,
  })`);

  await evaluate(`document.querySelector(".store-tool-section")?.scrollIntoView()`);
  await wait(100);
  const screenshot = await capture(`modu-dogu-mobile-qa-${width}.png`);

  browserErrors.length = 0;
  await evaluate(`document.querySelector('a[href="/calculators/salary"]')?.click()`);
  await wait(900);
  const initialResult = await evaluate(`document.querySelector(".calc-result-header")?.innerText`);
  await evaluate(`(() => {
    const input = document.querySelector(".calc-input");
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, "55,000,000");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  })()`);
  await wait(120);
  const calculator = await evaluate(`(() => ({
    path: location.pathname,
    title: document.querySelector("h1")?.textContent?.trim(),
    scrollWidth: document.documentElement.scrollWidth,
    inputs: document.querySelectorAll("input, select").length,
    buttons: document.querySelectorAll("button").length,
    inputValue: document.querySelector(".calc-input")?.value,
    resultUpdated: document.querySelector(".calc-result-header")?.innerText !== ${JSON.stringify(initialResult)},
  }))()`);
  const calculatorScreenshot = await capture(`modu-dogu-salary-mobile-${width}.png`);

  return {
    layout,
    menu,
    search,
    filter,
    calculator,
    browserErrors: [...browserErrors],
    screenshot,
    calculatorScreenshot,
  };
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });

const results = {};
for (const width of [360, 390, 412]) {
  results[width] = await runAtWidth(width);
}

socket.close();
console.log(JSON.stringify(results, null, 2));
