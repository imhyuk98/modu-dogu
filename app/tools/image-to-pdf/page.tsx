"use client";

import { useState, useRef, useCallback } from "react";

interface ImageItem {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

type PageSize = "a4" | "letter" | "original";
type Orientation = "portrait" | "landscape" | "auto";

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(10);
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadImage = (file: File): Promise<ImageItem> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () =>
          resolve({
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            file,
            dataUrl: reader.result as string,
            width: img.width,
            height: img.height,
          });
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;
    const items = await Promise.all(validFiles.map(loadImage));
    setImages((prev) => [...prev, ...items]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOverItem = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    moveImage(dragIdx, idx);
    setDragIdx(idx);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const { jsPDF } = await import("jspdf");

      // Page dimensions in mm
      const pageSizes: Record<string, [number, number]> = {
        a4: [210, 297],
        letter: [215.9, 279.4],
      };

      // Create first page based on first image to determine initial orientation
      const firstImg = images[0];
      let firstOrientation = orientation;
      if (firstOrientation === "auto") {
        firstOrientation = firstImg.width > firstImg.height ? "landscape" : "portrait";
      }

      let pdfWidth: number;
      let pdfHeight: number;

      if (pageSize === "original") {
        // Convert pixels to mm (assuming 96 DPI)
        pdfWidth = (firstImg.width * 25.4) / 96;
        pdfHeight = (firstImg.height * 25.4) / 96;
      } else {
        const [w, h] = pageSizes[pageSize];
        if (firstOrientation === "landscape") {
          pdfWidth = h;
          pdfHeight = w;
        } else {
          pdfWidth = w;
          pdfHeight = h;
        }
      }

      const pdf = new jsPDF({
        orientation: firstOrientation === "landscape" ? "landscape" : "portrait",
        unit: "mm",
        format: pageSize === "original" ? [pdfWidth, pdfHeight] : (pageSize === "a4" ? "a4" : "letter"),
      });

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        if (i > 0) {
          let pageOri = orientation;
          if (pageOri === "auto") {
            pageOri = img.width > img.height ? "landscape" : "portrait";
          }

          if (pageSize === "original") {
            const pw = (img.width * 25.4) / 96;
            const ph = (img.height * 25.4) / 96;
            pdf.addPage([pw, ph], pageOri === "landscape" ? "landscape" : "portrait");
          } else {
            pdf.addPage(pageSize === "a4" ? "a4" : "letter", pageOri === "landscape" ? "landscape" : "portrait");
          }
        }

        const currentPageWidth = pdf.internal.pageSize.getWidth();
        const currentPageHeight = pdf.internal.pageSize.getHeight();
        const m = margin;

        const availW = currentPageWidth - m * 2;
        const availH = currentPageHeight - m * 2;

        if (pageSize === "original") {
          pdf.addImage(img.dataUrl, "JPEG", m, m, availW, availH);
        } else {
          // Fit image within available area maintaining aspect ratio
          const imgRatio = img.width / img.height;
          const areaRatio = availW / availH;

          let drawW: number;
          let drawH: number;

          if (imgRatio > areaRatio) {
            drawW = availW;
            drawH = availW / imgRatio;
          } else {
            drawH = availH;
            drawW = availH * imgRatio;
          }

          const x = m + (availW - drawW) / 2;
          const y = m + (availH - drawH) / 2;

          pdf.addImage(img.dataUrl, "JPEG", x, y, drawW, drawH);
        }
      }

      pdf.save("images.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF 생성 중 오류가 발생했습니다.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          이미지 PDF 변환
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          여러 장의 이미지를 하나의 PDF 파일로 변환하세요. 서버 업로드 없이 브라우저에서 안전하게 처리됩니다.
        </p>
      </div>

      {/* Upload Area */}
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
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="text-center py-8">
          <div className="text-5xl mb-4">📄</div>
          <p className="text-gray-700 font-semibold mb-1">
            이미지를 드래그하거나 클릭하여 추가
          </p>
          <p className="text-gray-400 text-sm">
            JPG, PNG, WebP, GIF 등 지원 | 여러 파일 동시 선택 가능
          </p>
        </div>
      </div>

      {/* Options */}
      {images.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full" />
            PDF 설정
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Page Size */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                용지 크기
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as PageSize)}
                className="calc-input"
              >
                <option value="a4">A4 (210 x 297mm)</option>
                <option value="letter">Letter (8.5 x 11in)</option>
                <option value="original">원본 크기</option>
              </select>
            </div>

            {/* Orientation */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                방향
              </label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as Orientation)}
                className="calc-input"
              >
                <option value="portrait">세로 (Portrait)</option>
                <option value="landscape">가로 (Landscape)</option>
                <option value="auto">자동 (이미지에 맞춤)</option>
              </select>
            </div>

            {/* Margin */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                여백 ({margin}mm)
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0mm</span>
                <span>30mm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              이미지 목록 ({images.length}장)
            </h3>
            <button
              onClick={() => setImages([])}
              className="text-xs text-red-500 hover:text-red-700 font-medium"
            >
              전체 삭제
            </button>
          </div>

          <div className="space-y-3">
            {images.map((img, idx) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOverItem(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  dragIdx === idx
                    ? "border-blue-400 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                  </svg>
                </div>

                {/* Thumbnail */}
                <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={img.dataUrl}
                    alt={img.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {img.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {img.width} x {img.height}px | {(img.file.size / 1024).toFixed(0)}KB
                  </p>
                </div>

                {/* Page number */}
                <span className="text-xs text-gray-400 font-mono flex-shrink-0">
                  {idx + 1}/{images.length}
                </span>

                {/* Move buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveImage(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="위로 이동"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveImage(idx, idx + 1)}
                    disabled={idx === images.length - 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="아래로 이동"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeImage(img.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="삭제"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Add more */}
          <button
            onClick={() => fileRef.current?.click()}
            className="calc-btn-secondary w-full mt-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            이미지 추가
          </button>
        </div>
      )}

      {/* Generate Button */}
      {images.length > 0 && (
        <button
          onClick={generatePdf}
          disabled={generating}
          className="calc-btn-primary w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              PDF 생성 중...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              PDF 다운로드 ({images.length}장)
            </>
          )}
        </button>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이미지 PDF 변환이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이미지 PDF 변환은 JPG, PNG, WebP 등의 이미지 파일을 PDF 문서로 변환하는
            기능입니다. 여러 장의 사진이나 스캔 문서를 하나의 PDF 파일로 합칠 수 있어
            문서 정리, 이메일 첨부, 인쇄 등에 편리합니다. 본 도구는 모든 변환이
            브라우저에서 이루어지므로 파일이 서버로 전송되지 않아 안전합니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">주요 기능</h2>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 ml-4 list-disc">
            <li>여러 이미지를 한 번에 업로드하여 하나의 PDF로 합치기</li>
            <li>드래그 앤 드롭으로 이미지 순서 변경</li>
            <li>A4, Letter, 원본 크기 등 다양한 용지 크기 지원</li>
            <li>세로/가로/자동 방향 설정</li>
            <li>여백 크기 조절 가능</li>
            <li>서버 업로드 없이 100% 브라우저에서 처리</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
