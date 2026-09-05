import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename, dirname, extname, join, normalize } from "node:path";

let baseUrl = process.env.CRITICAL_QA_BASE_URL;
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function decodeNextDataPath(pathname) {
  const filename = basename(pathname);
  if (!filename.startsWith("__next.")) return null;
  const parts = filename.split(".");
  if (parts.length <= 3) return null;
  const prefix = `${parts[0]}.${parts[1]}`;
  const extension = parts.at(-1);
  const segments = parts.slice(2, -1);
  return join(dirname(pathname), prefix, ...segments.slice(0, -1), `${segments.at(-1)}.${extension}`);
}

let localServer = null;
if (!baseUrl) {
  const outputRoot = join(process.cwd(), "out");
  localServer = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const relativePath = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    const normalizedPath = normalize(relativePath);
    const nestedPageDataPath = decodeNextDataPath(normalizedPath);
    const candidates = extname(normalizedPath)
      ? [normalizedPath, nestedPageDataPath].filter(Boolean)
      : [`${normalizedPath}.html`, join(normalizedPath, "index.html")];
    const selected = candidates
      .map((candidate) => join(outputRoot, candidate))
      .find((candidate) => candidate.startsWith(outputRoot) && existsSync(candidate) && statSync(candidate).isFile());
    if (!selected) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": mimeTypes[extname(selected)] ?? "application/octet-stream",
    });
    createReadStream(selected).pipe(response);
  });
  await new Promise((resolve, reject) => {
    localServer.once("error", reject);
    localServer.listen(0, "127.0.0.1", resolve);
  });
  const address = localServer.address();
  if (!address || typeof address === "string") throw new Error("Could not start QA server");
  baseUrl = `http://127.0.0.1:${address.port}`;
}

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
const runtimeErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    runtimeErrors.push(message.params.exceptionDetails.text ?? "Runtime exception");
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    runtimeErrors.push(
      message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "),
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

async function navigate(pathname) {
  runtimeErrors.length = 0;
  await send("Page.navigate", { url: `${baseUrl}${pathname}` });
  await wait(900);
  const loadedPath = await evaluate("location.pathname");
  assert.equal(loadedPath.replace(/\/$/, ""), pathname, `navigation failed for ${pathname}`);
}

async function clickButton(label) {
  const clicked = await evaluate(`(() => {
    const button = [...document.querySelectorAll("button")].find(
      (candidate) => candidate.textContent?.replace(/\\s+/g, " ").trim() === ${JSON.stringify(label)},
    );
    if (!button) return false;
    button.click();
    return true;
  })()`);
  assert.ok(clicked, `button not found: ${label}`);
  await wait(100);
}

async function setInput(index, value) {
  const changed = await evaluate(`(() => {
    const input = document.querySelectorAll("input")[${index}];
    if (!input) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    setter.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`);
  assert.ok(changed, `input not found at index ${index}`);
  await wait(120);
}

async function setTextarea(value) {
  const changed = await evaluate(`(() => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    setter.call(textarea, ${JSON.stringify(value)});
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`);
  assert.ok(changed, "textarea not found");
  await wait(150);
}

async function setCheckbox(checked) {
  const changed = await evaluate(`(() => {
    const input = document.querySelector('input[type="checkbox"]');
    if (!input) return false;
    if (input.checked !== ${checked}) input.click();
    return true;
  })()`);
  assert.ok(changed, "checkbox not found");
  await wait(100);
}

async function setSelect(label, value) {
  const changed = await evaluate(`(() => {
    const select = [...document.querySelectorAll("select")].find(
      (candidate) => candidate.getAttribute("aria-label") === ${JSON.stringify(label)},
    );
    if (!select) return false;
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
    setter.call(select, ${JSON.stringify(value)});
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  })()`);
  assert.ok(changed, `select not found: ${label}`);
  await wait(120);
}

async function resultText() {
  return evaluate(`document.querySelector(".text-3xl.font-bold")?.textContent?.replace(/\\s+/g, " ").trim() ?? ""`);
}

async function expectResult(expected, label) {
  assert.equal(await resultText(), expected, label);
  assert.deepEqual(runtimeErrors, [], `${label}: browser errors\n${runtimeErrors.join("\n")}`);
}

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});

await navigate("/calculators/brokerage-fee");
await clickButton("월세");
await setInput(0, "10000000");
await setInput(1, "300000");
await expectResult("170,500원", "low-value monthly-rent conversion");

await navigate("/calculators/acquisition-tax");
await clickButton("4주택 이상");
await setInput(1, "100");
await expectResult("67,000,000원", "four-home acquisition surtaxes");

await navigate("/calculators/capital-gains-tax");
await clickButton("비과세 요건 충족 1세대 1주택");
await expectResult("0원", "one-home exemption below 1.2 billion won");
await setInput(1, "1500000000");
await expectResult("37,031,500원", "one-home high-price prorating");

await navigate("/calculators/gift-tax");
await setInput(0, "150000000");
await setCheckbox(true);
await expectResult("0원", "marriage and birth gift deduction");
await setCheckbox(false);
await expectResult("9,700,000원", "ordinary gift deduction");

await navigate("/calculators/stock-return");
await expectResult("+487,425원", "2026 securities transaction tax");

await navigate("/calculators/electricity");
await clickButton("동계 (12~2월)");
await setInput(0, "1100");
await expectResult("391,760원", "winter super-user electricity tariff");

await navigate("/calculators/gas-bill");
await expectResult("34,100원", "user-supplied gas bill rate");

await navigate("/calculators/rent-conversion");
await expectResult("1,041,667원 / 월", "current rent conversion default");

await navigate("/calculators/car-tax");
await clickButton("승용차 (영업)");
await setInput(0, "2500");
await setSelect("최초등록연도", "2014");
await expectResult("47,500원", "business car threshold without age reduction or education tax");
assert.match(await evaluate("document.body.innerText"), /연납 할인액\s*-2,177원/, "January prepayment discount");

await navigate("/calculators/lotto-tax");
await setInput(0, "50000000");
await expectResult("39,000,000원", "lottery minimum-tax threshold is not a deduction");

await navigate("/calculators/housing-subscription");
await setSelect("배우자 청약통장 가입기간", "3");
assert.equal(
  await evaluate('document.querySelector(".text-5xl.font-bold")?.textContent?.trim()'),
  "9",
  "spouse subscription-account score",
);
assert.deepEqual(runtimeErrors, [], `housing subscription: browser errors\n${runtimeErrors.join("\n")}`);

await navigate("/tools/markdown-html");
await evaluate("window.__markdownXssProbe = 0");
await setTextarea('<img src=/x onerror="window.__markdownXssProbe=42">\n[x](javascript:window.__markdownXssProbe=43)');
const markdownSecurity = await evaluate(`(() => {
  const preview = document.querySelector(".prose-preview");
  return {
    executed: window.__markdownXssProbe,
    images: preview?.querySelectorAll("img").length ?? -1,
    links: preview?.querySelectorAll("a").length ?? -1,
    text: preview?.textContent ?? "",
  };
})()`);
assert.equal(markdownSecurity.executed, 0, "Markdown preview executed user HTML");
assert.equal(markdownSecurity.images, 0, "raw Markdown HTML created an image element");
assert.equal(markdownSecurity.links, 0, "unsafe Markdown URL created a link");
assert.match(markdownSecurity.text, /<img/, "raw Markdown HTML was not preserved as inert text");

await navigate("/calculators/alcohol");
const alcoholSafety = await evaluate("document.body.innerText");
assert.doesNotMatch(alcoholSafety, /운전 가능 여부\s*(가능|불가)|완전 분해 예상 시간|운전 가능\)/, "alcohol calculator gives an actionable driving decision");
assert.match(alcoholSafety, /이 계산 결과로 운전 가능 여부나 안전한 운전 시간을 판단할 수 없습니다/, "alcohol safety warning is missing");

await navigate("/calculators/scientific");
for (const label of ["2", "+", "3", "×", "4", "="]) await clickButton(label);
assert.equal(
  await evaluate('document.querySelector(".font-mono.font-bold.break-all")?.textContent?.trim()'),
  "14",
  "scientific calculator arithmetic parser",
);
for (const label of ["AC", "2", "xⁿ", "3", "xⁿ", "2", "="]) await clickButton(label);
assert.equal(
  await evaluate('document.querySelector(".font-mono.font-bold.break-all")?.textContent?.trim()'),
  "512",
  "scientific calculator right-associative exponentiation",
);
for (const label of ["AC", "sin", "3", "0", "( )", "="]) await clickButton(label);
assert.equal(
  await evaluate('document.querySelector(".font-mono.font-bold.break-all")?.textContent?.trim()'),
  "0.5",
  "scientific calculator function parsing",
);

await navigate("/tools/image-converter");
await evaluate(`(() => {
  const input = document.querySelector('input[type="file"]');
  const transfer = new DataTransfer();
  transfer.items.add(new File([new Uint8Array(15 * 1024 * 1024 + 1)], "too-large.png", { type: "image/png" }));
  Object.defineProperty(input, "files", { configurable: true, value: transfer.files });
  input.dispatchEvent(new Event("change", { bubbles: true }));
})()`);
await wait(150);
assert.match(await evaluate('document.querySelector("[role=alert]")?.textContent ?? ""'), /15MB/, "oversized image was not rejected");
assert.doesNotMatch(await evaluate("document.body.innerText"), /업로드된 이미지 \(1개\)/, "oversized image reached the converter");

socket.close();
if (localServer) {
  await new Promise((resolve, reject) => {
    localServer.close((error) => error ? reject(error) : resolve());
  });
}
console.log("Critical calculator and security browser checks passed (15 scenarios).");
