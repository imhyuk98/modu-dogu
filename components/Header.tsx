"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localizedKoreanPaths } from "@/lib/en-tools";

const primaryLinks = [
  { label: "같이 놀기", href: "/category/drinking", matches: ["/category/drinking", "/category/games"] },
  { label: "테스트·운세", href: "/category/fun", matches: ["/category/fun"] },
  { label: "생활 계산", href: "/category/life", matches: ["/category/life", "/category/finance", "/category/realestate"] },
  { label: "온라인 도구", href: "/category/tools", matches: ["/category/tools"] },
];

const quickLinks = [
  { label: "텔레파시 게임", href: "/tools/telepathy-game", emoji: "🧠" },
  { label: "친구 케미", href: "/tools/friend-chemistry", emoji: "🧩" },
  { label: "오늘의 운세", href: "/calculators/daily-fortune", emoji: "🌟" },
];

const englishPrimaryLinks = [
  { label: "Calculators", href: "/en#calculators" },
  { label: "Web tools", href: "/en#web-tools" },
  { label: "Fun & games", href: "/en#fun" },
];

const englishQuickLinks = [
  { label: "Name Generator", href: "/en/tools/name-generator", emoji: "✨" },
  { label: "Reaction Test", href: "/en/tools/reaction-test", emoji: "⚡" },
  { label: "Age Calculator", href: "/en/calculators/age", emoji: "🎂" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const koreanPath = isEnglish ? pathname.slice(3) || "/" : pathname;
  const englishPath = localizedKoreanPaths.has(pathname) ? `/en${pathname}` : "/en";
  const localeHref = isEnglish ? koreanPath : englishPath;
  const localeLabel = isEnglish ? "한국어" : "EN";
  const activeQuickLinks = isEnglish ? englishQuickLinks : quickLinks;

  return (
    <header className="site-header sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="site-header-inner mx-auto flex max-w-[1200px] items-center justify-between px-5 py-3 md:px-8">
        <Link href={isEnglish ? "/en" : "/"} className="site-wordmark text-xl font-bold" aria-label={isEnglish ? "Modu Tools home" : "모두의도구 홈"}>
          {isEnglish ? "MODU TOOLS" : "모두의도구"}
        </Link>

        <nav className="site-nav hidden items-center gap-5 text-sm text-[var(--muted)] md:flex" aria-label={isEnglish ? "Main navigation" : "주요 메뉴"}>
          {isEnglish
            ? englishPrimaryLinks.map((link) => <Link key={link.href} href={link.href} className="transition-colors hover:text-[#a93d28]">{link.label}</Link>)
            : primaryLinks.map((link) => {
                const active = link.matches.some((prefix) => pathname.startsWith(prefix));
                return <Link key={link.href} href={link.href} className={`transition-colors hover:text-[#a93d28] ${active ? "font-bold text-[#a93d28]" : ""}`}>{link.label}</Link>;
              })}
          <Link href={localeHref} hrefLang={isEnglish ? "ko" : "en"} lang={isEnglish ? "ko" : "en"} className="rounded-full bg-[#f5ede7] px-3 py-1.5 font-black text-[#654d42] transition-colors hover:bg-[#eaded5] hover:text-[#a93d28]" aria-label={isEnglish ? "한국어 버전으로 이동" : "Open the English version"}>{localeLabel}</Link>
          <Link
            href={isEnglish ? "/en#all-tools" : "/#store-tool-directory"}
            className="rounded-full border border-[#d9c8bd] px-3.5 py-1.5 font-bold text-[#513b31] transition-colors hover:border-[#a93d28] hover:text-[#a93d28]"
          >
            {isEnglish ? "Browse all" : "전부 구경하기"}
          </Link>
        </nav>

        <button
          type="button"
          className="site-menu-button rounded-lg p-2 text-gray-600 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileOpen ? (isEnglish ? "Close menu" : "메뉴 닫기") : (isEnglish ? "Open menu" : "메뉴 열기")}
        >
          {mobileOpen ? (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <nav id="mobile-navigation" className="site-mobile-menu border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-4 md:hidden" aria-label={isEnglish ? "Mobile navigation" : "모바일 메뉴"}>
          <div className="grid grid-cols-2 gap-2">
            {(isEnglish ? englishPrimaryLinks : primaryLinks).map((link) => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-xl bg-[#f8f3ef] px-4 py-3 text-sm font-bold text-[#513b31]">{link.label}</Link>)}
            <Link href={localeHref} hrefLang={isEnglish ? "ko" : "en"} lang={isEnglish ? "ko" : "en"} onClick={() => setMobileOpen(false)} className="rounded-xl bg-[#f8f3ef] px-4 py-3 text-sm font-black text-[#a93d28]">{isEnglish ? "한국어로 보기" : "English version"}</Link>
          </div>
          <p className="mb-2 mt-5 text-[11px] font-black tracking-[0.12em] text-[#a93d28]">{isEnglish ? "POPULAR NOW" : "지금 인기"}</p>
          <div className="space-y-1">
            {activeQuickLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-gray-700 hover:bg-[#fff7f3]">
                <span>{link.emoji} {link.label}</span><span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
          <Link href={isEnglish ? "/en#all-tools" : "/#store-tool-directory"} onClick={() => setMobileOpen(false)} className="mt-3 block rounded-xl border border-[#d9c8bd] px-4 py-3 text-center text-sm font-bold text-[#513b31]">
            {isEnglish ? "Browse all tools" : "전부 구경하기"}
          </Link>
        </nav>
      )}
    </header>
  );
}
