// Read-only probe using the dashboard's existing local connection settings.
import { readFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
import { report } from './worker.mjs';

const config = JSON.parse(await readFile(new URL('./wrangler.jsonc', import.meta.url), 'utf8'));
const vars = parseEnv(await readFile(new URL('./.dev.vars', import.meta.url), 'utf8'));
if (vars.GOOGLE_SERVICE_ACCOUNT_FILE) vars.GOOGLE_SERVICE_ACCOUNT_JSON = (await readFile(vars.GOOGLE_SERVICE_ACCOUNT_FILE, 'utf8')).replace(/^\uFEFF/, '');
const data = await report({ ...config.vars, ...vars }, 7);
console.log(JSON.stringify({ connected: data.connected, usageReportAvailable: Array.isArray(data.usage), usageRows: data.usage?.length, warnings: data.warnings }, null, 2));
if (!data.connected || !Array.isArray(data.usage)) process.exitCode = 1;
