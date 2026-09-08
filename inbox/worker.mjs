import { socialModes, validAnswers, isComparison } from '../lib/social-games.ts';

const LIFETIME = 30 * 24 * 60 * 60 * 1000;
const MAX_RESPONSES = 100;
const hexToken = /^[a-f0-9]{64}$/;
const inboxId = /^[a-f0-9]{32}$/;
const submissionId = /^[a-f0-9-]{36}$/;
const validName = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 12 && !/[\u0000-\u001f\u007f]/.test(value);
export async function hash(value) {
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))), byte => byte.toString(16).padStart(2, '0')).join('');
}
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
async function readBody(request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new HttpError(415, 'JSON 요청이 필요합니다.');
  if (Number(request.headers.get('content-length')) > 4096) throw new HttpError(413, '입력 내용이 너무 깁니다.');
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, '입력 내용을 확인해 주세요.');
  let bytes = 0, raw = '';
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > 4096) { await reader.cancel(); throw new HttpError(413, '입력 내용이 너무 깁니다.'); }
    raw += decoder.decode(value, { stream: true });
  }
  try {
    const result = JSON.parse(raw + decoder.decode());
    if (!result || typeof result !== 'object' || Array.isArray(result)) throw Error();
    return result;
  } catch { throw new HttpError(400, '입력 내용을 확인해 주세요.'); }
}
function publicInbox(row) {
  return { id: row.id, mode: row.mode, creator: row.creator, createdAt: row.created_at, expiresAt: row.expires_at, maxResponses: MAX_RESPONSES };
}
function resultPayload(box, reply) {
  return { v: 1, mode: box.mode, kind: 'result', id: box.id, creator: box.creator, answers: JSON.parse(box.answers), guest: reply.guest, replies: JSON.parse(reply.replies) };
}
async function activeInbox(db, id, now) {
  const box = await db.prepare('SELECT * FROM inboxes WHERE id = ? AND expires_at > ?').bind(id, now).first();
  if (!box) throw new HttpError(404, '결과함이 만료되었거나 삭제됐어요. 링크를 확인해 주세요.');
  return box;
}
async function requireOwner(request, box) {
  const token = request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  if (!token || await hash(token) !== box.owner_hash) throw new HttpError(403, '생성자 전용 결과함 주소가 필요합니다.');
}
export async function handleRequest(request, env, now = Date.now()) {
  const origin = request.headers.get('origin');
  const allowed = (env.ALLOWED_ORIGINS ?? '').split(',').filter(Boolean).includes(origin);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store, private',
    'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'", 'Vary': 'Origin',
    ...(allowed ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '600' } : {}),
  };
  const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  try {
    if (!allowed) throw new HttpError(403, '허용된 홈페이지에서 이용해 주세요.');
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!env.DB || !env.REQUEST_LIMIT || !env.CREATE_LIMIT) throw new HttpError(503, '결과함 연결을 준비 중입니다. 잠시 후 다시 시도해 주세요.');
    // Only a daily pseudonym reaches the in-memory limiter; no IP is stored in D1.
    const visitor = await hash(`${Math.floor(now / 86400000)}:${request.headers.get('cf-connecting-ip') ?? 'local'}`);
    if (!(await env.REQUEST_LIMIT.limit({ key: visitor })).success) throw new HttpError(429, '요청이 많습니다. 1분 뒤 다시 시도해 주세요.');
    const { pathname, search } = new URL(request.url);
    if (search) throw new HttpError(400, '주소 매개변수는 지원하지 않습니다.');
    if (pathname === '/v1/health' && request.method === 'GET') {
      await env.DB.prepare('SELECT id FROM inboxes LIMIT 1').first();
      return json({ ok: true, version: 1 });
    }
    if (pathname === '/v1/inboxes' && request.method === 'POST') {
      if (!(await env.CREATE_LIMIT.limit({ key: visitor })).success) throw new HttpError(429, '새 결과함 생성이 많습니다. 1분 뒤 다시 시도해 주세요.');
      const body = await readBody(request);
      if (body.storageAccepted !== true || !hexToken.test(body.ownerToken ?? '') || !socialModes.includes(body.mode) || !validName(body.creator) || (isComparison(body.mode) ? !validAnswers(body.mode, body.answers) : !Array.isArray(body.answers) || body.answers.length !== 0)) throw new HttpError(400, '저장 안내와 닉네임·선택 내용을 확인해 주세요.');
      const ownerHash = await hash(body.ownerToken);
      // A public invitation ID cannot be claimed by someone choosing that ID.
      const id = ownerHash.slice(0, 32);
      const creator = body.creator.trim(), answers = JSON.stringify(body.answers);
      await env.DB.prepare('INSERT INTO inboxes (id, owner_hash, mode, creator, answers, created_at, expires_at) SELECT ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM inboxes) < 10000 ON CONFLICT(id) DO NOTHING').bind(id, ownerHash, body.mode, creator, answers, now, now + LIFETIME).run();
      const box = await env.DB.prepare('SELECT * FROM inboxes WHERE id = ?').bind(id).first();
      if (!box) throw new HttpError(503, '결과함이 가득 찼습니다. 나중에 다시 시도해 주세요.');
      if (box.owner_hash !== ownerHash || box.mode !== body.mode || box.creator !== creator || box.answers !== answers) throw new HttpError(409, '이 생성 요청은 이미 사용됐어요. 새로 만들어 주세요.');
      if (box.expires_at <= now) throw new HttpError(410, '이 결과함은 만료됐어요. 새로 만들어 주세요.');
      return json(publicInbox(box), 201);
    }
    const route = pathname.match(/^\/v1\/inboxes\/([a-f0-9]{32})(?:\/(responses|owner))?$/);
    if (!route || !inboxId.test(route[1])) throw new HttpError(404, '찾을 수 없는 주소입니다.');
    const [, id, action] = route;
    if (action === 'owner' && request.method === 'DELETE') {
      const token = request.headers.get('authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
      const ownerHash = token ? await hash(token) : '';
      if (!token || ownerHash.slice(0, 32) !== id) throw new HttpError(403, '생성자 전용 결과함 주소가 필요합니다.');
      // The capability identifies its inbox even after deletion/expiry. A lost
      // deletion response can safely be retried without exposing any contents.
      await env.DB.prepare('DELETE FROM inboxes WHERE id = ? AND owner_hash = ?').bind(id, ownerHash).run();
      return json({ deleted: true });
    }
    const box = await activeInbox(env.DB, id, now);
    if (!action && request.method === 'GET') return json(publicInbox(box));
    if (action === 'owner') {
      await requireOwner(request, box);
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT submission_id, guest, replies, created_at FROM responses WHERE inbox_id = ? ORDER BY created_at DESC, submission_id LIMIT 100').bind(id).all();
        return json({ ...publicInbox(box), responses: results.map(row => ({ id: row.submission_id, createdAt: row.created_at, result: resultPayload(box, row) })) });
      }
    }
    if (action === 'responses' && request.method === 'POST') {
      const body = await readBody(request);
      if (body.storageAccepted !== true || !submissionId.test(body.submissionId ?? '') || !validName(body.guest) || !validAnswers(box.mode, body.replies)) throw new HttpError(400, '저장 안내와 닉네임·답변을 확인해 주세요.');
      const guest = body.guest.trim(), replies = JSON.stringify(body.replies);
      // One atomic statement enforces capacity and expiry even with concurrent requests.
      await env.DB.prepare('INSERT INTO responses (inbox_id, submission_id, guest, replies, created_at) SELECT ?, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM inboxes WHERE id = ? AND expires_at > ?) AND (SELECT COUNT(*) FROM responses WHERE inbox_id = ?) < ? ON CONFLICT(inbox_id, submission_id) DO NOTHING').bind(id, body.submissionId, guest, replies, now, id, now, id, MAX_RESPONSES).run();
      const saved = await env.DB.prepare('SELECT guest, replies FROM responses WHERE inbox_id = ? AND submission_id = ?').bind(id, body.submissionId).first();
      if (!saved) throw new HttpError(409, '응답이 100개 모였거나 결과함이 종료됐어요. 생성자에게 새 링크를 요청해 주세요.');
      if (saved.guest !== guest || saved.replies !== replies) throw new HttpError(409, '이미 제출한 답변과 달라요. 새 참여로 다시 시작해 주세요.');
      return json({ saved: true, result: resultPayload(box, saved) });
    }
    throw new HttpError(405, '지원하지 않는 요청입니다.');
  } catch (error) {
    // Never log names, answers, request bodies, bearer tokens or raw SQL errors.
    return json({ error: error instanceof HttpError ? error.message : '저장을 확인하지 못했어요. 입력을 유지한 채 다시 시도해 주세요.' }, error instanceof HttpError ? error.status : 503);
  }
}
export async function cleanup(env, now = Date.now()) {
  return env.DB.prepare('DELETE FROM inboxes WHERE expires_at <= ?').bind(now).run();
}
const worker = {
  fetch: (request, env) => handleRequest(request, env),
  scheduled: (_controller, env, context) => context.waitUntil(cleanup(env)),
};
export default worker;
