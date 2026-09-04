const baseUrl = process.env.ENGLISH_QA_BASE_URL ?? "http://127.0.0.1:3000";
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
  const waiter = pending.get(message.id); pending.delete(message.id);
  if (message.error) waiter.reject(new Error(message.error.message)); else waiter.resolve(message.result);
});

function send(method, params = {}) {
  const id = ++requestId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(functionSource) {
  const result = await send("Runtime.evaluate", { expression: `(${functionSource})()`, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
  return result.result.value;
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function navigate(path) {
  browserErrors = [];
  await send("Page.navigate", { url: new URL(path, baseUrl).href });
  for (let attempt = 0; attempt < 80; attempt++) {
    try { if (await evaluate(`() => document.readyState === "complete"`)) break; } catch { /* navigation in progress */ }
    await wait(50);
  }
  await wait(180);
}

const tests = [
  {
    name: "home search and locale",
    path: "/en",
    run: `async () => {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const tab = [...document.querySelectorAll('.home-category-tab')].find((node) => node.textContent.includes('Calculators'));
      tab.click();
      const input = document.querySelector('#english-tool-search');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'JSON');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await wait(100);
      return {
        lang: document.documentElement.lang,
        cards: [...document.querySelectorAll('.store-tool-card strong')].map((node) => node.textContent.trim()),
        koreanHref: document.querySelector('a[hreflang="ko"]')?.getAttribute('href'),
      };
    }`,
    check: (value) => value.lang === "en" && value.koreanHref === "/" && value.cards.some((title) => title.includes("JSON")),
  },
  {
    name: "age calculation",
    path: "/en/calculators/age",
    run: `async () => {
      const input = document.querySelector('input[type="date"]');
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '2000-01-01');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 80));
      return document.body.innerText.includes('Exact age') && document.body.innerText.includes('Days lived');
    }`,
    check: Boolean,
  },
  {
    name: "password generation",
    path: "/en/tools/password-generator",
    run: `async () => {
      [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Generate password').click();
      await new Promise((resolve) => setTimeout(resolve, 60));
      return document.querySelector('section[aria-label$="controls"] .font-mono')?.textContent?.trim().length;
    }`,
    check: (value) => value === 18,
  },
  {
    name: "JSON formatting",
    path: "/en/tools/json-formatter",
    run: `async () => {
      [...document.querySelectorAll('button')].find((node) => node.textContent.includes('Format & validate')).click();
      await new Promise((resolve) => setTimeout(resolve, 60));
      return document.querySelectorAll('textarea')[1].value;
    }`,
    check: (value) => value.includes('\n  "hello": "world"'),
  },
  {
    name: "QR generation",
    path: "/en/tools/qr-code",
    run: `async () => {
      [...document.querySelectorAll('button')].find((node) => node.textContent.includes('Create QR code')).click();
      await new Promise((resolve) => setTimeout(resolve, 350));
      return { image: Boolean(document.querySelector('img[alt="Generated QR code"]')), download: document.querySelector('a[download="qr-code.png"]')?.href.startsWith('data:image/png') };
    }`,
    check: (value) => value.image && value.download,
  },
  {
    name: "image resize",
    path: "/en/tools/image-resize",
    run: `async () => {
      const response = await fetch('/og-image.png'); const blob = await response.blob();
      const file = new File([blob], 'sample.png', { type: 'image/png' }); const transfer = new DataTransfer(); transfer.items.add(file);
      const input = document.querySelector('input[type="file"]'); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 350));
      [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Resize image')?.click();
      await new Promise((resolve) => setTimeout(resolve, 700));
      return { dimensions: [...document.querySelectorAll('input[type="number"]')].map((node) => node.value), ready: document.body.innerText.includes('Ready:'), download: Boolean(document.querySelector('a[download^="resized-"]')) };
    }`,
    check: (value) => value.dimensions.length === 2 && value.ready && value.download,
  },
  {
    name: "image compression",
    path: "/en/tools/image-compress",
    run: `async () => {
      const response = await fetch('/og-image.png'); const blob = await response.blob();
      const file = new File([blob], 'sample.png', { type: 'image/png' }); const transfer = new DataTransfer(); transfer.items.add(file);
      const input = document.querySelector('input[type="file"]'); input.files = transfer.files; input.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 350));
      [...document.querySelectorAll('button')].find((node) => node.textContent.trim() === 'Compress image')?.click();
      await new Promise((resolve) => setTimeout(resolve, 700));
      return { result: document.body.innerText.includes('Result:'), download: Boolean(document.querySelector('a[download^="compressed-"]')) };
    }`,
    check: (value) => value.result && value.download,
  },
  {
    name: "name compatibility",
    path: "/en/calculators/name-compatibility",
    run: `async () => {
      const inputs = [...document.querySelectorAll('section[aria-label$="controls"] input')];
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inputs[0], 'Alex'); inputs[0].dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'Alex' }));
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(inputs[1], 'Jordan'); inputs[1].dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText', data: 'Jordan' }));
      await new Promise((resolve) => setTimeout(resolve, 100)); const button = [...document.querySelectorAll('button')].find((node) => node.textContent.includes('Check compatibility')); button.click();
      await new Promise((resolve) => setTimeout(resolve, 100)); const score = [...document.querySelectorAll('p')].map((node) => node.textContent.trim()).find((text) => text.endsWith('%') && Number.isFinite(Number.parseInt(text, 10))); return { values: inputs.map((input) => input.value), disabled: button.disabled, score };
    }`,
    check: (value) => Boolean(value.score),
  },
];

await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });

const results = [];
for (const test of tests) {
  try {
    await navigate(test.path);
    const value = await evaluate(test.run);
    results.push({ name: test.name, passed: test.check(value) && browserErrors.length === 0, value, browserErrors: [...browserErrors] });
  } catch (error) {
    results.push({ name: test.name, passed: false, error: error instanceof Error ? error.message : String(error), browserErrors: [...browserErrors] });
  }
}

socket.close();
const failures = results.filter((result) => !result.passed);
console.log(JSON.stringify({ tests: results.length, passed: results.length - failures.length, failed: failures.length, results }, null, 2));
if (failures.length) process.exitCode = 1;
