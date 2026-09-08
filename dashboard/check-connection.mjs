import { readFile } from 'node:fs/promises';
import { report } from './worker.mjs';
const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
if (!process.argv[2]) throw new Error('Provide the local service account file path.');
try {
  const key = await readFile(process.argv[2], 'utf8');
  const result = await report({ ...config.vars, GOOGLE_SERVICE_ACCOUNT_JSON: key.replace(/^\uFEFF/, '') }, 7);
  console.log(JSON.stringify({ connected: result.connected, summary: result.summary, portals: result.portals, sources: result.sources, realtime: result.realtime, warnings: result.warnings }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
