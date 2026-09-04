"use client";

import { useMemo, useRef, useState } from "react";
import RelatedTools from "@/components/RelatedTools";
import { calculateRequiredGpa, calculateWeightedGpa } from "@/lib/calculations";

type Scale = "4.5" | "4.3" | "4.0";
type Subject = { id: number; name: string; credits: number; grade: string; excluded: boolean };

const gradeTables: Record<Scale, Record<string, number>> = {
  "4.5": { "A+": 4.5, A0: 4, "B+": 3.5, B0: 3, "C+": 2.5, C0: 2, "D+": 1.5, D0: 1, F: 0 },
  "4.3": { "A+": 4.3, A0: 4, "A-": 3.7, "B+": 3.3, B0: 3, "B-": 2.7, "C+": 2.3, C0: 2, "C-": 1.7, "D+": 1.3, D0: 1, "D-": 0.7, F: 0 },
  "4.0": { "A/A+": 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, F: 0 },
};

const initialRows: Subject[] = [
  { id: 1, name: "전공 과목", credits: 3, grade: "A+", excluded: false },
  { id: 2, name: "교양 과목", credits: 3, grade: "B+", excluded: false },
  { id: 3, name: "P/F 과목", credits: 2, grade: "A+", excluded: true },
];

function numberValue(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export default function GpaCalculator() {
  const nextId = useRef(4);
  const [scale, setScale] = useState<Scale>("4.5");
  const [subjects, setSubjects] = useState<Subject[]>(initialRows);
  const [priorCredits, setPriorCredits] = useState("60");
  const [priorGpa, setPriorGpa] = useState("3.5");
  const [targetGpa, setTargetGpa] = useState("3.8");
  const [remainingCredits, setRemainingCredits] = useState("30");
  const grades = gradeTables[scale];
  const maxScale = Number(scale);

  const semester = useMemo(() => calculateWeightedGpa(subjects.map((subject) => ({
    credits: subject.credits,
    points: grades[subject.grade] ?? 0,
    excluded: subject.excluded,
  }))), [grades, subjects]);

  const cumulativeCredits = numberValue(priorCredits) + semester.credits;
  const cumulativePoints = numberValue(priorCredits) * Math.min(numberValue(priorGpa), maxScale) + semester.qualityPoints;
  const cumulativeGpa = cumulativeCredits > 0 ? cumulativePoints / cumulativeCredits : 0;
  const required = calculateRequiredGpa(cumulativeGpa, cumulativeCredits, numberValue(targetGpa), numberValue(remainingCredits));

  const changeScale = (nextScale: Scale) => {
    const nextGrades = gradeTables[nextScale];
    const fallback = Object.keys(nextGrades)[0];
    setScale(nextScale);
    setSubjects((rows) => rows.map((row) => ({ ...row, grade: row.grade in nextGrades ? row.grade : fallback })));
  };

  const update = (id: number, change: Partial<Subject>) => setSubjects((rows) => rows.map((row) => row.id === id ? { ...row, ...change } : row));
  const add = () => setSubjects((rows) => [...rows, { id: nextId.current++, name: "", credits: 3, grade: Object.keys(grades)[0], excluded: false }]);
  const remove = (id: number) => setSubjects((rows) => rows.length > 1 ? rows.filter((row) => row.id !== id) : rows);

  return (
    <div className="py-6">
      <header className="mb-8">
        <p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">SEMESTER + CUMULATIVE</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">학점·GPA 계산기</h1>
        <p className="mt-2 text-gray-600">4.5·4.3·4.0 만점의 학기 평점과 누적 평점을 계산하고 목표 GPA에 필요한 남은 성적을 역산합니다.</p>
      </header>

      <section className="calc-card mb-6 p-5 sm:p-6">
        <fieldset><legend className="text-sm font-bold text-gray-700">만점 기준</legend><div className="mt-3 grid grid-cols-3 gap-2">{(["4.5", "4.3", "4.0"] as const).map((value) => <button key={value} type="button" onClick={() => changeScale(value)} aria-pressed={scale === value} className={`min-h-11 rounded-xl border text-sm font-bold ${scale === value ? "border-[#a93d28] bg-[#fff0e9] text-[#8f2f20]" : "border-gray-200 text-gray-600"}`}>{value} 만점</button>)}</div></fieldset>
      </section>

      <section className="calc-card mb-6 p-4 sm:p-6" aria-labelledby="semester-input-title">
        <div className="flex items-center justify-between gap-3"><div><h2 id="semester-input-title" className="text-lg font-bold text-gray-900">이번 학기 과목</h2><p className="mt-1 text-xs text-gray-500">P/F 제외를 켜면 이수학점과 관계없이 GPA 분모·분자에서 빠집니다.</p></div><button type="button" onClick={add} className="shrink-0 rounded-xl bg-[#2c211c] px-4 py-2 text-sm font-bold text-white">+ 과목</button></div>
        <div className="mt-4 space-y-3">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="grid gap-2 sm:grid-cols-[minmax(120px,1fr)_90px_110px_auto_auto] sm:items-center">
                <label className="text-xs font-bold text-gray-500">과목명<input value={subject.name} onChange={(event) => update(subject.id, { name: event.target.value })} placeholder={`과목 ${index + 1}`} className="calc-input mt-1" /></label>
                <label className="text-xs font-bold text-gray-500">학점<select value={subject.credits} onChange={(event) => update(subject.id, { credits: Number(event.target.value) })} className="calc-input mt-1 bg-white">{[1, 2, 3, 4, 5, 6].map((credit) => <option key={credit} value={credit}>{credit}</option>)}</select></label>
                <label className="text-xs font-bold text-gray-500">성적<select value={subject.grade} onChange={(event) => update(subject.id, { grade: event.target.value })} disabled={subject.excluded} className="calc-input mt-1 bg-white disabled:opacity-40">{Object.entries(grades).map(([grade, points]) => <option key={grade} value={grade}>{grade} ({points.toFixed(1)})</option>)}</select></label>
                <label className="flex min-h-11 items-center gap-2 rounded-lg bg-gray-50 px-3 text-sm font-bold text-gray-700 sm:mt-5"><input type="checkbox" checked={subject.excluded} onChange={(event) => update(subject.id, { excluded: event.target.checked })} className="h-4 w-4" />P/F 제외</label>
                <button type="button" onClick={() => remove(subject.id)} aria-label={`${subject.name || `과목 ${index + 1}`} 삭제`} className="min-h-11 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50 sm:mt-5">삭제</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="calc-card mb-6 overflow-hidden" aria-labelledby="gpa-result-title">
        <div className="grid gap-px bg-gray-200 sm:grid-cols-2">
          <div className="bg-[#2c211c] p-6 text-white"><small className="text-[#ffd9c9]">이번 학기 GPA</small><h2 id="gpa-result-title" className="mt-1 text-4xl font-black">{semester.gpa.toFixed(2)} <span className="text-base font-normal text-white/60">/ {scale}</span></h2><p className="mt-2 text-sm text-white/65">반영 {semester.credits}학점 · 총 평점 {semester.qualityPoints.toFixed(2)}</p></div>
          <div className="bg-[#f6efe9] p-6 text-[#2c211c]"><small className="text-[#8f2f20]">이번 학기 포함 누적 GPA</small><strong className="mt-1 block text-4xl font-black">{cumulativeGpa.toFixed(2)} <span className="text-base font-normal text-gray-500">/ {scale}</span></strong><p className="mt-2 text-sm text-gray-600">누적 {cumulativeCredits}학점 기준</p></div>
        </div>
      </section>

      <section className="calc-card mb-6 p-5 sm:p-6" aria-labelledby="cumulative-title">
        <h2 id="cumulative-title" className="text-lg font-bold text-gray-900">이전 학기와 합산</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-gray-700">기존 이수학점<input type="number" min="0" value={priorCredits} onChange={(event) => setPriorCredits(event.target.value)} className="calc-input mt-2" /></label>
          <label className="text-sm font-bold text-gray-700">기존 누적 GPA<input type="number" min="0" max={maxScale} step="0.01" value={priorGpa} onChange={(event) => setPriorGpa(event.target.value)} className="calc-input mt-2" /></label>
        </div>
        <p className="mt-4 rounded-xl bg-gray-50 p-3 font-mono text-xs text-gray-600">누적 GPA = (기존 GPA × 기존 학점 + 이번 학기 평점 합계) ÷ 전체 반영 학점</p>
      </section>

      <section className="calc-card mb-8 p-5 sm:p-6" aria-labelledby="target-title">
        <h2 id="target-title" className="text-lg font-bold text-gray-900">목표 GPA 역산</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-gray-700">목표 누적 GPA<input type="number" min="0" max={maxScale} step="0.01" value={targetGpa} onChange={(event) => setTargetGpa(event.target.value)} className="calc-input mt-2" /></label>
          <label className="text-sm font-bold text-gray-700">앞으로 남은 학점<input type="number" min="1" value={remainingCredits} onChange={(event) => setRemainingCredits(event.target.value)} className="calc-input mt-2" /></label>
        </div>
        <div className="mt-5 rounded-2xl border border-[#e4c8bc] bg-[#fff8f4] p-5">
          {required === null ? <p className="font-bold text-red-700">남은 학점을 입력해 주세요.</p> : required > maxScale ? <><strong className="text-lg text-red-800">현재 조건에서는 달성 불가</strong><p className="mt-1 text-sm text-red-700">남은 과목에서 평균 {required.toFixed(2)}가 필요하지만 {scale} 만점을 넘습니다. 목표나 남은 학점을 조정해 보세요.</p></> : required <= 0 ? <strong className="text-lg text-emerald-800">이미 목표 GPA를 충족했습니다.</strong> : <><small className="text-gray-600">남은 학점에서 필요한 평균</small><strong className="mt-1 block text-3xl font-black text-[#a93d28]">{required.toFixed(2)} / {scale}</strong></>}
        </div>
      </section>

      <section className="space-y-6 text-sm leading-7 text-gray-600">
        <div className="calc-card p-5 sm:p-6"><h2 className="text-lg font-bold text-gray-900">재현 가능한 계산 예시</h2><p className="mt-2">3학점 A+(4.5)와 3학점 B+(3.5)를 수강하고 2학점 P 과목을 제외하면, (3×4.5 + 3×3.5) ÷ (3+3) = <strong>4.00</strong>입니다. P 과목 2학점은 취득학점에는 포함될 수 있지만 GPA에는 반영하지 않습니다.</p></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><strong>학교 규정 확인</strong><p className="mt-2">등급별 점수, A+ 표기, P/F의 취득학점 처리, 재수강 성적 대체, 소수점 반올림은 학교마다 다릅니다. 이 결과는 계획용이며 성적표·학칙의 산식을 우선하세요.</p></div>
      </section>

      <RelatedTools current="gpa" />
    </div>
  );
}
