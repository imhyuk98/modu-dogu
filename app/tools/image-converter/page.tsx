"use client";

import { useState, useRef, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl: string;
}

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  convertedName: string;
  convertedSize: number;
  previewUrl: string;
  blobUrl: string;
}

type OutputFormat = "png" | "jpg" | "webp";

export default function ImageConverter() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("webp");
  const [jpgQuality, setJpgQuality] = useState(0.8);
  const [webpQuality, setWebpQuality] = useState(0.8);
  const [isConverting, setIsConverting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const addFiles = useCallback((files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    const newUploaded: UploadedFile[] = imageFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
    }));
    setUploadedFiles((prev) => [...prev, ...newUploaded]);
    setConvertedFiles([]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
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
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const getMimeType = (format: OutputFormat): string => {
    switch (format) {
      case "png":
        return "image/png";
      case "jpg":
        return "image/jpeg";
      case "webp":
        return "image/webp";
    }
  };

  const getExtension = (format: OutputFormat): string => {
    switch (format) {
      case "png":
        return ".png";
      case "jpg":
        return ".jpg";
      case "webp":
        return ".webp";
    }
  };

  const convertFile = (
    uploaded: UploadedFile,
    format: OutputFormat,
    quality: number
  ): Promise<ConvertedFile> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context not available"));
          return;
        }

        // For JPG, fill white background (no transparency support)
        if (format === "jpg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        const mimeType = getMimeType(format);
        const useQuality = format === "png" ? undefined : quality;

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Conversion failed"));
              return;
            }

            const baseName = uploaded.name.replace(/\.[^.]+$/, "");
            const convertedName = baseName + getExtension(format);
            const blobUrl = URL.createObjectURL(blob);

            resolve({
              id: uploaded.id,
              originalName: uploaded.name,
              originalSize: uploaded.size,
              convertedName,
              convertedSize: blob.size,
              previewUrl: blobUrl,
              blobUrl,
            });
          },
          mimeType,
          useQuality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = uploaded.previewUrl;
    });
  };

  const handleConvert = async () => {
    if (uploadedFiles.length === 0) return;
    setIsConverting(true);

    // Clean up previous converted files
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.blobUrl));

    const quality = outputFormat === "jpg" ? jpgQuality : webpQuality;

    try {
      const results = await Promise.all(
        uploadedFiles.map((f) => convertFile(f, outputFormat, quality))
      );
      setConvertedFiles(results);
    } catch {
      alert("이미지 변환 중 오류가 발생했습니다.");
    } finally {
      setIsConverting(false);
    }
  };

  const downloadFile = (converted: ConvertedFile) => {
    const a = document.createElement("a");
    a.href = converted.blobUrl;
    a.download = converted.convertedName;
    a.click();
  };

  const downloadAll = () => {
    convertedFiles.forEach((f) => downloadFile(f));
  };

  const handleReset = () => {
    uploadedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    convertedFiles.forEach((f) => URL.revokeObjectURL(f.blobUrl));
    setUploadedFiles([]);
    setConvertedFiles([]);
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 변환기
      </h1>
      <p className="text-gray-500 mb-8">
        PNG, JPG, WebP 등 이미지 파일 포맷을 브라우저에서 무료로 변환합니다.
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
          PNG, JPG, WebP, GIF 등 지원 (여러 파일 선택 가능)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              업로드된 이미지 ({uploadedFiles.length}개)
            </h2>
            <button
              onClick={handleReset}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              전체 삭제
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedFiles.map((f) => (
              <div key={f.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={f.previewUrl}
                    alt={f.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
                <p className="text-xs text-gray-600 mt-1 truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{formatSize(f.size)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversion Options */}
      {uploadedFiles.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">변환 설정</h2>

          {/* Output Format */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              출력 포맷
            </label>
            <div className="flex gap-3">
              {(["png", "jpg", "webp"] as OutputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    outputFormat === fmt
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-blue-300"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* JPG Quality Slider */}
          {outputFormat === "jpg" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JPG 품질: {Math.round(jpgQuality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={jpgQuality}
                onChange={(e) => setJpgQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>낮은 품질 (작은 용량)</span>
                <span>높은 품질 (큰 용량)</span>
              </div>
            </div>
          )}

          {/* WebP Quality Slider */}
          {outputFormat === "webp" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WebP 품질: {Math.round(webpQuality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={webpQuality}
                onChange={(e) => setWebpQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>낮은 품질 (작은 용량)</span>
                <span>높은 품질 (큰 용량)</span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={handleConvert}
            disabled={isConverting}
            className="w-full calc-btn-primary disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isConverting ? "변환 중..." : "변환하기"}
          </button>
        </div>
      )}

      {/* Converted Results */}
      {convertedFiles.length > 0 && (
        <div className="calc-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">
              변환 결과 ({convertedFiles.length}개)
            </h2>
            {convertedFiles.length > 1 && (
              <button
                onClick={downloadAll}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                전체 다운로드
              </button>
            )}
          </div>
          <div className="space-y-4">
            {convertedFiles.map((f) => {
              const reduction = (
                ((f.originalSize - f.convertedSize) / f.originalSize) *
                100
              ).toFixed(1);
              const isSmaller = f.convertedSize < f.originalSize;

              return (
                <div
                  key={f.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                    <img
                      src={f.previewUrl}
                      alt={f.convertedName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {f.convertedName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatSize(f.originalSize)} → {formatSize(f.convertedSize)}
                      <span
                        className={`ml-2 font-medium ${
                          isSmaller ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        ({isSmaller ? "-" : "+"}
                        {Math.abs(parseFloat(reduction))}%)
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => downloadFile(f)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
                  >
                    다운로드
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center mb-12">
        모든 변환은 브라우저에서 처리되며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        {/* Image Format Comparison */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            이미지 포맷 비교
          </h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">포맷</th>
                  <th className="text-left py-2 px-3 border border-gray-200">특징</th>
                  <th className="text-left py-2 px-3 border border-gray-200">장점</th>
                  <th className="text-left py-2 px-3 border border-gray-200">단점</th>
                  <th className="text-left py-2 px-3 border border-gray-200">주요 용도</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">PNG</td>
                  <td className="py-2 px-3 border border-gray-200">무손실 압축</td>
                  <td className="py-2 px-3 border border-gray-200">투명 배경 지원, 화질 손실 없음</td>
                  <td className="py-2 px-3 border border-gray-200">파일 크기가 큼</td>
                  <td className="py-2 px-3 border border-gray-200">로고, 아이콘, 스크린샷</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">JPG</td>
                  <td className="py-2 px-3 border border-gray-200">손실 압축</td>
                  <td className="py-2 px-3 border border-gray-200">파일 크기 작음, 호환성 높음</td>
                  <td className="py-2 px-3 border border-gray-200">투명 배경 미지원, 반복 저장 시 화질 저하</td>
                  <td className="py-2 px-3 border border-gray-200">사진, 웹 이미지</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">WebP</td>
                  <td className="py-2 px-3 border border-gray-200">손실/무손실 모두 지원</td>
                  <td className="py-2 px-3 border border-gray-200">뛰어난 압축률, 투명 배경 지원</td>
                  <td className="py-2 px-3 border border-gray-200">일부 구형 브라우저 미지원</td>
                  <td className="py-2 px-3 border border-gray-200">웹 최적화, 앱 리소스</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">GIF</td>
                  <td className="py-2 px-3 border border-gray-200">무손실, 애니메이션 지원</td>
                  <td className="py-2 px-3 border border-gray-200">애니메이션 지원, 높은 호환성</td>
                  <td className="py-2 px-3 border border-gray-200">256색 제한, 큰 파일 크기</td>
                  <td className="py-2 px-3 border border-gray-200">짧은 애니메이션, 이모지</td>
                </tr>
              </tbody>
            </table></div>
          </div>
        </div>

        {/* When You Need Image Conversion */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            이미지 변환이 필요한 경우
          </h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-900">웹사이트 최적화:</strong> PNG나 JPG 이미지를 WebP로 변환하면 동일한 화질에서 30~50% 용량을 절약할 수 있어 웹사이트 로딩 속도가 빨라집니다. Google은 Core Web Vitals 평가에서 이미지 최적화를 중요한 요소로 봅니다.
            </p>
            <p>
              <strong className="text-gray-900">SNS 업로드:</strong> 각 소셜 미디어 플랫폼마다 권장하는 이미지 포맷이 다릅니다. JPG는 대부분의 플랫폼에서 호환되며, 적절한 품질 설정으로 업로드 시간을 단축할 수 있습니다.
            </p>
            <p>
              <strong className="text-gray-900">호환성 확보:</strong> WebP를 지원하지 않는 환경에서 사용할 이미지는 PNG나 JPG로 변환해야 합니다. 반대로 최신 웹 환경에서는 WebP 사용이 권장됩니다.
            </p>
            <p>
              <strong className="text-gray-900">투명 배경 처리:</strong> JPG는 투명 배경을 지원하지 않으므로, 투명 배경이 필요한 경우 PNG나 WebP를 선택해야 합니다. JPG로 변환 시 투명 부분은 흰색으로 채워집니다.
            </p>
          </div>
        </div>

        {/* Advantages of WebP */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            WebP 포맷의 장점
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            WebP는 Google이 개발한 차세대 이미지 포맷으로, 웹에서의 이미지 최적화를 위해 설계되었습니다. 주요 장점은 다음과 같습니다.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>
              <strong>뛰어난 압축률:</strong> JPG 대비 25~35% 작은 파일 크기로 동일한 화질을 유지합니다.
            </li>
            <li>
              <strong>투명 배경 지원:</strong> PNG처럼 알파 채널(투명도)을 지원하면서도 파일 크기가 훨씬 작습니다.
            </li>
            <li>
              <strong>손실/무손실 모두 지원:</strong> 용도에 따라 손실 압축과 무손실 압축을 선택할 수 있습니다.
            </li>
            <li>
              <strong>애니메이션 지원:</strong> GIF 대신 애니메이션 WebP를 사용하면 파일 크기를 크게 줄일 수 있습니다.
            </li>
            <li>
              <strong>Google 권장 포맷:</strong> Google PageSpeed Insights에서 WebP 사용을 권장하며, SEO 점수 향상에 도움이 됩니다.
            </li>
          </ul>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                WebP 포맷은 어떤 브라우저에서 지원하나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Chrome, Firefox, Edge, Safari(14 이상), Opera 등 대부분의 최신 브라우저에서 WebP를 지원합니다. Internet Explorer와 일부 구형 Safari에서는 지원되지 않으므로, 이 경우 PNG나 JPG를 사용하세요.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                이미지 변환 시 화질 손실이 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                PNG로 변환하면 무손실이므로 화질 손실이 없습니다. JPG와 WebP는 손실 압축 방식이지만, 품질을 80% 이상으로 설정하면 육안으로 구분하기 어려운 수준입니다. 품질 슬라이더를 조절하여 파일 크기와 화질 사이의 균형을 맞출 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                투명 배경(알파 채널)은 유지되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                PNG와 WebP로 변환하면 투명 배경이 유지됩니다. JPG(JPEG)는 투명 배경을 지원하지 않으므로, JPG로 변환 시 투명 부분이 흰색으로 채워집니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                최대 파일 크기 제한이 있나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                서버를 사용하지 않고 브라우저에서 직접 변환하므로 별도의 파일 크기 제한은 없습니다. 다만 매우 큰 이미지(예: 50MB 이상)는 브라우저 메모리에 따라 처리 속도가 느려지거나 실패할 수 있습니다. 일반적인 사용 환경에서는 문제없이 동작합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="image-converter" />
</div>
  );
}
