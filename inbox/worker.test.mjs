import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleRequest, hash, cleanup } from './worker.mjs';
import { testDatabase } from './test-db.mjs';
import { socialModes, socialGames, isComparison } from '../lib/social-games.ts';

const origin = 'https://modu-dogu.pages.dev';
const allow = { limit: async () => ({ success: true }) };
function fixture(t) {
  const { DB, sql } = testDatabase();
  t.after(() => sql.close());
  const env = { DB, ALLOWED_ORIGINS: origin, REQUEST_LIMIT: allow, CREATE_LIMIT: allow };
  const request = async (path, { method = 'GET', body, token, headers = {} } = {}, time) => {
    const response = await handleRequest(new Request(`https://inbox.test${path}`, { method, headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...headers }, ...(body ? { body: JSON.stringify(body) } : {}) }), env, time);
    return { status: response.status, headers: response.headers, data: response.status === 204 ? null : await response.json() };
  };
  const create = async (mode = 'friendship-quiz', extras = {}, time) => {
    const ownerToken = await hash(crypto.randomUUID());
    const body = { ownerToken, mode, creator: '출제자', answers: isComparison(mode) ? socialGames[mode].questions.map(() => 0) : [], storageAccepted: true, ...extras };
    const result = await request('/v1/inboxes', { method: 'POST', body }, time);
    return { ...result, body, id: result.data.id, ownerToken: body.ownerToken };
  };
  return { env, sql, request, create };
}

for (const mode of socialModes) test(`${mode}: stored replies are visible only with the correct owner capability`, async t => {
  const f = fixture(t), box = await f.create(mode);
  assert.equal(box.status, 201);
  const path = `/v1/inboxes/${box.id}`;
  const publicView = await f.request(path);
  assert.equal(publicView.status, 200);
  for (const name of ['answers', 'responses', 'ownerToken', 'owner_hash']) assert.equal(name in publicView.data, false);
  assert.equal((await f.request(`${path}/owner`)).status, 403);
  assert.equal((await f.request(`${path}/owner`, { token: 'a'.repeat(64) })).status, 403);
  const replies = socialGames[mode].questions.map(() => 1);
  const saved = await f.request(`${path}/responses`, { method: 'POST', body: { submissionId: crypto.randomUUID(), guest: '<친구>', replies, storageAccepted: true, score: 999, answers: [9] } });
  assert.equal(saved.status, 200);
  assert.equal(saved.data.saved, true);
  assert.deepEqual(saved.data.result.answers, box.body.answers, 'Submitted scores/creator answers are ignored');
  const view = await f.request(`${path}/owner`, { token: box.ownerToken });
  assert.equal(view.data.responses.length, 1);
  assert.deepEqual(view.data.responses[0].result.replies, replies);
  assert.equal(view.headers.get('cache-control'), 'no-store, private');
  assert.ok(!JSON.stringify(view.data).includes(box.ownerToken));
  assert.equal(f.sql.prepare('SELECT owner_hash FROM inboxes').get().owner_hash, await hash(box.ownerToken));
});

test('lost-response retries are idempotent and cannot silently replace answers', async t => {
  const f = fixture(t), box = await f.create();
  assert.equal((await f.request('/v1/inboxes', { method: 'POST', body: box.body })).data.id, box.id);
  assert.equal((await f.request('/v1/inboxes', { method: 'POST', body: { ...box.body, creator: '다른이름' } })).status, 409);
  const body = { submissionId: crypto.randomUUID(), guest: '친구', replies: Array(8).fill(0), storageAccepted: true };
  const path = `/v1/inboxes/${box.id}/responses`;
  await Promise.all(Array.from({ length: 8 }, () => f.request(path, { method: 'POST', body })));
  assert.equal(f.sql.prepare('SELECT COUNT(*) AS n FROM responses').get().n, 1);
  assert.equal((await f.request(path, { method: 'POST', body: { ...body, guest: '변경' } })).status, 409);
});

test('capacity, expiry and owner-only cascade deletion fail closed', async t => {
  const f = fixture(t), now = Date.now(), box = await f.create('compliment-card', {}, now);
  const path = `/v1/inboxes/${box.id}`;
  for (let i = 0; i < 100; i++) f.sql.prepare('INSERT INTO responses VALUES (?, ?, ?, ?, ?)').run(box.id, crypto.randomUUID(), `친구${i}`, '[0,0,0]', now);
  assert.equal((await f.request(`${path}/responses`, { method: 'POST', body: { submissionId: crypto.randomUUID(), guest: '초과', replies: [0, 0, 0], storageAccepted: true } })).status, 409);
  assert.equal((await f.request(`${path}/owner`, { method: 'DELETE' })).status, 403);
  assert.equal((await f.request(path, {}, box.data.expiresAt)).status, 404);
  assert.equal((await f.request(`${path}/owner`, { token: box.ownerToken }, box.data.expiresAt)).status, 404);
  await cleanup(f.env, box.data.expiresAt);
  assert.equal(f.sql.prepare('SELECT COUNT(*) AS n FROM responses').get().n, 0);
  const other = await f.create();
  assert.equal((await f.request(`/v1/inboxes/${other.id}/owner`, { method: 'DELETE', token: other.ownerToken })).status, 200);
  assert.equal((await f.request(`/v1/inboxes/${other.id}/owner`, { method: 'DELETE', token: other.ownerToken })).status, 200, 'Deletion retries are safe after a lost response');
  assert.equal((await f.request(`/v1/inboxes/${other.id}/owner`, { method: 'DELETE', token: 'b'.repeat(64) })).status, 403);
  assert.equal((await f.request(`/v1/inboxes/${other.id}`)).status, 404);
});

test('consent, strict input limits, foreign origins, rate limits and missing bindings', async t => {
  const f = fixture(t);
  assert.equal((await f.create('friendship-quiz', { storageAccepted: false })).status, 400);
  for (const extras of [{ creator: 'x'.repeat(13) }, { creator: '\n' }, { answers: [0] }, { answers: Array(8).fill(100) }, { mode: 'unsupported' }]) assert.equal((await f.create('friendship-quiz', extras)).status, 400);
  const foreign = await f.request('/v1/health', { headers: { Origin: 'https://evil.test' } });
  assert.equal(foreign.status, 403);
  assert.equal(foreign.headers.get('access-control-allow-origin'), null);
  assert.equal((await f.request('/v1/health', { method: 'OPTIONS' })).status, 204);
  const big = await f.request('/v1/inboxes', { method: 'POST', body: { x: 'a'.repeat(5000) } });
  assert.equal(big.status, 413);
  const box = await f.create();
  assert.equal((await f.request(`/v1/inboxes/${box.id}/responses`, { method: 'POST', body: { submissionId: crypto.randomUUID(), guest: '친구', replies: Array(8).fill(0) } })).status, 400);
  f.env.CREATE_LIMIT = { limit: async () => ({ success: false }) };
  assert.equal((await f.create()).status, 429);
  f.env.REQUEST_LIMIT = { limit: async () => ({ success: false }) };
  assert.equal((await f.request('/v1/health')).status, 429);
  delete f.env.DB;
  assert.equal((await f.request('/v1/health')).status, 503);
});
