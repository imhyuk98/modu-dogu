"use client";

import { useState, useCallback, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ───── statement data ───── */
type Category = "전체" | "일반" | "연애" | "학교/직장" | "술자리" | "19금" | "TMI";

interface Statement {
  text: string;
  category: Exclude<Category, "전체">;
}

const STATEMENTS: Statement[] = [
  // 일반 (general) – 15
  { text: "해외여행을 3번 이상 간 적 있다", category: "일반" },
  { text: "길에서 연예인을 만난 적 있다", category: "일반" },
  { text: "경찰서에 가본 적 있다", category: "일반" },
  { text: "골절이나 큰 부상을 당한 적 있다", category: "일반" },
  { text: "번지점프나 스카이다이빙을 해본 적 있다", category: "일반" },
  { text: "무인도에 가보고 싶다고 진지하게 생각한 적 있다", category: "일반" },
  { text: "택시비가 5만원 이상 나온 적 있다", category: "일반" },
  { text: "편의점에서 3만원 이상 쓴 적 있다", category: "일반" },
  { text: "하루에 라면을 3개 이상 먹은 적 있다", category: "일반" },
  { text: "유명인한테 DM을 보낸 적 있다", category: "일반" },
  { text: "길에서 지갑이나 핸드폰을 주워본 적 있다", category: "일반" },
  { text: "외국인과 대화해본 적 있다", category: "일반" },
  { text: "혼자 해외여행을 간 적 있다", category: "일반" },
  { text: "교통사고를 낸 적 있다", category: "일반" },
  { text: "로또를 사본 적 있다", category: "일반" },

  // 연애 (love) – 15
  { text: "소개팅에서 만난 사람과 사귄 적 있다", category: "연애" },
  { text: "전 애인에게 연락한 적 있다", category: "연애" },
  { text: "양다리를 걸쳐본 적 있다", category: "연애" },
  { text: "고백을 받아본 적 있다", category: "연애" },
  { text: "연인의 핸드폰을 몰래 본 적 있다", category: "연애" },
  { text: "돌아온 연인과 다시 사귄 적 있다", category: "연애" },
  { text: "사귀자는 말을 먼저 한 적 있다", category: "연애" },
  { text: "데이트 중에 다른 사람이 눈에 들어온 적 있다", category: "연애" },
  { text: "이별 후 한 달 안에 새 연인이 생긴 적 있다", category: "연애" },
  { text: "연인과 커플링을 해본 적 있다", category: "연애" },
  { text: "연인에게 거짓말한 적 있다", category: "연애" },
  { text: "썸만 타다가 끝난 적이 3번 이상이다", category: "연애" },
  { text: "첫눈에 반한 적 있다", category: "연애" },
  { text: "연인 때문에 울어본 적 있다", category: "연애" },
  { text: "이별 통보를 문자로 받은 적 있다", category: "연애" },

  // 학교/직장 (school/work) – 14
  { text: "수업 중에 잠든 적 있다", category: "학교/직장" },
  { text: "면접에서 거짓말한 적 있다", category: "학교/직장" },
  { text: "과제를 복사한 적 있다", category: "학교/직장" },
  { text: "시험에서 커닝한 적 있다", category: "학교/직장" },
  { text: "회사를 하루 만에 그만둔 적 있다", category: "학교/직장" },
  { text: "상사 욕을 한 적 있다", category: "학교/직장" },
  { text: "야근을 밤새 한 적 있다", category: "학교/직장" },
  { text: "회식에서 1차에 도망친 적 있다", category: "학교/직장" },
  { text: "학교에서 처벌받은 적 있다", category: "학교/직장" },
  { text: "이력서에 거짓을 적은 적 있다", category: "학교/직장" },
  { text: "선생님이나 교수님한테 불려간 적 있다", category: "학교/직장" },
  { text: "수업이나 회의를 빠진 적 있다", category: "학교/직장" },
  { text: "직장 동료와 썸 탄 적 있다", category: "학교/직장" },
  { text: "회사에서 몰래 이직 준비한 적 있다", category: "학교/직장" },

  // 술자리 (drinking) – 14
  { text: "필름이 끊긴 적 있다", category: "술자리" },
  { text: "술 마시고 울어본 적 있다", category: "술자리" },
  { text: "술 마시고 전화한 적 있다", category: "술자리" },
  { text: "술자리에서 토한 적 있다", category: "술자리" },
  { text: "술 마시고 길에서 잠든 적 있다", category: "술자리" },
  { text: "술자리에서 싸운 적 있다", category: "술자리" },
  { text: "폭탄주를 5잔 이상 마신 적 있다", category: "술자리" },
  { text: "술 마시고 쇼핑한 적 있다", category: "술자리" },
  { text: "아침까지 술 마신 적 있다", category: "술자리" },
  { text: "술 마시고 택시에서 잠든 적 있다", category: "술자리" },
  { text: "해장술을 마신 적 있다", category: "술자리" },
  { text: "술자리에서 게임 져서 벌칙 받은 적 있다", category: "술자리" },
  { text: "술 마시고 SNS에 글 올린 적 있다", category: "술자리" },
  { text: "혼술을 일주일에 3번 이상 한 적 있다", category: "술자리" },

  // 19금 (adult, mildly spicy) – 12
  { text: "모르는 사람에게 대시한 적 있다", category: "19금" },
  { text: "클럽에서 번호를 딴 적 있다", category: "19금" },
  { text: "19금 영화를 극장에서 본 적 있다", category: "19금" },
  { text: "부모님 몰래 밤새 놀아본 적 있다", category: "19금" },
  { text: "만난 지 하루 만에 스킨십한 적 있다", category: "19금" },
  { text: "모텔에 가본 적 있다", category: "19금" },
  { text: "야한 이야기로 분위기 띄운 적 있다", category: "19금" },
  { text: "데이팅 앱을 써본 적 있다", category: "19금" },
  { text: "나이트클럽에 가본 적 있다", category: "19금" },
  { text: "이성 친구와 단둘이 여행 간 적 있다", category: "19금" },
  { text: "소개팅에서 바로 2차 간 적 있다", category: "19금" },
  { text: "썸남/썸녀에게 대담한 문자 보낸 적 있다", category: "19금" },

  // TMI – 12
  { text: "SNS 스토킹한 적 있다", category: "TMI" },
  { text: "혼자 노래방 간 적 있다", category: "TMI" },
  { text: "거울 보면서 셀카 연습한 적 있다", category: "TMI" },
  { text: "몰래 다이어트한 적 있다", category: "TMI" },
  { text: "인스타 사진 찍느라 30분 이상 걸린 적 있다", category: "TMI" },
  { text: "ASMR 들으며 잠든 적 있다", category: "TMI" },
  { text: "새벽에 배달 시킨 적 있다", category: "TMI" },
  { text: "화장실에서 핸드폰 30분 이상 한 적 있다", category: "TMI" },
  { text: "유튜브 알고리즘에 빠져 3시간 이상 본 적 있다", category: "TMI" },
  { text: "옛날 사진 보면서 흑역사에 몸서리친 적 있다", category: "TMI" },
  { text: "좋아하는 사람 이름을 검색한 적 있다", category: "TMI" },
  { text: "혼자 영화관 간 적 있다", category: "TMI" },
];

const CATEGORIES: Category[] = ["전체", "일반", "연애", "학교/직장", "술자리", "19금", "TMI"];

const CATEGORY_COLORS: Record<Exclude<Category, "전체">, string> = {
  일반: "from-blue-400 to-cyan-400",
  연애: "from-pink-400 to-rose-400",
  "학교/직장": "from-amber-400 to-orange-400",
  술자리: "from-purple-500 to-violet-500",
  "19금": "from-red-500 to-pink-500",
  TMI: "from-emerald-400 to-teal-400",
};

const CATEGORY_TAB_COLORS: Record<Category, string> = {
  전체: "bg-gray-700 text-white",
  일반: "bg-blue-500 text-white",
  연애: "bg-pink-500 text-white",
  "학교/직장": "bg-amber-500 text-white",
  술자리: "bg-purple-600 text-white",
  "19금": "bg-red-500 text-white",
  TMI: "bg-emerald-500 text-white",
};

interface Player {
  name: string;
  drinks: number;
}

/* ───── shuffle helper ───── */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function NeverHaveIEverPage() {
  const [category, setCategory] = useState<Category>("전체");
  const [deck, setDeck] = useState<Statement[]>(() => shuffle(STATEMENTS));
  const [index, setIndex] = useState(0);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [history, setHistory] = useState<Statement[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [reacted, setReacted] = useState(false);

  // player mode
  const [playerMode, setPlayerMode] = useState(false);
  const [playerSetup, setPlayerSetup] = useState(true);
  const [players, setPlayers] = useState<Player[]>([
    { name: "플레이어 1", drinks: 0 },
    { name: "플레이어 2", drinks: 0 },
  ]);
  const [nameInput, setNameInput] = useState("");

  const filtered = useMemo(
    () => (category === "전체" ? deck : deck.filter((s) => s.category === category)),
    [deck, category]
  );

  const currentCard = filtered[index] ?? null;
  const total = filtered.length;

  /* reset when category changes */
  const changeCategory = useCallback(
    (c: Category) => {
      setCategory(c);
      setIndex(0);
      setHistory([]);
      setYesCount(0);
      setNoCount(0);
      setReacted(false);
      setDeck(shuffle(STATEMENTS));
    },
    []
  );

  const next = useCallback(() => {
    if (currentCard) {
      setHistory((h) => [currentCard, ...h]);
    }
    setIndex((i) => i + 1);
    setReacted(false);
  }, [currentCard]);

  const reshuffle = useCallback(() => {
    setDeck(shuffle(STATEMENTS));
    setIndex(0);
    setHistory([]);
    setYesCount(0);
    setNoCount(0);
    setReacted(false);
  }, []);

  const react = useCallback(
    (type: "yes" | "no") => {
      if (reacted) return;
      setReacted(true);
      if (type === "yes") setYesCount((c) => c + 1);
      else setNoCount((c) => c + 1);
    },
    [reacted]
  );

  /* player helpers */
  const addPlayer = useCallback(() => {
    if (players.length >= 10) return;
    const n = nameInput.trim() || `플레이어 ${players.length + 1}`;
    setPlayers((p) => [...p, { name: n, drinks: 0 }]);
    setNameInput("");
  }, [nameInput, players.length]);

  const removePlayer = useCallback((idx: number) => {
    setPlayers((p) => p.filter((_, i) => i !== idx));
  }, []);

  const addDrink = useCallback((idx: number) => {
    setPlayers((p) => p.map((pl, i) => (i === idx ? { ...pl, drinks: pl.drinks + 1 } : pl)));
  }, []);

  const resetPlayers = useCallback(() => {
    setPlayers((p) => p.map((pl) => ({ ...pl, drinks: 0 })));
  }, []);

  const gradient = currentCard ? CATEGORY_COLORS[currentCard.category] : "from-gray-400 to-gray-500";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center tracking-tight">
        손병호 게임
      </h1>
      <p className="text-gray-500 text-center text-sm">
        &quot;나는 ~한 적 있다/없다&quot; 문장을 하나씩 보여줍니다. 해당하면 벌칙!
      </p>

      {/* ───── category tabs ───── */}
      <div className="flex flex-wrap gap-2 justify-center">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === c
                ? CATEGORY_TAB_COLORS[c] + " shadow-md scale-105"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* ───── main card ───── */}
      {currentCard ? (
        <div
          className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-8 sm:p-12 text-white shadow-xl min-h-[220px] flex flex-col items-center justify-center`}
        >
          <span className="absolute top-3 left-4 text-sm opacity-70 font-medium">
            {currentCard.category}
          </span>
          <span className="absolute top-3 right-4 text-sm opacity-70">
            {index + 1} / {total}
          </span>
          <p className="text-xl sm:text-2xl font-bold text-center leading-relaxed mt-2">
            &quot;나는{" "}
            <span className="underline decoration-white/50 underline-offset-4">
              {currentCard.text}
            </span>
            &quot;
          </p>
        </div>
      ) : (
        <div className="bg-gray-100 rounded-2xl p-12 text-center text-gray-500">
          {total === 0
            ? "이 카테고리에 문장이 없습니다."
            : "모든 문장을 확인했습니다! 셔플 버튼을 눌러 다시 시작하세요."}
        </div>
      )}

      {/* ───── reaction buttons ───── */}
      {currentCard && (
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => react("yes")}
            disabled={reacted}
            className={`flex-1 max-w-[160px] py-3 rounded-xl text-lg font-bold transition-all ${
              reacted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            있다! 🙋
          </button>
          <button
            onClick={() => react("no")}
            disabled={reacted}
            className={`flex-1 max-w-[160px] py-3 rounded-xl text-lg font-bold transition-all ${
              reacted
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md hover:shadow-lg active:scale-95"
            }`}
          >
            없다! 🙅
          </button>
        </div>
      )}

      {/* ───── navigation ───── */}
      <div className="flex gap-3 justify-center">
        {currentCard && (
          <button
            onClick={next}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-colors shadow active:scale-95"
          >
            다음 문장 →
          </button>
        )}
        <button
          onClick={reshuffle}
          className="px-6 py-3 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
        >
          🔀 셔플
        </button>
      </div>

      {/* ───── score ───── */}
      <div className="flex justify-center gap-6 text-sm text-gray-500">
        <span>
          있다 🙋 <strong className="text-orange-600">{yesCount}</strong>
        </span>
        <span>
          없다 🙅 <strong className="text-indigo-600">{noCount}</strong>
        </span>
        <span>
          진행 <strong className="text-gray-800">{Math.min(index + 1, total)}</strong> / {total}
        </span>
      </div>

      {/* ───── player mode toggle ───── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <button
          onClick={() => setPlayerMode(!playerMode)}
          className="w-full flex items-center justify-between font-semibold text-gray-800"
        >
          <span>👥 플레이어 모드</span>
          <span className="text-sm text-gray-400">{playerMode ? "접기 ▲" : "펼치기 ▼"}</span>
        </button>

        {playerMode && (
          <div className="mt-4 space-y-4">
            {playerSetup && (
              <>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="이름 입력 (최대 10명)"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addPlayer()}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    maxLength={10}
                  />
                  <button
                    onClick={addPlayer}
                    disabled={players.length >= 10}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {players.map((p, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm"
                    >
                      {p.name}
                      <button
                        onClick={() => removePlayer(i)}
                        className="text-gray-400 hover:text-red-500 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {players.length >= 2 && (
                  <button
                    onClick={() => setPlayerSetup(false)}
                    className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
                  >
                    게임 시작!
                  </button>
                )}
                {players.length < 2 && (
                  <p className="text-xs text-gray-400 text-center">최소 2명이 필요합니다.</p>
                )}
              </>
            )}

            {!playerSetup && (
              <>
                <p className="text-sm text-gray-500">
                  &quot;있다&quot;에 해당하면 이름을 눌러 벌칙 횟수를 추가하세요!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[...players]
                    .sort((a, b) => b.drinks - a.drinks)
                    .map((p, i) => {
                      const origIdx = players.findIndex((pp) => pp.name === p.name);
                      return (
                        <button
                          key={origIdx}
                          onClick={() => addDrink(origIdx)}
                          className={`relative p-3 rounded-xl text-center transition-all active:scale-95 ${
                            i === 0 && p.drinks > 0
                              ? "bg-red-50 border-2 border-red-300"
                              : "bg-gray-50 border border-gray-200"
                          }`}
                        >
                          {i === 0 && p.drinks > 0 && (
                            <span className="absolute -top-2 -right-2 text-lg">👑</span>
                          )}
                          <p className="font-semibold text-sm truncate">{p.name}</p>
                          <p className="text-xl font-bold text-red-500 mt-1">🍺 {p.drinks}</p>
                        </button>
                      );
                    })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetPlayers}
                    className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setPlayerSetup(true)}
                    className="flex-1 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                  >
                    플레이어 수정
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ───── history ───── */}
      {history.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between font-semibold text-gray-800"
          >
            <span>📜 히스토리 ({history.length})</span>
            <span className="text-sm text-gray-400">{showHistory ? "접기 ▲" : "펼치기 ▼"}</span>
          </button>
          {showHistory && (
            <ul className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span
                    className={`shrink-0 inline-block px-2 py-0.5 rounded text-xs font-medium text-white bg-gradient-to-r ${
                      CATEGORY_COLORS[h.category]
                    }`}
                  >
                    {h.category}
                  </span>
                  <span className="truncate">{h.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ───── how to play ───── */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-gray-800">📖 손병호 게임 하는 법</h2>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 leading-relaxed">
          <li>
            한 명이 &quot;나는 ___한 적 있다&quot; 문장을 읽습니다.
          </li>
          <li>해당하는 사람은 손을 들거나 벌칙을 수행합니다.</li>
          <li>
            술자리에서는 해당하면 한 잔! 플레이어 모드에서 벌칙 횟수를 기록할 수 있습니다.
          </li>
          <li>&quot;다음 문장&quot; 버튼을 눌러 계속 진행하세요.</li>
        </ol>
      </section>

      {/* ───── SEO content ───── */}
      <section className="mt-8 prose prose-sm max-w-none text-gray-500">
        <h2 className="text-lg font-bold text-gray-700">
          손병호 게임이란?
        </h2>
        <p>
          손병호 게임은 한국의 대표적인 술자리 게임으로, 영어로는 &quot;Never Have I
          Ever&quot;라고 합니다. 참가자들이 돌아가며 &quot;나는 ~한 적 있다&quot;라는 문장을
          말하고, 해당하는 사람이 벌칙(주로 한 잔)을 수행하는 게임입니다. 서로에 대해 몰랐던
          사실을 알아가며 재미있게 즐길 수 있는 파티 게임입니다.
        </p>
        <p>
          이 온라인 손병호 게임은 일반, 연애, 학교/직장, 술자리, 19금, TMI 등 다양한 카테고리의
          80개 이상의 문장을 제공합니다. 카테고리 필터로 원하는 주제만 선택하고, 플레이어 모드로
          누가 가장 많이 벌칙을 받았는지 추적할 수 있습니다.
        </p>
      </section>

      <RelatedTools current="never-have-i-ever" />
    </div>
  );
}
