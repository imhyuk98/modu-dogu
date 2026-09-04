"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { convertJeonseToMonthly } from "@/lib/calculations";

function formatWon(v: number) {
  return Math.round(v).toLocaleString();
}

function formatAmountLabel(manWon: number) {
  if (manWon >= 10000) return `${manWon / 10000}억`;
  if (manWon >= 1000)
    return `${(manWon / 1000).toFixed(manWon % 1000 === 0 ? 0 : 1)}천만`;
  return `${manWon}만`;
}

const JEONSE = [10000, 15000, 20000, 25000, 30000, 40000, 50000];
const RATES = [4, 4.5, 5, 5.5, 6];

export default function RentConversionParamsPage() {
  const { params } = useParams<{ params: string }>();
  const [jeonseStr, depositStr, rateStr] = params.split("-");
  const jeonse = parseInt(jeonseStr);
  const deposit = parseInt(depositStr);
  const rate = parseFloat(rateStr);

  const result = convertJeonseToMonthly(jeonse * 10000, deposit * 10000, rate);
  const jeonseLabel = formatAmountLabel(jeonse);
  const depositLabel = formatAmountLabel(deposit);
  const diff = jeonse - deposit;
  const annualRent = result.monthlyRent * 12;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-500">
          홈
        </Link>
        {" > "}
        <Link
          href="/calculators/rent-conversion"
          className="hover:text-blue-500"
        >
          전월세 전환 계산기
        </Link>
        {" > "}
        <span className="text-gray-700">
          전세 {jeonseLabel}원 → 보증금 {depositLabel}원
        </span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        전세 {jeonseLabel}원 → 월세 전환
      </h1>
      <p className="text-gray-500 mb-8">
        보증금 {depositLabel}원, 전환율 {rate}% 기준 계산 결과입니다.
      </p>

      {/* 핵심 결과 */}
      <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-center">
        <p className="text-gray-600 text-sm mb-1">예상 월세</p>
        <p className="text-4xl font-extrabold text-blue-600">
          {formatWon(result.monthlyRent)}
          <span className="text-lg font-normal text-gray-500">원</span>
        </p>
        <p className="text-gray-400 text-xs mt-2">
          연 환산 {formatWon(annualRent)}원
        </p>
      </div>

      {/* 상세 내역 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-600">전세 보증금</td>
              <td className="px-4 py-3 text-right font-medium">
                {formatWon(jeonse * 10000)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-600">전환 후 보증금</td>
              <td className="px-4 py-3 text-right font-medium">
                {formatWon(deposit * 10000)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-600">보증금 차액</td>
              <td className="px-4 py-3 text-right font-medium text-orange-600">
                {formatWon(diff * 10000)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-600">전월세 전환율</td>
              <td className="px-4 py-3 text-right font-medium">{rate}%</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="px-4 py-3 text-gray-900 font-bold">월세</td>
              <td className="px-4 py-3 text-right font-bold text-blue-600">
                {formatWon(result.monthlyRent)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 계산 공식 설명 */}
      <div className="bg-gray-50 rounded-xl p-5 mb-8 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-2">계산 공식</p>
        <p>
          월세 = (전세금 - 보증금) × 전환율 ÷ 12
        </p>
        <p className="mt-1">
          = ({formatWon(jeonse * 10000)} - {formatWon(deposit * 10000)}) × {rate}
          % ÷ 12
        </p>
        <p className="mt-1">
          = {formatWon(diff * 10000)} × {rate}% ÷ 12 ={" "}
          <strong>{formatWon(result.monthlyRent)}원</strong>
        </p>
      </div>

      {/* 직접 계산 버튼 */}
      <div className="text-center mb-10">
        <Link
          href="/calculators/rent-conversion"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          내 조건으로 직접 계산해보기
        </Link>
      </div>

      {/* 같은 전세금 다른 전환율 */}
      <div className="border-t border-gray-200 pt-8 mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          전세 {jeonseLabel}원 전환율별 비교
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {RATES.filter((r) => r !== rate).map((r) => {
            const res = convertJeonseToMonthly(
              jeonse * 10000,
              deposit * 10000,
              r
            );
            return (
              <Link
                key={r}
                href={`/calculators/rent-conversion/${jeonse}-${deposit}-${r}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">전환율 {r}%</p>
                <p className="text-xs text-gray-500">
                  월세 {formatWon(res.monthlyRent)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 같은 전환율 다른 전세금 */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          전환율 {rate}% 전세금별 비교
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {JEONSE.filter((j) => j !== jeonse && j > deposit).map((j) => {
            const res = convertJeonseToMonthly(
              j * 10000,
              deposit * 10000,
              rate
            );
            return (
              <Link
                key={j}
                href={`/calculators/rent-conversion/${j}-${deposit}-${rate}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  전세 {formatAmountLabel(j)}원
                </p>
                <p className="text-xs text-gray-500">
                  월세 {formatWon(res.monthlyRent)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
