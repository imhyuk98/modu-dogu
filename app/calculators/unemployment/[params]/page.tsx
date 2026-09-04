"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { calculateUnemployment } from "@/lib/calculations";

function formatWon(v: number) {
  return Math.round(v).toLocaleString("ko-KR");
}

// 수급기간 기준표 데이터
const DURATION_TABLE = {
  ageGroups: ["50세 미만", "50세 이상"],
  yearRanges: ["1년 미만", "1~3년", "3~5년", "5~10년", "10년 이상"],
  days: [
    [120, 150, 180, 210, 240], // 50세 미만
    [120, 180, 210, 240, 270], // 50세 이상
  ],
};

export default function UnemploymentParamsPage() {
  const { params } = useParams<{ params: string }>();
  const [ageStr, yearsStr, payStr] = params.split("-");
  const age = parseInt(ageStr);
  const workedYears = parseInt(yearsStr);
  const monthlyPay = parseInt(payStr);
  const result = calculateUnemployment(age, workedYears, monthlyPay * 10000);

  // 관련 링크: 같은 나이/근속, 다른 월급
  const salaryVariants = [200, 250, 300, 350, 400].filter(
    (p) => p !== monthlyPay
  );

  // 관련 링크: 같은 나이/월급, 다른 근속연수
  const yearsVariants = [1, 2, 3, 5, 7, 10, 15].filter(
    (y) => y !== workedYears
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* 브레드크럼 */}
      <nav className="text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-blue-500">
          홈
        </Link>
        {" > "}
        <Link href="/calculators/unemployment" className="hover:text-blue-500">
          실업급여 계산기
        </Link>
        {" > "}
        <span className="text-gray-700">
          {age}세 월급 {monthlyPay}만원 {workedYears}년 근무
        </span>
      </nav>

      {/* H1 */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
        월급 {monthlyPay}만원 {workedYears}년 근무 실업급여
      </h1>
      <p className="text-gray-500 mb-8">
        {age}세 기준, 2026년 7월 이후 고용보험 실업급여 예상 결과입니다.
      </p>

      {/* 핵심 결과 카드 2개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-1">월 예상 실업급여</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">
            {formatWon(result.monthlyAmount)}
            <span className="text-lg font-normal text-gray-500">원</span>
          </p>
        </div>
        <div className="bg-green-50 rounded-2xl p-6 text-center">
          <p className="text-gray-600 text-sm mb-1">총 수급액</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-green-600">
            {formatWon(result.totalAmount)}
            <span className="text-lg font-normal text-gray-500">원</span>
          </p>
        </div>
      </div>

      {/* 상세 테이블 */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                항목
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                금액 / 기간
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 text-gray-700">일 수급액</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.dailyAmount)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">월 수급액 (30일 기준)</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {formatWon(result.monthlyAmount)}원
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-gray-700">수급 기간</td>
              <td className="px-4 py-3 text-right text-gray-900">
                {result.totalDays}일 (약 {result.durationMonths}개월)
              </td>
            </tr>
            <tr className="bg-gray-50 font-bold">
              <td className="px-4 py-3 text-gray-900">총 수급액</td>
              <td className="px-4 py-3 text-right text-green-600">
                {formatWon(result.totalAmount)}원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 수급 기간 기준표 */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          실업급여 수급 기간 기준표
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-3 py-3 font-medium text-gray-600">
                  연령 구분
                </th>
                {DURATION_TABLE.yearRanges.map((range) => (
                  <th
                    key={range}
                    className="text-center px-3 py-3 font-medium text-gray-600"
                  >
                    {range}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DURATION_TABLE.ageGroups.map((group, i) => (
                <tr key={group}>
                  <td className="px-3 py-3 text-gray-700 font-medium">
                    {group}
                  </td>
                  {DURATION_TABLE.days[i].map((days, j) => {
                    // 현재 사용자 조건 하이라이트
                    const isCurrentAge =
                      (i === 0 && age < 50) || (i === 1 && age >= 50);
                    const yearRangeIndex =
                      workedYears < 1
                        ? 0
                        : workedYears < 3
                          ? 1
                          : workedYears < 5
                            ? 2
                            : workedYears < 10
                              ? 3
                              : 4;
                    const isHighlight = isCurrentAge && j === yearRangeIndex;
                    return (
                      <td
                        key={j}
                        className={`px-3 py-3 text-center ${
                          isHighlight
                            ? "bg-blue-100 text-blue-700 font-bold"
                            : "text-gray-900"
                        }`}
                      >
                        {days}일
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * 현재 조건({age}세, {workedYears}년 근무)에 해당하는 셀이
          하이라이트되어 있습니다.
        </p>
      </div>

      {/* 직접 계산 버튼 */}
      <div className="text-center mb-10">
        <Link
          href="/calculators/unemployment"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          직접 계산해보기
        </Link>
      </div>

      {/* 관련 링크: 다른 월급 */}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          다른 월급으로 계산한 실업급여
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          {age}세, {workedYears}년 근무 기준
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {salaryVariants.map((pay) => {
            const r = calculateUnemployment(age, workedYears, pay * 10000);
            return (
              <Link
                key={pay}
                href={`/calculators/unemployment/${age}-${workedYears}-${pay}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">
                  월급 {pay}만원
                </p>
                <p className="text-xs text-gray-500">
                  월 {formatWon(r.monthlyAmount)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* 관련 링크: 다른 근속연수 */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          다른 근속연수로 계산한 실업급여
        </h2>
        <p className="text-sm text-gray-500 mb-3">
          {age}세, 월급 {monthlyPay}만원 기준
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {yearsVariants.map((y) => {
            const r = calculateUnemployment(age, y, monthlyPay * 10000);
            return (
              <Link
                key={y}
                href={`/calculators/unemployment/${age}-${y}-${monthlyPay}`}
                className="block bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              >
                <p className="text-sm font-medium text-gray-900">{y}년 근무</p>
                <p className="text-xs text-gray-500">
                  총 {formatWon(r.totalAmount)}원
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
