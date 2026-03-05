"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

type Mode = "encode" | "decode";

function encodeBase64(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decodeBase64(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

export default function Base64Tool() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [realtime, setRealtime] = useState(false);
  const [copied, setCopied] = useState(false);

  const convert = useCallback(
    (text: string, currentMode: Mode) => {
      setError("");
      if (!text.trim()) {
        setOutput("");
        return;
      }
      try {
        if (currentMode === "encode") {
          setOutput(encodeBase64(text));
        } else {
          setOutput(decodeBase64(text));
        }
      } catch {
        setOutput("");
        setError(
          currentMode === "decode"
            ? "유효하지 않은 Base64 문자열입니다. 입력을 확인해주세요."
            : "변환 중 오류가 발생했습니다."
        );
      }
    },
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (realtime) {
      convert(value, mode);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
  };

  const handleConvert = () => {
    convert(input, mode);
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

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        Base64 인코더/디코더
      </h1>
      <p className="text-gray-500 mb-8">
        텍스트를 Base64로 인코딩하거나 Base64 문자열을 원본 텍스트로 디코딩합니다.
      </p>

      {/* 도구 영역 */}
      <div className="calc-card p-6 mb-6">
        {/* 모드 선택 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleModeChange("encode")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              mode === "encode"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            인코딩
          </button>
          <button
            onClick={() => handleModeChange("decode")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              mode === "decode"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            디코딩
          </button>
        </div>

        {/* 실시간 변환 옵션 */}
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={realtime}
            onChange={(e) => {
              setRealtime(e.target.checked);
              if (e.target.checked && input.trim()) {
                convert(input, mode);
              }
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            실시간 변환 (입력 시 자동 변환)
          </span>
        </label>

        {/* 입력 */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "encode" ? "원본 텍스트" : "Base64 문자열"}
        </label>
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder={
            mode === "encode"
              ? "인코딩할 텍스트를 입력하세요"
              : "디코딩할 Base64 문자열을 입력하세요"
          }
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />

        {/* 버튼 영역 */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleConvert}
            className="calc-btn-primary"
          >
            변환하기
          </button>
          <button
            onClick={handleClear}
            className="calc-btn-secondary"
          >
            지우기
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* 출력 */}
        {output && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                {mode === "encode" ? "Base64 결과" : "디코딩 결과"}
              </label>
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
              >
                {copied ? "복사됨!" : "복사하기"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono bg-gray-50 focus:outline-none resize-y"
            />
          </div>
        )}
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Base64란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Base64는 바이너리 데이터를 텍스트(ASCII)로 변환하는 인코딩 방식입니다.
            이메일 전송, 웹 통신 등에서 바이너리 데이터를 안전하게 전달하기 위해
            널리 사용됩니다. &quot;Base64&quot;라는 이름은 64개의 출력 문자(A-Z, a-z,
            0-9, +, /)를 사용하는 데서 유래했습니다. 인코딩된 결과는 원본보다 약
            33% 더 커지지만, 텍스트 기반 프로토콜에서 안전하게 전송할 수 있다는
            장점이 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Base64 활용 사례
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    활용 분야
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    설명
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    이메일 첨부파일
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    MIME 표준에서 이메일 첨부파일을 텍스트로 변환하여 전송합니다.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    데이터 URI
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    HTML/CSS에서 이미지를 Base64로 인코딩하여 직접 삽입할 수 있습니다
                    (예: data:image/png;base64,...).
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    API 인증 헤더
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    HTTP Basic Authentication에서 사용자명:비밀번호를 Base64로
                    인코딩하여 Authorization 헤더에 포함합니다.
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    JWT 토큰
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    JSON Web Token의 헤더와 페이로드가 Base64url로 인코딩되어
                    전달됩니다.
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Base64 인코딩 원리
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Base64 인코딩은 입력 데이터를 6비트 단위로 나누어 변환합니다. 원본
            데이터의 각 바이트(8비트)를 3바이트(24비트)씩 묶은 뒤, 이를 4개의
            6비트 그룹으로 나눕니다. 각 6비트 값(0~63)은 Base64 문자 테이블에서
            대응하는 문자로 변환됩니다.
          </p>
          <p className="text-gray-600 leading-relaxed mb-3">
            입력 데이터의 길이가 3의 배수가 아닌 경우, 부족한 바이트만큼
            패딩 문자(&quot;=&quot;)가 결과 끝에 추가됩니다.
            예를 들어 1바이트 입력은 &quot;==&quot;, 2바이트 입력은 &quot;=&quot;
            하나가 패딩으로 붙습니다.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm font-mono text-gray-700">
            <p className="mb-1">
              예시: &quot;Hi&quot; (2바이트)
            </p>
            <p className="mb-1">
              H(72) = 01001000, i(105) = 01101001
            </p>
            <p className="mb-1">
              6비트 분할: 010010 | 000110 | 1001(00) → S, G, k
            </p>
            <p>
              결과: &quot;SGk=&quot; (패딩 1개)
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                Base64는 암호화인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                아닙니다. Base64는 인코딩 방식으로, 누구나 쉽게 디코딩할 수
                있습니다. 보안 목적으로 사용해서는 안 되며, 데이터를 텍스트
                형식으로 안전하게 전달하기 위한 수단입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Base64로 인코딩하면 크기가 얼마나 커지나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Base64 인코딩 결과는 원본 데이터보다 약 33% 커집니다. 3바이트의
                원본 데이터가 4개의 Base64 문자(4바이트)로 변환되기 때문입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                한글도 Base64로 인코딩할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 가능합니다. 본 도구는 UTF-8 인코딩을 사용하여 한글을 포함한
                모든 유니코드 문자를 Base64로 변환할 수 있습니다. 한글은 한
                글자당 3바이트의 UTF-8 데이터로 변환된 후 Base64 인코딩됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                Base64와 Base64url의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                표준 Base64는 &quot;+&quot;와 &quot;/&quot; 문자를 사용하지만,
                URL에서 이 문자들은 특수한 의미를 가집니다. Base64url은
                &quot;+&quot;를 &quot;-&quot;로, &quot;/&quot;를 &quot;_&quot;로
                대체하고 패딩(&quot;=&quot;)을 생략하여 URL에서 안전하게 사용할 수
                있도록 합니다. JWT 등에서 주로 사용됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="base64" />
</div>
  );
}
