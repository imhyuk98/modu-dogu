"use client";

import { useMemo, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import ShareResultCard from "@/components/ShareResultCard";

const targets = [
  { label: "1km", km: 1 },
  { label: "5km", km: 5 },
  { label: "10km", km: 10 },
  { label: "하프", km: 21.0975 },
  { label: "풀", km: 42.195 },
];

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "-";
  const seconds = Math.round(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export default function RunningPacePage() {
  const [distance, setDistance] = useState("5");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("30");
  const [seconds, setSeconds] = useState("0");

  const result = useMemo(() => {
    const km = Number(distance);
    const total = Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
    if (km <= 0 || total <= 0) return null;
    const pace = total / km;
    return {
      km,
      total,
      pace,
      speed: 3600 / pace,
      estimates: targets.map((target) => ({ ...target, seconds: total * Math.pow(target.km / km, 1.06) })),
    };
  }, [distance, hours, minutes, seconds]);

  const inputClass = "mt-2 min-h-12 w-full rounded-lg border border-gray-300 bg-white px-3 text-lg font-bold text-gray-900 outline-none focus:border-[#a93d28] focus:ring-2 focus:ring-[#a93d28]/10";

  return (
    <main className="min-h-screen bg-gray-50 py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4">
        <header className="mb-8">
          <p className="text-sm font-bold text-[#a93d28]">RUNNING UTILITY</p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">러닝 페이스 계산기</h1>
          <p className="mt-4 leading-7 text-gray-600">거리와 기록을 입력하면 1km 페이스, 평균 속도, 5K부터 마라톤까지 예상 기록을 계산합니다.</p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="calc-card p-6 sm:p-7">
            <h2 className="text-lg font-extrabold text-gray-900">내 기록 입력</h2>
            <label className="mt-6 block text-sm font-bold text-gray-700">거리 (km)<input className={inputClass} type="number" min="0.1" step="0.01" inputMode="decimal" value={distance} onChange={(event) => setDistance(event.target.value)} /></label>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <label className="text-sm font-bold text-gray-700">시간<input className={inputClass} type="number" min="0" inputMode="numeric" value={hours} onChange={(event) => setHours(event.target.value)} /></label>
              <label className="text-sm font-bold text-gray-700">분<input className={inputClass} type="number" min="0" max="59" inputMode="numeric" value={minutes} onChange={(event) => setMinutes(event.target.value)} /></label>
              <label className="text-sm font-bold text-gray-700">초<input className={inputClass} type="number" min="0" max="59" inputMode="numeric" value={seconds} onChange={(event) => setSeconds(event.target.value)} /></label>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {[3, 5, 10, 21.0975, 42.195].map((km) => <button key={km} type="button" onClick={() => setDistance(String(km))} className="min-h-10 rounded-full border border-gray-300 px-3 text-xs font-bold text-gray-600 hover:border-[#a93d28] hover:text-[#a93d28]">{km === 21.0975 ? "하프" : km === 42.195 ? "풀" : `${km}km`}</button>)}
            </div>
          </section>

          <section className="calc-card overflow-hidden" aria-live="polite">
            <div className="bg-[#1d1c19] p-7 text-white sm:p-8">
              <p className="font-mono text-xs font-bold tracking-[0.16em] text-[#e67d62]">AVERAGE PACE</p>
              <p className="mt-5 text-5xl sm:text-6xl font-black tracking-tight">{result ? formatTime(result.pace) : "-"}<span className="ml-2 text-lg font-semibold text-white/60">/km</span></p>
              <div className="mt-7 grid grid-cols-2 gap-5 border-t border-white/20 pt-5"><div><small className="text-white/50">평균 속도</small><strong className="mt-1 block text-xl">{result ? result.speed.toFixed(2) : "-"} km/h</strong></div><div><small className="text-white/50">입력 기록</small><strong className="mt-1 block text-xl">{result ? formatTime(result.total) : "-"}</strong></div></div>
            </div>
            <div className="p-6 sm:p-8">
              <h2 className="font-extrabold text-gray-900">거리별 예상 기록</h2>
              <div className="mt-4 divide-y divide-gray-100">
                {targets.map((target) => <div key={target.label} className="flex items-center justify-between py-3"><span className="text-sm font-semibold text-gray-600">{target.label}</span><strong className="font-mono text-gray-950">{result ? formatTime(result.estimates.find((item) => item.km === target.km)?.seconds ?? 0) : "-"}</strong></div>)}
              </div>
            </div>
          </section>
        </div>

        {result && <div className="mt-5"><ShareResultCard kicker="RUNNING RECORD" title={`${result.km}km · ${formatTime(result.total)}`} subtitle={`평균 페이스 ${formatTime(result.pace)}/km`} highlights={[{ label: "거리", value: `${result.km}km` }, { label: "기록", value: formatTime(result.total) }, { label: "페이스", value: `${formatTime(result.pace)}/km` }, { label: "속도", value: `${result.speed.toFixed(1)}km/h` }]} shareText={`나의 ${result.km}km 기록은 ${formatTime(result.total)}, 평균 페이스는 ${formatTime(result.pace)}/km!`} fileName="running-pace-record" accent="#c44b2b" /></div>}

        <section className="calc-seo-card mt-8"><h2 className="calc-seo-title">예상 기록은 어떻게 계산하나요?</h2><p className="text-sm leading-7 text-gray-600">거리별 예상 기록은 거리가 길어질수록 페이스가 조금 느려지는 Riegel 방식(기록 × 거리 비율의 1.06제곱)을 사용합니다. 코스, 날씨, 고도와 컨디션에 따라 실제 기록은 달라질 수 있습니다.</p></section>
        <RelatedTools current="running-pace" />
      </div>
    </main>
  );
}
