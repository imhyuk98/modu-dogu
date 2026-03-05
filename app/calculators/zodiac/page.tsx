"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

interface ZodiacAnimal {
  name: string;
  hanja: string;
  emoji: string;
  personality: string[];
  goodMatch: string[];
  badMatch: string[];
  celebrities: string[];
}

const ZODIAC_ANIMALS: ZodiacAnimal[] = [
  {
    name: "쥐",
    hanja: "자(子)",
    emoji: "\uD83D\uDC00",
    personality: [
      "영리하고 재치가 넘치며, 사교성이 뛰어납니다.",
      "꼼꼼하고 절약을 잘하며 경제관념이 뚜렷합니다.",
      "직감이 뛰어나고 기회를 잘 포착하는 능력이 있습니다.",
      "다정다감하지만 때로는 소심한 면도 있습니다.",
    ],
    goodMatch: ["용띠", "원숭이띠", "소띠"],
    badMatch: ["말띠", "양띠", "토끼띠"],
    celebrities: ["이순신 (1545)", "세종대왕 (1397)", "BTS 슈가 (1993)"],
  },
  {
    name: "소",
    hanja: "축(丑)",
    emoji: "\uD83D\uDC02",
    personality: [
      "성실하고 인내심이 강하며, 묵묵히 노력하는 타입입니다.",
      "책임감이 강하고 신뢰할 수 있는 성격입니다.",
      "보수적이지만 한번 시작하면 끝까지 해내는 끈기가 있습니다.",
      "가족을 중시하며 안정적인 삶을 추구합니다.",
    ],
    goodMatch: ["뱀띠", "닭띠", "쥐띠"],
    badMatch: ["양띠", "말띠", "개띠"],
    celebrities: ["오바마 (1961)", "메시 (1987)", "한석규 (1964)"],
  },
  {
    name: "호랑이",
    hanja: "인(寅)",
    emoji: "\uD83D\uDC05",
    personality: [
      "용감하고 자신감이 넘치며, 리더십이 강합니다.",
      "정의감이 투철하고 불의를 참지 못하는 성격입니다.",
      "모험을 즐기고 도전적이며 열정적입니다.",
      "독립적이고 자존심이 강하지만 따뜻한 마음을 가지고 있습니다.",
    ],
    goodMatch: ["말띠", "개띠", "돼지띠"],
    badMatch: ["원숭이띠", "뱀띠", "호랑이띠"],
    celebrities: ["김연아 (1990)", "손흥민 (1992)", "톰 크루즈 (1962)"],
  },
  {
    name: "토끼",
    hanja: "묘(卯)",
    emoji: "\uD83D\uDC07",
    personality: [
      "온화하고 예의 바르며, 섬세한 감성의 소유자입니다.",
      "예술적 감각이 뛰어나고 창의적입니다.",
      "평화를 사랑하고 갈등을 피하려는 경향이 있습니다.",
      "사교적이며 주변 사람들과 잘 어울립니다.",
    ],
    goodMatch: ["양띠", "돼지띠", "개띠"],
    badMatch: ["닭띠", "쥐띠", "용띠"],
    celebrities: ["아인슈타인 (1879)", "앤젤리나 졸리 (1975)", "아이유 (1993)"],
  },
  {
    name: "용",
    hanja: "진(辰)",
    emoji: "\uD83D\uDC09",
    personality: [
      "카리스마가 넘치고 야망이 크며, 에너지가 풍부합니다.",
      "창의적이고 상상력이 풍부하며 비전이 있습니다.",
      "자신감이 넘치고 솔직하며 대담한 성격입니다.",
      "완벽주의 성향이 있으며 높은 목표를 추구합니다.",
    ],
    goodMatch: ["쥐띠", "원숭이띠", "닭띠"],
    badMatch: ["개띠", "토끼띠", "용띠"],
    celebrities: ["브루스 리 (1940)", "존 레논 (1940)", "BTS RM (1994)"],
  },
  {
    name: "뱀",
    hanja: "사(巳)",
    emoji: "\uD83D\uDC0D",
    personality: [
      "지혜롭고 직관력이 뛰어나며, 깊은 사고를 합니다.",
      "우아하고 세련되며, 미적 감각이 좋습니다.",
      "결단력이 있고 목표를 향해 조용히 나아갑니다.",
      "신비로운 매력이 있으며, 비밀을 잘 지킵니다.",
    ],
    goodMatch: ["소띠", "닭띠", "원숭이띠"],
    badMatch: ["호랑이띠", "돼지띠", "뱀띠"],
    celebrities: ["간디 (1869)", "테일러 스위프트 (1989)", "공유 (1979)"],
  },
  {
    name: "말",
    hanja: "오(午)",
    emoji: "\uD83D\uDC0E",
    personality: [
      "활동적이고 에너지가 넘치며, 자유를 사랑합니다.",
      "밝고 긍정적이며, 유머 감각이 뛰어납니다.",
      "독립적이고 모험을 즐기며, 여행을 좋아합니다.",
      "열정적이고 표현력이 풍부하지만 때로는 성급할 수 있습니다.",
    ],
    goodMatch: ["호랑이띠", "개띠", "양띠"],
    badMatch: ["쥐띠", "소띠", "말띠"],
    celebrities: ["칭기즈칸 (1162)", "폴 매카트니 (1942)", "전지현 (1981)"],
  },
  {
    name: "양",
    hanja: "미(未)",
    emoji: "\uD83D\uDC11",
    personality: [
      "온순하고 배려심이 깊으며, 예술적 재능이 있습니다.",
      "상상력이 풍부하고 감성적이며, 낭만적입니다.",
      "평화를 사랑하고 조화를 중시하는 성격입니다.",
      "내성적인 면이 있지만, 깊은 인간관계를 형성합니다.",
    ],
    goodMatch: ["토끼띠", "말띠", "돼지띠"],
    badMatch: ["소띠", "개띠", "쥐띠"],
    celebrities: ["미켈란젤로 (1475)", "스티브 잡스 (1955)", "윤아 (1990)"],
  },
  {
    name: "원숭이",
    hanja: "신(申)",
    emoji: "\uD83D\uDC12",
    personality: [
      "똑똑하고 재치 있으며, 문제 해결 능력이 뛰어납니다.",
      "호기심이 많고 다재다능하며, 적응력이 좋습니다.",
      "유머 감각이 뛰어나고 사교적입니다.",
      "자신감이 넘치고 경쟁심이 강하며, 영리하게 행동합니다.",
    ],
    goodMatch: ["쥐띠", "용띠", "뱀띠"],
    badMatch: ["호랑이띠", "돼지띠", "원숭이띠"],
    celebrities: ["레오나르도 다빈치 (1452)", "윌 스미스 (1968)", "송중기 (1985)"],
  },
  {
    name: "닭",
    hanja: "유(酉)",
    emoji: "\uD83D\uDC13",
    personality: [
      "부지런하고 관찰력이 뛰어나며, 완벽주의 성향이 있습니다.",
      "솔직하고 직설적이며, 자기 표현에 거침이 없습니다.",
      "패션 감각이 뛰어나고 외모에 관심이 많습니다.",
      "용기 있고 독립적이며, 시간 관리를 잘합니다.",
    ],
    goodMatch: ["소띠", "뱀띠", "용띠"],
    badMatch: ["토끼띠", "닭띠", "개띠"],
    celebrities: ["베토벤 (1770)", "빌 게이츠 (1955)", "블랙핑크 제니 (1996)"],
  },
  {
    name: "개",
    hanja: "술(戌)",
    emoji: "\uD83D\uDC15",
    personality: [
      "충직하고 의리가 있으며, 정직한 성격입니다.",
      "정의감이 강하고 약자를 돕는 마음이 큽니다.",
      "책임감이 강하고 한번 맡은 일은 끝까지 해냅니다.",
      "걱정이 많고 신중하지만, 믿을 수 있는 친구입니다.",
    ],
    goodMatch: ["호랑이띠", "말띠", "토끼띠"],
    badMatch: ["용띠", "양띠", "소띠"],
    celebrities: ["소크라테스 (BC 470)", "마이클 잭슨 (1958)", "송혜교 (1981)"],
  },
  {
    name: "돼지",
    hanja: "해(亥)",
    emoji: "\uD83D\uDC37",
    personality: [
      "너그럽고 낙천적이며, 인정이 많은 성격입니다.",
      "성실하고 정직하며, 물질적 풍요를 추구합니다.",
      "사교적이고 유머 감각이 있으며, 주변을 즐겁게 합니다.",
      "참을성이 강하고 끈기가 있으며, 목표를 위해 노력합니다.",
    ],
    goodMatch: ["토끼띠", "양띠", "호랑이띠"],
    badMatch: ["뱀띠", "원숭이띠", "돼지띠"],
    celebrities: ["헨리 포드 (1863)", "아놀드 슈워제네거 (1947)", "박서준 (1988)"],
  },
];

const HEAVENLY_STEMS = [
  { name: "갑", hanja: "甲", element: "목(木)", color: "#22c55e" },
  { name: "을", hanja: "乙", element: "목(木)", color: "#22c55e" },
  { name: "병", hanja: "丙", element: "화(火)", color: "#ef4444" },
  { name: "정", hanja: "丁", element: "화(火)", color: "#ef4444" },
  { name: "무", hanja: "戊", element: "토(土)", color: "#eab308" },
  { name: "기", hanja: "己", element: "토(土)", color: "#eab308" },
  { name: "경", hanja: "庚", element: "금(金)", color: "#a3a3a3" },
  { name: "신", hanja: "辛", element: "금(金)", color: "#a3a3a3" },
  { name: "임", hanja: "壬", element: "수(水)", color: "#3b82f6" },
  { name: "계", hanja: "癸", element: "수(水)", color: "#3b82f6" },
];

const ELEMENT_DESCRIPTIONS: Record<string, string> = {
  "목(木)": "성장과 생명력을 상징합니다. 인자하고 창의적이며, 봄의 기운을 지닙니다.",
  "화(火)": "열정과 에너지를 상징합니다. 활동적이고 밝으며, 여름의 기운을 지닙니다.",
  "토(土)": "안정과 신뢰를 상징합니다. 착실하고 포용력이 있으며, 환절기의 기운을 지닙니다.",
  "금(金)": "결단력과 정의를 상징합니다. 단호하고 깔끔하며, 가을의 기운을 지닙니다.",
  "수(水)": "지혜와 유연함을 상징합니다. 총명하고 적응력이 뛰어나며, 겨울의 기운을 지닙니다.",
};

interface ZodiacResult {
  animal: ZodiacAnimal;
  stem: (typeof HEAVENLY_STEMS)[number];
  fullName: string;
  year: number;
}

function calculateZodiac(year: number): ZodiacResult {
  const animalIndex = ((year - 4) % 12 + 12) % 12;
  const stemIndex = ((year - 4) % 10 + 10) % 10;

  const animal = ZODIAC_ANIMALS[animalIndex];
  const stem = HEAVENLY_STEMS[stemIndex];
  const branchNames = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
  const fullName = `${stem.name}${branchNames[animalIndex]}(${stem.hanja}${animal.hanja.charAt(animal.hanja.length - 2)})년`;

  return { animal, stem, fullName, year };
}

export default function ZodiacCalculator() {
  const [yearInput, setYearInput] = useState("");
  const [result, setResult] = useState<ZodiacResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const year = parseInt(yearInput, 10);
    if (!year || year < 1 || year > 2100) return;
    setShowAnimation(true);
    setResult(calculateZodiac(year));
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleReset = () => {
    setYearInput("");
    setResult(null);
    setShowAnimation(false);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[띠 계산기] ${result.year}년생 - ${result.animal.emoji} ${result.animal.name}띠\n${result.fullName}\n오행: ${result.stem.element}\n잘 맞는 띠: ${result.animal.goodMatch.join(", ")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const quickYears = [
    currentYear - 30,
    currentYear - 25,
    currentYear - 20,
    currentYear - 15,
    currentYear - 10,
    currentYear,
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        띠 계산기 (12간지)
      </h1>
      <p className="text-gray-500 mb-8">
        출생년도를 입력하면 나의 띠, 천간, 오행, 성격, 궁합을 알려드립니다.
      </p>

      {/* Input */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          출생년도
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={yearInput}
              onChange={(e) => setYearInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 1995"
              min={1}
              max={2100}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              년
            </span>
          </div>
          <button
            onClick={handleCalculate}
            className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
          >
            알아보기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>

        {/* Quick select */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickYears.map((y) => (
            <button
              key={y}
              onClick={() => {
                setYearInput(String(y));
                setShowAnimation(true);
                setResult(calculateZodiac(y));
                setTimeout(() => setShowAnimation(false), 1000);
              }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-purple-50 hover:border-purple-300 transition-colors"
            >
              {y}년
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6">
          {/* Main result card */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div
              className="text-center p-8"
              style={{
                background: `linear-gradient(135deg, ${result.stem.color}15, ${result.stem.color}30)`,
              }}
            >
              <div
                className={`text-8xl mb-4 inline-block ${
                  showAnimation ? "animate-bounce" : ""
                }`}
              >
                {result.animal.emoji}
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  {result.animal.name}띠
                </h2>
                <button
                  onClick={handleCopy}
                  className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-500"
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>
              <p className="text-lg text-gray-600">{result.animal.hanja}</p>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Heavenly Stem + Earthly Branch */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">천간지지</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.fullName}
                  </p>
                </div>

                {/* Five Elements */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">오행</p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: result.stem.color }}
                  >
                    {result.stem.element}
                  </p>
                </div>

                {/* Year */}
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-500 mb-1">출생년도</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.year}년
                  </p>
                </div>
              </div>

              {/* Element description */}
              <div
                className="rounded-lg p-4 mb-6"
                style={{ backgroundColor: result.stem.color + "10" }}
              >
                <p className="text-sm text-gray-700">
                  <span className="font-semibold" style={{ color: result.stem.color }}>
                    {result.stem.element}
                  </span>{" "}
                  - {ELEMENT_DESCRIPTIONS[result.stem.element]}
                </p>
              </div>
            </div>
          </div>

          {/* Personality */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">{result.animal.emoji}</span>
              {result.animal.name}띠 성격 특성
            </h3>
            <div className="space-y-3">
              {result.animal.personality.map((trait, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: result.stem.color }}
                  />
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {trait}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Compatibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-red-500 text-lg">&#10084;&#65039;</span>
                잘 맞는 띠
              </h3>
              <div className="space-y-2">
                {result.animal.goodMatch.map((match) => (
                  <div
                    key={match}
                    className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg"
                  >
                    <span className="text-lg">
                      {ZODIAC_ANIMALS.find((a) => match.startsWith(a.name))?.emoji}
                    </span>
                    <span className="text-sm text-green-800 font-medium">
                      {match}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-lg">&#9889;</span>
                주의할 띠
              </h3>
              <div className="space-y-2">
                {result.animal.badMatch.map((match) => (
                  <div
                    key={match}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg"
                  >
                    <span className="text-lg">
                      {ZODIAC_ANIMALS.find((a) => match.startsWith(a.name))?.emoji}
                    </span>
                    <span className="text-sm text-red-800 font-medium">
                      {match}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Famous people */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">&#11088;</span>
              같은 {result.animal.name}띠 유명인
            </h3>
            <div className="flex flex-wrap gap-3">
              {result.animal.celebrities.map((celeb) => (
                <span
                  key={celeb}
                  className="px-4 py-2 bg-purple-50 text-purple-800 rounded-full text-sm font-medium"
                >
                  {celeb}
                </span>
              ))}
            </div>
          </div>

          {/* All 12 animals quick view */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">12지지 한눈에 보기</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {ZODIAC_ANIMALS.map((animal, i) => {
                const isSelected = animal.name === result.animal.name;
                return (
                  <button
                    key={animal.name}
                    onClick={() => {
                      // Find the nearest year with this zodiac
                      const baseYear = currentYear;
                      const currentIndex = ((baseYear - 4) % 12 + 12) % 12;
                      let targetYear = baseYear - ((currentIndex - i + 12) % 12);
                      if (targetYear > currentYear) targetYear -= 12;
                      setYearInput(String(targetYear));
                      setShowAnimation(true);
                      setResult(calculateZodiac(targetYear));
                      setTimeout(() => setShowAnimation(false), 1000);
                    }}
                    className={`p-3 rounded-lg text-center transition-all ${
                      isSelected
                        ? "bg-purple-100 border-2 border-purple-400 shadow-md scale-105"
                        : "bg-gray-50 border border-gray-200 hover:bg-purple-50 hover:border-purple-300"
                    }`}
                  >
                    <div className="text-2xl mb-1">{animal.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">
                      {animal.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {animal.hanja}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            띠(12간지)란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            12간지(十二干支)는 동아시아 문화권에서 사용되는 12가지 동물로 이루어진
            순환 체계입니다. 자(쥐), 축(소), 인(호랑이), 묘(토끼), 진(용),
            사(뱀), 오(말), 미(양), 신(원숭이), 유(닭), 술(개), 해(돼지)의
            12동물이 차례로 돌아가며, 각 동물은 특유의 성격과 특성을 가집니다.
            출생년도에 따라 자신의 띠를 알 수 있으며, 한국에서는 나이를 물을 때
            &quot;무슨 띠세요?&quot;라고 묻는 문화가 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            천간과 오행
          </h2>
          <p className="text-gray-600 leading-relaxed">
            천간(天干)은 갑, 을, 병, 정, 무, 기, 경, 신, 임, 계의 10가지로
            이루어져 있으며, 오행(五行)인 목(木), 화(火), 토(土), 금(金),
            수(水)와 연결됩니다. 천간과 지지(12동물)를 조합하면 60갑자가 되며,
            이는 환갑(還甲)의 유래입니다. 예를 들어 2024년은 갑진(甲辰)년으로
            &quot;청룡의 해&quot;라고도 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            띠별 궁합의 원리
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            12간지의 궁합은 삼합(三合), 육합(六合), 상충(相沖) 등의 원리에 기반합니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="text-left py-2 px-3 border border-gray-200">조합</th>
                  <th className="text-left py-2 px-3 border border-gray-200">의미</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">삼합</td>
                  <td className="py-2 px-3 border border-gray-200">쥐-용-원숭이, 소-뱀-닭, 호랑이-말-개, 토끼-양-돼지</td>
                  <td className="py-2 px-3 border border-gray-200">서로 힘을 합치면 크게 성공하는 조합</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">육합</td>
                  <td className="py-2 px-3 border border-gray-200">쥐-소, 호랑이-돼지, 토끼-개, 용-닭, 뱀-원숭이, 말-양</td>
                  <td className="py-2 px-3 border border-gray-200">서로 보완하며 조화를 이루는 조합</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">상충</td>
                  <td className="py-2 px-3 border border-gray-200">쥐-말, 소-양, 호랑이-원숭이, 토끼-닭, 용-개, 뱀-돼지</td>
                  <td className="py-2 px-3 border border-gray-200">성격이 반대여서 마찰이 생길 수 있는 조합</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">음력 생일 기준인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                전통적으로 띠는 음력(구정) 기준이지만, 현대에는 양력 출생년도를 기준으로 계산하는 것이 일반적입니다. 1~2월생이신 경우 음력 기준으로는 전년도 띠일 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">60갑자(환갑)란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                천간 10개와 지지 12개를 조합하면 최소공배수인 60가지 조합이 나옵니다. 이 60년 주기를 완성하면 &quot;환갑&quot;이라 하며, 61세 생일을 축하하는 전통이 여기서 유래했습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">띠 궁합은 과학적인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                띠 궁합은 동아시아 전통 문화에 기반한 것으로, 과학적으로 검증된 것은 아닙니다. 재미와 문화적 이해 차원에서 참고하시는 것을 권장합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="zodiac" />
    </div>
  );
}
