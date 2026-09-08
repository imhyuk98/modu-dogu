import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import worker from './worker.mjs';
const preview = process.argv.includes('--preview');
const portIndex = process.argv.indexOf('--port');
const port = portIndex === -1 ? 8787 : Number(process.argv[portIndex + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid --port');
let vars = {};
const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
try { vars = parseEnv(await readFile(new URL('./.dev.vars', import.meta.url), 'utf8')); } catch { /* Credentials must be explicitly configured. */ }
if (!preview && vars.GOOGLE_SERVICE_ACCOUNT_FILE) {
  try {
    const content = await readFile(vars.GOOGLE_SERVICE_ACCOUNT_FILE, 'utf8');
    const account = JSON.parse(content.replace(/^\uFEFF/, ''));
    if (account.type !== 'service_account' || !account.client_email || !account.private_key) throw new Error('invalid');
    vars.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify(account);
  } catch {
    throw new Error('서비스 계정 파일 경로와 JSON 형식을 확인하세요.');
  }
}
const assets = new Map([['/', ['index.html', 'text/html']], ['/index.html', ['index.html', 'text/html']], ['/app.js', ['app.js', 'text/javascript']], ['/style.css', ['style.css', 'text/css']]]);
const env = { ...config.vars, ...vars, ASSETS: { async fetch(request) {
  const asset = assets.get(new URL(request.url).pathname);
  if (!asset) return new Response('Not found', { status: 404 });
  return new Response(await readFile(new URL(`./public/${asset[0]}`, import.meta.url)), { headers: { 'Content-Type': `${asset[1]}; charset=utf-8` } });
} } };
createServer(async (req, res) => {
  try {
    const request = new Request(new URL(req.url, `http://127.0.0.1:${port}`), { method: req.method, headers: req.headers });
    const path = new URL(request.url).pathname;
    // Explicit local preview serves no private data, even when credentials exist.
    const response = preview
      ? path === '/api/report'
        ? Response.json({ connected: false, missing: ['GA4 속성 및 서비스 계정 연결 (로컬 화면 미리보기)'] }, { headers: { 'Cache-Control': 'no-store' } })
        : await env.ASSETS.fetch(request)
      : await worker.fetch(request, env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(req.method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(500); res.end('Local server error'); }
}).listen(port, '127.0.0.1', () => console.log(`Dashboard: http://127.0.0.1:${port} (${preview ? 'preview only; no private data' : 'credentials: dashboard/.dev.vars'})`));
