"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Tab = "simplify" | "proportion" | "aspect";
type UnknownPosition = "A" | "B" | "C" | "D";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

export default function RatioCalculator() {
  const [activeTab, setActiveTab] = useState<Tab>("simplify");
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // Tab 1: 비율 단순화
  const [simplifyA, setSimplifyA] = useState("1920");
  const [simplifyB, setSimplifyB] = useState("1080");

  // Tab 2: 비례식 풀기
  const [unknown, setUnknown] = useState<UnknownPosition>("D");
  const [propA, setPropA] = useState("3");
  const [propB, setPropB] = useState("5");
  const [propC, setPropC] = useState("12");
  const [propD, setPropD] = useState("");

  // Tab 3: 화면 비율
  const [aspectW, setAspectW] = useState("1920");
  const [aspectH, setAspectH] = useState("1080");

  const tabs: { key: Tab; label: string }[] = [
    { key: "simplify", label: "비율 단순화" },
    { key: "proportion", label: "비례식 풀기" },
    { key: "aspect", label: "화면 비율 계산" },
  ];

  // ── Tab 1 결과 ──
  const simplifyResult = useMemo(() => {
    const a = parseFloat(simplifyA);
    const b = parseFloat(simplifyB);
    if (!a || !b || a <= 0 || b <= 0) return null;
    const g = gcd(a, b);
    return { a: a / g, b: b / g };
  }, [simplifyA, simplifyB]);

  // ── Tab 2 결과 ──
  const proportionResult = useMemo(() => {
    const vals = { A: propA, B: propB, C: propC, D: propD };
    const known = Object.entries(vals)
      .filter(([k]) => k !== unknown)
      .map(([, v]) => parseFloat(v));
    if (known.some((v) => isNaN(v) || v === 0)) return null;

    const a = unknown === "A" ? 0 : parseFloat(propA);
    const b = unknown === "B" ? 0 : parseFloat(propB);
    const c = unknown === "C" ? 0 : parseFloat(propC);
    const d = unknown === "D" ? 0 : parseFloat(propD);

    let result: number;
    let formula: string;
    let steps: string;

    // A : B = C : D  →  A×D = B×C
    switch (unknown) {
      case "A":
        result = (b * c) / d;
        formula = "A = B × C ÷ D";
        steps = `A = ${formatNum(b)} × ${formatNum(c)} ÷ ${formatNum(d)} = ${formatNum(result)}`;
        break;
      case "B":
        result = (a * d) / c;
        formula = "B = A × D ÷ C";
        steps = `B = ${formatNum(a)} × ${formatNum(d)} ÷ ${formatNum(c)} = ${formatNum(result)}`;
        break;
      case "C":
        result = (a * d) / b;
        formula = "C = A × D ÷ B";
        steps = `C = ${formatNum(a)} × ${formatNum(d)} ÷ ${formatNum(b)} = ${formatNum(result)}`;
        break;
      case "D":
      default:
        result = (b * c) / a;
        formula = "D = B × C ÷ A";
        steps = `D = ${formatNum(b)} × ${formatNum(c)} ÷ ${formatNum(a)} = ${formatNum(result)}`;
        break;
    }

    return { result, formula, steps };
  }, [unknown, propA, propB, propC, propD]);

  // ── Tab 3 결과 ──
  const aspectResult = useMemo(() => {
    const w = parseInt(aspectW, 10);
    const h = parseInt(aspectH, 10);
    if (!w || !h || w <= 0 || h <= 0) return null;
    const g = gcd(w, h);
    return { ratioW: w / g, ratioH: h / g, width: w, height: h };
  }, [aspectW, aspectH]);

  const presets = [
    { label: "FHD (1920×1080)", w: 1920, h: 1080 },
    { label: "QHD (2560×1440)", w: 2560, h: 1440 },
    { label: "4K (3840×2160)", w: 3840, h: 2160 },
    { label: "모바일 (1080×1920)", w: 1080, h: 1920 },
    { label: "옛날 (1024×768)", w: 1024, h: 768 },
  ];

  function handleSwapAspect() {
    setAspectW(aspectH);
    setAspectH(aspectW);
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">비율 계산기</h1>
      <p className="text-gray-500 mb-8">
        비율 단순화, 비례식 풀기, 화면 비율 계산을 간편하게 할 수 있습니다.
      </p>

      {/* 탭 */}
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ Tab 1: 비율 단순화 ══════════ */}
      {activeTab === "simplify" && (
        <div className="calc-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            비율 단순화
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            두 수를 입력하면 최대공약수(GCD)로 나누어 가장 간단한 비율로
            변환합니다.
          </p>

          <div className="flex items-center gap-3">
            <input
              type="number"
              value={simplifyA}
              onChange={(e) => setSimplifyA(e.target.value)}
              placeholder="예: 1920"
              className="flex-1 calc-input calc-input-lg text-center"
            />
            <span className="text-xl font-bold text-gray-400">:</span>
            <input
              type="number"
              value={simplifyB}
              onChange={(e) => setSimplifyB(e.target.value)}
              placeholder="예: 1080"
              className="flex-1 calc-input calc-input-lg text-center"
            />
          </div>
          <div className="mt-4">
            <button onClick={() => { setSimplifyA(""); setSimplifyB(""); }}
              className="calc-btn-secondary">
              초기화
            </button>
          </div>

          {simplifyResult && (
            <div className="mt-6 bg-blue-50 rounded-lg p-5 text-center">
              <p className="text-sm text-blue-600 mb-1">단순화된 비율</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-blue-700">
                  {formatNum(simplifyResult.a)} : {formatNum(simplifyResult.b)}
                </p>
                <button
                  onClick={() => handleCopy(`${formatNum(simplifyResult.a)} : ${formatNum(simplifyResult.b)}`)}
                  className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                  title="복사"
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                최대공약수(GCD):{" "}
                {formatNum(
                  gcd(parseFloat(simplifyA), parseFloat(simplifyB))
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ══════════ Tab 2: 비례식 풀기 ══════════ */}
      {activeTab === "proportion" && (
        <div className="calc-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            비례식 풀기
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            A : B = C : D 에서 미지수 하나를 선택하고 나머지 세 값을 입력하세요.
          </p>

          {/* 미지수 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              미지수 위치 선택
            </label>
            <div className="flex gap-2">
              {(["A", "B", "C", "D"] as UnknownPosition[]).map((pos) => (
                <button
                  key={pos}
                  onClick={() => setUnknown(pos)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    unknown === pos
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {pos} = ?
                </button>
              ))}
            </div>
          </div>

          {/* 입력 필드 */}
          <div className="mb-4">
            <button onClick={() => { setPropA(""); setPropB(""); setPropC(""); setPropD(""); setUnknown("D"); }}
              className="calc-btn-secondary">
              초기화
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <PropInput
              label="A"
              value={propA}
              onChange={setPropA}
              disabled={unknown === "A"}
              isUnknown={unknown === "A"}
            />
            <span className="text-xl font-bold text-gray-400">:</span>
            <PropInput
              label="B"
              value={propB}
              onChange={setPropB}
              disabled={unknown === "B"}
              isUnknown={unknown === "B"}
            />
            <span className="text-xl font-bold text-gray-400">=</span>
            <PropInput
              label="C"
              value={propC}
              onChange={setPropC}
              disabled={unknown === "C"}
              isUnknown={unknown === "C"}
            />
            <span className="text-xl font-bold text-gray-400">:</span>
            <PropInput
              label="D"
              value={propD}
              onChange={setPropD}
              disabled={unknown === "D"}
              isUnknown={unknown === "D"}
            />
          </div>

          {proportionResult && (
            <div className="mt-6 bg-blue-50 rounded-lg p-5">
              <p className="text-sm text-blue-600 mb-1">결과</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-blue-700">
                  {unknown} = {formatNum(proportionResult.result)}
                </p>
                <button
                  onClick={() => handleCopy(`${unknown} = ${formatNum(proportionResult.result)}`)}
                  className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                  title="복사"
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">공식:</span>{" "}
                  {proportionResult.formula}
                </p>
                <p>
                  <span className="font-medium">풀이:</span>{" "}
                  {proportionResult.steps}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════ Tab 3: 화면 비율 계산 ══════════ */}
      {activeTab === "aspect" && (
        <div className="calc-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            화면 비율 계산
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            가로와 세로 픽셀을 입력하면 화면 비율(종횡비)을 계산합니다.
          </p>

          {/* 프리셋 버튼 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => {
                  setAspectW(String(p.w));
                  setAspectH(String(p.h));
                }}
                className="calc-preset"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* 입력 */}
          <div className="mb-4">
            <button onClick={() => { setAspectW(""); setAspectH(""); }}
              className="calc-btn-secondary">
              초기화
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">
                가로 (px)
              </label>
              <input
                type="number"
                value={aspectW}
                onChange={(e) => setAspectW(e.target.value)}
                placeholder="1920"
                className="calc-input calc-input-lg text-center"
              />
            </div>
            <button
              onClick={handleSwapAspect}
              className="mt-5 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              title="가로 세로 뒤집기"
            >
              뒤집기
            </button>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">
                세로 (px)
              </label>
              <input
                type="number"
                value={aspectH}
                onChange={(e) => setAspectH(e.target.value)}
                placeholder="1080"
                className="calc-input calc-input-lg text-center"
              />
            </div>
          </div>

          {aspectResult && (
            <div className="mt-6">
              <div className="bg-blue-50 rounded-lg p-5 text-center">
                <p className="text-sm text-blue-600 mb-1">화면 비율</p>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-blue-700">
                    {aspectResult.ratioW} : {aspectResult.ratioH}
                  </p>
                  <button
                    onClick={() => handleCopy(`${aspectResult.ratioW} : ${aspectResult.ratioH}`)}
                    className="text-sm text-gray-400 hover:text-blue-600 transition-colors"
                    title="복사"
                  >
                    {copied ? "복사됨!" : "복사"}
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {aspectResult.width.toLocaleString()} ×{" "}
                  {aspectResult.height.toLocaleString()} px
                </p>
              </div>

              {/* 비율 미리보기 */}
              <div className="mt-4 flex justify-center">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-2">비율 미리보기</p>
                  <div
                    className="border-2 border-blue-400 bg-blue-50 rounded flex items-center justify-center"
                    style={{
                      width: Math.min(
                        300,
                        (aspectResult.ratioW / aspectResult.ratioH) * 150
                      ),
                      height: Math.min(
                        300,
                        (aspectResult.ratioH / aspectResult.ratioW) * 150
                      ),
                      maxWidth: 300,
                    }}
                  >
                    <span className="text-sm text-blue-500 font-medium">
                      {aspectResult.ratioW}:{aspectResult.ratioH}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mobile sticky bar */}
      {activeTab === "simplify" && simplifyResult && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">단순화된 비율</p>
              <p className="text-lg font-extrabold text-blue-600">{formatNum(simplifyResult.a)} : {formatNum(simplifyResult.b)}</p>
            </div>
            <button onClick={() => handleCopy(`${formatNum(simplifyResult.a)} : ${formatNum(simplifyResult.b)}`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}
      {activeTab === "proportion" && proportionResult && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">비례식 결과</p>
              <p className="text-lg font-extrabold text-blue-600">{unknown} = {formatNum(proportionResult.result)}</p>
            </div>
            <button onClick={() => handleCopy(`${unknown} = ${formatNum(proportionResult.result)}`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}
      {activeTab === "aspect" && aspectResult && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">화면 비율</p>
              <p className="text-lg font-extrabold text-blue-600">{aspectResult.ratioW} : {aspectResult.ratioH}</p>
            </div>
            <button onClick={() => handleCopy(`${aspectResult.ratioW} : ${aspectResult.ratioH}`)} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      {/* ══════════ SEO 콘텐츠 ══════════ */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            비율이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            비율(比率, ratio)은 두 양의 상대적인 크기를 나타내는 수학적 표현입니다.
            콜론 기호(:)를 사용하여 &quot;A : B&quot;와 같이 표기하며, 이는
            &quot;A 대 B&quot;로 읽습니다. 비율의 기호(:)는 나눗셈 기호(÷)에서
            유래했다는 설이 있으며, 실제로 비율은 두 수의 나눗셈 관계를 나타냅니다.
            예를 들어 3 : 2는 첫 번째 양이 두 번째 양의 1.5배라는 의미입니다.
            비율은 분수와 달리 전체에 대한 부분이 아닌, 두 양 사이의 관계를
            표현하는 데 사용됩니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            일상 속 비율
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <span className="font-medium text-gray-800">요리 레시피:</span>{" "}
              밥을 지을 때 쌀과 물의 비율은 보통 1 : 1.2입니다. 카페에서
              에스프레소와 우유의 비율로 카페라떼(1:3)와 카푸치노(1:1:1)를
              구분합니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">건축과 설계:</span>{" "}
              건축에서는 구조물의 비례가 미적 아름다움과 안정성을 결정합니다.
              고대 그리스의 파르테논 신전은 황금비(약 1:1.618)를 활용한 대표적인
              건축물입니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">디자인:</span> 웹
              디자인과 사진에서 화면 비율(종횡비)은 콘텐츠의 시각적 인상을
              좌우합니다. 16:9 와이드 비율은 영상 콘텐츠에, 1:1 정사각형은
              소셜 미디어 피드에 주로 사용됩니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">
                투자 포트폴리오:
              </span>{" "}
              주식과 채권의 비율을 60:40으로 구성하는 것은 전통적인 분산 투자
              전략입니다. 투자 성향에 따라 이 비율을 조정하여 수익률과 안정성의
              균형을 맞춥니다.
            </p>
            <p>
              <span className="font-medium text-gray-800">지도 축척:</span>{" "}
              1:50,000 지도는 지도 위 1cm가 실제 500m를 의미합니다. 축척 비율이
              클수록 더 넓은 지역을 표시하지만 상세도는 낮아집니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            화면 비율 종류
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">
                    비율
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    이름
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    대표 해상도
                  </th>
                  <th className="text-left py-2 px-3 border border-gray-200">
                    용도
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    4:3
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    스탠다드
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    1024×768
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    구형 모니터, iPad, 프레젠테이션
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    16:9
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    와이드스크린
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    1920×1080
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    TV, 모니터, 유튜브 영상, 게임
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    16:10
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    와이드 (WUXGA)
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    1920×1200
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    맥북, 업무용 모니터, 사진 편집
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    21:9
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    울트라와이드
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    2560×1080
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    울트라와이드 모니터, 시네마 영상
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">
                    1:1
                  </td>
                  <td className="py-2 px-3 border border-gray-200">정사각형</td>
                  <td className="py-2 px-3 border border-gray-200">
                    1080×1080
                  </td>
                  <td className="py-2 px-3 border border-gray-200">
                    인스타그램 피드, 프로필 사진, 앨범 커버
                  </td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                비율과 분수의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                비율은 두 양 사이의 상대적 크기를 비교하는 것이고(예: 남녀
                비율 3:2), 분수는 전체에 대한 부분을 나타냅니다(예: 전체의
                3/5). 비율 3:2는 분수로 3/2로 변환할 수 있지만, 의미하는 바가
                다릅니다. 비율은 &quot;~대~&quot;의 관계이고, 분수는
                &quot;전체 중 얼마&quot;의 개념입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">황금비란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                황금비(Golden Ratio)는 약 1 : 1.618의 비율로, 그리스 문자
                φ(파이)로 표기합니다. 수학적으로는 (1 + √5) / 2의 값입니다.
                자연에서 나선형 조개껍데기, 해바라기 씨앗 배열 등에서 발견되며,
                예술과 디자인에서 가장 아름다운 비율로 여겨져 건축, 회화, 타이포그래피
                등에 널리 활용됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                비율 계산에서 소수점이 나오면 어떻게 하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                비율 단순화에서 소수점이 나오는 경우, 두 수를 정수로 만든 후
                최대공약수로 나누는 것이 일반적입니다. 예를 들어 1.5 : 2.5는 양변에
                2를 곱하여 3 : 5로 변환할 수 있습니다. 본 계산기는 입력된 수를
                정수로 반올림한 후 GCD를 구하여 단순화합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                3개 이상의 수로 된 비율도 단순화할 수 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 가능합니다. 3개 이상의 비율(예: 12 : 8 : 4)은 모든 수의
                최대공약수를 구한 후 나누면 됩니다. 위 예시에서 GCD는 4이므로
                3 : 2 : 1이 됩니다. 본 계산기는 2개의 수만 지원하지만, 같은
                원리를 여러 수에 반복 적용하면 됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="ratio" />
    </div>
  );
}

function formatNum(n: number): string {
  if (Number.isInteger(n)) return n.toLocaleString("ko-KR");
  return parseFloat(n.toFixed(4)).toLocaleString("ko-KR");
}

function PropInput({
  label,
  value,
  onChange,
  disabled,
  isUnknown,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
  isUnknown: boolean;
}) {
  return (
    <div className="flex-1 min-w-[60px]">
      <label className="block text-xs text-gray-500 mb-1 text-center">
        {label}
      </label>
      {isUnknown ? (
        <div className="w-full px-3 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg text-lg text-center text-blue-400 font-bold">
          ?
        </div>
      ) : (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="calc-input calc-input-lg text-center"
        />
      )}
</div>
  );
}
