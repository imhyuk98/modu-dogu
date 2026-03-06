"use client";

import { useState, useCallback, useMemo, useEffect } from "react";

/* ── Joke Data ── */
interface Joke {
  q: string;
  a: string;
  category: Category;
}

type Category = "animal" | "food" | "daily" | "classic" | "wordplay";

const CATEGORY_INFO: Record<Category, { label: string; emoji: string }> = {
  animal: { label: "동물", emoji: "\uD83D\uDC3E" },
  food: { label: "음식", emoji: "\uD83C\uDF54" },
  daily: { label: "일상", emoji: "\uD83D\uDCF1" },
  classic: { label: "클래식", emoji: "\uD83D\uDC74" },
  wordplay: { label: "말장난", emoji: "\uD83D\uDD24" },
};

const ALL_JOKES: Joke[] = [
  // 동물 (Animals) - 20
  { q: "소가 웃으면?", a: "우하하", category: "animal" },
  { q: "사자가 귀찮을 때 하는 말은?", a: "쉬자", category: "animal" },
  { q: "오리가 얼면?", a: "꽥꽥이 아이스크림", category: "animal" },
  { q: "소가 길을 잃으면?", a: "미~치겠네", category: "animal" },
  { q: "곰이 아프면 어디로 갈까?", a: "곰을 가야지", category: "animal" },
  { q: "고양이가 수학을 못하는 이유는?", a: "'야옹'하는 게 익숙해서", category: "animal" },
  { q: "양이 다리가 부러지면?", a: "양다리 걸치다", category: "animal" },
  { q: "돼지가 결혼하면?", a: "돼지롱", category: "animal" },
  { q: "기린이 목이 아프면?", a: "목욕해야지", category: "animal" },
  { q: "고슴도치가 좋아하는 날은?", a: "빼빼로 데이", category: "animal" },
  { q: "사자가 공부를 못하는 이유는?", a: "늘 자서", category: "animal" },
  { q: "오리가 추울 때 하는 말은?", a: "꽥꽥 옷 좀 줘", category: "animal" },
  { q: "곰이 컴퓨터를 못 쓰는 이유는?", a: "곰손이라서", category: "animal" },
  { q: "소가 학교를 졸업하면?", a: "우등생", category: "animal" },
  { q: "돼지가 운동을 하면?", a: "헬돼지", category: "animal" },
  { q: "젖소가 뛰어가면?", a: "우당탕탕", category: "animal" },
  { q: "닭이 놀란 이유는?", a: "계란이 깨졌기 때문", category: "animal" },
  { q: "소가 돈을 벌기 싫어하는 이유는?", a: "부우자 되고 싶지 않아서", category: "animal" },
  { q: "개미가 가게를 차리면?", a: "개미상회", category: "animal" },
  { q: "바다에서 가장 친절한 물고기는?", a: "상냥이(상어)", category: "animal" },

  // 음식 (Food) - 20
  { q: "아이스크림이 차에 치이면?", a: "차가워서", category: "food" },
  { q: "포도가 자기소개하면?", a: "포도당이야", category: "food" },
  { q: "세종대왕이 만든 우유는?", a: "아야어여오요우유", category: "food" },
  { q: "빵이 좋아하는 운동은?", a: "빵빵 터지기", category: "food" },
  { q: "피자가 웃으면?", a: "피자치!", category: "food" },
  { q: "김이 빠진 콜라는 무슨 맛?", a: "김맛", category: "food" },
  { q: "수박이 도둑을 잡으면?", a: "수박이다!", category: "food" },
  { q: "참치가 좋아하는 집은?", a: "참치집", category: "food" },
  { q: "우유가 기분 좋을 때?", a: "너무 고소해!", category: "food" },
  { q: "도넛이 좋아하는 날씨는?", a: "구멍난 구름이 있는 날", category: "food" },
  { q: "바나나가 물에 빠지면?", a: "수영바나나", category: "food" },
  { q: "핫도그가 좋아하는 계절은?", a: "여름 (핫하니까)", category: "food" },
  { q: "치킨이 싫어하는 날씨는?", a: "비 오는 날 (눅눅해지니까)", category: "food" },
  { q: "소금이 화났을 때 하는 말은?", a: "간을 맞춰야지!", category: "food" },
  { q: "초콜릿이 달아날 때?", a: "나 초코!", category: "food" },
  { q: "라면이 가장 싫어하는 것은?", a: "불어터지는 것", category: "food" },
  { q: "딸기가 직업을 구할 때 가는 곳은?", a: "딸기 직업정보센터", category: "food" },
  { q: "밥이 다 되었을 때?", a: "밥이 됐다!", category: "food" },
  { q: "감자가 튀면?", a: "감자튀김", category: "food" },
  { q: "떡볶이가 안 매우면?", a: "떡볶이가 아니라 떡볶이", category: "food" },

  // 일상 (Daily) - 20
  { q: "컴퓨터가 화났을 때 하는 말은?", a: "씨~피유!", category: "daily" },
  { q: "도둑이 훔친 커피는?", a: "카페라떼", category: "daily" },
  { q: "자동차가 아플 때 병원은?", a: "카센터", category: "daily" },
  { q: "유리가 깨졌을 때 하는 말은?", a: "유리한 상황이 아니야", category: "daily" },
  { q: "신발이 슬플 때?", a: "힐 힐 슬퍼지네", category: "daily" },
  { q: "시계가 갑자기 멈추면?", a: "시간이 멈췄다!", category: "daily" },
  { q: "전구가 제일 싫어하는 사람은?", a: "끈적한 사람", category: "daily" },
  { q: "책이 가장 싫어하는 것은?", a: "찢어지는 일", category: "daily" },
  { q: "문이 가장 싫어하는 것은?", a: "쾅 닫히는 것", category: "daily" },
  { q: "컴퓨터가 좋아하는 과일은?", a: "사과 (애플)", category: "daily" },
  { q: "연필이 감기에 걸리면?", a: "흐릿한 연필", category: "daily" },
  { q: "택시가 기분 나쁠 때?", a: "내가 차야?", category: "daily" },
  { q: "치과에 간 시계?", a: "시간이 좀 남네요", category: "daily" },
  { q: "새가 다니는 학교는?", a: "비행학교", category: "daily" },
  { q: "엘리베이터가 높은 곳에 가면?", a: "층층이 올라가~", category: "daily" },
  { q: "팽이가 좋아하는 노래는?", a: "돌고 돌고 도는 팽이!", category: "daily" },
  { q: "피아노가 화났을 때?", a: "건반이 꼬여서 그래!", category: "daily" },
  { q: "산에 사는 귀신이 하는 말은?", a: "산 사람이로다!", category: "daily" },
  { q: "농구 선수가 좋아하는 고기는?", a: "덩크 통닭!", category: "daily" },
  { q: "기차가 여행을 떠날 때?", a: "기차다!", category: "daily" },

  // 클래식 (Classic) - 20
  { q: "세상에서 가장 지루한 중학교는?", a: "하품중학교", category: "classic" },
  { q: "세상에서 가장 더러운 강은?", a: "요강", category: "classic" },
  { q: "가장 비싼 새는?", a: "황금새 (2조)", category: "classic" },
  { q: "왕이 넘어지면?", a: "킹콩", category: "classic" },
  { q: "네 개의 칼은?", a: "포크", category: "classic" },
  { q: "귀가 4개인 개는?", a: "포크", category: "classic" },
  { q: "바늘의 여자친구는?", a: "대바늘", category: "classic" },
  { q: "가장 맛없는 과일은?", a: "천도복숭아 (천원도 아까운)", category: "classic" },
  { q: "세상에서 가장 빠른 닭은?", a: "후다닭", category: "classic" },
  { q: "커피를 마시면 안 되는 사람은?", a: "유태인 (유tea인)", category: "classic" },
  { q: "건물 사이를 뛰어다니면?", a: "빌딩 점프", category: "classic" },
  { q: "가장 추운 바다는?", a: "썰렁해", category: "classic" },
  { q: "아몬드가 죽으면?", a: "다이아몬드", category: "classic" },
  { q: "눈이 녹으면 뭐가 될까?", a: "눈물", category: "classic" },
  { q: "가장 게으른 왕은?", a: "누워왕", category: "classic" },
  { q: "소금의 유통기한은?", a: "천일(천일염)", category: "classic" },
  { q: "반성문을 영어로?", a: "글로벌", category: "classic" },
  { q: "도둑이 가장 싫어하는 아이스크림은?", a: "누가바", category: "classic" },
  { q: "세상에서 가장 억울한 선수는?", a: "축구 골키퍼 (맨날 골 먹어서)", category: "classic" },
  { q: "공이 아플 때?", a: "아이고 (아이 + 공)", category: "classic" },

  // 말장난 (Wordplay) - 20
  { q: "돈을 가장 아끼는 귀신은?", a: "짠귀신", category: "wordplay" },
  { q: "하늘에서 내리는 소는?", a: "우박", category: "wordplay" },
  { q: "시골에서 온 곡식은?", a: "촌스러운 쌀", category: "wordplay" },
  { q: "감이 장난치면?", a: "감짝이야!", category: "wordplay" },
  { q: "모기에게 가장 무서운 것은?", a: "모기장", category: "wordplay" },
  { q: "바다에서 가장 짠 선수는?", a: "소금 선수", category: "wordplay" },
  { q: "전기가 좋아하는 음식은?", a: "전기밥솥", category: "wordplay" },
  { q: "고구마가 죽으면?", a: "구마! 구마!", category: "wordplay" },
  { q: "가장 쓸쓸한 도시는?", a: "인도(인도어...)", category: "wordplay" },
  { q: "소나기가 좋아하는 노래는?", a: "비와 당신의 이야기", category: "wordplay" },
  { q: "가장 빠른 인사는?", a: "급인사", category: "wordplay" },
  { q: "물고기가 되고 싶은 동물은?", a: "물소", category: "wordplay" },
  { q: "세상에서 제일 뜨거운 과일은?", a: "천도복숭아 (천도=1000도)", category: "wordplay" },
  { q: "지구가 기분이 좋을 때?", a: "지구해~", category: "wordplay" },
  { q: "감기에 걸린 바이올린?", a: "음이 떨어졌어", category: "wordplay" },
  { q: "포도가 좋아하는 영화는?", a: "포도 리미테이션", category: "wordplay" },
  { q: "소금이 좋아하는 영화는?", a: "짠한 드라마", category: "wordplay" },
  { q: "시간을 가장 아끼는 사람은?", a: "시계방 주인", category: "wordplay" },
  { q: "소나무가 좋아하는 음식은?", a: "소나무 잎사귀", category: "wordplay" },
  { q: "사슴이 넘어지면?", a: "엘크(앨크)", category: "wordplay" },
];

/* ── Fisher-Yates Shuffle ── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ── Main Component ── */
export default function DadJokePage() {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [shuffledJokes, setShuffledJokes] = useState<Joke[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [funnyCount, setFunnyCount] = useState(0);
  const [boringCount, setBoringCount] = useState(0);
  const [rated, setRated] = useState(false);
  const [bounceAnswer, setBounceAnswer] = useState(false);
  const [slideIn, setSlideIn] = useState(true);

  // Filter and shuffle jokes when category changes
  const filteredBase = useMemo(
    () =>
      activeCategory === "all"
        ? ALL_JOKES
        : ALL_JOKES.filter((j) => j.category === activeCategory),
    [activeCategory]
  );

  useEffect(() => {
    setShuffledJokes(shuffle(filteredBase));
    setCurrentIndex(0);
    setRevealed(false);
    setRated(false);
    setSlideIn(true);
  }, [filteredBase]);

  const totalJokes = shuffledJokes.length;
  const currentJoke = shuffledJokes[currentIndex] || null;

  const handleReveal = useCallback(() => {
    setRevealed(true);
    setBounceAnswer(true);
    setTimeout(() => setBounceAnswer(false), 600);
  }, []);

  const handleNext = useCallback(() => {
    setSlideIn(false);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= totalJokes) {
          // Reshuffle when all jokes shown
          setShuffledJokes(shuffle(filteredBase));
          return 0;
        }
        return prev + 1;
      });
      setRevealed(false);
      setRated(false);
      setSlideIn(true);
    }, 200);
  }, [totalJokes, filteredBase]);

  const handleRate = useCallback(
    (type: "funny" | "boring") => {
      if (rated) return;
      setRated(true);
      if (type === "funny") setFunnyCount((c) => c + 1);
      else setBoringCount((c) => c + 1);
    },
    [rated]
  );

  const categories: { key: Category | "all"; label: string; emoji?: string }[] = [
    { key: "all", label: "전체" },
    ...Object.entries(CATEGORY_INFO).map(([key, val]) => ({
      key: key as Category,
      label: val.label,
      emoji: val.emoji,
    })),
  ];

  if (!currentJoke) return null;

  const catInfo = CATEGORY_INFO[currentJoke.category];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            <span className="mr-2">\uD83E\uDD23</span>아재개그 생성기
          </h1>
          <p className="text-purple-200 text-sm sm:text-base">
            버튼을 눌러 정답을 확인하세요! 총 {ALL_JOKES.length}개의 아재개그
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6 justify-center flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat.key
                  ? "bg-white text-purple-900 shadow-lg shadow-white/20 scale-105"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Progress & Stats */}
        <div className="flex justify-between items-center mb-4 px-1">
          <span className="text-white/60 text-sm font-mono">
            {currentIndex + 1}/{totalJokes}
          </span>
          <div className="flex gap-3 text-sm">
            <span className="text-white/60">
              \uD83D\uDE02 {funnyCount}
            </span>
            <span className="text-white/60">
              \uD83D\uDE11 {boringCount}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-6">
          <div
            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / totalJokes) * 100}%` }}
          />
        </div>

        {/* Joke Card */}
        <div
          className={`bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 p-6 sm:p-8 mb-6 transition-all duration-200 ${
            slideIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Category Badge */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium">
              <span>{catInfo.emoji}</span>
              {catInfo.label}
            </span>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">\u2753</div>
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentJoke.q}
            </p>
          </div>

          {/* Answer Area */}
          {!revealed ? (
            <div className="flex justify-center">
              <button
                onClick={handleReveal}
                className="group relative px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold text-lg rounded-2xl shadow-lg shadow-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span className="relative z-10">\uD83D\uDC47 정답 보기</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Answer */}
              <div
                className={`text-center ${
                  bounceAnswer ? "animate-bounce" : ""
                }`}
              >
                <div className="text-3xl mb-3">\uD83D\uDCA1</div>
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border border-yellow-400/30 rounded-2xl px-6 py-5">
                  <p className="text-2xl sm:text-3xl font-extrabold text-yellow-300">
                    {currentJoke.a}
                  </p>
                </div>
              </div>

              {/* Rating Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleRate("funny")}
                  disabled={rated}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    rated
                      ? "opacity-50 cursor-not-allowed bg-white/5 text-white/40"
                      : "bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 hover:scale-105 active:scale-95"
                  }`}
                >
                  <span className="text-xl">\uD83D\uDE02</span>
                  <span>웃김</span>
                </button>
                <button
                  onClick={() => handleRate("boring")}
                  disabled={rated}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    rated
                      ? "opacity-50 cursor-not-allowed bg-white/5 text-white/40"
                      : "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 hover:scale-105 active:scale-95"
                  }`}
                >
                  <span className="text-xl">\uD83D\uDE11</span>
                  <span>노잼</span>
                </button>
              </div>

              {/* Next Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-lg rounded-2xl border border-white/20 hover:border-white/40 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  다음 개그 \u27A1\uFE0F
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{currentIndex + 1}</div>
              <div className="text-xs text-white/50">본 개그</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{funnyCount}</div>
              <div className="text-xs text-white/50">웃김</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{boringCount}</div>
              <div className="text-xs text-white/50">노잼</div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 space-y-6 text-gray-700">
          <h2 className="text-xl font-bold text-gray-900">
            아재개그 생성기란?
          </h2>
          <p className="leading-relaxed">
            아재개그 생성기는 동물, 음식, 일상, 클래식, 말장난 등 다양한 카테고리의
            아재개그(아빠 개그)를 모아놓은 재미있는 도구입니다. 총 {ALL_JOKES.length}
            개의 엄선된 아재개그를 랜덤 순서로 즐길 수 있으며, 반복 없이 모든 개그를
            다 본 후 다시 섞여서 제공됩니다.
          </p>

          <h3 className="text-lg font-bold text-gray-900">카테고리 소개</h3>
          <ul className="space-y-2">
            {Object.entries(CATEGORY_INFO).map(([key, val]) => {
              const count = ALL_JOKES.filter((j) => j.category === key).length;
              return (
                <li key={key} className="flex items-center gap-2">
                  <span>{val.emoji}</span>
                  <span className="font-semibold">{val.label}</span>
                  <span className="text-gray-500">- {count}개의 개그</span>
                </li>
              );
            })}
          </ul>

          <h3 className="text-lg font-bold text-gray-900">이런 분들에게 추천합니다</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            <li>분위기를 띄우고 싶은 회식 자리</li>
            <li>친구들과 함께 웃고 싶을 때</li>
            <li>아이들에게 재미있는 퀴즈를 내주고 싶을 때</li>
            <li>심심할 때 가벼운 재미가 필요할 때</li>
            <li>아재력을 높이고 싶은 분</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900">사용 방법</h3>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            <li>원하는 카테고리를 선택하세요 (전체, 동물, 음식, 일상, 클래식, 말장난)</li>
            <li>질문을 읽고 잠시 생각해보세요</li>
            <li>&quot;정답 보기&quot; 버튼을 눌러 답을 확인하세요</li>
            <li>웃김/노잼 버튼으로 평가하세요</li>
            <li>&quot;다음 개그&quot; 버튼으로 계속 즐기세요</li>
          </ol>
        </section>
      </div>
    </div>
  );
}
