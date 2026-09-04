"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ShareActionsProps {
  tool: string;
  title: string;
  text: string;
  url?: string;
  compact?: boolean;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function ShareActions({ tool, title, text, url, compact = false }: ShareActionsProps) {
  const [status, setStatus] = useState("");
  const destination = () => new URL(url ?? window.location.href, window.location.origin).href;

  const report = (method: string) => trackEvent("result_share", { tool, method });

  const share = async () => {
    const shareUrl = destination();
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        setStatus("공유 메뉴를 열었습니다.");
        report("native");
        return;
      }
      await copyText(`${text}\n${shareUrl}`);
      setStatus("결과와 링크를 복사했습니다.");
      report("clipboard_fallback");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") setStatus("공유를 취소했습니다.");
      else setStatus("공유하지 못했습니다. 링크 복사를 이용해 주세요.");
    }
  };

  const copy = async () => {
    await copyText(`${text}\n${destination()}`);
    setStatus("결과와 링크를 복사했습니다.");
    report("clipboard");
  };

  const sms = () => {
    const body = encodeURIComponent(`${text}\n${destination()}`);
    window.location.href = `sms:?&body=${body}`;
    setStatus("문자 앱을 열었습니다.");
    report("sms");
  };

  return (
    <div className={compact ? "space-y-2" : "rounded-2xl border border-gray-200 bg-white p-4"}>
      {!compact && <p className="mb-3 text-sm font-bold text-gray-800">결과 보내기</p>}
      <div className="grid grid-cols-1 gap-2 min-[390px]:grid-cols-3">
        <button type="button" onClick={share} className="min-h-11 rounded-xl bg-[#a93d28] px-3 text-sm font-bold text-white">카카오톡·앱 공유</button>
        <button type="button" onClick={sms} className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700">문자로 보내기</button>
        <button type="button" onClick={copy} className="min-h-11 rounded-xl border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700">링크 복사</button>
      </div>
      <p className="mt-2 min-h-5 text-xs text-gray-500" role="status" aria-live="polite">{status}</p>
    </div>
  );
}
