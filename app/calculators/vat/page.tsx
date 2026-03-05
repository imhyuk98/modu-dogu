"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

type Mode = "supply" | "total";

interface VatResult {
  supplyAmount: number;
  vat: number;
  totalAmount: number;
}

function calculateVat(amount: number, mode: Mode): VatResult {
  if (mode === "supply") {
    // 공급가액 → 부가세, 합계금액
    const vat = Math.round(amount * 0.1);
    return {
      supplyAmount: amount,
      vat,
      totalAmount: amount + vat,
    };
  } else {
    // 합계금액 → 공급가액, 부가세 역산
    const supplyAmount = Math.round(amount / 1.1);
    const vat = amount - supplyAmount;
    return {
      supplyAmount,
      vat,
      totalAmount: amount,
    };
  }
}

export default function VatCalculator() {
  const [mode, setMode] = useState<Mode>("supply");
  const [amount, setAmount] = useState("1,000,000");
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setAmount(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setAmount("");
    }
  };

  const result = useMemo<VatResult | null>(() => {
    const num = parseInt(amount.replace(/,/g, ""), 10);
    if (!num || num <= 0) return null;
    return calculateVat(num, mode);
  }, [amount, mode]);

  const handleReset = () => {
    setAmount("");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = mode === "supply"
      ? `${formatNumber(result.totalAmount)}원`
      : `${formatNumber(result.supplyAmount)}원`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setAmount("");
    setCopied(false);
  };

  const quickAmounts = [
    { label: "10만", value: 100_000 },
    { label: "50만", value: 500_000 },
    { label: "100만", value: 1_000_000 },
    { label: "500만", value: 5_000_000 },
    { label: "1,000만", value: 10_000_000 },
    { label: "1억", value: 100_000_000 },
  ];

  return (
    <div className="py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        부가세 계산기 (부가가치세)
      </h1>
      <p className="text-gray-500 mb-8">
        공급가액에서 부가세를 계산하거나, 합계금액에서 역산합니다.
      </p>

      {/* 모드 탭 */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => switchMode("supply")}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === "supply"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          공급가액 → 부가세
        </button>
        <button
          onClick={() => switchMode("total")}
          className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-colors ${
            mode === "total"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          합계금액 → 역산
        </button>
      </div>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {mode === "supply" ? "공급가액 (부가세 별도)" : "합계금액 (부가세 포함)"}
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={amount}
              onChange={handleInputChange}
              placeholder={
                mode === "supply"
                  ? "예: 1,000,000"
                  : "예: 1,100,000"
              }
              className="calc-input calc-input-lg"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              원
            </span>
          </div>
          <button
            onClick={handleReset}
            className="calc-btn-secondary whitespace-nowrap"
          >
            초기화
          </button>
        </div>
        {/* 빠른 선택 */}
        <div className="flex flex-wrap gap-2 mt-4">
          {quickAmounts.map((item) => (
            <button
              key={item.value}
              onClick={() => {
                setAmount(item.value.toLocaleString("ko-KR"));
              }}
              className="calc-preset"
            >
              {item.label}원
            </button>
          ))}
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6">
          {/* 합계금액 하이라이트 */}
          <div className="bg-blue-600 text-white p-6 text-center">
            <p className="text-blue-100 text-sm mb-1">
              {mode === "supply" ? "합계금액 (부가세 포함)" : "공급가액 (부가세 별도)"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-3xl font-bold">
                {mode === "supply"
                  ? formatNumber(result.totalAmount)
                  : formatNumber(result.supplyAmount)}
                원
              </p>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors"
                title="결과 복사"
                aria-label="결과 복사"
              >
                {copied ? (
                  <span className="text-xs text-white font-medium px-1">복사됨!</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 상세 내역 */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">계산 내역</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">공급가액</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(result.supplyAmount)}원
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">부가세 (10%)</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatNumber(result.vat)}원
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">합계금액</span>
                <span className="text-xl font-bold text-gray-900">
                  {formatNumber(result.totalAmount)}원
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[var(--muted)]">{mode === "supply" ? "합계금액" : "공급가액"}</p>
              <p className="text-lg font-extrabold text-blue-600">{mode === "supply" ? formatNumber(result.totalAmount) : formatNumber(result.supplyAmount)}원</p>
            </div>
            <button onClick={handleCopy} className="calc-btn-primary text-xs px-3 py-2">{copied ? "복사됨!" : "복사"}</button>
          </div>
        </div>
      )}

      {/* 간이과세자 안내 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">간이과세자 안내</h3>
        <ul className="text-sm text-yellow-700 space-y-1.5">
          <li>- 일반과세자: 부가가치세율 10% (본 계산기 기준)</li>
          <li>- 간이과세자: 업종별 부가가치율 적용 (1.5% ~ 4%)</li>
          <li>- 연 매출 8,000만원 미만 개인사업자는 간이과세 적용 가능</li>
          <li>- 연 매출 4,800만원 미만 간이과세자는 부가세 납부 면제</li>
        </ul>
      </div>

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            부가가치세(VAT)란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            부가가치세(Value Added Tax, VAT)는 재화나 용역의 공급 과정에서
            발생하는 부가가치에 대해 부과되는 세금입니다. 한국의 부가가치세율은
            10%로, 사업자가 물건을 판매하거나 서비스를 제공할 때 공급가액의
            10%를 부가세로 거래징수하여 국가에 납부합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            공급가액과 합계금액의 차이
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            공급가액은 부가세를 제외한 순수 물품 또는 서비스의 가격이며,
            합계금액은 부가세가 포함된 최종 결제 금액입니다.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">공급가액</th>
                  <th className="text-right py-2 px-3 border border-gray-200">부가세 (10%)</th>
                  <th className="text-right py-2 px-3 border border-gray-200">합계금액</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {[100_000, 500_000, 1_000_000, 5_000_000, 10_000_000, 100_000_000].map(
                  (val) => {
                    const r = calculateVat(val, "supply");
                    return (
                      <tr key={val}>
                        <td className="py-2 px-3 border border-gray-200">
                          {val.toLocaleString("ko-KR")}원
                        </td>
                        <td className="text-right py-2 px-3 border border-gray-200">
                          {r.vat.toLocaleString("ko-KR")}원
                        </td>
                        <td className="text-right py-2 px-3 border border-gray-200 font-medium">
                          {r.totalAmount.toLocaleString("ko-KR")}원
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            부가세 신고 및 납부 기간
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-2 px-3 border border-gray-200">구분</th>
                  <th className="text-left py-2 px-3 border border-gray-200">과세기간</th>
                  <th className="text-left py-2 px-3 border border-gray-200">신고/납부 기한</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr>
                  <td className="py-2 px-3 border border-gray-200">1기 확정</td>
                  <td className="py-2 px-3 border border-gray-200">1월 1일 ~ 6월 30일</td>
                  <td className="py-2 px-3 border border-gray-200">7월 25일까지</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 border border-gray-200">2기 확정</td>
                  <td className="py-2 px-3 border border-gray-200">7월 1일 ~ 12월 31일</td>
                  <td className="py-2 px-3 border border-gray-200">다음해 1월 25일까지</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            * 일반과세자는 1월, 7월에 확정신고하며, 4월과 10월에 예정신고(또는 예정고지)가 있습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">부가세 면세 품목은 어떤 것이 있나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                가공되지 않은 식료품, 수돗물, 의료 및 교육 서비스, 도서, 신문,
                대중교통 요금 등은 부가세가 면제됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">세금계산서와 영수증의 차이는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                세금계산서는 사업자 간 거래 시 발행하며 공급가액과 부가세가
                구분 표시됩니다. 영수증은 소비자 대상 거래 시 발행하며
                부가세가 포함된 합계금액만 표시됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">간이과세자와 일반과세자의 차이는?</h3>
              <p className="text-gray-600 text-sm mt-1">
                일반과세자는 매출세액에서 매입세액을 공제한 금액을 납부하고,
                간이과세자는 매출액에 업종별 부가가치율(15~40%)을 곱한 금액의
                10%를 납부합니다. 연 매출 8,000만원 미만의 개인사업자가
                간이과세 적용 대상입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">부가세 환급은 어떻게 받나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                매출세액보다 매입세액이 큰 경우 차액을 환급받을 수 있습니다.
                확정신고 기한으로부터 30일 이내에 환급됩니다. 수출업체의 경우
                조기환급(15일 이내)이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="vat" />
    </div>
  );
}
