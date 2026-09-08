import { createServer } from 'node:http';
import { testDatabase } from './test-db.mjs';
import { handleRequest } from './worker.mjs';

const { DB } = testDatabase();
const allow = { limit: async () => ({ success: true }) };
const env = { DB, ALLOWED_ORIGINS: 'http://127.0.0.1:3000,http://localhost:3000', REQUEST_LIMIT: allow, CREATE_LIMIT: allow };
createServer(async (req, res) => {
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of req) { size += chunk.length; if (size > 4096) { res.writeHead(413).end(); return; } chunks.push(chunk); }
    const response = await handleRequest(new Request(`http://127.0.0.1:8790${req.url}`, { method: req.method, headers: req.headers, ...(!['GET', 'HEAD'].includes(req.method) ? { body: Buffer.concat(chunks) } : {}) }), env);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch { res.writeHead(500).end(); }
}).listen(8790, '127.0.0.1', () => console.log('Local-only inbox test API http://127.0.0.1:8790 (memory DB, no production data)'));
