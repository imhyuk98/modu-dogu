"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

type AspectRatio = "free" | "1:1" | "16:9" | "4:3" | "3:2" | "9:16";

interface CropArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

const ASPECT_RATIOS: { label: string; value: AspectRatio }[] = [
  { label: "자유", value: "free" },
  { label: "1:1", value: "1:1" },
  { label: "16:9", value: "16:9" },
  { label: "4:3", value: "4:3" },
  { label: "3:2", value: "3:2" },
  { label: "9:16", value: "9:16" },
];

function getAspectValue(ratio: AspectRatio): number | null {
  switch (ratio) {
    case "1:1": return 1;
    case "16:9": return 16 / 9;
    case "4:3": return 4 / 3;
    case "3:2": return 3 / 2;
    case "9:16": return 9 / 16;
    default: return null;
  }
}

type DragMode = "move" | "nw" | "ne" | "sw" | "se" | "n" | "s" | "e" | "w" | null;

export default function ImageCrop() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("free");
  const [crop, setCrop] = useState<CropArea>({ x: 0, y: 0, w: 0, h: 0 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("image");

  // Canvas display scale: image may be scaled to fit the container
  const [scale, setScale] = useState(1);
  const [imgDisplayW, setImgDisplayW] = useState(0);
  const [imgDisplayH, setImgDisplayH] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<{ mode: DragMode; startX: number; startY: number; startCrop: CropArea }>({
    mode: null, startX: 0, startY: 0, startCrop: { x: 0, y: 0, w: 0, h: 0 },
  });

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageSrc(url);
      setImageEl(img);
    };
    img.src = url;
  }, []);

  // Calculate display dimensions & initial crop when image loads
  useEffect(() => {
    if (!imageEl || !containerRef.current) return;
    const containerW = containerRef.current.clientWidth;
    const maxH = 500;
    const natW = imageEl.naturalWidth;
    const natH = imageEl.naturalHeight;
    const s = Math.min(containerW / natW, maxH / natH, 1);
    setScale(s);
    setImgDisplayW(Math.round(natW * s));
    setImgDisplayH(Math.round(natH * s));

    // Default crop: 80% centered
    const cw = Math.round(natW * 0.8);
    const ch = Math.round(natH * 0.8);
    const cx = Math.round((natW - cw) / 2);
    const cy = Math.round((natH - ch) / 2);
    setCrop({ x: cx, y: cy, w: cw, h: ch });
    setPreviewUrl(null);
  }, [imageEl]);

  // Enforce aspect ratio when ratio changes
  useEffect(() => {
    if (!imageEl) return;
    const ar = getAspectValue(aspectRatio);
    if (!ar) return;
    const natW = imageEl.naturalWidth;
    const natH = imageEl.naturalHeight;
    let newW = crop.w;
    let newH = Math.round(newW / ar);
    if (newH > natH) {
      newH = natH;
      newW = Math.round(newH * ar);
    }
    if (newW > natW) {
      newW = natW;
      newH = Math.round(newW / ar);
    }
    const nx = Math.min(crop.x, natW - newW);
    const ny = Math.min(crop.y, natH - newH);
    setCrop({ x: Math.max(0, nx), y: Math.max(0, ny), w: newW, h: newH });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspectRatio]);

  // Draw overlay on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageEl) return;
    canvas.width = imgDisplayW;
    canvas.height = imgDisplayH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Dark overlay
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    const dx = crop.x * scale;
    const dy = crop.y * scale;
    const dw = crop.w * scale;
    const dh = crop.h * scale;
    ctx.clearRect(dx, dy, dw, dh);

    // Border
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, dy, dw, dh);

    // Grid lines (rule of thirds)
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(dx + (dw / 3) * i, dy);
      ctx.lineTo(dx + (dw / 3) * i, dy + dh);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(dx, dy + (dh / 3) * i);
      ctx.lineTo(dx + dw, dy + (dh / 3) * i);
      ctx.stroke();
    }

    // Corner handles
    const hs = 8;
    ctx.fillStyle = "#3b82f6";
    const corners = [
      [dx, dy], [dx + dw, dy], [dx, dy + dh], [dx + dw, dy + dh],
    ];
    for (const [cx, cy] of corners) {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
    }
    // Edge handles
    const edges = [
      [dx + dw / 2, dy], [dx + dw / 2, dy + dh],
      [dx, dy + dh / 2], [dx + dw, dy + dh / 2],
    ];
    for (const [cx, cy] of edges) {
      ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
    }
  }, [imageEl, crop, scale, imgDisplayW, imgDisplayH]);

  const getMousePos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { mx: 0, my: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return { mx: clientX - rect.left, my: clientY - rect.top };
  };

  const getDragMode = (mx: number, my: number): DragMode => {
    const dx = crop.x * scale;
    const dy = crop.y * scale;
    const dw = crop.w * scale;
    const dh = crop.h * scale;
    const t = 12; // hit tolerance

    const nearLeft = Math.abs(mx - dx) < t;
    const nearRight = Math.abs(mx - (dx + dw)) < t;
    const nearTop = Math.abs(my - dy) < t;
    const nearBottom = Math.abs(my - (dy + dh)) < t;

    if (nearLeft && nearTop) return "nw";
    if (nearRight && nearTop) return "ne";
    if (nearLeft && nearBottom) return "sw";
    if (nearRight && nearBottom) return "se";
    if (nearTop && mx > dx && mx < dx + dw) return "n";
    if (nearBottom && mx > dx && mx < dx + dw) return "s";
    if (nearLeft && my > dy && my < dy + dh) return "w";
    if (nearRight && my > dy && my < dy + dh) return "e";
    if (mx > dx && mx < dx + dw && my > dy && my < dy + dh) return "move";
    return null;
  };

  const clampCrop = useCallback((c: CropArea): CropArea => {
    if (!imageEl) return c;
    const natW = imageEl.naturalWidth;
    const natH = imageEl.naturalHeight;
    const minSize = 10;
    let { x, y, w, h } = c;
    w = Math.max(minSize, Math.min(w, natW));
    h = Math.max(minSize, Math.min(h, natH));
    x = Math.max(0, Math.min(x, natW - w));
    y = Math.max(0, Math.min(y, natH - h));
    return { x, y, w, h };
  }, [imageEl]);

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const { mx, my } = getMousePos(e);
    const mode = getDragMode(mx, my);
    if (!mode) return;
    dragRef.current = { mode, startX: mx, startY: my, startCrop: { ...crop } };

    const handleMove = (ev: MouseEvent | TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || !dragRef.current.mode) return;
      const rect = canvas.getBoundingClientRect();
      const cx = "touches" in ev ? ev.touches[0].clientX : ev.clientX;
      const cy = "touches" in ev ? ev.touches[0].clientY : ev.clientY;
      const mx2 = cx - rect.left;
      const my2 = cy - rect.top;
      const dxPx = mx2 - dragRef.current.startX;
      const dyPx = my2 - dragRef.current.startY;
      const dxNat = dxPx / scale;
      const dyNat = dyPx / scale;
      const sc = dragRef.current.startCrop;
      const ar = getAspectValue(aspectRatio);

      let newCrop: CropArea;

      switch (dragRef.current.mode) {
        case "move":
          newCrop = { x: sc.x + dxNat, y: sc.y + dyNat, w: sc.w, h: sc.h };
          break;
        case "se": {
          let nw = sc.w + dxNat;
          let nh = ar ? nw / ar : sc.h + dyNat;
          newCrop = { x: sc.x, y: sc.y, w: nw, h: nh };
          break;
        }
        case "sw": {
          let nw = sc.w - dxNat;
          let nh = ar ? nw / ar : sc.h + dyNat;
          newCrop = { x: sc.x + dxNat, y: sc.y, w: nw, h: nh };
          break;
        }
        case "ne": {
          let nw = sc.w + dxNat;
          let nh = ar ? nw / ar : sc.h - dyNat;
          newCrop = { x: sc.x, y: ar ? sc.y - (nw / ar - sc.h) : sc.y + dyNat, w: nw, h: nh };
          break;
        }
        case "nw": {
          let nw = sc.w - dxNat;
          let nh = ar ? nw / ar : sc.h - dyNat;
          newCrop = { x: sc.x + dxNat, y: ar ? sc.y + sc.h - nw / ar : sc.y + dyNat, w: nw, h: nh };
          break;
        }
        case "n": {
          let nh = sc.h - dyNat;
          let nw = ar ? nh * ar : sc.w;
          newCrop = { x: ar ? sc.x + (sc.w - nw) / 2 : sc.x, y: sc.y + dyNat, w: nw, h: nh };
          break;
        }
        case "s": {
          let nh = sc.h + dyNat;
          let nw = ar ? nh * ar : sc.w;
          newCrop = { x: ar ? sc.x + (sc.w - nw) / 2 : sc.x, y: sc.y, w: nw, h: nh };
          break;
        }
        case "w": {
          let nw = sc.w - dxNat;
          let nh = ar ? nw / ar : sc.h;
          newCrop = { x: sc.x + dxNat, y: ar ? sc.y + (sc.h - nh) / 2 : sc.y, w: nw, h: nh };
          break;
        }
        case "e": {
          let nw = sc.w + dxNat;
          let nh = ar ? nw / ar : sc.h;
          newCrop = { x: sc.x, y: ar ? sc.y + (sc.h - nh) / 2 : sc.y, w: nw, h: nh };
          break;
        }
        default:
          return;
      }
      setCrop(clampCrop(newCrop));
    };

    const handleUp = () => {
      dragRef.current.mode = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
  };

  const handleCursorStyle = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { mx, my } = getMousePos(e);
    const mode = getDragMode(mx, my);
    const cursors: Record<string, string> = {
      move: "move", nw: "nw-resize", ne: "ne-resize", sw: "sw-resize", se: "se-resize",
      n: "n-resize", s: "s-resize", e: "e-resize", w: "w-resize",
    };
    canvas.style.cursor = mode ? cursors[mode] || "default" : "crosshair";
  };

  const generateCrop = useCallback(() => {
    if (!imageEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.w);
    canvas.height = Math.round(crop.h);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      imageEl,
      Math.round(crop.x), Math.round(crop.y),
      Math.round(crop.w), Math.round(crop.h),
      0, 0,
      Math.round(crop.w), Math.round(crop.h)
    );
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    canvas.toBlob((blob) => {
      if (blob) setPreviewUrl(URL.createObjectURL(blob));
    }, "image/png");
  }, [imageEl, crop, previewUrl]);

  const handleDownload = () => {
    if (!imageEl) return;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(crop.w);
    canvas.height = Math.round(crop.h);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(
      imageEl,
      Math.round(crop.x), Math.round(crop.y),
      Math.round(crop.w), Math.round(crop.h),
      0, 0,
      Math.round(crop.w), Math.round(crop.h)
    );
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}_cropped.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) loadImage(e.dataTransfer.files[0]);
  }, [loadImage]);

  const handleReset = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageSrc(null);
    setImageEl(null);
    setPreviewUrl(null);
    setCrop({ x: 0, y: 0, w: 0, h: 0 });
    setAspectRatio("free");
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 자르기
      </h1>
      <p className="text-gray-500 mb-8">
        이미지를 원하는 영역만 선택하여 자를 수 있습니다. 다양한 비율 프리셋을 지원합니다.
      </p>

      {/* Drop Zone */}
      {!imageEl && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }`}
        >
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-gray-600 font-medium">이미지를 여기에 드래그하거나 클릭하여 선택하세요</p>
          <p className="text-gray-400 text-sm mt-1">PNG, JPG, WebP, GIF 등 지원</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => { if (e.target.files?.[0]) loadImage(e.target.files[0]); e.target.value = ""; }}
            className="hidden"
          />
        </div>
      )}

      {/* Editor */}
      {imageEl && (
        <>
          {/* Aspect Ratio Presets */}
          <div className="calc-card p-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">비율:</span>
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  className={`calc-preset ${
                    aspectRatio === ar.value
                      ? "!bg-blue-50 !border-blue-500 !text-blue-700"
                      : ""
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Canvas */}
          <div className="calc-card p-4 mb-4">
            <div
              ref={containerRef}
              className="relative inline-block mx-auto w-full"
              style={{ maxWidth: imgDisplayW }}
            >
              <img
                src={imageSrc!}
                alt="원본"
                className="block w-full"
                style={{ width: imgDisplayW, height: imgDisplayH }}
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0"
                style={{ width: imgDisplayW, height: imgDisplayH, touchAction: "none" }}
                onMouseDown={handlePointerDown}
                onMouseMove={handleCursorStyle}
                onTouchStart={handlePointerDown}
              />
            </div>

            {/* Crop Info */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
              <span>
                선택 영역: <strong className="text-gray-900">{Math.round(crop.w)} x {Math.round(crop.h)}px</strong>
              </span>
              <span>
                위치: <strong className="text-gray-900">({Math.round(crop.x)}, {Math.round(crop.y)})</strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={generateCrop} className="calc-btn-primary">
              미리보기
            </button>
            <button onClick={handleDownload} className="calc-btn-primary">
              다운로드
            </button>
            <button onClick={handleReset} className="calc-btn-secondary">
              다른 이미지
            </button>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="calc-card p-4 mb-6">
              <h2 className="font-semibold text-gray-900 mb-3">크롭 미리보기</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 inline-block max-w-full">
                <img
                  src={previewUrl}
                  alt="크롭 결과"
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center mb-12">
        모든 처리는 브라우저에서 이루어지며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 자르기 도구 소개</h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              이미지 자르기(크롭)는 사진이나 그래픽에서 원하는 영역만 선택하여 잘라내는 작업입니다. 불필요한 배경을 제거하거나, SNS 업로드에 맞는 비율로 조정하거나, 특정 피사체를 강조할 때 유용합니다.
            </p>
            <p>
              이 도구는 별도의 프로그램 설치 없이 브라우저에서 바로 사용할 수 있으며, 업로드한 이미지는 서버로 전송되지 않아 개인정보가 안전하게 보호됩니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">주요 비율 프리셋 안내</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">비율</th>
                  <th className="text-left py-2 px-3 border border-gray-200">용도</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">1:1</td>
                  <td className="py-2 px-3 border border-gray-200">인스타그램 피드, 프로필 사진</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">16:9</td>
                  <td className="py-2 px-3 border border-gray-200">유튜브 썸네일, 와이드 모니터 배경</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">4:3</td>
                  <td className="py-2 px-3 border border-gray-200">프레젠테이션, 일반 사진</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">3:2</td>
                  <td className="py-2 px-3 border border-gray-200">DSLR 사진 비율, 인쇄물</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">9:16</td>
                  <td className="py-2 px-3 border border-gray-200">인스타그램 스토리, 틱톡, 유튜브 쇼츠</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">자른 이미지의 화질이 떨어지나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                아닙니다. 원본 이미지의 해당 영역을 그대로 잘라내기 때문에 화질 손실이 없습니다. 출력은 PNG 포맷으로 저장되어 무손실 품질을 유지합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">최대 이미지 크기 제한이 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                서버를 사용하지 않고 브라우저에서 처리하므로 별도의 크기 제한은 없습니다. 다만 매우 큰 이미지는 브라우저 메모리에 따라 처리가 느려질 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">모바일에서도 사용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 터치 이벤트를 지원하여 모바일 브라우저에서도 드래그로 크롭 영역을 조절할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="image-crop" />
    </div>
  );
}
