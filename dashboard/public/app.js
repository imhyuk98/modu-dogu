const $ = id => document.getElementById(id);
const number = value => new Intl.NumberFormat('ko-KR').format(value ?? 0);
const el = (tag, text, className) => { const node = document.createElement(tag); if (text != null) node.textContent = text; if (className) node.className = className; return node; };
let sourceRows = null;
let landingRows = null;
let usageRows = null;
const socialEventLabels = {
  invite_create: '초대 생성', invite_open: '초대 링크 열기', invite_complete: '친구 답변 완료', shared_result_open: '결과 링크 열기',
  share_request_kakao: '카카오톡 공유 요청', share_request_x: 'X 공유 요청', share_request_line: 'LINE 공유 요청', share_request_native: '기타 앱 공유 요청', share_request_sms: '문자 공유 요청',
  instagram_guide_open: '인스타그램 안내 열기', instagram_link_copy: '인스타그램 링크 복사', share_link_copy: '링크 복사', result_image_save: '이미지 저장 요청', return_visit: '재방문',
};
function renderAnalysis() {
  const portal = $('portal-filter').value;
  const page = $('landing-filter').value;
  const matches = row => (!portal || row.portal === portal) && (!page || row.landingPage === page);
  table('landing-table', ['첫 방문 페이지', '출처 / 매체', '세션', '참여율'], landingRows?.filter(matches).map(row => [row.landingPage, `${row.sessionSource} / ${row.sessionMedium}`, number(row.sessions), percent(row.engagementRate)]) ?? null);
  table('usage-table', ['첫 방문 페이지', '사용한 페이지', '출처 / 매체', '이벤트', '횟수', '사용자'], usageRows?.filter(matches).map(row => [row.landingPage, row.pagePath, `${row.sessionSource} / ${row.sessionMedium}`, row.eventName, number(row.eventCount), number(row.totalUsers)]) ?? null);
  table('social-table', ['사용한 페이지', '출처 / 매체', '공유 단계', '횟수', '사용자'], usageRows?.filter(row => matches(row) && socialEventLabels[row.eventName]).map(row => [row.pagePath, `${row.sessionSource} / ${row.sessionMedium}`, socialEventLabels[row.eventName], number(row.eventCount), number(row.totalUsers)]) ?? null);
}
const percent = value => `${(value * 100).toFixed(1)}%`;
function renderSources() {
  renderAnalysis();
  const selected = $('portal-filter').value;
  table('source-table', ['포털', '원본 출처', '매체', '사용자', '세션', '페이지뷰'], sourceRows?.filter(row => !selected || row.portal === selected).map(row => [row.portal, row.sessionSource, row.sessionMedium, number(row.totalUsers), number(row.sessions), number(row.screenPageViews)]) ?? null);
}
function renderPortals(data) {
  landingRows = data.landing ?? null;
  usageRows = data.usage ?? null;
  const page = $('landing-filter').value;
  const pages = [...new Set([...(landingRows || []), ...(usageRows || [])].map(row => row.landingPage))].sort();
  $('landing-filter').replaceChildren(new Option('전체 첫 방문 페이지', ''), ...pages.map(path => new Option(path, path)));
  if (pages.includes(page)) $('landing-filter').value = page;
  $('analysis-limit').hidden = !data.analysisTruncated;
  table('portal-table', ['포털 / 분류', '세션', '비중', '자연 검색 세션', '페이지뷰', '참여율'], data.portals?.map(row => [row.name, number(row.sessions), percent(row.share), number(row.organicSessions), number(row.screenPageViews), percent(row.engagementRate)]) ?? null);
  sourceRows = data.sources ?? null;
  const selected = $('portal-filter').value;
  $('portal-filter').replaceChildren(new Option('전체 출처', ''), ...[...new Set((sourceRows || []).map(row => row.portal))].map(name => new Option(name, name)));
  if ([...$('portal-filter').options].some(option => option.value === selected)) $('portal-filter').value = selected;
  $('source-note').textContent = (data.sourcesTruncated ? '상위 10,000개 출처만 표시합니다. ' : '') + '비중은 조회된 출처별 세션 합계 기준이며 상단 전체 세션과 다를 수 있습니다. 사용자 수는 출처 간 중복될 수 있어 합산하지 않습니다. 네이버 검색 도메인도 GA4에서 referral로 기록될 수 있으므로 organic 수치가 모든 검색 유입을 뜻하지는 않습니다.';
  renderSources();
}
function table(target, labels, data) {
  const container = $(target); container.replaceChildren();
  if (!data?.length) { container.append(el('p', data === null ? '연결되지 않았거나 조회할 수 없습니다.' : '선택한 기간에 데이터가 없습니다.', 'muted')); return; }
  const node = el('table'); const head = el('thead'); const row = el('tr');
  labels.forEach(label => { const th = el('th', label); th.scope = 'col'; row.append(th); }); head.append(row); node.append(head);
  const body = el('tbody'); data.forEach(values => { const tr = el('tr'); values.forEach(value => tr.append(el('td', value))); body.append(tr); }); node.append(body); container.append(node);
}
function render(data) {
  renderPortals(data);
  const summary = data.summary;
  $('overview').replaceChildren(...[
    ['방문 사용자', number(summary.totalUsers), '기간 내 중복 제거'],
    ['방문 세션', number(summary.sessions), '방문 횟수'],
    ['페이지뷰', number(summary.screenPageViews), '반복 조회 포함'],
    ['참여율', `${(summary.engagementRate * 100).toFixed(1)}%`, '참여 세션 / 전체 세션'],
    ['최근 30분', data.realtime === null ? '—' : number(data.realtime), '활성 사용자 · 동시 접속자 아님'],
  ].map(([label, value, note]) => { const card = el('article', null, 'metric'); card.append(el('p', label), el('strong', value), el('small', note)); return card; }));
  drawChart(data.daily);
  table('daily-table', ['날짜', '사용자', '조회수'], data.daily.map(row => [row.date, number(row.totalUsers), number(row.screenPageViews)]));
  table('page-table', ['페이지', '조회수'], data.pages.map(row => [row.pagePath, number(row.screenPageViews)]));
  table('channel-table', ['채널', '세션'], data.channels.map(row => [row.sessionDefaultChannelGroup, number(row.sessions)]));
  table('event-table', ['이벤트', '횟수'], data.events.map(row => [row.eventName, number(row.eventCount)]));
  table('search-table', ['검색어', '클릭', '노출', 'CTR', '순위'], data.search?.map(row => [row.keys[0], number(row.clicks), number(row.impressions), `${(row.ctr * 100).toFixed(1)}%`, row.position.toFixed(1)]) ?? null);
  $('timezone').textContent = `방문 통계 날짜 기준: ${data.timezone || 'GA4 속성 시간대'}.`;
}
let busy = false;
let exampleMode = true;
function exampleData(days) {
  const values = Array.from({ length: days }, (_, i) => 12 + ((i * 13 + 7) % 31));
  const daily = values.map((value, i) => {
    const date = new Date(Date.UTC(2026, 8, 7 - days + i + 1));
    return { date: date.toISOString().slice(0, 10).replaceAll('-', ''), totalUsers: value, screenPageViews: value * 3 };
  });
  const total = values.reduce((sum, value) => sum + value, 0);
  return {
    summary: { totalUsers: Math.round(total * .8), sessions: total, screenPageViews: total * 3, engagementRate: .628 },
    daily, realtime: 3, timezone: 'Asia/Seoul · 예시', warnings: [],
    pages: ['/tools/telepathy-game','/calculators/percent','/calculators/salary','/tools/nunchi-game','/tools/never-have-i-ever'].map((pagePath, i) => ({ pagePath, screenPageViews: Math.round(total * (.8 - i * .12)) })),
    channels: [['Organic Search',.6],['Direct',.25],['Referral',.1],['Organic Social',.05]].map(([sessionDefaultChannelGroup, ratio]) => ({ sessionDefaultChannelGroup, sessions: Math.round(total * ratio) })),
    events: [['page_view',total * 3],['tool_start',Math.round(total * .7)],['tool_complete',Math.round(total * .4)],['result_share',Math.round(total * .1)]].map(([eventName,eventCount]) => ({ eventName,eventCount })),
    search: ['텔레파시 게임','퍼센트 계산기','눈치 게임','손병호 게임'].map((name,i) => ({ keys:[name],clicks:12-i*2,impressions:200+i*32,ctr:(12-i*2)/(200+i*32),position:8+i*2 })),
  };
}
function drawChart(daily) {
  $('chart').replaceChildren();
  if (!daily.length) { $('chart').append(el('p', '선택한 기간에 데이터가 없습니다.', 'muted')); return; }
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 900 240');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', '일별 사용자 추이. 아래 일별 수치 보기에서 정확한 값을 확인하세요.');
  const add = (name, attrs, text) => { const node = document.createElementNS(ns, name); Object.entries(attrs).forEach(([key,value]) => node.setAttribute(key,String(value))); if (text !== undefined) node.textContent = text; svg.append(node); return node; };
  const max = Math.max(4,...daily.map(row=>row.totalUsers));
  for (let i=0;i<5;i++) { const y=20+i*45; add('line',{x1:42,x2:880,y1:y,y2:y,class:'guide'}); add('text',{x:32,y:y+4,'text-anchor':'end'},String(Math.round(max*(1-i/4)))); }
  const points = daily.map((row,i)=>({x:daily.length===1?460:50+i/(daily.length-1)*825,y:200-row.totalUsers/max*180,row}));
  const path=points.map((p,i)=>(i?'L':'M')+p.x+','+p.y).join(' ');
  add('path',{d:path+' L'+points.at(-1).x+',200 L'+points[0].x+',200 Z',class:'area'});
  add('path',{d:path,class:'line'});
  points.forEach((p,i)=>{
    const dot=add('circle',{cx:p.x,cy:p.y,r:3});
    const title=document.createElementNS(ns,'title'); title.textContent=p.row.date+': '+p.row.totalUsers+'명';dot.append(title);
    if(i===0||i===points.length-1||i%Math.ceil(points.length/7)===0) add('text',{x:p.x,y:226,'text-anchor':'middle'},p.row.date.slice(4,6)+'/'+p.row.date.slice(6));
  });
  $('chart').append(svg);
}
async function refresh() {
  if (busy) return; busy = true; $('refresh').disabled = true; $('period').disabled = true;
  $('status').textContent = '최신 데이터를 확인하고 있습니다…';
  try {
    const response = await fetch(`/api/report?days=${$('period').value}`, { cache: 'no-store', signal: AbortSignal.timeout(45000) });
    if (response.status === 401) throw new Error('관리자 인증이 필요합니다. 페이지를 다시 열어 로그인하세요.');
    const data = await response.json(); if (!response.ok) throw new Error(data.error || '조회에 실패했습니다.');
    $('mode').hidden = data.connected;
    $('reports').hidden = false;
    $('setup').hidden = true;
    if (!data.connected) {
      $('missing').textContent = '연결 필요: ' + data.missing.join(', ');
      $('status').textContent = exampleMode ? '예시 데이터 · 아래 수치는 디자인 확인용이며 실제 홈페이지 통계가 아닙니다.' : '실제 데이터 미연결 · 데이터 연결 버튼에서 설정 방법을 확인하세요.';
      const sample = exampleData(Number($('period').value));
      if (!exampleMode) { sample.summary = { totalUsers: null, sessions: null, screenPageViews: null, engagementRate: null }; sample.realtime = null; sample.daily = []; sample.pages = []; sample.channels = []; sample.events = []; sample.search = null; }
      render(sample);
      if (!exampleMode) document.querySelectorAll('.metric strong').forEach(node => { node.textContent = '—'; });
      return;
    }
    render(data);
    $('status').textContent = `${new Date(data.updatedAt).toLocaleString('ko-KR')} 조회 완료${data.warnings.length ? ` · ${data.warnings.join(' / ')}` : ' · GA4 연결됨'}`;
  } catch (error) { $('reports').hidden = true; $('setup').hidden = true; $('status').textContent = error.message; }
  finally { busy = false; $('refresh').disabled = false; $('period').disabled = false; }
}
$('connect').addEventListener('click', () => { $('setup').hidden = !$('setup').hidden; });
$('mode').addEventListener('click', () => { exampleMode = !exampleMode; $('mode').textContent = exampleMode ? '빈 상태 보기' : '예시 화면 보기'; refresh(); });
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => { document.querySelectorAll('nav a').forEach(item => item.classList.toggle('active', item === link)); }));
document.querySelector('nav a').classList.add('active');
$('refresh').addEventListener('click', refresh); $('period').addEventListener('change', refresh);
$('portal-filter').addEventListener('change', renderSources);
$('landing-filter').addEventListener('change', renderAnalysis);
setInterval(() => { if (!document.hidden) refresh(); }, 300000);
refresh();
