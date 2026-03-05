"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

interface Question {
  number: number;
  bgColors: string[];
  numColors: string[];
  options: number[];
  answer: number;
  type: "red-green" | "blue-yellow" | "general";
  typeLabel: string;
}

const questions: Question[] = [
  {
    number: 12,
    bgColors: ["#8B9A6B", "#6B8C5A", "#7A9968", "#5C7A4E", "#9AAB7C"],
    numColors: ["#C4534A", "#B5443B", "#D4645B", "#A3352C", "#E0756C"],
    options: [12, 17, 21, 8],
    answer: 12,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 8,
    bgColors: ["#D4A574", "#C49564", "#E4B584", "#B48554", "#CDA070"],
    numColors: ["#6B8C5A", "#5C7A4E", "#7A9968", "#4D6B3F", "#8BA87A"],
    options: [3, 6, 8, 5],
    answer: 8,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 6,
    bgColors: ["#C4534A", "#B5443B", "#D4645B", "#A3352C", "#CF5F56"],
    numColors: ["#C49564", "#D4A574", "#B48554", "#E4B584", "#CDA070"],
    options: [5, 6, 9, 2],
    answer: 6,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 29,
    bgColors: ["#8B9A6B", "#7A9968", "#6B8C5A", "#9AAB7C", "#5C7A4E"],
    numColors: ["#C4534A", "#D4645B", "#B5443B", "#E0756C", "#A3352C"],
    options: [29, 70, 26, 79],
    answer: 29,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 5,
    bgColors: ["#D4A574", "#C49564", "#E4B584", "#CDA070", "#B48554"],
    numColors: ["#6B7A8C", "#5A6B7A", "#7C8B9A", "#4D5E6F", "#8899AA"],
    options: [3, 5, 2, 8],
    answer: 5,
    type: "blue-yellow",
    typeLabel: "청황색각",
  },
  {
    number: 3,
    bgColors: ["#6B7A8C", "#5A6B7A", "#7C8B9A", "#8899AA", "#4D5E6F"],
    numColors: ["#C49564", "#D4A574", "#B48554", "#E4B584", "#CDA070"],
    options: [3, 8, 5, 9],
    answer: 3,
    type: "blue-yellow",
    typeLabel: "청황색각",
  },
  {
    number: 15,
    bgColors: ["#6B8C5A", "#8B9A6B", "#5C7A4E", "#7A9968", "#9AAB7C"],
    numColors: ["#B5443B", "#C4534A", "#D4645B", "#A3352C", "#CF5F56"],
    options: [15, 17, 12, 51],
    answer: 15,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 74,
    bgColors: ["#C4534A", "#D4645B", "#B5443B", "#CF5F56", "#E0756C"],
    numColors: ["#5C7A4E", "#6B8C5A", "#7A9968", "#4D6B3F", "#8BA87A"],
    options: [21, 74, 71, 47],
    answer: 74,
    type: "red-green",
    typeLabel: "적록색각",
  },
  {
    number: 42,
    bgColors: ["#7A8E6E", "#6A7E5E", "#8A9E7E", "#5A6E4E", "#9AAE8E"],
    numColors: ["#8E6A7A", "#7E5A6A", "#9E7A8A", "#6E4A5A", "#AE8A9A"],
    options: [42, 24, 47, 12],
    answer: 42,
    type: "general",
    typeLabel: "종합",
  },
  {
    number: 7,
    bgColors: ["#6B7A8C", "#7C8B9A", "#5A6B7A", "#8899AA", "#4D5E6F"],
    numColors: ["#8C7A5A", "#9A8B6A", "#7A6B4A", "#AA9B7A", "#6B5C3A"],
    options: [1, 7, 4, 2],
    answer: 7,
    type: "blue-yellow",
    typeLabel: "청황색각",
  },
];

function drawIshiharaPlate(
  canvas: HTMLCanvasElement,
  question: Question
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const size = canvas.width;
  const center = size / 2;
  const radius = size / 2 - 10;

  ctx.clearRect(0, 0, size, size);

  // Generate dot positions using a simple grid + jitter approach
  const dots: { x: number; y: number; r: number; isNum: boolean }[] = [];
  const numStr = question.number.toString();

  // Create a path for the number
  ctx.font = `bold ${size * 0.35}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw number to offscreen position to detect pixels
  const offCanvas = document.createElement("canvas");
  offCanvas.width = size;
  offCanvas.height = size;
  const offCtx = offCanvas.getContext("2d");
  if (!offCtx) return;

  offCtx.fillStyle = "white";
  offCtx.fillRect(0, 0, size, size);
  offCtx.fillStyle = "black";
  offCtx.font = `bold ${size * 0.35}px Arial`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(numStr, center, center);

  const imageData = offCtx.getImageData(0, 0, size, size);

  // Place dots in a grid with randomized positions
  const step = 9;
  for (let x = step; x < size - step; x += step) {
    for (let y = step; y < size - step; y += step) {
      const jx = x + (Math.random() - 0.5) * 5;
      const jy = y + (Math.random() - 0.5) * 5;

      // Check if within circle
      const dist = Math.sqrt((jx - center) ** 2 + (jy - center) ** 2);
      if (dist > radius - 5) continue;

      // Check if on number
      const px = Math.round(jx);
      const py = Math.round(jy);
      const idx = (py * size + px) * 4;
      const isOnNumber = imageData.data[idx] < 128;

      const dotRadius = 3 + Math.random() * 4;
      dots.push({ x: jx, y: jy, r: dotRadius, isNum: isOnNumber });
    }
  }

  // Draw dots
  for (const dot of dots) {
    const colors = dot.isNum ? question.numColors : question.bgColors;
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Add slight brightness variation
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

export default function ColorBlindTest() {
  const [phase, setPhase] = useState<"intro" | "test" | "result">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawPlate = useCallback(() => {
    if (canvasRef.current && phase === "test") {
      drawIshiharaPlate(canvasRef.current, questions[currentQ]);
    }
  }, [currentQ, phase]);

  useEffect(() => {
    drawPlate();
  }, [drawPlate]);

  const handleStart = () => {
    setPhase("test");
    setCurrentQ(0);
    setAnswers([]);
  };

  const handleAnswer = (selected: number) => {
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      setPhase("result");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers, null];
    setAnswers(newAnswers);

    if (currentQ + 1 >= questions.length) {
      setPhase("result");
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const getResult = () => {
    let correct = 0;
    let rgCorrect = 0;
    let rgTotal = 0;
    let byCorrect = 0;
    let byTotal = 0;

    questions.forEach((q, i) => {
      const isCorrect = answers[i] === q.answer;
      if (isCorrect) correct++;

      if (q.type === "red-green") {
        rgTotal++;
        if (isCorrect) rgCorrect++;
      } else if (q.type === "blue-yellow") {
        byTotal++;
        if (isCorrect) byCorrect++;
      }
    });

    let verdict: string;
    let verdictColor: string;
    let detail: string;

    if (correct >= 9) {
      verdict = "정상 색각";
      verdictColor = "text-green-600";
      detail = "색각에 이상이 없는 것으로 보입니다.";
    } else if (correct >= 7) {
      verdict = "경미한 색각 이상 의심";
      verdictColor = "text-yellow-600";
      detail =
        "일부 문제에서 정답을 맞추지 못했습니다. 정밀 검사를 권장합니다.";
    } else {
      verdict = "색각 이상 의심";
      verdictColor = "text-red-600";
      detail = "여러 문제에서 어려움을 겪었습니다. 안과 전문의 상담을 권장합니다.";
    }

    let typeAnalysis = "";
    if (rgTotal > 0 && rgCorrect / rgTotal < 0.6) {
      typeAnalysis = "적록색각 이상이 의심됩니다. ";
    }
    if (byTotal > 0 && byCorrect / byTotal < 0.6) {
      typeAnalysis += "청황색각 이상이 의심됩니다.";
    }

    return {
      correct,
      total: questions.length,
      verdict,
      verdictColor,
      detail,
      typeAnalysis,
      rgCorrect,
      rgTotal,
      byCorrect,
      byTotal,
    };
  };

  if (phase === "intro") {
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          색맹 테스트 (색각 검사)
        </h1>
        <p className="text-gray-500 mb-8">
          이시하라(Ishihara) 스타일의 색각 검사입니다. 원형 점 패턴 안에 숨겨진
          숫자를 찾아보세요.
        </p>

        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">검사 안내</h2>
          <ul className="text-gray-600 space-y-2 text-sm list-disc pl-5">
            <li>총 10문제가 출제됩니다</li>
            <li>각 문제에서 원형 점 패턴 안의 숫자를 찾으세요</li>
            <li>4개의 보기 중 하나를 선택하세요</li>
            <li>숫자가 보이지 않으면 &quot;모르겠어요&quot;를 선택하세요</li>
            <li>적록색맹, 청황색맹 유형별로 분석합니다</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <span className="font-semibold">안내:</span> 이 테스트는 재미 및
            참고 목적으로 제작되었으며, 정확한 의료 진단이 아닙니다. 정확한 색각
            검사는 반드시 안과 전문의를 방문하여 받으시기 바랍니다.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={handleStart}
            className="calc-btn-primary px-8 py-3 text-lg"
          >
            검사 시작하기
          </button>
        </div>

        <section className="mt-12 space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              색맹과 색약이란?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              색맹(Color Blindness)은 특정 색상을 구분하지 못하는 시각 장애입니다.
              완전한 색맹은 드물며, 대부분은 특정 색상의 구분이 어려운 색약(Color
              Deficiency)에 해당합니다. 남성의 약 8%, 여성의 약 0.5%가 색각 이상을
              가지고 있으며, 대부분은 적록색약입니다.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              색각 이상의 종류
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">적록색각 이상</p>
                <p>빨간색과 초록색 계열의 구분이 어려운 유형으로, 가장 흔합니다.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">청황색각 이상</p>
                <p>파란색과 노란색 계열의 구분이 어려운 유형으로, 비교적 드뭅니다.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">전색맹</p>
                <p>모든 색상을 구분하지 못하고 회색 계열로만 보이는 매우 드문 유형입니다.</p>
              </div>
            </div>
          </div>
        </section>

        <RelatedTools current="color-blind-test" />
      </div>
    );
  }

  if (phase === "result") {
    const result = getResult();
    return (
      <div className="py-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          색맹 테스트 결과
        </h1>
        <p className="text-gray-500 mb-8">10문제 검사 결과입니다.</p>

        <div className="calc-card overflow-hidden mb-6">
          <div className="bg-blue-600 text-white p-8 text-center">
            <p className="text-blue-100 text-sm mb-1">검사 결과</p>
            <p className={`text-3xl font-bold mb-2 ${result.verdictColor}`}>
              {result.verdict}
            </p>
            <p className="text-blue-100">
              {result.correct} / {result.total} 문제 정답
            </p>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-gray-600">{result.detail}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">적록색각 문제</p>
                <p className="text-lg font-bold text-gray-900">
                  {result.rgCorrect}/{result.rgTotal}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">청황색각 문제</p>
                <p className="text-lg font-bold text-gray-900">
                  {result.byCorrect}/{result.byTotal}
                </p>
              </div>
            </div>

            {result.typeAnalysis && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700">{result.typeAnalysis}</p>
              </div>
            )}

            <h3 className="font-semibold text-gray-900 mt-4">문제별 결과</h3>
            <div className="space-y-2">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.answer;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-2 rounded text-sm ${
                      isCorrect ? "bg-green-50" : "bg-red-50"
                    }`}
                  >
                    <span className="text-gray-700">
                      {i + 1}번 ({q.typeLabel}) - 정답: {q.answer}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-gray-500">
                        선택: {answers[i] ?? "건너뜀"}
                      </span>
                      <span
                        className={
                          isCorrect ? "text-green-600" : "text-red-600"
                        }
                      >
                        {isCorrect ? "O" : "X"}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 text-sm">
            <span className="font-semibold">안내:</span> 이 결과는 참고용이며
            정확한 의료 진단이 아닙니다. 색각에 이상이 의심되면 반드시 안과
            전문의를 방문하여 정밀 검사를 받으시기 바랍니다.
          </p>
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              setPhase("intro");
              setCurrentQ(0);
              setAnswers([]);
            }}
            className="calc-btn-primary px-8 py-3 text-lg"
          >
            다시 검사하기
          </button>
        </div>

        <RelatedTools current="color-blind-test" />
      </div>
    );
  }

  // Test phase
  const q = questions[currentQ];
  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">색맹 테스트</h1>
        <p className="text-sm text-gray-500">
          {currentQ + 1} / {questions.length}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQ + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div className="calc-card p-6 mb-6">
        <p className="text-center text-gray-700 mb-4 font-medium">
          아래 원 안에 보이는 숫자를 선택하세요
        </p>

        <div className="flex justify-center mb-6">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            className="rounded-full border-4 border-gray-100"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="py-3 px-4 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900 hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="text-center mt-4">
          <button
            onClick={handleSkip}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            모르겠어요 (건너뛰기)
          </button>
        </div>
      </div>
    </div>
  );
}
