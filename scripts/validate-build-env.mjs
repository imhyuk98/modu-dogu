import { pathToFileURL } from 'node:url';

export function validateBuildEnv(env) {
  // Cloudflare injects these before npm prebuild. Local .env files are loaded
  // later by Next.js; development and preview builds may omit the share key.
  const production = env.CF_PAGES === '1' && env.CF_PAGES_BRANCH === 'master';
  if (!production && env.REQUIRE_KAKAO_SHARE !== 'true') return;
  const key = env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '';
  if (!/^[a-f0-9]{32}$/i.test(key) || /^0+$/.test(key)) {
    throw new Error('Set a valid NEXT_PUBLIC_KAKAO_JS_KEY in Cloudflare Pages production build variables. Use the JavaScript key, never an Admin or REST API key.');
  }
  if (production && env.NEXT_PUBLIC_FRIEND_INBOX_API !== 'https://modu-friend-inbox.huni1260.workers.dev') {
    throw new Error('Set NEXT_PUBLIC_FRIEND_INBOX_API to the production inbox Worker URL before building master.');
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    validateBuildEnv(process.env);
    console.log('PASS build environment validation');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
