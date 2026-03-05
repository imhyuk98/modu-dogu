"use client";

import { useState, useEffect, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

const LIAR_CATEGORIES: Record<string, string[]> = {
  "음식": [
    "김치찌개", "떡볶이", "치킨", "피자", "삼겹살", "비빔밥", "라면", "초밥",
    "파스타", "햄버거", "갈비탕", "냉면", "짜장면", "짬뽕", "돈까스",
    "김밥", "족발", "보쌈", "떡갈비", "불고기",
  ],
  "동물": [
    "강아지", "고양이", "사자", "호랑이", "코끼리", "기린", "펭귄", "돌고래",
    "토끼", "곰", "여우", "늑대", "독수리", "앵무새", "거북이",
    "코알라", "판다", "원숭이", "하마", "악어",
  ],
  "직업": [
    "의사", "변호사", "소방관", "경찰관", "교사", "요리사", "배우", "가수",
    "프로그래머", "디자이너", "간호사", "약사", "건축가", "기자", "파일럿",
    "수의사", "작가", "사진작가", "운동선수", "유튜버",
  ],
  "장소": [
    "학교", "병원", "공항", "놀이공원", "해변", "도서관", "카페", "영화관",
    "마트", "공원", "지하철", "백화점", "동물원", "수영장", "미술관",
    "경기장", "캠핑장", "온천", "볼링장", "노래방",
  ],
  "영화": [
    "기생충", "아바타", "어벤져스", "해리포터", "겨울왕국", "타이타닉", "인셉션",
    "인터스텔라", "매트릭스", "반지의 제왕", "부산행", "올드보이", "극한직업",
    "어바웃타임", "라라랜드", "조커", "범죄도시", "광해", "신과함께", "명량",
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function LiarGamePage() {
  const [playerCount, setPlayerCount] = useState(4);
  const [category, setCategory] = useState<string>("음식");
  const [started, setStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [liarIndex, setLiarIndex] = useState(-1);
  const [word, setWord] = useState("");
  const [showWord, setShowWord] = useState(false);
  const [allRevealed, setAllRevealed] = useState(false);
  const [timer, setTimer] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startGame = () => {
    const words = LIAR_CATEGORIES[category];
    setWord(pickRandom(words));
    setLiarIndex(Math.floor(Math.random() * playerCount));
    setCurrentPlayer(0);
    setShowWord(false);
    setAllRevealed(false);
    setTimer(180);
    setTimerRunning(false);
    setStarted(true);
  };

  const revealWord = () => setShowWord(true);

  const nextPlayer = () => {
    setShowWord(false);
    if (currentPlayer + 1 >= playerCount) {
      setAllRevealed(true);
      setTimerRunning(true);
    } else {
      setCurrentPlayer((p) => p + 1);
    }
  };

  useEffect(() => {
    if (timerRunning && timer > 0) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timer]);

  useEffect(() => {
    if (timer <= 0) {
      setTimerRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [timer]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const reset = () => {
    setStarted(false);
    setShowWord(false);
    setAllRevealed(false);
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">🤥 라이어 게임</h1>
      <p className="text-gray-500 mb-6">
        라이어를 찾아라! 3~10명이 함께 즐기는 온라인 라이어 게임.
      </p>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 text-white min-h-[400px]">
        {!started ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                참가자 수
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setPlayerCount((c) => Math.max(3, c - 1))}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-lg text-xl font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-2xl font-bold w-12 text-center">{playerCount}명</span>
                <button
                  onClick={() => setPlayerCount((c) => Math.min(10, c + 1))}
                  className="w-10 h-10 bg-purple-700 hover:bg-purple-600 rounded-lg text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(LIAR_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      category === cat
                        ? "bg-pink-500 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={startGame}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all"
            >
              게임 시작!
            </button>
          </div>
        ) : allRevealed ? (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-2">🕵️</div>
            <h3 className="text-xl font-bold text-pink-300">토론을 시작하세요!</h3>
            <p className="text-purple-200">
              라이어가 누구인지 찾아내세요. 제시어에 대해 이야기하되, 라이어가 알아채지 못하게 조심하세요!
            </p>
            <div
              className={`text-5xl font-mono font-bold ${
                timer <= 30 ? "text-red-400 animate-pulse" : "text-green-400"
              }`}
            >
              {formatTime(timer)}
            </div>
            {timer <= 0 && (
              <div className="bg-pink-500/20 border border-pink-500 rounded-xl p-4">
                <p className="text-pink-300 font-bold text-lg">시간 종료! 투표하세요!</p>
                <p className="text-purple-200 mt-2">
                  라이어는 <span className="text-yellow-300 font-bold">{liarIndex + 1}번 플레이어</span>였습니다!
                </p>
                <p className="text-purple-200 mt-1">
                  제시어: <span className="text-green-300 font-bold">{word}</span>
                </p>
              </div>
            )}
            <div className="flex gap-3">
              {timerRunning ? (
                <button
                  onClick={() => setTimerRunning(false)}
                  className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold transition-colors"
                >
                  일시정지
                </button>
              ) : timer > 0 ? (
                <button
                  onClick={() => setTimerRunning(true)}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-500 rounded-xl font-bold transition-colors"
                >
                  계속
                </button>
              ) : null}
              <button
                onClick={reset}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 rounded-xl font-bold transition-colors"
              >
                새 게임
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-purple-300 text-sm">
              {currentPlayer + 1} / {playerCount} 번째 플레이어
            </div>
            {!showWord ? (
              <>
                <div className="text-6xl mb-4">🙈</div>
                <p className="text-lg text-purple-200">
                  <span className="text-yellow-300 font-bold">{currentPlayer + 1}번 플레이어</span>만 화면을 보세요!
                </p>
                <button
                  onClick={revealWord}
                  className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all"
                >
                  제시어 확인
                </button>
              </>
            ) : (
              <>
                {currentPlayer === liarIndex ? (
                  <>
                    <div className="text-6xl mb-4">🤥</div>
                    <div className="bg-red-500/20 border-2 border-red-500 rounded-2xl p-6">
                      <p className="text-2xl font-bold text-red-400">
                        당신은 라이어입니다!
                      </p>
                      <p className="text-purple-300 mt-2 text-sm">
                        카테고리: {category}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">📝</div>
                    <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-6">
                      <p className="text-sm text-green-300 mb-1">제시어</p>
                      <p className="text-3xl font-bold text-green-400">{word}</p>
                    </div>
                  </>
                )}
                <button
                  onClick={nextPlayer}
                  className="w-full py-4 bg-gray-600 hover:bg-gray-500 rounded-xl text-lg font-bold transition-colors"
                >
                  확인 완료 (숨기기)
                </button>
              </>
            )}
            <button
              onClick={reset}
              className="w-full py-2 text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              처음으로
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 text-sm">🍺 음주는 적당히! 건강한 음주 문화를 만들어 갑시다.</p>
        <p className="text-amber-500 text-xs mt-1">19세 미만 음주는 법으로 금지되어 있습니다.</p>
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">라이어 게임이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            라이어 게임은 참가자 중 한 명이 &apos;라이어&apos;가 되어 다른 사람들을 속이는 대화형 추리 게임입니다.
            라이어를 제외한 참가자들에게는 같은 제시어가 주어지고, 라이어에게는 카테고리만 알려줍니다.
            참가자들은 제시어에 관한 이야기를 나누며 라이어를 찾아내야 합니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">게임 규칙</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>참가자 수(3~10명)와 카테고리를 선택합니다.</li>
            <li>각 참가자가 차례대로 화면을 보고 자신의 역할과 제시어를 확인합니다.</li>
            <li>라이어는 카테고리만 알고, 나머지는 제시어를 알게 됩니다.</li>
            <li>3분 동안 제시어에 관해 토론하며 라이어를 찾아냅니다.</li>
            <li>시간이 끝나면 투표하여 라이어를 지목합니다.</li>
          </ol>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium text-gray-900">최소 몇 명이 필요한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">최소 3명부터 최대 10명까지 참여할 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">앱 설치가 필요한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">아닙니다! 스마트폰 브라우저에서 바로 사용할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="liar-game" />
    </div>
  );
}
