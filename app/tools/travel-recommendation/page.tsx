"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";
import {
  DESTINATIONS,
  STYLES,
  COMPANIONS,
  SEASONS,
  DURATIONS,
  BUDGETS,
  REGIONS,
  DISLIKES,
  BUDGET_LEVEL,
  type TravelStyle,
  type Companion,
  type Season,
  type Duration,
  type Budget,
  type Region,
  type Dislike,
  type Destination,
} from "@/lib/travel-data";

/* ══════════════════════════════════════════
   Scoring & Recommendation Logic
   ══════════════════════════════════════════ */

interface Form {
  style: TravelStyle | null;
  companion: Companion | null;
  season: Season | null;
  duration: Duration | null;
  budget: Budget | null;
  region: Region | null;
  dislikes: Dislike[];
}

interface Result {
  dest: Destination;
  score: number;
  reason: string;
}

const INITIAL: Form = {
  style: null,
  companion: null,
  season: null,
  duration: null,
  budget: null,
  region: null,
  dislikes: [],
};

function scoreDestination(d: Destination, f: Form): number {
  let score = 50; // base

  // Region match (critical)
  if (f.region) {
    if (d.region === f.region) score += 20;
    else return 0; // hard filter
  }

  // Style match
  if (f.style) {
    if (d.styles.includes(f.style)) score += 18;
    else score -= 10;
  }

  // Companion match
  if (f.companion) {
    if (d.companions.includes(f.companion)) score += 12;
    else score -= 8;
  }

  // Season match
  if (f.season) {
    if (d.bestSeasons.includes(f.season)) score += 15;
    else score -= 12;
  }

  // Duration match
  if (f.duration) {
    if (d.durations.includes(f.duration)) score += 10;
    else score -= 6;
  }

  // Budget match
  if (f.budget) {
    const userLevel = BUDGET_LEVEL[f.budget];
    const diff = Math.abs(d.budgetLevel - userLevel);
    if (diff === 0) score += 12;
    else if (diff === 1) score += 5;
    else score -= diff * 4;
  }

  // Dislike filter
  if (f.dislikes.length > 0) {
    for (const dl of f.dislikes) {
      if (d.dislikeFlags?.includes(dl)) {
        score -= 20;
      }
    }
  }

  return Math.max(0, Math.min(100, score));
}

function buildReason(d: Destination, f: Form): string {
  const parts: string[] = [];

  if (f.style && d.styles.includes(f.style)) {
    parts.push(`${f.style} 스타일에 딱 맞는 여행지예요`);
  }
  if (f.season && d.bestSeasons.includes(f.season)) {
    parts.push(`${f.season}에 가기 좋은 시기`);
  }
  if (f.companion && d.companions.includes(f.companion)) {
    const companionLabel = f.companion === "가족(아이)" ? "가족 여행" : `${f.companion} 여행`;
    parts.push(`${companionLabel}으로 인기`);
  }
  if (f.duration && d.durations.includes(f.duration)) {
    parts.push(`${f.duration} 일정에 적합`);
  }
  if (f.budget) {
    const userLevel = BUDGET_LEVEL[f.budget];
    if (Math.abs(d.budgetLevel - userLevel) <= 1) {
      parts.push("예산 범위에 적합");
    }
  }

  if (parts.length === 0) {
    parts.push(`${d.region === "국내" ? "국내" : "해외"} 인기 여행지`);
  }

  return parts.join(", ") + "입니다. " + d.description;
}

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */

export default function TravelRecommendationPage() {
  const [form, setForm] = useState<Form>({ ...INITIAL });
  const [results, setResults] = useState<Result[] | null>(null);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const recommend = () => {
    const scored = DESTINATIONS.map((d) => ({
      dest: d,
      score: scoreDestination(d, form),
      reason: buildReason(d, form),
    }))
      .filter((r) => r.score > 0)
      .sort((a, b) => {
        // Add small random factor for variety
        const rA = a.score + (Math.random() - 0.5) * 6;
        const rB = b.score + (Math.random() - 0.5) * 6;
        return rB - rA;
      })
      .slice(0, 5);

    setResults(scored);
    setShuffleSeed((s) => s + 1);
    // scroll to results
    setTimeout(() => {
      document.getElementById("travel-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const reRecommend = () => {
    recommend();
  };

  const toggleDislike = (d: Dislike) => {
    setForm((prev) => ({
      ...prev,
      dislikes: prev.dislikes.includes(d)
        ? prev.dislikes.filter((x) => x !== d)
        : [...prev.dislikes, d],
    }));
  };

  // Popular destinations
  const popularDestinations = useMemo(
    () => [
      { rank: 1, name: "제주도", emoji: "🍊", region: "국내" },
      { rank: 2, name: "오사카", emoji: "🏯", region: "일본" },
      { rank: 3, name: "부산", emoji: "🌊", region: "국내" },
      { rank: 4, name: "다낭", emoji: "🏖️", region: "베트남" },
      { rank: 5, name: "방콕", emoji: "🛕", region: "태국" },
      { rank: 6, name: "도쿄", emoji: "🗼", region: "일본" },
      { rank: 7, name: "강릉", emoji: "☕", region: "국내" },
      { rank: 8, name: "경주", emoji: "🏛️", region: "국내" },
      { rank: 9, name: "파리", emoji: "🗼", region: "프랑스" },
      { rank: 10, name: "여수", emoji: "🌅", region: "국내" },
    ],
    []
  );

  const styleEmojis: Record<TravelStyle, string> = {
    힐링: "🧘",
    액티비티: "🏄",
    문화탐방: "🏛️",
    맛집투어: "🍽️",
    자연: "🌿",
    쇼핑: "🛍️",
  };

  const companionEmojis: Record<Companion, string> = {
    혼자: "🧑",
    연인: "💑",
    친구: "👫",
    "가족(아이)": "👨‍👩‍👧",
    부모님: "🧓",
  };

  const seasonEmojis: Record<Season, string> = {
    봄: "🌸",
    여름: "☀️",
    가을: "🍂",
    겨울: "❄️",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
          <span className="text-sm">✈️</span>
          조건별 맞춤 추천
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          여행지 추천 도우미
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          여행 스타일을 선택하면 100곳 이상의 여행지 중 나에게 딱 맞는 곳을 추천해 드려요
        </p>
      </div>

      {/* Input Form */}
      <div className="calc-card p-5 sm:p-8 mb-8">
        {/* Travel Style */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            여행 스타일
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {STYLES.map((s) => (
              <button
                key={s}
                onClick={() => setForm((p) => ({ ...p, style: p.style === s ? null : s }))}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  form.style === s
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{styleEmojis[s]}</span>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Companion */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            동행
          </label>
          <div className="flex flex-wrap gap-2">
            {COMPANIONS.map((c) => (
              <button
                key={c}
                onClick={() => setForm((p) => ({ ...p, companion: p.companion === c ? null : c }))}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.companion === c
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{companionEmojis[c]}</span>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Season */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            계절 / 시기
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => setForm((p) => ({ ...p, season: p.season === s ? null : s }))}
                className={`flex flex-col items-center gap-1 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  form.season === s
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{seasonEmojis[s]}</span>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            여행 기간
          </label>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                onClick={() => setForm((p) => ({ ...p, duration: p.duration === d ? null : d }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.duration === d
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            예산
          </label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setForm((p) => ({ ...p, budget: p.budget === b ? null : b }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.budget === b
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            국내 / 해외
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setForm((p) => ({ ...p, region: p.region === r ? null : r }))}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.region === r
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {r === "국내" ? "🇰🇷 국내" : r === "해외(가까운)" ? "🌏 해외 (가까운)" : "🌍 해외 (먼)"}
              </button>
            ))}
          </div>
        </div>

        {/* Dislikes */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            선호하지 않는 것{" "}
            <span className="text-gray-400 font-normal">(다중선택 가능)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {DISLIKES.map((d) => (
              <button
                key={d}
                onClick={() => toggleDislike(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  form.dislikes.includes(d)
                    ? "bg-red-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={recommend}
          className="calc-btn-primary w-full text-base py-3.5"
        >
          <span className="text-lg">✈️</span>
          여행지 추천 도우미받기
        </button>
      </div>

      {/* Results */}
      {results && (
        <div id="travel-results" className="mb-8 animate-fade-in">
          <div className="calc-card overflow-hidden">
            <div className="calc-result-header">
              <p className="text-sm opacity-80 mb-1">추천 결과</p>
              <h2 className="text-xl font-bold relative z-10">
                맞춤 여행지 TOP {results.length}
              </h2>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              {results.map((r, idx) => (
                <div
                  key={`${r.dest.name}-${shuffleSeed}-${idx}`}
                  className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : idx === 1
                            ? "bg-gray-200 text-gray-600"
                            : idx === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Name & Emoji & Region */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xl">{r.dest.emoji}</span>
                        <h3 className="text-base font-bold text-gray-900">
                          {r.dest.name}
                        </h3>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {r.dest.country}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {r.dest.bestSeasons.map((s) => (
                          <span
                            key={s}
                            className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full"
                          >
                            {seasonEmojis[s]} {s}
                          </span>
                        ))}
                        {r.dest.durations.map((d) => (
                          <span
                            key={d}
                            className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full"
                          >
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Highlights */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {r.dest.highlights.map((h) => (
                          <span
                            key={h}
                            className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      {/* Recommendation reason */}
                      <div className="bg-white rounded-xl p-3 border border-gray-100 mb-3">
                        <p className="text-xs font-semibold text-purple-600 mb-1">
                          <span className="mr-1">🤖</span>추천 이유
                        </p>
                        <p className="text-sm text-gray-700">{r.reason}</p>
                      </div>

                      {/* Travel Tip */}
                      <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 mb-3">
                        <p className="text-xs font-semibold text-blue-600 mb-1">
                          <span className="mr-1">💡</span>여행 팁
                        </p>
                        <p className="text-sm text-blue-800">{r.dest.tip}</p>
                      </div>

                      {/* Score Bar */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          적합도
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${Math.min(Math.round(r.score), 100)}%`,
                              background:
                                r.score >= 70
                                  ? "linear-gradient(90deg, #3b82f6, #8b5cf6)"
                                  : r.score >= 50
                                    ? "linear-gradient(90deg, #f59e0b, #f97316)"
                                    : "#9ca3af",
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 w-10 text-right">
                          {Math.min(Math.round(r.score), 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Re-recommend */}
            <div className="p-4 sm:p-6 pt-0">
              <button
                onClick={reRecommend}
                className="calc-btn-secondary w-full"
              >
                <span className="text-base">🔄</span>
                다시 추천받기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popular Destinations */}
      <div className="calc-card p-6 sm:p-8 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">🏆</span>
          인기 여행지 TOP 10
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {popularDestinations.map((d) => (
            <div
              key={d.rank}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  d.rank <= 3
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {d.rank}
              </span>
              <span className="text-lg">{d.emoji}</span>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-gray-700">
                  {d.name}
                </span>
                <span className="text-xs text-gray-400 ml-1.5">
                  {d.region}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="calc-seo-card mb-8">
        <h2 className="calc-seo-title">여행지 추천 도우미 사용 가이드</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            여행지 추천 도우미은 여행 스타일, 동행, 계절, 기간, 예산 등을 종합적으로
            분석하여 가장 적합한 국내외 여행지를 추천해 드리는 서비스입니다.
          </p>
          <p>
            100곳 이상의 국내외 여행지 데이터베이스를 기반으로 제주도, 부산 등 국내
            여행지부터 오사카, 방콕, 파리 등 해외 여행지까지 다양한 선택지를
            제공합니다.
          </p>
          <p>
            각 여행지의 추천 계절, 적합한 여행 기간, 하이라이트, 여행 팁까지 한눈에
            확인할 수 있어 여행 계획을 세우는 데 도움이 됩니다. 추천 결과가 마음에
            들지 않으면 &quot;다시 추천받기&quot; 버튼을 눌러 다른 여행지를 확인해
            보세요.
          </p>
        </div>
      </div>

      <RelatedTools current="travel-recommendation" />
    </div>
  );
}
