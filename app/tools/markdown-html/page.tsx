"use client";

import { useState, useEffect, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

// ── Pure JS Markdown → HTML parser ──────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function markdownToHtml(md: string): string {
  // 1. Extract code blocks and replace with placeholders
  const codeBlocks: string[] = [];
  let text = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang, code) => {
    const idx = codeBlocks.length;
    const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
    codeBlocks.push(
      `<pre><code${langAttr}>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`
    );
    return `%%CODEBLOCK_${idx}%%`;
  });

  // 2. Process block-level elements
  const lines = text.split("\n");
  const output: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      output.push("<hr>");
      i++;
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,4})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      output.push(`<h${level}>${processInline(headerMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    // Table
    if (line.includes("|") && i + 1 < lines.length && /^\|?\s*[-:]+[-|:\s]*$/.test(lines[i + 1])) {
      const tableLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].includes("|")) {
        tableLines.push(lines[j]);
        j++;
      }
      output.push(processTable(tableLines));
      i = j;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      let j = i;
      while (j < lines.length && lines[j].startsWith("> ")) {
        quoteLines.push(lines[j].slice(2));
        j++;
      }
      output.push(
        `<blockquote>${quoteLines.map((l) => processInline(l)).join("<br>")}</blockquote>`
      );
      i = j;
      continue;
    }

    // Unordered list
    if (/^[\-\*]\s+/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^[\-\*]\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^[\-\*]\s+/, ""));
        j++;
      }
      output.push(
        `<ul>${items.map((item) => `<li>${processInline(item)}</li>`).join("")}</ul>`
      );
      i = j;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      let j = i;
      while (j < lines.length && /^\d+\.\s+/.test(lines[j])) {
        items.push(lines[j].replace(/^\d+\.\s+/, ""));
        j++;
      }
      output.push(
        `<ol>${items.map((item) => `<li>${processInline(item)}</li>`).join("")}</ol>`
      );
      i = j;
      continue;
    }

    // Code block placeholder (pass through)
    if (/^%%CODEBLOCK_\d+%%$/.test(line.trim())) {
      output.push(line.trim());
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph – collect consecutive non-empty non-block lines
    {
      const paraLines: string[] = [];
      let j = i;
      while (
        j < lines.length &&
        lines[j].trim() !== "" &&
        !/^#{1,4}\s+/.test(lines[j]) &&
        !/^[\-\*]\s+/.test(lines[j]) &&
        !/^\d+\.\s+/.test(lines[j]) &&
        !lines[j].startsWith("> ") &&
        !/^(-{3,}|\*{3,}|_{3,})\s*$/.test(lines[j]) &&
        !/^%%CODEBLOCK_\d+%%$/.test(lines[j].trim())
      ) {
        paraLines.push(lines[j]);
        j++;
      }
      output.push(`<p>${paraLines.map((l) => processInline(l)).join("<br>")}</p>`);
      i = j;
    }
  }

  // 3. Restore code blocks
  let html = output.join("\n");
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`%%CODEBLOCK_${idx}%%`, block);
  });

  return html;
}

function processInline(text: string): string {
  // Images (before links to avoid conflict)
  text = text.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" />'
  );
  // Links
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  // Inline code (before bold/italic to avoid conflicts inside code)
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Strikethrough
  text = text.replace(/~~(.+?)~~/g, "<del>$1</del>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return text;
}

function processTable(lines: string[]): string {
  const parseRow = (row: string) =>
    row
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

  const headers = parseRow(lines[0]);
  const bodyRows = lines.slice(2).map(parseRow);

  const thead = `<thead><tr>${headers.map((h) => `<th>${processInline(h)}</th>`).join("")}</tr></thead>`;
  const tbody =
    bodyRows.length > 0
      ? `<tbody>${bodyRows.map((row) => `<tr>${row.map((c) => `<td>${processInline(c)}</td>`).join("")}</tr>`).join("")}</tbody>`
      : "";

  return `<table>${thead}${tbody}</table></div>`;
}

// ── Sample Markdown ─────────────────────────────────────────────

const SAMPLE_MARKDOWN = `# 마크다운 변환기에 오신 것을 환영합니다

## 텍스트 서식

이것은 **굵은 텍스트**이고, 이것은 *기울임 텍스트*입니다.
~~취소선~~도 지원합니다.

## 링크와 이미지

[Google 바로가기](https://www.google.com)

![샘플 이미지](https://via.placeholder.com/200x100)

## 코드

인라인 코드: \`console.log("Hello")\`

\`\`\`javascript
function greet(name) {
  return \`안녕하세요, \${name}님!\`;
}
console.log(greet("세계"));
\`\`\`

## 목록

### 순서 없는 목록
- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

### 순서 있는 목록
1. 첫 번째 단계
2. 두 번째 단계
3. 세 번째 단계

## 인용문

> 마크다운은 텍스트 기반의 마크업 언어로,
> 2004년 존 그루버에 의해 만들어졌습니다.

## 표

| 이름 | 나이 | 직업 |
|------|------|------|
| 김철수 | 30 | 개발자 |
| 이영희 | 28 | 디자이너 |
| 박민수 | 35 | 기획자 |

---

#### 이 변환기로 마크다운을 자유롭게 변환해보세요!
`;

// ── Component ───────────────────────────────────────────────────

type Tab = "preview" | "html" | "side";

export default function MarkdownHtmlPage() {
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setHtml(markdownToHtml(markdown));
  }, [markdown]);

  // Real-time conversion
  useEffect(() => {
    convert();
  }, [convert]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Markdown 변환 결과</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.7; color: #1a1a1a; }
h1,h2,h3,h4 { margin-top: 1.5em; margin-bottom: 0.5em; }
pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; }
code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
pre code { background: none; padding: 0; }
blockquote { border-left: 4px solid #ddd; margin: 1em 0; padding: 0.5em 1em; color: #555; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; }
th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
th { background: #f5f5f5; font-weight: 600; }
hr { border: none; border-top: 1px solid #ddd; margin: 2em 0; }
img { max-width: 100%; }
a { color: #2563eb; }
</style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setMarkdown(SAMPLE_MARKDOWN);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "preview", label: "미리보기" },
    { key: "html", label: "HTML 코드" },
    { key: "side", label: "나란히 보기" },
  ];

  // Reusable preview block
  const previewBlock = (
    <div
      className="prose-preview p-5 min-h-[200px] text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  const htmlCodeBlock = (
    <pre className="p-5 text-sm bg-gray-50 overflow-auto min-h-[200px] whitespace-pre-wrap break-words font-mono text-gray-800">
      {html || "변환된 HTML 코드가 여기에 표시됩니다."}
    </pre>
  );

  return (
    <div className="py-4">
      {/* Prose-like styles for preview */}
      <style>{`
        .prose-preview h1 { font-size: 2em; font-weight: 700; margin: 0.8em 0 0.4em; color: #111827; }
        .prose-preview h2 { font-size: 1.5em; font-weight: 700; margin: 0.8em 0 0.4em; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
        .prose-preview h3 { font-size: 1.25em; font-weight: 600; margin: 0.8em 0 0.3em; color: #111827; }
        .prose-preview h4 { font-size: 1.1em; font-weight: 600; margin: 0.6em 0 0.3em; color: #374151; }
        .prose-preview p { margin: 0.6em 0; color: #374151; line-height: 1.75; }
        .prose-preview strong { font-weight: 700; color: #111827; }
        .prose-preview em { font-style: italic; }
        .prose-preview del { text-decoration: line-through; color: #9ca3af; }
        .prose-preview a { color: #2563eb; text-decoration: underline; }
        .prose-preview a:hover { color: #1d4ed8; }
        .prose-preview img { max-width: 100%; border-radius: 8px; margin: 0.5em 0; }
        .prose-preview code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; font-family: 'Courier New', monospace; color: #dc2626; }
        .prose-preview pre { background: #1f2937; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; margin: 1em 0; }
        .prose-preview pre code { background: none; color: inherit; padding: 0; font-size: 0.875em; }
        .prose-preview ul { list-style: disc; padding-left: 1.5em; margin: 0.5em 0; }
        .prose-preview ol { list-style: decimal; padding-left: 1.5em; margin: 0.5em 0; }
        .prose-preview li { margin: 0.25em 0; color: #374151; }
        .prose-preview blockquote { border-left: 4px solid #3b82f6; background: #eff6ff; padding: 0.75em 1em; margin: 1em 0; border-radius: 0 8px 8px 0; color: #1e40af; }
        .prose-preview hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5em 0; }
        .prose-preview table { width: 100%; border-collapse: collapse; margin: 1em 0; }
        .prose-preview th { background: #f3f4f6; font-weight: 600; text-align: left; padding: 8px 12px; border: 1px solid #e5e7eb; }
        .prose-preview td { padding: 8px 12px; border: 1px solid #e5e7eb; }
        .prose-preview tr:nth-child(even) td { background: #f9fafb; }
      `}</style>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Markdown HTML 변환기
      </h1>
      <p className="text-gray-500 mb-8">
        마크다운(Markdown) 텍스트를 입력하면 실시간으로 HTML로 변환합니다.
      </p>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={loadSample}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          샘플 마크다운
        </button>
        <button
          onClick={convert}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          변환하기
        </button>
        <button
          onClick={handleCopy}
          disabled={!html}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {copied ? "복사됨!" : "복사하기"}
        </button>
        <button
          onClick={handleDownload}
          disabled={!html}
          className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          다운로드
        </button>
      </div>

      {/* Editor + Output */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-10">
        {/* Input */}
        <div className="border-b border-gray-200">
          <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            마크다운 입력
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="여기에 마크다운 텍스트를 입력하세요..."
            className="w-full h-64 p-5 text-sm font-mono text-gray-800 resize-y focus:outline-none"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div className="min-h-[200px]">
          {activeTab === "preview" && previewBlock}
          {activeTab === "html" && htmlCodeBlock}
          {activeTab === "side" && (
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
              <div>
                <div className="px-4 py-1.5 bg-gray-50 text-xs font-medium text-gray-400 border-b border-gray-200">
                  미리보기
                </div>
                {previewBlock}
              </div>
              <div>
                <div className="px-4 py-1.5 bg-gray-50 text-xs font-medium text-gray-400 border-b border-gray-200">
                  HTML 코드
                </div>
                {htmlCodeBlock}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── SEO Content ─────────────────────────────────────────── */}

      {/* 마크다운이란? */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          마크다운(Markdown)이란?
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-700 leading-relaxed space-y-3">
          <p>
            마크다운(Markdown)은 2004년 <strong>존 그루버(John Gruber)</strong>가
            만든 경량 마크업 언어입니다. 일반 텍스트로 서식이 있는 문서를 작성할 수
            있으며, HTML로 쉽게 변환할 수 있도록 설계되었습니다.
          </p>
          <p>
            마크다운의 가장 큰 장점은 <strong>가독성</strong>입니다. 특별한
            편집기 없이도 텍스트 파일만으로 제목, 목록, 링크, 이미지, 코드 블록
            등을 직관적으로 작성할 수 있습니다. 이 때문에 개발자, 작가, 블로거 등
            다양한 분야에서 널리 사용되고 있습니다.
          </p>
        </div>
      </section>

      {/* 문법 가이드 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          마크다운 문법 가이드
        </h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-5 py-3 font-semibold text-gray-700">요소</th>
                <th className="px-5 py-3 font-semibold text-gray-700">
                  마크다운 문법
                </th>
                <th className="px-5 py-3 font-semibold text-gray-700">
                  HTML 결과
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              <tr>
                <td className="px-5 py-3">제목</td>
                <td className="px-5 py-3 font-mono text-xs"># 제목</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;h1&gt;제목&lt;/h1&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">굵게</td>
                <td className="px-5 py-3 font-mono text-xs">**텍스트**</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;strong&gt;텍스트&lt;/strong&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">기울임</td>
                <td className="px-5 py-3 font-mono text-xs">*텍스트*</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;em&gt;텍스트&lt;/em&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">취소선</td>
                <td className="px-5 py-3 font-mono text-xs">~~텍스트~~</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;del&gt;텍스트&lt;/del&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">링크</td>
                <td className="px-5 py-3 font-mono text-xs">[텍스트](URL)</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;a href=&quot;URL&quot;&gt;텍스트&lt;/a&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">이미지</td>
                <td className="px-5 py-3 font-mono text-xs">![대체텍스트](URL)</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;img src=&quot;URL&quot; alt=&quot;대체텍스트&quot;&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">인라인 코드</td>
                <td className="px-5 py-3 font-mono text-xs">`코드`</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;code&gt;코드&lt;/code&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">목록</td>
                <td className="px-5 py-3 font-mono text-xs">- 항목</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;ul&gt;&lt;li&gt;항목&lt;/li&gt;&lt;/ul&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">인용</td>
                <td className="px-5 py-3 font-mono text-xs">&gt; 인용문</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;blockquote&gt;인용문&lt;/blockquote&gt;
                </td>
              </tr>
              <tr>
                <td className="px-5 py-3">표</td>
                <td className="px-5 py-3 font-mono text-xs">| 헤더 | 헤더 |</td>
                <td className="px-5 py-3 font-mono text-xs">
                  &lt;table&gt;...&lt;/table&gt;
                </td>
              </tr>
            </tbody>
          </table></div>
        </div>
      </section>

      {/* 활용처 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">마크다운 활용처</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "GitHub",
              desc: "README.md, 이슈, 풀 리퀘스트, 위키 등 거의 모든 곳에서 마크다운을 사용합니다.",
            },
            {
              title: "블로그",
              desc: "Jekyll, Hugo, Gatsby 등 정적 사이트 생성기에서 포스트를 마크다운으로 작성합니다.",
            },
            {
              title: "기술 문서",
              desc: "API 문서, 개발 가이드, 튜토리얼 등 기술 문서 작성에 표준처럼 사용됩니다.",
            },
            {
              title: "노션 / 슬랙",
              desc: "노션, 슬랙, 디스코드 등 생산성 도구에서 마크다운 문법을 지원합니다.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          자주 묻는 질문 (FAQ)
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "마크다운과 HTML의 차이점은 무엇인가요?",
              a: "마크다운은 사람이 읽기 쉬운 간단한 문법을 사용하며, HTML은 웹 브라우저가 이해하는 마크업 언어입니다. 마크다운은 HTML로 변환되어 웹에서 표시됩니다. 마크다운이 훨씬 간결하고 배우기 쉽습니다.",
            },
            {
              q: "GitHub Flavored Markdown(GFM)이란 무엇인가요?",
              a: "GFM은 GitHub에서 확장한 마크다운 문법입니다. 기본 마크다운에 표(Table), 취소선(~~), 작업 목록(체크박스), 자동 URL 링크 등의 기능이 추가되었습니다. 이 변환기는 GFM의 주요 기능을 지원합니다.",
            },
            {
              q: "이 변환기에서 지원하는 마크다운 문법은 무엇인가요?",
              a: "제목(h1~h4), 굵게, 기울임, 취소선, 링크, 이미지, 인라인 코드, 코드 블록, 순서 없는 목록, 순서 있는 목록, 인용문, 수평선, 표(Table)를 지원합니다.",
            },
            {
              q: "변환된 HTML을 어떻게 사용할 수 있나요?",
              a: "복사하기 버튼으로 HTML 코드를 복사하여 웹사이트, 블로그, 이메일 템플릿 등에 붙여넣을 수 있습니다. 다운로드 버튼을 사용하면 완성된 HTML 파일로 저장할 수도 있습니다.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
          <RelatedTools current="markdown-html" />
</div>
  );
}
