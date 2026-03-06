"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type EffectType = "pixelate" | "blur";

interface MosaicArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function ImageMosaic() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [effectType, setEffectType] = useState<EffectType>("pixelate");
  const [blockSize, setBlockSize] = useState(15);
  const [mosaicAreas, setMosaicAreas] = useState<MosaicArea[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<MosaicArea | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scale factor between displayed canvas and actual image
  const scaleRef = useRef({ sx: 1, sy: 1 });

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginalImage(img);
      setImageSrc(url);
      setMosaicAreas([]);
    };
    img.src = url;
  }, []);

  // Draw canvas whenever image, areas, or current drawing rect changes
  useEffect(() => {
    if (!originalImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = originalImage.naturalWidth;
    canvas.height = originalImage.naturalHeight;

    // Draw original image
    ctx.drawImage(originalImage, 0, 0);

    // Apply mosaic/blur to all saved areas
    const allAreas = [...mosaicAreas];
    if (currentRect) allAreas.push(currentRect);

    for (const area of allAreas) {
      // Convert from display coords to image coords
      const ix = Math.round(area.x * scaleRef.current.sx);
      const iy = Math.round(area.y * scaleRef.current.sy);
      const iw = Math.round(area.w * scaleRef.current.sx);
      const ih = Math.round(area.h * scaleRef.current.sy);

      if (iw <= 0 || ih <= 0) continue;

      const clampedX = Math.max(0, Math.min(ix, canvas.width));
      const clampedY = Math.max(0, Math.min(iy, canvas.height));
      const clampedW = Math.min(iw, canvas.width - clampedX);
      const clampedH = Math.min(ih, canvas.height - clampedY);

      if (clampedW <= 0 || clampedH <= 0) continue;

      if (effectType === "pixelate") {
        applyPixelate(ctx, clampedX, clampedY, clampedW, clampedH, blockSize);
      } else {
        applyBlur(ctx, clampedX, clampedY, clampedW, clampedH, blockSize);
      }
    }

    // Draw selection rectangles outline
    if (currentRect) {
      const ix = Math.round(currentRect.x * scaleRef.current.sx);
      const iy = Math.round(currentRect.y * scaleRef.current.sy);
      const iw = Math.round(currentRect.w * scaleRef.current.sx);
      const ih = Math.round(currentRect.h * scaleRef.current.sy);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.strokeRect(ix, iy, iw, ih);
      ctx.setLineDash([]);
    }
  }, [originalImage, mosaicAreas, currentRect, effectType, blockSize]);

  // Update scale ref when canvas is resized
  useEffect(() => {
    if (!canvasRef.current || !originalImage) return;
    const updateScale = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const displayW = canvas.clientWidth;
      const displayH = canvas.clientHeight;
      if (displayW > 0 && displayH > 0) {
        scaleRef.current = {
          sx: originalImage.naturalWidth / displayW,
          sy: originalImage.naturalHeight / displayH,
        };
      }
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [originalImage]);

  function applyPixelate(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    size: number
  ) {
    const imageData = ctx.getImageData(x, y, w, h);
    const data = imageData.data;
    const pixelSize = Math.max(2, size);

    for (let py = 0; py < h; py += pixelSize) {
      for (let px = 0; px < w; px += pixelSize) {
        let r = 0, g = 0, b = 0, a = 0, count = 0;
        const endY = Math.min(py + pixelSize, h);
        const endX = Math.min(px + pixelSize, w);

        for (let sy = py; sy < endY; sy++) {
          for (let sx = px; sx < endX; sx++) {
            const idx = (sy * w + sx) * 4;
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            a += data[idx + 3];
            count++;
          }
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);
        a = Math.round(a / count);

        for (let sy = py; sy < endY; sy++) {
          for (let sx = px; sx < endX; sx++) {
            const idx = (sy * w + sx) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = a;
          }
        }
      }
    }

    ctx.putImageData(imageData, x, y);
  }

  function applyBlur(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    intensity: number
  ) {
    // Use multiple box blurs to approximate gaussian blur
    const passes = 3;
    const radius = Math.max(1, Math.round(intensity * 0.8));

    for (let pass = 0; pass < passes; pass++) {
      const imageData = ctx.getImageData(x, y, w, h);
      const data = imageData.data;
      const copy = new Uint8ClampedArray(data);

      // Horizontal pass
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
          let r = 0, g = 0, b = 0, a = 0, count = 0;
          for (let k = -radius; k <= radius; k++) {
            const sc = col + k;
            if (sc >= 0 && sc < w) {
              const idx = (row * w + sc) * 4;
              r += copy[idx];
              g += copy[idx + 1];
              b += copy[idx + 2];
              a += copy[idx + 3];
              count++;
            }
          }
          const idx = (row * w + col) * 4;
          data[idx] = Math.round(r / count);
          data[idx + 1] = Math.round(g / count);
          data[idx + 2] = Math.round(b / count);
          data[idx + 3] = Math.round(a / count);
        }
      }

      // Vertical pass
      const hCopy = new Uint8ClampedArray(data);
      for (let col = 0; col < w; col++) {
        for (let row = 0; row < h; row++) {
          let r = 0, g = 0, b = 0, a = 0, count = 0;
          for (let k = -radius; k <= radius; k++) {
            const sr = row + k;
            if (sr >= 0 && sr < h) {
              const idx = (sr * w + col) * 4;
              r += hCopy[idx];
              g += hCopy[idx + 1];
              b += hCopy[idx + 2];
              a += hCopy[idx + 3];
              count++;
            }
          }
          const idx = (row * w + col) * 4;
          data[idx] = Math.round(r / count);
          data[idx + 1] = Math.round(g / count);
          data[idx + 2] = Math.round(b / count);
          data[idx + 3] = Math.round(a / count);
        }
      }

      ctx.putImageData(imageData, x, y);
    }
  }

  const getPointerPos = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handlePointerDown = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    const pos = getPointerPos(e);
    setIsDrawing(true);
    setDrawStart(pos);
    setCurrentRect(null);
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !drawStart) return;
    e.preventDefault();
    const pos = getPointerPos(e);
    const x = Math.min(drawStart.x, pos.x);
    const y = Math.min(drawStart.y, pos.y);
    const w = Math.abs(pos.x - drawStart.x);
    const h = Math.abs(pos.y - drawStart.y);
    setCurrentRect({ x, y, w, h });
  };

  const handlePointerUp = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault();
    if (currentRect && currentRect.w > 3 && currentRect.h > 3) {
      setMosaicAreas((prev) => [...prev, currentRect]);
    }
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentRect(null);
  };

  const handleUndo = () => {
    setMosaicAreas((prev) => prev.slice(0, -1));
  };

  const handleResetAll = () => {
    setMosaicAreas([]);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "mosaic-result.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setOriginalImage(null);
    setMosaicAreas([]);
    setCurrentRect(null);
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
        이미지 모자이크
      </h1>
      <p className="text-gray-500 mb-8">
        사진의 특정 영역을 드래그하여 모자이크 또는 블러 처리할 수 있습니다.
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
            <h2 className="font-semibold text-gray-900 mb-4">효과 설정</h2>

            {/* Effect Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                효과 종류
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => setEffectType("pixelate")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    effectType === "pixelate"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  모자이크 (픽셀화)
                </button>
                <button
                  onClick={() => setEffectType("blur")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    effectType === "blur"
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  블러 (흐림)
                </button>
              </div>
            </div>

            {/* Intensity */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {effectType === "pixelate" ? "모자이크 강도" : "블러 강도"}: {blockSize}px
              </label>
              <input
                type="range"
                min="3"
                max="50"
                step="1"
                value={blockSize}
                onChange={(e) => setBlockSize(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>약하게</span>
                <span>강하게</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleUndo}
                disabled={mosaicAreas.length === 0}
                className="calc-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
                </svg>
                실행 취소
              </button>
              <button
                onClick={handleResetAll}
                disabled={mosaicAreas.length === 0}
                className="calc-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                모자이크 초기화
              </button>
              <button
                onClick={handleDownload}
                disabled={mosaicAreas.length === 0}
                className="calc-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
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

          {/* Canvas Area */}
          <div className="calc-card p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                모자이크 처리할 영역을 드래그하세요 (영역: {mosaicAreas.length}개)
              </p>
            </div>
            <div
              ref={containerRef}
              className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
              style={{ touchAction: "none" }}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-auto block cursor-crosshair"
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
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
          <h2 className="calc-seo-title">이미지 모자이크란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이미지 모자이크(Image Mosaic)는 사진이나 이미지의 특정 영역을 픽셀화하거나
            흐릿하게 처리하여 해당 부분의 내용을 알아볼 수 없게 만드는 기법입니다.
            주로 개인정보 보호를 위해 얼굴, 차량 번호판, 주소, 전화번호 등을
            가리는 데 사용됩니다. SNS 업로드, 블로그 포스팅, 문서 공유 시
            민감한 정보를 보호하는 데 필수적인 도구입니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">모자이크 vs 블러 차이</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>모자이크 (픽셀화)</th>
                  <th>블러 (흐림)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">원리</td>
                  <td>일정 크기 블록의 평균 색상으로 대체</td>
                  <td>주변 픽셀과 가중 평균하여 흐리게 처리</td>
                </tr>
                <tr>
                  <td className="font-medium">외형</td>
                  <td>격자 형태의 큰 픽셀 블록</td>
                  <td>부드럽게 흐려진 형태</td>
                </tr>
                <tr>
                  <td className="font-medium">복원 가능성</td>
                  <td>강도에 따라 복원 어려움</td>
                  <td>강한 블러는 복원 매우 어려움</td>
                </tr>
                <tr>
                  <td className="font-medium">주요 용도</td>
                  <td>TV 방송, 뉴스, 공식 문서</td>
                  <td>SNS, 블로그, 자연스러운 처리</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">사용 방법</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p><strong className="text-gray-900">1. 이미지 업로드:</strong> 모자이크 처리할 이미지를 드래그 앤 드롭하거나 클릭하여 선택합니다.</p>
            <p><strong className="text-gray-900">2. 효과 선택:</strong> 모자이크(픽셀화) 또는 블러(흐림) 효과 중 원하는 것을 선택합니다.</p>
            <p><strong className="text-gray-900">3. 강도 조절:</strong> 슬라이더를 이용해 모자이크/블러 강도를 조절합니다. 숫자가 클수록 더 강하게 처리됩니다.</p>
            <p><strong className="text-gray-900">4. 영역 지정:</strong> 이미지 위에서 마우스를 드래그하여 모자이크 처리할 영역을 지정합니다. 여러 영역을 추가할 수 있습니다.</p>
            <p><strong className="text-gray-900">5. 다운로드:</strong> 처리가 완료되면 다운로드 버튼을 눌러 결과물을 저장합니다.</p>
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
              <h3 className="font-medium text-gray-900">모바일에서도 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 모바일 브라우저에서도 사용 가능합니다. 터치 드래그로 모자이크 영역을 지정할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">모자이크를 취소할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                실행 취소 버튼으로 마지막에 추가한 모자이크 영역을 하나씩 제거할 수 있고,
                모자이크 초기화 버튼으로 모든 영역을 한 번에 제거할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">어떤 이미지 포맷을 지원하나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                PNG, JPG, WebP, GIF 등 브라우저에서 지원하는 모든 이미지 포맷을 사용할 수 있습니다.
                결과물은 PNG 형식으로 다운로드됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="image-mosaic" />
    </div>
  );
}
