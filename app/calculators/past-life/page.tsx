"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface PastLife {
  name: string;
  emoji: string;
  era: string;
  region: string;
  personality: string;
  influence: string;
}

const pastLives: PastLife[] = [
  {
    name: "조선시대 궁녀",
    emoji: "\uD83C\uDFEF",
    era: "조선시대 (1400년대)",
    region: "한반도",
    personality: "궁궐 깊숙한 곳에서 왕실의 비밀을 지키던 당신. 섬세하고 눈치가 빨라 누구보다 먼저 상황을 파악했습니다. 조용하지만 강인한 내면을 가졌으며, 바느질과 요리에 능숙했습니다.",
    influence: "현생에서도 비밀을 잘 지키고, 섬세한 관찰력이 뛰어납니다. 조용히 자신의 역할을 완수하는 묵묵한 성실함이 있습니다.",
  },
  {
    name: "로마 검투사",
    emoji: "\u2694\uFE0F",
    era: "로마제국 (100년대)",
    region: "이탈리아 로마",
    personality: "콜로세움에서 수만 관중의 함성을 받으며 싸우던 전설적인 검투사. 강인한 체력과 불굴의 의지로 수많은 전투에서 살아남았습니다. 동료에 대한 의리가 남달랐습니다.",
    influence: "현생에서 경쟁심이 강하고, 어려운 상황에서도 포기하지 않는 끈기가 있습니다. 운동이나 도전적인 활동에 끌립니다.",
  },
  {
    name: "이집트 파라오",
    emoji: "\uD83D\uDC51",
    era: "고대 이집트 (BC 1300년대)",
    region: "나일강 유역",
    personality: "태양신 라의 아들로 불리던 당신. 거대한 피라미드 건설을 지휘하고, 수천 년 후까지 기억될 유산을 남겼습니다. 카리스마 넘치고 예술을 사랑하는 통치자였습니다.",
    influence: "현생에서 리더십이 뛰어나고, 큰 프로젝트를 이끄는 능력이 있습니다. 웅장하고 아름다운 것에 끌립니다.",
  },
  {
    name: "중세 기사",
    emoji: "\uD83D\uDEE1\uFE0F",
    era: "중세 유럽 (1200년대)",
    region: "프랑스",
    personality: "명예와 충성을 목숨보다 소중히 여기던 기사. 말 위에서 창을 들고 토너먼트에 출전하여 숱한 승리를 거두었습니다. 약자를 보호하고 정의를 실현하는 것이 삶의 목표였습니다.",
    influence: "현생에서 정의감이 강하고, 약자를 돕는 것에 보람을 느낍니다. 명예를 중시하며 의리 있는 성격입니다.",
  },
  {
    name: "일본 닌자",
    emoji: "\uD83E\uDD77",
    era: "일본 전국시대 (1500년대)",
    region: "일본 이가",
    personality: "그림자처럼 움직이며 누구도 당신의 존재를 눈치채지 못했습니다. 뛰어난 무술 실력과 지략으로 수많은 임무를 완수했으며, 인내와 집중력이 남달랐습니다.",
    influence: "현생에서 집중력이 뛰어나고, 필요한 순간에 결단력을 발휘합니다. 조용히 목표를 달성하는 스타일입니다.",
  },
  {
    name: "바이킹 전사",
    emoji: "\u26F5",
    era: "바이킹 시대 (800년대)",
    region: "스칸디나비아",
    personality: "거친 북해를 누비며 미지의 세계를 탐험하던 용감한 전사. 험난한 항해에도 굴하지 않는 강인함과, 동료와 나누는 따뜻한 유대가 당신의 특징이었습니다.",
    influence: "현생에서 모험을 사랑하고 여행에 대한 강한 열망이 있습니다. 새로운 경험을 두려워하지 않습니다.",
  },
  {
    name: "그리스 철학자",
    emoji: "\uD83C\uDFDB\uFE0F",
    era: "고대 그리스 (BC 400년대)",
    region: "아테네",
    personality: "아고라 광장에서 제자들과 진리에 대해 토론하던 현자. 세상의 근본 원리를 탐구하고, 사물의 본질을 꿰뚫어 보는 통찰력을 가졌습니다. 질문하는 것을 두려워하지 않았습니다.",
    influence: "현생에서 깊은 사고를 즐기고, 철학적인 대화를 좋아합니다. '왜?'라는 질문을 자주 합니다.",
  },
  {
    name: "중국 황제의 요리사",
    emoji: "\uD83C\uDF7C",
    era: "당나라 (700년대)",
    region: "중국 장안",
    personality: "천자의 입맛을 사로잡은 전설적인 요리사. 전국 각지의 진귀한 식재료를 연구하고, 맛의 조화를 완벽하게 이끌어내는 예술가였습니다. 섬세한 손놀림과 창의력이 뛰어났습니다.",
    influence: "현생에서 음식에 대한 관심이 높고, 손재주가 좋습니다. 세밀한 작업에서 집중력을 발휘합니다.",
  },
  {
    name: "마야 천문학자",
    emoji: "\uD83D\uDD2D",
    era: "마야 문명 (600년대)",
    region: "중앙아메리카",
    personality: "피라미드 꼭대기에서 밤하늘의 별을 관찰하며 달력을 만들던 천문학자. 수학적 천재성으로 정교한 계산을 수행했으며, 미래를 예측하는 능력으로 존경받았습니다.",
    influence: "현생에서 수학이나 과학에 재능이 있고, 밤하늘을 보면 묘한 향수를 느낍니다.",
  },
  {
    name: "르네상스 화가",
    emoji: "\uD83C\uDFA8",
    era: "르네상스 (1400년대)",
    region: "이탈리아 피렌체",
    personality: "빛과 색의 마법사. 캔버스 위에 인간의 아름다움을 담아내며 세상을 놀라게 했습니다. 예술에 대한 열정이 뜨겁고, 완벽한 작품을 위해 밤낮없이 작업했습니다.",
    influence: "현생에서 예술적 감수성이 뛰어나고, 아름다운 것에 대한 안목이 높습니다. 창작 활동에서 기쁨을 느낍니다.",
  },
  {
    name: "해적선 선장",
    emoji: "\uD83C\uDFF4\u200D\u2620\uFE0F",
    era: "대항해시대 (1600년대)",
    region: "카리브해",
    personality: "자유의 바다를 누비며 보물을 찾아 모험하던 전설의 해적 선장. 대담한 작전으로 수많은 상선을 나포했지만, 부하들에게는 공정하게 전리품을 나누는 의리의 사람이었습니다.",
    influence: "현생에서 자유를 극도로 중시하고, 규칙에 얽매이는 것을 싫어합니다. 리더십과 모험심이 있습니다.",
  },
  {
    name: "아마존 샤먼",
    emoji: "\uD83C\uDF3F",
    era: "고대 (시대 불명)",
    region: "남미 아마존",
    personality: "정글의 모든 식물과 동물의 언어를 이해하던 영적 지도자. 약초로 병을 치료하고, 의식을 통해 부족민들의 영혼을 안내했습니다. 자연과 하나 되는 삶을 살았습니다.",
    influence: "현생에서 자연에 대한 깊은 친화력이 있고, 직관력이 강합니다. 치유와 힐링에 관심이 높습니다.",
  },
  {
    name: "실크로드 상인",
    emoji: "\uD83D\uDC2A",
    era: "중세 (1000년대)",
    region: "중앙아시아",
    personality: "동양과 서양을 잇는 실크로드를 오가며 비단, 향신료, 보석을 거래하던 부유한 상인. 여러 언어를 구사하고, 다양한 문화를 이해하는 세계시민이었습니다.",
    influence: "현생에서 사교성이 뛰어나고, 다양한 문화에 호기심이 많습니다. 비즈니스 감각이 남다릅니다.",
  },
  {
    name: "고대 올림픽 선수",
    emoji: "\uD83C\uDFC5",
    era: "고대 그리스 (BC 500년대)",
    region: "그리스 올림피아",
    personality: "올리브 관을 쓰고 만신전에서 영웅으로 추앙받던 올림픽 챔피언. 극한의 훈련을 즐겼으며, 승리를 위해 한계를 넘어서는 투지를 가졌습니다.",
    influence: "현생에서 스포츠나 신체 활동에 재능이 있고, 목표를 향해 끈기 있게 노력하는 성격입니다.",
  },
  {
    name: "조선시대 포졸",
    emoji: "\uD83D\uDD75\uFE0F",
    era: "조선시대 (1700년대)",
    region: "한반도",
    personality: "한양 거리를 순찰하며 백성의 안전을 지키던 충직한 포졸. 날카로운 관찰력으로 범인을 추적하고, 공정한 판단으로 사건을 해결했습니다. 정의감이 누구보다 강했습니다.",
    influence: "현생에서 불의를 보면 참지 못하고, 진실을 밝히는 일에 열정이 있습니다. 탐정 이야기에 끌립니다.",
  },
  {
    name: "빅토리아 시대 탐정",
    emoji: "\uD83D\uDD0D",
    era: "빅토리아 시대 (1800년대)",
    region: "영국 런던",
    personality: "안개 낀 런던 거리를 누비며 미스터리한 사건을 해결하던 명탐정. 뛰어난 추리력과 관찰력으로 경찰도 풀지 못한 난제를 해결했습니다. 파이프 담배를 즐기며 사색에 잠기곤 했습니다.",
    influence: "현생에서 논리적 사고가 뛰어나고, 퍼즐이나 미스터리를 좋아합니다. 디테일에 강합니다.",
  },
  {
    name: "이집트 미라 제작자",
    emoji: "\uD83C\uDFFA",
    era: "고대 이집트 (BC 1000년대)",
    region: "이집트 테베",
    personality: "죽음과 부활의 비밀을 다루던 신성한 직업의 전문가. 정교한 기술로 파라오의 육신을 영원히 보존하는 의식을 수행했습니다. 꼼꼼하고 인내심이 극도로 강했습니다.",
    influence: "현생에서 꼼꼼하고 완벽주의적인 성향이 있습니다. 오래 보존되는 것, 역사에 관심이 많습니다.",
  },
  {
    name: "페르시아 시인",
    emoji: "\uD83D\uDCDC",
    era: "중세 페르시아 (1200년대)",
    region: "이란",
    personality: "장미 정원에서 사랑과 신비에 대한 아름다운 시를 읊던 시인. 언어의 마법사로 불리며, 당신의 시는 왕부터 서민까지 모든 이의 마음을 울렸습니다.",
    influence: "현생에서 언어 감각이 뛰어나고, 감정 표현이 풍부합니다. 글쓰기나 이야기에 재능이 있습니다.",
  },
  {
    name: "아즈텍 전사",
    emoji: "\uD83E\uDDB5",
    era: "아즈텍 문명 (1400년대)",
    region: "멕시코",
    personality: "재규어 전사단의 일원으로 태양신에게 바치는 전투에서 용맹을 떨치던 전사. 화려한 깃털 장식을 하고, 전장에서 누구보다 앞장서 싸웠습니다. 신앙심이 깊고 충성스러웠습니다.",
    influence: "현생에서 열정적이고 헌신적인 성격입니다. 자신이 믿는 가치를 위해 기꺼이 희생할 수 있습니다.",
  },
  {
    name: "중세 연금술사",
    emoji: "\u2697\uFE0F",
    era: "중세 유럽 (1300년대)",
    region: "독일 프라하",
    personality: "납을 금으로 바꾸고 영생의 비약을 만들기 위해 밤낮없이 실험하던 연금술사. 실패를 두려워하지 않는 탐구 정신과, 세상의 비밀을 풀어내려는 끝없는 호기심을 가졌습니다.",
    influence: "현생에서 과학이나 실험에 흥미가 있고, 불가능해 보이는 것에 도전하는 것을 즐깁니다.",
  },
];

function hashDate(year: number, month: number, day: number): number {
  let h = year * 367 + month * 131 + day * 53;
  h = ((h >>> 0) * 2654435761) >>> 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h;
}

export default function PastLifeTest() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [result, setResult] = useState<PastLife | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    const text = `[전생 테스트] ${result.emoji} ${result.name}\n시대: ${result.era} / 지역: ${result.region}\n${result.personality}\n현생 영향: ${result.influence}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCalculate = () => {
    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);
    if (!y || !m || !d || m < 1 || m > 12 || d < 1 || d > 31) return;

    const hash = hashDate(y, m, d);
    const idx = hash % pastLives.length;
    setResult(pastLives[idx]);
    setShowResult(true);
  };

  const handleReset = () => {
    setYear("");
    setMonth("");
    setDay("");
    setResult(null);
    setShowResult(false);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">전생 테스트</h1>
      <p className="text-gray-500 mb-8">
        생년월일을 입력하고 전생에서 어떤 삶을 살았는지 알아보세요!
      </p>

      {/* 입력 영역 */}
      {!showResult && (
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-xl p-8 mb-6 text-white">
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">&#x1F52E;</div>
            <h2 className="text-xl font-bold">당신의 전생이 궁금하다면...</h2>
            <p className="text-purple-200 text-sm mt-1">생년월일을 입력해 주세요</p>
          </div>

          <div className="max-w-sm mx-auto space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-purple-200 mb-1">년도</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="1990"
                  className="w-full px-3 py-2.5 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-200 mb-1">월</label>
                <input
                  type="number"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="1"
                  min={1}
                  max={12}
                  className="w-full px-3 py-2.5 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-200 mb-1">일</label>
                <input
                  type="number"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="15"
                  min={1}
                  max={31}
                  className="w-full px-3 py-2.5 bg-white/10 border border-purple-400/30 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>
            <button
              onClick={handleCalculate}
              className="w-full py-3 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-lg transition-colors"
            >
              &#x2728; 전생 알아보기 &#x2728;
            </button>
          </div>
        </div>
      )}

      {/* 결과 영역 */}
      {showResult && result && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-xl p-8 text-white text-center">
            <p className="text-purple-200 text-sm mb-2">&#x2B50; 당신의 전생은... &#x2B50;</p>
            <div className="text-6xl mb-4">{result.emoji}</div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">{result.name}</h2>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-purple-300 rounded hover:bg-white/20 transition-colors text-purple-200"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <div className="flex justify-center gap-4 text-purple-200 text-sm">
              <span>&#x1F4C5; {result.era}</span>
              <span>&#x1F30D; {result.region}</span>
            </div>
          </div>

          <div className="calc-card p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">&#x1F4D6; 전생 스토리</h3>
            <p className="text-gray-600 leading-relaxed">{result.personality}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">&#x1F300; 현생에 미치는 영향</h3>
            <p className="text-gray-700 leading-relaxed">{result.influence}</p>
          </div>

          <div className="text-center">
            <button
              onClick={handleReset}
              className="px-8 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              &#x1F504; 다른 날짜로 테스트
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 text-center">
            <p className="text-sm text-gray-500">
              본 테스트는 재미를 위한 것으로, 실제 전생과는 관련이 없습니다.
            </p>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">전생 테스트란?</h2>
          <p className="text-gray-600 leading-relaxed">
            전생 테스트는 생년월일을 기반으로 전생에서의 직업이나 인물을 재미있게
            알아보는 엔터테인먼트입니다. 다양한 시대와 지역의 흥미로운 역할들 중
            나와 연결된 전생을 확인해 보세요. 친구들과 함께 결과를 비교하면 더 재미있습니다!
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">어떤 전생들이 있나요?</h2>
          <p className="text-gray-600 leading-relaxed">
            조선시대 궁녀, 로마 검투사, 이집트 파라오, 중세 기사, 일본 닌자, 바이킹 전사,
            그리스 철학자, 르네상스 화가, 해적선 선장, 아마존 샤먼 등 20가지 이상의
            다양한 시대와 문화의 흥미로운 전생이 준비되어 있습니다.
          </p>
        </div>
      </section>

      <RelatedTools current="past-life" />
    </div>
  );
}
