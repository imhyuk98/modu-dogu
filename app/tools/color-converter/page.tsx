"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

// --- Color conversion utilities ---

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length !== 6) return null;
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(
  h: number,
  s: number,
  l: number
): [number, number, number] {
  const sn = s / 100;
  const ln = l / 100;
  const hn = h / 360;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return [v, v, v];
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return [
    Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, hn) * 255),
    Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  ];
}

// --- Related colors ---

function getRelatedColors(
  h: number,
  s: number,
  l: number
): { label: string; hex: string }[] {
  const wrap = (v: number) => ((v % 360) + 360) % 360;
  return [
    { label: "보색", hex: rgbToHex(...hslToRgb(wrap(h + 180), s, l)) },
    { label: "유사색 1", hex: rgbToHex(...hslToRgb(wrap(h + 30), s, l)) },
    { label: "유사색 2", hex: rgbToHex(...hslToRgb(wrap(h - 30), s, l)) },
    { label: "삼원색 1", hex: rgbToHex(...hslToRgb(wrap(h + 120), s, l)) },
    { label: "삼원색 2", hex: rgbToHex(...hslToRgb(wrap(h + 240), s, l)) },
    {
      label: "밝은 변형",
      hex: rgbToHex(...hslToRgb(h, s, Math.min(l + 20, 95))),
    },
  ];
}

// --- Component ---

export default function ColorConverterPage() {
  const [hex, setHex] = useState("#3B82F6");
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);
  const [hue, setHue] = useState(217);
  const [sat, setSat] = useState(91);
  const [lit, setLit] = useState(60);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const addRecent = useCallback(
    (hexVal: string) => {
      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c !== hexVal);
        return [hexVal, ...filtered].slice(0, 5);
      });
    },
    []
  );

  const updateFromRgb = useCallback(
    (rr: number, gg: number, bb: number) => {
      setR(rr);
      setG(gg);
      setB(bb);
      const newHex = rgbToHex(rr, gg, bb);
      setHex(newHex);
      const [h, s, l] = rgbToHsl(rr, gg, bb);
      setHue(h);
      setSat(s);
      setLit(l);
      addRecent(newHex);
    },
    [addRecent]
  );

  const updateFromHex = useCallback(
    (hexVal: string) => {
      setHex(hexVal);
      const rgb = hexToRgb(hexVal);
      if (rgb) {
        const [rr, gg, bb] = rgb;
        setR(rr);
        setG(gg);
        setB(bb);
        const [h, s, l] = rgbToHsl(rr, gg, bb);
        setHue(h);
        setSat(s);
        setLit(l);
        addRecent(hexVal);
      }
    },
    [addRecent]
  );

  const updateFromHsl = useCallback(
    (h: number, s: number, l: number) => {
      setHue(h);
      setSat(s);
      setLit(l);
      const [rr, gg, bb] = hslToRgb(h, s, l);
      setR(rr);
      setG(gg);
      setB(bb);
      const newHex = rgbToHex(rr, gg, bb);
      setHex(newHex);
      addRecent(newHex);
    },
    [addRecent]
  );

  const handleColorPicker = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFromHex(e.target.value);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    setHex(val);
    if (val.length === 7) {
      updateFromHex(val);
    }
  };

  const handleRgbChange = (channel: "r" | "g" | "b", val: string) => {
    const num = val === "" ? 0 : clamp(parseInt(val, 10) || 0, 0, 255);
    const newR = channel === "r" ? num : r;
    const newG = channel === "g" ? num : g;
    const newB = channel === "b" ? num : b;
    updateFromRgb(newR, newG, newB);
  };

  const handleHslChange = (channel: "h" | "s" | "l", val: string) => {
    const max = channel === "h" ? 360 : 100;
    const num = val === "" ? 0 : clamp(parseInt(val, 10) || 0, 0, max);
    const newH = channel === "h" ? num : hue;
    const newS = channel === "s" ? num : sat;
    const newL = channel === "l" ? num : lit;
    updateFromHsl(newH, newS, newL);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const relatedColors = getRelatedColors(hue, sat, lit);

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">색상 변환기</h1>
      <p className="text-gray-500 mb-8">
        HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보기할 수 있습니다.
      </p>

      {/* 색상 미리보기 + 피커 */}
      <div className="calc-card p-6 mb-6">
        <div
          className="w-full rounded-lg mb-4 border border-gray-200"
          style={{ height: 150, backgroundColor: hex }}
        />
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            컬러 피커
          </label>
          <input
            type="color"
            value={hex.length === 7 ? hex : "#000000"}
            onChange={handleColorPicker}
            className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
          />
          <span className="text-gray-500 text-sm">{hex.toUpperCase()}</span>
        </div>
      </div>

      {/* HEX 입력 */}
      <div className="calc-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">HEX</h2>
          <button
            onClick={() => copyToClipboard(hex.toUpperCase(), "hex")}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copiedField === "hex" ? "복사됨!" : "복사하기"}
          </button>
        </div>
        <input
          type="text"
          value={hex.toUpperCase()}
          onChange={handleHexInput}
          maxLength={7}
          placeholder="#000000"
          className="calc-input calc-input-lg font-mono"
        />
      </div>

      {/* RGB 입력 */}
      <div className="calc-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">RGB</h2>
          <button
            onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`, "rgb")}
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copiedField === "rgb" ? "복사됨!" : "복사하기"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              { label: "R", value: r, channel: "r" as const },
              { label: "G", value: g, channel: "g" as const },
              { label: "B", value: b, channel: "b" as const },
            ] as const
          ).map(({ label, value, channel }) => (
            <div key={label}>
              <label className="block text-xs text-gray-500 mb-1">
                {label} (0-255)
              </label>
              <input
                type="number"
                min={0}
                max={255}
                value={value}
                onChange={(e) => handleRgbChange(channel, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 font-mono">
          rgb({r}, {g}, {b})
        </p>
      </div>

      {/* HSL 입력 */}
      <div className="calc-card p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">HSL</h2>
          <button
            onClick={() =>
              copyToClipboard(`hsl(${hue}, ${sat}%, ${lit}%)`, "hsl")
            }
            className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copiedField === "hsl" ? "복사됨!" : "복사하기"}
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(
            [
              { label: "H", unit: "0-360", value: hue, channel: "h" as const, max: 360 },
              { label: "S", unit: "0-100%", value: sat, channel: "s" as const, max: 100 },
              { label: "L", unit: "0-100%", value: lit, channel: "l" as const, max: 100 },
            ] as const
          ).map(({ label, unit, value, channel, max }) => (
            <div key={label}>
              <label className="block text-xs text-gray-500 mb-1">
                {label} ({unit})
              </label>
              <input
                type="number"
                min={0}
                max={max}
                value={value}
                onChange={(e) => handleHslChange(channel, e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 font-mono">
          hsl({hue}, {sat}%, {lit}%)
        </p>
      </div>

      {/* 관련 색상 팔레트 */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          관련 색상 팔레트
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {relatedColors.map(({ label, hex: colorHex }) => (
            <button
              key={label}
              onClick={() => updateFromHex(colorHex)}
              className="group text-center"
            >
              <div
                className="w-full aspect-square rounded-lg border border-gray-200 mb-1 group-hover:ring-2 group-hover:ring-blue-400 transition-all"
                style={{ backgroundColor: colorHex }}
              />
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xs font-mono text-gray-400">
                {colorHex.toUpperCase()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 최근 사용한 색상 */}
      {recentColors.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            최근 사용한 색상
          </h2>
          <div className="flex gap-3">
            {recentColors.map((colorHex, i) => (
              <button
                key={`${colorHex}-${i}`}
                onClick={() => updateFromHex(colorHex)}
                className="group text-center"
              >
                <div
                  className="w-12 h-12 rounded-lg border border-gray-200 mb-1 group-hover:ring-2 group-hover:ring-blue-400 transition-all"
                  style={{ backgroundColor: colorHex }}
                />
                <p className="text-xs font-mono text-gray-400">
                  {colorHex.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            색상 코드란?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            색상 코드는 컴퓨터에서 색상을 표현하기 위한 체계적인 방법입니다.
            웹 개발, 디자인, 앱 개발 등 디지털 환경에서 정확한 색상을 지정하기
            위해 다양한 색상 코드 형식이 사용됩니다.
          </p>
          <div className="space-y-3 text-gray-600 text-sm">
            <p>
              <strong className="text-gray-900">HEX (16진수)</strong>: #기호 뒤에
              6자리 16진수(0-9, A-F)로 색상을 표현합니다. 앞에서부터 두 자리씩
              빨강(R), 초록(G), 파랑(B) 값을 나타냅니다. 예를 들어 #FF0000은
              빨간색, #00FF00은 초록색입니다.
            </p>
            <p>
              <strong className="text-gray-900">RGB (빨강, 초록, 파랑)</strong>:
              빛의 삼원색인 Red, Green, Blue 각각을 0~255 사이의 숫자로
              표현합니다. rgb(255, 0, 0)은 빨간색이며, 세 값을 조합하여 약
              1,670만 가지의 색상을 만들 수 있습니다.
            </p>
            <p>
              <strong className="text-gray-900">
                HSL (색상, 채도, 명도)
              </strong>
              : Hue(색조, 0-360도), Saturation(채도, 0-100%),
              Lightness(명도, 0-100%)로 색상을 표현합니다. 인간의 색 인지
              방식에 가까워 직관적으로 색상을 조절할 수 있습니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            웹 개발에서의 색상
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            CSS에서는 HEX, RGB, HSL 세 가지 형식을 모두 사용할 수 있습니다.
            최근에는 HSL 형식이 색상 변형이 쉬워 많이 활용되고 있습니다.
          </p>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>
              <strong className="text-gray-900">CSS 활용</strong>: color,
              background-color, border-color 등 다양한 속성에서 색상 코드를
              사용합니다. CSS 변수(Custom Properties)와 함께 사용하면 테마
              관리가 편리합니다.
            </p>
            <p>
              <strong className="text-gray-900">웹 접근성</strong>: WCAG 2.1
              가이드라인에 따르면, 텍스트와 배경의 명암 대비율이 최소
              4.5:1(일반 텍스트) 또는 3:1(큰 텍스트)을 만족해야 합니다. 적절한
              색상 선택은 모든 사용자가 콘텐츠를 인식할 수 있도록 합니다.
            </p>
            <p>
              <strong className="text-gray-900">대비율</strong>: 대비율은 두
              색상의 상대 휘도 비율로 계산됩니다. 높은 대비율은 가독성을 높이고,
              시각 장애가 있는 사용자도 편하게 콘텐츠를 이용할 수 있게 합니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            색상 조합 팁
          </h2>
          <div className="space-y-3 text-gray-600 text-sm">
            <p>
              <strong className="text-gray-900">보색 (Complementary)</strong>:
              색상환에서 정반대(180도)에 위치한 두 색의 조합입니다. 강렬한
              대비를 만들어 시선을 끄는 데 효과적입니다. 예: 파랑-주황,
              빨강-초록.
            </p>
            <p>
              <strong className="text-gray-900">유사색 (Analogous)</strong>:
              색상환에서 인접한(30도 간격) 색들의 조합입니다. 자연스럽고
              조화로운 느낌을 주며, 한 색을 주색으로 나머지를 보조색으로
              사용합니다.
            </p>
            <p>
              <strong className="text-gray-900">삼원색 조화 (Triadic)</strong>:
              색상환에서 120도 간격으로 배치된 세 색의 조합입니다. 풍부하고
              활기찬 느낌을 줍니다. 한 색을 주색으로 하고 나머지 두 색은
              보조적으로 사용하면 균형 잡힌 디자인이 됩니다.
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
                HEX와 RGB의 차이는 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                HEX와 RGB는 같은 색상을 다른 형식으로 표현한 것입니다. HEX는
                16진수를 사용하고 RGB는 10진수(0-255)를 사용합니다. 예를 들어
                HEX #FF0000은 RGB rgb(255, 0, 0)과 동일한 빨간색입니다.
                기능적으로 차이는 없으며 표기법만 다릅니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                HSL은 어떤 경우에 유용한가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                HSL은 색상을 직관적으로 조절할 때 유용합니다. 예를 들어 같은
                파란색 계열에서 밝기만 바꾸고 싶다면 L(명도) 값만 변경하면
                됩니다. 테마 색상 변형, 호버 효과 등에서 HSL이 특히
                편리합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                웹에서 사용 가능한 색상은 몇 가지인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                RGB 각 채널이 0~255까지 256단계이므로 총 256 x 256 x 256 =
                16,777,216가지(약 1,670만 가지) 색상을 표현할 수 있습니다.
                이는 HEX 코드에서 #000000부터 #FFFFFF까지에 해당합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                디자인에서 색상 대비가 중요한 이유는?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                적절한 색상 대비는 가독성과 접근성의 핵심입니다. WCAG
                가이드라인은 일반 텍스트에 최소 4.5:1의 대비율을 권장합니다.
                대비가 낮으면 시력이 좋지 않은 사용자나 밝은 환경에서 콘텐츠를
                읽기 어려워질 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="color-converter" />
</div>
  );
}
