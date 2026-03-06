"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

interface Transform {
  rotation: number; // degrees
  flipH: boolean;
  flipV: boolean;
}

export default function ImageRotate() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState("image");
  const [transform, setTransform] = useState<Transform>({ rotation: 0, flipH: false, flipV: false });
  const [customAngle, setCustomAngle] = useState(0);
  const [useCustomAngle, setUseCustomAngle] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name.replace(/\.[^.]+$/, ""));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImageSrc(url);
      setImageEl(img);
      setTransform({ rotation: 0, flipH: false, flipV: false });
      setCustomAngle(0);
      setUseCustomAngle(false);
    };
    img.src = url;
  }, []);

  const effectiveRotation = useCustomAngle ? customAngle : transform.rotation;

  // Draw preview on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageEl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const natW = imageEl.naturalWidth;
    const natH = imageEl.naturalHeight;
    const rad = (effectiveRotation * Math.PI) / 180;
    const sin = Math.abs(Math.sin(rad));
    const cos = Math.abs(Math.cos(rad));

    // Calculate bounding box after rotation
    const boundW = Math.ceil(natW * cos + natH * sin);
    const boundH = Math.ceil(natW * sin + natH * cos);

    canvas.width = boundW;
    canvas.height = boundH;

    ctx.clearRect(0, 0, boundW, boundH);
    ctx.save();
    ctx.translate(boundW / 2, boundH / 2);
    ctx.rotate(rad);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    ctx.drawImage(imageEl, -natW / 2, -natH / 2, natW, natH);
    ctx.restore();
  }, [imageEl, transform, effectiveRotation]);

  const rotate = (deg: number) => {
    setUseCustomAngle(false);
    setTransform((prev) => ({
      ...prev,
      rotation: (prev.rotation + deg + 360) % 360,
    }));
    setCustomAngle((prev) => (prev + deg + 360) % 360);
  };

  const flipHorizontal = () => {
    setTransform((prev) => ({ ...prev, flipH: !prev.flipH }));
  };

  const flipVertical = () => {
    setTransform((prev) => ({ ...prev, flipV: !prev.flipV }));
  };

  const resetTransform = () => {
    setTransform({ rotation: 0, flipH: false, flipV: false });
    setCustomAngle(0);
    setUseCustomAngle(false);
  };

  const handleCustomAngleChange = (val: number) => {
    setCustomAngle(val);
    setUseCustomAngle(true);
    setTransform((prev) => ({ ...prev, rotation: val }));
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}_edited.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) loadImage(e.dataTransfer.files[0]);
  }, [loadImage]);

  const handleNewImage = () => {
    if (imageSrc) URL.revokeObjectURL(imageSrc);
    setImageSrc(null);
    setImageEl(null);
    setTransform({ rotation: 0, flipH: false, flipV: false });
    setCustomAngle(0);
    setUseCustomAngle(false);
  };

  // Compute display size for canvas (limit to container)
  const canvasDisplayStyle = (): React.CSSProperties => {
    const canvas = canvasRef.current;
    if (!canvas) return {};
    const maxW = Math.min(600, window.innerWidth - 64);
    const maxH = 450;
    const cw = canvas.width;
    const ch = canvas.height;
    if (cw <= maxW && ch <= maxH) return { width: cw, height: ch };
    const s = Math.min(maxW / cw, maxH / ch);
    return { width: Math.round(cw * s), height: Math.round(ch * s) };
  };

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이미지 회전/뒤집기
      </h1>
      <p className="text-gray-500 mb-8">
        이미지를 회전하거나 좌우/상하로 뒤집을 수 있습니다. 자유 각도 회전도 지원합니다.
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
          {/* Controls */}
          <div className="calc-card p-4 sm:p-6 mb-4">
            <h2 className="font-semibold text-gray-900 mb-4">회전/뒤집기</h2>

            {/* Rotation buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => rotate(-90)} className="calc-btn-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h1.168a2 2 0 011.664.89l.812 1.22A2 2 0 008.308 13H12a2 2 0 002-2V5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l-2-2m0 0L10 5" />
                </svg>
                90도 왼쪽
              </button>
              <button onClick={() => rotate(90)} className="calc-btn-secondary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-1.168a2 2 0 00-1.664.89l-.812 1.22A2 2 0 0115.692 13H12a2 2 0 01-2-2V5" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5l2-2m0 0l2 2" />
                </svg>
                90도 오른쪽
              </button>
              <button onClick={() => rotate(180)} className="calc-btn-secondary">
                180도 회전
              </button>
            </div>

            {/* Flip buttons */}
            <div className="flex flex-wrap gap-2 mb-5">
              <button
                onClick={flipHorizontal}
                className={`calc-btn-secondary ${transform.flipH ? "!border-blue-500 !text-blue-700 !bg-blue-50" : ""}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                좌우 뒤집기
              </button>
              <button
                onClick={flipVertical}
                className={`calc-btn-secondary ${transform.flipV ? "!border-blue-500 !text-blue-700 !bg-blue-50" : ""}`}
              >
                <svg className="w-4 h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                상하 뒤집기
              </button>
            </div>

            {/* Custom angle slider */}
            <div className="border-t border-gray-100 pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자유 각도: <strong className="text-blue-600">{customAngle}°</strong>
              </label>
              <input
                type="range"
                min="0"
                max="359"
                step="1"
                value={customAngle}
                onChange={(e) => handleCustomAngleChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0°</span>
                <span>90°</span>
                <span>180°</span>
                <span>270°</span>
                <span>359°</span>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">직접 입력</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="359"
                    value={customAngle}
                    onChange={(e) => {
                      let val = parseInt(e.target.value) || 0;
                      val = ((val % 360) + 360) % 360;
                      handleCustomAngleChange(val);
                    }}
                    className="calc-input w-28"
                  />
                  <span className="text-sm text-gray-500">도(°)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="calc-card p-4 mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">미리보기</h2>
            <div className="flex justify-center bg-gray-50 rounded-lg p-4 border border-gray-100" style={{ minHeight: 200 }}>
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[450px] object-contain"
                style={canvasDisplayStyle()}
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-600">
              <span>
                회전: <strong className="text-gray-900">{effectiveRotation}°</strong>
              </span>
              {transform.flipH && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">좌우 반전</span>}
              {transform.flipV && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">상하 반전</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={handleDownload} className="calc-btn-primary">
              다운로드
            </button>
            <button onClick={resetTransform} className="calc-btn-secondary">
              초기화
            </button>
            <button onClick={handleNewImage} className="calc-btn-secondary">
              다른 이미지
            </button>
          </div>
        </>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-gray-400 text-center mb-12">
        모든 처리는 브라우저에서 이루어지며, 이미지가 서버로 전송되지 않습니다.
      </p>

      {/* SEO Content */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">이미지 회전/뒤집기 도구 소개</h2>
          <div className="space-y-3 text-gray-600 leading-relaxed">
            <p>
              이미지 회전 및 뒤집기는 사진 편집에서 가장 기본적이면서도 자주 필요한 기능입니다. 스마트폰으로 촬영한 사진의 방향이 잘못되었거나, 거울 셀카를 원래 방향으로 되돌리거나, 디자인 작업에서 이미지 방향을 조정할 때 유용합니다.
            </p>
            <p>
              이 도구는 설치 없이 브라우저에서 바로 사용할 수 있으며, Canvas API를 활용하여 클라이언트에서 직접 처리하므로 이미지가 외부 서버로 전송되지 않아 안전합니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">기능 설명</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">기능</th>
                  <th className="text-left py-2 px-3 border border-gray-200">설명</th>
                  <th className="text-left py-2 px-3 border border-gray-200">사용 예</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">90도 회전</td>
                  <td className="py-2 px-3 border border-gray-200">이미지를 시계/반시계 방향으로 90도 회전</td>
                  <td className="py-2 px-3 border border-gray-200">세로 사진을 가로로 변경</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">180도 회전</td>
                  <td className="py-2 px-3 border border-gray-200">이미지를 뒤집어서 180도 회전</td>
                  <td className="py-2 px-3 border border-gray-200">거꾸로 찍힌 사진 바로잡기</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">좌우 뒤집기</td>
                  <td className="py-2 px-3 border border-gray-200">이미지를 수평으로 반전 (거울 효과)</td>
                  <td className="py-2 px-3 border border-gray-200">셀카 거울 반전 복원</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">상하 뒤집기</td>
                  <td className="py-2 px-3 border border-gray-200">이미지를 수직으로 반전</td>
                  <td className="py-2 px-3 border border-gray-200">반사 효과 만들기</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200 font-medium">자유 각도</td>
                  <td className="py-2 px-3 border border-gray-200">0~359도 사이 원하는 각도로 회전</td>
                  <td className="py-2 px-3 border border-gray-200">기울어진 사진 수평 맞추기</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">회전 시 이미지 화질이 떨어지나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                90도 단위 회전(90, 180, 270도)은 픽셀을 재배치하는 것이므로 화질 손실이 없습니다. 자유 각도 회전의 경우 보간(interpolation) 과정에서 미세한 화질 변화가 있을 수 있으나, 일반적으로 눈에 띄지 않는 수준입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">자유 각도로 회전하면 캔버스 크기가 바뀌나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 자유 각도로 회전하면 원본 이미지가 잘리지 않도록 캔버스(출력 이미지) 크기가 자동으로 조절됩니다. 회전된 이미지의 바운딩 박스에 맞춰 출력됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">여러 변환을 동시에 적용할 수 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 회전과 뒤집기를 조합하여 사용할 수 있습니다. 예를 들어 90도 회전 후 좌우 뒤집기를 적용하면 두 변환이 모두 반영된 결과를 얻을 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">출력 포맷은 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                PNG 포맷으로 저장되어 투명 배경이 유지되며 무손실 품질을 보장합니다. 다른 포맷이 필요한 경우 이미지 변환기 도구를 함께 이용해 주세요.
              </p>
            </div>
          </div>
        </div>
      </section>
      <RelatedTools current="image-rotate" />
    </div>
  );
}
