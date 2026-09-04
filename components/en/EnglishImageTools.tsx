"use client";

import { useEffect, useRef, useState } from "react";

const inputClass = "calc-input calc-input-lg";
const primaryButton = "calc-btn-primary px-5 py-3";
const secondaryButton = "calc-btn-secondary px-5 py-3";

interface LoadedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

function useLoadedImage() {
  const [image, setImage] = useState<LoadedImage | null>(null);
  const [error, setError] = useState("");
  const imageUrl = useRef("");
  useEffect(() => () => { if (imageUrl.current) URL.revokeObjectURL(imageUrl.current); }, []);
  const load = (file?: File, onLoaded?: (loaded: LoadedImage) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose a JPG, PNG, or WebP image."); return; }
    const url = URL.createObjectURL(file); const probe = new Image();
    probe.onload = () => {
      if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);
      imageUrl.current = url;
      const loaded = { file, url, width: probe.naturalWidth, height: probe.naturalHeight };
      setImage(loaded); onLoaded?.(loaded); setError("");
    };
    probe.onerror = () => { URL.revokeObjectURL(url); setError("The selected image could not be opened."); };
    probe.src = url;
  };
  return { image, error, load };
}

function FilePicker({ onPick }: { onPick: (file?: File) => void }) {
  return (
    <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-[#d9c8bd] bg-[#fffaf6] px-5 py-10 text-center transition hover:border-[#a93d28]">
      <span className="text-4xl">🖼️</span><strong className="mt-2 text-[#513b31]">Choose an image</strong><small className="mt-1 text-gray-500">JPG, PNG, or WebP · processed on this device</small>
      <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => onPick(event.target.files?.[0])} />
    </label>
  );
}

function canvasBlob(image: LoadedImage, width: number, height: number, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    const source = new Image();
    source.onload = () => {
      const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
      const context = canvas.getContext("2d"); if (!context) return reject(new Error("Canvas is not available."));
      if (type === "image/jpeg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, width, height); }
      context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high"; context.drawImage(source, 0, 0, width, height);
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("The image could not be exported.")), type, quality);
    };
    source.onerror = () => reject(new Error("The image could not be opened.")); source.src = image.url;
  });
}

interface DownloadResult {
  blob: Blob;
  url: string;
}

function useDownloadResult() {
  const [result, setResult] = useState<DownloadResult | null>(null);
  const resultUrl = useRef("");
  useEffect(() => () => { if (resultUrl.current) URL.revokeObjectURL(resultUrl.current); }, []);
  const clear = () => {
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = "";
    setResult(null);
  };
  const publish = (blob: Blob) => {
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    const url = URL.createObjectURL(blob);
    resultUrl.current = url;
    setResult({ blob, url });
  };
  return { result, clear, publish };
}

function ResultDownload({ result, filename }: { result: DownloadResult; filename: string }) {
  return <a href={result.url} download={filename} className={primaryButton}>Download result</a>;
}

export function ImageResizeEn() {
  const { image, error, load } = useLoadedImage(); const [width, setWidth] = useState(""); const [height, setHeight] = useState(""); const [locked, setLocked] = useState(true); const { result, clear, publish } = useDownloadResult(); const [processError, setProcessError] = useState("");
  const changeWidth = (value: string) => { setWidth(value); if (locked && image && Number(value) > 0) setHeight(String(Math.max(1, Math.round(Number(value) * image.height / image.width)))); };
  const changeHeight = (value: string) => { setHeight(value); if (locked && image && Number(value) > 0) setWidth(String(Math.max(1, Math.round(Number(value) * image.width / image.height)))); };
  const resize = async () => {
    if (!image) return; const nextWidth = Math.floor(Number(width)), nextHeight = Math.floor(Number(height));
    if (nextWidth < 1 || nextHeight < 1 || nextWidth > 12000 || nextHeight > 12000) { setProcessError("Width and height must be between 1 and 12,000 pixels."); return; }
    try { publish(await canvasBlob(image, nextWidth, nextHeight, image.file.type === "image/png" ? "image/png" : "image/jpeg", 0.92)); setProcessError(""); } catch (caught) { setProcessError(caught instanceof Error ? caught.message : "Could not resize this image."); }
  };
  return (
    <div className="space-y-5">
      <FilePicker onPick={(file) => { clear(); load(file, (loaded) => { setWidth(String(loaded.width)); setHeight(String(loaded.height)); setProcessError(""); }); }} />{(error || processError) && <p role="alert" className="text-sm text-red-600">{error || processError}</p>}
      {image && <><div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600"><span><strong>{image.file.name}</strong> · {image.width} × {image.height}px</span><span>{(image.file.size / 1024).toFixed(1)} KB</span></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-gray-700">Width (px)<input type="number" min="1" max="12000" value={width} onChange={(e) => changeWidth(e.target.value)} className={`mt-1 ${inputClass}`} /></label><label className="text-sm font-bold text-gray-700">Height (px)<input type="number" min="1" max="12000" value={height} onChange={(e) => changeHeight(e.target.value)} className={`mt-1 ${inputClass}`} /></label></div><label className="flex items-center gap-2 text-sm font-bold text-gray-700"><input type="checkbox" checked={locked} onChange={(e) => setLocked(e.target.checked)} className="h-4 w-4 accent-[#a93d28]" />Keep original aspect ratio</label><div className="flex flex-wrap gap-3"><button type="button" className={secondaryButton} onClick={resize}>Resize image</button>{result && <ResultDownload result={result} filename={`resized-${image.file.name.replace(/\.[^.]+$/, "")}.${image.file.type === "image/png" ? "png" : "jpg"}`} />}</div>{result && <p role="status" className="text-sm font-bold text-[#246b36]">Ready: {(result.blob.size / 1024).toFixed(1)} KB</p>}</>}
    </div>
  );
}

export function ImageCompressEn() {
  const { image, error, load } = useLoadedImage(); const [quality, setQuality] = useState(75); const [format, setFormat] = useState<"image/webp" | "image/jpeg">("image/webp"); const { result, clear, publish } = useDownloadResult(); const [processError, setProcessError] = useState("");
  const compress = async () => { if (!image) return; try { publish(await canvasBlob(image, image.width, image.height, format, quality / 100)); setProcessError(""); } catch (caught) { setProcessError(caught instanceof Error ? caught.message : "Could not compress this image."); } };
  const saving = image && result ? Math.round((1 - result.blob.size / image.file.size) * 100) : null;
  return (
    <div className="space-y-5">
      <FilePicker onPick={(file) => { clear(); load(file, () => setProcessError("")); }} />{(error || processError) && <p role="alert" className="text-sm text-red-600">{error || processError}</p>}
      {image && <><div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600"><span><strong>{image.file.name}</strong> · {image.width} × {image.height}px</span><span>Original: {(image.file.size / 1024).toFixed(1)} KB</span></div><label className="block text-sm font-bold text-gray-700">Quality: {quality}%<input type="range" min="20" max="95" value={quality} onChange={(e) => { setQuality(Number(e.target.value)); clear(); }} className="mt-2 w-full accent-[#a93d28]" /></label><fieldset><legend className="mb-2 text-sm font-bold text-gray-700">Output format</legend><div className="flex gap-2"><button type="button" onClick={() => { setFormat("image/webp"); clear(); }} className={`rounded-xl px-4 py-2 text-sm font-bold ${format === "image/webp" ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42]"}`}>WebP</button><button type="button" onClick={() => { setFormat("image/jpeg"); clear(); }} className={`rounded-xl px-4 py-2 text-sm font-bold ${format === "image/jpeg" ? "bg-[#a93d28] text-white" : "bg-[#f5ede7] text-[#654d42]"}`}>JPG</button></div></fieldset><div className="flex flex-wrap gap-3"><button type="button" className={secondaryButton} onClick={compress}>Compress image</button>{result && <ResultDownload result={result} filename={`compressed-${image.file.name.replace(/\.[^.]+$/, "")}.${format === "image/webp" ? "webp" : "jpg"}`} />}</div>{result && <div className="rounded-2xl bg-[#dff5df] p-4 text-sm font-bold text-[#246b36]" role="status">Result: {(result.blob.size / 1024).toFixed(1)} KB {saving !== null && saving > 0 ? `· ${saving}% smaller` : "· output may be larger at this quality"}</div>}</>}
    </div>
  );
}
