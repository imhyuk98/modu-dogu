"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Branch = "army" | "navy" | "airforce" | "marines" | "police" | "social";

interface BranchInfo {
  label: string;
  months: number;
}

const branches: Record<Branch, BranchInfo> = {
  army: { label: "육군", months: 18 },
  navy: { label: "해군", months: 20 },
  airforce: { label: "공군", months: 21 },
  marines: { label: "해병대", months: 18 },
  police: { label: "의무경찰", months: 18 },
  social: { label: "사회복무요원", months: 21 },
};

function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function calcDischargeDate(enlistDate: Date, months: number): Date {
  const discharge = addMonths(enlistDate, months);
  discharge.setDate(discharge.getDate() - 1);
  return discharge;
}

function diffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const w = weekdays[d.getDay()];
  return `${y}년 ${m}월 ${day}일 (${w})`;
}

export default function MilitaryCalculator() {
  const [enlistDate, setEnlistDate] = useState(getTodayStr);
  const [branch, setBranch] = useState<Branch>("army");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!enlistDate) return null;

    const enlist = new Date(enlistDate);
    enlist.setHours(0, 0, 0, 0);
    const info = branches[branch];
    const discharge = calcDischargeDate(enlist, info.months);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = diffDays(enlist, discharge);
    const servedDays = diffDays(enlist, today);
    const remainingDays = diffDays(today, discharge);

    const progress = Math.min(Math.max((servedDays / totalDays) * 100, 0), 100);

    return {
      enlist,
      discharge,
      totalDays,
      servedDays: Math.max(servedDays, 0),
      remainingDays,
      progress,
      branchLabel: info.label,
      months: info.months,
    };
  }, [enlistDate, branch]);

  const handleReset = () => {
    setEnlistDate(getTodayStr());
    setBranch("army");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `[군대 전역일 계산 결과]\n군종: ${result.branchLabel} (${result.months}개월)\n입대일: ${formatDate(result.enlist)}\n전역일: ${formatDate(result.discharge)}\n총 복무일수: ${result.totalDays}일\n복무 진행률: ${result.progress.toFixed(1)}%`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const fmt = (n: number) => n.toLocaleString("ko-KR");

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        군대 전역일 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        입대일과 군종을 선택하면 전역일, 남은 복무일수, 복무 진행률을 자동으로 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            입대일
          </label>
          <input
            type="date"
            value={enlistDate}
            onChange={(e) => setEnlistDate(e.target.value)}
            className="calc-input calc-input-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            군종 선택
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {(Object.entries(branches) as [Branch, BranchInfo][]).map(
              ([key, info]) => (
                <button
                  key={key}
                  onClick={() => setBranch(key)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                    branch === key
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {info.label} ({info.months}개월)
                </button>
              )
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={handleReset} className="calc-btn-secondary">
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <>
          {/* 전역일 대형 표시 */}
          <div className="calc-card overflow-hidden mb-6">
            <div className="bg-blue-600 text-white p-6 text-center">
              <p className="text-blue-100 text-sm mb-1">전역일</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl sm:text-4xl font-bold">
                  {formatDate(result.discharge)}
                </p>
              </div>
            </div>

            {/* D-day */}
            <div className="p-5 text-center border-b border-gray-100">
              <p className="text-sm text-gray-500 mb-1">
                {result.remainingDays > 0
                  ? "전역까지 남은 날"
                  : result.remainingDays === 0
                  ? "오늘 전역!"
                  : "전역 후 경과일"}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {result.remainingDays > 0
                  ? `D-${fmt(result.remainingDays)}`
                  : result.remainingDays === 0
                  ? "D-Day"
                  : `D+${fmt(Math.abs(result.remainingDays))}`}
              </p>
            </div>

            {/* 복무 진행률 */}
            <div className="p-5">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>복무 진행률</span>
                <span className="font-semibold text-blue-600">
                  {result.progress.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(result.progress, 100)}%` }}
                />
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="p-5 grid grid-cols-3 gap-4 text-center border-t border-gray-100">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(result.totalDays)}
                </p>
                <p className="text-sm text-gray-500">총 복무일수</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(result.servedDays)}
                </p>
                <p className="text-sm text-gray-500">복무한 날</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {fmt(Math.max(result.remainingDays, 0))}
                </p>
                <p className="text-sm text-gray-500">남은 날</p>
              </div>
            </div>

            {/* 복사 버튼 */}
            <div className="p-5 border-t border-gray-100">
              <button
                onClick={handleCopy}
                className="calc-btn-primary w-full"
              >
                {copied ? "복사됨!" : "결과 복사하기"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 모바일 하단 고정 바 */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">전역까지</p>
              <p className="text-lg font-extrabold text-blue-600">
                {result.remainingDays > 0
                  ? `D-${fmt(result.remainingDays)}`
                  : result.remainingDays === 0
                  ? "D-Day"
                  : `D+${fmt(Math.abs(result.remainingDays))}`}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="calc-btn-primary text-xs px-3 py-2"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 prose prose-gray max-w-none">
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              군종별 복무기간 안내
            </h2>
            <p className="text-gray-600 leading-relaxed">
              대한민국 병역법에 따른 군종별 의무 복무기간은 다음과 같습니다. 복무기간은 법률 개정에 따라 변경될 수 있으므로, 최신 정보는 병무청 공식 사이트를 참고해 주세요.
            </p>
            <ul className="text-gray-600 space-y-2 mt-3">
              <li><strong>육군:</strong> 18개월 - 가장 많은 인원이 복무하는 군종입니다.</li>
              <li><strong>해군:</strong> 20개월 - 해상 작전 및 함정 근무를 수행합니다.</li>
              <li><strong>공군:</strong> 21개월 - 항공 작전 및 기지 운영을 담당합니다.</li>
              <li><strong>해병대:</strong> 18개월 - 상륙 작전 등 특수 임무를 수행합니다.</li>
              <li><strong>의무경찰:</strong> 18개월 - 치안 유지 업무를 보조합니다.</li>
              <li><strong>사회복무요원:</strong> 21개월 - 공공기관에서 사회 서비스를 수행합니다.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              전역일 계산 방법
            </h2>
            <p className="text-gray-600 leading-relaxed">
              전역일은 입대일로부터 해당 군종의 복무기간(월)을 더한 뒤, 1일을 빼서 계산합니다. 예를 들어, 2025년 1월 15일에 육군에 입대했다면, 18개월 후인 2026년 7월 15일에서 1일을 뺀 2026년 7월 14일이 전역일이 됩니다.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              자주 묻는 질문 (FAQ)
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-800">
                  전역일이 주말이나 공휴일이면 어떻게 되나요?
                </h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  전역일이 토요일, 일요일, 공휴일인 경우 해당 일의 전 근무일에 전역하는 것이 일반적입니다. 다만 부대 사정에 따라 다를 수 있으므로, 정확한 전역일은 소속 부대에 확인하시기 바랍니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">
                  복무기간이 단축되는 경우가 있나요?
                </h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  모범 복무자에게 주어지는 조기 전역(감형) 제도가 있었으나, 현재는 폐지되었습니다. 다만 법률 개정으로 복무기간 자체가 변경될 수 있습니다.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800">
                  입대일 당일도 복무일수에 포함되나요?
                </h3>
                <p className="text-gray-600 leading-relaxed mt-1">
                  네, 입대일 당일부터 복무일수에 포함됩니다. 전역일도 복무일에 포함되며, 전역일 당일에 부대를 떠나게 됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="military" />
    </div>
  );
}
