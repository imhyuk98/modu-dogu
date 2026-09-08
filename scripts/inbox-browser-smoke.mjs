import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';

const base = process.env.SOCIAL_QA_BASE_URL ?? 'http://127.0.0.1:3000';
const api = process.env.INBOX_QA_API ?? process.env.NEXT_PUBLIC_FRIEND_INBOX_API ?? 'http://127.0.0.1:8790';
const debug = process.env.CHROME_DEBUG_URL ?? 'http://127.0.0.1:9224';
const version = await fetch(`${debug}/json/version`).then(r => r.json());
const socket = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let sequence = 0;
const pending = new Map(), contexts = [], created = [], errors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (!pending.has(message.id)) return;
  const call = pending.get(message.id); pending.delete(message.id); clearTimeout(call.timer);
  if (message.error) call.reject(Error(message.error.message)); else call.resolve(message.result);
});
function send(method, params = {}, sessionId) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(Error(`CDP timeout: ${method}`)); }, 20000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  });
}
async function page() {
  const { browserContextId } = await send('Target.createBrowserContext'); contexts.push(browserContextId);
  const { targetId } = await send('Target.createTarget', { url: 'about:blank', browserContextId });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params = {}) => send(method, params, sessionId);
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const until = async expression => {
    for (let i = 0; i < 180; i++) { try { if (await evaluate(expression)) return; } catch { /* Navigation changes the JS context. */ } await new Promise(r => setTimeout(r, 100)); }
    throw Error(`Timeout: ${expression}`);
  };
  await call('Page.enable'); await call('Runtime.enable'); await call('Network.enable');
  await call('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*', '*doubleclick.net*', '*googleadservices.com*', '*googlesyndication.com*'] });
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `localStorage.setItem('modu:optional-consent:v1','granted');window.__events=[];window.gtag=(...args)=>window.__events.push(args);` });
  return { call, evaluate, until, async navigate(path) {
    const url = new URL(path, base).href;
    await call('Page.navigate', { url });
    await until(`location.href === ${JSON.stringify(url)} && document.readyState==='complete' && !!document.querySelector('main') && !document.body.innerText.includes('초대 정보를 확인하고') && !document.body.innerText.includes('내 결과함을 확인하고')`);
  } };
}
async function fill(p, name, choice = 0) {
  await p.until(`!!document.querySelector('input[placeholder="실명 대신 별명도 좋아요"]')`);
  await p.evaluate(`(() => {const input=document.querySelector('input[placeholder="실명 대신 별명도 좋아요"]');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(input,${JSON.stringify(name)});input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
  if (await p.evaluate(`document.querySelector('main button[type=submit]').textContent.includes('시작하기')`)) {
    await p.until(`!document.querySelector('main button[type=submit]').disabled`);
    await p.evaluate(`document.querySelector('main button[type=submit]').click()`);
    for (let step = 0; step < 10; step++) {
      if (!await p.evaluate(`!!document.querySelector('main input[type=radio]')`)) break;
      await p.evaluate(`document.querySelector('main input[type=radio][value="${choice}"]').click()`);
      await p.until(`document.querySelector('[data-quiz-step]').dataset.quizStep==='${step + 1}'`);
    }
  }
  assert.equal(await p.evaluate(`document.querySelector('main button[type=submit]').disabled`), true, 'Storage agreement is required');
  await p.evaluate(`document.querySelector('main input[type=checkbox]').click()`);
  await p.until(`!document.querySelector('main button[type=submit]').disabled`);
}
async function submit(p) { await p.evaluate(`document.querySelector('main button[type=submit]').click();document.querySelector('main button[type=submit]')?.click()`); }
async function captureOwner(p) {
  const privateUrl = await p.evaluate(`document.querySelector('input[aria-label="생성자 전용 결과함 주소"]').value`);
  const [, id, token] = new URL(privateUrl).hash.match(/^#([a-f0-9]{32})\.([a-f0-9]{64})$/);
  created.push({ id, token });
  return { privateUrl, id, token };
}

try {
  const owner = await page(), friend = await page(), other = await page();
  await owner.navigate('/tools/friendship-quiz'); await fill(owner, '출제테스트');
  await owner.evaluate(`(() => {const original=window.fetch;let failed=false;window.fetch=async(...args)=>{const response=await original(...args);if(!failed&&String(args[0]).endsWith('/v1/inboxes')&&args[1]?.method==='POST'){failed=true;throw new TypeError('simulated lost response')}return response;};})()`);
  await submit(owner); await owner.until(`!!document.querySelector('[role=alert]')`);
  assert.equal(await owner.evaluate(`!!document.querySelector('main input[readonly]')`), false, 'Do not claim creation until confirmed');
  await submit(owner); await owner.until(`!!document.querySelector('input[aria-label="생성자 전용 결과함 주소"]')`);
  const box = await captureOwner(owner);
  const invite = await owner.evaluate(`document.querySelector('main input[readonly]').value`);
  assert.equal(new URL(invite).hash, `#box=${box.id}`);
  assert.ok(!invite.includes(box.token));
  assert.equal(await owner.evaluate(`JSON.parse(localStorage.getItem('modu:friend-inboxes:v1')).length`), 1, 'Creation retries keep one inbox');

  await friend.navigate(invite); await fill(friend, '친구하나');
  assert.equal(await friend.evaluate(`localStorage.getItem('modu:friend-inboxes:v1')`), null, 'Friend has an independent browser');
  await friend.evaluate(`(() => {const original=window.fetch;let failed=false;window.fetch=async(...args)=>{const response=await original(...args);if(!failed&&String(args[0]).endsWith('/responses')&&args[1]?.method==='POST'){failed=true;throw new TypeError('simulated lost response')}return response;};})()`);
  await submit(friend); await friend.until(`!!document.querySelector('[role=alert]')`);
  assert.equal(await friend.evaluate(`!!document.querySelector('#social-result-title')`), false, 'Unconfirmed save retains the form');
  await submit(friend); await friend.until(`!!document.querySelector('#social-result-title')`);
  assert.ok(await friend.evaluate(`document.body.innerText.includes('생성자의 결과함에 저장됐어요')`));
  assert.ok(await friend.evaluate(`document.querySelector('#social-result-title').textContent.includes('8/8')`));
  await other.navigate(invite); await fill(other, '친구둘', 1); await submit(other); await other.until(`!!document.querySelector('#social-result-title')`);

  await owner.navigate(box.privateUrl); await owner.until(`document.querySelectorAll('[data-inbox-response]').length===2`);
  assert.equal(await owner.evaluate(`document.querySelectorAll('script[src*="googletagmanager"],script[src*="adsbygoogle"]').length`), 0, 'Private view does not load analytics or ads');
  assert.ok(await owner.evaluate(`document.body.innerText.includes('친구하나')&&document.body.innerText.includes('친구둘')&&document.body.innerText.includes('0/8')`));
  await owner.evaluate(`window.open=(url)=>{window.__shared=url;return null};[...document.querySelectorAll('button')].find(b=>b.textContent==='X (트위터)').click()`);
  const shared = new URL(await owner.evaluate('window.__shared'));
  assert.equal(shared.searchParams.get('url'), invite);
  assert.ok(!shared.href.includes(box.token));
  assert.equal(await owner.evaluate(`window.__events.length`), 0, 'No private page analytics');
  const denied = await friend.evaluate(`fetch(${JSON.stringify(`${api}/v1/inboxes/${box.id}/owner`)},{cache:'no-store'}).then(async r=>({status:r.status,body:await r.text()}))`);
  assert.equal(denied.status, 403); assert.ok(!denied.body.includes('친구둘'));
  for (const width of [320, 390, 1280]) {
    await owner.call('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 500 });
    assert.equal(await owner.evaluate(`document.documentElement.scrollWidth>innerWidth`), false, `No overflow at ${width}`);
  }
  await owner.evaluate(readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8'));
  for (const dark of [false, true]) {
    await owner.evaluate(`document.documentElement.classList.toggle('dark',${dark})`);
    await owner.until(`document.querySelector('main').getAnimations({subtree:true}).every(animation=>animation.playState==='finished')`);
    const violations = await owner.evaluate(`axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}}).then(r=>r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))`);
    assert.deepEqual(violations, [], 'Inbox accessibility');
  }
  if (process.env.INBOX_QA_SCREENSHOT) {
    await owner.evaluate(`document.documentElement.classList.remove('dark')`);
    await owner.until(`document.querySelector('main').getAnimations({subtree:true}).every(animation=>animation.playState==='finished')`);
    await owner.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 1100, deviceScaleFactor: 1, mobile: true });
    const screenshot = await owner.call('Page.captureScreenshot', { format: 'png' });
    writeFileSync(process.env.INBOX_QA_SCREENSHOT, Buffer.from(screenshot.data, 'base64'));
  }
  await owner.evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='결과함 전체 삭제').click()`);
  await owner.evaluate(`[...document.querySelectorAll('button')].find(b=>b.textContent==='확인 · 전체 삭제').click()`);
  await owner.until(`document.body.innerText.includes('결과함과 저장된 친구 답변을 삭제했습니다')`);
  await friend.navigate(invite); await friend.until(`document.body.innerText.includes('결과함이 만료되었거나 삭제됐어요')`);

  await other.navigate('/tools/friend-manual');
  await other.evaluate(`(() => {const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='modu:friend-inboxes:v1')throw new DOMException('blocked');return original.call(this,key,value);};})()`);
  await fill(other, '보관실패검사'); await submit(other);
  await other.until(`!!document.querySelector('input[aria-label="생성자 전용 결과함 주소"]')`);
  const recoverable = await captureOwner(other);
  assert.ok(await other.evaluate(`document.body.innerText.includes('이 브라우저에 결과함 주소를 저장하지 못했어요')`));
  await owner.navigate(recoverable.privateUrl); await owner.until(`document.body.innerText.includes('첫 답변을 기다리고 있어요')`);
  assert.deepEqual(errors, []);
  console.log('PASS inbox: independent creator/friends, save confirmation, retry deduplication, private access, SNS link isolation, empty state, expiry/deletion UI, blocked storage recovery, 320/390/1280 and light/dark accessibility');
} finally {
  for (const box of created) await fetch(`${api}/v1/inboxes/${box.id}/owner`, { method: 'DELETE', headers: { Origin: new URL(base).origin, Authorization: `Bearer ${box.token}` } }).catch(() => {});
  for (const browserContextId of contexts) await send('Target.disposeBrowserContext', { browserContextId });
  socket.close();
}
