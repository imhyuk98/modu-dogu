"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateLoan } from "@/lib/calculations";

function formatWon(v: number) {
  return Math.round(v).toLocaleString();
}

function formatAmountLabel(manWon: number) {
  if (manWon >= 10000) return `${manWon / 10000}억`;
  return `${(manWon / 1000).toFixed(manWon % 1000 === 0 ? 0 : 1)}천만`;
}

const AMOUNTS = [5000, 10000, 15000, 20000, 30000, 40000, 50000];
const RATES = [3, 3.5, 4, 4.5, 5, 5.5, 6];
export default function LoanParamsPage() {
  const { params } = useParams<{ params: string }>();
  const [amountStr, rateStr, yearsStr] = params.split("-");
  const amount = parseInt(amountStr);
  const rate = parseFloat(rateStr);
  const years = parseInt(yearsStr);
  const amountLabel = formatAmountLabel(amount);

  const resultEPI = calculateLoan(
    amount * 10000,
    rate,
    years,
    "equalPrincipalInterest"
  );
  const resultEP = calculateLoan(
    amount * 10000,
    rate,
    years,
    "equalPrincipal"
  );
  const monthlyEPI = resultEPI.monthlyPayments[0]?.payment ?? 0;
  const monthlyEPFirst = resultEP.monthlyPayments[0]?.payment ?? 0;
  const monthlyEPLast =
    resultEP.monthlyPayments[resultEP.monthlyPayments.length - 1]?.payment ?? 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-500">홈</Link>
        {" > "}
        <Link href="/calculators/loan" className="hover:text-blue-500">대출 계산기</Link>
        {" > "}
        <span className="text-gray-700">
          {amountLabel}원 {rate}% {years}년
        </span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        {amountLabel}원 대출 연 {rate}% {years}년 상환
      </h1>
      <p className="text-gray-500 mb-8">
        2026년 기준 대출 이자 및 월 상환액 계산 결과입니다.
      </p>

      {/* 핵심 결과 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">원리금균등 월 상환액</p>
          <p className="text-3xl font-extrabold text-blue-600">
            {formatWon(monthlyEPI)}
            <span className="text-sm font-normal text-gray-500">원</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">매월 동일 금액</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 mb-1">원금균등 월 상환액</p>
          <p className="text-3xl font-extrabold text-green-600">
            {formatWon(monthlyEPFirst)}
            <span className="text-sm font-normal text-gray-500">원</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            첫 달 기준 (마지막 달 {formatWon(monthlyEPLast)}원)
          </p>
        </div>
      </div>

      {/* 요약 테이블 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">항목</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">원리금균등</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">원금균등</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">대출 원금</td>
              <td className="px-4 py-3 text-right" colSpan={2}>
                {formatWon(amount * 10000)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">총 이자</td>
              <td className="px-4 py-3 text-right text-red-600">
                {formatWon(resultEPI.totalInterest)}원
              </td>
              <td className="px-4 py-3 text-right text-red-600">
                {formatWon(resultEP.totalInterest)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">총 상환액</td>
              <td className="px-4 py-3 text-right font-medium">
                {formatWon(resultEPI.totalPayment)}원
              </td>
              <td className="px-4 py-3 text-right font-medium">
                {formatWon(resultEP.totalPayment)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">이자 차이</td>
              <td className="px-4 py-3 text-right text-blue-600 font-medium" colSpan={2}>
                원금균등이 {formatWon(resultEPI.totalInterest - resultEP.totalInterest)}원 절약
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 초기 상환 스케줄 (12개월) */}
      <details className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <summary className="px-4 py-3 cursor-pointer hover:bg-gray-50 font-medium text-gray-700">
          월별 상환 스케줄 (처음 12개월)
        </summary>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">회차</th>
                <th className="px-3 py-2 text-right">원금</th>
                <th className="px-3 py-2 text-right">이자</th>
                <th className="px-3 py-2 text-right">월 상환액</th>
                <th className="px-3 py-2 text-right">잔액</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resultEPI.monthlyPayments.slice(0, 12).map((m) => (
                <tr key={m.month}>
                  <td className="px-3 py-2">{m.month}회</td>
                  <td className="px-3 py-2 text-right">{formatWon(m.principal)}원</td>
                  <td className="px-3 py-2 text-right text-red-500">{formatWon(m.interest)}원</td>
                  <td className="px-3 py-2 text-right font-medium">{formatWon(m.payment)}원</td>
                  <td className="px-3 py-2 text-right text-gray-500">{formatWon(m.remainingBalance)}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      {/* 직접 계산 버튼 */}
      <div className="text-center mb-10">
        <Link
          href="/calculators/loan"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          내 조건으로 직접 계산해보기
        </Link>
      </div>

      {/* 같은 금액 다른 금리 */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          {amountLabel}원 대출 금리별 비교
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RATES.filter((r) => r !== rate).map((r) => {
            const res = calculateLoan(amount * 10000, r, years, "equalPrincipalInterest");
            const mp = res.monthlyPayments[0]?.payment ?? 0;
            return (
              <Link
                key={r}
                href={`/calculators/loan/${amount}-${r}-${years}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">연 {r}%</p>
                <p className="text-xs text-gray-500">월 {formatWon(mp)}원</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 같은 금리 다른 금액 */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          연 {rate}% 대출 금액별 비교
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {AMOUNTS.filter((a) => a !== amount).map((a) => {
            const res = calculateLoan(a * 10000, rate, years, "equalPrincipalInterest");
            const mp = res.monthlyPayments[0]?.payment ?? 0;
            return (
              <Link
                key={a}
                href={`/calculators/loan/${a}-${rate}-${years}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  {formatAmountLabel(a)}원
                </p>
                <p className="text-xs text-gray-500">월 {formatWon(mp)}원</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
