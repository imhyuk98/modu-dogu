"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface PickedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function ImageColorPicker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [currentColor, setCurrentColor] = useState<PickedColor | null>(null);
  const [history, setHistory] = useState<PickedColor[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [loupePixels, setLoupePixels] = useState<Uint8ClampedArray | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const LOUPE_SIZE = 9; // 9x9 grid of pixels in the loupe

  const rgbToHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = 0;
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const getColorAt = useCallback(
    (x: number, y: number): PickedColor | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0],
        g = pixel[1],
        b = pixel[2];
      return {
        hex: rgbToHex(r, g, b),
        rgb: { r, g, b },
        hsl: rgbToHsl(r, g, b),
      };
    },
    []
  );

  const getLoupeData = useCallback(
    (canvasX: number, canvasY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      const half = Math.floor(LOUPE_SIZE / 2);
      const startX = canvasX - half;
      const startY = canvasY - half;
      try {
        return ctx.getImageData(startX, startY, LOUPE_SIZE, LOUPE_SIZE).data;
      } catch {
        return null;
      }
    },
    []
  );

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCurrentColor(null);
      setMousePos(null);
      setLoupePixels(null);
    };
    reader.readAsDataURL(file);
  }, []);

  // Draw image to canvas when loaded
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: Math.floor((e.clientX - rect.left) * scaleX),
        y: Math.floor((e.clientY - rect.top) * scaleY),
        clientX: e.clientX,
        clientY: e.clientY,
      };
    },
    []
  );

  const handleCanvasMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCanvasCoords(e);
      if (!coords) return;
      const color = getColorAt(coords.x, coords.y);
      if (color) setCurrentColor(color);
      setMousePos({ x: e.clientX, y: e.clientY });
      setLoupePixels(getLoupeData(coords.x, coords.y));
    },
    [getCanvasCoords, getColorAt, getLoupeData]
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const coords = getCanvasCoords(e);
      if (!coords) return;
      const color = getColorAt(coords.x, coords.y);
      if (!color) return;
      setCurrentColor(color);
      setHistory((prev) => {
        const newHistory = [color, ...prev.filter((c) => c.hex !== color.hex)];
        return newHistory.slice(0, 10);
      });
    },
    [getCanvasCoords, getColorAt]
  );

  const handleCanvasLeave = () => {
    setMousePos(null);
    setLoupePixels(null);
  };

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // fallback
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) loadImage(file);
    },
    [loadImage]
  );

  const formatRgb = (c: PickedColor) => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`;
  const formatHsl = (c: PickedColor) => `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`;

  // Determine text color for contrast
  const getTextColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          이미지 색상 추출
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          이미지에서 원하는 위치를 클릭하여 색상 코드(HEX, RGB, HSL)를 추출하세요.
        </p>
      </div>

      {/* Upload or Canvas */}
      {!imageSrc ? (
        <div
          className={`calc-card p-6 mb-6 border-2 border-dashed transition-colors cursor-pointer ${
            dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) loadImage(e.target.files[0]);
              e.target.value = "";
            }}
          />
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-gray-700 font-semibold mb-1">
              이미지를 드래그하거나 클릭하여 업로드
            </p>
            <p className="text-gray-400 text-sm">
              JPG, PNG, WebP, GIF 등 지원
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Toolbar */}
          <div className="calc-card p-4 mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              이미지 위에서 클릭하면 색상이 추출됩니다
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="calc-btn-secondary text-xs py-2 px-3"
              >
                다른 이미지
              </button>
              <button
                onClick={() => {
                  setImageSrc(null);
                  setCurrentColor(null);
                  setHistory([]);
                  setMousePos(null);
                  setLoupePixels(null);
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium px-3"
              >
                초기화
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) loadImage(e.target.files[0]);
                e.target.value = "";
              }}
            />
          </div>

          {/* Canvas Area */}
          <div
            ref={containerRef}
            className="calc-card overflow-hidden mb-6 relative"
          >
            <canvas
              ref={canvasRef}
              onMouseMove={handleCanvasMove}
              onClick={handleCanvasClick}
              onMouseLeave={handleCanvasLeave}
              className="w-full h-auto cursor-crosshair block"
              style={{ maxHeight: "70vh" }}
            />

            {/* Magnifier/Loupe */}
            {mousePos && loupePixels && (
              <div
                className="fixed pointer-events-none z-50"
                style={{
                  left: mousePos.x + 20,
                  top: mousePos.y - 80,
                }}
              >
                <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  {/* Pixel grid */}
                  <div
                    className="grid"
                    style={{
                      gridTemplateColumns: `repeat(${LOUPE_SIZE}, 1fr)`,
                      width: `${LOUPE_SIZE * 14}px`,
                      height: `${LOUPE_SIZE * 14}px`,
                    }}
                  >
                    {Array.from({ length: LOUPE_SIZE * LOUPE_SIZE }).map((_, i) => {
                      const offset = i * 4;
                      const r = loupePixels[offset] ?? 0;
                      const g = loupePixels[offset + 1] ?? 0;
                      const b = loupePixels[offset + 2] ?? 0;
                      const isCenter = i === Math.floor((LOUPE_SIZE * LOUPE_SIZE) / 2);
                      return (
                        <div
                          key={i}
                          style={{ backgroundColor: `rgb(${r},${g},${b})` }}
                          className={isCenter ? "border-2 border-white ring-1 ring-gray-400" : ""}
                        />
                      );
                    })}
                  </div>
                  {/* Color label */}
                  {currentColor && (
                    <div
                      className="text-center py-1 text-xs font-mono font-bold"
                      style={{
                        backgroundColor: currentColor.hex,
                        color: getTextColor(currentColor.hex),
                      }}
                    >
                      {currentColor.hex.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Current Color Display */}
      {currentColor && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          {/* Color preview header */}
          <div
            className="p-8 text-center transition-colors"
            style={{ backgroundColor: currentColor.hex }}
          >
            <p
              className="text-lg font-bold"
              style={{ color: getTextColor(currentColor.hex) }}
            >
              {currentColor.hex.toUpperCase()}
            </p>
          </div>

          {/* Color values */}
          <div className="p-6 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              색상 코드 (클릭하여 복사)
            </h3>

            {[
              { label: "HEX", value: currentColor.hex.toUpperCase() },
              { label: "RGB", value: formatRgb(currentColor) },
              { label: "HSL", value: formatHsl(currentColor) },
            ].map(({ label, value }) => (
              <button
                key={label}
                onClick={() => copyToClipboard(value, label)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-8">{label}</span>
                  <span className="font-mono text-sm text-gray-900">{value}</span>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-blue-500">
                  {copied === label ? "복사됨!" : "복사"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color History */}
      {history.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              추출 이력 ({history.length}/10)
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              이력 삭제
            </button>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {history.map((color, idx) => (
              <button
                key={`${color.hex}-${idx}`}
                onClick={() => {
                  setCurrentColor(color);
                  copyToClipboard(color.hex.toUpperCase(), "HEX");
                }}
                className="group relative"
                title={color.hex.toUpperCase()}
              >
                <div
                  className="w-full aspect-square rounded-xl border-2 border-gray-200 hover:border-blue-400 transition-all hover:scale-110 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <p className="text-[10px] text-gray-400 mt-1 text-center font-mono truncate">
                  {color.hex.toUpperCase()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 색상 추출이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이미지 색상 추출(컬러 피커)은 이미지의 특정 위치에서 정확한 색상 코드를
            가져오는 기능입니다. 웹 디자인, 그래픽 디자인, 브랜딩 작업 등에서 참고
            이미지의 색상을 정확히 추출할 때 유용합니다. HEX, RGB, HSL 세 가지
            형식으로 색상 코드를 제공하여 다양한 환경에서 바로 사용할 수 있습니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">색상 코드 형식</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>형식</th>
                  <th>설명</th>
                  <th>예시</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">HEX</td>
                  <td>16진수 색상 코드 (웹에서 가장 많이 사용)</td>
                  <td className="font-mono">#3B82F6</td>
                </tr>
                <tr>
                  <td className="font-medium">RGB</td>
                  <td>빨강, 초록, 파랑 값 (0-255)</td>
                  <td className="font-mono">rgb(59, 130, 246)</td>
                </tr>
                <tr>
                  <td className="font-medium">HSL</td>
                  <td>색조, 채도, 명도 (디자인 도구에서 많이 사용)</td>
                  <td className="font-mono">hsl(217, 91%, 60%)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">주요 기능</h2>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 ml-4 list-disc">
            <li>이미지 위에서 마우스를 움직이면 확대 돋보기로 정확한 픽셀 선택 가능</li>
            <li>클릭 한 번으로 HEX, RGB, HSL 색상 코드 추출</li>
            <li>색상 코드를 클릭하면 클립보드에 자동 복사</li>
            <li>최근 추출한 색상 10개를 이력으로 저장</li>
            <li>모든 처리가 브라우저에서 이루어져 이미지가 서버로 전송되지 않음</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
