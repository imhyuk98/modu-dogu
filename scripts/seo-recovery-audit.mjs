import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { indexableCalculatorResults, calculatorResultMetadata } from '../lib/calculator-result-indexing.ts';

const origin = 'https://modu-dogu.pages.dev';
const out = new URL('../out/', import.meta.url);
const read = path => readFileSync(new URL(path === '/' ? 'index.html' : `${path.slice(1)}.html`, out), 'utf8');
const allowed = new Set(indexableCalculatorResults);
assert.equal(allowed.size, 25, 'Recovery cohort changes require an explicit review');
const sitemap = readFileSync(new URL('sitemap.xml', out), 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => new URL(url).pathname);
const sitemapPaths = new Set(paths);
assert.equal(paths.length, sitemapPaths.size, 'Duplicate sitemap URL');
const noindex = html => /<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html);
const canonical = html => html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
const graph = new Map();
for (const path of paths) {
  const html = read(path);
  assert.ok(!noindex(html), `Sitemap contains noindex: ${path}`);
  assert.equal(canonical(html)?.replace(/\/$/, ''), `${origin}${path}`.replace(/\/$/, ''), `Canonical mismatch: ${path}`);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].flatMap(([, href]) => {
    const url = new URL(href.replaceAll('&amp;', '&'), origin);
    return url.origin === origin ? [url.pathname.replace(/\/$/, '') || '/'] : [];
  });
  graph.set(path, links);
}
const visited = new Set(['/']);
const queue = ['/'];
for (let i = 0; i < queue.length; i++) {
  for (const path of graph.get(queue[i]) ?? []) {
    if (graph.has(path) && !visited.has(path)) { visited.add(path); queue.push(path); }
  }
}
for (const path of allowed) {
  assert.ok(sitemapPaths.has(path), `Recovery page missing from sitemap: ${path}`);
  assert.ok(visited.has(path), `Recovery page not reachable by HTML links: ${path}`);
  const base = path.slice(0, path.lastIndexOf('/'));
  const slug = path.slice(path.lastIndexOf('/') + 1);
  assert.deepEqual(calculatorResultMetadata(base, slug), { alternates: { canonical: path }, robots: { index: true, follow: true } });
  assert.ok(read(base).includes(`href="${path}"`), `Parent page lacks a recovery link: ${path}`);
}
let excluded = 0;
let selected = 0;
for (const family of ['bmi', 'loan', 'rent-conversion', 'retirement', 'salary', 'unemployment']) {
  const base = `/calculators/${family}`;
  for (const file of readdirSync(new URL(`calculators/${family}/`, out)).filter(f => f.endsWith('.html'))) {
    const slug = file.slice(0, -5);
    const path = `${base}/${slug}`;
    const html = read(path);
    if (allowed.has(path)) { selected++; continue; }
    excluded++;
    assert.ok(noindex(html), `Unreviewed result unexpectedly indexable: ${path}`);
    assert.equal(canonical(html), origin + base);
    assert.ok(!sitemapPaths.has(path));
    assert.equal(calculatorResultMetadata(base, slug).robots.index, false);
  }
}
assert.equal(selected, 25);
assert.equal(excluded, 756);
for (const path of ['/tools/friend-inbox', '/tools/telepathy-game/result/great']) {
  assert.ok(noindex(read(path)), `Private/result exclusion removed: ${path}`);
  assert.ok(!sitemapPaths.has(path));
}
const exchange = read('/calculators/exchange-rate');
const main = exchange.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]?.replace(/<script\b[\s\S]*?<\/script>/gi, '') ?? '';
for (const marker of ['환율 계산기 사용법', '환율이란?', '자주 묻는 질문', '보내는 통화와 받는 통화를 선택']) {
  assert.ok(main.includes(marker), `Missing non-JavaScript exchange content: ${marker}`);
}
assert.equal((main.match(/<h1\b/g) ?? []).length, 1);
assert.ok(main.includes('환율 데이터를 불러오는 중'), 'Expected initial loading state');
assert.ok(!main.includes('id="from-currency"'), 'Unavailable rates must not render a misleading converter');
const normalizer = readFileSync(new URL('normalize-metadata.mjs', import.meta.url), 'utf8');
assert.ok(!normalizer.includes('index: false'), 'Normalizer must not reintroduce blanket noindex');
assert.ok(normalizer.includes('generate-sitemap.mjs'), 'Normalizer must use the reviewed sitemap policy');
console.log(JSON.stringify({ sitemapUrls: paths.length, restoredResults: selected, excludedResults: excluded, privateNoindexPreserved: true, parentLinks: allowed.size, exchangeInitialHtml: 'PASS' }, null, 2));
