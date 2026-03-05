"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

// ── 초성 추출 ──────────────────────────────────────────────
const CHOSUNG_LIST = [
  "ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ",
  "ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ",
];

function getChosung(text: string): string {
  return [...text]
    .map((ch) => {
      const code = ch.charCodeAt(0) - 0xac00;
      if (code < 0 || code > 11171) return ch;
      return CHOSUNG_LIST[Math.floor(code / 588)];
    })
    .join("");
}

// ── 단어 데이터베이스 ──────────────────────────────────────
interface WordEntry {
  word: string;
  chosung: string;
}

const RAW_WORDS: Record<string, string[]> = {
  "음식": [
    "김치찌개","된장찌개","떡볶이","비빔밥","불고기","삼겹살","갈비탕","냉면",
    "짜장면","짬뽕","돈까스","김밥","초밥","라면","치킨","피자","햄버거","파스타",
    "보쌈","족발","떡갈비","갈비찜","순두부","칼국수","잔치국수","만두","호떡",
    "붕어빵","팥빙수","식혜","수정과","약과","인절미","송편","잡채","전복죽",
    "삼계탕","해물탕","부대찌개","감자탕","순대국","설렁탕","곰탕","육개장",
    "미역국","떡국","오므라이스","카레라이스","볶음밥","제육볶음",
  ],
  "동물": [
    "강아지","고양이","사자","호랑이","코끼리","기린","펭귄","돌고래",
    "토끼","곰","여우","늑대","독수리","앵무새","거북이","코알라","판다",
    "원숭이","하마","악어","수달","미어캣","치타","표범","고릴라",
    "오랑우탄","두루미","플라밍고","해파리","문어","오징어","가오리",
    "고래상어","흰수염고래","북극곰","알파카","카멜레온","이구아나",
    "도마뱀","올빼미","부엉이","다람쥐","청설모","비둘기","참새",
  ],
  "나라": [
    "대한민국","미국","일본","중국","영국","프랑스","독일","이탈리아",
    "스페인","포르투갈","브라질","아르헨티나","캐나다","호주","뉴질랜드",
    "인도","태국","베트남","필리핀","인도네시아","말레이시아","싱가포르",
    "네덜란드","벨기에","스위스","오스트리아","스웨덴","노르웨이","덴마크",
    "핀란드","러시아","터키","이집트","남아공","멕시코","콜롬비아",
    "페루","칠레","그리스","폴란드","체코","헝가리","루마니아",
  ],
  "연예인": [
    "아이유","방탄소년단","블랙핑크","트와이스","뉴진스","에스파",
    "이효리","싸이","빅뱅","엑소","레드벨벳","세븐틴","스트레이키즈",
    "송강호","이정재","마동석","전지현","손예진","공유","현빈",
    "이민호","김수현","박서준","송혜교","김태리","박보영","유재석",
    "강호동","이광수","전소민","하하","송지효","지석진","김종국",
    "이승기","박보검","차은우","안유진","장원영","카리나","윈터",
  ],
  "영화/드라마": [
    "기생충","올드보이","부산행","광해","명량","극한직업","범죄도시",
    "신과함께","타짜","괴물","아저씨","내부자들","베테랑","암살",
    "도둑들","해운대","왕의남자","태극기휘날리며","실미도","친구",
    "대장금","겨울연가","태양의후예","도깨비","미생","시그널",
    "응답하라","별에서온그대","이태원클라쓰","킹덤","오징어게임",
    "더글로리","무빙","서울의봄","파묘","인터스텔라","아바타",
    "어벤져스","해리포터","겨울왕국","라라랜드","타이타닉",
  ],
  "브랜드": [
    "삼성","현대","기아","엘지","네이버","카카오","쿠팡","배달의민족",
    "토스","당근마켓","애플","구글","아마존","넷플릭스","테슬라",
    "나이키","아디다스","스타벅스","맥도날드","코카콜라","이케아",
    "유니클로","무신사","올리브영","다이소","에르메스","루이비통",
    "샤넬","구찌","프라다","롤렉스","오메가","벤츠","비엠더블유",
    "아우디","포르쉐","페라리","람보르기니","소니","닌텐도",
  ],
  "직업": [
    "의사","변호사","소방관","경찰관","교사","요리사","배우","가수",
    "프로그래머","디자이너","간호사","약사","건축가","기자","파일럿",
    "수의사","작가","사진작가","운동선수","유튜버","회계사","세무사",
    "공인중개사","감정평가사","관세사","손해사정인","변리사","노무사",
    "소믈리에","바리스타","플로리스트","큐레이터","아나운서","기상캐스터",
    "웹디자이너","데이터분석가","인공지능연구원","로봇공학자","우주비행사",
  ],
  "일상단어": [
    "우산","거울","베개","이불","양말","안경","시계","지갑",
    "열쇠","가방","신발","모자","장갑","마스크","충전기","이어폰",
    "노트북","마우스","키보드","책상","의자","냉장고","세탁기",
    "전자레인지","에어컨","선풍기","청소기","텔레비전","리모컨","칫솔",
    "치약","샴푸","수건","비누","거울","도마","냄비","프라이팬",
    "젓가락","숟가락","접시","컵","물병","쓰레기통","달력",
  ],
};

// Pre-compute chosung for all words
const WORDS_DB: Record<string, WordEntry[]> = {};
for (const [cat, words] of Object.entries(RAW_WORDS)) {
  WORDS_DB[cat] = words.map((w) => ({ word: w, chosung: getChosung(w) }));
}

const CATEGORIES = Object.keys(RAW_WORDS);
const DIFFICULTIES = [
  { label: "2글자", len: 2 },
  { label: "3글자", len: 3 },
  { label: "4글자+", len: 4 },
];
const TIMER_OPTIONS = [10, 20, 30];

type GameMode = "solo" | "multi";
type GameState = "menu" | "playing" | "result" | "timeout" | "roundEnd";

interface PlayerScore {
  name: string;
  correct: number;
  skip: number;
  timeout: number;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function ChosungQuizPage() {
  // Settings
  const [category, setCategory] = useState<string>("음식");
  const [difficulty, setDifficulty] = useState(2);
  const [timerSec, setTimerSec] = useState(20);
  const [gameMode, setGameMode] = useState<GameMode>("solo");
  const [playerNames, setPlayerNames] = useState<string[]>(["플레이어 1", "플레이어 2"]);
  const [playerCount, setPlayerCount] = useState(2);

  // Game state
  const [state, setState] = useState<GameState>("menu");
  const [currentWord, setCurrentWord] = useState<WordEntry | null>(null);
  const [currentChosung, setCurrentChosung] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [hintRevealed, setHintRevealed] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerExamples, setAnswerExamples] = useState<string[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState<"correct" | "wrong" | null>(null);

  // Score tracking
  const [scores, setScores] = useState<PlayerScore[]>([]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [roundNum, setRoundNum] = useState(0);
  const [totalRounds, setTotalRounds] = useState(10);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getFilteredWords = useCallback((cat: string, len: number): WordEntry[] => {
    const entries = WORDS_DB[cat] || [];
    if (len >= 4) return entries.filter((e) => e.word.length >= 4);
    return entries.filter((e) => e.word.length === len);
  }, []);

  const getAnswerExamples = useCallback(
    (chosung: string, cat: string): string[] => {
      const entries = WORDS_DB[cat] || [];
      return entries.filter((e) => e.chosung === chosung).map((e) => e.word);
    },
    []
  );

  const pickNewWord = useCallback(() => {
    const filtered = getFilteredWords(category, difficulty);
    if (filtered.length === 0) return null;
    const entry = pickRandom(filtered);
    return entry;
  }, [category, difficulty, getFilteredWords]);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(timerSec);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopTimer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerSec, stopTimer]);

  // Handle timeout
  useEffect(() => {
    if (timeLeft === 0 && state === "playing") {
      stopTimer();
      // Record timeout
      if (gameMode === "multi") {
        setScores((prev) => {
          const next = [...prev];
          next[currentPlayerIdx] = {
            ...next[currentPlayerIdx],
            timeout: next[currentPlayerIdx].timeout + 1,
          };
          return next;
        });
      } else {
        setScores((prev) => {
          const next = [...prev];
          if (next[0]) {
            next[0] = { ...next[0], timeout: next[0].timeout + 1 };
          }
          return next;
        });
      }
      setState("timeout");
    }
  }, [timeLeft, state, gameMode, currentPlayerIdx, stopTimer]);

  const startGame = () => {
    const initialScores: PlayerScore[] =
      gameMode === "solo"
        ? [{ name: "나", correct: 0, skip: 0, timeout: 0 }]
        : playerNames.slice(0, playerCount).map((n) => ({
            name: n,
            correct: 0,
            skip: 0,
            timeout: 0,
          }));
    setScores(initialScores);
    setCurrentPlayerIdx(0);
    setRoundNum(1);
    setShowAnswer(false);
    setHintRevealed([]);
    setAnswerFeedback(null);
    setUserAnswer("");

    const entry = pickNewWord();
    if (!entry) return;
    setCurrentWord(entry);
    setCurrentChosung(entry.chosung);
    setAnswerExamples(getAnswerExamples(entry.chosung, category));
    setState("playing");
    startTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const nextRound = () => {
    if (roundNum >= totalRounds) {
      setState("result");
      stopTimer();
      return;
    }

    const nextPlayer =
      gameMode === "multi"
        ? (currentPlayerIdx + 1) % scores.length
        : 0;
    setCurrentPlayerIdx(nextPlayer);
    setRoundNum((r) => r + 1);
    setShowAnswer(false);
    setHintRevealed([]);
    setAnswerFeedback(null);
    setUserAnswer("");

    const entry = pickNewWord();
    if (!entry) return;
    setCurrentWord(entry);
    setCurrentChosung(entry.chosung);
    setAnswerExamples(getAnswerExamples(entry.chosung, category));
    setState("playing");
    startTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleCorrect = () => {
    stopTimer();
    const idx = gameMode === "multi" ? currentPlayerIdx : 0;
    setScores((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], correct: next[idx].correct + 1 };
      return next;
    });
    setAnswerFeedback("correct");
    setTimeout(() => {
      setAnswerFeedback(null);
      nextRound();
    }, 800);
  };

  const handleSkip = () => {
    stopTimer();
    const idx = gameMode === "multi" ? currentPlayerIdx : 0;
    setScores((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], skip: next[idx].skip + 1 };
      return next;
    });
    nextRound();
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || !currentWord) return;
    const trimmed = userAnswer.trim();
    const inputChosung = getChosung(trimmed);
    if (inputChosung === currentChosung) {
      handleCorrect();
    } else {
      setAnswerFeedback("wrong");
      setTimeout(() => setAnswerFeedback(null), 800);
    }
    setUserAnswer("");
  };

  const revealHint = () => {
    if (!currentWord) return;
    const unrevealed: number[] = [];
    for (let i = 0; i < currentWord.word.length; i++) {
      if (!hintRevealed.includes(i)) unrevealed.push(i);
    }
    if (unrevealed.length === 0) return;
    const idx = pickRandom(unrevealed);
    setHintRevealed((prev) => [...prev, idx]);
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const timerPercent = timerSec > 0 ? (timeLeft / timerSec) * 100 : 0;
  const timerColor =
    timeLeft > timerSec * 0.5
      ? "bg-green-500"
      : timeLeft > timerSec * 0.25
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight text-center">
        초성 퀴즈
      </h1>
      <p className="text-gray-500 text-center mb-8">
        주어진 초성을 보고 단어를 맞춰보세요!
      </p>

      {/* ── MENU ── */}
      {state === "menu" && (
        <div className="calc-card p-6 space-y-6">
          {/* Game Mode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              게임 모드
            </label>
            <div className="flex gap-3">
              {(["solo", "multi"] as GameMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setGameMode(m)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    gameMode === m
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {m === "solo" ? "혼자 하기" : "여러 명 (돌려 하기)"}
                </button>
              ))}
            </div>
          </div>

          {/* Multiplayer setup */}
          {gameMode === "multi" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                플레이어 수
              </label>
              <div className="flex gap-2 mb-3">
                {[2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setPlayerCount(n);
                      setPlayerNames((prev) => {
                        const next = [...prev];
                        while (next.length < n) next.push(`플레이어 ${next.length + 1}`);
                        return next.slice(0, n);
                      });
                    }}
                    className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${
                      playerCount === n
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {playerNames.slice(0, playerCount).map((name, i) => (
                  <input
                    key={i}
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const next = [...playerNames];
                      next[i] = e.target.value;
                      setPlayerNames(next);
                    }}
                    className="calc-input w-full"
                    placeholder={`플레이어 ${i + 1} 이름`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    category === cat
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              난이도 (글자 수)
            </label>
            <div className="flex gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.len}
                  onClick={() => setDifficulty(d.len)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    difficulty === d.len
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              제한 시간
            </label>
            <div className="flex gap-3">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTimerSec(t)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    timerSec === t
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {t}초
                </button>
              ))}
            </div>
          </div>

          {/* Rounds */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              총 라운드
            </label>
            <div className="flex gap-3">
              {[5, 10, 15, 20].map((r) => (
                <button
                  key={r}
                  onClick={() => setTotalRounds(r)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                    totalRounds === r
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {r}라운드
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            게임 시작
          </button>
        </div>
      )}

      {/* ── PLAYING / TIMEOUT ── */}
      {(state === "playing" || state === "timeout") && currentWord && (
        <div className="space-y-5">
          {/* Status bar */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">
              라운드 {roundNum}/{totalRounds}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
              {category}
            </span>
            {gameMode === "multi" && (
              <span className="font-semibold text-blue-600">
                {scores[currentPlayerIdx]?.name} 차례
              </span>
            )}
          </div>

          {/* Timer bar */}
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-linear ${timerColor}`}
              style={{ width: `${timerPercent}%` }}
            />
          </div>
          <div className="text-center">
            <span
              className={`text-2xl font-bold ${
                timeLeft <= 5 && timeLeft > 0
                  ? "text-red-500 animate-pulse"
                  : "text-gray-800"
              }`}
            >
              {timeLeft}초
            </span>
          </div>

          {/* Chosung display */}
          <div className="calc-card p-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              {[...currentChosung].map((ch, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-50 border-2 border-gray-300 rounded-xl"
                >
                  {hintRevealed.includes(i) ? (
                    <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {currentWord.word[i]}
                    </span>
                  ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {ch}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Answer feedback */}
            {answerFeedback === "correct" && (
              <div className="text-green-600 font-bold text-lg mb-3 animate-bounce">
                정답입니다!
              </div>
            )}
            {answerFeedback === "wrong" && (
              <div className="text-red-500 font-bold text-lg mb-3">
                틀렸습니다! 다시 시도하세요.
              </div>
            )}

            {state === "timeout" && (
              <div className="text-red-500 font-bold text-lg mb-3">
                시간 초과!
              </div>
            )}

            {/* Answer input */}
            {state === "playing" && (
              <div className="flex gap-2 max-w-md mx-auto mb-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmitAnswer();
                  }}
                  placeholder="단어를 입력하세요..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSubmitAnswer}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  확인
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-3">
              {state === "playing" && (
                <>
                  <button
                    onClick={revealHint}
                    disabled={hintRevealed.length >= currentWord.word.length}
                    className="px-4 py-2.5 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    힌트 ({hintRevealed.length}/{currentWord.word.length})
                  </button>
                  <button
                    onClick={handleSkip}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    스킵
                  </button>
                  <button
                    onClick={handleShowAnswer}
                    className="px-4 py-2.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    정답 보기
                  </button>
                </>
              )}
              {state === "timeout" && (
                <button
                  onClick={nextRound}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  다음 라운드
                </button>
              )}
            </div>

            {/* Show answer */}
            {showAnswer && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-gray-500 mb-1">정답 예시</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {answerExamples.length > 0 ? (
                    answerExamples.map((w, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white border border-blue-200 rounded-full text-sm font-medium text-blue-700"
                      >
                        {w}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">
                      데이터베이스에 일치하는 단어: {currentWord.word}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current scores */}
          {scores.length > 0 && (
            <div className="calc-card p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">현재 점수</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {scores.map((s, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-lg text-center text-sm ${
                      i === currentPlayerIdx && state === "playing"
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="font-medium text-gray-800">{s.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span className="text-green-600">{s.correct}</span> /{" "}
                      <span className="text-gray-400">{s.skip}</span> /{" "}
                      <span className="text-red-500">{s.timeout}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-400 mt-2 text-center">
                정답 / 스킵 / 시간초과
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── RESULT ── */}
      {state === "result" && (
        <div className="calc-card p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            게임 결과
          </h2>

          {/* Winner announcement for multi */}
          {gameMode === "multi" && scores.length > 1 && (
            <div className="text-center">
              {(() => {
                const sorted = [...scores].sort((a, b) => b.correct - a.correct);
                const winner = sorted[0];
                const isTie =
                  sorted.filter((s) => s.correct === winner.correct).length > 1;
                return (
                  <div className="text-lg font-semibold text-blue-600">
                    {isTie ? "무승부!" : `${winner.name} 승리!`}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Score table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-medium">이름</th>
                  <th className="pb-2 font-medium text-center">정답</th>
                  <th className="pb-2 font-medium text-center">스킵</th>
                  <th className="pb-2 font-medium text-center">시간초과</th>
                  <th className="pb-2 font-medium text-center">정답률</th>
                </tr>
              </thead>
              <tbody>
                {scores
                  .sort((a, b) => b.correct - a.correct)
                  .map((s, i) => {
                    const total = s.correct + s.skip + s.timeout;
                    const rate = total > 0 ? Math.round((s.correct / total) * 100) : 0;
                    return (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2.5 font-medium text-gray-800">
                          {i === 0 && scores.length > 1 ? `${s.name}` : s.name}
                        </td>
                        <td className="py-2.5 text-center text-green-600 font-semibold">
                          {s.correct}
                        </td>
                        <td className="py-2.5 text-center text-gray-400">
                          {s.skip}
                        </td>
                        <td className="py-2.5 text-center text-red-500">
                          {s.timeout}
                        </td>
                        <td className="py-2.5 text-center font-medium text-blue-600">
                          {rate}%
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              다시 하기
            </button>
            <button
              onClick={() => setState("menu")}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              설정으로
            </button>
          </div>
        </div>
      )}

      {/* ── SEO Section ── */}
      <section className="mt-12 space-y-6 text-gray-700 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-gray-900">
          초성 퀴즈란?
        </h2>
        <p>
          초성 퀴즈는 한글의 자음(초성)만 보고 원래 단어를 맞추는 인기 있는 한국어 단어 게임입니다.
          예를 들어 &quot;ㄱㅊㅈㄱ&quot;를 보고 &quot;김치찌개&quot;를 떠올리는 방식입니다.
          TV 예능 프로그램이나 친구들 모임에서 자주 즐기는 게임으로,
          어휘력과 순발력을 동시에 키울 수 있습니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900">
          초성 퀴즈 게임 방법
        </h2>
        <ul className="list-disc list-inside space-y-1">
          <li>카테고리(음식, 동물, 나라 등)와 글자 수를 선택합니다.</li>
          <li>제한 시간 내에 화면에 표시된 초성에 맞는 단어를 입력합니다.</li>
          <li>힌트 버튼을 누르면 한 글자씩 실제 글자가 공개됩니다.</li>
          <li>정답 보기 버튼으로 가능한 정답 예시를 확인할 수 있습니다.</li>
          <li>여러 명이 돌려가며 플레이하는 멀티 모드도 지원합니다.</li>
        </ul>

        <h2 className="text-xl font-bold text-gray-900">
          초성 퀴즈 팁
        </h2>
        <p>
          쌍자음(ㄲ, ㄸ, ㅃ, ㅆ, ㅉ)이 포함된 초성은 난이도가 높습니다.
          평소에 다양한 분야의 어휘를 많이 접해두면 초성 퀴즈에서 유리합니다.
          특히 음식, 영화, 연예인 카테고리는 최신 트렌드를 알고 있으면 도움이 됩니다.
          힌트를 전략적으로 사용하여 핵심 글자부터 확인하는 것도 좋은 방법입니다.
        </p>

        <h2 className="text-xl font-bold text-gray-900">
          초성 추출 원리
        </h2>
        <p>
          한글 유니코드에서 각 글자는 초성, 중성, 종성의 조합으로 구성됩니다.
          유니코드 값에서 0xAC00을 빼고 588로 나누면 초성 인덱스를 구할 수 있습니다.
          초성은 ㄱ(0), ㄲ(1), ㄴ(2), ㄷ(3), ㄸ(4), ㄹ(5), ㅁ(6), ㅂ(7), ㅃ(8), ㅅ(9),
          ㅆ(10), ㅇ(11), ㅈ(12), ㅉ(13), ㅊ(14), ㅋ(15), ㅌ(16), ㅍ(17), ㅎ(18)
          순서로 총 19개입니다.
        </p>
      </section>

      <RelatedTools current="chosung-quiz" />
    </div>
  );
}
