import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
const axeSource = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url),'utf8');
const base = process.env.SOCIAL_QA_BASE_URL ?? 'http://localhost:3000';
const inboxApi = process.env.INBOX_QA_API ?? process.env.NEXT_PUBLIC_FRIEND_INBOX_API ?? 'http://127.0.0.1:8790';
const testInboxes = [];
const debuggerUrl = process.env.CHROME_DEBUG_URL ?? 'http://127.0.0.1:9224';
const target = await fetch(`${debuggerUrl}/json/new?about:blank`, { method: 'PUT' }).then(r => r.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });
let id = 0; const pending = new Map(); const errors = [];
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
  if (pending.has(message.id)) {
    const handler = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) handler.reject(message.error);
    else handler.resolve(message.result);
  }
});
function send(method, params = {}) { const next = ++id; socket.send(JSON.stringify({ id: next, method, params })); return new Promise((resolve, reject) => pending.set(next, { resolve, reject })); }
async function evaluate(expression) { const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (result.exceptionDetails) throw Error(result.exceptionDetails.text); return result.result.value; }
async function until(expression) { for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await new Promise(r => setTimeout(r, 100)); } throw Error(`Timeout: ${expression}`); }
async function navigate(path) {
  const destination = new URL(path, base).href;
  await send('Page.navigate', { url: destination });
  await until(`location.href === ${JSON.stringify(destination)} && document.readyState === 'complete' && !!document.querySelector('main') && !document.body.innerText.includes('초대 정보를 확인하고') && !document.body.innerText.includes('카드를 확인하고')`);
  await evaluate(`window.__events=[]; window.gtag=(command,name,params)=>window.__events.push({name,params});`);
}
async function fill(value = '테스트닉') {
  await evaluate(`(() => { const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; const input = document.querySelector('main input:not([type=radio]):not([readonly])'); setter.call(input, ${JSON.stringify(value)}); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await evaluate(`document.querySelector('main input[type=checkbox]:not(:checked)')?.click()`);
  await until(`!!document.querySelector('main button[type=submit]') && !document.querySelector('main button[type=submit]').disabled`);
  if (await evaluate(`document.querySelector('main button[type=submit]').textContent.includes('시작하기')`)) {
    await evaluate(`document.querySelector('main button[type=submit]').click()`);
    for(let step=0;step<10;step++) {
      if(!await evaluate(`!!document.querySelector('main input[type=radio]')`)) break;
      assert.equal(await evaluate(`document.querySelectorAll('main fieldset').length`),1,'Only one question is visible');
      if(step===0) {
        await evaluate(`document.querySelector('main input[type=radio][value="0"]').click();[...document.querySelectorAll('main button')].find(b=>b.textContent.includes('이전')).click()`);
        await new Promise(r=>setTimeout(r,350));
        assert.equal(await evaluate(`document.querySelector('[data-quiz-step]').dataset.quizStep`),'-1','Previous cancels pending automatic transition');
        await evaluate(`document.querySelector('main button[type=submit]').click()`);
      }
      await evaluate(`document.querySelector('main input[type=radio][value="0"]').click();document.querySelector('main input[type=radio][value="0"]').click();document.querySelector('main button[type=submit]').click()`);
      await until(`document.querySelector('[data-quiz-step]').dataset.quizStep===${JSON.stringify(String(step+1))}`);
      if(step===1) {
        await evaluate(`[...document.querySelectorAll('main button')].find(b=>b.textContent.includes('이전')).click()`);
        assert.ok(await evaluate(`document.querySelector('main input[type=radio][value="0"]').checked`),'Back preserves answer');
        await evaluate(`document.querySelector('main input[type=radio][value="0"]').click()`);
        await until(`document.querySelector('[data-quiz-step]').dataset.quizStep==='2'`);
      }
    }
    assert.ok(await evaluate(`document.body.innerText.includes('이대로 완성할까요?')`));
    const reviewStep = await evaluate(`document.querySelector('[data-quiz-step]').dataset.quizStep`);
    await evaluate(`[...document.querySelectorAll('main button')].find(b=>b.textContent.includes('수정')).click()`);
    await evaluate(`document.querySelector('main input[type=radio][value="0"]').click()`);
    await until(`document.querySelector('[data-quiz-step]').dataset.quizStep===${JSON.stringify(reviewStep)}`);
    assert.equal(await evaluate(`!!document.querySelector('#social-result-title')`),false,'Automatic advance never submits the result');
    await evaluate(`document.querySelector('main input[type=checkbox]:not(:checked)')?.click()`);
  }
}
try {
  await send('Network.enable');
  await send('Network.setBlockedURLs', { urls: ['*google-analytics.com*', '*googletagmanager.com*', '*analytics.google.com*', '*doubleclick.net*', '*googleadservices.com*'] });
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.setItem('modu:optional-consent:v1','granted'); } catch {} window.__events=[]; window.gtag=(command,name,params)=>window.__events.push({name,params});` });
  for (const mode of ['friendship-quiz', 'friend-manual', 'friend-chemistry', 'compliment-card']) {
    await navigate(`/tools/${mode}`); await fill('가나다라마바사아자차카타');
    await evaluate(`document.querySelector('main button[type=submit]').click()`);
    await until(`!!document.querySelector('main input[readonly]')`);
    const invite = await evaluate(`document.querySelector('main input[readonly]').value`);
    const privateUrl = await evaluate(`document.querySelector('input[aria-label="생성자 전용 결과함 주소"]')?.value ?? ''`);
    if (privateUrl) {
      const [, id, token] = new URL(privateUrl).hash.match(/^#([a-f0-9]{32})\.([a-f0-9]{64})$/);
      testInboxes.push({ id, token });
    }
    assert.ok(invite.includes('#') && !invite.includes('?'));
    await navigate(invite); await fill('친구닉');
    await evaluate(`document.querySelector('main button[type=submit]').click()`);
    await until(`!!document.querySelector('#social-result-title')`);
    const result = await evaluate(`({url:location.href,title:document.querySelector('#social-result-title').textContent,overflow:document.documentElement.scrollWidth>innerWidth,events:window.__events})`);
    assert.equal(result.overflow, false);
    assert.ok(result.events.some(e => e.name === 'invite_complete'));
    assert.equal(JSON.stringify(result.events).includes('친구닉'), false);
    assert.equal(JSON.stringify(result.events).includes('테스트닉'), false);
    if (mode === 'friendship-quiz') assert.ok(result.title.includes('8/8'));
    if (mode === 'friend-chemistry') assert.ok(result.title.includes('100%'));
    await navigate(result.url);
    assert.equal(await evaluate(`document.querySelector('#social-result-title').textContent`), result.title);
    assert.equal(await evaluate(`document.querySelectorAll('[aria-label="SNS별 공유"] svg[aria-hidden="true"]').length`), 3, 'X, LINE, Instagram logo glyphs');
    if (await evaluate(`!!document.querySelector('[aria-label="SNS별 공유"] img')`)) {
      await until(`document.querySelector('[aria-label="SNS별 공유"] img').complete && document.querySelector('[aria-label="SNS별 공유"] img').naturalWidth>0`);
      assert.equal(await evaluate(`document.querySelector('[aria-label="SNS별 공유"] img').alt`), '', 'Logo does not duplicate button label');
    }
    for (const [label, origin, eventName] of [['X (트위터)', 'https://x.com', 'share_request_x'], ['LINE', 'https://social-plugins.line.me', 'share_request_line']]) {
      await evaluate(`window.open=(url,target,features)=>{window.__sns={url,target,features};return null}; [...document.querySelectorAll('main button')].find(b=>b.textContent===${JSON.stringify(label)}).click()`);
      const opened = await evaluate('window.__sns');
      assert.equal(new URL(opened.url).origin, origin);
      assert.equal(new URL(opened.url).searchParams.get('url'), result.url);
      assert.equal(opened.features, 'noopener,noreferrer');
      await until(`!![...document.querySelectorAll('main button')].find(a=>a.textContent==='공유 화면 다시 열기')`);
      assert.equal(await evaluate(`!![...document.querySelectorAll('main a')].find(a=>a.href.includes('intent/tweet')||a.href.includes('lineit/share'))`),false,'Private payload is not exposed to automatic outbound link analytics');
      assert.ok(await evaluate(`window.__events.some(e=>e.name===${JSON.stringify(eventName)})`));
    }
    await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__instagramCopied=value}}}); [...document.querySelectorAll('main button')].find(b=>b.textContent.startsWith('인스타그램')).click()`);
    await until(`!!document.querySelector('section[aria-label="인스타그램 공유 안내"]')`);
    await evaluate(`[...document.querySelectorAll('main button')].find(b=>b.textContent==='인스타그램용 링크 복사').click()`);
    await until(`window.__instagramCopied===location.href`);
    assert.ok(await evaluate(`window.__events.some(e=>e.name==='instagram_link_copy')`));
    assert.ok(await evaluate(`document.body.innerText.includes('게시는 자동으로 되지 않습니다')`));
    await evaluate(`Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async()=>{throw new Error('denied')}}});[...document.querySelectorAll('main button')].find(b=>b.textContent==='인스타그램용 링크 복사').click()`);
    await until(`document.body.innerText.includes('인스타그램 안내 안의 주소를 길게 눌러')`);
    assert.equal(await evaluate(`document.querySelector('section[aria-label="인스타그램 공유 안내"] input').value`), result.url);
    const eventCount = await evaluate('window.__events.length');
    await evaluate(`localStorage.setItem('modu:optional-consent:v1','denied');[...document.querySelectorAll('main button')].find(b=>b.textContent==='LINE').click()`);
    assert.equal(await evaluate('window.__events.length'), eventCount, 'No SNS analytics without consent');
    await evaluate(`localStorage.setItem('modu:optional-consent:v1','granted')`);
    await evaluate(axeSource);
    await until(`document.querySelector('main img[alt*="미리보기"]')?.complete === true`);
    await until(`[...document.querySelectorAll('main *')].every(e=>e.getAnimations().every(a=>a.playState==='finished'))`);
    for(const theme of ['light','dark']) {
      await evaluate(`document.documentElement.classList.toggle('dark',${theme==='dark'})`);
      const violations=await evaluate(`axe.run(document.querySelector('main'),{runOnly:{type:'tag',values:['wcag2a','wcag2aa']}}).then(r=>r.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})))`);
      assert.deepEqual(violations,[],`${mode} ${theme} accessibility`);
    }
    await evaluate(`document.documentElement.classList.remove('dark')`);
    if (mode === 'friendship-quiz' && process.env.SOCIAL_QA_SCREENSHOT) {
      await evaluate(`document.querySelector('[aria-label="SNS별 공유"]').scrollIntoView({block:'start'});window.scrollBy(0,-90)`);
      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(process.env.SOCIAL_QA_SCREENSHOT, Buffer.from(screenshot.data, 'base64'));
    }
    await evaluate(`[...document.querySelectorAll('main button')].find(b=>b.textContent.startsWith('인스타그램')&&b.hasAttribute('aria-expanded')).click()`);
    for(const width of [320,1280]) { await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<600});assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'),false,`${mode} width ${width}`); }
    await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
    await evaluate(`(() => { Object.defineProperty(navigator, 'clipboard', { configurable:true,value:{writeText:async()=>{throw new Error('denied')}} }); [...document.querySelectorAll('main button')].find(b=>b.textContent==='링크 복사').click(); })()`);
    await until(`document.body.innerText.includes('복사 권한이 없어요')`);
    await until(`[...document.querySelectorAll('main button')].some(b=>b.textContent==='이미지 저장'&&!b.disabled)`);
    await evaluate(`(() => { HTMLAnchorElement.prototype.click=function(){window.__download=this.download}; [...document.querySelectorAll('main button')].find(b=>b.textContent==='이미지 저장').click(); })()`);
    await until(`!!window.__download`);
    assert.ok(await evaluate(`window.__download.endsWith('.png')`));
    await evaluate(`(() => { window.__download=''; [...document.querySelectorAll('main button')].find(b=>b.textContent==='1:1 피드').click(); })()`);
    await until(`[...document.querySelectorAll('main button')].some(b=>b.textContent==='이미지 저장'&&!b.disabled)`);
    await evaluate(`[...document.querySelectorAll('main button')].find(b=>b.textContent==='이미지 저장').click()`);
    await until(`window.__download.endsWith('square.png')`);
    assert.ok(await evaluate(`(()=>{const image=document.querySelector('main img[alt*="미리보기"]');return image.naturalWidth===1080&&image.naturalHeight===1080})()`),'Square preview uses actual PNG');
    await evaluate(`Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__sharedFile=data.files?.[0]?.name;window.__sharedKeys=Object.keys(data);}});Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>true});[...document.querySelectorAll('main button')].find(b=>b.textContent==='이미지 공유').click();`);
    await until(`!!window.__sharedFile`);
    assert.ok(await evaluate(`window.__sharedFile.endsWith('square.png')`));
    assert.equal(await evaluate(`window.__sharedKeys.includes('url')`),false,'Image share sends file, link is separate');
    await evaluate(`Object.defineProperty(navigator,'share',{configurable:true,value:async()=>{throw new DOMException('cancel','AbortError')}});[...document.querySelectorAll('main button')].find(b=>b.textContent==='이미지 공유').click();`);
    await until(`document.body.innerText.includes('공유를 취소했어요')`);
    await evaluate(`Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false});[...document.querySelectorAll('main button')].find(b=>b.textContent==='이미지 공유').click();`);
    await until(`document.body.innerText.includes('이미지 직접 공유를 지원하지 않아요')`);
    await navigate(`/tools/${mode}#broken`);
    assert.ok(await evaluate(`document.body.innerText.includes('링크를 읽을 수 없어요')`));
    console.log(`PASS ${mode}: invite, result, X/LINE intents, Instagram guide/copy/denial, consent, light/dark, mobile, PNG`);
  }
  await navigate('/tools/friend-chemistry?answers=01010101');
  assert.ok(await evaluate(`document.body.innerText.includes('친구님이 초대했어요')`));
  await navigate('/tools/moon-compatibility');
  await evaluate(`(() => { const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; [...document.querySelectorAll('main input')].forEach((input,index)=>{setter.call(input,['첫째','2000-01-06','둘째','2000-01-21'][index]);input.dispatchEvent(new Event('input',{bubbles:true}));}); })()`);
  await evaluate(`document.querySelector('main button[type=submit]').click()`);
  await until(`location.hash.includes('first=')`);
  const moonUrl = await evaluate('location.href');
  assert.ok(!moonUrl.includes('2000') && !moonUrl.includes('birthday'));
  await navigate(moonUrl);
  assert.ok(await evaluate(`document.body.innerText.includes('서로 다른 빛의 두 달')`));
  assert.equal(await evaluate('document.documentElement.scrollWidth>innerWidth'), false);
  assert.deepEqual(errors, []);
  console.log('PASS moon card and legacy invitation');
} finally {
  for (const box of testInboxes) await fetch(`${inboxApi}/v1/inboxes/${box.id}/owner`, { method: 'DELETE', signal: AbortSignal.timeout(15000), headers: { Origin: new URL(base).origin, Authorization: `Bearer ${box.token}` } }).catch(() => {});
  await new Promise(resolve => { socket.addEventListener('close', resolve, { once: true }); socket.close(); });
  await fetch(`${debuggerUrl}/json/close/${target.id}`);
}
