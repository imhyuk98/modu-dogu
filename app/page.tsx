"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryRail from "@/components/home/CategoryRail";
import ToolSearch from "@/components/home/ToolSearch";
import { allItems, sections } from "@/lib/sections";
import type { Item, Section } from "@/lib/sections";
import { getRecentTools } from "@/lib/recent";

const showcase = [
  {
    href: "/tools/telepathy-game",
    overline: "찐친이면 이건 맞혀야지",
    badge: "말 안 해도 알지?",
    action: "우리 진짜 통하나?",
    tone: "blue",
  },
  {
    href: "/calculators/daily-fortune",
    overline: "오늘 운빨 체크",
    badge: "과몰입 금지",
    action: "내 운세 까보기",
    tone: "yellow",
  },
  {
    href: "/tools/friend-chemistry",
    overline: "단톡에 슬쩍 투척",
    badge: "우정 검거",
    action: "우리 케미 몇 점?",
    tone: "pink",
  },
]
  .map((entry) => ({
    ...entry,
    item: allItems.find((item) => item.href === entry.href),
  }))
  .filter((entry): entry is (typeof entry) & { item: Item } => Boolean(entry.item));

const newHrefs = new Set([
  "/tools/personal-style-test",
  "/tools/ideal-type-worldcup",
  "/calculators/cost-per-use",
  "/tools/digital-fidget",
  "/tools/meme-card",
]);

const tones = ["blue", "pink", "yellow", "green", "orange", "violet"];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

function ShowcaseCard({
  item,
  overline,
  badge,
  action,
  tone,
  index,
}: {
  item: Item;
  overline: string;
  badge: string;
  action: string;
  tone: string;
  index: number;
}) {
  return (
    <Link href={item.href} className={`store-showcase-card store-tone-${tone}`}>
      <span className="store-showcase-topline">
        <span>{overline}</span>
        <span>0{index + 1}</span>
      </span>
      <span className="store-showcase-title">
        <strong>{item.title}</strong>
        <small>{item.desc}</small>
      </span>
      <span className="store-showcase-art" aria-hidden="true">
        <span className="store-showcase-orbit" />
        <span className="store-showcase-emoji">{item.emoji}</span>
        <span className="store-showcase-badge">{badge}</span>
      </span>
      <span className="store-showcase-action">
        {action} <ArrowIcon />
      </span>
    </Link>
  );
}

function ToolCard({
  item,
  number,
  tone,
}: {
  item: Item;
  number: number;
  tone: string;
}) {
  return (
    <Link href={item.href} prefetch={false} className={`store-tool-card store-tone-${tone}`}>
      <span className="store-tool-art" aria-hidden="true">
        <span className="store-tool-number">MD.{String(number).padStart(3, "0")}</span>
        {newHrefs.has(item.href) && <span className="store-tool-new">NEW</span>}
        <span className="store-tool-emoji">{item.emoji}</span>
      </span>
      <span className="store-tool-info">
        <span>
          <strong>{item.title}</strong>
          <small>{item.desc}</small>
        </span>
        <ArrowIcon />
      </span>
    </Link>
  );
}

function ToolSection({
  section,
  items,
  index,
}: {
  section: Section;
  items: Item[];
  index: number;
}) {
  const sectionOffset = sections
    .slice(0, index)
    .reduce((total, candidate) => total + candidate.items.length, 0);

  return (
    <section className="store-tool-section" aria-labelledby={`store-section-${section.key}`}>
      <div className="store-section-heading">
        <span className="store-section-index">0{index + 1}</span>
        <div>
          <p>{section.icon} 무려 {items.length}개 있음</p>
          <h2 id={`store-section-${section.key}`}>{section.fullLabel}</h2>
          <small>{section.description}</small>
        </div>
        <Link href={`/category/${section.key}`} prefetch={false}>
          이 카테고리 털기 <ArrowIcon />
        </Link>
      </div>
      <div className="store-tool-grid">
        {items.map((item, itemIndex) => (
          <ToolCard
            key={item.href}
            item={item}
            number={sectionOffset + itemIndex + 1}
            tone={tones[(sectionOffset + itemIndex) % tones.length]}
          />
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
        label: "전체",
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
    .filter((item): item is Item => Boolean(item))
    .slice(0, 5);

  return (
    <main className="home-index store-home">
      <section className="store-hero" aria-labelledby="store-title">
        <div className="store-wide">
          <div className="store-topline">
            <span>쓸데없어 보여도 은근 다 씀</span>
            <span>로그인 없음 · {allItems.length}개 무료</span>
          </div>
          <h1 id="store-title" aria-label="모두의 도구">모두의도구</h1>
          <div className="store-hero-bottom">
            <p>
              운세 보러 왔다가 연봉 계산하고 감.<br />
              재미도 실용도, 일단 눌러보면 됨.
            </p>
            <div className="store-hero-search">
              <ToolSearch items={allItems} query={query} onQueryChange={setQuery} />
              <p className="home-search-meta" aria-live="polite">
                {query ? `${visibleCount}개 찾음` : "로그인 없이 바로 가능"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!query && (
        <section className="store-showcase" aria-label="지금 인기 있는 도구">
          <div className="store-showcase-grid">
            {showcase.map((entry, index) => (
              <ShowcaseCard
                key={entry.href}
                item={entry.item}
                overline={entry.overline}
                badge={entry.badge}
                action={entry.action}
                tone={entry.tone}
                index={index}
              />
            ))}
          </div>
        </section>
      )}

      {recentItems.length > 0 && !query && activeCategory === "all" && (
        <section className="store-recent" aria-labelledby="store-recent-title">
          <div className="store-wide store-recent-inner">
            <h2 id="store-recent-title">아까 그거</h2>
            <div>
              {recentItems.map((item) => (
                <Link key={item.href} href={item.href}>{item.title} <span aria-hidden="true">↗</span></Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="store-directory" aria-labelledby="store-directory-title">
        <div className="store-wide">
          <div className="store-directory-heading">
            <div>
              <p>그냥 지나치기엔 좀 궁금함</p>
              <h2 id="store-directory-title">뭐 할지 몰라서<br />다 준비함.</h2>
            </div>
            <p>
              놀 거리부터 돈·생활 계산, 이미지 도구까지.<br />
              저장해두면 언젠가 꼭 씀.
            </p>
          </div>

          <div className="store-category-bar">
            <CategoryRail
              items={categoryTabs}
              value={activeCategory}
              onValueChange={setActiveCategory}
              controlsId="store-tool-directory"
            />
          </div>

          <div
            id="store-tool-directory"
            className="store-directory-content"
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
              <div className="store-no-results" role="status">
                <p>“{query}”은 아직 없음. 다른 걸 찾아볼까?</p>
                <button type="button" onClick={() => setQuery("")}>처음부터 보기</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="store-promise" aria-label="서비스 안내">
        <div className="store-wide store-promise-grid">
          <p><strong>FREE</strong><span>결제창? 그런 거 없음</span></p>
          <p><strong>CLICK</strong><span>로그인 없이 바로 시작</span></p>
          <p><strong>PRIVATE</strong><span>가능한 건 브라우저에서 처리</span></p>
        </div>
        <p className="store-credit">
          Design direction adapted from{" "}
          <a href="https://www.figma.com/community/file/1497434107110917186/hip-fashion-sale" target="_blank" rel="noreferrer">
            Hip Fashion Sale
          </a>{" "}
          · CC BY 4.0
        </p>
      </section>
    </main>
  );
}
