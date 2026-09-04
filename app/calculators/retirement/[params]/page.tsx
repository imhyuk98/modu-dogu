"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateRetirement } from "@/lib/calculations";

const AVAILABLE_YEARS = [1, 2, 3, 5, 7, 10, 15, 20];

function formatWon(v: number) {
  return Math.round(v).toLocaleString("ko-KR");
}

export default function RetirementParamsPage() {
  const { params } = useParams<{ params: string }>();
  const [yearsStr, monthlyPayStr] = params.split("-");
  const years = parseInt(yearsStr);
  const monthlyPay = parseInt(monthlyPayStr);

  const startDate = new Date(2026 - years, 0, 1);
  const endDate = new Date(2026, 0, 1);
  const recentThreeMonthPay = monthlyPay * 10000 * 3;
  const recentThreeMonthDays = 90;

  const result = calculateRetirement(
    startDate,
    endDate,
    recentThreeMonthPay,
    recentThreeMonthDays
  );

  // Only link to combinations included in the static export.
  const nearYears = AVAILABLE_YEARS
    .filter((candidate) => candidate !== years)
    .sort((a, b) => Math.abs(a - years) - Math.abs(b - years))
    .slice(0, 6);

  // Related salaries: +-50만
  const nearSalaries = [
    monthlyPay - 100,
    monthlyPay - 50,
    monthlyPay + 50,
    monthlyPay + 100,
  ].filter((s) => s >= 200 && s <= 500);

  // Major combinations
  const majorCombinations = [
    { y: 1, m: 250 },
    { y: 2, m: 300 },
    { y: 3, m: 300 },
    { y: 5, m: 300 },
    { y: 5, m: 400 },
    { y: 7, m: 350 },
    { y: 10, m: 300 },
    { y: 10, m: 400 },
    { y: 15, m: 350 },
    { y: 15, m: 500 },
    { y: 20, m: 400 },
    { y: 20, m: 500 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-500">
          홈
        </Link>
        {" > "}
        <Link href="/calculators/retirement" className="hover:text-blue-500">
          퇴직금 계산기
        </Link>
        {" > "}
        <span className="text-gray-700">
          월급 {monthlyPay}만원 {years}년 근무
        </span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        월급 {monthlyPay}만원 {years}년 근무 퇴직금
      </h1>
      <p className="text-gray-500 mb-8">
        2026년 기준 퇴직금 자동 계산 결과입니다.
      </p>

      {/* Hero result card */}
      <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-center">
        <p className="text-gray-600 text-sm mb-1">예상 퇴직금</p>
        <p className="text-4xl font-extrabold text-blue-600">
          {formatWon(result.retirementPay)}
          <span className="text-lg font-normal text-gray-500">원</span>
        </p>
        <p className="text-gray-400 text-xs mt-2">
          월급 {monthlyPay}만원 기준 · {years}년 근무 (
          {result.totalDays.toLocaleString("ko-KR")}일)
        </p>
      </div>

      {/* Detail table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                항목
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                내용
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">근무기간</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {result.years}년 {result.months}개월 {result.days}일 (총{" "}
                {result.totalDays.toLocaleString("ko-KR")}일)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">월평균급여</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(monthlyPay * 10000)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">일평균임금</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.averageDailyWage)}원
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="px-4 py-3 text-gray-900">퇴직금</td>
              <td className="px-4 py-3 text-right text-blue-600">
                {formatWon(result.retirementPay)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 직접 계산 버튼 */}
      <div className="text-center mb-10">
        <Link
          href="/calculators/retirement"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          직접 계산해보기
        </Link>
      </div>

      {/* Related links - nearby years */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          다른 근무기간 퇴직금 (월급 {monthlyPay}만원)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {nearYears.map((y) => {
            const r = calculateRetirement(
              new Date(2026 - y, 0, 1),
              new Date(2026, 0, 1),
              monthlyPay * 10000 * 3,
              90
            );
            return (
              <Link
                key={y}
                href={`/calculators/retirement/${y}-${monthlyPay}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">{y}년 근무</p>
                <p className="text-xs text-gray-500">
                  {formatWon(r.retirementPay)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Related links - nearby salaries */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          다른 월급 퇴직금 ({years}년 근무)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {nearSalaries.map((s) => {
            const r = calculateRetirement(
              new Date(2026 - years, 0, 1),
              new Date(2026, 0, 1),
              s * 10000 * 3,
              90
            );
            return (
              <Link
                key={s}
                href={`/calculators/retirement/${years}-${s}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  월급 {s}만원
                </p>
                <p className="text-xs text-gray-500">
                  {formatWon(r.retirementPay)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Major combinations */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          주요 퇴직금 한눈에 보기
        </h2>
        <div className="space-y-1">
          {majorCombinations.map(({ y, m }) => {
            const r = calculateRetirement(
              new Date(2026 - y, 0, 1),
              new Date(2026, 0, 1),
              m * 10000 * 3,
              90
            );
            return (
              <Link
                key={`${y}-${m}`}
                href={`/calculators/retirement/${y}-${m}`}
                className="flex justify-between items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm text-gray-700">
                  월급 {m}만원 · {y}년 근무
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {formatWon(r.retirementPay)}원
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
