import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { validateBuildEnv } from './validate-build-env.mjs';

const production = { CF_PAGES: '1', CF_PAGES_BRANCH: 'master' };
const exampleKey = '1234567890abcdef1234567890abcdef';

test('Cloudflare production requires a non-placeholder JavaScript key', () => {
  for (const key of [undefined, '', 'bad-key', '0'.repeat(32), ` ${exampleKey}`]) {
    assert.throws(() => validateBuildEnv({ ...production, NEXT_PUBLIC_KAKAO_JS_KEY: key }), /NEXT_PUBLIC_KAKAO_JS_KEY/);
  }
  assert.doesNotThrow(() => validateBuildEnv({ ...production, NEXT_PUBLIC_KAKAO_JS_KEY: exampleKey }));
});

test('local and preview builds can omit Kakao, explicit release validation cannot', () => {
  for (const env of [{}, { CF_PAGES: '1', CF_PAGES_BRANCH: 'feature/test' }, { CF_PAGES_BRANCH: 'master' }]) {
    assert.doesNotThrow(() => validateBuildEnv(env));
    assert.throws(() => validateBuildEnv({ ...env, REQUIRE_KAKAO_SHARE: 'true' }));
  }
});

test('CLI rejects a misconfigured release without printing the supplied key', () => {
  const key = 'invalid-sensitive-value';
  const result = spawnSync(process.execPath, ['scripts/validate-build-env.mjs'], {
    encoding: 'utf8', env: { ...process.env, ...production, NEXT_PUBLIC_KAKAO_JS_KEY: key },
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /NEXT_PUBLIC_KAKAO_JS_KEY/);
  assert.ok(!`${result.stdout}${result.stderr}`.includes(key));
});
