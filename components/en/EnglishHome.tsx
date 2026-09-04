"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { englishSections, englishToolHref, englishTools, type EnglishTool } from "@/lib/en-tools";
import CategoryRail from "@/components/home/CategoryRail";

const tones = ["blue", "pink", "yellow", "green", "orange", "violet"];

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 12h14m-5-5 5 5-5 5" /></svg>;
}

function ToolCard({ tool, number, tone }: { tool: EnglishTool; number: number; tone: string }) {
  return (
    <Link href={englishToolHref(tool)} prefetch={false} className={`store-tool-card store-tone-${tone}`}>
      <span className="store-tool-art" aria-hidden="true"><span className="store-tool-number">MT.{String(number).padStart(3, "0")}</span>{tool.featured && <span className="store-tool-new">PICK</span>}<span className="store-tool-emoji">{tool.emoji}</span></span>
      <span className="store-tool-info"><span><strong>{tool.shortTitle}</strong><small>{tool.description}</small></span><ArrowIcon /></span>
    </Link>
  );
}

const showcase = [
  { tool: englishTools.find((tool) => tool.slug === "name-generator")!, overline: "For your next character", badge: "Fresh names", action: "Make a shortlist", tone: "blue" },
  { tool: englishTools.find((tool) => tool.slug === "age")!, overline: "Dates without the math", badge: "Exact to the day", action: "Calculate my age", tone: "yellow" },
  { tool: englishTools.find((tool) => tool.slug === "reaction-test")!, overline: "Faster than your group chat?", badge: "Five-round score", action: "Test my reflexes", tone: "pink" },
];

export default function EnglishHome() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<"all" | "calculators" | "web-tools" | "fun">("all");
  const needle = query.trim().toLocaleLowerCase("en");
  const groups = useMemo(() => englishSections.map((section) => ({ ...section, tools: englishTools.filter((tool) => tool.section === section.key && (!needle || `${tool.title} ${tool.description} ${tool.keywords.join(" ")}`.toLocaleLowerCase("en").includes(needle))) })).filter((section) => (active === "all" || section.key === active) && section.tools.length > 0), [active, needle]);
  const visibleCount = groups.reduce((total, group) => total + group.tools.length, 0);

  return (
    <div className="home-index store-home" lang="en">
      <section className="store-hero" aria-labelledby="english-store-title">
        <div className="store-wide">
          <div className="store-topline"><span>Useful things, minus the clutter</span><span>No sign-up · {englishTools.length} free tools</span></div>
          <h1 id="english-store-title" aria-label="Modu Tools">MODU<br className="sm:hidden" /> TOOLS</h1>
          <div className="store-hero-bottom">
            <p>Calculate it, convert it, make it, or play it.<br />One tidy shelf of tools that work right away.</p>
            <div className="store-hero-search">
              <div className="home-search-wrap">
                <label className="home-search-label" htmlFor="english-tool-search">Find a tool</label>
                <div className="home-search-field"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg><input id="english-tool-search" type="search" value={query} onChange={(event) => { setQuery(event.target.value); if (event.target.value.trim()) setActive("all"); }} placeholder="Try age, image, JSON, random…" autoComplete="off" />{query && <button type="button" className="home-search-clear" onClick={() => setQuery("")}>Clear</button>}</div>
              </div>
              <p className="home-search-meta" aria-live="polite">{query ? `${visibleCount} matching tools` : "Free, fast, and ready in one click"}</p>
            </div>
          </div>
        </div>
      </section>

      {!query && <section className="store-showcase" aria-label="Featured tools"><div className="store-showcase-grid">{showcase.map((entry, index) => <Link key={entry.tool.slug} href={englishToolHref(entry.tool)} className={`store-showcase-card store-tone-${entry.tone}`}><span className="store-showcase-topline"><span>{entry.overline}</span><span>0{index + 1}</span></span><span className="store-showcase-title"><strong>{entry.tool.shortTitle}</strong><small>{entry.tool.description}</small></span><span className="store-showcase-art" aria-hidden="true"><span className="store-showcase-orbit" /><span className="store-showcase-emoji">{entry.tool.emoji}</span><span className="store-showcase-badge">{entry.badge}</span></span><span className="store-showcase-action">{entry.action} <ArrowIcon /></span></Link>)}</div></section>}

      <section id="all-tools" className="store-directory" aria-labelledby="english-directory-title">
        <div className="store-wide">
          <div className="store-directory-heading"><div><p>Not sure what you need yet?</p><h2 id="english-directory-title">Browse the<br />whole shelf.</h2></div><p>Every tool opens instantly and works on mobile.<br />Image, text, and password tools run locally.</p></div>
          <div className="store-category-bar"><CategoryRail items={[{ key: "all", label: "All", count: englishTools.length }, ...englishSections.map(({ key, label }) => ({ key, label, count: englishTools.filter((tool) => tool.section === key).length }))]} value={active} onValueChange={(value) => setActive(value as typeof active)} controlsId="english-tool-directory" ariaLabel="Tool categories" /></div>
          <div id="english-tool-directory" className="store-directory-content" role="tabpanel">
            {groups.length ? groups.map((section) => {
              const sectionIndex = englishSections.findIndex((candidate) => candidate.key === section.key);
              const offset = englishSections.slice(0, sectionIndex).reduce((total, candidate) => total + englishTools.filter((tool) => tool.section === candidate.key).length, 0);
              return <section key={section.key} id={section.key} className="store-tool-section" aria-labelledby={`english-section-${section.key}`}><div className="store-section-heading"><span className="store-section-index">0{sectionIndex + 1}</span><div><p>{section.icon} {section.tools.length} tools on this shelf</p><h2 id={`english-section-${section.key}`}>{section.fullLabel}</h2><small>{section.description}</small></div><a href="#english-store-title">Back to top ↑</a></div><div className="store-tool-grid">{section.tools.map((tool, index) => <ToolCard key={`${tool.group}-${tool.slug}`} tool={tool} number={offset + index + 1} tone={tones[(offset + index) % tones.length]} />)}</div></section>;
            }) : <div className="store-no-results" role="status"><p>No match yet. Try a simpler keyword.</p><button type="button" onClick={() => setQuery("")}>Show every tool</button></div>}
          </div>
        </div>
      </section>

      <section className="store-promise" aria-label="Service promises"><div className="store-wide store-promise-grid"><p><strong>FREE</strong><span>No checkout waiting at the end</span></p><p><strong>INSTANT</strong><span>No account before the answer</span></p><p><strong>PRIVATE</strong><span>Local processing where possible</span></p></div><p className="store-credit">Design direction adapted from <a href="https://www.figma.com/community/file/1497434107110917186/hip-fashion-sale" target="_blank" rel="noreferrer">Hip Fashion Sale</a> · CC BY 4.0</p></section>
    </div>
  );
}
