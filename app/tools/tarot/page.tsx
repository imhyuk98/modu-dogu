"use client";

import { useState, useCallback, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ═══════════════════════════════════════════
   Major Arcana — 22 cards
   ═══════════════════════════════════════════ */
interface TarotCard {
  number: number;
  name: string;
  engName: string;
  symbol: string;
  uprightMeaning: string;
  reversedMeaning: string;
  love: string;
  career: string;
  finance: string;
  advice: string;
  reversedLove: string;
  reversedCareer: string;
  reversedFinance: string;
  reversedAdvice: string;
}

const MAJOR_ARCANA: TarotCard[] = [
  {
    number: 0,
    name: "바보",
    engName: "The Fool",
    symbol: "\u2661",
    uprightMeaning: "새로운 시작, 순수함, 모험, 자유로운 영혼, 무한한 가능성",
    reversedMeaning: "무모함, 부주의, 위험 무시, 방향 상실, 경솔한 판단",
    love: "새로운 인연이 다가오고 있습니다. 두려움 없이 마음을 열어보세요.",
    career: "새로운 프로젝트나 직업에 도전할 때입니다. 신선한 시작이 기다립니다.",
    finance: "투자에 대한 새로운 기회가 있지만, 기본적인 조사는 필요합니다.",
    advice: "두려움을 내려놓고 새로운 여정을 시작하세요. 당신 안의 순수한 열정을 믿으세요.",
    reversedLove: "감정에 휘둘려 성급한 결정을 내리지 마세요. 신중함이 필요합니다.",
    reversedCareer: "준비 없는 도전은 위험합니다. 계획을 세운 후 행동하세요.",
    reversedFinance: "충동적인 소비를 조심하세요. 재정 계획을 다시 점검할 때입니다.",
    reversedAdvice: "무모한 행동을 자제하세요. 한 발짝 물러서서 상황을 객관적으로 바라보세요.",
  },
  {
    number: 1,
    name: "마법사",
    engName: "The Magician",
    symbol: "\u2605",
    uprightMeaning: "창조력, 의지력, 능력, 집중, 기술의 활용",
    reversedMeaning: "속임수, 능력 낭비, 자신감 부족, 조종, 미숙함",
    love: "당신의 매력이 빛나는 시기입니다. 적극적으로 다가가면 좋은 결과가 있습니다.",
    career: "능력을 발휘할 기회가 옵니다. 자신감을 가지고 리더십을 보여주세요.",
    finance: "재능을 활용한 수입 창출이 가능합니다. 부업이나 투자를 고려해보세요.",
    advice: "당신에게는 필요한 모든 도구가 있습니다. 집중하고 의지를 발휘하세요.",
    reversedLove: "상대방의 진심을 확인하세요. 겉모습에 속지 않도록 주의하세요.",
    reversedCareer: "능력을 제대로 발휘하지 못하고 있습니다. 집중력을 높이세요.",
    reversedFinance: "사기나 속임수에 주의하세요. 투자 결정은 신중하게 내려야 합니다.",
    reversedAdvice: "자신의 능력을 과소평가하지 마세요. 하지만 남을 속이려 하지도 마세요.",
  },
  {
    number: 2,
    name: "여사제",
    engName: "High Priestess",
    symbol: "\u263D",
    uprightMeaning: "직관, 무의식, 지혜, 신비, 내면의 목소리",
    reversedMeaning: "직관 무시, 비밀, 감정 억압, 혼란, 표면적 판단",
    love: "직감을 따르세요. 마음 깊은 곳에서 답을 알고 있습니다.",
    career: "직관을 믿고 결정하세요. 보이지 않는 기회가 다가오고 있습니다.",
    finance: "숨겨진 재정적 기회가 있습니다. 꼼꼼히 살펴보세요.",
    advice: "내면의 목소리에 귀를 기울이세요. 명상과 성찰의 시간이 필요합니다.",
    reversedLove: "감정을 억누르지 마세요. 솔직해질 때 진정한 관계가 시작됩니다.",
    reversedCareer: "직관을 무시하고 있지 않나요? 내면의 경고 신호에 주목하세요.",
    reversedFinance: "감춰진 비용이나 숨겨진 조건을 꼼꼼히 확인하세요.",
    reversedAdvice: "머리로만 판단하지 마세요. 감정과 직관의 균형이 필요합니다.",
  },
  {
    number: 3,
    name: "여황제",
    engName: "The Empress",
    symbol: "\u2640",
    uprightMeaning: "풍요, 모성, 자연, 창조, 아름다움, 감성",
    reversedMeaning: "의존, 과잉보호, 창조력 고갈, 불안정, 공허함",
    love: "사랑이 풍성해지는 시기입니다. 따뜻한 감정으로 상대를 감싸주세요.",
    career: "창의적인 프로젝트에서 성과를 거둡니다. 팀을 이끄는 역할이 어울립니다.",
    finance: "풍요로운 시기가 다가옵니다. 재정적 안정을 즐기세요.",
    advice: "자연과 교감하고, 창조적 에너지를 마음껏 발산하세요.",
    reversedLove: "상대에게 지나치게 의존하고 있지 않나요? 독립적인 자아를 유지하세요.",
    reversedCareer: "번아웃에 주의하세요. 창조력을 회복할 시간이 필요합니다.",
    reversedFinance: "과소비를 조심하세요. 사치보다 실용을 추구할 때입니다.",
    reversedAdvice: "자신을 먼저 돌보세요. 남에게 주는 것만큼 자신에게도 투자하세요.",
  },
  {
    number: 4,
    name: "황제",
    engName: "The Emperor",
    symbol: "\u2642",
    uprightMeaning: "권위, 안정, 구조, 리더십, 통제력, 보호",
    reversedMeaning: "독재, 경직, 지나친 통제, 융통성 부족, 미성숙",
    love: "안정적이고 책임감 있는 관계가 형성됩니다. 신뢰를 쌓아가세요.",
    career: "리더십을 발휘할 기회입니다. 체계적인 접근이 성공을 이끕니다.",
    finance: "재정적으로 안정된 시기입니다. 장기 투자를 고려해보세요.",
    advice: "질서와 규율을 통해 목표를 달성하세요. 단, 유연함도 잊지 마세요.",
    reversedLove: "지나친 통제는 관계를 망칩니다. 상대의 자유를 존중하세요.",
    reversedCareer: "너무 완고한 태도는 팀워크를 해칩니다. 다른 의견도 들어보세요.",
    reversedFinance: "지나친 절약이 오히려 기회를 놓치게 합니다. 균형을 찾으세요.",
    reversedAdvice: "통제를 내려놓으세요. 모든 것을 관리하려 하면 오히려 놓치는 것이 많습니다.",
  },
  {
    number: 5,
    name: "교황",
    engName: "The Hierophant",
    symbol: "\u271D",
    uprightMeaning: "전통, 교육, 신념, 조언, 관습, 영적 인도",
    reversedMeaning: "반항, 비전통적, 고정관념 타파, 자유 추구, 독단",
    love: "전통적인 가치를 중시하는 관계가 유리합니다. 진지한 만남이 있을 수 있습니다.",
    career: "멘토의 조언을 구하세요. 교육이나 학습을 통해 성장할 수 있습니다.",
    finance: "안전한 투자를 추구하세요. 검증된 방법이 더 좋은 결과를 가져옵니다.",
    advice: "경험 많은 사람의 조언을 귀담아 들으세요. 겸손함이 지혜를 이끕니다.",
    reversedLove: "틀에 박힌 관계에서 벗어나고 싶다면, 솔직한 대화가 필요합니다.",
    reversedCareer: "기존 방식에 의문을 제기할 때입니다. 혁신적인 접근이 필요합니다.",
    reversedFinance: "기존의 투자 방식을 재검토하세요. 새로운 전략이 필요할 수 있습니다.",
    reversedAdvice: "남의 말만 따르지 말고 자신만의 길을 찾아보세요.",
  },
  {
    number: 6,
    name: "연인",
    engName: "The Lovers",
    symbol: "\u2665",
    uprightMeaning: "사랑, 조화, 선택, 가치관, 파트너십, 유대",
    reversedMeaning: "불화, 잘못된 선택, 가치관 충돌, 유혹, 불균형",
    love: "운명적인 만남이나 관계의 깊어짐이 기다립니다. 마음을 열어보세요.",
    career: "좋은 파트너십이 형성되는 시기입니다. 협력을 통해 시너지를 만드세요.",
    finance: "중요한 재정적 선택의 기로에 있습니다. 가치관에 맞는 결정을 하세요.",
    advice: "마음이 이끄는 방향을 따르세요. 진정한 사랑과 조화를 추구하세요.",
    reversedLove: "관계에서 불균형을 느끼고 있다면, 솔직한 대화가 필요합니다.",
    reversedCareer: "동료와의 갈등에 주의하세요. 서로의 가치관 차이를 인정하세요.",
    reversedFinance: "감정적인 결정으로 재정적 손실을 입을 수 있습니다. 이성적으로 판단하세요.",
    reversedAdvice: "잘못된 선택을 바로잡을 기회가 있습니다. 진정으로 원하는 것이 무엇인지 되돌아보세요.",
  },
  {
    number: 7,
    name: "전차",
    engName: "The Chariot",
    symbol: "\u2726",
    uprightMeaning: "승리, 의지, 결단, 전진, 자기 통제, 극복",
    reversedMeaning: "통제 불능, 방향 상실, 공격성, 무력감, 좌절",
    love: "적극적인 행동이 좋은 결과를 가져옵니다. 망설이지 마세요.",
    career: "승진이나 성과가 기대됩니다. 강한 의지로 앞으로 나아가세요.",
    finance: "재정적 목표를 향해 강하게 전진하세요. 노력의 결실을 얻을 때입니다.",
    advice: "장애물을 두려워하지 마세요. 강한 의지와 결단력으로 승리를 쟁취하세요.",
    reversedLove: "감정을 조절하지 못하면 관계가 흔들립니다. 차분함을 유지하세요.",
    reversedCareer: "방향을 잃고 있다면 잠시 멈추세요. 목표를 재정비할 시간이 필요합니다.",
    reversedFinance: "무리한 투자는 자제하세요. 지금은 보수적인 전략이 안전합니다.",
    reversedAdvice: "억지로 밀어붙이지 마세요. 때로는 물러남이 전진입니다.",
  },
  {
    number: 8,
    name: "힘",
    engName: "Strength",
    symbol: "\u2654",
    uprightMeaning: "용기, 인내, 내면의 힘, 자비, 극복, 부드러운 강함",
    reversedMeaning: "자기 의심, 나약함, 감정 폭발, 인내력 부족, 불안",
    love: "부드러움과 인내로 상대의 마음을 얻을 수 있습니다.",
    career: "끈기 있게 노력하면 반드시 성과가 나타납니다. 포기하지 마세요.",
    finance: "장기적인 관점에서 인내심을 가지세요. 곧 좋은 결과가 옵니다.",
    advice: "진정한 힘은 내면에서 나옵니다. 부드러움으로 세상을 이겨내세요.",
    reversedLove: "감정 조절이 어려울 수 있습니다. 깊은 호흡으로 마음을 진정시키세요.",
    reversedCareer: "자신감이 흔들리고 있다면, 과거의 성공 경험을 떠올려보세요.",
    reversedFinance: "불안감에 휩쓸려 잘못된 결정을 내리지 마세요.",
    reversedAdvice: "자기 자신을 의심하지 마세요. 당신은 생각보다 강합니다.",
  },
  {
    number: 9,
    name: "은둔자",
    engName: "The Hermit",
    symbol: "\u2606",
    uprightMeaning: "성찰, 고독, 지혜, 내면 탐구, 안내, 명상",
    reversedMeaning: "고립, 외로움, 소외, 은둔, 과도한 자기 집착",
    love: "혼자만의 시간이 필요할 수 있습니다. 자신을 먼저 이해해야 상대도 이해할 수 있습니다.",
    career: "독립적인 작업에서 좋은 성과를 냅니다. 깊이 있는 연구와 분석이 빛을 발합니다.",
    finance: "충동적인 투자보다 신중한 분석이 필요한 시기입니다.",
    advice: "조용한 곳에서 자신을 돌아보세요. 내면의 지혜가 답을 알려줄 것입니다.",
    reversedLove: "지나친 고독은 관계를 멀어지게 합니다. 마음의 문을 열어보세요.",
    reversedCareer: "혼자 모든 것을 해결하려 하지 마세요. 도움을 구하는 것도 지혜입니다.",
    reversedFinance: "정보 부족으로 잘못된 판단을 할 수 있습니다. 전문가의 조언을 구하세요.",
    reversedAdvice: "자기만의 세계에 너무 갇히지 마세요. 세상과 소통하는 것도 중요합니다.",
  },
  {
    number: 10,
    name: "운명의 수레바퀴",
    engName: "Wheel of Fortune",
    symbol: "\u2609",
    uprightMeaning: "운명, 전환점, 행운, 변화, 순환, 기회",
    reversedMeaning: "불운, 저항, 변화 거부, 통제 불능, 반복되는 패턴",
    love: "운명적인 만남이 기다리고 있습니다. 변화의 물결에 몸을 맡겨보세요.",
    career: "경력에 큰 전환점이 다가옵니다. 새로운 기회를 놓치지 마세요.",
    finance: "재정적 행운이 찾아올 수 있습니다. 기회가 왔을 때 잡으세요.",
    advice: "인생의 변화를 받아들이세요. 운명의 수레바퀴는 항상 돌고 있습니다.",
    reversedLove: "관계의 정체기일 수 있습니다. 인내심을 가지세요, 곧 변화가 옵니다.",
    reversedCareer: "원하지 않는 변화가 올 수 있지만, 이것도 성장의 기회입니다.",
    reversedFinance: "예상치 못한 지출에 대비하세요. 비상금을 확보해두는 것이 좋습니다.",
    reversedAdvice: "같은 실수를 반복하고 있지 않은지 돌아보세요. 패턴을 깨뜨릴 때입니다.",
  },
  {
    number: 11,
    name: "정의",
    engName: "Justice",
    symbol: "\u2696",
    uprightMeaning: "공정, 진실, 법, 균형, 책임, 인과응보",
    reversedMeaning: "불공정, 불균형, 회피, 편견, 부정직",
    love: "솔직함이 관계의 핵심입니다. 공정하고 균형 잡힌 관계를 추구하세요.",
    career: "공정한 평가를 받을 수 있는 시기입니다. 성실함이 보상받습니다.",
    finance: "법적 문제나 계약에 있어 유리한 결과가 예상됩니다.",
    advice: "진실에 기반한 행동을 하세요. 뿌린 대로 거둡니다.",
    reversedLove: "관계에서 불공평함을 느끼고 있다면, 정직한 대화가 필요합니다.",
    reversedCareer: "부당한 대우를 받고 있다면, 정당하게 목소리를 내세요.",
    reversedFinance: "계약서의 작은 글씨까지 꼼꼼히 확인하세요.",
    reversedAdvice: "자신에게 솔직해지세요. 거짓은 결국 드러납니다.",
  },
  {
    number: 12,
    name: "매달린 남자",
    engName: "The Hanged Man",
    symbol: "\u2625",
    uprightMeaning: "희생, 새로운 관점, 인내, 기다림, 내려놓음",
    reversedMeaning: "무의미한 희생, 지연, 이기심, 저항, 집착",
    love: "관계에서 양보와 이해가 필요한 시기입니다. 상대의 입장에서 생각해보세요.",
    career: "잠시 멈추고 다른 각도에서 바라보세요. 새로운 시각이 돌파구가 됩니다.",
    finance: "지금은 기다림의 시기입니다. 조급해하지 마세요.",
    advice: "때로는 멈춤이 전진보다 가치 있습니다. 새로운 시각으로 세상을 바라보세요.",
    reversedLove: "일방적인 희생은 건강하지 않습니다. 나 자신도 소중히 여기세요.",
    reversedCareer: "무의미한 기다림은 끝내세요. 행동할 때입니다.",
    reversedFinance: "손절이 필요할 수 있습니다. 더 이상의 손실을 막으세요.",
    reversedAdvice: "집착을 내려놓으세요. 놓아야 할 것을 놓아야 새로운 것을 잡을 수 있습니다.",
  },
  {
    number: 13,
    name: "죽음",
    engName: "Death",
    symbol: "\u2620",
    uprightMeaning: "변화, 끝과 시작, 변신, 전환, 재탄생",
    reversedMeaning: "변화 거부, 정체, 집착, 두려움, 부패",
    love: "지난 관계의 패턴을 끝내고 새로운 시작을 할 때입니다.",
    career: "큰 변화가 다가옵니다. 과거의 방식을 버리고 새롭게 시작하세요.",
    finance: "재정적 구조조정이 필요할 수 있습니다. 과감한 변화가 필요합니다.",
    advice: "끝은 새로운 시작의 전주곡입니다. 변화를 두려워하지 마세요.",
    reversedLove: "끝내야 할 관계를 붙잡고 있지 않나요? 용기를 내세요.",
    reversedCareer: "변화를 거부하면 뒤처집니다. 시대의 흐름에 맞춰 적응하세요.",
    reversedFinance: "낡은 재정 습관을 버리지 못하면 개선이 어렵습니다.",
    reversedAdvice: "과거에 매달리지 마세요. 놓아줘야 새로운 것이 들어옵니다.",
  },
  {
    number: 14,
    name: "절제",
    engName: "Temperance",
    symbol: "\u2721",
    uprightMeaning: "균형, 절제, 조화, 인내, 적절함, 치유",
    reversedMeaning: "불균형, 과잉, 조급함, 부조화, 극단",
    love: "균형 잡힌 관계가 행복의 열쇠입니다. 서로 맞춰가는 노력이 필요합니다.",
    career: "팀워크와 협력이 좋은 결과를 만듭니다. 균형 잡힌 업무 배분이 중요합니다.",
    finance: "절제 있는 소비가 재정 건강의 비결입니다. 균형 잡힌 포트폴리오를 구성하세요.",
    advice: "극단을 피하고 중용의 길을 걸으세요. 균형이 모든 것의 답입니다.",
    reversedLove: "관계에서 과한 것은 아닌지 점검하세요. 적절한 거리감이 필요합니다.",
    reversedCareer: "일과 생활의 균형이 무너지고 있습니다. 워라밸을 되찾으세요.",
    reversedFinance: "과소비 또는 과도한 절약, 어느 쪽이든 문제입니다. 균형을 찾으세요.",
    reversedAdvice: "조급해하지 마세요. 서두름이 오히려 일을 망칩니다.",
  },
  {
    number: 15,
    name: "악마",
    engName: "The Devil",
    symbol: "\u2629",
    uprightMeaning: "유혹, 집착, 속박, 물질주의, 그림자, 중독",
    reversedMeaning: "해방, 자유, 속박에서 벗어남, 각성, 극복",
    love: "관계에서 건강하지 않은 패턴이 있는지 살펴보세요. 집착은 사랑이 아닙니다.",
    career: "과도한 업무에 속박되어 있지 않나요? 자신의 가치를 점검하세요.",
    finance: "물질에 대한 집착이 오히려 재정을 망칠 수 있습니다. 욕심을 줄이세요.",
    advice: "자신을 옭아매고 있는 것이 무엇인지 직면하세요. 인식이 해방의 첫걸음입니다.",
    reversedLove: "불건전한 관계에서 벗어날 용기가 생깁니다. 자유를 되찾으세요.",
    reversedCareer: "억눌린 상황에서 탈출할 기회가 옵니다. 두려워하지 마세요.",
    reversedFinance: "과소비 습관이나 빚의 굴레에서 벗어날 수 있는 시기입니다.",
    reversedAdvice: "속박의 사슬을 끊으세요. 당신은 자유로워질 자격이 있습니다.",
  },
  {
    number: 16,
    name: "탑",
    engName: "The Tower",
    symbol: "\u26A1",
    uprightMeaning: "급변, 파괴, 혼란, 깨달음, 진실의 폭로, 해방",
    reversedMeaning: "변화 회피, 재앙 예방, 두려움, 서서히 무너짐",
    love: "관계에 큰 변화가 올 수 있습니다. 힘들지만 결국 더 나은 방향으로 갑니다.",
    career: "예상치 못한 변화가 닥칠 수 있습니다. 하지만 이것이 성장의 계기가 됩니다.",
    finance: "갑작스러운 재정적 변동에 대비하세요. 비상금을 확보해두세요.",
    advice: "무너져야 다시 세울 수 있습니다. 혼란 속에서 진실을 발견하세요.",
    reversedLove: "문제를 외면하면 더 커집니다. 작은 불씨일 때 해결하세요.",
    reversedCareer: "위기 상황을 미리 감지하고 대비하면 피해를 줄일 수 있습니다.",
    reversedFinance: "점진적인 손실에 주의하세요. 소액이라도 누적되면 큰 문제가 됩니다.",
    reversedAdvice: "변화를 두려워하면 서서히 무너집니다. 차라리 직면하는 것이 낫습니다.",
  },
  {
    number: 17,
    name: "별",
    engName: "The Star",
    symbol: "\u2734",
    uprightMeaning: "희망, 영감, 평화, 치유, 밝은 미래, 축복",
    reversedMeaning: "절망, 희망 상실, 불신, 연결 단절, 비관",
    love: "희망적인 사랑이 찾아옵니다. 밝은 미래가 기다리고 있으니 믿으세요.",
    career: "영감을 받아 큰 발전을 이루는 시기입니다. 꿈을 향해 나아가세요.",
    finance: "재정적으로 희망적인 시기입니다. 장기적인 투자가 빛을 발합니다.",
    advice: "별빛을 따라 걸으세요. 어둠 뒤에는 반드시 빛이 옵니다.",
    reversedLove: "사랑에 대한 희망을 잃지 마세요. 잠시 쉬어가는 것도 괜찮습니다.",
    reversedCareer: "꿈을 포기하지 마세요. 지금의 어려움은 일시적입니다.",
    reversedFinance: "재정적 어려움이 있더라도 희망을 잃지 마세요. 반드시 나아집니다.",
    reversedAdvice: "비관에 빠지지 마세요. 가장 어두운 밤도 결국 지나갑니다.",
  },
  {
    number: 18,
    name: "달",
    engName: "The Moon",
    symbol: "\u263E",
    uprightMeaning: "환상, 불안, 무의식, 직관, 혼란, 숨겨진 진실",
    reversedMeaning: "혼란 해소, 진실 발견, 불안 극복, 명확함",
    love: "감정의 안개가 끼어 있을 수 있습니다. 직감을 믿되, 현실도 직시하세요.",
    career: "불확실한 상황에서 성급한 결정을 피하세요. 더 많은 정보가 필요합니다.",
    finance: "보이는 것이 전부가 아닙니다. 숨겨진 리스크를 파악하세요.",
    advice: "불안한 마음을 다스리세요. 안개가 걷히면 길이 보일 것입니다.",
    reversedLove: "오해가 풀리고 진실이 밝혀지는 시기입니다. 관계가 명확해집니다.",
    reversedCareer: "혼란스러웠던 상황이 정리됩니다. 명확한 방향이 보이기 시작합니다.",
    reversedFinance: "숨겨진 진실이 드러나면서 올바른 투자 판단이 가능해집니다.",
    reversedAdvice: "불안이 줄어들고 명확함을 얻는 시기입니다. 직관을 따르세요.",
  },
  {
    number: 19,
    name: "태양",
    engName: "The Sun",
    symbol: "\u2600",
    uprightMeaning: "기쁨, 성공, 활력, 긍정, 행복, 명확함",
    reversedMeaning: "슬픔, 과도한 낙관, 일시적 좌절, 에너지 저하",
    love: "밝고 행복한 사랑이 찾아옵니다. 긍정의 에너지가 넘칩니다.",
    career: "성공과 인정이 기다립니다. 자신감을 가지고 빛나세요.",
    finance: "재정적으로 매우 좋은 시기입니다. 투자의 결실을 맺습니다.",
    advice: "태양처럼 밝게 빛나세요. 긍정적인 에너지가 모든 것을 이끌어갑니다.",
    reversedLove: "일시적으로 열정이 식을 수 있지만, 곧 회복됩니다.",
    reversedCareer: "기대한 만큼의 성과가 나오지 않을 수 있습니다. 인내하세요.",
    reversedFinance: "지나친 낙관은 금물입니다. 현실적인 재정 계획을 세우세요.",
    reversedAdvice: "잠시 흐린 날이어도 태양은 다시 뜹니다. 희망을 놓지 마세요.",
  },
  {
    number: 20,
    name: "심판",
    engName: "Judgement",
    symbol: "\u2721",
    uprightMeaning: "부활, 심판, 반성, 소명, 각성, 결정적 순간",
    reversedMeaning: "자기 비판, 후회, 판단 회피, 두 번째 기회 놓침",
    love: "과거의 관계를 돌아보고 교훈을 얻을 때입니다. 새로운 시작의 기회가 옵니다.",
    career: "인생의 소명을 발견하는 시기입니다. 큰 결정을 내릴 때가 왔습니다.",
    finance: "과거의 재정 결정을 반성하고, 새로운 전략을 세우세요.",
    advice: "과거를 정리하고 새롭게 태어나세요. 소명의 부름에 응답할 때입니다.",
    reversedLove: "과거의 실수에 너무 집착하지 마세요. 용서하고 앞으로 나아가세요.",
    reversedCareer: "자기 비판을 멈추세요. 과거의 실수보다 미래의 가능성에 집중하세요.",
    reversedFinance: "후회보다는 지금부터 시작하는 것이 중요합니다.",
    reversedAdvice: "자신을 너무 가혹하게 판단하지 마세요. 모든 경험은 배움입니다.",
  },
  {
    number: 21,
    name: "세계",
    engName: "The World",
    symbol: "\u2741",
    uprightMeaning: "완성, 성취, 통합, 여행, 충만함, 새로운 순환",
    reversedMeaning: "미완성, 지연, 목표 달성 실패, 빈틈, 부족함",
    love: "완전한 사랑과 조화를 경험하는 시기입니다. 관계가 한 단계 성숙합니다.",
    career: "큰 프로젝트가 성공적으로 마무리됩니다. 성취감을 맛보세요.",
    finance: "재정적 목표를 달성합니다. 노력의 보상이 돌아옵니다.",
    advice: "축하합니다! 한 순환이 완성되었습니다. 성취를 즐기고, 새로운 여정을 준비하세요.",
    reversedLove: "관계에서 무언가 부족하다 느낀다면, 무엇이 빠져있는지 찾아보세요.",
    reversedCareer: "마지막 마무리가 부족합니다. 끝까지 최선을 다하세요.",
    reversedFinance: "목표에 거의 다 왔지만 아직 완성이 아닙니다. 조금 더 노력하세요.",
    reversedAdvice: "완벽하지 않아도 괜찮습니다. 과정 자체가 의미 있었음을 기억하세요.",
  },
];

/* ═══════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════ */

/** Seeded pseudo-random (simple mulberry32) */
function seededRandom(seed: number) {
  let t = (seed + 0x6d2b79f5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function dateSeed(): number {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

/** Fisher-Yates shuffle with seeded rng */
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type ReadingType = "daily" | "love" | "decision";

interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  label: string;
  flipped: boolean;
}

const CARD_BACK_COLORS = [
  "from-indigo-600 to-purple-700",
  "from-violet-600 to-fuchsia-700",
  "from-blue-600 to-indigo-700",
];

const READING_TYPES: { key: ReadingType; title: string; desc: string; emoji: string; count: number }[] = [
  { key: "daily", title: "오늘의 타로", desc: "오늘 하루의 운세를 1장의 카드로 확인", emoji: "\u2600\uFE0F", count: 1 },
  { key: "love", title: "연애 타로", desc: "과거 / 현재 / 미래의 3장 연애 리딩", emoji: "\u2764\uFE0F", count: 3 },
  { key: "decision", title: "결정 타로", desc: "Yes / No 2장으로 결정에 도움을", emoji: "\u2696\uFE0F", count: 2 },
];

const POSITION_LABELS: Record<ReadingType, string[]> = {
  daily: ["오늘의 카드"],
  love: ["과거", "현재", "미래"],
  decision: ["Yes 방향", "No 방향"],
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
export default function TarotPage() {
  const [readingType, setReadingType] = useState<ReadingType | null>(null);
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [question, setQuestion] = useState("");
  const [drawn, setDrawn] = useState(false);
  const [shuffling, setShuffling] = useState(false);

  /* draw cards */
  const draw = useCallback(
    (type: ReadingType) => {
      setShuffling(true);
      setDrawn(false);
      setCards([]);

      // brief shuffle animation delay
      setTimeout(() => {
        const labels = POSITION_LABELS[type];
        const count = labels.length;

        let rng: () => number;
        if (type === "daily") {
          const seed = dateSeed();
          let s = seed;
          rng = () => {
            const v = seededRandom(s);
            s = (s + 1) | 0;
            return v;
          };
        } else {
          let s = Date.now();
          rng = () => {
            const v = seededRandom(s);
            s = (s + 1) | 0;
            return v;
          };
        }

        const shuffled = shuffle(MAJOR_ARCANA, rng);
        const drawn: DrawnCard[] = shuffled.slice(0, count).map((card, i) => ({
          card,
          isReversed: rng() < 0.35,
          label: labels[i],
          flipped: false,
        }));

        setCards(drawn);
        setDrawn(true);
        setShuffling(false);
      }, 800);
    },
    [],
  );

  const flipCard = useCallback((index: number) => {
    setCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)),
    );
  }, []);

  const reset = useCallback(() => {
    setReadingType(null);
    setCards([]);
    setDrawn(false);
    setShuffling(false);
    setQuestion("");
  }, []);

  const allFlipped = cards.length > 0 && cards.every((c) => c.flipped);

  /* decision interpretation */
  const decisionSummary = useMemo(() => {
    if (readingType !== "decision" || !allFlipped || cards.length < 2) return null;
    const yesCard = cards[0];
    const noCard = cards[1];

    // Simple scoring: upright positive cards score higher
    const positiveNumbers = new Set([0, 1, 3, 6, 8, 10, 14, 17, 19, 21]);
    let yesScore = positiveNumbers.has(yesCard.card.number) ? 2 : 1;
    if (yesCard.isReversed) yesScore -= 1;
    let noScore = positiveNumbers.has(noCard.card.number) ? 2 : 1;
    if (noCard.isReversed) noScore -= 1;

    if (yesScore > noScore) {
      return { result: "Yes", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", desc: "긍정적인 방향으로 나아가는 것이 좋습니다. Yes 쪽의 카드가 더 밝은 에너지를 보여주고 있습니다." };
    } else if (noScore > yesScore) {
      return { result: "No", color: "text-red-600", bg: "bg-red-50 border-red-200", desc: "지금은 잠시 멈추고 재고하는 것이 좋겠습니다. 서두르지 않는 것이 현명합니다." };
    }
    return { result: "신중하게", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", desc: "양쪽의 에너지가 비슷합니다. 서두르지 말고 좀 더 숙고한 뒤 결정하세요." };
  }, [readingType, allFlipped, cards]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 border border-purple-100">
          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" />
          Major Arcana 22
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
          AI 타로 카드
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto">
          메이저 아르카나 22장으로 당신의 운명을 읽어보세요.
          <br className="sm:hidden" />
          정방향과 역방향 해석을 모두 제공합니다.
        </p>
      </div>

      {/* ── Reading type selection ── */}
      {!readingType && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {READING_TYPES.map((rt) => (
              <button
                key={rt.key}
                onClick={() => setReadingType(rt.key)}
                className="calc-card p-6 text-left hover:border-purple-300 transition-all group"
              >
                <div className="text-3xl mb-3">{rt.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-700 transition-colors">
                  {rt.title}
                </h3>
                <p className="text-sm text-gray-500">{rt.desc}</p>
                <div className="mt-3 text-xs text-purple-600 font-medium">
                  {rt.count}장 리딩 &rarr;
                </div>
              </button>
            ))}
          </div>

          {/* Card preview */}
          <div className="calc-card p-6">
            <h2 className="calc-seo-title">타로 카드란?</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              타로 카드는 22장의 메이저 아르카나(Major Arcana)와 56장의 마이너 아르카나(Minor Arcana)로 구성된 78장의 카드 덱입니다.
              이 중 메이저 아르카나는 인생의 큰 흐름과 중요한 교훈을 상징하며, 가장 강력한 메시지를 전달합니다.
            </p>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {MAJOR_ARCANA.slice(0, 8).map((card) => (
                <div
                  key={card.number}
                  className="flex flex-col items-center gap-1 p-2 bg-purple-50 rounded-lg"
                >
                  <span className="text-lg">{card.symbol}</span>
                  <span className="text-[0.65rem] text-purple-700 font-medium text-center leading-tight">
                    {card.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reading in progress ── */}
      {readingType && (
        <div className="animate-fade-in">
          {/* Back button + type label */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={reset}
              className="calc-btn-secondary text-sm !px-3 !py-2"
            >
              &larr; 돌아가기
            </button>
            <h2 className="text-lg font-bold text-gray-900">
              {READING_TYPES.find((r) => r.key === readingType)?.emoji}{" "}
              {READING_TYPES.find((r) => r.key === readingType)?.title}
            </h2>
          </div>

          {/* Question input (for decision & love) */}
          {readingType !== "daily" && !drawn && (
            <div className="calc-card p-6 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {readingType === "love"
                  ? "연애에 대해 궁금한 점을 적어보세요 (선택)"
                  : "결정해야 할 질문을 적어보세요 (선택)"}
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  readingType === "love"
                    ? "예: 그 사람과 잘 될 수 있을까요?"
                    : "예: 이직을 해야 할까요?"
                }
                className="calc-input"
              />
            </div>
          )}

          {/* Draw button */}
          {!drawn && !shuffling && (
            <button
              onClick={() => draw(readingType)}
              className="calc-btn-primary w-full text-base !py-4 !rounded-2xl"
            >
              카드 섞기 &amp; 뽑기
            </button>
          )}

          {/* Shuffling animation */}
          {shuffling && (
            <div className="text-center py-12">
              <div className="inline-flex gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-18 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 shadow-lg"
                    style={{
                      animation: `shuffleCard 0.6s ease-in-out ${i * 0.15}s infinite alternate`,
                    }}
                  />
                ))}
              </div>
              <p className="text-gray-500 text-sm animate-pulse">카드를 섞고 있습니다...</p>
              <style>{`
                @keyframes shuffleCard {
                  0% { transform: translateY(0) rotate(0deg); }
                  100% { transform: translateY(-12px) rotate(8deg); }
                }
              `}</style>
            </div>
          )}

          {/* Show question if given */}
          {drawn && question && (
            <div className="calc-card p-4 mb-6 bg-purple-50 border-purple-200">
              <p className="text-sm text-purple-800 font-medium">
                &ldquo;{question}&rdquo;
              </p>
            </div>
          )}

          {/* Cards display */}
          {drawn && cards.length > 0 && (
            <div className="space-y-6">
              <p className="text-center text-sm text-gray-500 mb-2">
                카드를 클릭하여 뒤집어보세요
              </p>

              <div
                className={`grid gap-6 justify-items-center ${
                  cards.length === 1
                    ? "grid-cols-1 max-w-xs mx-auto"
                    : cards.length === 2
                      ? "grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto"
                      : "grid-cols-1 sm:grid-cols-3"
                }`}
              >
                {cards.map((drawnCard, idx) => (
                  <div key={idx} className="w-full max-w-[220px]">
                    {/* Position label */}
                    <div className="text-center mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                        {drawnCard.label}
                      </span>
                    </div>

                    {/* Flip card */}
                    <div
                      className="relative w-full cursor-pointer"
                      style={{ perspective: "1000px", aspectRatio: "2/3" }}
                      onClick={() => !drawnCard.flipped && flipCard(idx)}
                    >
                      <div
                        className="absolute inset-0 transition-transform duration-700"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: drawnCard.flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                        }}
                      >
                        {/* Card back */}
                        <div
                          className="absolute inset-0 rounded-2xl overflow-hidden"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <div
                            className={`w-full h-full bg-gradient-to-br ${CARD_BACK_COLORS[idx % CARD_BACK_COLORS.length]} flex items-center justify-center shadow-xl border-2 border-purple-400/30 rounded-2xl`}
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-2 opacity-80">{"\u2728"}</div>
                              <div className="w-16 h-16 border-2 border-white/30 rounded-full mx-auto mb-2 flex items-center justify-center">
                                <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
                                  <span className="text-white/60 text-lg">{"\u2726"}</span>
                                </div>
                              </div>
                              <p className="text-white/50 text-xs font-medium mt-2">TAROT</p>
                            </div>
                          </div>
                        </div>

                        {/* Card front */}
                        <div
                          className="absolute inset-0 rounded-2xl overflow-hidden"
                          style={{
                            backfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                          }}
                        >
                          <div
                            className={`w-full h-full bg-white border-2 ${
                              drawnCard.isReversed ? "border-red-300" : "border-amber-300"
                            } rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl`}
                            style={{
                              transform: drawnCard.isReversed ? "rotate(180deg)" : "none",
                            }}
                          >
                            <span className="text-xs font-bold text-gray-400 mb-1">
                              {drawnCard.card.number}
                            </span>
                            <span className="text-4xl mb-2">{drawnCard.card.symbol}</span>
                            <h3 className="font-bold text-gray-900 text-sm text-center">
                              {drawnCard.card.name}
                            </h3>
                            <p className="text-[0.65rem] text-gray-400 text-center">
                              {drawnCard.card.engName}
                            </p>
                            <div
                              className={`mt-2 px-2 py-0.5 rounded-full text-[0.6rem] font-semibold ${
                                drawnCard.isReversed
                                  ? "bg-red-100 text-red-600"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                              style={{
                                transform: drawnCard.isReversed ? "rotate(180deg)" : "none",
                              }}
                            >
                              {drawnCard.isReversed ? "역방향" : "정방향"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decision summary */}
              {readingType === "decision" && decisionSummary && (
                <div className={`calc-card p-6 text-center border-2 ${decisionSummary.bg}`}>
                  <p className="text-sm text-gray-500 mb-1">타로의 답</p>
                  <p className={`text-3xl font-extrabold ${decisionSummary.color} mb-2`}>
                    {decisionSummary.result}
                  </p>
                  <p className="text-sm text-gray-600">{decisionSummary.desc}</p>
                </div>
              )}

              {/* Detailed interpretations */}
              {allFlipped && (
                <div className="space-y-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-900 text-center">
                    상세 해석
                  </h3>

                  {cards.map((drawnCard, idx) => (
                    <div key={idx} className="calc-card overflow-hidden">
                      {/* Card header */}
                      <div
                        className={`px-6 py-4 ${
                          drawnCard.isReversed
                            ? "bg-gradient-to-r from-red-500 to-rose-600"
                            : "bg-gradient-to-r from-amber-500 to-orange-500"
                        } text-white`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{drawnCard.card.symbol}</span>
                          <div>
                            <h4 className="font-bold text-lg">
                              {drawnCard.label}: {drawnCard.card.number}.{" "}
                              {drawnCard.card.name} ({drawnCard.card.engName})
                            </h4>
                            <p className="text-white/80 text-sm">
                              {drawnCard.isReversed ? "역방향 (Reversed)" : "정방향 (Upright)"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-5">
                        {/* Core meaning */}
                        <div>
                          <h5 className="text-sm font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs">
                              {"\u2728"}
                            </span>
                            핵심 의미
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed pl-8">
                            {drawnCard.isReversed
                              ? drawnCard.card.reversedMeaning
                              : drawnCard.card.uprightMeaning}
                          </p>
                        </div>

                        {/* Category interpretations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-pink-50 rounded-xl p-4">
                            <h5 className="text-sm font-bold text-pink-700 mb-1">
                              {"\u2764\uFE0F"} 연애운
                            </h5>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {drawnCard.isReversed
                                ? drawnCard.card.reversedLove
                                : drawnCard.card.love}
                            </p>
                          </div>
                          <div className="bg-blue-50 rounded-xl p-4">
                            <h5 className="text-sm font-bold text-blue-700 mb-1">
                              {"\uD83D\uDCBC"} 직업운
                            </h5>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {drawnCard.isReversed
                                ? drawnCard.card.reversedCareer
                                : drawnCard.card.career}
                            </p>
                          </div>
                          <div className="bg-emerald-50 rounded-xl p-4">
                            <h5 className="text-sm font-bold text-emerald-700 mb-1">
                              {"\uD83D\uDCB0"} 재물운
                            </h5>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {drawnCard.isReversed
                                ? drawnCard.card.reversedFinance
                                : drawnCard.card.finance}
                            </p>
                          </div>
                          <div className="bg-amber-50 rounded-xl p-4">
                            <h5 className="text-sm font-bold text-amber-700 mb-1">
                              {"\uD83D\uDCA1"} 조언
                            </h5>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {drawnCard.isReversed
                                ? drawnCard.card.reversedAdvice
                                : drawnCard.card.advice}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Retry */}
                  <div className="flex gap-3 justify-center pt-4">
                    <button onClick={() => draw(readingType)} className="calc-btn-primary">
                      다시 뽑기
                    </button>
                    <button onClick={reset} className="calc-btn-secondary">
                      다른 리딩 선택
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── SEO Content ── */}
      <div className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">메이저 아르카나란?</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            메이저 아르카나(Major Arcana)는 타로 카드 78장 중 22장으로 구성된 핵심 카드입니다.
            0번 바보(The Fool)부터 21번 세계(The World)까지, 인생의 큰 여정과 중요한 전환점을 상징합니다.
            각 카드는 정방향과 역방향으로 해석이 달라지며, 정방향은 카드의 긍정적 에너지를,
            역방향은 주의해야 할 점이나 내면의 과제를 나타냅니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">타로 리딩 종류</h2>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong className="text-gray-800">오늘의 타로 (1장 리딩)</strong>
              <p className="mt-1">하루를 시작하며 그날의 에너지와 주의점을 확인하는 간단한 리딩입니다. 매일 같은 날짜에는 같은 카드가 나와 일관된 메시지를 전합니다.</p>
            </div>
            <div>
              <strong className="text-gray-800">연애 타로 (3장 리딩)</strong>
              <p className="mt-1">과거-현재-미래의 3장 스프레드로 연애의 흐름을 파악합니다. 지나간 관계의 교훈, 현재 상황, 앞으로의 방향성을 종합적으로 읽어냅니다.</p>
            </div>
            <div>
              <strong className="text-gray-800">결정 타로 (2장 리딩)</strong>
              <p className="mt-1">Yes와 No 각각의 방향에 대한 에너지를 비교하여 결정에 도움을 줍니다. 양쪽 카드의 성격과 방향성을 종합적으로 해석합니다.</p>
            </div>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">22장 메이저 아르카나 카드 목록</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {MAJOR_ARCANA.map((card) => (
              <div
                key={card.number}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-xs"
              >
                <span className="text-base">{card.symbol}</span>
                <span className="text-gray-700">
                  {card.number}. {card.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <RelatedTools current="tarot" />
    </div>
  );
}
