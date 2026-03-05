"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

// 자음 획수
const CHOSUNG_STROKES: Record<number, number> = {
  0: 2, // ㄱ
  1: 4, // ㄲ
  2: 2, // ㄴ
  3: 3, // ㄷ
  4: 6, // ㄸ
  5: 5, // ㄹ
  6: 4, // ㅁ
  7: 4, // ㅂ
  8: 8, // ㅃ
  9: 2, // ㅅ
  10: 4, // ㅆ
  11: 1, // ㅇ
  12: 3, // ㅈ
  13: 6, // ㅉ
  14: 4, // ㅊ
  15: 3, // ㅋ
  16: 4, // ㅌ
  17: 4, // ㅍ
  18: 3, // ㅎ
};

// 모음 획수
const JUNGSUNG_STROKES: Record<number, number> = {
  0: 2, // ㅏ
  1: 3, // ㅐ
  2: 3, // ㅑ
  3: 4, // ㅒ
  4: 2, // ㅓ
  5: 3, // ㅔ
  6: 3, // ㅕ
  7: 4, // ㅖ
  8: 2, // ㅗ
  9: 4, // ㅘ
  10: 5, // ㅙ
  11: 3, // ㅚ
  12: 3, // ㅛ
  13: 2, // ㅜ
  14: 4, // ㅝ
  15: 5, // ㅞ
  16: 3, // ㅟ
  17: 3, // ㅠ
  18: 1, // ㅡ
  19: 2, // ㅢ
  20: 1, // ㅣ
};

// 종성 획수 (0 = 없음)
const JONGSUNG_STROKES: Record<number, number> = {
  0: 0,  // 없음
  1: 2,  // ㄱ
  2: 4,  // ㄲ
  3: 4,  // ㄳ
  4: 2,  // ㄴ
  5: 5,  // ㄵ
  6: 5,  // ㄶ
  7: 3,  // ㄷ
  8: 5,  // ㄹ
  9: 7,  // ㄺ
  10: 9, // ㄻ
  11: 9, // ㄼ
  12: 7, // ㄽ
  13: 9, // ㄾ
  14: 9, // ㄿ
  15: 8, // ㅀ
  16: 4, // ㅁ
  17: 4, // ㅂ
  18: 6, // ㅄ
  19: 2, // ㅅ
  20: 4, // ㅆ
  21: 1, // ㅇ
  22: 3, // ㅈ
  23: 4, // ㅊ
  24: 3, // ㅋ
  25: 4, // ㅌ
  26: 4, // ㅍ
  27: 3, // ㅎ
};

function getCharStrokes(char: string): number {
  const code = char.charCodeAt(0);
  // 한글 범위 체크
  if (code < 0xAC00 || code > 0xD7A3) return 0;

  const offset = code - 0xAC00;
  const chosung = Math.floor(offset / (21 * 28));
  const jungsung = Math.floor((offset % (21 * 28)) / 28);
  const jongsung = offset % 28;

  return (
    (CHOSUNG_STROKES[chosung] || 0) +
    (JUNGSUNG_STROKES[jungsung] || 0) +
    (JONGSUNG_STROKES[jongsung] || 0)
  );
}

function getNameStrokes(name: string): number[] {
  return Array.from(name).map(getCharStrokes);
}

function interleaveNames(name1: string, name2: string): string[] {
  const chars1 = Array.from(name1);
  const chars2 = Array.from(name2);
  const maxLen = Math.max(chars1.length, chars2.length);
  const result: string[] = [];

  for (let i = 0; i < maxLen; i++) {
    if (i < chars1.length) result.push(chars1[i]);
    if (i < chars2.length) result.push(chars2[i]);
  }

  return result;
}

interface CompatibilityResult {
  interleaved: string[];
  pyramid: number[][];
  percentage: number;
  comment: string;
}

function calculateNameCompatibility(name1: string, name2: string): CompatibilityResult {
  const interleaved = interleaveNames(name1, name2);
  const strokeNumbers = interleaved.map(getCharStrokes);

  // Build pyramid
  const pyramid: number[][] = [strokeNumbers];
  let current = strokeNumbers;

  while (current.length > 2) {
    const next: number[] = [];
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10);
    }
    pyramid.push(next);
    current = next;
  }

  const percentage = current.length === 2
    ? current[0] * 10 + current[1]
    : current[0];

  let comment: string;
  if (percentage >= 90) {
    comment = "운명적인 인연! 전생에 부부였을지도 모릅니다. 최고의 궁합이에요!";
  } else if (percentage >= 80) {
    comment = "정말 잘 어울리는 두 사람! 서로에게 최고의 파트너가 될 수 있어요.";
  } else if (percentage >= 70) {
    comment = "꽤 좋은 궁합이에요! 함께하면 행복한 시간이 많을 거예요.";
  } else if (percentage >= 60) {
    comment = "괜찮은 궁합! 서로 노력하면 더 좋은 관계가 될 수 있어요.";
  } else if (percentage >= 50) {
    comment = "보통의 궁합이에요. 서로를 이해하려는 노력이 중요합니다.";
  } else if (percentage >= 40) {
    comment = "조금 아쉬운 궁합이지만, 노력하면 충분히 좋아질 수 있어요!";
  } else if (percentage >= 30) {
    comment = "쉽지 않은 궁합이지만, 사랑은 궁합을 뛰어넘을 수 있답니다.";
  } else if (percentage >= 20) {
    comment = "도전적인 궁합! 하지만 극과 극은 통한다는 말도 있잖아요.";
  } else {
    comment = "궁합 점수는 낮지만, 진정한 사랑 앞에 궁합은 숫자일 뿐이에요!";
  }

  return { interleaved, pyramid, percentage, comment };
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export default function NameCompatibilityPage() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    const text = `[이름 궁합] ${name1.trim()} + ${name2.trim()} = ${result.percentage}%\n${result.comment}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  const handleCalculate = () => {
    const trimmed1 = name1.trim();
    const trimmed2 = name2.trim();
    if (!trimmed1 || !trimmed2) return;

    // Filter only Korean characters
    const korean1 = trimmed1.replace(/[^가-힣]/g, "");
    const korean2 = trimmed2.replace(/[^가-힣]/g, "");
    if (!korean1 || !korean2) return;

    setShowAnimation(true);
    setTimeout(() => {
      setResult(calculateNameCompatibility(korean1, korean2));
      setShowAnimation(false);
    }, 800);
  };

  const handleReset = () => {
    setName1("");
    setName2("");
    setResult(null);
  };

  const heartColor = result
    ? result.percentage >= 70
      ? "text-red-500"
      : result.percentage >= 40
      ? "text-pink-400"
      : "text-pink-300"
    : "text-pink-400";

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">이름 궁합 계산기</h1>
      <p className="text-gray-500 mb-8">
        두 사람의 이름을 입력하면 한글 획수를 기반으로 궁합을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 1
            </label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 홍길동"
              maxLength={10}
              className="calc-input calc-input-lg text-center"
            />
          </div>

          <HeartIcon className={`w-8 h-8 ${heartColor} mt-6 sm:mt-6 shrink-0 animate-pulse`} />

          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 2
            </label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="예: 김철수"
              maxLength={10}
              className="calc-input calc-input-lg text-center"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleCalculate}
            disabled={!name1.trim() || !name2.trim()}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {showAnimation ? "계산 중..." : "궁합 보기"}
          </button>
          <button
            onClick={handleReset}
            className="calc-btn-secondary"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div className="calc-card overflow-hidden mb-8">
          {/* 궁합 퍼센트 */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 p-8 text-center relative overflow-hidden">
            {/* 배경 하트 데코 */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
              {[...Array(6)].map((_, i) => (
                <HeartIcon
                  key={i}
                  className={`absolute text-red-500 ${
                    i % 2 === 0 ? "w-8 h-8" : "w-6 h-6"
                  }`}
                />
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-lg font-bold text-pink-700">{name1.trim()}</span>
                <HeartIcon className="w-6 h-6 text-red-500" />
                <span className="text-lg font-bold text-pink-700">{name2.trim()}</span>
              </div>

              <div className="relative w-36 h-36 mx-auto mb-4">
                <HeartIcon className={`w-full h-full ${heartColor} drop-shadow-lg`} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white drop-shadow-md mt-2">
                    {result.percentage}%
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-pink-300 rounded hover:bg-pink-100 transition-colors text-pink-600 mb-2"
              >
                {copied ? "복사됨!" : "복사"}
              </button>

              <p className="text-gray-700 font-medium">{result.comment}</p>
            </div>
          </div>

          {/* 피라미드 계산 과정 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">계산 과정</h3>

            {/* 교차 배치된 이름 */}
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">교차 배치:</p>
              <div className="flex justify-center gap-1 flex-wrap">
                {result.interleaved.map((char, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-semibold ${
                      i % 2 === 0
                        ? "bg-pink-100 text-pink-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* 숫자 피라미드 */}
            <div className="space-y-1.5 overflow-x-auto">
              {result.pyramid.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-1">
                  {row.map((num, colIndex) => (
                    <span
                      key={colIndex}
                      className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-mono font-bold ${
                        rowIndex === result.pyramid.length - 1
                          ? "bg-red-500 text-white text-sm w-8 h-8"
                          : rowIndex === 0
                          ? "bg-pink-100 text-pink-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 text-center mt-3">
              인접한 두 수를 더한 일의 자리를 반복하여 최종 2자리 = 궁합 퍼센트
            </p>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이름 궁합 계산기란?</h2>
          <p className="text-gray-600 leading-relaxed">
            이름 궁합 계산기는 두 사람의 이름을 한글 획수로 분석하여 궁합 퍼센트를
            계산하는 재미있는 도구입니다. 한글의 각 자음과 모음을 분리한 후 획수를
            더하고, 두 이름을 교차로 배치하여 인접한 수의 합을 반복하는 방식으로
            최종 궁합 퍼센트를 구합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">계산 원리</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            한글은 유니코드 구조상 초성(자음), 중성(모음), 종성(받침)으로 분리할 수
            있습니다. 각 자모에 지정된 획수를 모두 더하면 한 글자의 총 획수가 됩니다.
            두 이름의 글자를 교차 배치(홍김길철동수)한 뒤, 인접한 두 획수를 더하여
            일의 자리만 남기는 과정을 반복하면 최종 두 자리 숫자가 궁합 퍼센트가 됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">한글이 아닌 이름도 계산할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                이 계산기는 한글 획수를 기반으로 하므로, 한글 이름만 정확하게 계산됩니다.
                영어나 숫자가 포함된 경우 한글 부분만 추출하여 계산합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">이름 순서를 바꾸면 결과가 달라지나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 이름을 교차 배치하는 순서가 달라지므로 결과가 달라질 수 있습니다.
                양쪽 모두 해보고 높은 점수를 참고하세요!
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">궁합 결과는 정확한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                이름 궁합은 과학적 근거가 있는 것이 아니라 재미로 즐기는 놀이입니다.
                결과에 너무 의미를 두지 말고 가볍게 즐겨주세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="name-compatibility" />
    </div>
  );
}
