// Isolated browser test of the built export. Exchange responses are synthetic;
// no production measurements or external exchange requests are sent.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve('out');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.json': 'application/json' };
const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = path === '/' ? 'index.html' : path.slice(1);
    const file = resolve(root, extname(relative) ? relative : `${relative}.html`);
    if (!file.startsWith(root + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream', 'cache-control': 'no-store' }).end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
let socket;
let context;
let send;
const errors = [];
try {
  const version = await fetch(`${process.env.CHROME_DEBUG_URL ?? 'http://127.0.0.1:9224'}/json/version`, { signal: AbortSignal.timeout(5000) }).then(r => r.json());
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
  let id = 0;
  const pending = new Map();
  const held = [];
  let mode = 'loading';
  send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 15000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
  const mock = (requestId, sessionId, url) => send('Fetch.fulfillRequest', {
    requestId, responseCode: mode === 'error' ? 503 : 200,
    responseHeaders: [{ name: 'content-type', value: 'application/json' }, { name: 'access-control-allow-origin', value: '*' }],
    body: Buffer.from(JSON.stringify({ date: url.includes('latest') ? '2026-09-09' : '2026-09-07', base: 'USD', rates: { KRW: 1400, JPY: 150, EUR: 0.9 } })).toString('base64'),
  }, sessionId);
  socket.addEventListener('message', async event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const item = pending.get(message.id); pending.delete(message.id); clearTimeout(item.timer);
      if (message.error) item.reject(new Error(message.error.message)); else item.resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
    if (message.method === 'Fetch.requestPaused') {
      const { requestId, request } = message.params;
      try {
        if (new URL(request.url).hostname === 'api.frankfurter.dev') {
          if (mode === 'loading') held.push([requestId, message.sessionId, request.url]);
          else await mock(requestId, message.sessionId, request.url);
        } else if (request.url.startsWith(origin + '/')) await send('Fetch.continueRequest', { requestId }, message.sessionId);
        else await send('Fetch.fulfillRequest', { requestId, responseCode: 204 }, message.sessionId);
      } catch (error) { errors.push(error.message); }
    }
  });
  ({ browserContextId: context } = await send('Target.createBrowserContext', { disposeOnDetach: true }));
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId: context });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sessionId);
  await send('Fetch.enable', { patterns: [{ urlPattern: '*' }] }, sessionId);
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
  };
  const until = async expression => {
    for (let i = 0; i < 60; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 100)); }
    throw new Error(`Browser condition not met: ${expression}`);
  };
  await send('Page.navigate', { url: origin + '/calculators/exchange-rate' }, sessionId);
  await until('document.body?.textContent.includes("환율 계산기 사용법") && document.body?.textContent.includes("환율 데이터를 불러오는 중")');
  await until('document.readyState === "complete"');
  // Wait for hydration to issue both mocked requests before releasing them.
  for (let i = 0; held.length < 2 && i < 60; i++) await new Promise(resolve => setTimeout(resolve, 100));
  assert.equal(held.length, 2);
  assert.equal(await evaluate('Boolean(document.querySelector("#from-currency"))'), false);
  mode = 'success';
  await Promise.all(held.splice(0).map(args => mock(...args)));
  await until(`document.querySelector('input[aria-label="받는 금액"]')?.value === "1,400"`);
  await evaluate(`(() => { const input = document.querySelector('input[aria-label="보내는 금액"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '2'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await until(`document.querySelector('input[aria-label="받는 금액"]')?.value === "2,800"`);
  assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), 'Mobile horizontal overflow');
  assert.equal(await evaluate('document.querySelectorAll("h1").length'), 1);
  mode = 'error';
  await send('Page.navigate', { url: origin + '/calculators/exchange-rate?qa=error' }, sessionId);
  await until('Boolean(document.querySelector("[role=alert]"))');
  assert.ok(await evaluate('document.body.textContent.includes("환율 계산기 사용법") && document.body.textContent.includes("자주 묻는 질문")'));
  assert.equal(await evaluate('Boolean(document.querySelector("#from-currency"))'), false);
  assert.deepEqual(errors, []);
  console.log('PASS exchange initial loading, mocked conversion/input, mobile width, API failure guidance; isolated context, external requests intercepted.');
} finally {
  if (context && send) await send('Target.disposeBrowserContext', { browserContextId: context });
  socket?.close();
  server.closeAllConnections();
  await new Promise(resolve => server.close(resolve));
}
