import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename, dirname, extname, join, normalize } from "node:path";

const configuredBaseUrl = process.env.BROWSER_QA_BASE_URL;
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const width = Number(process.env.BROWSER_QA_WIDTH ?? 390);
const height = Number(process.env.BROWSER_QA_HEIGHT ?? 844);
const browserQaDate = process.env.BROWSER_QA_DATE;
const entryRoute = process.env.BROWSER_QA_ENTRY ?? "/";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
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
let baseUrl = configuredBaseUrl;
if (!baseUrl) {
  const outputRoot = join(process.cwd(), "out");
  const browserBlockedPorts = new Set([6000, 6566, 6665, 6666, 6667, 6668, 6669, 6697, 10080]);
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
  let address = null;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await new Promise((resolve, reject) => {
      localServer.once("error", reject);
      localServer.listen(0, "127.0.0.1", resolve);
    });
    address = localServer.address();
    if (address && typeof address !== "string" && !browserBlockedPorts.has(address.port)) break;
    await new Promise((resolve, reject) => {
      localServer.close((error) => error ? reject(error) : resolve());
    });
  }
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
let routeErrors = [];
let routeNetworkErrors = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    routeErrors.push(
      message.params.exceptionDetails.exception?.description ??
      message.params.exceptionDetails.text ??
      "Runtime exception",
    );
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    routeErrors.push(
      message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "),
    );
  }
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
    routeErrors.push(message.params.entry.text);
  }
  if (message.method === "Network.responseReceived" && message.params.response.status >= 400) {
    routeNetworkErrors.push(`${message.params.response.status} ${message.params.response.url}`);
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

async function waitForDocument() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if (await evaluate(`document.readyState === "complete"`)) {
        await wait(80);
        return;
      }
    } catch {
      // Navigation can temporarily invalidate the JavaScript execution context.
    }
    await wait(25);
  }
  throw new Error("Timed out waiting for document");
}

async function navigate(url) {
  routeErrors = [];
  routeNetworkErrors = [];
  const response = await send("Page.navigate", { url });
  if (response.errorText) throw new Error(response.errorText);
  await waitForDocument();
}

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: false });
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width < 700,
});
if (browserQaDate) {
  const fixedTime = new Date(`${browserQaDate}T12:00:00+09:00`).getTime();
  if (!Number.isFinite(fixedTime)) throw new Error(`Invalid BROWSER_QA_DATE: ${browserQaDate}`);
  await send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      const NativeDate = Date;
      const fixedTime = ${fixedTime};
      class FixedDate extends NativeDate {
        constructor(...args) { super(...(args.length ? args : [fixedTime])); }
        static now() { return fixedTime; }
      }
      FixedDate.parse = NativeDate.parse;
      FixedDate.UTC = NativeDate.UTC;
      Object.setPrototypeOf(FixedDate, NativeDate);
      globalThis.Date = FixedDate;
    })();`,
  });
}

await navigate(new URL(entryRoute, baseUrl).href);
const allHrefs = await evaluate(`[
  ...new Set([...document.querySelectorAll("a.store-tool-card")].map((anchor) => anchor.getAttribute("href")))
]`);
const requestedRoute = process.env.BROWSER_QA_ROUTE;
const hrefs = requestedRoute
  ? allHrefs.filter((href) => href === requestedRoute)
  : allHrefs;

const failures = [];
let interactiveRoutes = 0;
for (const [index, href] of hrefs.entries()) {
  const exportPath = href === "/" ? "/" : href.replace(/\/$/, "");
  try {
    await navigate(new URL(exportPath, baseUrl).href);
    const inspection = await evaluate(`(() => ({
      title: document.title.trim(),
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      viewport: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      controls: document.querySelectorAll("button, input, select, textarea, canvas").length,
      imagesWithoutAlt: document.querySelectorAll("img:not([alt])").length,
      unnamedButtons: [...document.querySelectorAll("button")].filter((element) =>
        !element.textContent?.trim() && !element.getAttribute("aria-label") && !element.getAttribute("title")
      ).length,
      unnamedLinks: [...document.querySelectorAll("a[href]")].filter((element) =>
        !element.textContent?.trim() && !element.getAttribute("aria-label") && !element.getAttribute("title") &&
        ![...element.querySelectorAll("img[alt]")].some((image) => image.getAttribute("alt")?.trim())
      ).length,
      unnamedFields: [...document.querySelectorAll("input:not([type='hidden']):not([type='button']):not([type='submit']), select, textarea")].filter((element) =>
        element.getClientRects().length > 0 && !element.labels?.length && !element.getAttribute("aria-label") && !element.getAttribute("aria-labelledby") && !element.getAttribute("title") && !element.getAttribute("placeholder")
      ).length,
      unnamedFieldSamples: [...document.querySelectorAll("input:not([type='hidden']):not([type='button']):not([type='submit']), select, textarea")].filter((element) =>
        element.getClientRects().length > 0 && !element.labels?.length && !element.getAttribute("aria-label") && !element.getAttribute("aria-labelledby") && !element.getAttribute("title") && !element.getAttribute("placeholder")
      ).slice(0, 3).map((element) => element.outerHTML.slice(0, 240)),
      duplicateIds: [...document.querySelectorAll("[id]")].map((element) => element.id)
        .filter((id, index, ids) => id && ids.indexOf(id) !== index).length,
      looksLike404: /404|페이지를 찾을 수 없/i.test(document.body.innerText.slice(0, 500)),
    }))()`);
    if (inspection.controls > 0) interactiveRoutes += 1;
    const reasons = [];
    if (!inspection.title) reasons.push("missing document title");
    if (!inspection.h1) reasons.push("missing h1");
    if (inspection.looksLike404) reasons.push("rendered 404 content");
    if (inspection.scrollWidth > inspection.viewport + 1) {
      reasons.push(`horizontal overflow ${inspection.scrollWidth}px > ${inspection.viewport}px`);
    }
    if (inspection.imagesWithoutAlt > 0) reasons.push(`${inspection.imagesWithoutAlt} images missing alt`);
    if (inspection.unnamedButtons > 0) reasons.push(`${inspection.unnamedButtons} unnamed buttons`);
    if (inspection.unnamedLinks > 0) reasons.push(`${inspection.unnamedLinks} unnamed links`);
    if (inspection.unnamedFields > 0) {
      reasons.push(`${inspection.unnamedFields} form fields without an accessible hint: ${inspection.unnamedFieldSamples.join(" || ")}`);
    }
    if (inspection.duplicateIds > 0) reasons.push(`${inspection.duplicateIds} duplicate ids`);
    if (routeErrors.length > 0) reasons.push(`browser errors: ${routeErrors.join(" | ")}`);
    if (routeNetworkErrors.length > 0) {
      reasons.push(`failed requests: ${[...new Set(routeNetworkErrors)].join(" | ")}`);
    }
    if (reasons.length > 0) failures.push({ href, reasons });
  } catch (error) {
    failures.push({ href, reasons: [error instanceof Error ? error.message : String(error)] });
  }

  if (process.env.QA_PROGRESS && (index + 1) % 20 === 0) {
    console.error(`Browser-audited ${index + 1}/${hrefs.length} routes`);
  }
}

socket.close();
if (localServer) {
  await new Promise((resolve, reject) => {
    localServer.close((error) => error ? reject(error) : resolve());
  });
}

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    width,
    browserQaDate: browserQaDate ?? "system",
    routes: hrefs.length,
    interactiveRoutes,
    browserErrors: 0,
    missingTitles: 0,
    missingHeadings: 0,
    horizontalOverflows: 0,
  }, null, 2));
}
