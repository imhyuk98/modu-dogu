"use client";

import { useState, useMemo, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

// ─── Zodiac Data ────────────────────────────────────────────
const 띠목록 = [
  { name: "쥐띠", emoji: "\uD83D\uDC2D", branch: "자" },
  { name: "소띠", emoji: "\uD83D\uDC2E", branch: "축" },
  { name: "호랑이띠", emoji: "\uD83D\uDC2F", branch: "인" },
  { name: "토끼띠", emoji: "\uD83D\uDC30", branch: "묘" },
  { name: "용띠", emoji: "\uD83D\uDC32", branch: "진" },
  { name: "뱀띠", emoji: "\uD83D\uDC0D", branch: "사" },
  { name: "말띠", emoji: "\uD83D\uDC34", branch: "오" },
  { name: "양띠", emoji: "\uD83D\uDC11", branch: "미" },
  { name: "원숭이띠", emoji: "\uD83D\uDC35", branch: "신" },
  { name: "닭띠", emoji: "\uD83D\uDC14", branch: "유" },
  { name: "개띠", emoji: "\uD83D\uDC36", branch: "술" },
  { name: "돼지띠", emoji: "\uD83D\uDC37", branch: "해" },
];

// ─── Improved Seeded Random (xorshift32) ────────────────────
function seededRandom(seed: number): () => number {
  let s = seed | 0;
  if (s === 0) s = 1;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return ((s >>> 0) / 0xffffffff);
  };
}

function getSeed(zodiacIdx: number): number {
  const now = new Date();
  const dateNum = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
  // Better mixing via multiple xor-shifts
  let h = (dateNum * 2654435761) ^ (zodiacIdx * 2246822519);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  h = (h ^ (h >>> 16)) >>> 0;
  return h || 1;
}

// ─── Comment Pools (15 per tier) ────────────────────────────

const 총운코멘트 = [
  // good
  [
    "오늘은 모든 일이 순조롭게 풀리는 날입니다. 자신감을 가지고 도전하세요.",
    "행운이 가득한 하루입니다. 새로운 기회가 찾아올 수 있습니다.",
    "최고의 컨디션으로 무엇이든 해낼 수 있는 날이에요.",
    "하늘이 돕는 날! 중요한 결정을 내리기에 좋은 시기입니다.",
    "에너지가 넘치는 하루, 적극적으로 행동하면 좋은 결과가 있을 거예요.",
    "운이 따르는 날입니다. 평소 미루던 일을 시작해 보세요.",
    "밝은 기운이 가득합니다. 주변 사람들에게도 좋은 영향을 줄 수 있어요.",
    "오늘은 특별한 날이 될 수 있습니다. 열린 마음으로 하루를 보내세요.",
    "긍정적인 에너지가 넘칩니다. 좋은 소식이 들려올 수 있어요.",
    "만사형통! 무엇을 해도 잘 풀리는 기운이 있습니다.",
    "오늘 시작하는 일은 큰 성공으로 이어질 가능성이 높아요.",
    "주변에서 도움의 손길이 찾아오는 날입니다. 감사히 받아들이세요.",
    "직감이 놀라울 정도로 정확한 날! 느낌을 믿으세요.",
    "오래 기다리던 좋은 소식이 도착할 수 있는 날이에요.",
    "활력과 자신감이 최고조입니다. 무대 위의 주인공처럼 빛나세요.",
  ],
  // normal
  [
    "평범하지만 안정적인 하루가 예상됩니다. 꾸준히 노력하면 성과가 있을 거예요.",
    "큰 변화는 없지만 소소한 기쁨이 있는 날입니다.",
    "무난한 하루, 급한 결정보다는 차분하게 계획을 세워보세요.",
    "보통의 하루이지만, 작은 배려가 큰 행운을 불러올 수 있습니다.",
    "특별할 것 없는 날이지만, 그래서 더 편안한 하루가 될 수 있어요.",
    "오늘은 쉬어가는 날로 삼아도 좋겠습니다. 재충전의 시간을 가지세요.",
    "평온한 하루가 예상됩니다. 주변을 돌아보며 감사하는 시간을 가져보세요.",
    "무리하지 않으면 순탄한 하루가 될 것입니다.",
    "일상의 소중함을 느끼는 하루, 가까운 사람에게 연락해 보세요.",
    "차분하게 하루를 보내면 뜻밖의 좋은 일이 생길 수 있습니다.",
    "특별한 일은 없지만 내면의 평화를 느끼는 하루가 될 거예요.",
    "루틴을 잘 지키면 작은 성취감을 맛볼 수 있습니다.",
    "오늘은 정리정돈하기 좋은 날. 주변을 깔끔히 해보세요.",
    "조용한 하루지만, 그 속에서 영감을 발견할 수 있어요.",
    "내일을 위한 준비를 하기에 딱 좋은 하루입니다.",
  ],
  // bad
  [
    "오늘은 조금 주의가 필요한 날입니다. 중요한 결정은 미루는 것이 좋겠습니다.",
    "컨디션이 좋지 않을 수 있으니 무리하지 마세요.",
    "예상치 못한 변수가 생길 수 있습니다. 여유를 가지고 대처하세요.",
    "오늘은 한 발 물러서서 관망하는 것이 유리합니다.",
    "작은 실수에 주의하세요. 꼼꼼하게 확인하는 습관이 도움이 됩니다.",
    "감정 조절에 신경 쓰는 것이 좋겠습니다. 깊은 호흡으로 마음을 다스리세요.",
    "약간의 어려움이 있을 수 있지만, 내일은 더 나아질 거예요.",
    "급하게 서두르지 마세요. 천천히 하면 오히려 좋은 결과가 나올 수 있습니다.",
    "오늘은 새로운 시작보다는 마무리에 집중하는 것이 좋겠습니다.",
    "인내가 필요한 하루입니다. 조금만 참으면 좋은 결과가 올 거예요.",
    "계획이 틀어질 수 있으니 플랜B를 준비해두세요.",
    "사소한 것에 신경 쓰다 큰 그림을 놓칠 수 있어요. 시야를 넓히세요.",
    "오늘은 도전보다 안정을 택하는 것이 현명합니다.",
    "피곤하고 무기력한 느낌이 들 수 있어요. 자신을 다독이세요.",
    "어려운 상황이 있더라도 이 또한 지나갑니다. 힘내세요!",
  ],
];

const 애정운코멘트 = [
  [
    "사랑하는 사람과 달콤한 시간을 보낼 수 있는 날이에요.",
    "새로운 만남의 기회가 있을 수 있습니다. 마음을 열어보세요.",
    "연인과 깊은 대화를 나누기 좋은 날입니다.",
    "로맨틱한 분위기가 가득합니다. 사랑을 표현해 보세요.",
    "인연의 기운이 강한 날! 주변을 잘 살펴보세요.",
    "따뜻한 감정이 오가는 하루가 될 것입니다.",
    "사랑의 운이 상승하고 있어요. 용기를 내어보세요.",
    "오늘 만나는 사람이 특별한 인연이 될 수 있습니다.",
    "연인에게 작은 선물을 하면 큰 감동을 줄 수 있어요.",
    "사랑이 꽃피는 시기입니다. 적극적으로 다가가 보세요.",
    "운명적인 만남이 기다리고 있을지도 모릅니다. 외출해 보세요.",
    "상대방의 진심을 느낄 수 있는 소중한 순간이 찾아올 거예요.",
    "오래된 연인과도 첫 설렘을 다시 느낄 수 있는 날이에요.",
    "고백이 성공할 확률이 높은 날! 지금이 기회입니다.",
    "사랑하는 사람과 함께하면 어떤 일이든 즐거워지는 하루예요.",
  ],
  [
    "편안한 관계가 유지되는 하루입니다.",
    "특별한 변화는 없지만 안정적인 애정 관계가 이어집니다.",
    "친구나 가족과의 유대가 깊어지는 날입니다.",
    "조용하지만 따뜻한 사랑을 느낄 수 있어요.",
    "평소처럼 자연스럽게 지내는 것이 좋겠습니다.",
    "작은 관심이 관계를 더 깊게 만들어줄 수 있어요.",
    "마음의 여유를 가지면 좋은 인연을 만날 수 있습니다.",
    "오늘은 혼자만의 시간도 소중합니다.",
    "감사하는 마음을 표현하면 관계가 더 좋아질 거예요.",
    "무리한 고백보다는 자연스러운 만남을 추구하세요.",
    "일상적인 대화 속에서 상대의 소중함을 재발견하는 날이에요.",
    "서로의 공간을 존중하면 관계가 더 건강해질 거예요.",
    "연락이 뜸했던 친구에게 먼저 손 내밀어 보세요.",
    "사소한 칭찬 한마디가 관계에 큰 변화를 가져올 수 있어요.",
    "급한 마음보다 여유로운 태도가 매력을 높여줍니다.",
  ],
  [
    "연인과 사소한 의견 차이가 있을 수 있으니 이해하는 마음을 가져보세요.",
    "오늘은 감정 표현에 주의가 필요합니다.",
    "오해가 생기기 쉬운 날, 명확하게 소통하세요.",
    "조금 외로움을 느낄 수 있지만 곧 좋아질 거예요.",
    "섣불리 감정적 결정을 내리지 않는 것이 좋겠습니다.",
    "연인과의 대화에서 경청이 중요한 날입니다.",
    "기대보다는 현실에 집중하면 관계가 편해질 거예요.",
    "작은 다툼에 크게 반응하지 마세요. 금방 풀릴 일입니다.",
    "오늘은 한 발짝 물러서서 상대를 바라보는 것이 좋겠습니다.",
    "인내가 필요한 시기, 조금만 기다리면 좋은 변화가 올 거예요.",
    "질투나 의심은 관계를 해칠 수 있어요. 신뢰를 유지하세요.",
    "상대방의 기분이 좋지 않을 수 있으니 배려가 필요합니다.",
    "과거의 일을 끄집어내지 마세요. 현재에 집중하는 것이 좋겠습니다.",
    "연애보다는 자기 자신에게 집중하는 것이 좋은 날이에요.",
    "감정이 격해질 수 있으니 중요한 대화는 내일로 미루세요.",
  ],
];

const 재물운코멘트 = [
  [
    "예상치 못한 수입이 생길 수 있는 행운의 날!",
    "투자나 저축을 시작하기 좋은 시기입니다.",
    "금전적으로 풍요로운 하루가 예상됩니다.",
    "돈이 들어오는 기운이 강합니다. 감사하는 마음을 잊지 마세요.",
    "재물운이 상승하고 있어요. 기회를 놓치지 마세요.",
    "뜻밖의 보너스나 선물이 있을 수 있습니다.",
    "재테크에 관심을 가져볼 좋은 시기입니다.",
    "경제적으로 안정되는 기운이 있습니다.",
    "오랫동안 기다리던 금전적 성과가 나타날 수 있어요.",
    "지출보다 수입이 많은 풍요로운 하루입니다.",
    "복권이나 이벤트에 당첨될 수 있는 행운의 기운이 있어요.",
    "부업이나 사이드 프로젝트에서 수익이 발생할 수 있습니다.",
    "오랫동안 빌려줬던 돈이 돌아올 수 있는 날이에요.",
    "쇼핑하면 좋은 물건을 저렴하게 득템할 수 있어요.",
    "금전적 결단을 내리기에 최적의 타이밍입니다.",
  ],
  [
    "큰 변동 없이 안정적인 재정 상태가 유지됩니다.",
    "계획적인 소비가 도움이 되는 날입니다.",
    "무리한 투자보다는 안전한 저축이 좋겠습니다.",
    "소소한 만족을 주는 구매가 있을 수 있어요.",
    "현재 상태를 유지하는 것이 현명합니다.",
    "특별한 지출은 없지만, 절약하는 습관을 들여보세요.",
    "재정 계획을 세우기에 좋은 날입니다.",
    "불필요한 지출을 줄이면 여유가 생길 거예요.",
    "알뜰하게 보내면 나중에 큰 기쁨이 될 수 있습니다.",
    "돈보다 경험에 투자하면 만족도가 높을 거예요.",
    "가계부를 정리하면 숨은 절약 포인트를 발견할 수 있어요.",
    "정기적금이나 자동이체 설정을 점검해 보세요.",
    "필요한 것과 원하는 것을 구분하면 지출이 줄어들 거예요.",
    "오늘은 현금 사용을 줄이고 카드 혜택을 활용해 보세요.",
    "미래를 위한 저축에 조금이라도 투자하면 마음이 편해질 거예요.",
  ],
  [
    "충동구매에 주의하세요. 필요한 것만 사는 것이 좋겠습니다.",
    "예상치 못한 지출이 있을 수 있으니 여유 자금을 확보해두세요.",
    "오늘은 큰 금액의 거래는 피하는 것이 좋겠습니다.",
    "재물에 대한 욕심을 줄이면 마음이 편해질 거예요.",
    "지갑 관리에 신경 쓰는 것이 좋겠습니다.",
    "투자 결정은 다음으로 미루는 것이 현명합니다.",
    "돈을 빌려주거나 빌리는 것은 자제해 주세요.",
    "절약이 최선의 재테크인 날입니다.",
    "사소한 금전 문제에 스트레스 받지 마세요.",
    "오늘 아끼면 내일 여유가 생길 거예요.",
    "할인이라는 말에 속지 마세요. 진짜 필요한 건지 다시 생각해 보세요.",
    "카드 명세서를 확인해 보세요. 빠져나가는 돈이 있을 수 있어요.",
    "친구의 투자 권유에 쉽게 동의하지 마세요. 신중하게 판단하세요.",
    "수리비나 의료비 등 갑작스런 지출에 대비해두세요.",
    "돈으로 해결하려 하지 말고 시간과 정성으로 대체해 보세요.",
  ],
];

const 건강운코멘트 = [
  [
    "활력이 넘치는 하루! 운동을 시작하기에 좋은 날이에요.",
    "체력이 최고조입니다. 새로운 운동에 도전해 보세요.",
    "건강 상태가 매우 좋습니다. 에너지를 적극 활용하세요.",
    "심신이 안정되어 있어 무엇이든 집중할 수 있는 날입니다.",
    "면역력이 좋은 날, 야외 활동을 즐겨보세요.",
    "잠이 잘 오고 컨디션이 좋은 하루입니다.",
    "에너지가 넘치니 생산적으로 시간을 보내세요.",
    "건강한 기운이 가득합니다. 감사한 마음으로 하루를 시작하세요.",
    "체력적으로 여유가 있으니 운동량을 조금 늘려보세요.",
    "마음도 몸도 건강한 최고의 날입니다.",
    "오늘 먹는 건강식이 평소보다 더 효과적일 거예요.",
    "맑은 정신으로 집중력이 대단히 높은 날입니다.",
    "스트레스 지수가 낮아 심신이 편안한 하루예요.",
    "새벽 운동이나 아침 조깅이 특히 상쾌하게 느껴질 날이에요.",
    "몸이 가벼워 뭐든지 할 수 있을 것 같은 기분이 들 거예요.",
  ],
  [
    "보통의 컨디션이지만 무리하지 않으면 괜찮습니다.",
    "규칙적인 생활이 건강 유지에 도움이 됩니다.",
    "충분한 수분 섭취를 잊지 마세요.",
    "가벼운 스트레칭으로 하루를 시작해 보세요.",
    "무리하지 않는 선에서 적당한 활동이 좋겠습니다.",
    "식사를 거르지 않는 것이 중요합니다.",
    "자세에 신경 쓰면 피로감이 줄어들 거예요.",
    "과식보다는 적당한 양의 식사가 좋겠습니다.",
    "잠을 충분히 자면 내일 컨디션이 좋아질 거예요.",
    "비타민 섭취를 챙기는 것이 좋겠습니다.",
    "오래 앉아있지 말고 한 시간마다 일어나서 움직여 보세요.",
    "점심 후 짧은 산책이 오후 컨디션을 좋게 만들어줄 거예요.",
    "카페인 섭취를 적당히 조절하면 수면의 질이 좋아질 거예요.",
    "오늘은 무거운 음식보다 가벼운 식단이 몸에 맞을 거예요.",
    "긴장을 풀어주는 따뜻한 차 한 잔이 도움이 될 거예요.",
  ],
  [
    "피로감이 쌓여 있을 수 있으니 충분한 휴식이 필요합니다.",
    "과로에 주의하세요. 쉬는 것도 일의 일부입니다.",
    "면역력이 떨어질 수 있으니 따뜻하게 지내세요.",
    "소화 기능이 약해질 수 있으니 음식을 조심하세요.",
    "무리한 운동은 삼가고 가벼운 산책 정도가 좋겠습니다.",
    "스트레스 관리에 신경 쓰는 것이 좋겠습니다.",
    "두통이나 어깨 결림에 주의하세요.",
    "수면 패턴이 불규칙해지지 않도록 조심하세요.",
    "찬 음식이나 음료는 자제하는 것이 좋겠습니다.",
    "오늘은 일찍 잠자리에 드는 것을 추천합니다.",
    "눈의 피로가 쌓일 수 있으니 화면을 보는 시간을 줄여보세요.",
    "허리와 목에 무리가 갈 수 있으니 자세를 점검하세요.",
    "알레르기나 감기 기운에 주의가 필요한 날이에요.",
    "식욕이 없더라도 적은 양이라도 꼭 챙겨 드세요.",
    "정신적 피로가 높은 날이니 명상이나 깊은 호흡이 도움이 됩니다.",
  ],
];

const 직장운코멘트 = [
  [
    "업무에서 뛰어난 성과를 낼 수 있는 날입니다.",
    "상사나 동료로부터 인정받을 수 있는 기회가 있습니다.",
    "중요한 프로젝트가 좋은 방향으로 진행될 거예요.",
    "창의적인 아이디어가 떠오르는 날! 적극적으로 제안하세요.",
    "업무 효율이 높은 날, 집중해서 일하면 큰 성과가 있을 거예요.",
    "승진이나 좋은 소식이 있을 수 있습니다.",
    "팀워크가 빛나는 날, 동료와의 협업이 잘 풀립니다.",
    "새로운 기회가 찾아올 수 있으니 준비하세요.",
    "리더십을 발휘하기 좋은 날입니다.",
    "오랫동안 준비한 일이 결실을 맺을 수 있어요.",
    "면접이나 발표가 있다면 최고의 결과를 기대해도 좋아요.",
    "클라이언트나 거래처와의 관계가 좋아지는 날입니다.",
    "아이디어를 메모해두세요. 나중에 큰 도움이 될 거예요.",
    "동료들이 당신의 능력을 높이 평가하는 날입니다.",
    "연봉 협상이나 조건 변경 요청에 좋은 타이밍이에요.",
  ],
  [
    "평소처럼 꾸준히 일하면 무난한 하루가 될 것입니다.",
    "급하지 않은 업무를 처리하기에 좋은 날입니다.",
    "동료와의 관계가 원만하게 유지됩니다.",
    "서류 작업이나 정리에 집중하면 효율적입니다.",
    "특별한 변화는 없지만 안정적인 업무 진행이 가능합니다.",
    "하던 일을 꾸준히 하면 조만간 좋은 결과가 있을 거예요.",
    "회의나 미팅에서 경청하는 자세가 도움이 됩니다.",
    "업무 계획을 재정비하기 좋은 시간입니다.",
    "무리한 야근보다는 효율적인 퇴근이 좋겠습니다.",
    "작은 목표를 세우고 하나씩 달성해 나가세요.",
    "이메일이나 메시지를 정리하면 생산성이 올라갈 거예요.",
    "새로운 스킬을 배우기에 좋은 날입니다. 강의를 들어보세요.",
    "조용히 자기 업무에 집중하면 의외로 많은 걸 해낼 수 있어요.",
    "워라밸을 챙기는 것이 장기적으로 업무 효율을 높여줍니다.",
    "오늘 마무리한 작은 일이 다음 주의 큰 편안함이 될 거예요.",
  ],
  [
    "직장에서 스트레스를 받을 수 있는 날, 마음의 여유를 가지세요.",
    "업무 실수에 주의하세요. 꼼꼼하게 확인하는 것이 중요합니다.",
    "동료와의 의견 충돌이 있을 수 있으니 유연하게 대처하세요.",
    "오늘은 중요한 발표나 결정은 피하는 것이 좋겠습니다.",
    "과도한 업무에 지칠 수 있으니 휴식 시간을 확보하세요.",
    "감정을 드러내기보다 냉정하게 판단하는 것이 유리합니다.",
    "예상치 못한 업무가 들어올 수 있으니 여유를 남겨두세요.",
    "완벽을 추구하기보다 적당한 수준에서 마무리하세요.",
    "상사의 지적에 감정적으로 반응하지 마세요.",
    "오늘의 어려움이 내일의 성장 밑거름이 될 거예요.",
    "중요한 서류에 오타가 없는지 두 번 세 번 확인하세요.",
    "동료에게 도움을 구하는 것도 용기입니다. 혼자 끙끙대지 마세요.",
    "회의에서 불필요한 발언은 삼가는 것이 좋겠습니다.",
    "야근이 불가피할 수 있으니 체력 안배를 잘 하세요.",
    "이직이나 퇴사 충동이 들 수 있지만 충분히 고민 후 결정하세요.",
  ],
];

const 학업운코멘트 = [
  [
    "집중력이 최고조! 공부한 내용이 머리에 쏙쏙 들어오는 날이에요.",
    "시험이 있다면 좋은 결과를 기대해도 좋습니다.",
    "새로운 개념이 쉽게 이해되는 행운의 날입니다.",
    "오래 고민하던 문제의 답이 갑자기 떠오를 수 있어요.",
    "학습 효율이 평소의 두 배! 이 기회를 놓치지 마세요.",
    "독서나 자기계발에 최적의 날입니다. 한 챕터라도 더 읽어보세요.",
    "그룹 스터디가 매우 효과적인 날이에요.",
    "선생님이나 교수님에게 좋은 피드백을 받을 수 있어요.",
    "프로젝트나 과제에서 창의적인 결과물을 만들 수 있는 날입니다.",
    "머릿속이 맑아서 암기가 잘 되는 날이에요.",
    "실기 시험이 있다면 평소 실력 이상을 발휘할 수 있어요.",
    "자격증 공부가 순조롭게 진행되는 날입니다.",
    "논문이나 리포트 작성에 영감이 샘솟는 날이에요.",
    "어려운 수학 문제도 풀릴 것 같은 기운이 느껴집니다.",
    "노트 정리를 하면 전체 맥락이 한눈에 보이는 날이에요.",
  ],
  [
    "보통의 학업 컨디션이지만, 꾸준히 하면 충분합니다.",
    "어려운 과목보다는 쉬운 과목을 먼저 공부하면 효율적이에요.",
    "오늘은 복습 위주로 공부하는 것이 좋겠습니다.",
    "무리한 공부량보다 적정 시간을 지키는 게 중요해요.",
    "혼자 공부보다 친구와 함께하면 능률이 오를 수 있어요.",
    "쉬는 시간을 적절히 가지면서 공부하면 집중력이 유지돼요.",
    "전에 배운 내용을 복습하기에 좋은 날입니다.",
    "계획표를 다시 정리하고 남은 기간을 파악해 보세요.",
    "오늘 공부한 것은 확실히 기억될 거예요. 꾸준히 하세요.",
    "모르는 부분을 정리해두면 나중에 큰 도움이 됩니다.",
    "유튜브나 온라인 강의를 활용하면 이해가 더 쉬울 거예요.",
    "암기 과목은 오늘보다 내일이 더 효율적일 수 있어요.",
    "핵심 키워드 중심으로 정리하면 시간을 아낄 수 있어요.",
    "시험 대비보다는 기초 다지기에 집중하면 좋은 날이에요.",
    "공부 환경을 바꿔보면 새로운 활력을 얻을 수 있습니다.",
  ],
  [
    "집중력이 떨어지는 날이에요. 짧은 시간 집중하고 자주 쉬세요.",
    "졸음이 올 수 있으니 환기를 자주 해주세요.",
    "어려운 과목은 오늘 피하고 가벼운 정리 위주로 공부하세요.",
    "시험이 있다면 긴장하지 말고 아는 것부터 풀어나가세요.",
    "공부가 하기 싫은 날이지만, 10분만이라도 책을 펴보세요.",
    "스마트폰 유혹에 주의! 잠시 멀리 두고 공부하세요.",
    "계획대로 진행이 안 될 수 있지만 자책하지 마세요.",
    "오늘 못한 만큼 내일 더 하면 됩니다. 부담 갖지 마세요.",
    "과제 마감이 다가온다면 완벽보다는 완성에 집중하세요.",
    "멍한 느낌이 든다면 산책 후 다시 시작해 보세요.",
    "시험 범위가 넓어 부담될 수 있지만, 중요한 부분만 골라 공부하세요.",
    "집에서 집중이 안 되면 카페나 도서관으로 장소를 옮겨보세요.",
    "오늘은 공부 대신 충분히 쉬어야 내일 효율이 올라갈 수 있어요.",
    "벼락치기보다는 전략적으로 우선순위를 정해 공부하세요.",
    "머리가 복잡하다면 명상 5분 후에 시작하면 도움이 돼요.",
  ],
];

// ─── Lucky Items ────────────────────────────────────────────

const 행운음식 = [
  "떡볶이", "치킨", "삼겹살", "김치찌개", "비빔밥", "된장찌개", "초밥",
  "짜장면", "파스타", "불고기", "냉면", "갈비탕", "순두부찌개", "카레",
  "샐러드", "우동", "햄버거", "칼국수", "떡국", "피자", "라면", "닭갈비",
  "잡채", "오므라이스", "샌드위치",
];

const 행운아이템 = [
  "손수건", "열쇠고리", "향수", "시계", "텀블러", "에코백", "노트",
  "우산", "선글라스", "스카프", "팔찌", "귀걸이", "모자", "양말",
  "핸드크림", "립밤", "볼펜", "머그컵", "쿠션", "책", "캔들", "스티커",
  "마스크팩", "보조배터리", "이어폰",
];

// ─── Daily Advice Pool (50+) ────────────────────────────────

const 오늘의조언 = [
  "오늘 할 수 있는 일을 내일로 미루지 마세요.",
  "작은 친절이 세상을 바꿀 수 있습니다.",
  "실패는 성공의 어머니입니다. 두려워하지 마세요.",
  "감사하는 마음이 행운을 불러옵니다.",
  "자신을 믿으세요. 당신은 충분히 잘하고 있습니다.",
  "어제의 나보다 오늘의 내가 조금이라도 낫다면 그것으로 충분합니다.",
  "웃으면 복이 옵니다. 오늘 하루도 미소와 함께 시작하세요.",
  "급할수록 돌아가세요. 여유가 최고의 전략입니다.",
  "건강이 최고의 재산입니다. 오늘도 건강을 챙기세요.",
  "새로운 도전은 새로운 나를 만듭니다.",
  "좋은 사람과의 만남이 인생을 바꿀 수 있습니다.",
  "지금 이 순간에 집중하면 걱정이 사라집니다.",
  "비 온 뒤에 땅이 굳어집니다. 힘든 시간도 지나갈 거예요.",
  "말 한마디의 힘을 믿으세요. 따뜻한 말이 기적을 만듭니다.",
  "완벽하지 않아도 괜찮습니다. 시작하는 것이 중요합니다.",
  "독서는 마음의 양식입니다. 오늘 책 한 페이지를 읽어보세요.",
  "타인과 비교하지 마세요. 당신만의 속도가 있습니다.",
  "작은 성취를 축하하세요. 큰 성공은 작은 성취의 모음입니다.",
  "오늘의 선택이 내일의 나를 만듭니다.",
  "때로는 쉬어가는 것도 전진입니다.",
  "사소한 것에 감동할 줄 아는 마음이 행복의 비결입니다.",
  "미래를 걱정하기보다 현재를 즐기세요.",
  "누군가에게 먼저 인사해 보세요. 좋은 인연이 시작될 수 있어요.",
  "지금 당장 할 수 있는 가장 작은 것부터 시작하세요.",
  "물 한 잔의 여유가 하루를 바꿀 수 있습니다.",
  "꿈을 꾸는 것만으로도 반은 이룬 것입니다.",
  "오늘 하루, 자신에게 칭찬 한 번 해주세요.",
  "포기하고 싶을 때가 가장 가까운 때입니다.",
  "좋은 습관 하나가 인생을 바꿉니다.",
  "오늘 뿌린 씨앗이 내일 열매가 됩니다.",
  "마음이 복잡할 때는 하늘을 올려다보세요.",
  "지나간 일은 흘려보내세요. 앞으로가 더 중요합니다.",
  "진심은 반드시 통합니다. 성실하게 다가가세요.",
  "조용한 시간이 최고의 아이디어를 만들어줍니다.",
  "가까운 사람에게 사랑한다고 말해보세요.",
  "돈보다 중요한 건 시간입니다. 오늘을 알차게 보내세요.",
  "인생은 마라톤입니다. 지금의 속도에 만족하세요.",
  "실수를 두려워하지 마세요. 그것이 배움의 시작입니다.",
  "오늘 하루를 선물이라고 생각해 보세요.",
  "혼자서도 충분히 빛나는 존재입니다.",
  "어려움 속에서 피는 꽃이 가장 아름답습니다.",
  "변화를 두려워하지 마세요. 변화 속에 기회가 있습니다.",
  "긍정의 힘을 믿으세요. 생각이 현실을 만듭니다.",
  "잠시 멈추고 심호흡 한번 해보세요. 세상이 달라 보일 거예요.",
  "나를 위한 시간을 꼭 가지세요. 그것이 진정한 사치입니다.",
  "작은 목표를 세우고 오늘 안에 달성해 보세요.",
  "가끔은 계획 없이 흘러가는 것도 좋습니다.",
  "내일의 나에게 감사받을 일을 오늘 하세요.",
  "좋은 음악 한 곡이 하루를 바꿀 수 있습니다.",
  "모든 것은 때가 있습니다. 조급해하지 마세요.",
  "행복은 먼 곳에 있지 않습니다. 지금 여기에 있어요.",
  "오늘의 노력이 미래의 자산이 됩니다.",
];

// ─── Lucky Colors & Directions ──────────────────────────────

const 행운색상 = [
  { name: "빨간색", color: "bg-red-500" },
  { name: "주황색", color: "bg-orange-500" },
  { name: "노란색", color: "bg-yellow-400" },
  { name: "초록색", color: "bg-green-500" },
  { name: "파란색", color: "bg-blue-500" },
  { name: "남색", color: "bg-indigo-600" },
  { name: "보라색", color: "bg-purple-500" },
  { name: "분홍색", color: "bg-pink-400" },
  { name: "하늘색", color: "bg-sky-400" },
  { name: "금색", color: "bg-amber-400" },
];

const 방위 = ["동", "서", "남", "북", "동남", "동북", "서남", "서북"];

// ─── Compatibility Data ─────────────────────────────────────
// Traditional zodiac compatibility (삼합/상충)
const 상성좋은띠: Record<number, number[]> = {
  0: [4, 8],   // 쥐 - 용, 원숭이
  1: [5, 9],   // 소 - 뱀, 닭
  2: [6, 10],  // 호랑이 - 말, 개
  3: [7, 11],  // 토끼 - 양, 돼지
  4: [0, 8],   // 용 - 쥐, 원숭이
  5: [1, 9],   // 뱀 - 소, 닭
  6: [2, 10],  // 말 - 호랑이, 개
  7: [3, 11],  // 양 - 토끼, 돼지
  8: [0, 4],   // 원숭이 - 쥐, 용
  9: [1, 5],   // 닭 - 소, 뱀
  10: [2, 6],  // 개 - 호랑이, 말
  11: [3, 7],  // 돼지 - 토끼, 양
};
const 상성나쁜띠: Record<number, number[]> = {
  0: [6],   // 쥐 - 말
  1: [7],   // 소 - 양
  2: [8],   // 호랑이 - 원숭이
  3: [9],   // 토끼 - 닭
  4: [10],  // 용 - 개
  5: [11],  // 뱀 - 돼지
  6: [0],   // 말 - 쥐
  7: [1],   // 양 - 소
  8: [2],   // 원숭이 - 호랑이
  9: [3],   // 닭 - 토끼
  10: [4],  // 개 - 용
  11: [5],  // 돼지 - 뱀
};

// ─── Fortune Result Type ────────────────────────────────────

interface FortuneResult {
  총운: { score: number; comment: string; gauge: number };
  애정운: { score: number; comment: string };
  재물운: { score: number; comment: string };
  건강운: { score: number; comment: string };
  직장운: { score: number; comment: string };
  학업운: { score: number; comment: string };
  행운숫자: number[];
  행운색: { name: string; color: string };
  행운방위: string;
  행운시간대: string;
  행운음식: string;
  행운아이템: string;
  오늘의조언: string;
  최고궁합띠: number;
  최악궁합띠: number;
}

// ─── Fortune Generator ──────────────────────────────────────

function generateFortune(zodiacIdx: number): FortuneResult {
  const rng = seededRandom(getSeed(zodiacIdx));

  const getScore = () => Math.floor(rng() * 5) + 1;
  const getComment = (pool: string[][], score: number) => {
    const tier = score >= 4 ? 0 : score >= 2 ? 1 : 2;
    const idx = Math.floor(rng() * pool[tier].length);
    return pool[tier][idx];
  };

  const 총운score = getScore();
  const 애정score = getScore();
  const 재물score = getScore();
  const 건강score = getScore();
  const 직장score = getScore();
  const 학업score = getScore();

  // Gauge: weighted score mapped to 1-100
  const avgScore = (총운score * 2 + 애정score + 재물score + 건강score + 직장score + 학업score) / 7;
  const gauge = Math.round(avgScore * 20);

  const nums = new Set<number>();
  while (nums.size < 3) {
    nums.add(Math.floor(rng() * 99) + 1);
  }

  const 시간대목록 = ["오전 6시~9시 (이른 아침)", "오전 9시~12시 (오전)", "오후 12시~3시 (점심 이후)", "오후 3시~6시 (오후)", "오후 6시~9시 (저녁)", "오후 9시~12시 (밤)"];

  // Compatibility: pick from pre-defined arrays, seeded
  const goodList = 상성좋은띠[zodiacIdx] || [];
  const badList = 상성나쁜띠[zodiacIdx] || [];
  const bestCompat = goodList[Math.floor(rng() * goodList.length)];
  const worstCompat = badList[Math.floor(rng() * badList.length)];

  return {
    총운: { score: 총운score, comment: getComment(총운코멘트, 총운score), gauge },
    애정운: { score: 애정score, comment: getComment(애정운코멘트, 애정score) },
    재물운: { score: 재물score, comment: getComment(재물운코멘트, 재물score) },
    건강운: { score: 건강score, comment: getComment(건강운코멘트, 건강score) },
    직장운: { score: 직장score, comment: getComment(직장운코멘트, 직장score) },
    학업운: { score: 학업score, comment: getComment(학업운코멘트, 학업score) },
    행운숫자: Array.from(nums),
    행운색: 행운색상[Math.floor(rng() * 행운색상.length)],
    행운방위: 방위[Math.floor(rng() * 방위.length)],
    행운시간대: 시간대목록[Math.floor(rng() * 시간대목록.length)],
    행운음식: 행운음식[Math.floor(rng() * 행운음식.length)],
    행운아이템: 행운아이템[Math.floor(rng() * 행운아이템.length)],
    오늘의조언: 오늘의조언[Math.floor(rng() * 오늘의조언.length)],
    최고궁합띠: bestCompat,
    최악궁합띠: worstCompat,
  };
}

// ─── Animated Stars Component ───────────────────────────────

function Stars({ score, delay = 0 }: { score: number; delay?: number }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= score; i++) {
      timers.push(
        setTimeout(() => setVisible(i), delay + i * 120)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [score, delay]);

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-lg transition-all duration-300 ${
            i <= visible
              ? "text-yellow-400 scale-110"
              : "text-gray-200 scale-100"
          }`}
          style={{
            display: "inline-block",
            transform: i <= visible ? "scale(1.15)" : "scale(1)",
            transition: `all 0.3s ease ${i * 0.05}s`,
          }}
        >
          &#x2605;
        </span>
      ))}
    </div>
  );
}

// ─── Circular Gauge Component ───────────────────────────────

function CircularGauge({ value, animated }: { value: number; animated: boolean }) {
  const [current, setCurrent] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (current / 100) * circumference;

  useEffect(() => {
    if (!animated) {
      setCurrent(value);
      return;
    }
    setCurrent(0);
    const duration = 1200;
    const startTime = performance.now();
    let frame: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value, animated]);

  // Color based on score
  const getColor = (v: number) => {
    if (v >= 75) return { stroke: "#22c55e", text: "text-green-500", bg: "from-green-500 to-emerald-400" };
    if (v >= 50) return { stroke: "#eab308", text: "text-yellow-500", bg: "from-yellow-500 to-amber-400" };
    if (v >= 30) return { stroke: "#f97316", text: "text-orange-500", bg: "from-orange-500 to-amber-500" };
    return { stroke: "#ef4444", text: "text-red-500", bg: "from-red-500 to-rose-400" };
  };

  const colors = getColor(current);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animated ? "none" : "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${colors.text}`}>{current}</span>
        <span className="text-xs text-gray-400">/ 100</span>
      </div>
    </div>
  );
}

// ─── Get Gradient for Overall Fortune ───────────────────────

function getOverallGradient(gauge: number): string {
  if (gauge >= 75) return "from-green-500 to-emerald-400";
  if (gauge >= 50) return "from-yellow-500 to-amber-400";
  if (gauge >= 30) return "from-orange-500 to-amber-500";
  return "from-red-500 to-rose-400";
}

// ─── Main Component ─────────────────────────────────────────

export default function DailyFortune() {
  const [mode, setMode] = useState<"select" | "year">("select");
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null);
  const [birthYear, setBirthYear] = useState("");
  const [result, setResult] = useState<FortuneResult | null>(null);
  const [activeZodiac, setActiveZodiac] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const today = useMemo(() => {
    const d = new Date();
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${dayNames[d.getDay()]}요일)`;
  }, []);

  const handleSelectZodiac = (idx: number) => {
    setSelectedZodiac(idx);
    setActiveZodiac(idx);
    setResult(generateFortune(idx));
    setCopied(false);
  };

  const handleYearSubmit = () => {
    const y = parseInt(birthYear);
    if (!y || y < 1900 || y > 2100) return;
    const idx = (y - 4) % 12;
    setSelectedZodiac(idx);
    setActiveZodiac(idx);
    setResult(generateFortune(idx));
    setCopied(false);
  };

  const handleReset = () => {
    setSelectedZodiac(null);
    setActiveZodiac(null);
    setResult(null);
    setBirthYear("");
    setCopied(false);
  };

  const handleShare = async () => {
    if (!result || selectedZodiac === null) return;
    const z = 띠목록[selectedZodiac];
    const stars = (s: number) => "\u2605".repeat(s) + "\u2606".repeat(5 - s);
    const text = [
      `[오늘의 운세] ${today}`,
      `${z.emoji} ${z.name}`,
      ``,
      `총운: ${stars(result.총운.score)} (${result.총운.gauge}점)`,
      `애정운: ${stars(result.애정운.score)}`,
      `재물운: ${stars(result.재물운.score)}`,
      `건강운: ${stars(result.건강운.score)}`,
      `직장운: ${stars(result.직장운.score)}`,
      `학업운: ${stars(result.학업운.score)}`,
      ``,
      `행운의 숫자: ${result.행운숫자.join(", ")}`,
      `행운의 색상: ${result.행운색.name}`,
      `행운의 시간대: ${result.행운시간대}`,
      `행운의 음식: ${result.행운음식}`,
      ``,
      `오늘의 한마디: "${result.오늘의조언}"`,
      ``,
      `나도 운세 보러가기 -> 계산기나라`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const fortuneCards: {
    label: string;
    emoji: string;
    key: "애정운" | "재물운" | "건강운" | "직장운" | "학업운";
  }[] = [
    { label: "애정운", emoji: "\u2764\uFE0F", key: "애정운" },
    { label: "재물운", emoji: "\uD83D\uDCB0", key: "재물운" },
    { label: "건강운", emoji: "\uD83D\uDCAA", key: "건강운" },
    { label: "직장운", emoji: "\uD83D\uDCBC", key: "직장운" },
    { label: "학업운", emoji: "\uD83D\uDCDA", key: "학업운" },
  ];

  return (
    <div className="py-4">
      {/* Header with Date */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">오늘의 운세</h1>
        <p className="text-gray-500 mb-3">
          나의 띠로 오늘의 운세를 확인하세요. 매일 새로운 운세가 제공됩니다.
        </p>
        <div className="inline-block bg-gradient-to-r from-orange-100 to-amber-100 rounded-full px-5 py-2">
          <span className="text-orange-700 font-semibold text-sm">{today}</span>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("select")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            mode === "select" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          띠 직접 선택
        </button>
        <button
          onClick={() => setMode("year")}
          className={`px-4 py-2 text-sm rounded-lg transition-colors ${
            mode === "year" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          생년으로 자동 계산
        </button>
      </div>

      {/* Zodiac Grid Selection */}
      {mode === "select" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">나의 띠를 선택하세요</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {띠목록.map((z, i) => (
              <button
                key={z.name}
                onClick={() => handleSelectZodiac(i)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  activeZodiac === i
                    ? "border-orange-400 bg-orange-50 ring-2 ring-orange-300"
                    : "border-gray-200 hover:border-orange-300 hover:bg-orange-50"
                }`}
              >
                <div className="text-2xl">{z.emoji}</div>
                <div className="text-xs text-gray-600 mt-1">{z.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Year Input */}
      {mode === "year" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-700 mb-3">출생년도를 입력하세요</h2>
          <div className="flex gap-3 max-w-sm">
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleYearSubmit()}
              placeholder="예: 1990"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleYearSubmit}
              className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              확인
            </button>
          </div>
          {selectedZodiac !== null && mode === "year" && (
            <p className="text-sm text-gray-500 mt-2">
              {띠목록[selectedZodiac].emoji} {띠목록[selectedZodiac].name}
            </p>
          )}
        </div>
      )}

      {/* ─── Results ─── */}
      {result && selectedZodiac !== null && (
        <div className="space-y-4">
          {/* Overall Fortune Header with Gauge */}
          <div className={`bg-gradient-to-br ${getOverallGradient(result.총운.gauge)} rounded-xl p-6 text-white`}>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="flex flex-col items-center">
                <CircularGauge value={result.총운.gauge} animated={true} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-4xl mb-1">{띠목록[selectedZodiac].emoji}</div>
                <h2 className="text-xl font-bold mb-1">
                  {띠목록[selectedZodiac].name} 오늘의 운세
                </h2>
                <div className="flex justify-center sm:justify-start mb-2">
                  <Stars score={result.총운.score} delay={300} />
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{result.총운.comment}</p>
              </div>
            </div>
          </div>

          {/* Today's Advice */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-5">
            <div className="flex items-start gap-3">
              <span className="text-2xl shrink-0">&#x1F4AC;</span>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">오늘의 한마디</h3>
                <p className="text-gray-700 text-sm italic leading-relaxed">
                  &ldquo;{result.오늘의조언}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* Fortune Cards */}
          {fortuneCards.map((item, idx) => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">
                  {item.emoji} {item.label}
                </h3>
                <Stars score={result[item.key].score} delay={400 + idx * 150} />
              </div>
              <p className="text-gray-600 text-sm">{result[item.key].comment}</p>
            </div>
          ))}

          {/* Compatibility */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">&#x1F91D; 오늘의 띠 궁합</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <div className="text-xs text-gray-500 mb-1">최고 궁합</div>
                <div className="text-3xl mb-1">{띠목록[result.최고궁합띠].emoji}</div>
                <div className="font-bold text-green-600">{띠목록[result.최고궁합띠].name}</div>
                <div className="text-xs text-gray-400 mt-1">함께하면 행운 UP!</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-red-200">
                <div className="text-xs text-gray-500 mb-1">주의 궁합</div>
                <div className="text-3xl mb-1">{띠목록[result.최악궁합띠].emoji}</div>
                <div className="font-bold text-red-500">{띠목록[result.최악궁합띠].name}</div>
                <div className="text-xs text-gray-400 mt-1">오늘은 살짝 조심!</div>
              </div>
            </div>
          </div>

          {/* Lucky Info Grid */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4">&#x1F340; 오늘의 행운 정보</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x1F522;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 숫자</div>
                <div className="font-bold text-amber-700">
                  {result.행운숫자.join(", ")}
                </div>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x1F3A8;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 색상</div>
                <div className="flex items-center justify-center gap-2">
                  <span className={`inline-block w-4 h-4 rounded-full ${result.행운색.color}`} />
                  <span className="font-bold text-amber-700">{result.행운색.name}</span>
                </div>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x1F9ED;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 방위</div>
                <div className="font-bold text-amber-700">{result.행운방위}</div>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x23F0;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 시간대</div>
                <div className="font-bold text-amber-700 text-sm">{result.행운시간대}</div>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x1F35C;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 음식</div>
                <div className="font-bold text-amber-700">{result.행운음식}</div>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg">
                <div className="text-lg mb-1">&#x1F392;</div>
                <div className="text-xs text-gray-500 mb-1">행운의 아이템</div>
                <div className="font-bold text-amber-700">{result.행운아이템}</div>
              </div>
            </div>
          </div>

          {/* Share & Reset Buttons */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleShare}
              className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }`}
            >
              {copied ? "&#x2705; 클립보드에 복사되었습니다!" : "&#x1F4CB; 결과 공유하기"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              초기화
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              운세는 재미를 위한 것으로, 하루의 작은 즐거움이 되길 바랍니다.
            </p>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">오늘의 운세란?</h2>
          <p className="text-gray-600 leading-relaxed">
            오늘의 운세는 12가지 띠(자축인묘진사오미신유술해)를 기반으로
            매일 달라지는 운세를 제공하는 서비스입니다. 총운, 애정운, 재물운,
            건강운, 직장운, 학업운의 6가지 항목과 함께 행운의 시간대, 음식,
            아이템, 띠 궁합까지 확인할 수 있습니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">띠(12지)란?</h2>
          <p className="text-gray-600 leading-relaxed">
            12지는 자(쥐), 축(소), 인(호랑이), 묘(토끼), 진(용), 사(뱀),
            오(말), 미(양), 신(원숭이), 유(닭), 술(개), 해(돼지)의 12가지 동물로,
            출생년도에 따라 정해집니다. 한국에서는 나이를 물을 때 &ldquo;무슨 띠세요?&rdquo;라고
            묻는 문화가 있으며, 각 띠별로 고유한 성격과 특성이 있다고 전해집니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">띠 궁합이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            동양의 전통적인 삼합(三合)과 상충(相沖) 이론에 따라 12가지 띠 사이에는
            서로 잘 맞는 궁합과 조심해야 할 궁합이 있다고 전해집니다.
            예를 들어 쥐띠는 용띠, 원숭이띠와 삼합을 이루며, 말띠와는 상충 관계에 있습니다.
            물론 이는 전통적인 해석으로, 재미로 참고하시면 좋습니다.
          </p>
        </div>
      </section>

      <RelatedTools current="daily-fortune" />
    </div>
  );
}
