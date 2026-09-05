"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OPEN_CONSENT_EVENT } from "@/lib/consent";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  return (
    <footer className="site-footer bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {isEnglish ? "Modu Tools · Useful, playful, and free." : "모두의도구 · 놀 것도, 쓸 것도 다 있음."}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
            <Link href={isEnglish ? "/en/about" : "/about"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "About" : "사이트 소개"}
            </Link>
            <Link href={isEnglish ? "/en/faq" : "/faq"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "FAQ" : "자주 묻는 질문"}
            </Link>
            <Link href={isEnglish ? "/en/privacy" : "/privacy"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "Privacy" : "개인정보처리방침"}
            </Link>
            {!isEnglish && <Link href="/editorial-policy" className="hover:text-blue-600 transition-colors">검수 정책</Link>}
            {!isEnglish && <Link href="/changelog" className="hover:text-blue-600 transition-colors">변경 이력</Link>}
            {!isEnglish && <Link href="/feedback" className="hover:text-blue-600 transition-colors">오류 제보</Link>}
            <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="hover:text-blue-600 transition-colors">{isEnglish ? "Cookie choices" : "선택 쿠키 설정"}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
