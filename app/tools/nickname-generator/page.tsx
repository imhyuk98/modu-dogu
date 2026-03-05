"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

type Style = "cute" | "cool" | "funny" | "game";

const styleConfig: Record<
  Style,
  { label: string; emoji: string; color: string; activeBg: string; activeText: string; border: string }
> = {
  cute: { label: "귀여운", emoji: "🐰", color: "bg-pink-50 text-pink-700", activeBg: "bg-pink-500", activeText: "text-white", border: "border-pink-200" },
  cool: { label: "멋진", emoji: "⚔️", color: "bg-indigo-50 text-indigo-700", activeBg: "bg-indigo-500", activeText: "text-white", border: "border-indigo-200" },
  funny: { label: "웃긴", emoji: "😂", color: "bg-amber-50 text-amber-700", activeBg: "bg-amber-500", activeText: "text-white", border: "border-amber-200" },
  game: { label: "게임용", emoji: "🎮", color: "bg-emerald-50 text-emerald-700", activeBg: "bg-emerald-500", activeText: "text-white", border: "border-emerald-200" },
};

// 단어 사전
const words: Record<Exclude<Style, "game">, { adjectives: string[]; nouns: string[] }> = {
  cute: {
    adjectives: [
      "귀여운", "달콤한", "포근한", "몽글몽글", "반짝이는", "뽀송뽀송",
      "말랑말랑", "동글동글", "살랑살랑", "보들보들", "알록달록", "소곤소곤",
      "촉촉한", "폭신폭신", "졸졸졸", "깜찍한", "사르르", "반들반들",
      "새콤달콤", "무지개빛", "솜사탕", "찰랑찰랑", "살포시", "토실토실",
    ],
    nouns: [
      "고양이", "토끼", "구름", "솜사탕", "별", "햄스터", "수달", "판다",
      "곰돌이", "병아리", "나비", "달팽이", "새우", "해파리", "다람쥐",
      "아기곰", "꽃사슴", "물개", "펭귄", "미어캣", "치즈", "마카롱",
      "젤리", "도넛", "딸기", "체리", "복숭아", "푸딩", "쿠키",
    ],
  },
  cool: {
    adjectives: [
      "강렬한", "무적의", "전설의", "불멸의", "위대한", "신비로운", "초월한",
      "궁극의", "찬란한", "고독한", "영원한", "심연의", "폭풍의", "절대적인",
      "암흑의", "성스러운", "고귀한", "무한한", "파멸의", "황금빛",
      "칠흑의", "번개의", "대지의", "태양의",
    ],
    nouns: [
      "기사", "용사", "마법사", "검객", "황제", "사무라이", "드래곤", "불사조",
      "흑룡", "천둥", "폭풍", "군주", "수호자", "파괴자", "사신", "현자",
      "광전사", "암살자", "궁수", "집행자", "정복자", "마왕", "신룡",
      "수라", "천사", "악마", "파이터", "소드마스터",
    ],
  },
  funny: {
    adjectives: [
      "배고픈", "졸린", "심심한", "당황한", "억울한", "멍때리는", "삐진",
      "허탈한", "어리둥절", "피곤한", "게으른", "투덜대는", "헐레벌떡",
      "어설픈", "느긋한", "횡설수설", "뒤죽박죽", "딴짓하는", "얼떨떨한",
      "갈팡질팡", "방금일어난", "서운한", "멘붕온", "급발진",
    ],
    nouns: [
      "감자", "고구마", "두부", "양파", "버섯", "무", "파프리카", "콩나물",
      "어묵", "떡볶이", "김밥", "라면", "찐빵", "만두", "호떡", "붕어빵",
      "순대", "오뎅", "치킨", "피자", "족발", "곱창", "마라탕", "탕후루",
      "소시지", "햄버거", "비빔밥", "짜장면",
    ],
  },
};

const gameWords = {
  prefix: [
    "Dark", "Shadow", "Storm", "Blaze", "Frost", "Night", "Steel", "Thunder",
    "Crimson", "Iron", "Void", "Neon", "Cyber", "Ghost", "Blood", "Azure",
    "Chaos", "Silent", "Rapid", "Omega", "Alpha", "Zero", "Hyper", "Ultra",
  ],
  suffix: [
    "Knight", "Wolf", "Phoenix", "Hunter", "Blade", "Reaper", "Dragon",
    "Slayer", "Hawk", "Viper", "Titan", "King", "Fury", "Fang", "Claw",
    "Strike", "Rage", "Fire", "Storm", "Shadow", "Sniper", "Ninja", "Warrior",
  ],
};

function generateNickname(style: Style, maxLen: number): string {
  if (style === "game") {
    const prefix = gameWords.prefix[Math.floor(Math.random() * gameWords.prefix.length)];
    const suffix = gameWords.suffix[Math.floor(Math.random() * gameWords.suffix.length)];
    const num = Math.floor(Math.random() * 1000);
    const base = `${prefix}${suffix}${num}`;
    return base.length > maxLen * 2 ? base.slice(0, maxLen * 2) : base;
  }

  const dict = words[style];
  const adj = dict.adjectives[Math.floor(Math.random() * dict.adjectives.length)];
  const noun = dict.nouns[Math.floor(Math.random() * dict.nouns.length)];
  const combined = adj + noun;

  if (combined.length <= maxLen) return combined;
  // 글자수 초과 시 명사만 반환하거나 잘라서 반환
  if (noun.length <= maxLen) return noun;
  return combined.slice(0, maxLen);
}

function generateNicknames(style: Style, maxLen: number, count: number = 10): string[] {
  const results = new Set<string>();
  let attempts = 0;
  while (results.size < count && attempts < 200) {
    results.add(generateNickname(style, maxLen));
    attempts++;
  }
  return Array.from(results);
}

export default function NicknameGenerator() {
  const [style, setStyle] = useState<Style>("cute");
  const [maxLen, setMaxLen] = useState(6);
  const [nicknames, setNicknames] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(() => {
    setNicknames(generateNicknames(style, maxLen));
    setCopiedIndex(null);
  }, [style, maxLen]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const currentConfig = styleConfig[style];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        닉네임 생성기
      </h1>
      <p className="text-gray-500 mb-8">
        스타일을 선택하면 랜덤 닉네임 10개를 생성합니다. 마음에 드는 닉네임을 복사해서 사용하세요!
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        {/* 스타일 선택 */}
        <label className="block text-sm font-medium text-gray-700 mb-3">
          닉네임 스타일
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {(Object.keys(styleConfig) as Style[]).map((s) => {
            const cfg = styleConfig[s];
            const isActive = style === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setStyle(s);
                  setMaxLen(s === "game" ? 10 : 4);
                }}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  isActive
                    ? `${cfg.activeBg} ${cfg.activeText} border-transparent shadow-md scale-105`
                    : `${cfg.color} ${cfg.border} hover:shadow-sm`
                }`}
              >
                <div className="text-2xl mb-1">{cfg.emoji}</div>
                <div className="font-bold text-sm">{cfg.label}</div>
              </button>
            );
          })}
        </div>

        {/* 글자수 선택 */}
        <label className="block text-sm font-medium text-gray-700 mb-3">
          최대 글자수 {style === "game" ? "(영문 기준)" : ""}
        </label>
        <div className="flex gap-2 mb-6">
          {(style === "game" ? [8, 10, 12, 14, 16] : [2, 3, 4, 5, 6]).map((len) => (
            <button
              key={len}
              onClick={() => setMaxLen(len)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                maxLen === len
                  ? `${currentConfig.activeBg} ${currentConfig.activeText} shadow-sm`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {len}{style === "game" ? "자" : "글자"}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className={`w-full py-3 font-bold rounded-lg transition-all shadow-md hover:shadow-lg text-lg ${currentConfig.activeBg} text-white`}
        >
          닉네임 생성하기
        </button>
      </div>

      {/* 결과 영역 */}
      {nicknames.length > 0 && (
        <div className="calc-card overflow-hidden">
          <div className={`${currentConfig.activeBg} text-white p-4 text-center`}>
            <p className="text-lg font-bold">
              {styleConfig[style].emoji} {styleConfig[style].label} 닉네임 {nicknames.length}개
            </p>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {nicknames.map((name, i) => (
                <div
                  key={`${name}-${i}`}
                  className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-gray-400 text-sm font-mono mr-3 w-6 text-right">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium text-gray-800 text-lg">
                    {name}
                  </span>
                  <button
                    onClick={() => handleCopy(name, i)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      copiedIndex === i
                        ? "bg-green-100 text-green-700"
                        : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 opacity-70 group-hover:opacity-100"
                    }`}
                  >
                    {copiedIndex === i ? "복사됨!" : "복사"}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              다시 생성하기
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">닉네임 생성기 사용법</h2>
          <p className="text-gray-600 leading-relaxed">
            원하는 닉네임 스타일(귀여운, 멋진, 웃긴, 게임용)을 선택하고 최대 글자수를 지정한 후
            &quot;닉네임 생성하기&quot; 버튼을 누르면 10개의 랜덤 닉네임이 생성됩니다.
            마음에 드는 닉네임 옆의 &quot;복사&quot; 버튼을 눌러 바로 사용할 수 있습니다.
            마음에 드는 닉네임이 없다면 &quot;다시 생성하기&quot;를 눌러 새로운 닉네임을 받아보세요.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">스타일별 닉네임 특징</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">귀여운 닉네임</h3>
              <p className="text-gray-600 text-sm mt-1">
                포근하고 사랑스러운 느낌의 형용사와 동물, 음식 등의 명사를 조합합니다.
                SNS, 채팅, 블로그 등에서 친근한 이미지를 주고 싶을 때 추천합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">멋진 닉네임</h3>
              <p className="text-gray-600 text-sm mt-1">
                강렬하고 카리스마 있는 형용사와 판타지 세계관의 명사를 조합합니다.
                게임, 커뮤니티 등에서 임팩트 있는 닉네임을 원할 때 추천합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">웃긴 닉네임</h3>
              <p className="text-gray-600 text-sm mt-1">
                일상적이고 유머러스한 형용사와 음식 이름의 조합으로 웃음을 유발합니다.
                분위기 메이커 역할을 하고 싶을 때 추천합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">게임용 닉네임</h3>
              <p className="text-gray-600 text-sm mt-1">
                영어 접두사와 접미사, 숫자를 조합한 글로벌 스타일 닉네임입니다.
                FPS, MMORPG 등 게임에서 국제적으로 사용할 수 있는 닉네임을 원할 때 추천합니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">생성된 닉네임을 바로 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 생성된 닉네임은 자유롭게 사용할 수 있습니다. 단, 플랫폼에 따라 이미 사용 중인 닉네임일 수 있으므로 확인이 필요합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">닉네임이 중복되면 어떻게 하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                &quot;다시 생성하기&quot; 버튼으로 새로운 닉네임을 받거나, 생성된 닉네임에 숫자나 특수문자를 추가하여 고유한 닉네임을 만들 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="nickname-generator" />
    </div>
  );
}
