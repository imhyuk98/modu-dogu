"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { sections, sectionColors } from "@/lib/sections";
import type { Item } from "@/lib/sections";

function ToolCard({ item, colorKey, index, featured }: { item: Item; colorKey: string; index: number; featured?: boolean }) {
  const colors = sectionColors[colorKey] || sectionColors.tools;
  return (
    <div className="group card-enter" style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}>
      <Link
        href={item.href}
        className={`tool-card block bg-white rounded-2xl border ${colors.border} ${colors.hoverBg} p-4 h-full relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${colors.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className="flex items-center gap-3.5">
          <span className={`text-[1.35rem] w-11 h-11 flex-shrink-0 ${colors.iconBg} rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm`}>
            {item.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.8125rem] font-bold text-gray-900 truncate group-hover:text-gray-800">{item.title}</p>
            <p className="text-[0.6875rem] text-gray-400 mt-0.5 truncate group-hover:text-gray-500 transition-colors">{item.desc}</p>
          </div>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const section = sections.find((s) => s.key === slug);

  if (!section) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-gray-500 text-lg mb-4">카테고리를 찾을 수 없습니다.</p>
        <Link href="/" className="text-blue-600 hover:underline font-medium">홈으로 돌아가기</Link>
      </div>
    );
  }

  const colors = sectionColors[section.key];
  const otherSections = sections.filter((s) => s.key !== slug);

  return (
    <div>
      {/* Hero header */}
      <section className={`${colors.bg} border-b ${colors.border}`}>
        <div className="max-w-4xl mx-auto px-4 pt-10 pb-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-5 flex items-center gap-1.5" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-blue-600 transition-colors">홈</Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-medium">{section.fullLabel}</span>
          </nav>

          <div className="flex items-center gap-4 mb-3">
            <div className={`w-14 h-14 ${colors.iconBg} rounded-2xl flex items-center justify-center text-3xl`}>
              {section.icon}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                {section.fullLabel}
              </h1>
              <p className="text-gray-500 text-sm mt-1">{section.items.length}개의 도구</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">{section.description}</p>
        </div>
      </section>

      {/* Tools grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.items.map((item, i) => (
            <ToolCard key={item.href} item={item} colorKey={section.key} index={i} featured={item.featured} />
          ))}
        </div>

        {/* Other categories */}
        <section className="mt-14 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-5">다른 카테고리</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {otherSections.map((s) => {
              const c = sectionColors[s.key];
              return (
                <Link
                  key={s.key}
                  href={`/category/${s.key}`}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${c.border} ${c.hoverBg} bg-white transition-all hover:shadow-sm group`}
                >
                  <div className={`w-10 h-10 ${c.iconBg} rounded-xl flex items-center justify-center text-xl transition-transform group-hover:scale-105`}>
                    {s.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.fullLabel}</p>
                    <p className="text-xs text-gray-400">{s.items.length}개</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* SEO content */}
        <section className="mt-14">
          <div className="calc-seo-card">
            <h2 className="calc-seo-title">{section.fullLabel} 안내</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {section.description} 모든 도구는 설치 없이 브라우저에서 바로 사용할 수 있으며, 입력한 데이터는 서버로 전송되지 않고 내 기기에서만 처리됩니다.
              계산 결과는 참고용이며, 정확한 금액은 관련 기관에 문의하시기 바랍니다.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
