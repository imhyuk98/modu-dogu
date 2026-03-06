"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

interface ImageFile {
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
}

interface ResizedFile {
  previewUrl: string;
  blobUrl: string;
  width: number;
  height: number;
  size: number;
  name: string;
}

const PRESETS = [
  { label: "1080 x 1080", width: 1080, height: 1080, desc: "인스타그램 정사각형" },
  { label: "1920 x 1080", width: 1920, height: 1080, desc: "풀HD / 유튜브 썸네일" },
  { label: "800 x 600", width: 800, height: 600, desc: "웹 표준" },
  { label: "1200 x 630", width: 1200, height: 630, desc: "OG 이미지 (SNS 공유)" },
  { label: "500 x 500", width: 500, height: 500, desc: "프로필 이미지" },
  { label: "사용자 지정", width: 0, height: 0, desc: "직접 입력" },
];

export default function ImageResize() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [resized, setResized] = useState<ResizedFile | null>(null);
  const [targetWidth, setTargetWidth] = useState("");
  const [targetHeight, setTargetHeight] = useState("");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Track which dimension the user edited last
  const lastEdited = useRef<"width" | "height" | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    setImageFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setResized((prev) => {
      if (prev) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });
    setActivePreset(null);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageFile({
        file,
        name: file.name,
        size: file.size,
        previewUrl: url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
      setTargetWidth(String(img.naturalWidth));
      setTargetHeight(String(img.naturalHeight));
    };
    img.src = url;
  }, []);

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
    if (e.target.files && e.target.files.length > 0) {
      loadImage(e.target.files[0]);
      e.target.value = "";
    }
  };

  const handleWidthChange = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setTargetWidth(num);
    setActivePreset(null);
    lastEdited.current = "width";

    if (keepAspectRatio && imageFile && num) {
      const w = parseInt(num, 10);
      const ratio = imageFile.height / imageFile.width;
      setTargetHeight(String(Math.round(w * ratio)));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    setTargetHeight(num);
    setActivePreset(null);
    lastEdited.current = "height";

    if (keepAspectRatio && imageFile && num) {
      const h = parseInt(num, 10);
      const ratio = imageFile.width / imageFile.height;
      setTargetWidth(String(Math.round(h * ratio)));
    }
  };

  const handlePreset = (index: number) => {
    const preset = PRESETS[index];
    setActivePreset(index);
    if (preset.width === 0 && preset.height === 0) {
      // Custom: let user type freely
      if (imageFile) {
        setTargetWidth(String(imageFile.width));
        setTargetHeight(String(imageFile.height));
      }
      return;
    }
    setTargetWidth(String(preset.width));
    setTargetHeight(String(preset.height));
    setKeepAspectRatio(false);
  };

  const handleToggleAspectRatio = () => {
    const next = !keepAspectRatio;
    setKeepAspectRatio(next);

    if (next && imageFile && targetWidth) {
      // Recalculate height based on current width
      const w = parseInt(targetWidth, 10);
      const ratio = imageFile.height / imageFile.width;
      setTargetHeight(String(Math.round(w * ratio)));
    }
  };

  const handleResize = useCallback(() => {
    if (!imageFile || !targetWidth || !targetHeight) return;

    const w = parseInt(targetWidth, 10);
    const h = parseInt(targetHeight, 10);
    if (w <= 0 || h <= 0) return;

    setIsResizing(true);
    setResized((prev) => {
      if (prev) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsResizing(false);
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);

      // Determine output format
      const isJpeg =
        imageFile.file.type === "image/jpeg" ||
        imageFile.file.type === "image/jpg";
      const mimeType = isJpeg ? "image/jpeg" : "image/png";
      const ext = isJpeg ? ".jpg" : ".png";

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsResizing(false);
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const baseName = imageFile.name.replace(/\.[^.]+$/, "");

          setResized({
            previewUrl: blobUrl,
            blobUrl,
            width: w,
            height: h,
            size: blob.size,
            name: `${baseName}_${w}x${h}${ext}`,
          });
          setIsResizing(false);
        },
        mimeType,
        0.92
      );
    };
    img.onerror = () => setIsResizing(false);
    img.src = imageFile.previewUrl;
  }, [imageFile, targetWidth, targetHeight]);

  const handleDownload = () => {
    if (!resized) return;
    const a = document.createElement("a");
    a.href = resized.blobUrl;
    a.download = resized.name;
    a.click();
  };

  const handleReset = () => {
    if (imageFile) URL.revokeObjectURL(imageFile.previewUrl);
    if (resized) URL.revokeObjectURL(resized.blobUrl);
    setImageFile(null);
    setResized(null);
    setTargetWidth("");
    setTargetHeight("");
    setActivePreset(null);
    setKeepAspectRatio(true);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 크기 조절
      </h1>
      <p className="text-gray-500 mb-8">
        이미지의 가로/세로 크기를 원하는 사이즈로 조절하세요.
      </p>

      {/* Drop Zone */}
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
          JPG, PNG, WebP 지원
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Original Image Info */}
      {imageFile && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">원본 이미지</h2>
            <button
              onClick={handleReset}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              삭제
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="sm:w-48 flex-shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageFile.previewUrl}
                  alt={imageFile.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-900 font-medium truncate">
                {imageFile.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">크기</p>
                  <p className="font-semibold text-gray-900">
                    {imageFile.width} x {imageFile.height} px
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">파일 크기</p>
                  <p className="font-semibold text-gray-900">
                    {formatSize(imageFile.size)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resize Settings */}
      {imageFile && (
        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">크기 설정</h2>

          {/* Preset Sizes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              프리셋 사이즈
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => handlePreset(i)}
                  className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                    activePreset === i
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium">{preset.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Width & Height Inputs */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가로 (px)
              </label>
              <input
                type="text"
                value={targetWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                placeholder="가로"
                className="calc-input"
              />
            </div>

            {/* Aspect Ratio Lock */}
            <button
              onClick={handleToggleAspectRatio}
              className={`mt-6 p-2 rounded-lg border transition-colors ${
                keepAspectRatio
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-gray-200 text-gray-400 hover:border-gray-300"
              }`}
              title={keepAspectRatio ? "비율 잠금 해제" : "비율 잠금"}
            >
              {keepAspectRatio ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                세로 (px)
              </label>
              <input
                type="text"
                value={targetHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                placeholder="세로"
                className="calc-input"
              />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">
            {keepAspectRatio
              ? "비율 잠금: 가로 또는 세로 값을 변경하면 비율이 자동으로 유지됩니다."
              : "비율 잠금 해제: 가로/세로를 자유롭게 입력할 수 있습니다."}
          </p>

          <button
            onClick={handleResize}
            disabled={isResizing || !targetWidth || !targetHeight}
            className="w-full calc-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResizing ? "크기 조절 중..." : "크기 조절하기"}
          </button>
        </div>
      )}

      {/* Resized Result */}
      {resized && imageFile && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          <div className="calc-result-header">
            <p className="text-blue-200 text-sm mb-1 relative z-10">
              크기 조절 완료
            </p>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {resized.width} x {resized.height}
              </p>
            </div>
            <p className="text-blue-200/80 text-sm mt-2 relative z-10">
              {imageFile.width}x{imageFile.height} → {resized.width}x
              {resized.height}
            </p>
          </div>

          <div className="p-6">
            {/* Before / After */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                  <img
                    src={imageFile.previewUrl}
                    alt="원본"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900">원본</p>
                <p className="text-xs text-gray-400">
                  {imageFile.width} x {imageFile.height} px
                </p>
                <p className="text-xs text-gray-400">
                  {formatSize(imageFile.size)}
                </p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                  <img
                    src={resized.previewUrl}
                    alt="크기 조절 후"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900">
                  크기 조절 후
                </p>
                <p className="text-xs text-gray-400">
                  {resized.width} x {resized.height} px
                </p>
                <p className="text-xs text-gray-400">
                  {formatSize(resized.size)}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full calc-btn-primary"
            >
              다운로드
            </button>
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center mb-12">
        모든 처리는 브라우저에서 이루어지며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 크기 조절이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이미지 크기 조절(리사이즈)은 이미지의 가로/세로 픽셀 수를 변경하는
            작업입니다. 웹사이트에 업로드하거나 SNS에 공유할 때 적절한 크기로
            조절하면 로딩 속도가 빨라지고 보다 깔끔하게 표시됩니다. 비율을
            유지하면 이미지가 왜곡되지 않습니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">SNS별 권장 이미지 크기</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>플랫폼</th>
                  <th>용도</th>
                  <th className="text-right">권장 크기</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">인스타그램</td>
                  <td>피드 정사각형</td>
                  <td className="text-right">1080 x 1080</td>
                </tr>
                <tr>
                  <td className="font-medium">인스타그램</td>
                  <td>스토리/릴스</td>
                  <td className="text-right">1080 x 1920</td>
                </tr>
                <tr>
                  <td className="font-medium">유튜브</td>
                  <td>썸네일</td>
                  <td className="text-right">1280 x 720</td>
                </tr>
                <tr>
                  <td className="font-medium">페이스북</td>
                  <td>공유 이미지</td>
                  <td className="text-right">1200 x 630</td>
                </tr>
                <tr>
                  <td className="font-medium">트위터/X</td>
                  <td>이미지 트윗</td>
                  <td className="text-right">1200 x 675</td>
                </tr>
                <tr>
                  <td className="font-medium">블로그</td>
                  <td>OG 이미지</td>
                  <td className="text-right">1200 x 630</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">
                이미지를 확대하면 화질이 떨어지나요?
              </h3>
              <p className="text-gray-600 mt-1">
                네, 원본보다 크게 확대하면 픽셀이 보이면서 화질이 저하됩니다.
                가능하면 원본 크기 이하로 줄이는 것을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                비율 유지를 해제하면 어떻게 되나요?
              </h3>
              <p className="text-gray-600 mt-1">
                비율 잠금을 해제하면 가로/세로를 자유롭게 설정할 수 있지만,
                원본과 비율이 다르면 이미지가 늘어나거나 찌그러질 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                어떤 포맷으로 저장되나요?
              </h3>
              <p className="text-gray-600 mt-1">
                원본이 JPG(JPEG)이면 JPG로, 그 외(PNG, WebP 등)는 PNG로
                저장됩니다. 포맷 변환이 필요하면 이미지 변환기를 함께
                사용하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                이미지가 서버로 전송되나요?
              </h3>
              <p className="text-gray-600 mt-1">
                아니요, 모든 처리는 브라우저의 Canvas API를 사용하여 로컬에서
                이루어집니다. 이미지가 외부로 전송되지 않으므로 안전합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="image-resize" />
    </div>
  );
}
