"use client";

import RelatedTools from "@/components/RelatedTools";
import TrendQuiz, { TrendQuizQuestion, TrendQuizResult } from "@/components/viral/TrendQuiz";

const questions: TrendQuizQuestion[] = [
  { prompt: "갑자기 흥미로운 제안을 받았다. 나는?", choices: [
    { label: "일단 해보고 방법은 가면서 찾는다", scores: { spark: 2, breeze: 1 } },
    { label: "조건과 일정을 확인한 뒤 결정한다", scores: { anchor: 2, grove: 1 } },
  ] },
  { prompt: "친구가 고민을 털어놓을 때 더 먼저 하는 말은?", choices: [
    { label: "지금 어떤 마음인지부터 묻는다", scores: { breeze: 2, grove: 1 } },
    { label: "무엇부터 해결할지 함께 정리한다", scores: { spark: 1, anchor: 2 } },
  ] },
  { prompt: "여행 하루 전, 내 가방 상태는?", choices: [
    { label: "필수품만 넣고 현지에서 맞춘다", scores: { breeze: 2, spark: 1 } },
    { label: "목록대로 이미 준비되어 있다", scores: { anchor: 2, grove: 1 } },
  ] },
  { prompt: "회의에서 침묵이 길어지면?", choices: [
    { label: "완성되지 않았어도 먼저 의견을 던진다", scores: { spark: 2, breeze: 1 } },
    { label: "맥락을 더 듣고 핵심을 정리해 말한다", scores: { grove: 2, anchor: 1 } },
  ] },
  { prompt: "기분이 가라앉은 날 회복하는 방식은?", choices: [
    { label: "사람을 만나거나 새로운 자극을 찾는다", scores: { spark: 1, breeze: 2 } },
    { label: "혼자 쉬며 생활 리듬을 되찾는다", scores: { grove: 2, anchor: 1 } },
  ] },
  { prompt: "목표가 생겼을 때 더 가까운 모습은?", choices: [
    { label: "빠르게 첫 결과를 만들어 동력을 얻는다", scores: { spark: 2, breeze: 1 } },
    { label: "실패 지점을 예상하고 오래 갈 구조를 만든다", scores: { anchor: 2, grove: 1 } },
  ] },
  { prompt: "주변 사람들은 나에게 주로 무엇을 기대할까?", choices: [
    { label: "분위기를 움직이는 추진력", scores: { spark: 2, breeze: 1 } },
    { label: "흔들리지 않는 안정감", scores: { anchor: 2, grove: 1 } },
  ] },
  { prompt: "내가 가장 편안한 대화는?", choices: [
    { label: "생각이 튀어도 자유롭게 이어지는 대화", scores: { breeze: 2, spark: 1 } },
    { label: "천천히 깊어지고 여운이 남는 대화", scores: { grove: 2, anchor: 1 } },
  ] },
];

const results: TrendQuizResult[] = [
  { id: "spark", emoji: "⚡", title: "점화형 스파크", subtitle: "빠르게 시작해 주변의 속도까지 바꾸는 사람", description: "아이디어를 행동으로 옮기는 속도가 빠르고 정체된 분위기에 불을 붙입니다. 다만 시작의 에너지가 큰 만큼 회복 시간을 일정에 먼저 넣으면 강점이 더 오래갑니다.", tags: ["추진력", "직진", "변화", "첫걸음"], tips: ["큰 목표보다 오늘 끝낼 한 가지를 선언해보세요.", "결정 전 10분만 반대 근거를 확인하면 실수가 줄어요."], accent: "#d64b2a" },
  { id: "breeze", emoji: "🫧", title: "확산형 브리즈", subtitle: "감정과 아이디어를 가볍게 연결하는 사람", description: "낯선 사람과 주제 사이에서 접점을 찾아내고 분위기를 유연하게 만듭니다. 선택지가 많아질수록 에너지가 흩어질 수 있으니 마감 기준 하나가 도움이 됩니다.", tags: ["공감", "즉흥", "연결", "호기심"], tips: ["떠오른 생각을 세 문장으로 적어 하나만 실행해보세요.", "약속 사이에 아무 일정 없는 30분을 남겨두세요."], accent: "#467d8a" },
  { id: "anchor", emoji: "🧭", title: "정렬형 앵커", subtitle: "기준을 세워 팀과 일상을 안정시키는 사람", description: "정보를 차분히 정리하고 약속을 지키며 신뢰를 만듭니다. 확실해질 때까지 기다리기보다 70%에서 작은 실험을 시작하면 기회가 넓어집니다.", tags: ["계획", "신뢰", "집중", "완주"], tips: ["계획표에 실험 칸을 따로 만들어보세요.", "혼자 책임지기 전에 기대치를 말로 확인하세요."], accent: "#384f77" },
  { id: "grove", emoji: "🌿", title: "숙성형 그로브", subtitle: "천천히 관찰해 본질을 발견하는 사람", description: "사람의 미묘한 변화와 상황의 맥락을 잘 읽고 깊이 있는 결론을 만듭니다. 생각이 충분히 익었다면 작은 표현부터 밖으로 꺼내는 연습이 좋습니다.", tags: ["관찰", "깊이", "배려", "균형"], tips: ["생각을 완성하기 전 초안을 한 사람에게 공유해보세요.", "감정과 사실을 나눠 적으면 결정이 선명해져요."], accent: "#547257" },
];

export default function EnergyTypeTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8">
          <p className="text-sm font-bold text-[#a93d28]">SELF DIGGING · 3분</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">나의 에너지 성향 테스트</h1>
          <p className="mt-4 max-w-2xl leading-7 text-gray-600">나는 밀어붙이는 사람일까, 천천히 숙성하는 사람일까? 행동 속도와 관계 방식을 네 가지 에너지로 살펴보세요.</p>
        </header>
        <TrendQuiz slug="energy-type-test" kicker="ENERGY TYPE" questions={questions} results={results} />
        <section className="calc-seo-card mt-8">
          <h2 className="calc-seo-title">어떤 검사인가요?</h2>
          <p className="text-sm leading-7 text-gray-600">성별이나 호르몬을 성격과 연결하지 않고, 일상에서 드러나는 추진 속도·감정 반응·계획 성향만 재미로 정리합니다. 의학적·심리학적 진단이 아닙니다.</p>
        </section>
        <section className="calc-seo-card mt-6">
          <h2 className="calc-seo-title">이용 방법</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-gray-600">
            <li>새 제안을 받았을 때, 친구의 고민을 들을 때처럼 일상 장면을 다룬 8개 질문에 차례로 답합니다.</li>
            <li>질문마다 두 가지 보기 중 지금의 나와 더 가까운 쪽을 고릅니다. 고르면 바로 다음 질문으로 넘어갑니다.</li>
            <li>마지막 질문에 답하면 네 가지 에너지 유형 중 하나와 설명, 키워드, 생활 팁이 나옵니다.</li>
            <li>결과 카드를 이미지로 저장하거나 링크로 공유할 수 있고, &lsquo;다시 테스트하기&rsquo;로 처음부터 다시 할 수 있습니다.</li>
          </ol>
        </section>
        <section className="calc-seo-card mt-6">
          <h2 className="calc-seo-title">네 가지 에너지와 결과 계산 방식</h2>
          <p className="text-sm leading-7 text-gray-600">빠르게 시작하는 점화형 스파크, 감정과 아이디어를 잇는 확산형 브리즈, 기준을 세우는 정렬형 앵커, 천천히 관찰하는 숙성형 그로브가 있습니다. 보기마다 두 유형에 점수가 나뉘어 있어, 8개 답변의 점수를 더해 가장 높은 유형이 결과가 됩니다. 점수가 같으면 스파크, 브리즈, 앵커, 그로브 순서로 앞선 유형이 표시됩니다. 같은 사람도 요즘 상황에 따라 답이 달라질 수 있으니 결과는 지금의 경향을 가볍게 돌아보는 참고로만 봐 주세요.</p>
        </section>
        <section className="calc-seo-card mt-6">
          <h2 className="calc-seo-title">자주 묻는 질문</h2>
          <div className="space-y-4 text-sm leading-7 text-gray-600">
            <div><h3 className="font-bold text-gray-900">내 답변이 저장되나요?</h3><p>답변은 저장하지 않습니다. 결과가 나오면 주소창에 결과 유형만 표시되어, 그 링크를 공유하면 같은 결과 화면을 보여줄 수 있습니다.</p></div>
            <div><h3 className="font-bold text-gray-900">MBTI와 같은 검사인가요?</h3><p>아니요. 이 사이트에서 만든 재미용 문항으로, MBTI나 공인 심리검사와 관련이 없습니다.</p></div>
            <div><h3 className="font-bold text-gray-900">답을 잘못 골랐어요.</h3><p>지금은 이전 질문으로 돌아가는 기능이 없습니다. 결과 화면에서 &lsquo;다시 테스트하기&rsquo;를 눌러 처음부터 다시 진행해 주세요.</p></div>
          </div>
        </section>
        <RelatedTools current="energy-type-test" />
      </div>
    </main>
  );
}
