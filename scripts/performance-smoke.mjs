import assert from "node:assert/strict";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { basename, dirname, extname, join, normalize } from "node:path";
import { createGzip } from "node:zlib";

let baseUrl = process.env.PERFORMANCE_QA_BASE_URL;
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? "http://127.0.0.1:9224";
const paths = ["/", "/calculators/salary"];

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
    const extension = extname(selected);
    const compressible = [".css", ".html", ".js", ".json", ".svg"].includes(extension);
    response.writeHead(200, {
      "cache-control": "no-store",
      "content-type": mimeTypes[extension] ?? "application/octet-stream",
      ...(compressible ? { "content-encoding": "gzip", vary: "Accept-Encoding" } : {}),
    });
    const stream = createReadStream(selected);
    if (compressible) stream.pipe(createGzip()).pipe(response);
    else stream.pipe(response);
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
const pageErrors = [];
let loadResolver = null;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.method === "Runtime.exceptionThrown") {
    pageErrors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
  }
  if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
    pageErrors.push(message.params.args.map((argument) => argument.value ?? argument.description ?? "").join(" "));
  }
  if (message.method === "Page.loadEventFired" && loadResolver) {
    loadResolver();
    loadResolver = null;
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

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Performance.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Network.clearBrowserCache");
await send("Emulation.setDeviceMetricsOverride", {
  width: 390,
  height: 844,
  deviceScaleFactor: 1,
  mobile: true,
});
await send("Emulation.setCPUThrottlingRate", { rate: 4 });
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 150,
  downloadThroughput: 200 * 1024,
  uploadThroughput: 95 * 1024,
  connectionType: "cellular4g",
});
await send("Page.addScriptToEvaluateOnNewDocument", {
  source: `(() => {
    globalThis.__moduDoguVitals = { lcp: 0, cls: 0, blockingTime: 0 };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries.at(-1);
      if (last) globalThis.__moduDoguVitals.lcp = last.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) globalThis.__moduDoguVitals.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        globalThis.__moduDoguVitals.blockingTime += Math.max(0, entry.duration - 50);
      }
    }).observe({ type: "longtask", buffered: true });
  })();`,
});

const results = [];
for (const [index, path] of paths.entries()) {
  pageErrors.length = 0;
  await send("Network.clearBrowserCache");
  await send("Performance.disable");
  await send("Performance.enable");
  const loaded = new Promise((resolve) => {
    loadResolver = resolve;
  });
  const navigation = await send("Page.navigate", { url: `${baseUrl}${path}?performance-qa=${Date.now()}-${index}` });
  if (navigation.errorText) throw new Error(navigation.errorText);
  await Promise.race([
    loaded,
    wait(10_000).then(() => { throw new Error(`${path}: load event timed out`); }),
  ]);
  await wait(3_000);
  const metrics = await evaluate(`(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
    const resources = performance.getEntriesByType("resource");
    return {
      path: location.pathname,
      title: document.title,
      heading: document.querySelector("h1")?.textContent?.trim() ?? "",
      visibility: document.visibilityState,
      firstContentfulPaintMs: fcp ? Math.round(fcp) : null,
      largestContentfulPaintMs: globalThis.__moduDoguVitals?.lcp
        ? Math.round(globalThis.__moduDoguVitals.lcp)
        : null,
      cumulativeLayoutShift: Number((globalThis.__moduDoguVitals?.cls ?? 0).toFixed(4)),
      totalBlockingTimeMs: Math.round(globalThis.__moduDoguVitals?.blockingTime ?? 0),
      domContentLoadedMs: Math.round(navigation?.domContentLoadedEventEnd ?? 0),
      loadMs: Math.round(navigation?.loadEventEnd ?? 0),
      resources: resources.length,
      transferredKb: Math.round(resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0) / 1024),
    };
  })()`);
  const cdpMetricResponse = await send("Performance.getMetrics");
  const cdpMetrics = Object.fromEntries(
    cdpMetricResponse.metrics.map((metric) => [metric.name, metric.value]),
  );
  const navigationStart = cdpMetrics.NavigationStart ?? 0;
  const domContentLoaded = cdpMetrics.DomContentLoaded ?? 0;
  metrics.cdpDomContentLoadedMs = navigationStart && domContentLoaded
    ? Math.round((domContentLoaded - navigationStart) * 1_000)
    : null;
  metrics.scriptDurationMs = Math.round((cdpMetrics.ScriptDuration ?? 0) * 1_000);
  metrics.taskDurationMs = Math.round((cdpMetrics.TaskDuration ?? 0) * 1_000);

  results.push({ ...metrics, browserErrors: [...pageErrors] });
}

await send("Emulation.setCPUThrottlingRate", { rate: 1 });
await send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 0,
  downloadThroughput: -1,
  uploadThroughput: -1,
  connectionType: "none",
});
socket.close();
if (localServer) {
  await new Promise((resolve, reject) => {
    localServer.close((error) => error ? reject(error) : resolve());
  });
}

console.log(JSON.stringify({ profile: "mobile 4x CPU / throttled 4G", results }, null, 2));

for (const metrics of results) {
  assert.ok(metrics.title, `${metrics.path}: missing title`);
  assert.ok(metrics.heading, `${metrics.path}: missing h1`);
  if (metrics.firstContentfulPaintMs !== null) {
    assert.ok(metrics.firstContentfulPaintMs <= 1_800, `${metrics.path}: FCP exceeded 1.8s`);
  }
  if (metrics.largestContentfulPaintMs !== null) {
    assert.ok(metrics.largestContentfulPaintMs <= 2_500, `${metrics.path}: LCP exceeded 2.5s`);
  }
  assert.ok(metrics.cdpDomContentLoadedMs !== null, `${metrics.path}: DOMContentLoaded was not captured`);
  assert.ok(metrics.cdpDomContentLoadedMs <= 2_500, `${metrics.path}: DOMContentLoaded exceeded 2.5s`);
  assert.ok(metrics.cumulativeLayoutShift <= 0.1, `${metrics.path}: CLS exceeded 0.1`);
  assert.ok(metrics.totalBlockingTimeMs <= 200, `${metrics.path}: blocking time exceeded 200ms`);
  assert.deepEqual(metrics.browserErrors, [], `${metrics.path}: browser errors\n${metrics.browserErrors.join("\n")}`);
}
