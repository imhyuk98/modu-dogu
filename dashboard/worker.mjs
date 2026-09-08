import { portalName, portalSummary } from './portals.mjs';
const encoder = new TextEncoder();
const b64 = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
const encoded = value => b64(encoder.encode(JSON.stringify(value)));
export const usageEvents = ['tool_start', 'tool_complete', 'result_share', 'tool_browse_start', 'tool_question_next', 'invite_create', 'invite_open', 'invite_complete', 'shared_result_open', 'share_request', 'share_request_kakao', 'share_request_x', 'share_request_line', 'share_request_native', 'share_request_sms', 'instagram_guide_open', 'instagram_link_copy', 'share_link_copy', 'result_image_save', 'return_visit'];
const headers = {
  'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow',
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
};
const json = (data, status = 200) => Response.json(data, { status, headers });

export async function authorized(request, env) {
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 24 || !env.ADMIN_USER) return false;
  const expected = `Basic ${btoa(`${env.ADMIN_USER}:${env.ADMIN_PASSWORD}`)}`;
  const actual = request.headers.get('Authorization') || '';
  const [a, b] = await Promise.all([actual, expected].map(s => crypto.subtle.digest('SHA-256', encoder.encode(s))));
  return new Uint8Array(a).reduce((diff, v, i) => diff | (v ^ new Uint8Array(b)[i]), 0) === 0;
}

async function googleToken(env) {
  const keyData = JSON.parse(env.GOOGLE_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${encoded({ alg: 'RS256', typ: 'JWT' })}.${encoded({
    iss: keyData.client_email,
    scope: 'https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/webmasters.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  })}`;
  const pem = keyData.private_key.replace(/-----[^-]+-----|\s/g, '');
  const key = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), c => c.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, encoder.encode(unsigned));
  const response = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', signal: AbortSignal.timeout(15000), body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${b64(signature)}` }) });
  if (!response.ok) throw new Error('Google 인증 실패: 서비스 계정 설정을 확인하세요.');
  return (await response.json()).access_token;
}

async function post(url, token, body) {
  const response = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(20000), headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`데이터 조회 실패 (${response.status}). API 활성화와 읽기 권한을 확인하세요.`);
  return response.json();
}
export function rows(report) {
  return (report.rows || []).map(row => Object.fromEntries([
    ...(report.dimensionHeaders || []).map((h, i) => [h.name, row.dimensionValues[i].value]),
    ...(report.metricHeaders || []).map((h, i) => [h.name, Number(row.metricValues[i].value)]),
  ]));
}
export function searchDates(days, now = new Date()) {
  const endDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const start = new Date(`${endDate}T12:00:00Z`);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { startDate: start.toISOString().slice(0, 10), endDate };
}

export async function report(env, days) {
  const missing = ['GOOGLE_SERVICE_ACCOUNT_JSON', 'GA4_PROPERTY_ID'].filter(key => !env[key]);
  if (missing.length) return { connected: false, missing };
  if (!/^\d+$/.test(env.GA4_PROPERTY_ID)) throw new Error('GA4 속성 ID는 숫자여야 합니다. G-로 시작하는 측정 ID가 아닙니다.');
  const token = await googleToken(env);
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${env.GA4_PROPERTY_ID}`;
  const make = (dimensions, metrics) => ({ dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }], dimensions: dimensions.map(name => ({ name })), metrics: metrics.map(name => ({ name })), limit: 50 });
  const requests = [
    make([], ['totalUsers', 'sessions', 'screenPageViews', 'engagementRate']),
    { ...make(['date'], ['totalUsers', 'screenPageViews']), orderBys: [{ dimension: { dimensionName: 'date' } }] },
    { ...make(['pagePath'], ['screenPageViews']), orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }] },
    { ...make(['sessionDefaultChannelGroup'], ['sessions']), orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] },
    { ...make(['eventName'], ['eventCount']), orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] },
  ];
  const results = await Promise.allSettled([
    post(`${endpoint}:batchRunReports`, token, { requests }),
    post(`${endpoint}:runRealtimeReport`, token, { metrics: [{ name: 'activeUsers' }] }),
    env.GSC_SITE_URL ? post(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(env.GSC_SITE_URL)}/searchAnalytics/query`, token, { ...searchDates(days), dimensions: ['query'], rowLimit: 20, dataState: 'final' }) : Promise.resolve(null),
    post(`${endpoint}:runReport`, token, { ...make(['sessionSource', 'sessionMedium'], ['totalUsers', 'sessions', 'screenPageViews', 'engagedSessions']), limit: 10000, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    post(`${endpoint}:runReport`, token, { ...make(['sessionSource', 'sessionMedium', 'landingPage'], ['sessions', 'engagementRate']), limit: 10000, orderBys: [{ metric: { metricName: 'sessions' }, desc: true }] }),
    post(`${endpoint}:runReport`, token, { ...make(['sessionSource', 'sessionMedium', 'landingPage', 'pagePath', 'eventName'], ['eventCount', 'totalUsers']), limit: 10000, dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: usageEvents } } }, orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }] }),
  ]);
  if (results[0].status === 'rejected') throw results[0].reason;
  const reports = results[0].value.reports;
  const optional = i => results[i].status === 'fulfilled' ? results[i].value : null;
  return { connected: true, updatedAt: new Date().toISOString(), days, timezone: reports[0].metadata?.timeZone,
    summary: rows(reports[0])[0] || { totalUsers: 0, sessions: 0, screenPageViews: 0, engagementRate: 0 },
    daily: rows(reports[1]), pages: rows(reports[2]), channels: rows(reports[3]), events: rows(reports[4]),
    realtime: optional(1) ? rows(optional(1))[0]?.activeUsers ?? 0 : null,
    search: optional(2)?.rows ?? null,
    sources: optional(3) ? rows(optional(3)).map(row => ({ ...row, portal: portalName(row.sessionSource) })) : null,
    portals: optional(3) ? portalSummary(rows(optional(3))) : null,
    sourcesTruncated: optional(3) ? optional(3).rowCount > 10000 : false,
    landing: optional(4) ? rows(optional(4)).map(row => ({ ...row, portal: portalName(row.sessionSource) })) : null,
    usage: optional(5) ? rows(optional(5)).map(row => ({ ...row, portal: portalName(row.sessionSource) })) : null,
    analysisTruncated: [4, 5].some(i => optional(i)?.rowCount > 10000),
    warnings: results.flatMap((r, i) => r.status === 'rejected' ? [`${['기본', '실시간', '검색', '유입 출처', '첫 방문 페이지', '도구 사용'][i]}: ${r.reason.message}`] : []),
  };
}

const worker = {
  async fetch(request, env) {
    if (!await authorized(request, env)) return new Response('관리자 로그인이 필요합니다.', { status: 401, headers: { ...headers, 'WWW-Authenticate': 'Basic realm="Modu Analytics", charset="UTF-8"' } });
    if (!['GET', 'HEAD'].includes(request.method)) return json({ error: '지원하지 않는 요청입니다.' }, 405);
    const url = new URL(request.url);
    if (url.pathname === '/api/report') {
      const days = Number(url.searchParams.get('days') || 7);
      if (![1, 7, 28].includes(days)) return json({ error: '기간은 1, 7, 28일만 지원합니다.' }, 400);
      try { return json(await report(env, days)); }
      catch (error) { return json({ error: error.message.startsWith('데이터 조회') || error.message.startsWith('Google 인증') || error.message.startsWith('GA4 속성') ? error.message : '데이터 연결 설정을 확인하세요.' }, 502); }
    }
    if (!['/', '/index.html', '/app.js', '/style.css'].includes(url.pathname)) return json({ error: '페이지를 찾을 수 없습니다.' }, 404);
    const asset = await env.ASSETS.fetch(request);
    const response = new Response(asset.body, asset);
    Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  },
};
export default worker;
