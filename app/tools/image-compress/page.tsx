"use client";

import { useState, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

interface ImageFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  width: number;
  height: number;
}

interface CompressedFile {
  id: string;
  originalName: string;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
  blobUrl: string;
  width: number;
  height: number;
}

export default function ImageCompress() {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [compressed, setCompressed] = useState<CompressedFile | null>(null);
  const [quality, setQuality] = useState(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;

    // Clean up previous
    setImageFile((prev) => {
      if (prev) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    setCompressed((prev) => {
      if (prev) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageFile({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        previewUrl: url,
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
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

  const handleCompress = useCallback(() => {
    if (!imageFile) return;
    setIsCompressing(true);

    // Clean up previous compressed
    setCompressed((prev) => {
      if (prev) URL.revokeObjectURL(prev.blobUrl);
      return null;
    });

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setIsCompressing(false);
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Determine output format based on original or use jpeg for best compression
      const isJpeg =
        imageFile.file.type === "image/jpeg" ||
        imageFile.file.type === "image/jpg";
      const isWebp = imageFile.file.type === "image/webp";

      let mimeType = "image/jpeg";
      let ext = ".jpg";
      if (isWebp) {
        mimeType = "image/webp";
        ext = ".webp";
      } else if (!isJpeg) {
        // PNG or other -> compress as WebP for better results
        mimeType = "image/webp";
        ext = ".webp";
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsCompressing(false);
            return;
          }

          const blobUrl = URL.createObjectURL(blob);
          const baseName = imageFile.name.replace(/\.[^.]+$/, "");

          setCompressed({
            id: imageFile.id,
            originalName: imageFile.name,
            originalSize: imageFile.size,
            compressedSize: blob.size,
            previewUrl: blobUrl,
            blobUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          setIsCompressing(false);
        },
        mimeType,
        quality / 100
      );
    };
    img.onerror = () => setIsCompressing(false);
    img.src = imageFile.previewUrl;
  }, [imageFile, quality]);

  const handleDownload = () => {
    if (!compressed || !imageFile) return;
    const isJpeg =
      imageFile.file.type === "image/jpeg" ||
      imageFile.file.type === "image/jpg";
    const ext = isJpeg ? ".jpg" : ".webp";
    const baseName = imageFile.name.replace(/\.[^.]+$/, "");

    const a = document.createElement("a");
    a.href = compressed.blobUrl;
    a.download = `${baseName}_compressed${ext}`;
    a.click();
  };

  const handleReset = () => {
    if (imageFile) URL.revokeObjectURL(imageFile.previewUrl);
    if (compressed) URL.revokeObjectURL(compressed.blobUrl);
    setImageFile(null);
    setCompressed(null);
    setQuality(80);
  };

  const reductionPercent = compressed
    ? (
        ((compressed.originalSize - compressed.compressedSize) /
          compressed.originalSize) *
        100
      ).toFixed(1)
    : null;

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 압축
      </h1>
      <p className="text-gray-500 mb-8">
        JPG, PNG, WebP 이미지의 용량을 품질 조절로 간편하게 줄여보세요.
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
            {/* Preview */}
            <div className="sm:w-48 flex-shrink-0">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                <img
                  src={imageFile.previewUrl}
                  alt={imageFile.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <p className="text-sm text-gray-900 font-medium truncate">
                {imageFile.name}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">파일 크기</p>
                  <p className="font-semibold text-gray-900">
                    {formatSize(imageFile.size)}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">해상도</p>
                  <p className="font-semibold text-gray-900">
                    {imageFile.width} x {imageFile.height}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quality Slider & Compress */}
      {imageFile && (
        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">압축 설정</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              품질: {quality}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={quality}
              onChange={(e) => setQuality(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>낮은 품질 (작은 용량)</span>
              <span>높은 품질 (큰 용량)</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-gray-400 font-medium self-center mr-1">
              빠른 선택
            </span>
            {[20, 40, 60, 80, 100].map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`calc-preset ${
                  quality === q
                    ? "!bg-blue-50 !border-blue-400 !text-blue-600"
                    : ""
                }`}
              >
                {q}%
              </button>
            ))}
          </div>

          <button
            onClick={handleCompress}
            disabled={isCompressing}
            className="w-full calc-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCompressing ? "압축 중..." : "압축하기"}
          </button>
        </div>
      )}

      {/* Compressed Result */}
      {compressed && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          {/* Result Header */}
          <div className="calc-result-header">
            <p className="text-blue-200 text-sm mb-1 relative z-10">
              압축 결과
            </p>
            <div className="flex items-center justify-center gap-2 relative z-10">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                -{reductionPercent}%
              </p>
            </div>
            <p className="text-blue-200/80 text-sm mt-2 relative z-10">
              {formatSize(compressed.originalSize)} →{" "}
              {formatSize(compressed.compressedSize)}
            </p>
          </div>

          <div className="p-6">
            {/* Before / After Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                  <img
                    src={imageFile!.previewUrl}
                    alt="원본"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900">원본</p>
                <p className="text-xs text-gray-400">
                  {formatSize(compressed.originalSize)}
                </p>
              </div>
              <div className="text-center">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-2">
                  <img
                    src={compressed.previewUrl}
                    alt="압축 후"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-xs font-medium text-gray-900">압축 후</p>
                <p className="text-xs text-gray-400">
                  {formatSize(compressed.compressedSize)}
                </p>
              </div>
            </div>

            {/* Size Comparison Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>원본: {formatSize(compressed.originalSize)}</span>
                <span>압축: {formatSize(compressed.compressedSize)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      (compressed.compressedSize / compressed.originalSize) *
                        100,
                      2
                    )}%`,
                  }}
                />
              </div>
              <p className="text-center text-sm font-medium mt-2">
                {compressed.compressedSize < compressed.originalSize ? (
                  <span className="text-green-600">
                    {formatSize(
                      compressed.originalSize - compressed.compressedSize
                    )}{" "}
                    절약
                  </span>
                ) : (
                  <span className="text-red-500">
                    압축 후 용량이 더 커졌습니다. 품질을 낮춰보세요.
                  </span>
                )}
              </p>
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
        모든 압축은 브라우저에서 처리되며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 압축이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이미지 압축은 이미지 파일의 용량을 줄이는 과정입니다. 손실 압축 방식을
            사용하여 시각적 품질을 최대한 유지하면서 파일 크기를 줄입니다. 웹사이트
            로딩 속도 개선, 저장 공간 절약, 이메일 첨부 등 다양한 상황에서
            유용합니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 압축이 필요한 경우</h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              <strong className="text-gray-900">웹사이트 최적화:</strong>{" "}
              이미지 용량을 줄이면 페이지 로딩 속도가 빨라지고, Google Core Web
              Vitals 점수가 향상됩니다.
            </p>
            <p>
              <strong className="text-gray-900">이메일 첨부:</strong>{" "}
              대부분의 이메일 서비스는 첨부파일 크기를 25MB로 제한합니다. 이미지를
              압축하면 용량 제한 없이 전송할 수 있습니다.
            </p>
            <p>
              <strong className="text-gray-900">SNS 업로드:</strong>{" "}
              소셜 미디어에 이미지를 업로드할 때 미리 압축하면 업로드 시간이
              단축되고, 플랫폼의 자동 압축으로 인한 화질 저하를 예방할 수
              있습니다.
            </p>
            <p>
              <strong className="text-gray-900">저장 공간 절약:</strong>{" "}
              스마트폰이나 클라우드 저장소의 용량이 부족할 때 이미지를 압축하여
              공간을 확보할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-gray-900">
                압축하면 화질이 많이 떨어지나요?
              </h3>
              <p className="text-gray-600 mt-1">
                품질 60~80% 수준에서는 육안으로 차이를 구분하기 어렵습니다.
                용도에 따라 적절한 품질을 선택하세요. 웹용 이미지는 70~80%,
                인쇄용은 90% 이상을 권장합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                PNG 이미지도 압축할 수 있나요?
              </h3>
              <p className="text-gray-600 mt-1">
                네, PNG 이미지는 WebP 형식으로 변환하여 압축합니다. WebP는
                투명 배경을 지원하면서도 PNG보다 훨씬 작은 파일 크기를
                제공합니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                이미지가 서버로 전송되나요?
              </h3>
              <p className="text-gray-600 mt-1">
                아니요, 모든 압축은 브라우저(Canvas API)에서 처리되며 이미지가
                서버로 전송되지 않습니다. 개인 사진이나 민감한 이미지도 안심하고
                사용할 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                최대 파일 크기 제한이 있나요?
              </h3>
              <p className="text-gray-600 mt-1">
                별도의 파일 크기 제한은 없지만, 매우 큰 이미지(50MB 이상)는
                브라우저 메모리에 따라 처리가 느려질 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="image-compress" />
    </div>
  );
}
