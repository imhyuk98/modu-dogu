"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { sections, sectionColors } from "@/lib/sections";
import type { Item } from "@/lib/sections";
import { categoryGuides } from "@/lib/category-guides";

function ToolCard({ item, colorKey, index }: { item: Item; colorKey: string; index: number }) {
  const colors = sectionColors[colorKey] || sectionColors.tools;
  return (
    <div className="group card-enter" style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}>
      <Link
        href={item.href}
        className={`tool-card block bg-white rounded-2xl border ${colors.border} ${colors.hoverBg} p-4 h-full relative overflow-hidden`}
      >
        <div className={`absolute top-0 left-0 right-0 h-[2px] ${colors.iconBg} opacity-0 group-hover:opacity-100 transition-opacity`} />
        <div className="flex items-center gap-2 sm:gap-3.5">
          <span className={`text-lg sm:text-[1.35rem] w-9 h-9 sm:w-11 sm:h-11 flex-shrink-0 ${colors.iconBg} rounded-xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-sm`}>
            {item.emoji}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-[0.8125rem] font-bold text-gray-900 truncate group-hover:text-gray-800">{item.title}</p>
            <p className="hidden sm:line-clamp-2 text-[0.6875rem] leading-snug text-gray-400 mt-0.5 group-hover:text-gray-500 transition-colors">{item.desc}</p>
          </div>
          <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  const guide = categoryGuides[section.key];
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
              <p className="text-gray-500 text-sm mt-1">도구 {section.items.length}개 싹 모음</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl">{section.description}</p>
        </div>
      </section>

      {/* Tools grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {guide && (
          <div className="mb-10 space-y-6">
            <section className="calc-card p-6 sm:p-8">
              <p className={`text-xs font-black tracking-[0.14em] ${colors.text}`}>CATEGORY GUIDE</p>
              <h2 className="mt-2 text-2xl font-black text-gray-950">{guide.question}</h2>
              <p className="mt-3 leading-7 text-gray-600">{guide.answer}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {guide.useCases.map((useCase) => <div key={useCase} className={`${colors.bg} rounded-xl p-4 text-sm font-semibold leading-6 text-gray-800`}>{useCase}</div>)}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-black text-gray-900">먼저 써볼 대표 도구</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {guide.representative.map((item) => <Link key={item.href} href={item.href} className={`rounded-2xl border ${colors.border} bg-white p-5 transition-shadow hover:shadow-md`}><strong className="text-gray-900">{item.title}</strong><p className="mt-2 text-sm leading-6 text-gray-600">{item.reason}</p><span className={`mt-3 inline-block text-sm font-bold ${colors.text}`}>열기 →</span></Link>)}
              </div>
            </section>
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="calc-card p-6"><h2 className="text-lg font-black text-gray-900">고르는 기준</h2><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-gray-600">{guide.choosing.map((item) => <li key={item}>{item}</li>)}</ol></div>
              <div className="calc-card p-6"><h2 className="text-lg font-black text-gray-900">입력 → 출력</h2><dl className="mt-3 space-y-3 text-sm leading-6"><div><dt className="font-bold text-gray-800">입력</dt><dd className="text-gray-600">{guide.flow.input}</dd></div><div><dt className="font-bold text-gray-800">출력</dt><dd className="text-gray-600">{guide.flow.output}</dd></div></dl></div>
            </section>
            <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="font-black text-amber-950">사용 전 주의</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900">{guide.cautions.map((item) => <li key={item}>{item}</li>)}</ul></aside>
          </div>
        )}

        <h2 className="mb-4 text-xl font-black text-gray-900">전체 도구 {section.items.length}개</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {section.items.map((item, i) => (
            <ToolCard key={item.href} item={item} colorKey={section.key} index={i} />
          ))}
        </div>

        {/* Other categories */}
        <section className="mt-14 pt-8 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-5">다른 것도 볼래?</h2>
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
            <h2 className="calc-seo-title">도구 사용 전 확인</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              계산과 테스트 결과는 참고용입니다. 이미지·텍스트 등 브라우저에서 처리할 수 있는 데이터는 가능한 한 내 기기 안에서 처리합니다.
              세금·건강처럼 전문적인 판단이 필요한 결과는 관련 기관이나 전문가에게 다시 확인해 주세요.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
