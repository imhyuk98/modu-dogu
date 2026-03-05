"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { sections, allItems, sectionColors } from "@/lib/sections";
import type { Item } from "@/lib/sections";
import { getRecentTools } from "@/lib/recent";

/* ── Floating Emojis in Hero ── */
const heroEmojis = ["💰", "📊", "🎮", "🔮", "🏠", "⚡", "🎯", "📱", "🧮", "🎲", "💡", "🔧"];

function FloatingEmojis() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {heroEmojis.map((emoji, i) => (
        <span
          key={i}
          className="floating-emoji"
          style={{
            "--x": `${8 + (i * 7.5) % 84}%`,
            "--duration": `${7 + (i % 4) * 2}s`,
            "--delay": `${(i * 1.3) % 8}s`,
            fontSize: `${1.1 + (i % 3) * 0.4}rem`,
          } as React.CSSProperties}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

/* ── Animated Counter ── */
function AnimatedCount({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return <span ref={ref} className="tabular-nums">{count}</span>;
}

/* ── Scroll-triggered section visibility ── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Tool Card ── */
function ToolCard({ item, colorKey, index, featured }: {
  item: Item;
  colorKey: string;
  index: number;
  featured?: boolean;
}) {
  const colors = sectionColors[colorKey] || sectionColors.tools;
  return (
    <div
      className="group card-enter"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
      <Link
        href={item.href}
        className={`tool-card block bg-white rounded-2xl border ${colors.border} ${colors.hoverBg} p-4 h-full relative overflow-hidden`}
      >
        {/* Subtle top accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${colors.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`} />

        <div className="flex items-center gap-3.5">
          <span className={`text-[1.35rem] w-11 h-11 flex-shrink-0 ${colors.iconBg} rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm`}>
            {item.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-bold text-gray-900 truncate group-hover:text-gray-800">{item.title}</p>
            <p className="text-[0.6875rem] text-gray-400 mt-0.5 truncate group-hover:text-gray-500 transition-colors">{item.desc}</p>
          </div>
          {/* Arrow */}
          <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

/* ── Animated Section ── */
function AnimatedSection({ section, filtered, collapsed, onToggle, activeTab, search }: {
  section: (typeof sections)[0];
  filtered: Item[];
  collapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  search: string;
}) {
  const { ref, visible } = useInView(0.05);
  const isCollapsed = collapsed && !search;
  const showHeader = activeTab === "all" || !!search;
  const colors = sectionColors[section.key];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`mb-10 transition-opacity duration-500 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {showHeader && (
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onToggle}
            className="flex items-center gap-3 flex-1 text-left group"
          >
            <div className={`w-9 h-9 ${colors.bg} rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105`}>
              {section.icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900">{section.label}</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filtered.length}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isCollapsed ? "-rotate-90" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <Link
            href={`/category/${section.key}`}
            className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex-shrink-0"
          >
            전체보기 &rarr;
          </Link>
        </div>
      )}
      <div
        className="grid-collapse"
        style={{
          maxHeight: isCollapsed ? "0px" : `${filtered.length * 100}px`,
          opacity: isCollapsed ? 0 : 1,
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((item, i) => (
            <ToolCard
              key={item.href}
              item={item}
              colorKey={section.key}
              index={visible ? i : 0}
              featured={item.featured}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Main ── */
export default function Home() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [recentHrefs, setRecentHrefs] = useState<string[]>([]);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentHrefs(getRecentTools());
  }, []);

  const handleTabClick = useCallback((key: string) => {
    setActiveTab(key);
    requestAnimationFrame(() => {
      const container = tabsRef.current;
      if (!container) return;
      const activeBtn = container.querySelector(`[data-tab="${key}"]`) as HTMLElement;
      if (!activeBtn) return;
      const left = activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
      container.scrollTo({ left, behavior: "smooth" });
    });
  }, []);

  const filterBySearch = useCallback((items: Item[]) =>
    search ? items.filter((i) => i.title.includes(search) || i.desc.includes(search)) : items,
  [search]);

  const visibleSections = activeTab === "all"
    ? sections
    : sections.filter((s) => s.key === activeTab);

  const hasSearchResults = search
    ? sections.some((s) => s.items.some((i) => i.title.includes(search) || i.desc.includes(search)))
    : true;

  // Quick stats
  const stats = useMemo(() => {
    const byKey = (keys: string[]) => sections.filter((s) => keys.includes(s.key)).reduce((n, s) => n + s.items.length, 0);
    return [
      { icon: "📊", label: "계산기", count: byKey(["finance", "realestate", "life"]) },
      { icon: "🎮", label: "게임", count: byKey(["games", "drinking"]) },
      { icon: "🛠️", label: "도구", count: byKey(["tools", "fun"]) },
    ];
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient border-b border-blue-100">
        <FloatingEmojis />
        <div className="relative max-w-5xl mx-auto px-4 pt-12 pb-10 text-center">
          {/* Badge */}
          <div className="hero-animate inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 shadow-sm border border-blue-100 badge-shimmer">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            <AnimatedCount target={allItems.length} />개의 무료 도구
          </div>

          <h1 className="hero-animate hero-animate-delay-1 text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
            필요한 도구,<br className="sm:hidden" /> 바로 여기에.
          </h1>
          <p className="hero-animate hero-animate-delay-2 text-gray-500 text-sm sm:text-lg max-w-lg mx-auto mb-8">
            금융 계산기부터 게임까지 — 설치 없이 브라우저에서 바로 사용하세요.
          </p>

          {/* Stats */}
          <div className="hero-animate hero-animate-delay-2 flex justify-center gap-6 sm:gap-10 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">
                  <AnimatedCount target={s.count} />
                </div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="hero-animate hero-animate-delay-3 max-w-lg mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="계산기 또는 도구 검색..."
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg shadow-blue-100/50 transition-shadow hover:shadow-xl hover:shadow-blue-100/50"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="검색 지우기"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs — sticky */}
      <div className="sticky top-12 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto scrollbar-hide py-3">
            <button
              data-tab="all"
              onClick={() => handleTabClick("all")}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              전체
            </button>
            {sections.map((s) => {
              const count = search ? filterBySearch(s.items).length : s.items.length;
              const isActive = activeTab === s.key;
              return (
                <button
                  key={s.key}
                  data-tab={s.key}
                  onClick={() => handleTabClick(s.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md shadow-gray-900/20"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span className="text-sm">{s.icon}</span>
                  {s.label}
                  <span className={`text-xs ${isActive ? "text-gray-400" : "text-gray-400"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Recent tools */}
        {!search && activeTab === "all" && recentHrefs.length > 0 && (
          <section className="mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-sm font-semibold text-[var(--muted)]">최근 사용</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {recentHrefs.map((href) => {
                const item = allItems.find((i) => i.href === href);
                if (!item) return null;
                return (
                  <Link
                    key={href}
                    href={href}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-base">{item.emoji}</span>
                    <span className="text-[var(--foreground)] font-medium whitespace-nowrap">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* No results */}
        {search && !hasSearchResults && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg mb-3">&quot;{search}&quot;에 대한 검색 결과가 없습니다.</p>
            <button onClick={() => setSearch("")} className="text-blue-600 hover:underline text-sm font-medium">
              검색 초기화
            </button>
          </div>
        )}

        {/* Content Grid */}
        {visibleSections.map((section) => {
          const filtered = filterBySearch(section.items);
          if (filtered.length === 0) return null;

          return (
            <AnimatedSection
              key={section.key}
              section={section}
              filtered={filtered}
              collapsed={!!collapsed[section.key]}
              onToggle={() => setCollapsed((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
              activeTab={activeTab}
              search={search}
            />
          );
        })}

        {/* Bottom trust bar */}
        <section className="mt-8 mb-4 animate-fade-in">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-6 flex flex-wrap justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span>내 기기에서만 처리</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span>설치 없이 바로 사용</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span>100% 무료</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
