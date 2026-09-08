import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';

const vars = parseEnv(readFileSync(new URL('./.dev.vars', import.meta.url), 'utf8'));
const base = 'http://127.0.0.1:8788';
const authorization = `Basic ${Buffer.from(`${vars.ADMIN_USER}:${vars.ADMIN_PASSWORD}`).toString('base64')}`;
assert.equal((await fetch(`${base}/api/report`)).status, 401);
const debug = 'http://127.0.0.1:9224';
const tab = await fetch(`${debug}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let id = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (pending.has(message.id)) { pending.get(message.id)(message.result); pending.delete(message.id); }
});
const send = (method, params = {}) => new Promise(resolve => { const next = ++id; pending.set(next, resolve); socket.send(JSON.stringify({ id: next, method, params })); });
const evaluate = async expression => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;
try {
  await send('Network.enable');
  await send('Network.setExtraHTTPHeaders', { headers: { Authorization: authorization } });
  await send('Page.navigate', { url: base });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    ready = await evaluate(`!!document.querySelector('#social-table')?.textContent && !document.querySelector('#reports').hidden`);
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Authenticated real report rendered');
  assert.ok(await evaluate(`document.querySelector('#social-analysis').textContent.includes('전송·게시 성공이 아니며')`));
  assert.equal(await evaluate(`document.querySelector('#setup').hidden`), true, 'Not example data');
  await evaluate(`document.querySelector('#portal-filter').dispatchEvent(new Event('change'))`);
  assert.ok(await evaluate(`document.querySelector('#social-table').textContent.length > 0`));
  console.log('PASS authenticated dashboard: real report, sharing panel, filters, unauthenticated 401');
} finally {
  socket.close();
  await fetch(`${debug}/json/close/${tab.id}`);
}
