"use client";

import { useState } from "react";
import RelatedTools from "@/components/RelatedTools";

type Mode = "csv-to-json" | "json-to-csv";
type Delimiter = "," | "\t" | ";" | "|";

const SAMPLE_CSV = `이름,나이,직업,도시
김민수,28,개발자,서울
이영희,35,디자이너,부산
박철수,42,매니저,대전
정수진,31,마케터,인천`;

const SAMPLE_JSON = `[
  { "이름": "김민수", "나이": 28, "직업": "개발자", "도시": "서울" },
  { "이름": "이영희", "나이": 35, "직업": "디자이너", "도시": "부산" },
  { "이름": "박철수", "나이": 42, "직업": "매니저", "도시": "대전" },
  { "이름": "정수진", "나이": 31, "직업": "마케터", "도시": "인천" }
]`;

function parseCSVLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        fields.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

function csvToJson(
  csv: string,
  delimiter: string,
  useHeader: boolean
): string {
  const lines = csv
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
  if (lines.length === 0) throw new Error("CSV 데이터가 비어있습니다.");

  const rows = lines.map((line) => parseCSVLine(line, delimiter));

  if (useHeader) {
    if (rows.length < 2)
      throw new Error("헤더와 최소 1개의 데이터 행이 필요합니다.");
    const headers = rows[0].map((h) => h.trim());
    const data = rows.slice(1).map((row) => {
      const obj: Record<string, string | number> = {};
      headers.forEach((header, i) => {
        const val = (row[i] ?? "").trim();
        const num = Number(val);
        obj[header] = val !== "" && !isNaN(num) ? num : val;
      });
      return obj;
    });
    return JSON.stringify(data, null, 2);
  } else {
    return JSON.stringify(rows, null, 2);
  }
}

function jsonToCsv(json: string, delimiter: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data)) throw new Error("JSON은 배열 형태여야 합니다.");
  if (data.length === 0) throw new Error("JSON 배열이 비어있습니다.");

  const allKeys = Array.from(
    new Set(data.flatMap((item: Record<string, unknown>) => Object.keys(item)))
  );

  const escapeField = (value: unknown): string => {
    const str = value === null || value === undefined ? "" : String(value);
    if (
      str.includes(delimiter) ||
      str.includes('"') ||
      str.includes("\n") ||
      str.includes("\r")
    ) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = allKeys.map(escapeField).join(delimiter);
  const dataLines = data.map((item: Record<string, unknown>) =>
    allKeys.map((key) => escapeField(item[key])).join(delimiter)
  );

  return [headerLine, ...dataLines].join("\n");
}

const DELIMITER_OPTIONS: { value: Delimiter; label: string }[] = [
  { value: ",", label: "쉼표 (,)" },
  { value: "\t", label: "탭 (\\t)" },
  { value: ";", label: "세미콜론 (;)" },
  { value: "|", label: "파이프 (|)" },
];

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<Mode>("csv-to-json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [useHeader, setUseHeader] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setOutput("");
    try {
      if (!input.trim()) {
        setError("변환할 데이터를 입력해주세요.");
        return;
      }
      if (mode === "csv-to-json") {
        setOutput(csvToJson(input, delimiter, useHeader));
      } else {
        setOutput(jsonToCsv(input, delimiter));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "변환 중 오류가 발생했습니다.");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("클립보드 복사에 실패했습니다.");
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const isJson = mode === "csv-to-json";
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isJson ? "data.json" : "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSample = () => {
    setError("");
    setOutput("");
    if (mode === "csv-to-json") {
      setInput(SAMPLE_CSV);
    } else {
      setInput(SAMPLE_JSON);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        CSV JSON 변환기
      </h1>
      <p className="text-gray-500 mb-8">
        CSV 데이터를 JSON으로, JSON 데이터를 CSV로 간편하게 변환합니다.
      </p>

      {/* 모드 토글 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => handleModeChange("csv-to-json")}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            mode === "csv-to-json"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          CSV → JSON
        </button>
        <button
          onClick={() => handleModeChange("json-to-csv")}
          className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            mode === "json-to-csv"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          JSON → CSV
        </button>
      </div>

      {/* 옵션 */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              구분자:
            </label>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as Delimiter)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {DELIMITER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {mode === "csv-to-json" && (
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useHeader}
                onChange={(e) => setUseHeader(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              첫 번째 행을 헤더로 사용
            </label>
          )}
          <button
            onClick={handleSample}
            className="ml-auto px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
          >
            샘플 데이터
          </button>
        </div>
      </div>

      {/* 입출력 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* 입력 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {mode === "csv-to-json" ? "CSV 입력" : "JSON 입력"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "csv-to-json"
                ? "CSV 데이터를 여기에 붙여넣으세요..."
                : "JSON 데이터를 여기에 붙여넣으세요..."
            }
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 출력 */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              {mode === "csv-to-json" ? "JSON 출력" : "CSV 출력"}
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!output}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  output
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                }`}
              >
                {copied ? "복사됨!" : "복사하기"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!output}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  output
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-gray-50 text-gray-300 cursor-not-allowed"
                }`}
              >
                다운로드
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="변환 결과가 여기에 표시됩니다..."
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono resize-y bg-gray-50 focus:outline-none"
          />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* 변환 버튼 */}
      <div className="flex justify-center mb-12">
        <button
          onClick={handleConvert}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-base"
        >
          변환하기
        </button>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            CSV와 JSON이란?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            <strong>CSV (Comma-Separated Values)</strong>는 쉼표로 구분된 텍스트
            파일 형식으로, 스프레드시트나 데이터베이스에서 데이터를 저장하고
            교환하는 데 널리 사용됩니다. 엑셀, 구글 스프레드시트 등에서 쉽게
            열 수 있어 비개발자도 친숙한 형식입니다.
          </p>
          <p className="text-gray-600 leading-relaxed">
            <strong>JSON (JavaScript Object Notation)</strong>은 키-값 쌍으로
            이루어진 경량 데이터 교환 형식입니다. 웹 API, 설정 파일,
            NoSQL 데이터베이스 등에서 표준처럼 사용되며 중첩 구조를 지원하여
            복잡한 데이터를 표현할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            CSV와 JSON 비교
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    항목
                  </th>
                  <th className="text-center py-2 px-3 border border-gray-200">
                    CSV
                  </th>
                  <th className="text-center py-2 px-3 border border-gray-200">
                    JSON
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    가독성
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    표 형태로 직관적
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    구조화된 트리 형태
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    구조
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    2차원 (행/열)
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    다차원 (중첩 가능)
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    주요 용도
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    스프레드시트, 데이터 분석
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    웹 API, 설정 파일
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    파일 크기
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    상대적으로 작음
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    키 이름 반복으로 큼
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    중첩 데이터 지원
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    미지원
                  </td>
                  <td className="py-2 px-3 border border-gray-200 text-center">
                    지원 (배열, 객체)
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            활용 사례
          </h2>
          <div className="space-y-3 text-gray-600">
            <div>
              <h3 className="font-medium text-gray-900">
                데이터베이스 마이그레이션
              </h3>
              <p className="text-sm mt-1">
                기존 시스템에서 CSV로 내보낸 데이터를 JSON으로 변환하여
                MongoDB 등 NoSQL 데이터베이스에 가져올 수 있습니다. 반대로
                NoSQL에서 추출한 JSON 데이터를 CSV로 변환해 엑셀에서 분석할
                수도 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">API 데이터 변환</h3>
              <p className="text-sm mt-1">
                REST API에서 받은 JSON 응답 데이터를 CSV로 변환하면
                스프레드시트에서 쉽게 열어 보거나 보고서를 만들 수 있습니다.
                반대로 CSV 데이터를 JSON으로 변환해 API에 전송할 수도 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                엑셀에서 웹 애플리케이션으로
              </h3>
              <p className="text-sm mt-1">
                엑셀이나 구글 스프레드시트에서 관리하던 데이터를 CSV로 내보낸 뒤
                JSON으로 변환하면 웹 애플리케이션에서 바로 활용할 수 있습니다.
                설정 파일, 초기 데이터 세팅 등에 유용합니다.
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
                한글 데이터가 깨지지 않나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 도구는 브라우저에서 직접 변환을 수행하므로 UTF-8 인코딩을
                기본으로 사용합니다. 한글 데이터가 깨질 걱정 없이 사용할 수
                있으며, 다운로드 파일도 UTF-8로 저장됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                대용량 파일도 변환할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                브라우저 메모리 한도 내에서 변환이 가능합니다. 일반적으로 수만 행
                수준의 데이터는 문제없이 처리할 수 있습니다. 매우 큰 파일(수십
                MB 이상)의 경우 전문 데이터 처리 도구를 사용하는 것을
                권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                중첩된 JSON도 CSV로 변환되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 도구는 1단계 깊이의 JSON 객체 배열을 CSV로 변환합니다. 중첩된
                객체나 배열이 포함된 경우 해당 값은 문자열로 변환됩니다. 복잡한
                중첩 구조의 경우 먼저 JSON을 평탄화(flatten)한 뒤 변환하는 것을
                권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                변환된 CSV를 엑셀에서 바로 열 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 다운로드한 CSV 파일을 엑셀에서 바로 열 수 있습니다. 다만
                엑셀에서 CSV를 열 때 인코딩 문제가 발생하면 &quot;데이터
                가져오기&quot; 기능을 사용하여 UTF-8 인코딩을 직접 지정해주세요.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="csv-json" />
</div>
  );
}
