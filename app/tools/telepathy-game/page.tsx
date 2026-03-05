"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ───────── Topics Database ───────── */
interface Topic {
  category: string;
  question: string;
}

const TOPICS: Topic[] = [
  // 음식 (12)
  { category: "음식", question: "치킨 브랜드 하면?" },
  { category: "음식", question: "라면 종류 하면?" },
  { category: "음식", question: "과일 하면?" },
  { category: "음식", question: "분식 메뉴 하면?" },
  { category: "음식", question: "한식 반찬 하면?" },
  { category: "음식", question: "야식 메뉴 하면?" },
  { category: "음식", question: "디저트 하면?" },
  { category: "음식", question: "아이스크림 브랜드 하면?" },
  { category: "음식", question: "음료수 하면?" },
  { category: "음식", question: "배달 음식 하면?" },
  { category: "음식", question: "길거리 음식 하면?" },
  { category: "음식", question: "밥반찬 하면?" },

  // 연예인 (10)
  { category: "연예인", question: "남자 아이돌 그룹 하면?" },
  { category: "연예인", question: "여자 배우 하면?" },
  { category: "연예인", question: "예능인 하면?" },
  { category: "연예인", question: "남자 배우 하면?" },
  { category: "연예인", question: "여자 아이돌 그룹 하면?" },
  { category: "연예인", question: "K-POP 솔로 가수 하면?" },
  { category: "연예인", question: "래퍼 하면?" },
  { category: "연예인", question: "유튜버 하면?" },
  { category: "연예인", question: "MC 하면?" },
  { category: "연예인", question: "개그맨 하면?" },

  // 장소 (10)
  { category: "장소", question: "여행지 하면?" },
  { category: "장소", question: "데이트 장소 하면?" },
  { category: "장소", question: "놀이공원 하면?" },
  { category: "장소", question: "해외 여행지 하면?" },
  { category: "장소", question: "서울 명소 하면?" },
  { category: "장소", question: "캠핑 장소 하면?" },
  { category: "장소", question: "대학교 하면?" },
  { category: "장소", question: "힐링 장소 하면?" },
  { category: "장소", question: "맛집 동네 하면?" },
  { category: "장소", question: "바다 하면?" },

  // 브랜드 (10)
  { category: "브랜드", question: "커피 브랜드 하면?" },
  { category: "브랜드", question: "편의점 하면?" },
  { category: "브랜드", question: "패스트푸드 하면?" },
  { category: "브랜드", question: "스포츠 브랜드 하면?" },
  { category: "브랜드", question: "자동차 브랜드 하면?" },
  { category: "브랜드", question: "스마트폰 브랜드 하면?" },
  { category: "브랜드", question: "의류 브랜드 하면?" },
  { category: "브랜드", question: "SNS 하면?" },
  { category: "브랜드", question: "게임 하면?" },
  { category: "브랜드", question: "OTT 서비스 하면?" },

  // 생활 (10)
  { category: "생활", question: "색깔 하면?" },
  { category: "생활", question: "계절 하면?" },
  { category: "생활", question: "요일 하면?" },
  { category: "생활", question: "숫자(1~10) 하면?" },
  { category: "생활", question: "운동 하면?" },
  { category: "생활", question: "취미 하면?" },
  { category: "생활", question: "동물 하면?" },
  { category: "생활", question: "꽃 하면?" },
  { category: "생활", question: "악기 하면?" },
  { category: "생활", question: "과목 하면?" },

  // 추상 (10)
  { category: "추상", question: "행복 하면?" },
  { category: "추상", question: "성공 하면?" },
  { category: "추상", question: "스트레스 해소법 하면?" },
  { category: "추상", question: "사랑 하면?" },
  { category: "추상", question: "우정 하면?" },
  { category: "추상", question: "인생 하면?" },
  { category: "추상", question: "자유 하면?" },
  { category: "추상", question: "감동 하면?" },
  { category: "추상", question: "추억 하면?" },
  { category: "추상", question: "도전 하면?" },
];

const CATEGORY_COLORS: Record<string, string> = {
  음식: "from-orange-400 to-red-500",
  연예인: "from-pink-400 to-purple-500",
  장소: "from-green-400 to-teal-500",
  브랜드: "from-blue-400 to-indigo-500",
  생활: "from-yellow-400 to-orange-500",
  추상: "from-purple-400 to-pink-500",
  커스텀: "from-gray-400 to-gray-600",
};

const CATEGORY_EMOJIS: Record<string, string> = {
  음식: "🍽️",
  연예인: "⭐",
  장소: "📍",
  브랜드: "🏷️",
  생활: "🌈",
  추상: "💭",
  커스텀: "✏️",
};

type Phase = "setup" | "input" | "reveal" | "result";

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "");
}

export default function TelepathyGamePage() {
  // Setup
  const [player1Name, setPlayer1Name] = useState("플레이어 1");
  const [player2Name, setPlayer2Name] = useState("플레이어 2");

  // Custom topics
  const [customTopics, setCustomTopics] = useState<Topic[]>([]);
  const [newCustomTopic, setNewCustomTopic] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);

  // Game state
  const [phase, setPhase] = useState<Phase>("setup");
  const [currentTopic, setCurrentTopic] = useState<Topic | null>(null);
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [flipAnim, setFlipAnim] = useState(false);

  // Score
  const [round, setRound] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // Match result
  const [matchResult, setMatchResult] = useState<
    "exact" | "partial" | "none" | null
  >(null);

  const allTopics = [...TOPICS, ...customTopics];

  const addCustomTopic = useCallback(() => {
    const trimmed = newCustomTopic.trim();
    if (!trimmed) return;
    const question = trimmed.endsWith("?") ? trimmed : trimmed + " 하면?";
    setCustomTopics((prev) => [...prev, { category: "커스텀", question }]);
    setNewCustomTopic("");
  }, [newCustomTopic]);

  const startGame = useCallback(() => {
    if (!player1Name.trim() || !player2Name.trim()) return;
    setRound(0);
    setSuccesses(0);
    setAttempts(0);
    nextRound(true);
  }, [player1Name, player2Name, allTopics]);

  const nextRound = useCallback(
    (isFirst = false) => {
      const topic = pickRandom(allTopics);
      setCurrentTopic(topic);
      setAnswer1("");
      setAnswer2("");
      setShow1(false);
      setShow2(false);
      setRevealed(false);
      setFlipAnim(false);
      setMatchResult(null);
      if (!isFirst) {
        setRound((r) => r + 1);
      } else {
        setRound(1);
      }
      setPhase("input");
    },
    [allTopics]
  );

  const doReveal = useCallback(() => {
    if (!answer1.trim() || !answer2.trim()) return;
    setFlipAnim(true);

    setTimeout(() => {
      setRevealed(true);
      setPhase("result");
      setAttempts((a) => a + 1);

      const n1 = normalize(answer1);
      const n2 = normalize(answer2);

      if (n1 === n2) {
        setMatchResult("exact");
        setSuccesses((s) => s + 1);
      } else if (n1.includes(n2) || n2.includes(n1)) {
        setMatchResult("partial");
      } else {
        setMatchResult("none");
      }
    }, 800);
  }, [answer1, answer2]);

  const resetGame = () => {
    setPhase("setup");
    setCurrentTopic(null);
    setAnswer1("");
    setAnswer2("");
    setRevealed(false);
    setFlipAnim(false);
    setMatchResult(null);
  };

  const successRate =
    attempts > 0 ? Math.round((successes / attempts) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          텔레파시 게임
        </h1>
        <p className="text-gray-500 mt-2">
          같은 주제, 같은 생각! 마음이 통하는지 확인하세요
        </p>
      </div>

      {/* ───── SETUP PHASE ───── */}
      {phase === "setup" && (
        <div className="space-y-6">
          {/* Player Names */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              플레이어 설정
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  플레이어 1
                </label>
                <input
                  type="text"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  placeholder="이름 입력"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  플레이어 2
                </label>
                <input
                  type="text"
                  value={player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
                  placeholder="이름 입력"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Custom Topics */}
          <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                커스텀 주제
              </h2>
              <button
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                {showCustomForm ? "닫기" : "+ 추가하기"}
              </button>
            </div>
            {showCustomForm && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomTopic}
                  onChange={(e) => setNewCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTopic()}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                  placeholder="예: 좋아하는 노래"
                  maxLength={30}
                />
                <button
                  onClick={addCustomTopic}
                  className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
                >
                  추가
                </button>
              </div>
            )}
            {customTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customTopics.map((t, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full"
                  >
                    {t.question}
                    <button
                      onClick={() =>
                        setCustomTopics((prev) =>
                          prev.filter((_, idx) => idx !== i)
                        )
                      }
                      className="ml-1 text-purple-400 hover:text-purple-700"
                    >
                      x
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400">
              기본 {TOPICS.length}개 주제 + 커스텀 {customTopics.length}개 = 총{" "}
              {allTopics.length}개 주제
            </p>
          </div>

          {/* Start */}
          <button
            onClick={startGame}
            disabled={!player1Name.trim() || !player2Name.trim()}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl text-lg font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            게임 시작!
          </button>
        </div>
      )}

      {/* ───── INPUT PHASE ───── */}
      {(phase === "input" || phase === "result") && currentTopic && (
        <div className="space-y-6">
          {/* Score Bar */}
          <div className="bg-white rounded-2xl shadow-md p-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-gray-700">
                라운드 {round}
              </span>
              <div className="flex gap-4 text-gray-500">
                <span>
                  성공{" "}
                  <span className="font-bold text-green-600">{successes}</span>
                </span>
                <span>
                  시도{" "}
                  <span className="font-bold text-gray-700">{attempts}</span>
                </span>
                <span>
                  성공률{" "}
                  <span className="font-bold text-purple-600">
                    {successRate}%
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Topic Card */}
          <div
            className={`bg-gradient-to-br ${
              CATEGORY_COLORS[currentTopic.category] ||
              "from-gray-400 to-gray-600"
            } rounded-2xl p-6 text-white text-center shadow-lg`}
          >
            <div className="text-sm font-medium opacity-80 mb-1">
              {CATEGORY_EMOJIS[currentTopic.category] || "📌"}{" "}
              {currentTopic.category}
            </div>
            <div className="text-2xl font-bold">{currentTopic.question}</div>
          </div>

          {/* Answer Cards */}
          {phase === "input" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Player 1 */}
                <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
                  <div className="text-center">
                    <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {player1Name}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={show1 ? "text" : "password"}
                      value={answer1}
                      onChange={(e) => setAnswer1(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none"
                      placeholder="답을 입력하세요"
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && answer1 && answer2) doReveal();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow1(!show1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-2 py-1"
                    >
                      {show1 ? "숨기기" : "보기"}
                    </button>
                  </div>
                </div>

                {/* Player 2 */}
                <div className="bg-white rounded-2xl shadow-md p-5 space-y-3">
                  <div className="text-center">
                    <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {player2Name}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={show2 ? "text" : "password"}
                      value={answer2}
                      onChange={(e) => setAnswer2(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-3 text-center text-sm focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none"
                      placeholder="답을 입력하세요"
                      maxLength={20}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && answer1 && answer2) doReveal();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShow2(!show2)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs px-2 py-1"
                    >
                      {show2 ? "숨기기" : "보기"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reveal Button */}
              <button
                onClick={doReveal}
                disabled={!answer1.trim() || !answer2.trim()}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl text-lg font-bold hover:from-amber-500 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                공개!
              </button>
            </>
          )}

          {/* ───── RESULT PHASE ───── */}
          {phase === "result" && (
            <div className="space-y-6">
              {/* Flip Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`rounded-2xl shadow-lg p-5 text-center transition-all duration-700 ${
                    flipAnim ? "animate-flip" : ""
                  } ${
                    revealed
                      ? matchResult === "exact"
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400"
                        : matchResult === "partial"
                        ? "bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-400"
                        : "bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-300"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    {player1Name}
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      revealed ? "text-gray-900" : "text-gray-300"
                    }`}
                  >
                    {revealed ? answer1 : "???"}
                  </div>
                </div>
                <div
                  className={`rounded-2xl shadow-lg p-5 text-center transition-all duration-700 ${
                    flipAnim ? "animate-flip" : ""
                  } ${
                    revealed
                      ? matchResult === "exact"
                        ? "bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-400"
                        : matchResult === "partial"
                        ? "bg-gradient-to-br from-yellow-100 to-amber-100 border-2 border-yellow-400"
                        : "bg-gradient-to-br from-red-100 to-rose-100 border-2 border-red-300"
                      : "bg-gray-100"
                  }`}
                  style={{ animationDelay: "0.15s" }}
                >
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    {player2Name}
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      revealed ? "text-gray-900" : "text-gray-300"
                    }`}
                  >
                    {revealed ? answer2 : "???"}
                  </div>
                </div>
              </div>

              {/* Result Message */}
              {revealed && matchResult && (
                <div
                  className={`text-center py-6 rounded-2xl shadow-md ${
                    matchResult === "exact"
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                      : matchResult === "partial"
                      ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {matchResult === "exact"
                      ? "🎉"
                      : matchResult === "partial"
                      ? "🤔"
                      : "🍺"}
                  </div>
                  <div className="text-xl font-bold">
                    {matchResult === "exact"
                      ? "텔레파시 성공!"
                      : matchResult === "partial"
                      ? "아깝다!"
                      : "실패..."}
                  </div>
                  <div className="text-sm mt-1 opacity-90">
                    {matchResult === "exact"
                      ? "마음이 통했어요! 건배~"
                      : matchResult === "partial"
                      ? "비슷했는데... 한 잔씩?"
                      : "둘 다 마셔! 🍻"}
                  </div>
                </div>
              )}

              {/* Actions */}
              {revealed && (
                <div className="flex gap-3">
                  <button
                    onClick={() => nextRound()}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
                  >
                    다음 라운드
                  </button>
                  <button
                    onClick={resetGame}
                    className="px-5 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    처음으로
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ───── Flip Animation Style ───── */}
      <style jsx>{`
        @keyframes flip {
          0% {
            transform: perspective(600px) rotateY(0deg);
          }
          50% {
            transform: perspective(600px) rotateY(90deg);
          }
          100% {
            transform: perspective(600px) rotateY(0deg);
          }
        }
        .animate-flip {
          animation: flip 0.8s ease-in-out;
        }
      `}</style>

      {/* ───── How To Play ───── */}
      <div className="mt-10 bg-white rounded-2xl shadow-md p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          게임 방법
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>두 플레이어의 이름을 입력합니다.</li>
          <li>게임을 시작하면 랜덤 주제가 표시됩니다.</li>
          <li>
            각자 상대방에게 안 보이게 답을 입력합니다 (비밀번호 형식으로
            가려져요).
          </li>
          <li>&quot;공개!&quot; 버튼을 누르면 두 답이 동시에 공개됩니다.</li>
          <li>
            <span className="text-green-600 font-medium">정확히 일치</span> =
            텔레파시 성공!{" "}
            <span className="text-red-500 font-medium">불일치</span> = 둘 다
            마셔!
          </li>
        </ol>
        <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-700">
          <strong>팁:</strong> 직접 주제를 추가해서 더 재미있게 즐겨보세요!
          &quot;우리 반에서 제일 ○○한 사람&quot; 같은 주제도 재미있어요.
        </div>
      </div>

      {/* ───── SEO Section ───── */}
      <section className="mt-10 prose prose-sm max-w-none text-gray-500">
        <h2 className="text-lg font-semibold text-gray-700">
          텔레파시 게임이란?
        </h2>
        <p>
          텔레파시 게임은 두 사람이 같은 주제에 대해 각자 답을 적고, 답이
          일치하는지 확인하는 술자리 및 파티 게임입니다. &quot;○○ 하면?&quot;이라는
          주제가 주어지면 두 사람이 동시에 떠오르는 단어를 적습니다. 답이
          같으면 텔레파시 성공! 다르면 벌칙(음주)을 수행합니다.
        </p>
        <p>
          커플, 친구, 가족 모임에서 서로 얼마나 마음이 통하는지 재미있게
          확인할 수 있습니다. 음식, 연예인, 장소, 브랜드, 생활, 추상 등
          다양한 카테고리의 62개 이상 기본 주제를 제공하며, 직접 주제를
          추가할 수도 있습니다.
        </p>
        <h3 className="text-base font-semibold text-gray-700">추천 상황</h3>
        <ul className="text-gray-500">
          <li>술자리에서 분위기를 띄우고 싶을 때</li>
          <li>커플끼리 서로 얼마나 잘 아는지 테스트할 때</li>
          <li>친구들과 파티에서 즐길 게임이 필요할 때</li>
          <li>MT나 워크샵에서 아이스브레이킹 용도로</li>
        </ul>
      </section>

      <RelatedTools current="telepathy-game" />
    </div>
  );
}
