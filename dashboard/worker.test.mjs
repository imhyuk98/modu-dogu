import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { authorized, rows, searchDates, report, usageEvents } from './worker.mjs';
import { portalName, portalSummary } from './portals.mjs';
test('sharing reports include requests, invitation completion and return visits separately', () => {
  for (const event of ['share_request_x', 'share_request_line', 'share_request_kakao', 'instagram_link_copy', 'invite_open', 'invite_complete', 'return_visit']) assert.ok(usageEvents.includes(event));
  assert.equal(new Set(usageEvents).size, usageEvents.length);
});

test('portal grouping respects domain boundaries and preserves weighted metrics', () => {
  for (const source of ['naver', 'm.search.naver.com', 'https://blog.naver.com/post']) assert.equal(portalName(source), '네이버');
  for (const source of ['notnaver.com', 'naver.com.evil.test']) assert.equal(portalName(source), '기타 출처');
  assert.equal(portalName('google'), '구글');
  assert.equal(portalName('search.daum.net'), '다음');
  assert.equal(portalName('bing.com'), '빙');
  assert.equal(portalName('(direct)'), '직접 방문');
  const result = portalSummary([
    { sessionSource: 'naver', sessionMedium: 'organic', sessions: 2, screenPageViews: 4, engagedSessions: 1, totalUsers: 2 },
    { sessionSource: 'm.search.naver.com', sessionMedium: 'referral', sessions: 8, screenPageViews: 16, engagedSessions: 7, totalUsers: 8 },
  ]);
  assert.deepEqual(result, [{ name: '네이버', sessions: 10, screenPageViews: 20, engagedSessions: 8, organicSessions: 2, share: 1, engagementRate: .8 }]);
  assert.deepEqual(portalSummary([]), []);
});
const env = { ADMIN_USER: 'admin', ADMIN_PASSWORD: 'a-long-test-password-for-tests-only', ASSETS: { fetch: async () => new Response('asset') } };
const request = (path = '/', password = env.ADMIN_PASSWORD) => new Request(`https://dashboard.test${path}`, { headers: { Authorization: `Basic ${btoa(`admin:${password}`)}` } });
test('all assets and APIs require authentication; unset credentials fail closed', async () => {
  for (const path of ['/', '/app.js', '/api/report']) {
    assert.equal((await worker.fetch(new Request(`https://dashboard.test${path}`), env)).status, 401);
    assert.equal((await worker.fetch(request(path, 'wrong'), env)).status, 401);
  }
  assert.equal(await authorized(request(), {}), false);
  assert.equal(await authorized(request(), { ...env, ADMIN_PASSWORD: 'short' }), false);
});
test('private responses cannot be cached or framed; unknown routes fail', async () => {
  const response = await worker.fetch(request(), env);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
  assert.match(response.headers.get('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.equal((await worker.fetch(request('/secret.json'), env)).status, 404);
});
test('missing configuration is distinct from zero traffic and validates range', async () => {
  const response = await worker.fetch(request('/api/report'), env);
  assert.deepEqual(await response.json(), { connected: false, missing: ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GA4_PROPERTY_ID'] });
  assert.equal((await worker.fetch(request('/api/report?days=999'), env)).status, 400);
  await assert.rejects(report({ GA4_PROPERTY_ID: 'G-WRONG', GOOGLE_SERVICE_ACCOUNT_JSON: '{}' }, 7), /속성 ID/);
});
test('report values stay numeric and search dates use Pacific calendar', () => {
  assert.deepEqual(rows({ dimensionHeaders: [{ name: 'date' }], metricHeaders: [{ name: 'totalUsers' }], rows: [{ dimensionValues: [{ value: '20260906' }], metricValues: [{ value: '12' }] }] }), [{ date: '20260906', totalUsers: 12 }]);
  assert.deepEqual(searchDates(7, new Date('2026-09-07T01:00:00Z')), { startDate: '2026-08-31', endDate: '2026-09-06' });
});

test('Google integration sends signed authentication, maps reports and tolerates search failure', async () => {
  const keys = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const privateKey = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('pkcs8', keys.privateKey))));
  const originalFetch = globalThis.fetch;
  let sawBatch = false;
  globalThis.fetch = async (url, options) => {
    if (url.includes('oauth2')) {
      const assertion = options.body.get('assertion');
      const parts = assertion.split('.');
      assert.equal(parts.length, 3);
      const signature = Uint8Array.from(Buffer.from(parts[2], 'base64url'));
      assert.equal(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', keys.publicKey, signature, new TextEncoder().encode(`${parts[0]}.${parts[1]}`)), true);
      return Response.json({ access_token: 'test-token' });
    }
    assert.equal(options.headers.Authorization, 'Bearer test-token');
    if (url.includes('batchRunReports')) {
      sawBatch = true;
      const { requests } = JSON.parse(options.body);
      assert.equal(requests.length, 5);
      assert.deepEqual(requests[0].dateRanges, [{ startDate: '6daysAgo', endDate: 'today' }]);
      return Response.json({ reports: requests.map(() => ({ rows: [] })) });
    }
    if (url.includes('runRealtimeReport')) return Response.json({ metricHeaders: [{ name: 'activeUsers' }], rows: [{ metricValues: [{ value: '3' }] }] });
    if (url.endsWith(':runReport')) {
      const body = JSON.parse(options.body);
      if (body.dimensions.some(d => d.name === 'landingPage')) {
        assert.equal(body.limit, 10000);
        if (body.dimensions.some(d => d.name === 'eventName')) assert.deepEqual(body.dimensionFilter.filter.inListFilter.values, usageEvents);
        return Response.json({ dimensionHeaders: body.dimensions, metricHeaders: body.metrics, rows: [], rowCount: 0 });
      }
      assert.deepEqual(body.dimensions, [{ name: 'sessionSource' }, { name: 'sessionMedium' }]);
      assert.equal(body.limit, 10000);
      return Response.json({ dimensionHeaders: body.dimensions, metricHeaders: body.metrics, rows: [{ dimensionValues: [{ value: 'm.search.naver.com' }, { value: 'referral' }], metricValues: [2, 3, 4, 1].map(value => ({ value: String(value) })) }], rowCount: 1 });
    }
    return new Response('Private Google error should not escape', { status: 403 });
  };
  try {
    const result = await report({ GA4_PROPERTY_ID: '123', GSC_SITE_URL: 'https://modu-dogu.pages.dev/', GOOGLE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'test@example.test', private_key: `-----BEGIN PRIVATE KEY-----\n${privateKey}\n-----END PRIVATE KEY-----` }) }, 7);
    assert.equal(sawBatch, true);
    assert.equal(result.connected, true);
    assert.equal(result.realtime, 3);
    assert.equal(result.search, null);
    assert.equal(result.summary.totalUsers, 0);
    assert.equal(result.portals[0].name, '네이버');
    assert.equal(result.portals[0].sessions, 3);
    assert.equal(result.sources[0].portal, '네이버');
    assert.equal(result.sourcesTruncated, false);
    assert.deepEqual(result.landing, []);
    assert.deepEqual(result.usage, []);
    assert.equal(result.analysisTruncated, false);
    assert.match(result.warnings[0], /403/);
    assert.doesNotMatch(JSON.stringify(result), /Private Google/);
  } finally { globalThis.fetch = originalFetch; }
});
