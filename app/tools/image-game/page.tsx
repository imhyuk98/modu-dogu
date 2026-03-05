"use client";

import { useState, useCallback, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Category = "전체" | "재미" | "연애" | "성격" | "술자리" | "19금";

interface Question {
  text: string;
  category: Exclude<Category, "전체">;
  emoji: string;
}

const QUESTIONS: Question[] = [
  // 재미 (funny) - 20+
  { text: "가장 무인도에서 오래 살아남을 것 같은 사람은?", category: "재미", emoji: "🏝️" },
  { text: "가장 좀비 아포칼립스에서 먼저 죽을 것 같은 사람은?", category: "재미", emoji: "🧟" },
  { text: "가장 외계인을 만나면 친구가 될 것 같은 사람은?", category: "재미", emoji: "👽" },
  { text: "가장 유튜버가 되면 성공할 것 같은 사람은?", category: "재미", emoji: "📹" },
  { text: "가장 100만원 받으면 하루 만에 다 쓸 것 같은 사람은?", category: "재미", emoji: "💸" },
  { text: "가장 아이돌 오디션에 나갈 것 같은 사람은?", category: "재미", emoji: "🎤" },
  { text: "가장 먹방 유튜버로 성공할 것 같은 사람은?", category: "재미", emoji: "🍽️" },
  { text: "가장 연예인이 되면 잘 어울릴 것 같은 사람은?", category: "재미", emoji: "⭐" },
  { text: "가장 집에서 혼자 춤출 것 같은 사람은?", category: "재미", emoji: "💃" },
  { text: "가장 무서운 영화 보면서 울 것 같은 사람은?", category: "재미", emoji: "😱" },
  { text: "가장 하루 종일 잠만 잘 것 같은 사람은?", category: "재미", emoji: "😴" },
  { text: "가장 갑자기 대머리가 되어도 잘 어울릴 것 같은 사람은?", category: "재미", emoji: "👨‍🦲" },
  { text: "가장 동물원에서 원숭이와 대화할 것 같은 사람은?", category: "재미", emoji: "🐒" },
  { text: "가장 무한도전에 출연하면 잘 할 것 같은 사람은?", category: "재미", emoji: "📺" },
  { text: "가장 귀신을 만나면 도망가지 않을 것 같은 사람은?", category: "재미", emoji: "👻" },
  { text: "가장 로또에 당첨될 것 같은 사람은?", category: "재미", emoji: "🎰" },
  { text: "가장 타임머신이 있으면 과거로 갈 것 같은 사람은?", category: "재미", emoji: "⏰" },
  { text: "가장 대통령이 되면 첫 번째로 뭔가 웃긴 법을 만들 것 같은 사람은?", category: "재미", emoji: "🏛️" },
  { text: "가장 혼자 여행 가면 길을 잃을 것 같은 사람은?", category: "재미", emoji: "🗺️" },
  { text: "가장 요리하면 집을 태울 것 같은 사람은?", category: "재미", emoji: "🔥" },
  { text: "가장 축구하면 자기 팀 골대에 넣을 것 같은 사람은?", category: "재미", emoji: "⚽" },

  // 연애 (love) - 20+
  { text: "가장 로맨틱한 고백을 할 것 같은 사람은?", category: "연애", emoji: "💕" },
  { text: "가장 결혼을 빨리 할 것 같은 사람은?", category: "연애", emoji: "💒" },
  { text: "가장 첫눈에 반할 것 같은 사람은?", category: "연애", emoji: "😍" },
  { text: "가장 이별 후 연락할 것 같은 사람은?", category: "연애", emoji: "📱" },
  { text: "가장 썸을 오래 탈 것 같은 사람은?", category: "연애", emoji: "💗" },
  { text: "가장 연애할 때 집착할 것 같은 사람은?", category: "연애", emoji: "🔒" },
  { text: "가장 이상형이 확고할 것 같은 사람은?", category: "연애", emoji: "📋" },
  { text: "가장 사귀면 기념일을 잘 챙길 것 같은 사람은?", category: "연애", emoji: "🎁" },
  { text: "가장 고백을 받으면 당황할 것 같은 사람은?", category: "연애", emoji: "😳" },
  { text: "가장 연애를 숨기고 다닐 것 같은 사람은?", category: "연애", emoji: "🤫" },
  { text: "가장 커플 아이템을 할 것 같은 사람은?", category: "연애", emoji: "👫" },
  { text: "가장 연인에게 편지를 쓸 것 같은 사람은?", category: "연애", emoji: "💌" },
  { text: "가장 장거리 연애를 잘 할 것 같은 사람은?", category: "연애", emoji: "✈️" },
  { text: "가장 소개팅에서 성공할 것 같은 사람은?", category: "연애", emoji: "🍷" },
  { text: "가장 플러팅을 잘 할 것 같은 사람은?", category: "연애", emoji: "😉" },
  { text: "가장 연인 앞에서 귀여운 척 할 것 같은 사람은?", category: "연애", emoji: "🥰" },
  { text: "가장 이별 후 노래방에서 슬픈 노래 부를 것 같은 사람은?", category: "연애", emoji: "🎵" },
  { text: "가장 전 연인과 다시 만날 것 같은 사람은?", category: "연애", emoji: "🔄" },
  { text: "가장 연애할 때 다정할 것 같은 사람은?", category: "연애", emoji: "🤗" },
  { text: "가장 결혼식에서 울 것 같은 사람은?", category: "연애", emoji: "😢" },

  // 성격 (personality) - 20+
  { text: "가장 비밀을 못 지킬 것 같은 사람은?", category: "성격", emoji: "🤭" },
  { text: "가장 성공할 것 같은 사람은?", category: "성격", emoji: "🏆" },
  { text: "가장 거짓말을 못 할 것 같은 사람은?", category: "성격", emoji: "😇" },
  { text: "가장 화나면 무서울 것 같은 사람은?", category: "성격", emoji: "😡" },
  { text: "가장 돈을 잘 모을 것 같은 사람은?", category: "성격", emoji: "🏦" },
  { text: "가장 잘 웃는 사람은?", category: "성격", emoji: "😂" },
  { text: "가장 눈치가 빠를 것 같은 사람은?", category: "성격", emoji: "👀" },
  { text: "가장 리더십이 있을 것 같은 사람은?", category: "성격", emoji: "👑" },
  { text: "가장 고집이 셀 것 같은 사람은?", category: "성격", emoji: "🪨" },
  { text: "가장 감성적일 것 같은 사람은?", category: "성격", emoji: "🌙" },
  { text: "가장 솔직할 것 같은 사람은?", category: "성격", emoji: "💬" },
  { text: "가장 부지런할 것 같은 사람은?", category: "성격", emoji: "⏰" },
  { text: "가장 게으를 것 같은 사람은?", category: "성격", emoji: "🦥" },
  { text: "가장 상대방 기분을 잘 맞출 것 같은 사람은?", category: "성격", emoji: "🎯" },
  { text: "가장 약속 시간에 늦을 것 같은 사람은?", category: "성격", emoji: "🕐" },
  { text: "가장 효도를 잘 할 것 같은 사람은?", category: "성격", emoji: "❤️" },
  { text: "가장 친구가 많을 것 같은 사람은?", category: "성격", emoji: "👥" },
  { text: "가장 다른 사람 험담을 안 할 것 같은 사람은?", category: "성격", emoji: "🤐" },
  { text: "가장 스트레스를 잘 풀 것 같은 사람은?", category: "성격", emoji: "🧘" },
  { text: "가장 사회생활을 잘 할 것 같은 사람은?", category: "성격", emoji: "💼" },

  // 술자리 (drinking) - 12+
  { text: "가장 술을 잘 마실 것 같은 사람은?", category: "술자리", emoji: "🍺" },
  { text: "가장 술버릇이 심할 것 같은 사람은?", category: "술자리", emoji: "🤪" },
  { text: "가장 먼저 취할 것 같은 사람은?", category: "술자리", emoji: "😵" },
  { text: "가장 술 마시고 전화할 것 같은 사람은?", category: "술자리", emoji: "📞" },
  { text: "가장 술 마시면 눈물이 많아질 것 같은 사람은?", category: "술자리", emoji: "😭" },
  { text: "가장 폭탄주를 잘 만들 것 같은 사람은?", category: "술자리", emoji: "💣" },
  { text: "가장 술자리에서 분위기 메이커일 것 같은 사람은?", category: "술자리", emoji: "🎉" },
  { text: "가장 술 마시고 필름 끊길 것 같은 사람은?", category: "술자리", emoji: "🎞️" },
  { text: "가장 술게임을 잘 할 것 같은 사람은?", category: "술자리", emoji: "🎲" },
  { text: "가장 2차 가자고 할 것 같은 사람은?", category: "술자리", emoji: "🌙" },
  { text: "가장 술 마시면 노래방 갈 것 같은 사람은?", category: "술자리", emoji: "🎤" },
  { text: "가장 다음 날 숙취가 심할 것 같은 사람은?", category: "술자리", emoji: "🤕" },
  { text: "가장 술 마시고 택시에서 잠들 것 같은 사람은?", category: "술자리", emoji: "🚕" },
  { text: "가장 술 마시면 사랑한다고 말할 것 같은 사람은?", category: "술자리", emoji: "💖" },
  { text: "가장 해장을 잘 할 것 같은 사람은?", category: "술자리", emoji: "🍜" },

  // 19금 (adult, mildly spicy) - 10+
  { text: "가장 스킨십을 좋아할 것 같은 사람은?", category: "19금", emoji: "🫦" },
  { text: "가장 은밀한 비밀이 많을 것 같은 사람은?", category: "19금", emoji: "🔞" },
  { text: "가장 속마음이 야할 것 같은 사람은?", category: "19금", emoji: "😏" },
  { text: "가장 이상한 곳에서 키스해봤을 것 같은 사람은?", category: "19금", emoji: "💋" },
  { text: "가장 19금 영화를 많이 봤을 것 같은 사람은?", category: "19금", emoji: "🎬" },
  { text: "가장 유혹에 약할 것 같은 사람은?", category: "19금", emoji: "😈" },
  { text: "가장 은밀한 SNS 계정이 있을 것 같은 사람은?", category: "19금", emoji: "📵" },
  { text: "가장 진한 스킨십을 좋아할 것 같은 사람은?", category: "19금", emoji: "🥵" },
  { text: "가장 이성 앞에서 다른 모습을 보일 것 같은 사람은?", category: "19금", emoji: "🎭" },
  { text: "가장 속옷에 신경 쓸 것 같은 사람은?", category: "19금", emoji: "👗" },
  { text: "가장 분위기에 약할 것 같은 사람은?", category: "19금", emoji: "🕯️" },
  { text: "가장 야한 꿈을 자주 꿀 것 같은 사람은?", category: "19금", emoji: "💭" },
];

const CATEGORIES: { label: Category; emoji: string; color: string }[] = [
  { label: "전체", emoji: "🎯", color: "bg-gray-600" },
  { label: "재미", emoji: "😆", color: "bg-yellow-500" },
  { label: "연애", emoji: "💕", color: "bg-pink-500" },
  { label: "성격", emoji: "🧠", color: "bg-blue-500" },
  { label: "술자리", emoji: "🍻", color: "bg-amber-600" },
  { label: "19금", emoji: "🔞", color: "bg-red-500" },
];

const CARD_COLORS = [
  "from-violet-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type GamePhase = "setup" | "question" | "vote" | "result";

export default function ImageGamePage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("전체");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [flipKey, setFlipKey] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Player & vote state
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [gamePhase, setGamePhase] = useState<GamePhase>("setup");
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [hasVoted, setHasVoted] = useState<Set<string>>(new Set());
  const [currentVoter, setCurrentVoter] = useState(0);

  const filteredQuestions = useMemo(() => {
    const base =
      selectedCategory === "전체"
        ? QUESTIONS
        : QUESTIONS.filter((q) => q.category === selectedCategory);
    return isShuffled ? shuffledQuestions.filter((q) => selectedCategory === "전체" || q.category === selectedCategory) : base;
  }, [selectedCategory, isShuffled, shuffledQuestions]);

  const currentQuestion = filteredQuestions[currentIndex] || null;
  const cardColor = CARD_COLORS[currentIndex % CARD_COLORS.length];

  const animateFlip = useCallback((callback: () => void) => {
    setIsFlipping(true);
    setTimeout(() => {
      callback();
      setFlipKey((k) => k + 1);
      setIsFlipping(false);
    }, 200);
  }, []);

  const handleNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      animateFlip(() => setCurrentIndex((i) => i + 1));
    }
    resetVotes();
  }, [currentIndex, filteredQuestions.length, animateFlip]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      animateFlip(() => setCurrentIndex((i) => i - 1));
    }
    resetVotes();
  }, [currentIndex, animateFlip]);

  const handleShuffle = useCallback(() => {
    const newShuffled = shuffleArray(QUESTIONS);
    setShuffledQuestions(newShuffled);
    setIsShuffled(true);
    setCurrentIndex(0);
    resetVotes();
    setFlipKey((k) => k + 1);
  }, []);

  const handleCategoryChange = useCallback((cat: Category) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
    resetVotes();
    setFlipKey((k) => k + 1);
  }, []);

  // Player management
  const addPlayer = () => {
    const name = newPlayerName.trim();
    if (name && !players.includes(name)) {
      setPlayers((p) => [...p, name]);
      setNewPlayerName("");
    }
  };

  const removePlayer = (name: string) => {
    setPlayers((p) => p.filter((n) => n !== name));
  };

  const startGame = () => {
    if (players.length >= 2) {
      setGamePhase("question");
      setCurrentIndex(0);
      resetVotes();
    }
  };

  const resetVotes = () => {
    setVotes({});
    setHasVoted(new Set());
    setCurrentVoter(0);
    if (gamePhase === "result" || gamePhase === "vote") {
      setGamePhase("question");
    }
  };

  const startVoting = () => {
    setVotes({});
    setHasVoted(new Set());
    setCurrentVoter(0);
    setGamePhase("vote");
  };

  const castVote = (votedFor: string) => {
    const voter = players[currentVoter];
    setVotes((prev) => ({ ...prev, [votedFor]: (prev[votedFor] || 0) + 1 }));
    setHasVoted((prev) => new Set(prev).add(voter));
    if (currentVoter + 1 >= players.length) {
      setGamePhase("result");
    } else {
      setCurrentVoter((v) => v + 1);
    }
  };

  const getWinner = () => {
    let maxVotes = 0;
    let winners: string[] = [];
    for (const [name, count] of Object.entries(votes)) {
      if (count > maxVotes) {
        maxVotes = count;
        winners = [name];
      } else if (count === maxVotes) {
        winners.push(name);
      }
    }
    return { winners, maxVotes };
  };

  const nextQuestionFromResult = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      animateFlip(() => setCurrentIndex((i) => i + 1));
    }
    setVotes({});
    setHasVoted(new Set());
    setCurrentVoter(0);
    setGamePhase("question");
  };

  const backToSetup = () => {
    setGamePhase("setup");
    setCurrentIndex(0);
    resetVotes();
  };

  // Setup phase
  if (gamePhase === "setup") {
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          🎴 이미지 게임
        </h1>
        <p className="text-gray-500 mb-8">
          &quot;가장 ~할 것 같은 사람은?&quot; 질문에 투표하며 즐기는 술자리/모임 게임!
        </p>

        <div className="calc-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">👥 참가자 등록</h2>
          <p className="text-sm text-gray-500 mb-4">함께 게임할 사람들의 이름을 입력하세요 (최소 2명)</p>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") addPlayer(); }}
              placeholder="이름 입력"
              className="calc-input calc-input-lg flex-1"
              maxLength={10}
            />
            <button
              onClick={addPlayer}
              className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors whitespace-nowrap"
            >
              추가
            </button>
          </div>

          {players.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {players.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {name}
                  <button
                    onClick={() => removePlayer(name)}
                    className="ml-1 text-purple-400 hover:text-purple-700 font-bold"
                    aria-label={`${name} 제거`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}

          <p className="text-sm text-gray-400 mb-4">
            {players.length}명 참가 {players.length < 2 && "/ 최소 2명 필요"}
          </p>

          <button
            onClick={startGame}
            disabled={players.length < 2}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition-colors ${
              players.length >= 2
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            🎮 게임 시작!
          </button>
        </div>

        {/* 게임 설명 */}
        <div className="calc-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">🎯 게임 방법</h2>
          <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
            <li>참가자 이름을 등록합니다</li>
            <li>질문 카드가 나타나면 다 같이 읽습니다</li>
            <li>&quot;투표하기&quot; 버튼을 눌러 각자 해당하는 사람에게 투표합니다</li>
            <li>가장 많은 표를 받은 사람이 벌칙을 수행합니다 (또는 술 한 잔!)</li>
            <li>카테고리 필터와 셔플 기능으로 다양하게 즐기세요!</li>
          </ol>
        </div>

        {/* SEO section */}
        <section className="mt-12 space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 게임이란?</h2>
            <p className="text-gray-600 leading-relaxed">
              이미지 게임은 한국 술자리에서 가장 인기 있는 파티 게임 중 하나입니다.
              &quot;가장 ~할 것 같은 사람은?&quot;이라는 질문에 참가자들이 동시에 해당하는 사람을
              지목하는 방식으로 진행됩니다. 가장 많은 지목을 받은 사람이 벌칙(보통 술 한 잔)을
              수행합니다. 친구 모임, 회식, 엠티 등 다양한 자리에서 즐길 수 있어요.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 게임 잘하는 팁</h2>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>1. 인원이 많을수록 재미있어요 - 4명 이상 추천!</p>
              <p>2. 카테고리별로 분위기에 맞는 질문을 선택하세요</p>
              <p>3. 셔플 기능으로 매번 다른 순서의 질문을 즐기세요</p>
              <p>4. 19금 카테고리는 친한 친구들 사이에서만!</p>
              <p>5. 과음은 금물! 적당히 즐기면서 게임하세요</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">몇 명이서 하면 좋나요?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  최소 2명부터 가능하지만, 4~8명이 가장 재미있습니다. 인원이 많을수록
                  투표 결과가 다양해져서 더 흥미진진해져요.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">술 없이도 할 수 있나요?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  물론이죠! 벌칙을 술 대신 다른 것으로 대체하면 됩니다.
                  예를 들어 노래 부르기, 춤추기 등 다양한 벌칙을 정할 수 있어요.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">질문이 총 몇 개인가요?</h3>
                <p className="text-gray-600 text-sm mt-1">
                  재미, 연애, 성격, 술자리, 19금 등 5가지 카테고리에 걸쳐 총 {QUESTIONS.length}개 이상의
                  질문이 준비되어 있습니다. 셔플 기능을 활용하면 매번 새로운 느낌으로 즐길 수 있어요.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools current="image-game" />
      </div>
    );
  }

  // Game phases: question / vote / result
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">🎴 이미지 게임</h1>
        <button
          onClick={backToSetup}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          처음으로
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((cat) => {
          const count =
            cat.label === "전체"
              ? QUESTIONS.length
              : QUESTIONS.filter((q) => q.category === cat.label).length;
          return (
            <button
              key={cat.label}
              onClick={() => handleCategoryChange(cat.label)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.label
                  ? `${cat.color} text-white shadow-md`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat.emoji} {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          {filteredQuestions.length > 0
            ? `${currentIndex + 1} / ${filteredQuestions.length}`
            : "질문 없음"}
        </span>
        <button
          onClick={handleShuffle}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            isShuffled
              ? "bg-purple-100 text-purple-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🔀 셔플 {isShuffled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div
          key={flipKey}
          className={`relative rounded-2xl bg-gradient-to-br ${cardColor} p-8 text-white shadow-xl mb-6 min-h-[250px] flex flex-col items-center justify-center transition-all duration-200 ${
            isFlipping ? "scale-95 opacity-50" : "scale-100 opacity-100"
          }`}
        >
          <span className="text-5xl mb-4">{currentQuestion.emoji}</span>
          <p className="text-2xl sm:text-3xl font-bold text-center leading-snug">
            {currentQuestion.text}
          </p>
          <span className="mt-4 px-3 py-1 bg-white/20 rounded-full text-sm">
            #{currentQuestion.category}
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            currentIndex === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ◀ 이전 질문
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex >= filteredQuestions.length - 1}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            currentIndex >= filteredQuestions.length - 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700"
          }`}
        >
          다음 질문 ▶
        </button>
      </div>

      {/* Vote / Result section */}
      {gamePhase === "question" && (
        <button
          onClick={startVoting}
          className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-rose-700 transition-colors text-lg mb-6"
        >
          🗳️ 투표하기
        </button>
      )}

      {gamePhase === "vote" && (
        <div className="calc-card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🗳️ 투표 중...
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            <span className="font-bold text-purple-600">{players[currentVoter]}</span>님, 해당하는 사람을 선택하세요!
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {players.map((name) => (
              <button
                key={name}
                onClick={() => castVote(name)}
                className="py-3 px-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 hover:border-purple-400 rounded-xl text-purple-700 font-medium transition-all text-center"
              >
                {name}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-1">
            {players.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i < currentVoter ? "bg-purple-500" : i === currentVoter ? "bg-purple-300" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {currentVoter + 1} / {players.length} 투표 완료
          </p>
        </div>
      )}

      {gamePhase === "result" && (() => {
        const { winners, maxVotes } = getWinner();
        return (
          <div className="calc-card p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📊 투표 결과
            </h3>
            <div className="space-y-2 mb-4">
              {players
                .map((name) => ({ name, count: votes[name] || 0 }))
                .sort((a, b) => b.count - a.count)
                .map(({ name, count }) => {
                  const isWinner = winners.includes(name);
                  const ratio = maxVotes > 0 ? (count / players.length) * 100 : 0;
                  return (
                    <div key={name} className={`rounded-lg p-3 ${isWinner ? "bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400" : "bg-gray-50"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-medium ${isWinner ? "text-amber-700 text-lg" : "text-gray-700"}`}>
                          {isWinner && "👑 "}{name}
                        </span>
                        <span className={`font-bold ${isWinner ? "text-amber-600 text-lg" : "text-gray-500"}`}>
                          {count}표
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${isWinner ? "bg-amber-400" : "bg-purple-300"}`}
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            {winners.length === 1 ? (
              <p className="text-center text-lg font-bold text-amber-600">
                🎉 {winners[0]}님이 선택되었습니다! 벌칙 수행!
              </p>
            ) : (
              <p className="text-center text-lg font-bold text-amber-600">
                🎉 {winners.join(", ")}님이 동점! 다 같이 벌칙!
              </p>
            )}
            <button
              onClick={nextQuestionFromResult}
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors text-lg"
            >
              다음 질문으로 ▶
            </button>
          </div>
        );
      })()}

      {/* Players bar */}
      <div className="calc-card p-4 mb-6">
        <p className="text-sm text-gray-500 mb-2">참가자 ({players.length}명)</p>
        <div className="flex flex-wrap gap-2">
          {players.map((name) => (
            <span key={name} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* SEO section */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 게임이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            이미지 게임은 한국 술자리에서 가장 인기 있는 파티 게임 중 하나입니다.
            &quot;가장 ~할 것 같은 사람은?&quot;이라는 질문에 참가자들이 동시에 해당하는 사람을
            지목하는 방식으로 진행됩니다. 가장 많은 지목을 받은 사람이 벌칙(보통 술 한 잔)을
            수행합니다. 친구 모임, 회식, 엠티 등 다양한 자리에서 즐길 수 있어요.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 게임 잘하는 팁</h2>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>1. 인원이 많을수록 재미있어요 - 4명 이상 추천!</p>
            <p>2. 카테고리별로 분위기에 맞는 질문을 선택하세요</p>
            <p>3. 셔플 기능으로 매번 다른 순서의 질문을 즐기세요</p>
            <p>4. 19금 카테고리는 친한 친구들 사이에서만!</p>
            <p>5. 과음은 금물! 적당히 즐기면서 게임하세요</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">몇 명이서 하면 좋나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                최소 2명부터 가능하지만, 4~8명이 가장 재미있습니다. 인원이 많을수록
                투표 결과가 다양해져서 더 흥미진진해져요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">술 없이도 할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                물론이죠! 벌칙을 술 대신 다른 것으로 대체하면 됩니다.
                예를 들어 노래 부르기, 춤추기 등 다양한 벌칙을 정할 수 있어요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">질문이 총 몇 개인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                재미, 연애, 성격, 술자리, 19금 등 5가지 카테고리에 걸쳐 총 {QUESTIONS.length}개 이상의
                질문이 준비되어 있습니다. 셔플 기능을 활용하면 매번 새로운 느낌으로 즐길 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="image-game" />
    </div>
  );
}
