"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

const SAMPLE_JSON = {
  name: "홍길동",
  age: 30,
  email: "hong@example.com",
  address: {
    city: "서울특별시",
    district: "강남구",
    zipCode: "06000",
  },
  hobbies: ["독서", "등산", "코딩"],
  isActive: true,
  score: null,
};

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tabSize, setTabSize] = useState<number>(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setValidationMessage("");
  };

  const handleBeautify = () => {
    clearMessages();
    if (!input.trim()) {
      setError("JSON 데이터를 입력해주세요.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, tabSize));
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(`유효하지 않은 JSON입니다: ${message}`);
      setOutput("");
    }
  };

  const handleMinify = () => {
    clearMessages();
    if (!input.trim()) {
      setError("JSON 데이터를 입력해주세요.");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(`유효하지 않은 JSON입니다: ${message}`);
      setOutput("");
    }
  };

  const handleValidate = () => {
    clearMessages();
    if (!input.trim()) {
      setError("JSON 데이터를 입력해주세요.");
      return;
    }
    try {
      JSON.parse(input);
      setValidationMessage("유효한 JSON입니다.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "알 수 없는 오류";
      setError(`유효하지 않은 JSON입니다: ${message}`);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = output;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLoadSample = () => {
    clearMessages();
    setInput(JSON.stringify(SAMPLE_JSON, null, 2));
    setOutput("");
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">JSON 포매터</h1>
      <p className="text-gray-500 mb-8">
        JSON 데이터를 보기 좋게 정리하거나, 유효성을 검증하고, 미니파이(압축)할
        수 있습니다.
      </p>

      {/* 도구 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* 버튼 영역 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            onClick={handleBeautify}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            정리하기 (Beautify)
          </button>
          <button
            onClick={handleMinify}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            미니파이 (Minify)
          </button>
          <button
            onClick={handleValidate}
            className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            검증하기 (Validate)
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <label className="text-sm text-gray-600">들여쓰기:</label>
            <select
              value={tabSize}
              onChange={(e) => setTabSize(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2}>2칸</option>
              <option value={4}>4칸</option>
            </select>
          </div>

          <button
            onClick={handleLoadSample}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            샘플 JSON
          </button>
        </div>

        {/* 에러/성공 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        {validationMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {validationMessage}
          </div>
        )}

        {/* 텍스트 영역 (데스크탑: 좌우, 모바일: 상하) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 입력 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              입력 (Input)
            </label>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                clearMessages();
              }}
              placeholder='{"key": "value"}'
              className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>

          {/* 출력 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                출력 (Output)
              </label>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  output
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-400 cursor-not-allowed"
                }`}
              >
                {copied ? "복사됨!" : "복사하기"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="결과가 여기에 표시됩니다"
              className="w-full h-80 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm resize-y bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            JSON이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            JSON(JavaScript Object Notation)은 데이터를 저장하고 전송하기 위한
            경량 텍스트 기반 데이터 형식입니다. 사람이 읽고 쓰기 쉽고, 기계가
            파싱하고 생성하기도 쉬운 것이 특징입니다. 원래 JavaScript에서
            유래했지만, 현재는 프로그래밍 언어에 독립적이며 Python, Java, PHP, Go
            등 거의 모든 프로그래밍 언어에서 지원됩니다. 웹 API의 표준 데이터
            교환 형식으로 널리 사용되고 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            JSON 포매터 활용법
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-medium text-gray-900">API 개발 및 테스트</h3>
              <p className="text-sm mt-1">
                REST API에서 응답으로 받은 JSON 데이터는 보통 압축된
                형태입니다. 포매터를 사용하면 들여쓰기와 줄바꿈이 적용되어
                데이터 구조를 한눈에 파악할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">디버깅</h3>
              <p className="text-sm mt-1">
                복잡한 JSON 데이터에서 오류를 찾을 때 포맷된 형태가 훨씬
                효율적입니다. 검증 기능을 활용하면 문법 오류의 위치도 빠르게
                파악할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">설정 파일 관리</h3>
              <p className="text-sm mt-1">
                package.json, tsconfig.json 등 설정 파일을 편집할 때 포매터를
                사용하면 가독성이 좋아져 실수를 줄일 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                데이터 전송 최적화
              </h3>
              <p className="text-sm mt-1">
                미니파이(압축) 기능을 사용하면 불필요한 공백과 줄바꿈이
                제거되어 데이터 크기가 줄어듭니다. 네트워크 전송량을 절약하고
                싶을 때 유용합니다.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            JSON 문법 규칙
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <div>
              <h3 className="font-medium text-gray-900">
                Key-Value 구조
              </h3>
              <p className="text-sm mt-1">
                JSON 객체는 중괄호({"{}"}) 안에 &quot;키&quot;:
                &quot;값&quot; 쌍으로 구성됩니다. 키는 반드시 큰따옴표로
                감싸야 하며, 작은따옴표는 사용할 수 없습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">데이터 타입</h3>
              <p className="text-sm mt-1">
                JSON에서 사용할 수 있는 데이터 타입은 문자열(string),
                숫자(number), 불리언(boolean), null, 배열(array),
                객체(object)의 6가지입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">주의사항</h3>
              <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                <li>마지막 항목 뒤에 쉼표(trailing comma)를 넣으면 안 됩니다.</li>
                <li>주석(comment)은 지원되지 않습니다.</li>
                <li>
                  문자열 값에서 특수문자는 백슬래시(\)로 이스케이프해야 합니다.
                </li>
                <li>숫자는 따옴표 없이 작성합니다 (예: 42, 3.14).</li>
                <li>
                  undefined는 JSON에서 지원되지 않으며, null을 사용해야 합니다.
                </li>
              </ul>
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
                JSON과 JavaScript 객체의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                JSON은 텍스트 기반 데이터 형식이고, JavaScript 객체는 프로그래밍
                언어의 데이터 구조입니다. JSON에서는 키를 반드시 큰따옴표로
                감싸야 하고, 함수나 undefined를 값으로 사용할 수 없습니다.
                JavaScript 객체는 이러한 제한이 없습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                JSON 포매터를 사용하면 데이터가 서버로 전송되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                아닙니다. 이 도구는 브라우저에서 JavaScript로 직접 처리하므로
                입력한 JSON 데이터가 외부 서버로 전송되지 않습니다. 안심하고
                사용하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                미니파이(Minify)는 언제 사용하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                API 응답 데이터의 크기를 줄여 네트워크 대역폭을 절약하거나,
                설정 파일의 용량을 최소화하고 싶을 때 사용합니다. 포맷된
                JSON에서 모든 공백과 줄바꿈을 제거하여 한 줄로 압축합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                JSON 검증에서 오류가 나면 어떻게 해야 하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                오류 메시지에 표시된 위치를 확인하세요. 흔한 실수로는 마지막
                항목 뒤의 불필요한 쉼표, 큰따옴표 대신 작은따옴표 사용, 닫는
                괄호 누락 등이 있습니다. 오류를 수정한 후 다시 검증해보세요.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="json-formatter" />
</div>
  );
}
