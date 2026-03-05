"use client";

import { useState, useEffect, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

const RANDOM_MISSIONS = [
  "건배사 하기", "노래 한 소절 부르기", "물구나무서기 도전", "방귀 소리 내기",
  "애교 부리기", "춤 한 곡 추기", "성대모사 하기", "사투리로 고백하기",
  "윙크 10번 하기", "옆 사람 칭찬 3개", "스쿼트 10개", "개인기 보여주기",
  "셀카 찍어서 단톡방에 올리기", "10초간 섹시한 표정", "아기 흉내 내기",
  "옆 사람에게 프러포즈", "가장 웃긴 표정 짓기", "드라마 명대사 재현",
  "랩으로 자기소개", "30초간 고양이 흉내", "가장 잘하는 개그 보여주기",
  "한 발로 10초 서기", "10초간 무표정 유지", "옆 사람 어깨 마사지 30초",
  "코끼리 코 돌고 한 줄로 걷기", "인생 좌우명 외치기",
  "옆 사람과 팔짱 끼고 셀카", "눈 감고 옆 사람 얼굴 만지기",
  "가장 최근 갤러리 사진 공개", "30초간 웃음 참기",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function RandomPickPage() {
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState("");
  const [mission, setMission] = useState("");
  const [displayName, setDisplayName] = useState("");
  const spinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const addName = () => {
    const n = input.trim();
    if (n && !names.includes(n)) {
      setNames([...names, n]);
      setInput("");
    }
  };

  const removeName = (idx: number) => {
    setNames(names.filter((_, i) => i !== idx));
  };

  const spin = () => {
    if (names.length < 2 || spinning) return;
    setSpinning(true);
    setSelected("");
    setMission("");

    let count = 0;
    const total = 20 + Math.floor(Math.random() * 10);
    spinRef.current = setInterval(() => {
      setDisplayName(names[count % names.length]);
      count++;
      if (count >= total) {
        if (spinRef.current) clearInterval(spinRef.current);
        const winner = pickRandom(names);
        setDisplayName(winner);
        setSelected(winner);
        setMission(pickRandom(RANDOM_MISSIONS));
        setSpinning(false);
      }
    }, 80 + count * 5);
  };

  useEffect(() => {
    return () => {
      if (spinRef.current) clearInterval(spinRef.current);
    };
  }, []);

  return (
    <div className="py-6 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">🎰 랜덤 지목</h1>
      <p className="text-gray-500 mb-6">
        룰렛처럼 돌려서 한 명을 뽑고 랜덤 미션을 수행하세요!
      </p>

      <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 rounded-2xl p-6 text-white min-h-[400px]">
        <div className="space-y-6">
          {!spinning && !selected && (
            <>
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">참가자 추가</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addName()}
                    placeholder="이름 입력"
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                  />
                  <button onClick={addName} className="px-4 py-3 bg-pink-500 hover:bg-pink-400 rounded-lg font-bold transition-colors">추가</button>
                </div>
              </div>
              {names.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {names.map((name, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-full text-sm">
                      {name}
                      <button onClick={() => removeName(i)} className="text-gray-400 hover:text-red-400 ml-1">x</button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}

          {(spinning || selected) && (
            <div className="text-center">
              <div className={`text-4xl font-bold py-8 ${spinning ? "text-purple-300 animate-pulse" : "text-yellow-300"}`}>
                {displayName}
              </div>
            </div>
          )}

          {selected && (
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-2xl p-6 text-center">
              <p className="text-sm text-yellow-300 mb-1">미션</p>
              <p className="text-xl font-bold">{mission}</p>
            </div>
          )}

          <button
            onClick={selected ? () => { setSelected(""); setMission(""); setDisplayName(""); } : spin}
            disabled={names.length < 2 || spinning}
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl text-lg font-bold hover:from-pink-400 hover:to-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {spinning ? "돌리는 중..." : selected ? "다시 돌리기" : names.length < 2 ? "최소 2명 필요" : "돌리기!"}
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
        <p className="text-amber-700 text-sm">🍺 음주는 적당히! 건강한 음주 문화를 만들어 갑시다.</p>
        <p className="text-amber-500 text-xs mt-1">19세 미만 음주는 법으로 금지되어 있습니다.</p>
      </div>

      <section className="mt-10 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">랜덤 지목이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            랜덤 지목은 참가자 중 한 명을 무작위로 선택하는 게임입니다.
            룰렛처럼 이름이 빠르게 돌아가다가 한 명이 선택되며,
            선택된 사람에게는 랜덤으로 재미있는 미션이 부여됩니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">게임 규칙</h2>
          <ol className="text-gray-600 text-sm leading-relaxed space-y-2 list-decimal list-inside">
            <li>참가자 이름을 2명 이상 입력합니다.</li>
            <li>&apos;돌리기&apos; 버튼을 누르면 이름이 빠르게 돌아갑니다.</li>
            <li>한 명이 선택되면 랜덤 미션이 함께 표시됩니다.</li>
            <li>선택된 사람이 미션을 수행합니다!</li>
          </ol>
        </div>
      </section>

      <RelatedTools current="random-pick" />
    </div>
  );
}
