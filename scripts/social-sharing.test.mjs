import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
import { readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';
import { moonShape } from '../lib/social-card.ts';
import { socialShareLink } from '../lib/social-share-links.ts';

test('X and LINE preserve Korean text, query and full result fragment without parameter injection', () => {
  const target = 'https://modu-dogu.pages.dev/tools/friend-manual?via=a#이름&answers=01+/=';
  for (const network of ['x', 'line']) {
    const link = new URL(socialShareLink(network, '내 결과 & 친구 #공유', target));
    assert.equal(link.origin, network === 'x' ? 'https://x.com' : 'https://social-plugins.line.me');
    assert.equal(link.searchParams.get('url'), new URL(target).href);
    assert.equal(link.searchParams.get('text'), '내 결과 & 친구 #공유');
    assert.equal(link.searchParams.size, 2);
    assert.equal(link.hash, '');
    assert.throws(() => socialShareLink(network, 'text', 'javascript:alert(1)'));
  }
});
function harness(key='public-test-key') {
  const scripts=[],calls=[],timers=[];
  const sdk={isInitialized:()=>calls.some(c=>c.init),init:key=>calls.push({init:key}),Share:{sendDefault:value=>calls.push({share:value})}};
  const window={location:{origin:'https://modu-dogu.pages.dev'},setTimeout:fn=>(timers.push(fn),timers.length),clearTimeout:()=>{}};
  const context=vm.createContext({exports:{},window,process:{env:{NEXT_PUBLIC_KAKAO_JS_KEY:key}},URL,Promise,document:{createElement:()=>({remove(){this.removed=true;}}),head:{appendChild:s=>scripts.push(s)}}});
  vm.runInContext(ts.transpileModule(readFileSync('lib/kakao-share.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
  return {api:context.exports,window,sdk,scripts,calls,timers};
}
test('unconfigured Kakao does not load third party SDK',async()=>{const h=harness('');assert.equal(h.api.kakaoShareConfigured,false);await assert.rejects(h.api.loadKakaoShare());assert.equal(h.scripts.length,0);});
test('Kakao loader is lazy, pinned, integrity checked and deduplicated',async()=>{const h=harness();const a=h.api.loadKakaoShare(),b=h.api.loadKakaoShare();assert.equal(h.scripts.length,1);assert.equal(h.scripts[0].crossOrigin,'anonymous');assert.match(h.scripts[0].src,/2\.8\.3\/kakao.min.js$/);assert.match(h.scripts[0].integrity,/^sha384-/);h.window.Kakao=h.sdk;h.scripts[0].onload();await Promise.all([a,b]);assert.equal(h.calls.length,1);});
test('SDK failures can retry and time out',async()=>{const h=harness();let a=h.api.loadKakaoShare();h.scripts[0].onerror();await assert.rejects(a);a=h.api.loadKakaoShare();assert.equal(h.scripts.length,2);h.timers[1]();await assert.rejects(a);assert.equal(h.scripts[1].removed,true);});
test('Kakao message preserves result fragment but uses non-personal preview',async()=>{const h=harness();h.window.Kakao=h.sdk;await h.api.loadKakaoShare();h.api.sendKakaoShare({tool:'friend-manual',title:'친구 설명서',text:'카드',url:'https://modu-dogu.pages.dev/tools/friend-manual#private-link'});const card=h.calls.find(c=>c.share).share;assert.equal(card.content.link.webUrl,'https://modu-dogu.pages.dev/tools/friend-manual#private-link');assert.equal(card.content.imageUrl,'https://modu-dogu.pages.dev/og/social/friend-manual.png');for(const url of ['javascript:alert(1)','https://unrelated.example/a'])assert.throws(()=>h.api.sendKakaoShare({tool:'friend-manual',title:'a',text:'b',url}));});
test('moon artwork covers eight finite distinct silhouettes',()=>{const shapes=Array.from({length:8},(_,i)=>moonShape(i));assert.equal(new Set(shapes).size,8);for(const path of shapes)assert.ok(path.startsWith('M')&&path.endsWith('Z')&&!/NaN|Infinity/.test(path));});
test('five unique social previews are PNG files at 1200 by 630',async()=>{const previews=['friendship-quiz','friend-manual','friend-chemistry','compliment-card','moon-compatibility'];const contents=[];for(const slug of previews){const path=`public/og/social/${slug}.png`;assert.ok(existsSync(path));const info=await sharp(path).metadata();assert.equal(info.width,1200);assert.equal(info.height,630);contents.push(readFileSync(path).toString('base64'));}assert.equal(new Set(contents).size,5);});
test('CSP explicitly permits Kakao SDK and share form without disabling other guards',()=>{const headers=readFileSync('public/_headers','utf8');assert.match(headers,/script-src [^;]*https:\/\/t1.kakaocdn.net/);assert.match(headers,/form-action 'self' https:\/\/sharer.kakao.com;/);assert.match(headers,/script-src-attr 'none'/);assert.doesNotMatch(headers,/unsafe-eval/);});
