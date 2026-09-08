// Generated, non-personal preview assets. Needs a Korean system font.
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { moonShape } from '../lib/social-card.ts';
const entries = [
  ['friendship-quiz', ['나에 대한','우정고사'], '친구는 나를 얼마나 알고 있을까?', '8개 질문 · 링크로 도전장 보내기', 'report'],
  ['friend-manual', ['친구가 쓰는','내 사용 설명서'], '친구의 시선으로 완성되는 나', '5번의 선택 · 한 장의 설명서', 'manual'],
  ['friend-chemistry', ['우리 둘의','취향 교집합'], '같은 선택도, 다른 선택도 좋아', '각자 고르고 · 함께 비교하기', 'chemistry'],
  ['compliment-card', ['너에게 주는','작은 상장'], '쑥스러웠던 칭찬, 한 장에 담아', '고마운 친구에게 · 칭찬 카드', 'award'],
  ['moon-compatibility', ['우리 둘의','생일 달 카드'], '두 생일로 그려보는 우리의 밤', '오락용 달 모티브 · 실제 궁합 진단 아님', 'moon'],
];
await mkdir('public/og/social',{recursive:true});
for(const [slug,title,description,note,kind] of entries){
  const night=kind==='moon',ink=night?'#f8f0df':'#26231e',paper=night?'#1e2637':'#f4f0e8',accent=night?'#e9c488':'#a93d28',muted=night?'#c8cbd4':'#625c53';
  let art='';
  if(kind==='moon') art=[1,6].map((phase,i)=>`<g transform="translate(${i?1010:815} 315)"><circle r="80" fill="#414b63"/><path d="${moonShape(phase,80)}" fill="#f6dcaa"/></g>`).join('');
  if(kind==='chemistry') art='<circle cx="850" cy="315" r="115" fill="#e8b6a2"/><circle cx="970" cy="315" r="115" fill="#d6d8c6"/><path d="M910 217 A115 115 0 0 1 910 413 A115 115 0 0 1 910 217" fill="#a93d28"/>';
  if(kind==='report') art='<g transform="rotate(-8 930 315)"><rect x="780" y="190" width="290" height="240" rx="8" fill="#fffcf7" stroke="#a93d28" stroke-width="4"/><text x="925" y="340" text-anchor="middle" font-size="130" font-weight="900" fill="#a93d28">?</text><path d="M810 385H1040" stroke="#d8d1c5" stroke-width="2"/></g>';
  if(kind==='manual') art='<rect x="790" y="175" width="260" height="310" rx="6" fill="#fffcf7" stroke="#d8d1c5" stroke-width="3"/>'+[0,1,2,3].map(i=>`<circle cx="816" cy="${220+i*65}" r="7" fill="#a93d28"/><path d="M845 ${220+i*65}H1015" stroke="#d8d1c5" stroke-width="3"/>`).join('');
  if(kind==='award') art='<path d="M855 350L815 500L920 450L1025 500L985 350" fill="#a93d28"/><circle cx="920" cy="290" r="120" fill="#e8c77e"/><circle cx="920" cy="290" r="90" fill="#f4f0e8"/><path d="M920 225L939 268L985 274L949 305L958 353L920 329L882 353L891 305L855 274L901 268Z" fill="#a93d28"/>';
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${paper}"/><rect x="28" y="28" width="1144" height="574" rx="8" fill="none" stroke="${night?'#566078':'#d8d1c5'}"/><g font-family="Malgun Gothic,Noto Sans KR,sans-serif"><text x="64" y="98" font-size="28" font-weight="700" fill="${ink}">모두의도구</text><text x="64" y="161" font-size="22" fill="${accent}">친구랑, 한 장.</text><text x="64" y="277" font-size="72" font-weight="900" fill="${ink}">${title[0]}</text><text x="64" y="371" font-size="72" font-weight="900" fill="${ink}">${title[1]}</text><text x="64" y="447" font-size="28" fill="${muted}">${description}</text><text x="64" y="551" font-size="22" fill="${muted}">${note}</text>${art}</g></svg>`;
  await writeFile(`public/og/social/${slug}.svg`,svg);
  await sharp(Buffer.from(svg)).png().toFile(`public/og/social/${slug}.png`);
  console.log(`Generated ${slug}.png (1200×630)`);
}
