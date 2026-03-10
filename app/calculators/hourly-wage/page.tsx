"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

const MINIMUM_WAGE_2026 = 10_030; // 2026년 최저시급
const WEEKS_PER_MONTH = 365 / 7 / 12; // ≈ 4.345

type Mode = "hourly-to-monthly" | "monthly-to-hourly";

interface CalcResult {
  hourly: number;
  monthly: number;
  yearly: number;
  monthlyWorkHours: number;
  weeklyPaidRestHours: number;
  monthlyPaidRestHours: number;
  totalMonthlyHours: number;
  minimumWageRatio: number; // percentage vs minimum wage
  belowMinimum: boolean;
}

function calculate(
  mode: Mode,
  amount: number,
  weeklyHours: number,
  includePaidRest: boolean
): CalcResult | null {
  if (!amount || amount <= 0) return null;

  const monthlyWorkHours = weeklyHours * WEEKS_PER_MONTH;
  const weeklyPaidRestHours =
    includePaidRest && weeklyHours >= 15 ? weeklyHours / 5 : 0;
  const monthlyPaidRestHours = weeklyPaidRestHours * WEEKS_PER_MONTH;
  const totalMonthlyHours = monthlyWorkHours + monthlyPaidRestHours;

  let hourly: number;
  let monthly: number;
  let yearly: number;

  if (mode === "hourly-to-monthly") {
    hourly = amount;
    monthly = Math.round(hourly * totalMonthlyHours);
    yearly = monthly * 12;
  } else {
    monthly = amount;
    hourly = totalMonthlyHours > 0 ? Math.round(monthly / totalMonthlyHours) : 0;
    yearly = monthly * 12;
  }

  const minimumWageRatio = hourly > 0 ? (hourly / MINIMUM_WAGE_2026) * 100 : 0;
  const belowMinimum = hourly > 0 && hourly < MINIMUM_WAGE_2026;

  return {
    hourly,
    monthly,
    yearly,
    monthlyWorkHours: Math.round(monthlyWorkHours * 10) / 10,
    weeklyPaidRestHours: Math.round(weeklyPaidRestHours * 10) / 10,
    monthlyPaidRestHours: Math.round(monthlyPaidRestHours * 10) / 10,
    totalMonthlyHours: Math.round(totalMonthlyHours * 10) / 10,
    minimumWageRatio: Math.round(minimumWageRatio * 10) / 10,
    belowMinimum,
  };
}

export default function HourlyWageCalculator() {
  const [mode, setMode] = useState<Mode>("hourly-to-monthly");
  const [inputValue, setInputValue] = useState(
    MINIMUM_WAGE_2026.toLocaleString("ko-KR")
  );
  const [weeklyHours, setWeeklyHours] = useState(40);
  const [includePaidRest, setIncludePaidRest] = useState(true);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const result = useMemo<CalcResult | null>(() => {
    const amount = parseInt(inputValue.replace(/,/g, ""), 10);
    return calculate(mode, amount, weeklyHours, includePaidRest);
  }, [inputValue, mode, weeklyHours, includePaidRest]);

  const handleCopy = async () => {
    if (!result) return;
    const text =
      mode === "hourly-to-monthly"
        ? `시급 ${formatNumber(result.hourly)}원 → 월급 ${formatNumber(result.monthly)}원 / 연봉 ${formatNumber(result.yearly)}원`
        : `월급 ${formatNumber(result.monthly)}원 → 시급 ${formatNumber(result.hourly)}원 / 연봉 ${formatNumber(result.yearly)}원`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setInputValue(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setInputValue("");
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === "hourly-to-monthly") {
      setInputValue(MINIMUM_WAGE_2026.toLocaleString("ko-KR"));
    } else {
      // Set a reasonable default monthly wage
      const defaultResult = calculate(
        "hourly-to-monthly",
        MINIMUM_WAGE_2026,
        weeklyHours,
        includePaidRest
      );
      if (defaultResult) {
        setInputValue(defaultResult.monthly.toLocaleString("ko-KR"));
      }
    }
  };

  const handleReset = () => {
    setMode("hourly-to-monthly");
    setInputValue(MINIMUM_WAGE_2026.toLocaleString("ko-KR"));
    setWeeklyHours(40);
    setIncludePaidRest(true);
  };

  const weeklyHoursOptions = [15, 20, 25, 30, 35, 40];

  const quickHourly = [9860, 10030, 11000, 12000, 15000, 20000];
  const quickMonthly = [200, 250, 300, 350, 400, 500];

  const faqs = [
    {
      q: "주휴수당이란 무엇인가요?",
      a: "주휴수당은 1주 동안 소정근로일을 개근한 근로자에게 유급 주휴일에 대해 지급하는 수당입니다. 주 15시간 이상 근무하는 근로자가 대상이며, 주휴시간은 1일 소정근로시간(주 근무시간/5)입니다.",
    },
    {
      q: "2026년 최저시급은 얼마인가요?",
      a: "2026년 최저시급은 10,030원입니다. 주 40시간 근무, 주휴수당 포함 기준 월 환산액은 약 2,096,270원입니다.",
    },
    {
      q: "월 근로시간은 어떻게 계산하나요?",
      a: "월 근로시간은 주 근무시간 × (365일 ÷ 7일 ÷ 12개월) ≈ 주 근무시간 × 4.345로 계산합니다. 주 40시간 근무 시 월 약 173.8시간이 됩니다.",
    },
    {
      q: "주 15시간 미만 근무자도 주휴수당을 받나요?",
      a: "아닙니다. 주 15시간 미만 근무하는 단시간 근로자는 주휴수당 지급 대상에서 제외됩니다. 이 계산기에서 주휴수당 포함을 체크해도 주 15시간 미만이면 자동으로 0원으로 계산됩니다.",
    },
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          시급 월급 변환기
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          2026년 최저시급 {formatNumber(MINIMUM_WAGE_2026)}원 기준, 시급과
          월급·연봉을 간편하게 환산합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        {/* 모드 토글 */}
        <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
          <button
            onClick={() => handleModeChange("hourly-to-monthly")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === "hourly-to-monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            시급 → 월급
          </button>
          <button
            onClick={() => handleModeChange("monthly-to-hourly")}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
              mode === "monthly-to-hourly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            월급 → 시급
          </button>
        </div>

        {/* 금액 입력 */}
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {mode === "hourly-to-monthly" ? "시급" : "월급"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={
              mode === "hourly-to-monthly" ? "예: 10,030" : "예: 2,096,270"
            }
            className="calc-input calc-input-lg pr-10"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
            원
          </span>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-medium self-center mr-1">
            빠른 선택
          </span>
          {mode === "hourly-to-monthly"
            ? quickHourly.map((amount) => (
                <button
                  key={amount}
                  onClick={() =>
                    setInputValue(amount.toLocaleString("ko-KR"))
                  }
                  className="calc-preset"
                >
                  {formatNumber(amount)}원
                </button>
              ))
            : quickMonthly.map((amount) => (
                <button
                  key={amount}
                  onClick={() =>
                    setInputValue(
                      (amount * 10000).toLocaleString("ko-KR")
                    )
                  }
                  className="calc-preset"
                >
                  {formatNumber(amount)}만원
                </button>
              ))}
        </div>

        {/* 주 근무시간 */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            주 근무시간
          </label>
          <div className="flex flex-wrap gap-2">
            {weeklyHoursOptions.map((hours) => (
              <button
                key={hours}
                onClick={() => setWeeklyHours(hours)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  weeklyHours === hours
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {hours}시간
              </button>
            ))}
          </div>
        </div>

        {/* 주휴수당 포함 여부 */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">
              주휴수당 포함
            </span>
            <p className="text-xs text-gray-400 mt-0.5">
              주 15시간 이상 근무 시 적용
            </p>
          </div>
          <button
            onClick={() => setIncludePaidRest(!includePaidRest)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              includePaidRest ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                includePaidRest ? "translate-x-5" : ""
              }`}
            />
          </button>
        </div>

        {/* 초기화 버튼 */}
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleReset}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          {/* 메인 결과 하이라이트 */}
          <div className="calc-result-header">
            <p className="text-blue-200 text-sm mb-1 relative z-10">
              {mode === "hourly-to-monthly" ? "월급 (주휴수당 포함)" : "시급"}
            </p>
            <div className="flex items-center justify-center gap-3 relative z-10">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {formatNumber(
                  mode === "hourly-to-monthly" ? result.monthly : result.hourly
                )}
                <span className="text-xl font-bold ml-1">원</span>
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all active:scale-95"
                title="결과 복사"
                aria-label="결과 복사"
              >
                {copied ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-blue-200/80 text-sm mt-2 relative z-10">
              주 {weeklyHours}시간 근무 /{" "}
              {includePaidRest && weeklyHours >= 15
                ? "주휴수당 포함"
                : "주휴수당 미포함"}
            </p>
          </div>

          {/* 최저시급 대비 */}
          <div className="px-6 pt-5 pb-4">
            {result.belowMinimum ? (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm font-medium">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                최저시급 미달! (2026년 최저시급: {formatNumber(MINIMUM_WAGE_2026)}
                원)
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-green-50 text-green-600 rounded-xl px-4 py-3 text-sm font-medium">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                최저시급 대비 {result.minimumWageRatio}% (
                {formatNumber(MINIMUM_WAGE_2026)}원 기준)
              </div>
            )}
          </div>

          {/* 환산 결과 */}
          <div className="p-6 pt-2">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              환산 결과
            </h3>
            <div className="space-y-1">
              <Row label="시급" value={result.hourly} bold accent={mode === "monthly-to-hourly"} />
              <Row label="월급" value={result.monthly} bold accent={mode === "hourly-to-monthly"} />
              <Row label="연봉" value={result.yearly} bold />
            </div>
          </div>

          {/* 근로시간 내역 */}
          <div className="p-6 pt-2 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full" />
              월 예상 근로시간
            </h3>
            <div className="space-y-1">
              <Row label="주 근무시간" value={weeklyHours} suffix="시간/주" plain />
              <Row
                label="월 소정근로시간"
                value={result.monthlyWorkHours}
                suffix="시간"
                plain
              />
              {includePaidRest && weeklyHours >= 15 && (
                <>
                  <Row
                    label="주휴시간 (주)"
                    value={result.weeklyPaidRestHours}
                    suffix="시간/주"
                    plain
                  />
                  <Row
                    label="주휴시간 (월)"
                    value={result.monthlyPaidRestHours}
                    suffix="시간"
                    plain
                  />
                </>
              )}
              <div className="border-t-2 border-gray-200 mt-3 pt-3">
                <Row
                  label="월 총 유급시간"
                  value={result.totalMonthlyHours}
                  suffix="시간"
                  plain
                  bold
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">시급 월급 변환이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            시급 월급 변환은 시간당 급여(시급)를 월 급여(월급)로, 또는 월급을
            시급으로 환산하는 것입니다. 정확한 환산을 위해서는 주 근무시간과
            주휴수당 포함 여부를 고려해야 합니다. 2026년 한국의 최저시급은{" "}
            {formatNumber(MINIMUM_WAGE_2026)}원으로, 주 40시간 근무 기준 월
            환산액은 약 {formatNumber(Math.round(MINIMUM_WAGE_2026 * 209))}원입니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">주휴수당 계산 방법</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            주휴수당은 1주 동안 소정근로일을 개근한 근로자에게 지급되는
            유급휴일 수당입니다. 주 15시간 이상 근무해야 발생하며, 주휴시간은
            1일 소정근로시간과 같습니다.
          </p>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>주 근무시간</th>
                  <th className="text-right">주휴시간 (1일)</th>
                  <th className="text-right">월 환산 (주휴 포함)</th>
                  <th className="text-right">최저시급 기준 월급</th>
                </tr>
              </thead>
              <tbody>
                {[15, 20, 25, 30, 35, 40].map((h) => {
                  const restH = h / 5;
                  const totalMonthly = (h + restH) * WEEKS_PER_MONTH;
                  const monthlyWage = Math.round(
                    MINIMUM_WAGE_2026 * totalMonthly
                  );
                  return (
                    <tr key={h}>
                      <td className="font-medium">{h}시간</td>
                      <td className="text-right">{restH}시간</td>
                      <td className="text-right">
                        {(Math.round(totalMonthly * 10) / 10).toFixed(1)}시간
                      </td>
                      <td className="text-right font-bold text-blue-600">
                        {formatNumber(monthlyWage)}원
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">최저시급 변화 추이</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>연도</th>
                  <th className="text-right">최저시급</th>
                  <th className="text-right">인상률</th>
                  <th className="text-right">월 환산액 (209시간)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { year: 2022, wage: 9160, rate: "5.1%" },
                  { year: 2023, wage: 9620, rate: "5.0%" },
                  { year: 2024, wage: 9860, rate: "2.5%" },
                  { year: 2025, wage: 10030, rate: "1.7%" },
                  { year: 2026, wage: 10030, rate: "0.0%" },
                ].map((row) => (
                  <tr key={row.year}>
                    <td className="font-medium">{row.year}년</td>
                    <td className="text-right">
                      {formatNumber(row.wage)}원
                    </td>
                    <td className="text-right">{row.rate}</td>
                    <td className="text-right font-bold text-blue-600">
                      {formatNumber(Math.round(row.wage * 209))}원
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">자주 묻는 질문 (FAQ)</h2>
          <div className="calc-faq mt-3">
            {faqs.map((faq, i) => (
              <div key={i} className="calc-faq-item">
                <button
                  className="calc-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="calc-faq-a">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <RelatedTools current="hourly-wage" />

      {/* Mobile sticky result bar */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <p className="text-[10px] text-[var(--muted)]">
                {mode === "hourly-to-monthly" ? "월급" : "시급"}
              </p>
              <p className="text-lg font-extrabold text-blue-600">
                {formatNumber(
                  mode === "hourly-to-monthly" ? result.monthly : result.hourly
                )}
                원
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
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  accent,
  suffix,
  plain,
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: boolean;
  suffix?: string;
  plain?: boolean;
}) {
  const formatted = plain
    ? `${value.toLocaleString("ko-KR")}${suffix || ""}`
    : `${value.toLocaleString("ko-KR")}원`;

  return (
    <div className="flex justify-between items-center py-1.5">
      <span
        className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"} ${
          accent ? "text-blue-600 text-base" : "text-gray-900"
        }`}
      >
        {formatted}
      </span>
    </div>
  );
}
