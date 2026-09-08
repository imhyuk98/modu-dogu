// Exact source aliases and domain boundaries avoid matching unrelated lookalikes.
export function portalName(source) {
  const value = String(source || '').trim().toLowerCase();
  if (value === '(direct)') return '직접 방문';
  if (!value || ['(not set)', '(data not available)', '(other)'].includes(value)) return '알 수 없음';
  let host = value;
  try { host = new URL(value.includes('://') ? value : `https://${value}`).hostname; } catch { /* Keep original source. */ }
  const domain = name => host === name || host.endsWith(`.${name}`);
  if (value === 'naver' || domain('naver.com')) return '네이버';
  if (value === 'google' || domain('google.com') || domain('google.co.kr') || domain('google.co.jp') || domain('google.co.uk')) return '구글';
  if (value === 'daum' || domain('daum.net')) return '다음';
  if (value === 'bing' || domain('bing.com')) return '빙';
  if (value === 'nate' || domain('nate.com')) return '네이트';
  if (value === 'yahoo' || domain('yahoo.com') || domain('yahoo.co.jp')) return '야후';
  if (value === 'zum' || domain('zum.com')) return '줌';
  if (value === 'duckduckgo' || domain('duckduckgo.com')) return '덕덕고';
  return '기타 출처';
}

export function portalSummary(sources) {
  const groups = new Map();
  for (const row of sources) {
    const name = portalName(row.sessionSource);
    const group = groups.get(name) || { name, sessions: 0, screenPageViews: 0, engagedSessions: 0, organicSessions: 0 };
    group.sessions += row.sessions;
    group.screenPageViews += row.screenPageViews;
    group.engagedSessions += row.engagedSessions;
    if (row.sessionMedium.toLowerCase() === 'organic') group.organicSessions += row.sessions;
    groups.set(name, group);
  }
  const total = sources.reduce((sum, row) => sum + row.sessions, 0);
  return [...groups.values()].map(group => ({ ...group, share: total ? group.sessions / total : 0, engagementRate: group.sessions ? group.engagedSessions / group.sessions : 0 })).sort((a, b) => b.sessions - a.sessions);
}
