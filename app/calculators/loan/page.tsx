"use client";

import { useState } from "react";
import { calculateLoan, type LoanResult, type RepaymentType } from "@/lib/calculations";
import RelatedTools from "@/components/RelatedTools";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [type, setType] = useState<RepaymentType>("equalPrincipalInterest");
  const [result, setResult] = useState<LoanResult | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    const a = parseInt(amount.replace(/,/g, ""), 10);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    if (!a || a <= 0) { setError("대출 금액을 입력해주세요"); return; }
    if (!r || r <= 0) { setError("이자율을 입력해주세요"); return; }
    if (!y || y <= 0) { setError("대출 기간을 입력해주세요"); return; }
    setError("");
    setResult(calculateLoan(a, r, y, type));
    setShowAll(false);
  };

  const handleReset = () => {
    setAmount("");
    setRate("");
    setYears("");
    setType("equalPrincipalInterest");
    setResult(null);
    setShowAll(false);
    setError("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`월 상환금: ${formatNumber(result.monthlyPayments[0].payment)}원 (총 이자: ${formatNumber(result.totalInterest)}원)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setAmount(raw ? parseInt(raw, 10).toLocaleString("ko-KR") : "");
    setError("");
  };

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">대출이자 계산기</h1>
      <p className="text-gray-500 mb-8">
        원리금균등상환과 원금균등상환 방식의 월 상환금과 총 이자를 계산합니다.
      </p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대출 금액</label>
          <div className="relative">
            <input type="text" value={amount} onChange={handleAmountChange} onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }} placeholder="예: 300,000,000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">원</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연 이자율</label>
            <div className="relative">
              <input type="number" step="0.01" value={rate} onChange={(e) => { setRate(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }} placeholder="3.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">대출 기간</label>
            <div className="relative">
              <input type="number" value={years} onChange={(e) => { setYears(e.target.value); setError(""); }} onKeyDown={(e) => { if (e.key === "Enter") handleCalculate(); }} placeholder="30" min="1" max="50"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">년</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">상환 방식</label>
          <div className="flex gap-3">
            {([["equalPrincipalInterest", "원리금균등상환"], ["equalPrincipal", "원금균등상환"]] as const).map(([value, label]) => (
              <button key={value} onClick={() => setType(value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  type === value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="flex gap-3">
          <button onClick={handleCalculate}
            className="flex-1 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            계산하기
          </button>
          <button onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            초기화
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">월 상환금 (첫 달)</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">{formatNumber(result.monthlyPayments[0].payment)}원</p>
              <button onClick={handleCopy} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors" title="결과 복사" aria-label="결과 복사">
                {copied ? <span className="text-xs font-medium">복사됨!</span> : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>}
              </button>
            </div>
            <div className="flex justify-center gap-8 mt-3 text-sm text-blue-100">
              <span>총 이자: {formatNumber(result.totalInterest)}원</span>
              <span>총 상환: {formatNumber(result.totalPayment)}원</span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">월별 상환 내역</h3>
            <div className="overflow-x-auto">
              <div className="overflow-x-auto"><table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-2 text-left">회차</th>
                    <th className="py-2 text-right">원금</th>
                    <th className="py-2 text-right">이자</th>
                    <th className="py-2 text-right">상환금</th>
                    <th className="py-2 text-right">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {(showAll ? result.monthlyPayments : result.monthlyPayments.slice(0, 12)).map((m) => (
                    <tr key={m.month} className="border-b border-gray-50">
                      <td className="py-2 text-gray-600">{m.month}개월</td>
                      <td className="py-2 text-right">{formatNumber(m.principal)}원</td>
                      <td className="py-2 text-right text-red-400">{formatNumber(m.interest)}원</td>
                      <td className="py-2 text-right font-medium">{formatNumber(m.payment)}원</td>
                      <td className="py-2 text-right text-gray-500">{formatNumber(m.remainingBalance)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table></div>
            </div>
            {result.monthlyPayments.length > 12 && (
              <button onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                {showAll ? "접기" : `전체 ${result.monthlyPayments.length}개월 보기`}
              </button>
            )}
          </div>
        </div>
      )}

      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">상환 방식 비교</h2>
          <div className="overflow-x-auto">
            <div className="overflow-x-auto"><table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="py-2 px-3 border border-gray-200">원리금균등상환</th>
                  <th className="py-2 px-3 border border-gray-200">원금균등상환</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">월 상환금</td><td className="py-2 px-3 border border-gray-200">매월 동일</td><td className="py-2 px-3 border border-gray-200">매월 감소</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">초기 부담</td><td className="py-2 px-3 border border-gray-200">상대적으로 낮음</td><td className="py-2 px-3 border border-gray-200">높음</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">총 이자</td><td className="py-2 px-3 border border-gray-200">더 많음</td><td className="py-2 px-3 border border-gray-200">더 적음</td></tr>
                <tr><td className="py-2 px-3 border border-gray-200 font-medium">추천 대상</td><td className="py-2 px-3 border border-gray-200">일정한 지출 선호</td><td className="py-2 px-3 border border-gray-200">총 이자 절약 선호</td></tr>
              </tbody>
            </table></div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">대출 이자 절약 팁</h2>
          <ul className="text-gray-600 space-y-2 text-sm">
            <li className="flex gap-2"><span className="text-blue-500 font-bold">1.</span><span><strong>중도상환</strong> - 여유 자금이 생기면 중도상환하면 이자를 크게 줄일 수 있습니다. 단, 중도상환 수수료를 확인하세요.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">2.</span><span><strong>대출 갈아타기</strong> - 기존 대출보다 낮은 금리의 대출로 전환하면 이자 부담을 줄일 수 있습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">3.</span><span><strong>원금균등 선택</strong> - 초기 부담이 가능하다면 원금균등상환이 총 이자가 적습니다.</span></li>
            <li className="flex gap-2"><span className="text-blue-500 font-bold">4.</span><span><strong>대출 기간 단축</strong> - 같은 금액이라도 대출 기간이 짧을수록 총 이자는 줄어듭니다.</span></li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">고정금리와 변동금리 중 어떤 게 유리한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">금리 상승기에는 고정금리, 금리 하락기에는 변동금리가 유리합니다. 장기 대출일수록 고정금리가 안정적입니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">DSR이란 무엇인가요?</h3>
              <p className="text-gray-600 text-sm mt-1">DSR(총부채원리금상환비율)은 연 소득 대비 모든 대출의 원리금 상환액 비율입니다. 은행권은 DSR 40%, 비은행권은 50%까지 대출이 가능합니다.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">거치기간이란?</h3>
              <p className="text-gray-600 text-sm mt-1">대출 초기에 원금 상환 없이 이자만 납부하는 기간입니다. 거치기간이 끝나면 원금+이자를 함께 상환합니다. 거치기간이 길수록 총 이자 부담이 늘어납니다.</p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="loan" />
</div>
  );
}
