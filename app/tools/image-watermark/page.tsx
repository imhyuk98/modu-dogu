"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type Position =
  | "top-left" | "top-center" | "top-right"
  | "middle-left" | "center" | "middle-right"
  | "bottom-left" | "bottom-center" | "bottom-right";

type WatermarkMode = "single" | "tiled";

const positionLabels: Record<Position, string> = {
  "top-left": "좌상",
  "top-center": "상단",
  "top-right": "우상",
  "middle-left": "좌측",
  "center": "중앙",
  "middle-right": "우측",
  "bottom-left": "좌하",
  "bottom-center": "하단",
  "bottom-right": "우하",
};

const positionGrid: Position[][] = [
  ["top-left", "top-center", "top-right"],
  ["middle-left", "center", "middle-right"],
  ["bottom-left", "bottom-center", "bottom-right"],
];

export default function ImageWatermark() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState("Sample Watermark");
  const [fontSize, setFontSize] = useState(40);
  const [color, setColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>("bottom-right");
  const [mode, setMode] = useState<WatermarkMode>("single");
  const [diagonal, setDiagonal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setImageSrc(url);
    };
    img.src = url;
  }, []);

  // Render canvas with watermark
  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    if (!text.trim()) return;

    // Parse color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : { r: 255, g: 255, b: 255 };
    };

    const rgb = hexToRgb(color);
    const scaledFontSize = Math.round(fontSize * (canvas.width / 800));
    const actualFontSize = Math.max(12, scaledFontSize);

    ctx.font = `bold ${actualFontSize}px "Pretendard Variable", Pretendard, -apple-system, sans-serif`;
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    if (mode === "tiled") {
      // Tiled watermark
      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = actualFontSize * 1.2;
      const spacingX = textWidth + actualFontSize * 2;
      const spacingY = textHeight + actualFontSize * 3;
      const angle = diagonal ? -Math.PI / 6 : 0;

      // Extend area for rotation coverage
      const diag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
      const startX = -diag / 2;
      const startY = -diag / 2;
      const endX = canvas.width + diag / 2;
      const endY = canvas.height + diag / 2;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      for (let y = startY; y < endY; y += spacingY) {
        for (let x = startX; x < endX; x += spacingX) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore();
    } else {
      // Single watermark
      const padding = actualFontSize * 1.5;
      let x = canvas.width / 2;
      let y = canvas.height / 2;

      if (position.includes("left")) { ctx.textAlign = "left"; x = padding; }
      else if (position.includes("right")) { ctx.textAlign = "right"; x = canvas.width - padding; }
      else { ctx.textAlign = "center"; x = canvas.width / 2; }

      if (position.startsWith("top")) { y = padding + actualFontSize / 2; }
      else if (position.startsWith("bottom")) { y = canvas.height - padding - actualFontSize / 2; }
      else { y = canvas.height / 2; }

      ctx.save();
      if (diagonal) {
        ctx.translate(x, y);
        ctx.rotate(-Math.PI / 6);
        ctx.translate(-x, -y);
      }

      // Optional text shadow for readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      ctx.fillText(text, x, y);
      ctx.restore();
    }
  }, [originalImage, text, fontSize, color, opacity, position, mode, diagonal]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "watermarked-image.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setOriginalImage(null);
  };

  // Drag & drop handlers
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        loadImage(e.dataTransfer.files[0]);
      }
    },
    [loadImage]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
      e.target.value = "";
    }
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 워터마크
      </h1>
      <p className="text-gray-500 mb-8">
        사진에 텍스트 워터마크를 추가하여 저작권을 보호하세요.
      </p>

      {/* Upload Area */}
      {!imageSrc && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p className="text-gray-600 font-medium">
            이미지를 여기에 드래그하거나 클릭하여 선택하세요
          </p>
          <p className="text-gray-400 text-sm mt-1">
            PNG, JPG, WebP 등 지원
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* Editor */}
      {imageSrc && originalImage && (
        <>
          {/* Options */}
          <div className="calc-card p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">워터마크 설정</h2>

            {/* Watermark Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                워터마크 텍스트
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="워터마크 텍스트를 입력하세요"
                className="calc-input"
              />
            </div>

            {/* Font Size & Color */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  글꼴 크기: {fontSize}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  step="1"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>작게</span>
                  <span>크게</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  글꼴 색상
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="calc-input flex-1"
                    maxLength={7}
                  />
                  {/* Quick color presets */}
                  <div className="flex gap-1">
                    {["#ffffff", "#000000", "#ff0000", "#3b82f6"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${
                          color === c ? "border-blue-500 scale-110" : "border-gray-200"
                        }`}
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Opacity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                투명도: {Math.round(opacity * 100)}%
              </label>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>투명</span>
                <span>불투명</span>
              </div>
            </div>

            {/* Mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                배치 방식
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setMode("single")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    mode === "single"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  단일 배치
                </button>
                <button
                  onClick={() => setMode("tiled")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    mode === "tiled"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  타일 반복
                </button>
              </div>
            </div>

            {/* Position (only for single mode) */}
            {mode === "single" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  위치
                </label>
                <div className="inline-grid grid-cols-3 gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-200">
                  {positionGrid.map((row, ri) =>
                    row.map((pos) => (
                      <button
                        key={pos}
                        onClick={() => setPosition(pos)}
                        className={`w-12 h-10 rounded-lg text-xs font-medium transition-all ${
                          position === pos
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {positionLabels[pos]}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Diagonal */}
            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={diagonal}
                    onChange={(e) => setDiagonal(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${diagonal ? "bg-blue-600" : "bg-gray-300"}`} />
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${diagonal ? "translate-x-4" : ""}`} />
                </div>
                <span className="text-sm font-medium text-gray-700">대각선 배치</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                className="calc-btn-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                다운로드
              </button>
              <button
                onClick={handleReset}
                className="calc-btn-secondary text-red-500 border-red-200 hover:bg-red-50"
              >
                다른 이미지
              </button>
            </div>
          </div>

          {/* Canvas Preview */}
          <div className="calc-card p-4 mb-6">
            <p className="text-sm text-gray-500 mb-3">미리보기</p>
            <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block"
              />
            </div>
          </div>
        </>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center mb-12">
        모든 처리는 브라우저에서 이루어지며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 워터마크란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            워터마크(Watermark)는 이미지 위에 텍스트나 로고를 반투명하게 표시하여
            저작권을 표시하거나 무단 사용을 방지하는 기법입니다.
            사진작가, 디자이너, 블로거 등이 자신의 작품을 보호하기 위해
            널리 사용합니다. 텍스트 워터마크는 이름, 회사명, 저작권 표시,
            URL 등을 이미지에 삽입하여 원본 소유자를 명시하는 데 활용됩니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">워터마크 배치 옵션</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>옵션</th>
                  <th>설명</th>
                  <th>추천 용도</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">단일 배치</td>
                  <td>9개 위치 중 하나에 워터마크를 하나만 배치</td>
                  <td>포트폴리오, 블로그 이미지</td>
                </tr>
                <tr>
                  <td className="font-medium">타일 반복</td>
                  <td>이미지 전체에 워터마크를 반복 배치</td>
                  <td>샘플 이미지, 미리보기 보호</td>
                </tr>
                <tr>
                  <td className="font-medium">대각선</td>
                  <td>워터마크를 약 30도 기울여 배치</td>
                  <td>문서 보호, 공식 자료</td>
                </tr>
                <tr>
                  <td className="font-medium">투명도 조절</td>
                  <td>5%~100% 사이에서 투명도 조절</td>
                  <td>이미지 방해 최소화 시 낮은 투명도 사용</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">효과적인 워터마크 팁</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p><strong className="text-gray-900">적절한 투명도:</strong> 30~50% 투명도가 이미지를 방해하지 않으면서도 워터마크가 보이는 적절한 수준입니다.</p>
            <p><strong className="text-gray-900">대비 색상 사용:</strong> 밝은 이미지에는 어두운 색상, 어두운 이미지에는 밝은 색상의 워터마크가 잘 보입니다.</p>
            <p><strong className="text-gray-900">크롭 방지:</strong> 타일 반복이나 중앙 배치를 사용하면 이미지를 잘라도 워터마크가 남아있어 더 효과적입니다.</p>
            <p><strong className="text-gray-900">저작권 표시:</strong> "(c) 2026 홍길동" 또는 "@ yoursite.com" 형태가 일반적입니다.</p>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">이미지가 서버에 업로드되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                아니요. 모든 처리는 사용자의 브라우저에서 Canvas API를 이용해 직접 수행됩니다.
                이미지가 외부 서버로 전송되지 않으므로 안전하게 사용할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">워터마크를 제거할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                다운로드 전까지는 설정을 변경하거나 다른 이미지를 선택하여 처음부터 다시 할 수 있습니다.
                다운로드한 이미지에서 워터마크를 제거하려면 별도의 편집 도구가 필요합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">한글 워터마크도 지원하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 한글, 영문, 숫자, 특수문자 등 모든 텍스트를 워터마크로 사용할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">최대 파일 크기 제한이 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                서버를 사용하지 않으므로 별도 제한은 없습니다. 다만 매우 큰 이미지는
                브라우저 메모리에 따라 처리가 느려질 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="image-watermark" />
    </div>
  );
}
