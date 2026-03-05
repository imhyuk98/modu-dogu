"use client";

import { useState, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

type Mode = "range" | "multiple" | "lotto";

interface HistoryEntry {
  id: number;
  label: string;
  numbers: number[];
  bonus?: number;
}

function getLottoBallColor(n: number): string {
  if (n <= 10) return "bg-yellow-400 text-yellow-900";
  if (n <= 20) return "bg-blue-500 text-white";
  if (n <= 30) return "bg-red-500 text-white";
  if (n <= 40) return "bg-gray-500 text-white";
  return "bg-green-500 text-white";
}

function LottoBall({ number, size = "normal" }: { number: number; size?: "normal" | "small" }) {
  const sizeClass = size === "small" ? "w-9 h-9 text-sm" : "w-12 h-12 text-lg";
  return (
    <span
      className={`${sizeClass} rounded-full ${getLottoBallColor(number)} font-bold inline-flex items-center justify-center shadow-md`}
    >
      {number}
    </span>
  );
}

export default function RandomNumberGenerator() {
  const historyIdRef = useRef(0);
  const [mode, setMode] = useState<Mode>("range");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copied, setCopied] = useState(false);

  // Range mode
  const [rangeMin, setRangeMin] = useState("1");
  const [rangeMax, setRangeMax] = useState("100");
  const [rangeResult, setRangeResult] = useState<number | null>(null);

  // Multiple mode
  const [multiMin, setMultiMin] = useState("1");
  const [multiMax, setMultiMax] = useState("100");
  const [multiCount, setMultiCount] = useState("5");
  const [multiAllowDupes, setMultiAllowDupes] = useState(false);
  const [multiResult, setMultiResult] = useState<number[]>([]);

  // Lotto mode
  const [lottoNumbers, setLottoNumbers] = useState<number[]>([]);
  const [lottoBonus, setLottoBonus] = useState<number | null>(null);

  const addHistory = (label: string, numbers: number[], bonus?: number) => {
    historyIdRef.current++;
    setHistory((prev) => [{ id: historyIdRef.current, label, numbers, bonus }, ...prev].slice(0, 5));
  };

  const generateRange = () => {
    const min = parseInt(rangeMin, 10);
    const max = parseInt(rangeMax, 10);
    if (isNaN(min) || isNaN(max) || min > max) return;
    const result = Math.floor(Math.random() * (max - min + 1)) + min;
    setRangeResult(result);
    addHistory(`${min}~${max}`, [result]);
  };

  const generateMultiple = () => {
    const min = parseInt(multiMin, 10);
    const max = parseInt(multiMax, 10);
    const count = parseInt(multiCount, 10);
    if (isNaN(min) || isNaN(max) || isNaN(count) || min > max || count < 1) return;
    if (!multiAllowDupes && count > max - min + 1) return;

    const results: number[] = [];
    if (multiAllowDupes) {
      for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * (max - min + 1)) + min);
      }
    } else {
      const pool: number[] = [];
      for (let i = min; i <= max; i++) pool.push(i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      results.push(...pool.slice(0, count));
    }
    results.sort((a, b) => a - b);
    setMultiResult(results);
    addHistory(`${min}~${max} (${count}개)`, results);
  };

  const generateLotto = () => {
    const pool: number[] = [];
    for (let i = 1; i <= 45; i++) pool.push(i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const main = pool.slice(0, 6).sort((a, b) => a - b);
    const bonus = pool[6];
    setLottoNumbers(main);
    setLottoBonus(bonus);
    addHistory("로또", main, bonus);
  };

  const getCurrentResultText = (): string => {
    if (mode === "range" && rangeResult !== null) return String(rangeResult);
    if (mode === "multiple" && multiResult.length > 0) return multiResult.join(", ");
    if (mode === "lotto" && lottoNumbers.length > 0)
      return `${lottoNumbers.join(", ")} + 보너스 ${lottoBonus}`;
    return "";
  };

  const handleCopy = () => {
    const text = getCurrentResultText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const tabs: { key: Mode; label: string }[] = [
    { key: "range", label: "숫자 범위" },
    { key: "multiple", label: "여러 개 뽑기" },
    { key: "lotto", label: "로또 번호" },
  ];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        랜덤 숫자 생성기
      </h1>
      <p className="text-gray-500 mb-8">
        숫자 범위 지정, 여러 개 뽑기, 로또 번호 자동 생성까지 다양한 랜덤 숫자를 만들어 보세요.
      </p>

      {/* 탭 */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 모드1: 숫자 범위 */}
      {mode === "range" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최소값
              </label>
              <input
                type="number"
                value={rangeMin}
                onChange={(e) => setRangeMin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최대값
              </label>
              <input
                type="number"
                value={rangeMax}
                onChange={(e) => setRangeMax(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={generateRange}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            생성하기
          </button>

          {rangeResult !== null && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-2">결과</p>
              <p className="text-6xl font-bold text-blue-600 animate-bounce">
                {rangeResult}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 모드2: 여러 개 뽑기 */}
      {mode === "multiple" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최소값
              </label>
              <input
                type="number"
                value={multiMin}
                onChange={(e) => setMultiMin(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최대값
              </label>
              <input
                type="number"
                value={multiMax}
                onChange={(e) => setMultiMax(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                개수
              </label>
              <input
                type="number"
                value={multiCount}
                onChange={(e) => setMultiCount(e.target.value)}
                min={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setMultiAllowDupes(!multiAllowDupes)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                multiAllowDupes ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  multiAllowDupes ? "translate-x-6" : ""
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">중복 허용</span>
          </div>

          <button
            onClick={generateMultiple}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            생성하기
          </button>

          {multiResult.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 mb-3">결과</p>
              <div className="flex flex-wrap justify-center gap-2">
                {multiResult.map((n, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-700 font-bold text-lg rounded-xl shadow-sm"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 모드3: 로또 */}
      {mode === "lotto" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="text-center mb-4">
            <p className="text-gray-600 mb-4">
              1~45 중 6개의 번호와 보너스 번호 1개를 자동으로 생성합니다.
            </p>
            <button
              onClick={generateLotto}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              로또 번호 생성
            </button>
          </div>

          {lottoNumbers.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {lottoNumbers.map((n, i) => (
                  <LottoBall key={i} number={n} />
                ))}
                <span className="text-2xl text-gray-400 mx-1">+</span>
                {lottoBonus !== null && <LottoBall number={lottoBonus} />}
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                마지막 번호는 보너스 번호입니다
              </p>

              {/* 색상 범례 */}
              <div className="flex flex-wrap justify-center gap-3 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" />{" "}
                  1~10
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />{" "}
                  11~20
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />{" "}
                  21~30
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-gray-500 inline-block" />{" "}
                  31~40
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />{" "}
                  41~45
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 복사 버튼 */}
      {getCurrentResultText() && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleCopy}
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium border border-gray-200"
          >
            {copied ? "복사 완료!" : "결과 복사하기"}
          </button>
        </div>
      )}

      {/* 히스토리 */}
      {history.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>&#x1F4CB;</span> 최근 기록
          </h3>
          <div className="space-y-2">
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 py-2 px-3 bg-gray-50 rounded-lg text-sm"
              >
                <span className="text-gray-400 font-mono text-xs shrink-0">
                  {entry.label}
                </span>
                <span className="text-gray-300">|</span>
                {entry.label === "로또" ? (
                  <div className="flex items-center gap-1 flex-wrap">
                    {entry.numbers.map((n, i) => (
                      <LottoBall key={i} number={n} size="small" />
                    ))}
                    {entry.bonus !== undefined && (
                      <>
                        <span className="text-gray-400 mx-0.5">+</span>
                        <LottoBall number={entry.bonus} size="small" />
                      </>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-700 font-medium">
                    {entry.numbers.join(", ")}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            랜덤 숫자 생성기란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            랜덤 숫자 생성기는 지정된 범위 내에서 무작위 숫자를 생성하는
            도구입니다. 추첨, 게임, 통계 샘플링, 로또 번호 선택 등 다양한
            상황에서 공정한 무작위 선택이 필요할 때 사용할 수 있습니다.
            브라우저의 Math.random()을 활용하여 숫자를 생성합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            기능 안내
          </h2>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-1">숫자 범위</h3>
              <p className="text-sm text-blue-700">
                최소값과 최대값을 지정하면 그 범위 안에서 랜덤 숫자 1개를
                생성합니다. 동전 던지기(1~2), 주사위(1~6) 등에 활용하세요.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-1">
                여러 개 뽑기
              </h3>
              <p className="text-sm text-green-700">
                범위와 개수를 지정하여 여러 숫자를 한번에 생성합니다. 중복
                허용/불가 옵션으로 추첨이나 팀 배정에 활용하세요.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-1">
                로또 번호
              </h3>
              <p className="text-sm text-yellow-700">
                1~45 중 중복 없이 6개의 번호와 보너스 번호 1개를 자동으로
                생성합니다. 실제 로또 추첨 방식과 동일합니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                생성된 숫자는 정말 랜덤인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                브라우저의 Math.random() 함수를 사용하여 의사 난수를
                생성합니다. 일상적인 용도(추첨, 게임 등)에는 충분히
                무작위하지만, 암호학적 보안이 필요한 용도에는 적합하지
                않습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                로또 번호를 여러 세트 생성할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, &quot;로또 번호 생성&quot; 버튼을 여러 번 클릭하면 됩니다. 최근 5개의
                결과가 히스토리에 기록되므로 이전 번호도 확인할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                중복 불가 모드에서 범위보다 많은 개수를 입력하면?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                예를 들어 1~10 범위에서 중복 불가로 15개를 생성하려 하면,
                생성할 수 없습니다. 범위 내의 숫자 개수 이하로 입력해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="random-number" />
    </div>
  );
}
