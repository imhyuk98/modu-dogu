"use client";

import Link from "next/link";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    trackEvent("client_error", { digest: error.digest ?? "unknown" });
  }, [error.digest]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-sm font-black tracking-[0.14em] text-[#a93d28]">TOOL ERROR</p>
      <h1 className="mt-3 text-3xl font-black text-gray-950">도구를 불러오지 못했습니다</h1>
      <p className="mt-4 leading-7 text-gray-600">입력값은 전송하지 않았습니다. 잠시 후 다시 시도하거나 홈에서 다른 도구를 이용해 주세요.</p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="min-h-11 rounded-xl bg-[#a93d28] px-5 font-bold text-white">다시 시도</button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-xl border border-gray-300 px-5 font-bold text-gray-700">홈으로</Link>
      </div>
    </main>
  );
}
