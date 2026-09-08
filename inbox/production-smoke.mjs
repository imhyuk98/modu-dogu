import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
const api = 'https://modu-friend-inbox.huni1260.workers.dev';
const origin = 'https://modu-dogu.pages.dev';
const token = randomBytes(32).toString('hex');
let id;
async function request(path, method = 'GET', body, ownerToken) {
  const response = await fetch(`${api}/v1${path}`, { method, signal: AbortSignal.timeout(15000), headers: { Origin: origin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(ownerToken ? { Authorization: `Bearer ${ownerToken}` } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
  return { status: response.status, data: await response.json(), headers: response.headers };
}
try {
  assert.equal((await request('/health')).status, 200);
  const box = await request('/inboxes', 'POST', { ownerToken: token, mode: 'friendship-quiz', creator: '운영검증', answers: Array(8).fill(0), storageAccepted: true });
  assert.equal(box.status, 201); id = box.data.id;
  assert.equal((await request(`/inboxes/${id}`)).data.answers, undefined);
  const reply = { submissionId: randomUUID(), guest: '검증친구', replies: Array(8).fill(0), storageAccepted: true };
  assert.equal((await request(`/inboxes/${id}/responses`, 'POST', reply)).data.saved, true);
  assert.equal((await request(`/inboxes/${id}/responses`, 'POST', reply)).data.saved, true);
  assert.equal((await request(`/inboxes/${id}/owner`)).status, 403);
  const owner = await request(`/inboxes/${id}/owner`, 'GET', undefined, token);
  assert.equal(owner.data.responses.length, 1);
  assert.equal(owner.headers.get('cache-control'), 'no-store, private');
  assert.ok(!JSON.stringify(owner.data).includes(token));
  assert.equal((await request(`/inboxes/${id}/owner`, 'DELETE', undefined, token)).data.deleted, true);
  assert.equal((await request(`/inboxes/${id}`)).status, 404);
  console.log('PASS production inbox: real D1 create/save/idempotent retry/private access/delete; synthetic records removed');
} finally {
  if (id) await request(`/inboxes/${id}/owner`, 'DELETE', undefined, token);
}
