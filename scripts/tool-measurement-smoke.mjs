import assert from 'node:assert/strict';

const base = process.env.MEASUREMENT_QA_BASE_URL || 'http://127.0.0.1:3000';
const debug = process.env.CHROME_DEBUG_URL || 'http://127.0.0.1:9224';
const target = await fetch(`${debug}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data), waiter = pending.get(message.id);
  if (!waiter) return;
  pending.delete(message.id);
  clearTimeout(waiter.timeout);
  if (message.error) waiter.reject(Error(message.error.message)); else waiter.resolve(message.result);
});
function send(method, params = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(Error(`Timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timeout });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || 'Browser script failed');
  return result.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function click(text) {
  await evaluate(`(() => { const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes(${JSON.stringify(text)})); if (!b || b.disabled) throw Error('Button unavailable'); b.click(); })()`);
  await pause(100);
}
async function input(selector, value, tag = 'HTMLInputElement') {
  await evaluate(`(() => { const e=document.querySelector(${JSON.stringify(selector)}); Object.getOwnPropertyDescriptor(${tag}.prototype,'value').set.call(e,${JSON.stringify(value)}); e.dispatchEvent(new Event('input',{bubbles:true})); e.dispatchEvent(new Event('change',{bubbles:true})); })()`);
  await pause(100);
}
async function navigate(path, consent = 'granted') {
  await send('Page.navigate', { url: base + path });
  let ready = false;
  for (let i = 0; i < 120; i++) {
    if (await evaluate(`location.origin === ${JSON.stringify(new URL(base).origin)} && location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('h1')`).catch(() => false)) { ready = true; break; }
    await pause(100);
  }
  assert.equal(ready, true, `Page unavailable: ${path}`);
  await pause(800);
  await evaluate(`localStorage.setItem('modu:optional-consent:v1',${JSON.stringify(consent)}); window.dispatchEvent(new Event('modu:consent-change'));`);
  await pause(300);
  await evaluate(`window.__measurement=[]; window.gtag=(...args)=>window.__measurement.push(args);`);
}
async function events() {
  return evaluate(`window.__measurement.filter(e=>['tool_start','tool_complete','result_share'].includes(e[1]))`);
}
try {
  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*', '*analytics.google.com*', '*doubleclick.net*', '*googleadservices.com*'] });
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate('/tools/image-game');
  await click('질문 바로 보기');
  assert.equal(await evaluate(`document.body.textContent.includes('질문 보기 모드')`), true);
  assert.equal(await evaluate(`[...document.querySelectorAll('button')].some(b=>b.textContent.includes('투표하기'))`), false);
  await click('다음 질문');
  await pause(300);
  assert.equal((await events()).length, 0, 'Question browsing is not a completed vote');
  assert.deepEqual(await evaluate(`window.__measurement.map(e=>e[1])`), ['tool_browse_start', 'tool_question_next']);
  assert.equal(await evaluate('document.documentElement.scrollWidth > innerWidth'), false, 'Mobile overflow');
  await click('처음으로');
  await click('추가');
  assert.equal(await evaluate(`!!document.querySelector('#player-error')`), true);
  await navigate('/calculators/pyeong');
  await input('input[type=number]', '');
  assert.equal(await evaluate(`!!document.querySelector('#area-result-title')`), false, 'Empty area must not show zero result');
  await input('input[type=number]', '0');
  assert.equal(await evaluate(`!!document.querySelector('#area-result-title')`), true, 'Explicit zero remains valid');
  for (const tool of ['electricity', 'housing-subscription', 'couple-dday', 'blood-type', 'image-game']) {
    await navigate(`/${tool === 'image-game' ? 'tools' : 'calculators'}/${tool}`);
    assert.equal((await events()).length, 0, `${tool}: initial result must not count`);
    if (tool === 'electricity') await click('100kWh');
    if (tool === 'housing-subscription') await input('select', '1', 'HTMLSelectElement');
    if (tool === 'couple-dday') { await input('input[type=date]', '2020-01-01'); await click('계산하기'); }
    if (tool === 'blood-type') await click('아기 혈액형 확인하기');
    if (tool === 'image-game') {
      for (const name of ['QA_ONE', 'QA_TWO']) { await input('input[placeholder="이름 입력"]', name); await click('추가'); }
      await click('게임 시작'); await click('투표'); await click('QA_ONE'); await click('QA_TWO');
    }
    await pause(1000);
    const recorded = await events();
    assert.deepEqual(recorded.map(e => e[1]), ['tool_start', 'tool_complete'], tool);
    for (const event of recorded) assert.deepEqual(Object.keys(event[2]).sort(), ['measurement_version', 'tool']);
    console.log(`${tool}: start + completion, no input values`);
  }
  await navigate('/calculators/blood-type', 'denied');
  await click('아기 혈액형 확인하기');
  assert.equal((await events()).length, 0, 'Denied consent');
  console.log('Measurement browser smoke passed; Google network requests blocked.');
} finally {
  socket.close();
  await fetch(`${debug}/json/close/${target.id}`);
}
