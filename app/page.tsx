"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryRail from "@/components/home/CategoryRail";
import ToolSearch from "@/components/home/ToolSearch";
import { allItems, sections } from "@/lib/sections";
import type { Item, Section } from "@/lib/sections";
import { getRecentTools } from "@/lib/recent";

const recommendedHrefs = [
  "/tools/telepathy-game",
  "/tools/friend-chemistry",
  "/calculators/daily-fortune",
];

const recommendedItems = recommendedHrefs
  .map((href) => allItems.find((item) => item.href === href))
  .filter((item): item is Item => Boolean(item));

const launchHrefs = [
  "/tools/personal-style-test",
  "/tools/ideal-type-worldcup",
  "/calculators/cost-per-use",
  "/tools/digital-fidget",
  "/tools/meme-card",
];

const launchItems = launchHrefs
  .map((href) => allItems.find((item) => item.href === href))
  .filter((item): item is Item => Boolean(item));

const purposeGroups = [
  {
    key: "together",
    label: "친구와 같이 놀기",
    description: "링크를 보내고 답과 취향을 바로 비교하는 게임",
    href: "/category/drinking",
    badge: "초대 링크 · 결과 비교",
    itemHrefs: ["/tools/telepathy-game", "/tools/friend-chemistry", "/tools/ideal-type-worldcup"],
  },
  {
    key: "discover",
    label: "오늘의 나 발견하기",
    description: "매일 달라지는 운세와 공유하고 싶은 성향 결과",
    href: "/category/fun",
    itemHrefs: ["/calculators/daily-fortune", "/tools/energy-type-test", "/calculators/saju"],
  },
  {
    key: "life",
    label: "생활 계산하기",
    description: "나이, 평수, 월급처럼 지금 필요한 숫자를 빠르게",
    href: "/category/life",
    itemHrefs: ["/calculators/age", "/calculators/pyeong", "/calculators/salary"],
  },
  {
    key: "files",
    label: "파일·이미지",
    description: "압축, 변환, 편집을 브라우저에서 빠르게",
    href: "/category/tools",
    itemHrefs: ["/tools/image-compress", "/tools/image-mosaic", "/tools/qr-code"],
  },
].map((group) => ({
  ...group,
  items: group.itemHrefs
    .map((href) => allItems.find((item) => item.href === href))
    .filter((item): item is Item => Boolean(item)),
}));

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

function FeaturedRow({ item, index }: { item: Item; index: number }) {
  return (
    <Link href={item.href} className="home-featured-row">
      <span className="home-row-index">{String(index + 1).padStart(2, "0")}</span>
      <span>
        <strong>{item.title}</strong>
        <small>{item.desc}</small>
      </span>
      <ArrowIcon />
    </Link>
  );
}

function ToolRow({ item, index }: { item: Item; index: number }) {
  return (
    <Link href={item.href} className="home-tool-row">
      <span className="home-tool-mark" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="home-tool-copy">
        <strong>{item.title}</strong>
        <small>{item.desc}</small>
      </span>
      <span className="home-tool-type">{item.href.startsWith("/calculators/") ? "계산기" : "도구"}</span>
      <ArrowIcon />
    </Link>
  );
}

function ToolSection({ section, items, index }: { section: Section; items: Item[]; index: number }) {
  return (
    <section className="home-tool-section" aria-labelledby={`home-section-${section.key}`}>
      <div className="home-section-heading">
        <span className="home-section-number">{String(index + 1).padStart(2, "0")}</span>
        <div>
          <h2 id={`home-section-${section.key}`}>{section.fullLabel}</h2>
          <p>{section.description}</p>
        </div>
        <Link href={`/category/${section.key}`}>
          전체 보기 <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="home-tool-list">
        {items.map((item, itemIndex) => (
          <ToolRow key={item.href} item={item} index={itemIndex} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [recentHrefs, setRecentHrefs] = useState<string[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRecentHrefs(getRecentTools()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase("ko");
  const matchesQuery = useCallback(
    (item: Item) =>
      !normalizedQuery ||
      `${item.title} ${item.desc}`.toLocaleLowerCase("ko").includes(normalizedQuery),
    [normalizedQuery],
  );

  const categoryTabs = useMemo(
    () => [
      {
        key: "all",
        label: "전체 도구",
        count: allItems.filter(matchesQuery).length,
      },
      ...sections.map((section) => ({
        key: section.key,
        label: section.label,
        count: section.items.filter(matchesQuery).length,
      })),
    ],
    [matchesQuery],
  );

  const visibleSections = useMemo(
    () =>
      sections
        .filter((section) => activeCategory === "all" || section.key === activeCategory)
        .map((section) => ({
          section,
          items: section.items.filter(matchesQuery),
        }))
        .filter(({ items }) => items.length > 0),
    [activeCategory, matchesQuery],
  );

  const visibleCount = visibleSections.reduce((total, group) => total + group.items.length, 0);
  const recentItems = recentHrefs
    .map((href) => allItems.find((item) => item.href === href))
    .filter((item): item is Item => Boolean(item));

  return (
    <main className="home-index">
      <section className="home-hero">
        <div className="home-container home-hero-grid">
          <div className="home-hero-copy">
            <p className="home-eyebrow">친구 링크 · 결과 카드 · 오늘의 콘텐츠</p>
            <h1>친구와 같이 하고,<br />결과를 나눠보세요.</h1>
            <p className="home-intro">
              텔레파시 게임부터 친구 케미, 성향 테스트와 오늘의 운세까지.
              가입 없이 바로 시작하고 결과를 친구에게 보내보세요.
            </p>
            <ToolSearch items={allItems} query={query} onQueryChange={setQuery} />
            <p className="home-search-meta" aria-live="polite">
              {query ? `검색 결과 ${visibleCount}개` : `현재 ${allItems.length}개 도구 제공 중`}
            </p>
          </div>

          <aside className="home-featured" aria-labelledby="home-featured-title">
            <div className="home-featured-heading">
              <p>바로 시작</p>
              <h2 id="home-featured-title">지금 같이 하기</h2>
            </div>
            <div>
              {recommendedItems.map((item, index) => (
                <FeaturedRow key={item.href} item={item} index={index} />
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="home-purpose" aria-labelledby="home-purpose-title">
        <div className="home-container">
          <div className="home-purpose-heading">
            <div>
              <p className="home-eyebrow">바로 시작</p>
              <h2 id="home-purpose-title">오늘은 무엇을 해볼까요?</h2>
            </div>
            <p>같이 놀기, 나를 발견하기, 필요한 계산까지 목적별로 골라보세요.</p>
          </div>

          <div className="home-purpose-grid">
            {purposeGroups.map((group, index) => (
              <article key={group.key} className="home-purpose-group">
                <div className="home-purpose-title">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {group.badge && <small>{group.badge}</small>}
                </div>
                <h3>{group.label}</h3>
                <p>{group.description}</p>
                <div className="home-purpose-links">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      {item.title}<span aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
                <Link href={group.href} className="home-purpose-all">
                  분야 전체 보기 <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {recentItems.length > 0 && !query && activeCategory === "all" && (
        <section className="home-recent" aria-labelledby="home-recent-title">
          <div className="home-container home-recent-inner">
            <h2 id="home-recent-title">최근 사용</h2>
            <div className="home-recent-links">
              {recentItems.map((item) => (
                <Link key={item.href} href={item.href}>{item.title}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!query && activeCategory === "all" && (
        <section className="home-recent" aria-labelledby="home-launch-title">
          <div className="home-container home-recent-inner">
            <h2 id="home-launch-title">새로 추가</h2>
            <div className="home-recent-links">
              {launchItems.map((item) => (
                <Link key={item.href} href={item.href}>{item.title}</Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="home-directory" aria-labelledby="home-directory-title">
        <div className="home-container">
          <div className="home-directory-intro">
            <p className="home-eyebrow">도구 서랍</p>
            <h2 id="home-directory-title">{allItems.length}개 도구를 분야별로.</h2>
            <p>게임과 테스트 외에도 금융·생활 계산, 이미지·문서 도구를 모두 이용할 수 있어요.</p>
          </div>

          <div className="home-directory-grid">
            <aside className="home-category-drawer" aria-label="도구 분류">
              <CategoryRail
                items={categoryTabs}
                value={activeCategory}
                onValueChange={setActiveCategory}
                controlsId="home-tool-directory"
              />
            </aside>

            <div
              id="home-tool-directory"
              className="home-directory-content"
              role="tabpanel"
              aria-label="선택한 카테고리의 도구 목록"
            >
              {visibleSections.length > 0 ? (
                visibleSections.map(({ section, items }) => (
                  <ToolSection
                    key={section.key}
                    section={section}
                    items={items}
                    index={sections.findIndex((candidate) => candidate.key === section.key)}
                  />
                ))
              ) : (
                <div className="home-no-results" role="status">
                  <p>“{query}”에 맞는 도구가 없습니다.</p>
                  <button type="button" onClick={() => setQuery("")}>검색어 지우기</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="home-trust" aria-label="서비스 안내">
        <div className="home-container home-trust-grid">
          <div>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
              <path strokeWidth="1.6" d="m9 12 2 2 4-4" />
            </svg>
            <span><strong>개인정보 부담 없이</strong><small>지원되는 도구는 기기 안에서 처리</small></span>
          </div>
          <div>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" d="M13 2 4.5 13H11l-1 9 8.5-12H12l1-8Z" />
            </svg>
            <span><strong>설치 없이 바로</strong><small>웹에서 열고 즉시 사용</small></span>
          </div>
          <div>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="1.6" d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z" />
            </svg>
            <span><strong>전 도구 무료</strong><small>회원가입 없이 필요한 만큼</small></span>
          </div>
        </div>
      </section>
    </main>
  );
}
