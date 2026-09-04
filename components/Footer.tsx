"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  return (
    <footer className="site-footer bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {isEnglish ? "Modu Tools · Useful, playful, and free." : "모두의도구 · 놀 것도, 쓸 것도 다 있음."}</p>
          <div className="flex gap-4">
            <Link href={isEnglish ? "/en/about" : "/about"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "About" : "사이트 소개"}
            </Link>
            <Link href={isEnglish ? "/en/faq" : "/faq"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "FAQ" : "자주 묻는 질문"}
            </Link>
            <Link href={isEnglish ? "/en/privacy" : "/privacy"} className="hover:text-blue-600 transition-colors">
              {isEnglish ? "Privacy" : "개인정보처리방침"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
