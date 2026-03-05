"use client";

import { useState, useMemo, useRef } from "react";
import RelatedTools from "@/components/RelatedTools";

interface CharStats {
  totalChars: number;
  charsNoSpaces: number;
  words: number;
  sentences: number;
  lines: number;
  bytesUtf8: number;
  bytesEucKr: number;
}

function calculateStats(text: string): CharStats {
  const totalChars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const words = text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
  const sentences = text
    .split(/[.!?]+/)
    .filter((s) => s.trim().length > 0).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const bytesUtf8 = new TextEncoder().encode(text).length;

  // EUC-KR approximate: Korean chars = 2 bytes, ASCII = 1 byte, other = 3 bytes
  let bytesEucKr = 0;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code <= 0x7f) {
      bytesEucKr += 1;
    } else if (
      (code >= 0xac00 && code <= 0xd7a3) || // 한글 완성형
      (code >= 0x3131 && code <= 0x318e) || // 한글 자모
      (code >= 0x1100 && code <= 0x11ff) // 한글 자모 확장
    ) {
      bytesEucKr += 2;
    } else {
      bytesEucKr += 2; // CJK and other multi-byte
    }
  }

  return { totalChars, charsNoSpaces, words, sentences, lines, bytesUtf8, bytesEucKr };
}

const QUICK_LIMITS = [
  { label: "트위터 (280)", value: 280 },
  { label: "인스타 (2,200)", value: 2200 },
  { label: "블로그 제목 (40)", value: 40 },
  { label: "메타 설명 (160)", value: 160 },
];

export default function CharacterCountPage() {
  const [text, setText] = useState("");
  const [charLimit, setCharLimit] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => calculateStats(text), [text]);
  const limit = parseInt(charLimit, 10);
  const hasLimit = !isNaN(limit) && limit > 0;
  const remaining = hasLimit ? limit - stats.totalChars : 0;
  const progress = hasLimit ? Math.min((stats.totalChars / limit) * 100, 100) : 0;

  const handleClear = () => {
    setText("");
    textareaRef.current?.focus();
  };

  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    }
  };

  const handleCopyResult = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 1500);
    }
  };

  const statCards = [
    { label: "총 글자수 (공백 포함)", value: stats.totalChars },
    { label: "글자수 (공백 제외)", value: stats.charsNoSpaces },
    { label: "단어 수", value: stats.words },
    { label: "문장 수", value: stats.sentences },
    { label: "줄 수", value: stats.lines },
    { label: "바이트 (UTF-8)", value: stats.bytesUtf8 },
    { label: "바이트 (EUC-KR)", value: stats.bytesEucKr },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">글자수 세기</h1>
      <p className="text-gray-500 mb-8">
        텍스트를 입력하면 글자수, 단어수, 바이트 수를 실시간으로 계산합니다.
      </p>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className="calc-card p-4 text-center relative group"
          >
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl font-bold text-blue-600">
                {card.value.toLocaleString("ko-KR")}
              </p>
              {idx === 0 && (
                <button
                  onClick={() => handleCopyResult(`${card.value.toLocaleString("ko-KR")}자`)}
                  className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                  title="복사"
                >
                  {copiedText ? "복사됨!" : "복사"}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* 텍스트 입력 */}
      <div className="calc-card p-6 mb-6">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 텍스트를 입력하세요..."
          className="w-full min-h-[200px] px-4 py-3 border border-gray-300 rounded-lg text-base leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />

        {/* 버튼 */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleClear}
            className="calc-btn-secondary"
          >
            초기화
          </button>
          <button
            onClick={handleCopy}
            className="calc-btn-primary"
          >
            {copiedText ? "복사됨!" : "복사하기"}
          </button>
        </div>
      </div>

      {/* 글자수 제한 체크 */}
      <div className="calc-card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-3">글자수 제한 체크</h2>
        <div className="flex gap-3 items-center mb-4">
          <input
            type="number"
            value={charLimit}
            onChange={(e) => setCharLimit(e.target.value)}
            placeholder="최대 글자수 입력"
            className="flex-1 calc-input"
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">자</span>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {QUICK_LIMITS.map((item) => (
            <button
              key={item.value}
              onClick={() => setCharLimit(String(item.value))}
              className={`px-3 py-1.5 text-sm border rounded-full transition-colors ${
                charLimit === String(item.value)
                  ? "bg-blue-50 border-blue-300 text-blue-700"
                  : "border-gray-200 hover:bg-blue-50 hover:border-blue-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 진행 바 */}
        {hasLimit && (
          <div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  remaining < 0
                    ? "bg-red-500"
                    : remaining <= limit * 0.1
                    ? "bg-yellow-500"
                    : "bg-blue-500"
                }`}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-gray-500">
                {stats.totalChars.toLocaleString("ko-KR")} / {limit.toLocaleString("ko-KR")}자
              </span>
              <span
                className={`font-medium ${
                  remaining < 0 ? "text-red-500" : "text-gray-700"
                }`}
              >
                {remaining >= 0
                  ? `${remaining.toLocaleString("ko-KR")}자 남음`
                  : `${Math.abs(remaining).toLocaleString("ko-KR")}자 초과`}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            글자수 세기가 필요한 경우
          </h2>
          <p className="text-gray-600 leading-relaxed">
            글자수 세기는 다양한 상황에서 필수적으로 사용됩니다. 대학교
            자기소개서나 입사 지원서에는 500자, 1000자 등 글자수 제한이 있으며,
            SNS 게시물(트위터 280자, 인스타그램 2,200자)에도 글자수 제한이
            적용됩니다. 논문 초록, 메타 태그(title 60자, description 160자), SMS
            문자(70자/장), 카카오톡 메시지 등 정확한 글자수 관리가 필요한 곳에서
            유용하게 활용할 수 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            SNS별 글자수 제한
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    플랫폼
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    글자수 제한
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    비고
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    트위터 (X)
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    280자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    한글도 1자로 계산
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    인스타그램
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    2,200자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    캡션 기준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    페이스북
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    63,206자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    게시물 기준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    카카오톡
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    10,000자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    일반 메시지 기준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    네이버 블로그 제목
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    40자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    검색 노출 기준
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">
                    유튜브 제목
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    100자
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    권장 70자 이내
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            바이트와 글자수의 차이
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            글자수와 바이트 수는 다른 개념입니다. 영어 알파벳과 숫자는 어떤
            인코딩에서든 1바이트이지만, 한글은 인코딩 방식에 따라 바이트 수가
            달라집니다.
          </p>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    인코딩
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    한글 1자
                  </th>
                  <th className="text-right py-2 px-3 border border-gray-200">
                    영문 1자
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    사용처
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">UTF-8</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    3바이트
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    1바이트
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    웹 표준, 최신 시스템
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">EUC-KR</td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    2바이트
                  </td>
                  <td className="text-right py-2 px-3 border border-gray-200">
                    1바이트
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    레거시 시스템, SMS
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
          <p className="text-gray-600 leading-relaxed mt-3">
            예를 들어 &quot;안녕하세요&quot;는 5글자이지만, UTF-8에서는 15바이트,
            EUC-KR에서는 10바이트입니다. SMS 전송이나 데이터베이스 필드 크기를
            계산할 때는 바이트 수를 확인해야 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                공백도 글자수에 포함되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                일반적으로 글자수 세기에서 공백 포함 여부는 상황에 따라
                다릅니다. 자기소개서나 논문에서는 보통 &quot;공백 포함&quot;
                글자수를 기준으로 하지만, 일부 공모전이나 SNS에서는 &quot;공백
                제외&quot; 글자수를 사용합니다. 본 도구에서는 두 가지 모두
                표시하므로 필요에 맞게 확인하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                이모지는 몇 글자로 카운트되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                이모지는 종류에 따라 다릅니다. 기본 이모지(예: &#x1F600;)는
                JavaScript에서 2글자(서로게이트 쌍)로 계산되며, 복합 이모지(예:
                &#x1F468;&#x200D;&#x1F469;&#x200D;&#x1F467;)는 더 많은 글자수를
                차지합니다. 트위터 등 일부 플랫폼에서는 이모지를 2자로
                계산합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                한글 초성(ㄱ, ㄴ, ㄷ)도 1글자인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 한글 초성(ㄱ, ㄴ, ㄷ 등)과 모음(ㅏ, ㅓ, ㅗ 등)도 각각
                1글자로 계산됩니다. 바이트 수로는 UTF-8에서 3바이트, EUC-KR에서
                2바이트입니다. 완성형 한글(&quot;가&quot;, &quot;나&quot;)과
                동일한 바이트 수를 차지합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                엔터(줄바꿈)도 글자수에 포함되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 엔터(줄바꿈 문자)도 글자수에 포함됩니다. 줄바꿈은 눈에
                보이지 않지만 실제로는 문자(\n)이기 때문입니다. &quot;공백
                포함&quot; 글자수에는 포함되며, &quot;공백 제외&quot;
                글자수에서는 제외됩니다. 정확한 글자수가 필요할 때는 이 점을
                유의하세요.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="character-count" />
</div>
  );
}
