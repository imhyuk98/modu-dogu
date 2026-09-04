import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const baseUrl = process.env.STOREFRONT_BASE_URL ?? "http://127.0.0.1:4177";
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const outputDir = process.env.STOREFRONT_SCREEN_DIR ?? process.env.TEMP ?? ".";

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
  const response = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function navigate(width, height) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width < 700,
  });
  await send("Page.navigate", { url: baseUrl });
  await wait(1400);
}

async function capture(name) {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
  const path = join(outputDir, name);
  writeFileSync(path, Buffer.from(result.data, "base64"));
  return path;
}

async function inspect() {
  return evaluate(`(() => {
    const grid = document.querySelector(".store-tool-grid");
    const firstCard = document.querySelector(".store-tool-card");
    const heroTitle = document.querySelector(".store-hero h1");
    const descriptions = [...document.querySelectorAll(".store-tool-info small")];
    const heroRect = heroTitle?.getBoundingClientRect();
    return {
      title: heroTitle?.textContent?.trim(),
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      heroLeft: heroRect ? Math.round(heroRect.left) : 0,
      heroRight: heroRect ? Math.round(heroRect.right) : 0,
      heroScrollWidth: heroTitle?.scrollWidth ?? 0,
      heroClientWidth: heroTitle?.clientWidth ?? 0,
      showcaseCards: document.querySelectorAll(".store-showcase-card").length,
      toolCards: document.querySelectorAll(".store-tool-card").length,
      categoryTabs: document.querySelectorAll(".home-category-tab").length,
      gridColumns: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0,
      firstCardWidth: firstCard ? Math.round(firstCard.getBoundingClientRect().width) : 0,
      clippedDescriptions: descriptions.filter(
        (description) => description.scrollHeight > description.clientHeight + 1,
      ).length,
    };
  })()`);
}

await send("Page.enable");
await send("Runtime.enable");

await navigate(1440, 1000);
const desktopTop = await inspect();
await evaluate(`document.querySelector(".store-tool-section")?.scrollIntoView()`);
await wait(250);
const desktopCatalog = await inspect();
const desktopScreenshot = await capture("modu-dogu-catalog-desktop.png");

await navigate(390, 844);
const mobileTop = await inspect();
const mobileTopScreenshot = await capture("modu-dogu-top-mobile.png");
await evaluate(`document.querySelector(".store-tool-section")?.scrollIntoView()`);
await wait(250);
const mobileCatalog = await inspect();
const mobileScreenshot = await capture("modu-dogu-catalog-mobile.png");

await evaluate(`(() => {
  [...document.querySelectorAll(".home-category-tab")]
    .find((button) => button.querySelector("span")?.textContent === "잠깐 게임")?.click();
})()`);
await wait(150);
const filter = await evaluate(`({
  sections: document.querySelectorAll(".store-tool-section").length,
  cards: document.querySelectorAll(".store-tool-card").length,
  selected: document.querySelector('.home-category-tab[aria-selected="true"]')?.textContent?.trim(),
})`);

socket.close();
console.log(JSON.stringify({
  desktopTop,
  desktopCatalog,
  mobileTop,
  mobileCatalog,
  filter,
  screenshots: [desktopScreenshot, mobileTopScreenshot, mobileScreenshot],
}, null, 2));
