import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const base = process.env.PRODUCTION_BASE_URL ?? 'https://modu-dogu.pages.dev';
const modes = ['friendship-quiz', 'friend-manual', 'friend-chemistry', 'compliment-card', 'moon-compatibility'];
let html = '';
for (const mode of modes) {
  const response = await fetch(`${base}/tools/${mode}`, { signal: AbortSignal.timeout(15000) });
  assert.ok(response.ok, `${mode} page`);
  const body = await response.text();
  assert.ok(body.includes(`/og/social/${mode}.png`), `${mode} OG metadata`);
  const image = await fetch(`${base}/og/social/${mode}.png`, { signal: AbortSignal.timeout(15000) });
  assert.ok(image.ok && image.headers.get('content-type')?.includes('image/png'), `${mode} OG image`);
  assert.ok(response.headers.get('content-security-policy')?.includes('https://sharer.kakao.com'), 'Kakao CSP');
  html += body;
  console.log(`PASS production page and OG: ${mode}`);
}
const localKey = existsSync('.env.local') ? readFileSync('.env.local', 'utf8').match(/^NEXT_PUBLIC_KAKAO_JS_KEY=(.+)$/m)?.[1]?.trim().replace(/^(['"])(.*)\1$/, '$2') : undefined;
const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? localKey;
assert.ok(key, 'Set NEXT_PUBLIC_KAKAO_JS_KEY in the environment or .env.local for verification');
const assets = [...new Set([...html.matchAll(/src="([^"]+\.js)"/g)].map(match => match[1]))];
const scripts = await Promise.all(assets.map(async path => {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  assert.ok(response.ok, 'Production JS asset');
  return response.text();
}));
assert.ok(scripts.some(script => script.includes(key)), 'Production share key matches local configuration');
console.log('PASS production Kakao key embedded (actual phone transfer not tested)');
