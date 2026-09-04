"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import ShareResultCard from "@/components/ShareResultCard";
import { trackEvent } from "@/lib/analytics";

const elements = ["목", "화", "토", "금", "수"] as const;
type ElementName = (typeof elements)[number];

const profiles: Record<ElementName, { emoji: string; title: string; keywords: string; action: string; color: string }> = {
  목: { emoji: "🌱", title: "새싹 개척자", keywords: "시작 · 성장 · 추진", action: "미뤄 둔 일을 10분만 시작해 보세요.", color: "bg-emerald-500" },
  화: { emoji: "🔥", title: "햇살 표현가", keywords: "표현 · 열정 · 확산", action: "고마웠던 사람에게 먼저 연락해 보세요.", color: "bg-red-500" },
  토: { emoji: "⛰️", title: "든든한 중심축", keywords: "안정 · 신뢰 · 조율", action: "책상 한 곳을 정리하고 우선순위를 적어 보세요.", color: "bg-amber-500" },
  금: { emoji: "🧭", title: "선명한 설계자", keywords: "기준 · 결단 · 완성", action: "오늘 끝낼 한 가지를 구체적으로 정해 보세요.", color: "bg-slate-500" },
  수: { emoji: "🌊", title: "깊은 탐험가", keywords: "관찰 · 유연 · 탐색", action: "조용히 10분 산책하며 생각을 환기해 보세요.", color: "bg-blue-500" },
};

function digitSum(value: string) {
  return [...value].reduce((sum, character) => sum + (Number(character) || 0), 0);
}

export function calculateSimpleElementProfile(birthDate: string, birthHour: string) {
  const [year = "0", month = "1", day = "1"] = birthDate.split("-");
  const indexes = [digitSum(year) % 5, (Number(month) - 1 + 5) % 5, (Number(day) - 1 + 5) % 5];
  if (birthHour !== "unknown") indexes.push(Math.floor((Number(birthHour) + 1) / 2) % 5);
  const counts = Object.fromEntries(elements.map((element) => [element, 0])) as Record<ElementName, number>;
  indexes.forEach((index) => { counts[elements[index]] += 1; });
  const dominant = elements.reduce((best, current) => counts[current] > counts[best] ? current : best);
  const secondary = elements.filter((element) => element !== dominant).sort((a, b) => counts[b] - counts[a])[0];
  return { counts, dominant, secondary, total: indexes.length };
}

export default function SimpleElementProfilePage() {
  const [birthDate, setBirthDate] = useState("1990-01-01");
  const [birthHour, setBirthHour] = useState("unknown");
  const [submitted, setSubmitted] = useState(false);
  const result = useMemo(() => calculateSimpleElementProfile(birthDate, birthHour), [birthDate, birthHour]);
  const profile = profiles[result.dominant];

  const submit = () => {
    if (!birthDate) return;
    setSubmitted(true);
    trackEvent("tool_complete", { tool: "simple-element-profile", dominant: result.dominant });
  };

  return <div className="py-6">
    <header className="mb-8">
      <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">ENTERTAINMENT TEST</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">간단 오행 성향 테스트</h1>
      <p className="mt-2 max-w-2xl text-gray-600">생년월일 숫자를 공개된 고정 규칙에 대입해 다섯 가지 성향 중 하나를 보여 주는 가벼운 테스트입니다.</p>
      <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950"><strong>정통 사주팔자 계산이 아닙니다.</strong> 입춘·24절기·음력·윤달·진태양시·출생지·자시 기준을 반영하지 않으며 미래나 건강·재물·관계를 예측하지 않습니다.</div>
    </header>

    <section className="calc-card mb-6 p-5 sm:p-6" aria-labelledby="element-input-title">
      <h2 id="element-input-title" className="text-lg font-bold text-gray-900">테스트 입력</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-gray-700">양력 생년월일<input type="date" min="1900-01-01" max="2026-09-04" value={birthDate} onChange={(event) => { setBirthDate(event.target.value); setSubmitted(false); }} className="calc-input mt-2" /></label>
        <label className="text-sm font-bold text-gray-700">태어난 시간(선택)<select value={birthHour} onChange={(event) => { setBirthHour(event.target.value); setSubmitted(false); }} className="calc-input mt-2 bg-white"><option value="unknown">모름 · 시간 제외</option>{Array.from({ length: 24 }, (_, hour) => <option key={hour} value={hour}>{String(hour).padStart(2, "0")}:00~{String((hour + 1) % 24).padStart(2, "0")}:00</option>)}</select></label>
      </div>
      <button type="button" onClick={submit} disabled={!birthDate} className="mt-5 min-h-12 w-full rounded-xl bg-[#a93d28] px-5 font-black text-white disabled:opacity-40">오행 성향 보기</button>
      <p className="mt-3 text-xs text-gray-500">입력값은 서버로 보내거나 저장하지 않고 현재 브라우저에서만 계산합니다.</p>
    </section>

    {submitted && <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#d8d1c5] bg-white" aria-labelledby="element-result-title">
        <div className="bg-[#2c211c] p-7 text-white"><div className="text-5xl" aria-hidden="true">{profile.emoji}</div><p className="mt-4 text-xs font-black tracking-[0.12em] text-[#ffd9c9]">가장 많이 나온 기호 · {result.dominant}</p><h2 id="element-result-title" className="mt-1 text-3xl font-black">{profile.title}</h2><p className="mt-2 text-white/70">{profile.keywords}</p></div>
        <div className="p-5 sm:p-6"><h3 className="font-bold text-gray-900">기호 분포</h3><div className="mt-4 space-y-3">{elements.map((element) => { const percent = result.counts[element] / result.total * 100; return <div key={element}><div className="mb-1 flex justify-between text-sm"><span className="font-bold">{element}</span><span>{result.counts[element]}회 · {Math.round(percent)}%</span></div><div className="h-3 rounded-full bg-gray-100"><div className={`h-3 rounded-full ${profiles[element].color}`} style={{ width: `${percent}%` }} /></div></div>; })}</div><p className="mt-5 rounded-xl bg-[#faf6f3] p-4 text-sm text-gray-700"><strong>오늘 해볼 작은 행동:</strong> {profile.action}</p></div>
      </section>
      <ShareResultCard kicker="오행 성향 테스트" title={`나는 ${profile.title}`} subtitle={`${profile.keywords} 성향 기호가 가장 많이 나왔어요.`} highlights={[{ label: "주 기호", value: result.dominant }, { label: "보조 기호", value: result.secondary }, { label: "입력", value: birthHour === "unknown" ? "날짜 3항목" : "날짜+시간" }, { label: "성격", value: "오락용 테스트" }]} shareText={`나의 오행 성향 테스트 결과는 ${profile.title}!`} fileName="simple-element-profile" url="/calculators/saju" />
    </div>}

    <section className="mt-10 space-y-6 text-sm leading-7 text-gray-600">
      <div className="calc-card p-5 sm:p-6"><h2 className="text-lg font-bold text-gray-900">어떻게 계산하나요?</h2><ol className="mt-3 list-decimal space-y-2 pl-5"><li>연도 네 자리 숫자의 합을 5로 나눈 나머지를 사용합니다.</li><li>월−1과 일−1을 각각 5로 나눈 나머지를 사용합니다.</li><li>시간을 입력하면 2시간 단위 번호를 한 번 더 반영합니다.</li><li>0부터 4를 목·화·토·금·수 순서로 대응하고 가장 자주 나온 기호를 결과로 표시합니다. 동률이면 이 순서를 우선합니다.</li></ol><p className="mt-3 font-bold text-gray-900">이 규칙은 결과를 누구나 재현할 수 있게 만든 이 사이트의 오락용 규칙이며 명리학의 사주 산식이 아닙니다.</p></div>
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-950"><h2 className="font-bold">정통 사주와 무엇이 다른가요?</h2><p className="mt-2">전통 사주는 절기 경계로 연·월주를 정하고 음력·윤달 변환, 출생지에 따른 시각 보정, 자시 처리 등 여러 기준이 필요합니다. 이 페이지는 그 조건을 구현하지 않았으므로 사주팔자나 만세력 결과를 표시하지 않습니다.</p></div>
    </section>
    <RelatedTools current="saju" />
  </div>;
}
