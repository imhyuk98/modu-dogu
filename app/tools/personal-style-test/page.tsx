"use client";

import RelatedTools from "@/components/RelatedTools";
import TrendQuiz, { TrendQuizQuestion, TrendQuizResult } from "@/components/viral/TrendQuiz";

const questions: TrendQuizQuestion[] = [
  { prompt: "옷장을 열었을 때 가장 손이 가는 조합은?", choices: [
    { label: "흰 셔츠와 단정한 팬츠", scores: { clean: 2 } },
    { label: "부드러운 니트와 편안한 데님", scores: { soft: 2 } },
    { label: "색이나 실루엣이 눈에 띄는 한 벌", scores: { vivid: 2 } },
    { label: "오래 입은 재킷과 자연스러운 소재", scores: { natural: 2 } },
  ] },
  { prompt: "액세서리를 하나 고른다면?", choices: [
    { label: "얇고 반듯한 메탈 시계", scores: { clean: 2 } },
    { label: "작고 둥근 진주나 실버", scores: { soft: 2 } },
    { label: "시선을 끄는 컬러 백이나 안경", scores: { vivid: 2 } },
    { label: "가죽, 우드, 빈티지 질감", scores: { natural: 2 } },
  ] },
  { prompt: "사진에서 내가 좋아하는 분위기는?", choices: [
    { label: "여백이 많고 정돈된 구도", scores: { clean: 2 } },
    { label: "햇살이 번지는 포근한 색감", scores: { soft: 2 } },
    { label: "플래시와 강한 대비", scores: { vivid: 2 } },
    { label: "필름처럼 거칠고 편안한 장면", scores: { natural: 2 } },
  ] },
  { prompt: "새로운 옷을 살 때 가장 중요한 것은?", choices: [
    { label: "선이 깔끔하고 활용도가 높은지", scores: { clean: 2 } },
    { label: "얼굴 인상이 편안해 보이는지", scores: { soft: 2 } },
    { label: "나만의 포인트가 되는지", scores: { vivid: 2 } },
    { label: "소재가 좋고 오래 입을 수 있는지", scores: { natural: 2 } },
  ] },
  { prompt: "처음 가는 모임을 위한 스타일은?", choices: [
    { label: "모노톤으로 실수 없이 정돈", scores: { clean: 2 } },
    { label: "밝고 부드러운 컬러로 친근하게", scores: { soft: 2 } },
    { label: "대화 소재가 될 포인트 한 가지", scores: { vivid: 2 } },
    { label: "힘주지 않은 레이어드", scores: { natural: 2 } },
  ] },
  { prompt: "내 방에 가장 잘 어울리는 물건은?", choices: [
    { label: "직선형 스탠드와 투명 수납", scores: { clean: 2 } },
    { label: "패브릭 조명과 작은 꽃", scores: { soft: 2 } },
    { label: "그래픽 포스터와 컬러 체어", scores: { vivid: 2 } },
    { label: "원목 가구와 손때 묻은 오브제", scores: { natural: 2 } },
  ] },
];

const results: TrendQuizResult[] = [
  { id: "clean", emoji: "▱", title: "클린 아키텍트", subtitle: "선과 여백으로 인상을 설계하는 스타일", description: "간결한 실루엣과 정돈된 색 조합에서 가장 편안함을 느낍니다. 완벽히 기본적인 옷보다 소재나 비율이 다른 한 가지를 더하면 개성이 살아납니다.", tags: ["미니멀", "직선", "모노톤", "정돈"], tips: ["화이트·차콜·네이비를 기본 팔레트로 써보세요.", "크롭 재킷이나 긴 팬츠처럼 비율 하나만 강조하세요."], accent: "#34495e" },
  { id: "soft", emoji: "◌", title: "소프트 블루머", subtitle: "부드러운 색과 곡선으로 친근함을 만드는 스타일", description: "포근한 질감, 밝은 중간색, 자연스럽게 흐르는 선이 잘 어울립니다. 지나치게 장식적인 조합보다 작은 곡선 포인트를 반복하면 세련돼 보입니다.", tags: ["파스텔", "곡선", "포근함", "레이어"], tips: ["크림·라일락·세이지처럼 탁한 밝은색을 골라보세요.", "얇은 니트와 둥근 액세서리로 결을 맞춰보세요."], accent: "#a65f78" },
  { id: "vivid", emoji: "◆", title: "비비드 플레이어", subtitle: "대비와 포인트를 즐기는 장면의 주인공", description: "색, 패턴, 예상 밖의 조합으로 자신을 표현할 때 에너지가 생깁니다. 강한 요소를 모두 쓰기보다 주인공 한 가지와 조연을 구분하면 완성도가 올라갑니다.", tags: ["컬러", "대비", "포인트", "실험"], tips: ["선명한 레드·블루·라임 중 한 색만 크게 써보세요.", "포인트가 강하면 나머지는 같은 계열 무채색으로 묶으세요."], accent: "#d94835" },
  { id: "natural", emoji: "⌁", title: "내추럴 큐레이터", subtitle: "시간이 쌓이는 소재와 이야기를 고르는 스타일", description: "리넨, 데님, 가죽처럼 표정이 있는 소재와 편안한 겹쳐 입기를 좋아합니다. 무심한 조합 속에서도 신발이나 가방의 톤을 맞추면 의도적인 스타일이 됩니다.", tags: ["질감", "어스톤", "빈티지", "편안함"], tips: ["올리브·브라운·인디고를 소재별로 겹쳐보세요.", "낡은 느낌의 아이템은 한 번에 두 개까지만 사용하세요."], accent: "#6c7042" },
];

export default function PersonalStyleTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8">
          <p className="text-sm font-bold text-[#a93d28]">PERSONAL STYLE · 2분</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">나의 퍼스널 스타일 테스트</h1>
          <p className="mt-4 max-w-2xl leading-7 text-gray-600">사진 업로드 없이 취향만으로 스타일 방향, 추천 팔레트와 코디 원칙을 찾아보세요.</p>
        </header>
        <TrendQuiz slug="personal-style-test" kicker="STYLE PROFILE" questions={questions} results={results} />
        <section className="calc-seo-card mt-8">
          <h2 className="calc-seo-title">결과 활용법</h2>
          <p className="text-sm leading-7 text-gray-600">퍼스널 컬러나 체형을 판정하는 검사가 아니라 지금 끌리는 시각 취향을 정리하는 도구입니다. 결과 키워드를 기존 패션 코디 추천의 스타일·색상 선택에 활용해보세요.</p>
        </section>
        <RelatedTools current="personal-style-test" />
      </div>
    </main>
  );
}
