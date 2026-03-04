"use client";

import { useState } from "react";
import { calculateSalary, type SalaryResult } from "@/lib/calculations";
import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";

export default function SalaryCalculator() {
  const [salary, setSalary] = useState("");
  const [result, setResult] = useState<SalaryResult | null>(null);

  const handleCalculate = () => {
    const amount = parseInt(salary.replace(/,/g, ""), 10);
    if (!amount || amount <= 0) return;
    setResult(calculateSalary(amount));
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setSalary(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setSalary("");
    }
  };

  const quickAmounts = [3000, 4000, 5000, 6000, 8000, 10000];

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        연봉 실수령액 계산기
      </h1>
      <p className="text-gray-500 mb-8">
        2024년 기준 4대보험과 소득세를 공제한 월 실수령액을 계산합니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          연봉 (세전)
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={salary}
              onChange={handleInputChange}
              placeholder="예: 50,000,000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원
            </span>
          </div>
          <button
            onClick={handleCalculate}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            계산하기
          </button>
        </div>

        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSalary((amount * 10000).toLocaleString("ko-KR"));
                setResult(calculateSalary(amount * 10000));
              }}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              {amount.toLocaleString()}만원
            </button>
          ))}
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* 실수령액 하이라이트 */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">월 실수령액</p>
            <p className="text-3xl font-bold">
              {formatNumber(result.monthlyNet)}원
            </p>
            <p className="text-blue-200 text-sm mt-2">
              연봉 {formatNumber(result.annualSalary)}원 기준
            </p>
          </div>

          {/* 공제 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">공제 내역</h3>
            <div className="space-y-3">
              <Row label="월 급여 (세전)" value={result.monthlyGross} bold />
              <div className="border-t border-gray-100 pt-3">
                <Row label="국민연금" value={-result.nationalPension} />
                <Row label="건강보험" value={-result.healthInsurance} />
                <Row label="장기요양보험" value={-result.longTermCare} />
                <Row label="고용보험" value={-result.employmentInsurance} />
                <Row label="소득세" value={-result.incomeTax} />
                <Row label="지방소득세" value={-result.localIncomeTax} />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row
                  label="총 공제액"
                  value={-result.totalDeductions}
                  bold
                  highlight
                />
              </div>
              <div className="border-t border-gray-200 pt-3">
                <Row label="월 실수령액" value={result.monthlyNet} bold />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">연봉 실수령액이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            연봉 실수령액은 근로자가 회사로부터 받는 연봉에서 국민연금, 건강보험,
            장기요양보험, 고용보험 등 4대보험료와 소득세, 지방소득세를 공제한 후
            실제로 받는 금액입니다. 세전 연봉과 실수령액의 차이는 연봉이 높을수록
            커지며, 이는 누진세율 구조 때문입니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4대보험 요율 (2024년 기준)</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">항목</th>
                  <th className="text-right py-2 px-3 border border-gray-200">근로자 부담</th>
                  <th className="text-right py-2 px-3 border border-gray-200">사업주 부담</th>
                  <th className="text-right py-2 px-3 border border-gray-200">합계</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">국민연금</td><td className="text-right py-2 px-3 border border-gray-200">4.5%</td><td className="text-right py-2 px-3 border border-gray-200">4.5%</td><td className="text-right py-2 px-3 border border-gray-200">9.0%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">건강보험</td><td className="text-right py-2 px-3 border border-gray-200">3.545%</td><td className="text-right py-2 px-3 border border-gray-200">3.545%</td><td className="text-right py-2 px-3 border border-gray-200">7.09%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">장기요양보험</td><td className="text-right py-2 px-3 border border-gray-200" colSpan={2}>건강보험료의 12.95%</td><td className="text-right py-2 px-3 border border-gray-200">12.95%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">고용보험</td><td className="text-right py-2 px-3 border border-gray-200">0.9%</td><td className="text-right py-2 px-3 border border-gray-200">0.9%~</td><td className="text-right py-2 px-3 border border-gray-200">1.8%~</td></tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">연봉별 실수령액 참고표</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">연봉</th>
                  <th className="text-right py-2 px-3 border border-gray-200">월 급여(세전)</th>
                  <th className="text-right py-2 px-3 border border-gray-200">공제 합계</th>
                  <th className="text-right py-2 px-3 border border-gray-200">월 실수령액</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[3000, 4000, 5000, 6000, 8000, 10000].map((sal) => {
                  const r = calculateSalary(sal * 10000);
                  return (
                    <tr key={sal}>
                      <td className="py-2 px-3 border border-gray-200">{sal.toLocaleString()}만원</td>
                      <td className="text-right py-2 px-3 border border-gray-200">{r.monthlyGross.toLocaleString()}원</td>
                      <td className="text-right py-2 px-3 border border-gray-200">{r.totalDeductions.toLocaleString()}원</td>
                      <td className="text-right py-2 px-3 border border-gray-200 font-medium">{r.monthlyNet.toLocaleString()}원</td>
                    </tr>
                  );
                })}
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">소득세 누진세율 구조</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            한국의 소득세는 누진세율 구조로, 과세표준이 높을수록 높은 세율이 적용됩니다.
            단, 전체 소득에 최고 세율이 적용되는 것이 아니라 구간별로 다른 세율이 적용됩니다.
          </p>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">과세표준</th>
                  <th className="text-right py-2 px-3 border border-gray-200">세율</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200">1,400만원 이하</td><td className="text-right py-2 px-3 border border-gray-200">6%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1,400만원 ~ 5,000만원</td><td className="text-right py-2 px-3 border border-gray-200">15%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5,000만원 ~ 8,800만원</td><td className="text-right py-2 px-3 border border-gray-200">24%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">8,800만원 ~ 1억5천만원</td><td className="text-right py-2 px-3 border border-gray-200">35%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">1억5천만원 ~ 3억원</td><td className="text-right py-2 px-3 border border-gray-200">38%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">3억원 ~ 5억원</td><td className="text-right py-2 px-3 border border-gray-200">40%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">5억원 ~ 10억원</td><td className="text-right py-2 px-3 border border-gray-200">42%</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200">10억원 초과</td><td className="text-right py-2 px-3 border border-gray-200">45%</td></tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">연봉과 월급의 차이는?</h3>
              <p className="text-gray-600 text-sm mt-1">연봉은 1년 동안 받는 총 급여이고, 월급은 연봉을 12개월로 나눈 금액입니다. 다만 성과급, 상여금 등이 별도로 지급되는 경우 실제 수령액은 달라질 수 있습니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">국민연금에 상한선이 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">네, 국민연금은 월 소득 590만원을 상한으로 합니다. 즉, 월 급여가 590만원 이상이어도 국민연금은 590만원 기준으로 계산됩니다. 하한선은 월 37만원입니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">부양가족 수에 따라 세금이 달라지나요?</h3>
              <p className="text-gray-600 text-sm mt-1">네, 부양가족이 많을수록 인적공제가 늘어나 소득세가 줄어듭니다. 본 계산기는 부양가족 1인(본인) 기준으로 계산하며, 실제 세금은 부양가족 수에 따라 달라집니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">비과세 수당은 어떻게 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">식대(월 20만원), 차량유지비 등 비과세 수당은 소득세 계산에서 제외됩니다. 비과세 수당이 있다면 실제 실수령액은 본 계산 결과보다 다소 많을 수 있습니다.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  const formatted =
    value >= 0
      ? `${value.toLocaleString("ko-KR")}원`
      : `-${Math.abs(value).toLocaleString("ko-KR")}원`;

  return (
    <div className="flex justify-between items-center py-1">
      <span className={`text-sm ${bold ? "font-semibold text-gray-900" : "text-gray-600"}`}>
        {label}
      </span>
      <span
        className={`text-sm ${
          bold ? "font-semibold" : ""
        } ${highlight ? "text-red-500" : value < 0 ? "text-red-400" : "text-gray-900"}`}
      >
        {formatted}
      </span>
          <RelatedTools current="salary" />
</div>
  );
}
