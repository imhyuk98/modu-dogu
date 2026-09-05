"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OPEN_CONSENT_EVENT, setOptionalConsent, useOptionalConsent } from "@/lib/consent";

export default function ConsentBanner() {
  const consent = useOptionalConsent();
  const pathname = usePathname();
  const [reopened, setReopened] = useState(false);
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open);
  }, []);

  if (consent !== "unknown" && !reopened) return null;

  const choose = (value: "granted" | "denied") => {
    setOptionalConsent(value);
    setReopened(false);
  };

  return (
    <aside data-testid="consent-banner" className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-[#d8d1c5] bg-white p-4 shadow-[0_16px_50px_rgba(39,31,27,0.22)] sm:p-5" aria-label={isEnglish ? "Optional cookie choices" : "선택 쿠키 설정"}>
      <p className="font-black text-gray-950">{isEnglish ? "Your optional cookie choice" : "선택 쿠키를 직접 정해 주세요"}</p>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        {isEnglish
          ? "Essential browser storage keeps favorites and game records. With your permission, Google Analytics—and ads only when configured—may use optional cookies. Tool inputs are not sent as analytics parameters."
          : "즐겨찾기와 게임 기록에는 필수 브라우저 저장소를 사용합니다. 동의할 때만 Google Analytics와, 설정된 경우 광고의 선택 쿠키를 불러옵니다. 도구 입력값은 분석 매개변수로 보내지 않습니다."}
        {" "}<Link href={isEnglish ? "/en/privacy" : "/privacy"} className="font-bold underline">{isEnglish ? "Details" : "자세히 보기"}</Link>
      </p>
      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button data-testid="consent-deny" type="button" onClick={() => choose("denied")} className="min-h-11 rounded-xl border border-gray-300 px-4 text-sm font-bold text-gray-700">{isEnglish ? "Essential only" : "필수 기능만"}</button>
        <button data-testid="consent-grant" type="button" onClick={() => choose("granted")} className="min-h-11 rounded-xl bg-[#a93d28] px-4 text-sm font-bold text-white">{isEnglish ? "Allow optional cookies" : "선택 쿠키 허용"}</button>
      </div>
    </aside>
  );
}
