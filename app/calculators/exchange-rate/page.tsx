"use client";

import { useState, useEffect, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

interface CurrencyInfo {
  code: string;
  flag: string;
  name: string;
}

const CURRENCIES: CurrencyInfo[] = [
  { code: "KRW", flag: "\u{1F1F0}\u{1F1F7}", name: "\uB300\uD55C\uBBFC\uAD6D \uC6D0" },
  { code: "USD", flag: "\u{1F1FA}\u{1F1F8}", name: "\uBBF8\uAD6D \uB2EC\uB7EC" },
  { code: "JPY", flag: "\u{1F1EF}\u{1F1F5}", name: "\uC77C\uBCF8 \uC5D4" },
  { code: "EUR", flag: "\u{1F1EA}\u{1F1FA}", name: "\uC720\uB85C" },
  { code: "CNY", flag: "\u{1F1E8}\u{1F1F3}", name: "\uC911\uAD6D \uC704\uC548" },
  { code: "GBP", flag: "\u{1F1EC}\u{1F1E7}", name: "\uC601\uAD6D \uD30C\uC6B4\uB4DC" },
  { code: "CAD", flag: "\u{1F1E8}\u{1F1E6}", name: "\uCE90\uB098\uB2E4 \uB2EC\uB7EC" },
  { code: "AUD", flag: "\u{1F1E6}\u{1F1FA}", name: "\uD638\uC8FC \uB2EC\uB7EC" },
  { code: "CHF", flag: "\u{1F1E8}\u{1F1ED}", name: "\uC2A4\uC704\uC2A4 \uD504\uB791" },
  { code: "THB", flag: "\u{1F1F9}\u{1F1ED}", name: "\uD0DC\uAD6D \uBC14\uD2B8" },
  { code: "VND", flag: "\u{1F1FB}\u{1F1F3}", name: "\uBCA0\uD2B8\uB0A8 \uB3D9" },
  { code: "PHP", flag: "\u{1F1F5}\u{1F1ED}", name: "\uD544\uB9AC\uD540 \uD398\uC18C" },
];

// Quick rates to display against KRW
const QUICK_RATE_CURRENCIES = ["USD", "JPY", "EUR", "CNY", "GBP", "CAD", "AUD", "CHF"];

function getPrevBusinessDay(): string {
  const d = new Date();
  // Go back 3 days to ensure we get a previous business day different from latest
  d.setDate(d.getDate() - 3);
  const day = d.getDay();
  if (day === 0) d.setDate(d.getDate() - 2); // Sunday -> Friday
  if (day === 6) d.setDate(d.getDate() - 1); // Saturday -> Friday
  return d.toISOString().split("T")[0];
}

export default function ExchangeRateCalculator() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [prevRates, setPrevRates] = useState<Record<string, number> | null>(null);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KRW");
  const [fromAmount, setFromAmount] = useState("1");
  const [toAmount, setToAmount] = useState("");
  const [lastEdited, setLastEdited] = useState<"from" | "to">("from");
  const [copied, setCopied] = useState(false);

  // Available currencies (only those present in API response)
  const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyInfo[]>(CURRENCIES);

  useEffect(() => {
    // Fetch latest and previous day rates for change calculation
    Promise.all([
      fetch("https://api.frankfurter.app/latest?base=USD").then((r) => r.json()),
      // Fetch rates from 2 business days ago to ensure we get a different date
      fetch(`https://api.frankfurter.app/${getPrevBusinessDay()}?base=USD`).then((r) => r.json()),
    ])
      .then(([latest, prev]) => {
        const allRates: Record<string, number> = { USD: 1, ...latest.rates };
        setRates(allRates);
        setDate(latest.date);

        const allPrevRates: Record<string, number> = { USD: 1, ...prev.rates };
        setPrevRates(allPrevRates);

        const available = CURRENCIES.filter((c) => c.code in allRates);
        setAvailableCurrencies(available);
        setLoading(false);
      })
      .catch(() => {
        setError("환율 데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
        setLoading(false);
      });
  }, []);

  const convert = useCallback(
    (amount: number, from: string, to: string): number => {
      if (!rates) return 0;
      const fromRate = rates[from];
      const toRate = rates[to];
      if (!fromRate || !toRate) return 0;
      return amount * (toRate / fromRate);
    },
    [rates]
  );

  // Recalculate when rates load or currencies change
  useEffect(() => {
    if (!rates) return;
    if (lastEdited === "from") {
      const val = parseFloat(fromAmount.replace(/,/g, ""));
      if (!isNaN(val)) {
        const result = convert(val, fromCurrency, toCurrency);
        setToAmount(formatResult(result, toCurrency));
      }
    } else {
      const val = parseFloat(toAmount.replace(/,/g, ""));
      if (!isNaN(val)) {
        const result = convert(val, toCurrency, fromCurrency);
        setFromAmount(formatResult(result, fromCurrency));
      }
    }
  }, [rates, fromCurrency, toCurrency, convert, lastEdited, fromAmount, toAmount]);

  const formatResult = (num: number, currency: string): string => {
    if (num === 0) return "0";
    // For currencies with large values (KRW, VND, JPY), show fewer decimals
    if (["KRW", "VND"].includes(currency)) {
      return Math.round(num).toLocaleString("ko-KR");
    }
    if (["JPY"].includes(currency)) {
      return num.toLocaleString("ko-KR", { maximumFractionDigits: 1 });
    }
    return num.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setFromAmount(raw);
    setLastEdited("from");
    const val = parseFloat(raw);
    if (!isNaN(val) && rates) {
      const result = convert(val, fromCurrency, toCurrency);
      setToAmount(formatResult(result, toCurrency));
    } else {
      setToAmount("");
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setToAmount(raw);
    setLastEdited("to");
    const val = parseFloat(raw);
    if (!isNaN(val) && rates) {
      const result = convert(val, toCurrency, fromCurrency);
      setFromAmount(formatResult(result, fromCurrency));
    } else {
      setFromAmount("");
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    setLastEdited("from");
  };

  const handleReset = () => {
    setFromCurrency("USD");
    setToCurrency("KRW");
    setFromAmount("1");
    setToAmount("");
    setLastEdited("from");
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!rates || !toAmount) return;
    const fromInfo = getCurrencyInfo(fromCurrency);
    const toInfo = getCurrencyInfo(toCurrency);
    const text = `${fromAmount} ${fromInfo?.name || fromCurrency}(${fromCurrency}) = ${toAmount} ${toInfo?.name || toCurrency}(${toCurrency})`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const getQuickRateKRW = (code: string): number => {
    if (!rates || !rates[code] || !rates["KRW"]) return 0;
    const krwPerUnit = rates["KRW"] / rates[code];
    return code === "JPY" ? krwPerUnit * 100 : krwPerUnit;
  };

  const getQuickRateKRWFormatted = (code: string): string => {
    const val = getQuickRateKRW(code);
    return val === 0 ? "-" : `${Math.round(val).toLocaleString("ko-KR")}원`;
  };

  const getChange = (code: string): { diff: number; percent: number } | null => {
    if (!rates || !prevRates || !rates[code] || !prevRates[code] || !rates["KRW"] || !prevRates["KRW"]) return null;
    const current = rates["KRW"] / rates[code];
    const prev = prevRates["KRW"] / prevRates[code];
    const multiplier = code === "JPY" ? 100 : 1;
    const diff = (current - prev) * multiplier;
    const percent = ((current - prev) / prev) * 100;
    return { diff: Math.round(diff * 100) / 100, percent: Math.round(percent * 100) / 100 };
  };

  const getCurrencyInfo = (code: string): CurrencyInfo | undefined => {
    return CURRENCIES.find((c) => c.code === code);
  };

  if (loading) {
    return (
      <div className="py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">환율 계산기</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">환율 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">환율 계산기</h1>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-red-500 font-medium mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">환율 계산기</h1>
      <p className="text-gray-500 mb-8">
        실시간 환율 기반으로 주요 외화 간 환율을 계산합니다.
      </p>

      {/* 환율 변환기 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        {/* From */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            보내는 통화
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-[180px]"
            >
              {availableCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="금액 입력"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center my-2">
          <button
            onClick={handleSwap}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-lg font-bold"
            title="통화 바꾸기"
          >
            ↔
          </button>
        </div>

        {/* To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            받는 통화
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto sm:min-w-[180px]"
            >
              {availableCurrencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {c.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={toAmount}
              onChange={handleToAmountChange}
              placeholder="금액 입력"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Exchange rate info */}
        {rates && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 text-center">
            {(() => {
              const fromInfo = getCurrencyInfo(fromCurrency);
              const toInfo = getCurrencyInfo(toCurrency);
              const rate = convert(1, fromCurrency, toCurrency);
              return (
                <div className="flex items-center justify-center gap-2">
                  <span>
                    1 {fromInfo?.flag} {fromCurrency} = {formatResult(rate, toCurrency)} {toInfo?.flag} {toCurrency}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-500"
                  >
                    {copied ? "복사됨!" : "복사"}
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 주요 환율 현황 */}
      {rates && rates["KRW"] && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              주요 환율 현황 (원화 기준)
            </h2>
            {date && (
              <span className="text-xs text-gray-400">
                기준일: {date}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_RATE_CURRENCIES.filter((code) => rates[code]).map((code) => {
              const info = getCurrencyInfo(code);
              const label = code === "JPY" ? "100 JPY" : `1 ${code}`;
              const change = getChange(code);
              return (
                <div
                  key={code}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <div className="text-lg mb-1">{info?.flag}</div>
                  <div className="text-xs text-gray-500 mb-1">{label}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {getQuickRateKRWFormatted(code)}
                  </div>
                  {change && change.diff !== 0 && (
                    <div className={`text-xs mt-1 font-medium ${change.diff > 0 ? "text-red-500" : "text-blue-500"}`}>
                      {change.diff > 0 ? "▲" : "▼"} {Math.abs(change.diff).toLocaleString("ko-KR")}원
                      <span className="text-gray-400 ml-1">({change.diff > 0 ? "+" : ""}{change.percent}%)</span>
                    </div>
                  )}
                  {change && change.diff === 0 && (
                    <div className="text-xs mt-1 text-gray-400">- 변동없음</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            환율이란?
          </h2>
          <p className="text-gray-600 leading-relaxed">
            환율은 한 나라의 화폐와 다른 나라의 화폐 간 교환 비율을 말합니다.
            기준환율(매매기준율)은 외환시장에서 거래되는 환율의 기준이 되는 율로,
            한국에서는 서울외국환중개를 통해 매일 고시됩니다. 은행에서 실제로
            환전할 때는 매매기준율에 환전 수수료(스프레드)가 추가되어 &apos;살 때&apos;와
            &apos;팔 때&apos; 환율이 다릅니다. 일반적으로 살 때(매도율) 환율이 더 높고,
            팔 때(매입율) 환율이 더 낮습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            환율에 영향을 미치는 요인
          </h2>
          <div className="space-y-2 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-800">금리 차이:</strong> 한 나라의
              금리가 상대적으로 높으면 해당 통화에 대한 수요가 증가하여 환율이
              하락(원화 강세)합니다. 반대로 금리가 낮으면 환율이 상승(원화 약세)합니다.
            </p>
            <p>
              <strong className="text-gray-800">경상수지:</strong> 수출이 수입보다
              많아 경상수지가 흑자이면 외화 유입이 늘어 원화가 강세를 보입니다.
              반대로 적자이면 원화가 약세를 보입니다.
            </p>
            <p>
              <strong className="text-gray-800">물가 수준:</strong> 국내 물가가
              다른 나라보다 빠르게 상승하면 통화의 구매력이 떨어져 환율이
              상승합니다.
            </p>
            <p>
              <strong className="text-gray-800">정치적 안정성:</strong> 정치적
              불안이나 지정학적 리스크는 해당 통화의 가치를 하락시키는 요인이
              됩니다. 안전자산인 달러나 엔화 강세로 이어질 수 있습니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            환전 팁
          </h2>
          <div className="space-y-2 text-gray-600 leading-relaxed">
            <p>
              <strong className="text-gray-800">은행 vs 환전소:</strong> 시중
              은행의 환전 수수료율은 보통 1.5~1.75% 수준이며, 사설 환전소는 이보다
              낮은 수수료를 적용하는 경우가 많습니다. 다만 공인된 환전소인지
              확인이 필요합니다.
            </p>
            <p>
              <strong className="text-gray-800">우대율 활용:</strong> 대부분의
              은행에서 인터넷뱅킹이나 모바일뱅킹을 통해 환전하면 50~90%의 환율
              우대를 받을 수 있습니다. 창구 환전보다 온라인 환전이 유리합니다.
            </p>
            <p>
              <strong className="text-gray-800">환전 시기:</strong> 여행 계획이
              있다면 환율을 미리 확인하고, 환율이 유리할 때 분할 환전하는 것이
              좋습니다. 급격한 환율 변동기에는 한 번에 환전하는 것보다 나누어
              환전하는 것이 리스크를 줄일 수 있습니다.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">
                환율 데이터는 얼마나 자주 업데이트되나요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 계산기의 환율 데이터는 유럽중앙은행(ECB) 기준 환율을 사용하며,
                평일 기준 하루 한 번 업데이트됩니다. 주말이나 공휴일에는 가장
                최근 영업일의 환율이 표시됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                여기 나온 환율과 은행 환율이 다른 이유는?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                본 계산기는 매매기준율(중간환율)을 기준으로 표시합니다. 은행에서
                실제 환전할 때는 여기에 환전 수수료(스프레드)가 추가되므로 약
                1~2% 정도 차이가 날 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                스프레드란 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                스프레드는 외화를 사고파는 가격의 차이를 말합니다. 은행은
                매매기준율에 일정 비율의 마진을 더해 매도율(살 때)과 매입율(팔
                때)을 정합니다. 이 차이가 은행의 환전 수익이 됩니다. 주요
                통화(달러, 엔, 유로)는 스프레드가 작고, 비주요 통화는 스프레드가
                큰 편입니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                재정환율이란 무엇인가요?
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                재정환율(cross rate)은 두 통화 간의 환율을 제3의 통화(주로
                미국 달러)를 매개로 산출한 환율입니다. 예를 들어 원/유로 환율은
                원/달러 환율과 달러/유로 환율을 이용해 계산합니다. 본 계산기도
                USD를 기준으로 재정환율을 산출하여 표시합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
          <RelatedTools current="exchange-rate" />
</div>
  );
}
