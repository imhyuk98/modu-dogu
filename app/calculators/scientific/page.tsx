"use client";

import { useState, useEffect, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

type AngleMode = "DEG" | "RAD";

interface HistoryEntry {
  expression: string;
  result: string;
}

// 함수 호출에서 매칭되는 괄호 내용을 추출하여 치환하는 헬퍼
function replaceFunc(
  str: string,
  funcName: string,
  callback: (inner: string) => string
): string {
  let result = str;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const idx = result.indexOf(funcName + "(");
    if (idx === -1) break;
    // funcName 앞에 알파벳이 있으면 다른 함수의 일부이므로 건너뛰기
    if (idx > 0 && /[a-zA-Z]/.test(result[idx - 1])) {
      // 이 위치를 지나서 다음 매칭을 찾기 위해 임시 치환
      const before = result.slice(0, idx + funcName.length);
      const after = result.slice(idx + funcName.length);
      const subResult = replaceFunc(after, funcName, callback);
      result = before + subResult;
      break;
    }
    const openIdx = idx + funcName.length; // '(' 위치
    let depth = 0;
    let closeIdx = -1;
    for (let i = openIdx; i < result.length; i++) {
      if (result[i] === "(") depth++;
      else if (result[i] === ")") {
        depth--;
        if (depth === 0) {
          closeIdx = i;
          break;
        }
      }
    }
    if (closeIdx === -1) break; // 매칭되는 닫는 괄호 없음
    const inner = result.slice(openIdx + 1, closeIdx);
    const replacement = callback(inner);
    result = result.slice(0, idx) + replacement + result.slice(closeIdx + 1);
  }
  return result;
}

// 안전한 수식 평가 함수
function safeEval(expr: string, angleMode: AngleMode): number {
  // 수식 전처리
  let processed = expr
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/g, `(${Math.PI})`)
    .replace(/(?<!\d\.?)e(?![x\d])/g, `(${Math.E})`);

  // 팩토리얼 처리
  processed = processed.replace(/(\d+)!/g, (_, n) => {
    let result = 1;
    for (let i = 2; i <= parseInt(n); i++) result *= i;
    return String(result);
  });

  // 각도 변환 함수
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const fromRad = (rad: number) => (rad * 180) / Math.PI;

  // 삼각함수 처리 (역순으로 처리 — asin, acos, atan을 먼저)
  if (angleMode === "DEG") {
    processed = replaceFunc(processed, "asin", (v) => `(${fromRad(Math.asin(safeEval(v, angleMode)))})`);
    processed = replaceFunc(processed, "acos", (v) => `(${fromRad(Math.acos(safeEval(v, angleMode)))})`);
    processed = replaceFunc(processed, "atan", (v) => `(${fromRad(Math.atan(safeEval(v, angleMode)))})`);
    processed = replaceFunc(processed, "sin", (v) => `(${Math.sin(toRad(safeEval(v, angleMode)))})`);
    processed = replaceFunc(processed, "cos", (v) => `(${Math.cos(toRad(safeEval(v, angleMode)))})`);
    processed = replaceFunc(processed, "tan", (v) => `(${Math.tan(toRad(safeEval(v, angleMode)))})`);
  } else {
    processed = replaceFunc(processed, "asin", (v) => `(${Math.asin(safeEval(v, angleMode))})`);
    processed = replaceFunc(processed, "acos", (v) => `(${Math.acos(safeEval(v, angleMode))})`);
    processed = replaceFunc(processed, "atan", (v) => `(${Math.atan(safeEval(v, angleMode))})`);
    processed = replaceFunc(processed, "sin", (v) => `(${Math.sin(safeEval(v, angleMode))})`);
    processed = replaceFunc(processed, "cos", (v) => `(${Math.cos(safeEval(v, angleMode))})`);
    processed = replaceFunc(processed, "tan", (v) => `(${Math.tan(safeEval(v, angleMode))})`);
  }

  // 로그/지수 함수 처리
  processed = replaceFunc(processed, "log", (v) => `(${Math.log10(safeEval(v, angleMode))})`);
  processed = replaceFunc(processed, "ln", (v) => `(${Math.log(safeEval(v, angleMode))})`);
  processed = replaceFunc(processed, "sqrt", (v) => `(${Math.sqrt(safeEval(v, angleMode))})`);
  processed = replaceFunc(processed, "cbrt", (v) => `(${Math.cbrt(safeEval(v, angleMode))})`);
  processed = replaceFunc(processed, "abs", (v) => `(${Math.abs(safeEval(v, angleMode))})`);

  // 거듭제곱 처리
  processed = processed.replace(/\^/g, "**");

  // 안전성 검사 — 허용된 문자만
  if (!/^[\d+\-*/().eE **]+$/.test(processed)) {
    throw new Error("Invalid expression");
  }

  // eslint-disable-next-line no-new-func
  const result = new Function(`"use strict"; return (${processed})`)();
  if (typeof result !== "number" || !isFinite(result)) {
    throw new Error("Invalid result");
  }
  return result;
}

function formatResult(num: number): string {
  if (Number.isInteger(num) && Math.abs(num) < 1e15) {
    return num.toLocaleString("ko-KR");
  }
  if (Math.abs(num) < 0.0001 || Math.abs(num) >= 1e15) {
    return num.toExponential(8);
  }
  return parseFloat(num.toPrecision(12)).toLocaleString("ko-KR", {
    maximumFractionDigits: 10,
  });
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showScientific, setShowScientific] = useState(true);
  const [lastCalc, setLastCalc] = useState(false);

  const appendToDisplay = useCallback((value: string) => {
    setResult(null);
    setDisplay((prev) => {
      if (lastCalc && /^[\d.π]/.test(value)) {
        setExpression("");
        setLastCalc(false);
        return value;
      }
      setLastCalc(false);
      if (prev === "0" && value !== "." && !/[+\-×÷]/.test(value)) {
        return value;
      }
      return prev + value;
    });
  }, [lastCalc]);

  const handleClear = () => {
    setDisplay("0");
    setExpression("");
    setResult(null);
    setLastCalc(false);
  };

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    setResult(null);
  };

  const handleCalculate = useCallback(() => {
    try {
      const evalResult = safeEval(display, angleMode);
      const formatted = formatResult(evalResult);
      setExpression(display + " =");
      setResult(formatted);
      setDisplay(String(evalResult));
      setLastCalc(true);
      setHistory((prev) => [
        { expression: display, result: formatted },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setResult("오류");
    }
  }, [display, angleMode]);

  const handleFunction = (func: string) => {
    setResult(null);
    setLastCalc(false);
    setDisplay((prev) => {
      if (prev === "0") return func + "(";
      return prev + func + "(";
    });
  };

  const handleSquare = () => {
    setResult(null);
    setDisplay((prev) => `(${prev})^2`);
  };

  const handleCube = () => {
    setResult(null);
    setDisplay((prev) => `(${prev})^3`);
  };

  const handlePower = () => {
    setResult(null);
    setDisplay((prev) => prev + "^");
  };

  const handlePercent = () => {
    try {
      const val = safeEval(display, angleMode);
      const percentVal = val / 100;
      setDisplay(String(percentVal));
      setResult(formatResult(percentVal));
    } catch {
      setResult("오류");
    }
  };

  const handleNegate = () => {
    setDisplay((prev) => {
      if (prev.startsWith("-")) return prev.slice(1);
      if (prev === "0") return prev;
      return "-" + prev;
    });
  };

  const handleCopy = async () => {
    const text = result || display;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  // 키보드 입력
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (/^[0-9.]$/.test(e.key)) {
        e.preventDefault();
        appendToDisplay(e.key);
      } else if (e.key === "+") {
        e.preventDefault();
        appendToDisplay("+");
      } else if (e.key === "-") {
        e.preventDefault();
        appendToDisplay("-");
      } else if (e.key === "*") {
        e.preventDefault();
        appendToDisplay("×");
      } else if (e.key === "/") {
        e.preventDefault();
        appendToDisplay("÷");
      } else if (e.key === "(" || e.key === ")") {
        e.preventDefault();
        appendToDisplay(e.key);
      } else if (e.key === "^") {
        e.preventDefault();
        handlePower();
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleCalculate();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === "Escape") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [appendToDisplay, handleCalculate]);

  const Btn = ({
    label,
    onClick,
    className = "",
    colSpan,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    colSpan?: number;
  }) => (
    <button
      onClick={onClick}
      className={`py-3 rounded-lg font-medium text-sm transition-all active:scale-95 ${
        colSpan === 2 ? "col-span-2" : ""
      } ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">공학용 계산기</h1>
      <p className="text-gray-500 mb-6">
        삼각함수, 로그, 지수, 팩토리얼 등 공학용 계산을 할 수 있습니다.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6 max-w-md mx-auto">
        {/* 모드 토글 */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setAngleMode(angleMode === "DEG" ? "RAD" : "DEG")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${
                angleMode === "DEG"
                  ? "bg-blue-600 text-white"
                  : "bg-purple-600 text-white"
              }`}
            >
              {angleMode}
            </button>
            <button
              onClick={() => setShowScientific(!showScientific)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              {showScientific ? "기본" : "공학"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              이력 {showHistory ? "▲" : "▼"}
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="결과 복사"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>

        {/* 이력 패널 */}
        {showHistory && (
          <div className="px-4 pb-2 max-h-40 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">계산 이력이 없습니다.</p>
            ) : (
              history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDisplay(h.expression);
                    setResult(h.result);
                    setShowHistory(false);
                  }}
                  className="w-full text-right py-1 hover:bg-gray-50 rounded px-2 transition-colors"
                >
                  <div className="text-xs text-gray-400">{h.expression}</div>
                  <div className="text-sm font-medium text-gray-700">= {h.result}</div>
                </button>
              ))
            )}
          </div>
        )}

        {/* 디스플레이 */}
        <div className="px-4 py-4 bg-gray-50 border-y border-gray-100">
          <div className="text-right">
            <div className="text-sm text-gray-400 h-5 overflow-hidden">{expression}</div>
            <div
              className={`font-mono font-bold break-all ${
                result
                  ? "text-2xl text-gray-900"
                  : "text-2xl text-gray-700"
              }`}
            >
              {result || display}
            </div>
          </div>
        </div>

        {/* 공학 버튼 */}
        {showScientific && (
          <div className="grid grid-cols-5 gap-1 px-3 pt-3">
            <Btn label="sin" onClick={() => handleFunction("sin")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />
            <Btn label="cos" onClick={() => handleFunction("cos")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />
            <Btn label="tan" onClick={() => handleFunction("tan")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />
            <Btn label="π" onClick={() => appendToDisplay("π")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />
            <Btn label="e" onClick={() => appendToDisplay("e")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />

            <Btn label="asin" onClick={() => handleFunction("asin")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs" />
            <Btn label="acos" onClick={() => handleFunction("acos")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs" />
            <Btn label="atan" onClick={() => handleFunction("atan")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs" />
            <Btn label="x!" onClick={() => appendToDisplay("!")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />
            <Btn label="|x|" onClick={() => handleFunction("abs")} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100" />

            <Btn label="log" onClick={() => handleFunction("log")} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="ln" onClick={() => handleFunction("ln")} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="√" onClick={() => handleFunction("sqrt")} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="³√" onClick={() => handleFunction("cbrt")} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="xⁿ" onClick={handlePower} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />

            <Btn label="x²" onClick={handleSquare} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="x³" onClick={handleCube} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="10ˣ" onClick={() => { setDisplay((p) => `10^(${p})`); }} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="eˣ" onClick={() => { setDisplay((p) => `e^(${p})`); }} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
            <Btn label="%" onClick={handlePercent} className="bg-violet-50 text-violet-700 hover:bg-violet-100" />
          </div>
        )}

        {/* 기본 버튼 */}
        <div className="grid grid-cols-4 gap-1 p-3">
          <Btn label="AC" onClick={handleClear} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold" />
          <Btn label="( )" onClick={() => {
            const open = (display.match(/\(/g) || []).length;
            const close = (display.match(/\)/g) || []).length;
            appendToDisplay(open > close ? ")" : "(");
          }} className="bg-gray-100 text-gray-700 hover:bg-gray-200" />
          <Btn label="⌫" onClick={handleBackspace} className="bg-gray-100 text-gray-700 hover:bg-gray-200" />
          <Btn label="÷" onClick={() => appendToDisplay("÷")} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-lg" />

          <Btn label="7" onClick={() => appendToDisplay("7")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="8" onClick={() => appendToDisplay("8")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="9" onClick={() => appendToDisplay("9")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="×" onClick={() => appendToDisplay("×")} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-lg" />

          <Btn label="4" onClick={() => appendToDisplay("4")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="5" onClick={() => appendToDisplay("5")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="6" onClick={() => appendToDisplay("6")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="-" onClick={() => appendToDisplay("-")} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-lg" />

          <Btn label="1" onClick={() => appendToDisplay("1")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="2" onClick={() => appendToDisplay("2")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="3" onClick={() => appendToDisplay("3")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="+" onClick={() => appendToDisplay("+")} className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-bold text-lg" />

          <Btn label="±" onClick={handleNegate} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="0" onClick={() => appendToDisplay("0")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="." onClick={() => appendToDisplay(".")} className="bg-white text-gray-900 hover:bg-gray-50 border border-gray-200" />
          <Btn label="=" onClick={handleCalculate} className="bg-blue-600 text-white hover:bg-blue-700 font-bold text-lg" />
        </div>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">공학용 계산기 사용법</h2>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">기본 연산</h3>
            <p>
              사칙연산(+, -, ×, ÷)과 괄호를 사용하여 복잡한 수식을 계산할 수 있습니다.
              키보드로도 입력이 가능합니다 (숫자, +, -, *, /, Enter, Backspace, Esc).
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">삼각함수</h3>
            <p>
              sin, cos, tan과 역삼각함수(asin, acos, atan)를 지원합니다.
              DEG(도) 모드와 RAD(라디안) 모드를 전환할 수 있습니다.
              예: DEG 모드에서 sin(30) = 0.5
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">로그 및 지수</h3>
            <p>
              log(상용로그), ln(자연로그), √(제곱근), ³√(세제곱근),
              x²(제곱), x³(세제곱), xⁿ(거듭제곱), 10ˣ, eˣ를 지원합니다.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">상수 및 특수 기능</h3>
            <p>
              원주율 π(3.14159...)와 자연상수 e(2.71828...)를 바로 입력할 수 있습니다.
              팩토리얼(x!)과 절댓값(|x|) 계산도 지원합니다.
              계산 이력은 최근 10개까지 저장되며, 클릭하면 다시 불러올 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools current="scientific" />
    </div>
  );
}
