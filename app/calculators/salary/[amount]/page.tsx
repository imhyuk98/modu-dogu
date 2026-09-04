"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateSalary } from "@/lib/calculations";

function formatWon(v: number) {
  return Math.round(v).toLocaleString();
}

function formatMan(v: number) {
  if (v >= 10000) return `${v / 10000}억`;
  return `${v.toLocaleString()}만`;
}

export default function SalaryAmountPage() {
  const { amount } = useParams<{ amount: string }>();
  const amountNum = parseInt(amount);
  const result = calculateSalary(amountNum * 10000);
  const amountLabel = formatMan(amountNum);

  const nearAmounts = [
    amountNum - 500,
    amountNum - 300,
    amountNum - 200,
    amountNum - 100,
    amountNum + 100,
    amountNum + 200,
    amountNum + 300,
    amountNum + 500,
  ].filter((a) => a >= 2000 && a <= 10000);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-500">
          홈
        </Link>
        {" > "}
        <Link href="/calculators/salary" className="hover:text-blue-500">
          연봉 계산기
        </Link>
        {" > "}
        <span className="text-gray-700">연봉 {amountLabel}원</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        연봉 {amountLabel}원 실수령액
      </h1>
      <p className="text-gray-500 mb-8">
        2026년 7월 이후 4대보험·예상 소득세 기준 계산 결과입니다.
      </p>

      {/* 핵심 결과 카드 */}
      <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-center">
        <p className="text-gray-600 text-sm mb-1">월 실수령액</p>
        <p className="text-4xl font-extrabold text-blue-600">
          {formatWon(result.monthlyNet)}
          <span className="text-lg font-normal text-gray-500">원</span>
        </p>
        <p className="text-gray-400 text-xs mt-2">
          월 급여 {formatWon(result.monthlyGross)}원 - 공제
          {formatWon(result.totalDeductions)}원
        </p>
      </div>

      {/* 공제 내역 테이블 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                항목
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                월 공제액
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">국민연금</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.nationalPension)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">건강보험</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.healthInsurance)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">장기요양보험</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.longTermCare)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">고용보험</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.employmentInsurance)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">소득세</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.incomeTax)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">지방소득세</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.localIncomeTax)}원
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="px-4 py-3 text-gray-900">총 공제액</td>
              <td className="px-4 py-3 text-right text-red-600">
                {formatWon(result.totalDeductions)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 직접 계산 버튼 */}
      <div className="text-center mb-10">
        <Link
          href="/calculators/salary"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          내 연봉으로 직접 계산해보기
        </Link>
      </div>

      {/* 인접 금액 링크 */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          다른 연봉 실수령액
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {nearAmounts.map((a) => {
            const r = calculateSalary(a * 10000);
            return (
              <Link
                key={a}
                href={`/calculators/salary/${a}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  {formatMan(a)}원
                </p>
                <p className="text-xs text-gray-500">
                  월 {formatWon(r.monthlyNet)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 주요 연봉 구간 */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          주요 연봉 실수령액 한눈에 보기
        </h2>
        <div className="space-y-1">
          {[2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000].map(
            (a) => {
              const r = calculateSalary(a * 10000);
              return (
                <Link
                  key={a}
                  href={`/calculators/salary/${a}`}
                  className="flex justify-between items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    연봉 {formatMan(a)}원
                  </span>
                  <span className="text-sm font-medium text-blue-600">
                    월 {formatWon(r.monthlyNet)}원
                  </span>
                </Link>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}
