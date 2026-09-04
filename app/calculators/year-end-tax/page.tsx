"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";
import { SALARY_CALCULATION_BASIS } from "@/lib/calculations";

// 근로소득공제 계산
function calcEarnedIncomeDeduction(salary: number): number {
  if (salary <= 5_000_000) return salary * 0.7;
  if (salary <= 15_000_000) return 3_500_000 + (salary - 5_000_000) * 0.4;
  if (salary <= 45_000_000) return 7_500_000 + (salary - 15_000_000) * 0.15;
  if (salary <= 100_000_000) return 12_000_000 + (salary - 45_000_000) * 0.05;
  return Math.min(20_000_000, 14_750_000 + (salary - 100_000_000) * 0.02);
}

// 산출세액 계산 (과세표준에 세율 적용)
function calcComputedTax(taxBase: number): number {
  if (taxBase <= 0) return 0;
  if (taxBase <= 14_000_000) return taxBase * 0.06;
  if (taxBase <= 50_000_000) return 840_000 + (taxBase - 14_000_000) * 0.15;
  if (taxBase <= 88_000_000) return 6_240_000 + (taxBase - 50_000_000) * 0.24;
  if (taxBase <= 150_000_000) return 15_360_000 + (taxBase - 88_000_000) * 0.35;
  if (taxBase <= 300_000_000) return 37_060_000 + (taxBase - 150_000_000) * 0.38;
  if (taxBase <= 500_000_000) return 94_060_000 + (taxBase - 300_000_000) * 0.4;
  if (taxBase <= 1_000_000_000) return 174_060_000 + (taxBase - 500_000_000) * 0.42;
  return 384_060_000 + (taxBase - 1_000_000_000) * 0.45;
}

// 자녀세액공제 계산
function calcChildTaxCredit(children: number): number {
  if (children <= 0) return 0;
  if (children === 1) return 250_000;
  if (children === 2) return 550_000;
  return 550_000 + (children - 2) * 400_000;
}

function calcEarnedIncomeTaxCredit(computedTax: number, salary: number): number {
  const calculated = computedTax <= 1_300_000
    ? computedTax * 0.55
    : 715_000 + (computedTax - 1_300_000) * 0.3;
  let limit = 740_000;
  if (salary > 120_000_000) {
    limit = Math.max(200_000, 500_000 - (salary - 120_000_000) * 0.5);
  } else if (salary > 70_000_000) {
    limit = Math.max(500_000, 660_000 - (salary - 70_000_000) * 0.5);
  } else if (salary > 33_000_000) {
    limit = Math.max(660_000, 740_000 - (salary - 33_000_000) * 0.008);
  }
  return Math.round(Math.min(calculated, limit));
}

// 연금저축 공제율 (총급여 기준)
function getPensionCreditRate(salary: number): number {
  return salary <= 55_000_000 ? 0.15 : 0.12;
}

interface CalcResult {
  // 기본
  totalSalary: number;
  earnedIncomeDeduction: number;
  earnedIncome: number;
  // 소득공제
  personalDeduction: number;
  nationalPension: number;
  healthInsurance: number;
  creditCardDeduction: number;
  debitCardDeduction: number;
  totalIncomeDeduction: number;
  // 과세표준 & 산출세액
  taxBase: number;
  computedTax: number;
  // 세액공제
  earnedIncomeTaxCredit: number;
  childTaxCredit: number;
  pensionSavingsCredit: number;
  medicalCredit: number;
  educationCredit: number;
  donationCredit: number;
  standardTaxCredit: number;
  totalTaxCredit: number;
  // 결정세액 & 환급
  determinedTax: number;
  localTax: number;
  totalDeterminedTax: number;
  taxAlreadyPaid: number;
  refundOrPayment: number; // 양수=환급, 음수=추가납부
}

export default function YearEndTaxCalculator() {
  const [totalSalary, setTotalSalary] = useState("40,000,000");
  const [taxAlreadyPaid, setTaxAlreadyPaid] = useState("0");

  // 인적공제
  const [hasSpouse, setHasSpouse] = useState(false);
  const [dependents, setDependents] = useState(0);

  // 소득공제 inputs
  const [creditCardSpent, setCreditCardSpent] = useState("0");
  const [debitCardSpent, setDebitCardSpent] = useState("0");

  // 세액공제 inputs
  const [childrenCount, setChildrenCount] = useState(0);
  const [pensionSavings, setPensionSavings] = useState("0");
  const [medicalExpense, setMedicalExpense] = useState("0");
  const [educationExpense, setEducationExpense] = useState("0");
  const [donation, setDonation] = useState("0");

  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const formatNumber = (num: number) => num.toLocaleString("ko-KR");

  const parseNum = (s: string) => {
    const n = parseInt(s.replace(/,/g, ""), 10);
    return isNaN(n) ? 0 : n;
  };

  const handleNumberInput = (
    setter: (v: string) => void
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw) {
      setter(parseInt(raw, 10).toLocaleString("ko-KR"));
    } else {
      setter("");
    }
  };

  const result = useMemo<CalcResult | null>(() => {
    const salary = parseNum(totalSalary);
    if (salary <= 0) return null;

    // 1. 근로소득금액
    const earnedIncomeDeduction = calcEarnedIncomeDeduction(salary);
    const earnedIncome = salary - earnedIncomeDeduction;

    // 2. 소득공제
    const personalDeduction = 1_500_000 + (hasSpouse ? 1_500_000 : 0) + dependents * 1_500_000;
    const monthlySalary = salary / 12;
    const pensionBase = Math.min(
      Math.max(monthlySalary, SALARY_CALCULATION_BASIS.pensionLowerLimit),
      SALARY_CALCULATION_BASIS.pensionUpperLimit
    );
    const nationalPension = Math.round(
      pensionBase * SALARY_CALCULATION_BASIS.nationalPension * 12
    );
    const healthPremium = Math.round(
      salary * SALARY_CALCULATION_BASIS.healthInsurance
    );
    const longTermCare = Math.round(
      healthPremium * SALARY_CALCULATION_BASIS.longTermCare
    );
    const employmentInsurance = Math.round(
      salary * SALARY_CALCULATION_BASIS.employmentInsurance
    );
    const healthInsurance = healthPremium + longTermCare + employmentInsurance;

    // 신용카드 공제: 급여 25% 초과분의 15%, max 300만
    const threshold = salary * 0.25;
    const creditCardVal = parseNum(creditCardSpent);
    const debitCardVal = parseNum(debitCardSpent);
    const totalCardSpent = creditCardVal + debitCardVal;
    let creditCardDeduction = 0;
    let debitCardDeduction = 0;
    const cardDeductionLimit = salary <= 70_000_000
      ? 3_000_000
      : salary <= 120_000_000
        ? 2_500_000
        : 2_000_000;
    if (totalCardSpent > threshold) {
      // 신용카드부터 threshold 차감
      if (creditCardVal >= threshold) {
        creditCardDeduction = Math.min(Math.round((creditCardVal - threshold) * 0.15), cardDeductionLimit);
        debitCardDeduction = Math.min(Math.round(debitCardVal * 0.3), Math.max(0, cardDeductionLimit - creditCardDeduction));
      } else {
        const remainThreshold = threshold - creditCardVal;
        debitCardDeduction = Math.min(Math.round(Math.max(0, debitCardVal - remainThreshold) * 0.3), cardDeductionLimit);
      }
    }

    const totalIncomeDeduction = personalDeduction + nationalPension + healthInsurance + creditCardDeduction + debitCardDeduction;

    // 3. 과세표준
    const taxBase = Math.max(0, earnedIncome - totalIncomeDeduction);

    // 4. 산출세액
    const computedTax = calcComputedTax(taxBase);

    // 5. 세액공제
    const earnedIncomeTaxCredit = calcEarnedIncomeTaxCredit(computedTax, salary);
    const childTaxCredit = calcChildTaxCredit(childrenCount);
    const pensionVal = Math.min(parseNum(pensionSavings), 6_000_000);
    const pensionRate = getPensionCreditRate(salary);
    const pensionSavingsCredit = Math.round(pensionVal * pensionRate);

    const medicalVal = parseNum(medicalExpense);
    const medicalThreshold = salary * 0.03;
    const medicalCredit = medicalVal > medicalThreshold ? Math.round((medicalVal - medicalThreshold) * 0.15) : 0;

    const educationCredit = Math.round(parseNum(educationExpense) * 0.15);
    const donationVal = parseNum(donation);
    const donationCredit = donationVal <= 10_000_000
      ? Math.round(donationVal * 0.15)
      : Math.round(10_000_000 * 0.15 + (donationVal - 10_000_000) * 0.3);

    // 건강보험료 등 특별소득공제를 적용하므로 표준세액공제는 중복 적용하지 않는다.
    const standardTaxCredit = 0;
    const totalTaxCredit = earnedIncomeTaxCredit + childTaxCredit + pensionSavingsCredit + medicalCredit + educationCredit + donationCredit;

    // 6. 결정세액
    const determinedTax = Math.max(0, computedTax - totalTaxCredit);
    const localTax = Math.round(determinedTax * 0.1);
    const totalDeterminedTax = determinedTax + localTax;

    // 7. 기납부세액
    const paid = parseNum(taxAlreadyPaid);

    const refundOrPayment = paid - totalDeterminedTax;

    return {
      totalSalary: salary,
      earnedIncomeDeduction,
      earnedIncome,
      personalDeduction,
      nationalPension,
      healthInsurance,
      creditCardDeduction,
      debitCardDeduction,
      totalIncomeDeduction,
      taxBase,
      computedTax,
      earnedIncomeTaxCredit,
      childTaxCredit,
      pensionSavingsCredit,
      medicalCredit,
      educationCredit,
      donationCredit,
      standardTaxCredit,
      totalTaxCredit,
      determinedTax,
      localTax,
      totalDeterminedTax,
      taxAlreadyPaid: paid,
      refundOrPayment,
    };
  }, [totalSalary, taxAlreadyPaid, hasSpouse, dependents, creditCardSpent, debitCardSpent, childrenCount, pensionSavings, medicalExpense, educationExpense, donation]);

  const handleCopy = async () => {
    if (!result) return;
    const label = result.refundOrPayment >= 0 ? "예상 환급액" : "추가 납부액";
    const amount = Math.abs(result.refundOrPayment);
    await navigator.clipboard.writeText(`연말정산 ${label}: ${formatNumber(amount)}원`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTotalSalary("40,000,000");
    setTaxAlreadyPaid("0");
    setHasSpouse(false);
    setDependents(0);
    setCreditCardSpent("0");
    setDebitCardSpent("0");
    setChildrenCount(0);
    setPensionSavings("0");
    setMedicalExpense("0");
    setEducationExpense("0");
    setDonation("0");
  };

  const faqs = [
    {
      q: "연말정산은 언제 하나요?",
      a: "연말정산은 매년 1~2월에 진행됩니다. 회사에서 근로자의 소득공제·세액공제 자료를 취합하여 정산하며, 2월 또는 3월 급여에 환급 또는 추가납부액이 반영됩니다.",
    },
    {
      q: "환급과 추가납부는 어떻게 결정되나요?",
      a: "매월 급여에서 원천징수한 세금(기납부세액)이 최종 결정세액보다 많으면 환급, 적으면 추가납부합니다. 소득공제·세액공제를 많이 받을수록 환급 가능성이 높아집니다.",
    },
    {
      q: "신용카드와 체크카드 공제율이 다른가요?",
      a: "네, 신용카드는 사용액의 15%, 체크카드·현금영수증은 30%가 공제됩니다. 단, 총급여의 25%를 초과하여 사용한 금액에 대해서만 공제가 적용됩니다.",
    },
    {
      q: "연금저축 공제율은 어떻게 되나요?",
      a: "총급여 5,500만원 이하는 15%, 초과는 12% 세액공제율이 적용됩니다. 연금저축은 연 600만원, 퇴직연금계좌를 합하면 연 900만원 한도입니다. 이 계산기는 연금저축 입력만 지원합니다.",
    },
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          연말정산 계산기
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          2026년 일반 기준 주요 공제만 반영한 근로소득 연말정산 간이 시뮬레이션입니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="space-y-6 mb-6">
        {/* 총 급여 */}
        <div className="calc-card p-6">
          <h2 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full" />
            기본 정보
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">총 급여 (연봉)</label>
              <div className="relative">
                <input
                  type="text"
                  value={totalSalary}
                  onChange={handleNumberInput(setTotalSalary)}
                  placeholder="예: 40,000,000"
                  className="calc-input calc-input-lg pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-gray-400 font-medium self-center mr-1">빠른 선택</span>
                {[3000, 4000, 5000, 6000, 8000, 10000].map((v) => (
                  <button
                    key={v}
                    onClick={() => setTotalSalary((v * 10000).toLocaleString("ko-KR"))}
                    className="calc-preset"
                  >
                    {v.toLocaleString()}만원
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">기납부 세액 (원천징수 합계)</label>
              <div className="relative">
                <input
                  type="text"
                  value={taxAlreadyPaid}
                  onChange={handleNumberInput(setTaxAlreadyPaid)}
                  placeholder="원천징수영수증의 결정세액 합계"
                  className="calc-input pr-10"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">회사 급여명세서 또는 원천징수영수증에서 소득세와 지방소득세 기납부 합계를 입력하세요.</p>
            </div>
          </div>
        </div>

        {/* 인적공제 & 소득공제 */}
        <div className="calc-card p-6">
          <h2 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-green-500 rounded-full" />
            소득공제 항목
          </h2>
          <div className="space-y-4">
            {/* 인적공제 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">인적공제</label>
              <p className="text-xs text-gray-400 mb-3">본인 150만원 기본 적용</p>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasSpouse}
                    onChange={(e) => setHasSpouse(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  배우자 공제 (+150만)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">부양가족</span>
                  <select
                    aria-label="부양가족 수"
                    value={dependents}
                    onChange={(e) => setDependents(Number(e.target.value))}
                    className="calc-input !py-1.5 !px-2 w-20"
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>{n}명</option>
                    ))}
                  </select>
                  <span className="text-xs text-gray-400">x 150만</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs text-gray-400 mb-3">국민연금·건강보험·장기요양·고용보험의 본인부담분은 급여 기준으로 간이 계산합니다.</p>
            </div>

            {/* 카드 사용액 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  신용카드 사용액
                  <span className="font-normal text-gray-400 ml-1">(공제율 15%)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="신용카드 사용액"
                    value={creditCardSpent}
                    onChange={handleNumberInput(setCreditCardSpent)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  체크카드/현금영수증
                  <span className="font-normal text-gray-400 ml-1">(공제율 30%)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="체크카드 및 현금영수증 사용액"
                    value={debitCardSpent}
                    onChange={handleNumberInput(setDebitCardSpent)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 세액공제 */}
        <div className="calc-card p-6">
          <h2 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-purple-500 rounded-full" />
            세액공제 항목
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">자녀 수</label>
                <select
                  aria-label="자녀 수"
                  value={childrenCount}
                  onChange={(e) => setChildrenCount(Number(e.target.value))}
                  className="calc-input"
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}명{n > 0 ? ` (${formatNumber(calcChildTaxCredit(n))}원 공제)` : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  연금저축 납입액
                  <span className="font-normal text-gray-400 ml-1">(최대 600만)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="연금저축 납입액"
                    value={pensionSavings}
                    onChange={handleNumberInput(setPensionSavings)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  의료비 지출
                  <span className="font-normal text-gray-400 ml-1">(급여 3% 초과분 15%)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="의료비 지출액"
                    value={medicalExpense}
                    onChange={handleNumberInput(setMedicalExpense)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  교육비 지출
                  <span className="font-normal text-gray-400 ml-1">(15%)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="교육비 지출액"
                    value={educationExpense}
                    onChange={handleNumberInput(setEducationExpense)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  기부금
                  <span className="font-normal text-gray-400 ml-1">(15~30%)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    aria-label="기부금"
                    value={donation}
                    onChange={handleNumberInput(setDonation)}
                    className="calc-input pr-10"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">원</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="calc-card overflow-hidden mb-6 animate-fade-in">
          {/* Hero result */}
          <div className={`p-6 sm:p-8 text-white text-center ${result.refundOrPayment >= 0 ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"}`}>
            <p className="text-white/80 text-sm mb-1">
              {result.refundOrPayment >= 0 ? "예상 환급액" : "추가 납부 예상액"}
            </p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {formatNumber(Math.abs(result.refundOrPayment))}
                <span className="text-xl font-bold ml-1">원</span>
              </p>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 transition-all active:scale-95"
                title="결과 복사"
                aria-label="결과 복사"
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-white/70 text-sm mt-2">
              총급여 {formatNumber(result.totalSalary)}원 기준 · 기납부세액 {formatNumber(result.taxAlreadyPaid)}원
            </p>
          </div>

          {/* 계산 과정 */}
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              계산 과정
            </h3>
            <div className="space-y-1">
              <Row label="총 급여" value={result.totalSalary} bold />
              <Row label="(-) 근로소득공제" value={-result.earnedIncomeDeduction} />
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="근로소득금액" value={result.earnedIncome} bold />
              </div>
              <Row label="(-) 소득공제 합계" value={-result.totalIncomeDeduction} />
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="과세표준" value={result.taxBase} bold />
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="산출세액" value={result.computedTax} bold />
                <Row label="(-) 세액공제 합계" value={-result.totalTaxCredit} />
              </div>
              <div className="border-t-2 border-gray-200 mt-3 pt-3">
                <Row label="결정세액 (소득세)" value={result.determinedTax} bold />
                <Row label="지방소득세 (10%)" value={result.localTax} />
                <Row label="총 결정세액" value={result.totalDeterminedTax} bold />
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="기납부세액" value={result.taxAlreadyPaid} />
              </div>
              <div className={`rounded-xl p-4 mt-3 ${result.refundOrPayment >= 0 ? "bg-green-50" : "bg-red-50"}`}>
                <Row
                  label={result.refundOrPayment >= 0 ? "예상 환급액" : "추가 납부액"}
                  value={Math.abs(result.refundOrPayment)}
                  bold
                  accent={result.refundOrPayment >= 0 ? "green" : "red"}
                />
              </div>
            </div>
          </div>

          {/* 소득공제 상세 */}
          <div className="p-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-green-500 rounded-full" />
              소득공제 상세 내역
            </h3>
            <div className="space-y-1">
              <Row label="인적공제 (본인+배우자+부양가족)" value={result.personalDeduction} />
              <Row label="국민연금 (본인 4.75%)" value={result.nationalPension} />
              <Row label="건강·장기요양·고용보험" value={result.healthInsurance} />
              <Row label="신용카드 공제" value={result.creditCardDeduction} />
              <Row label="체크카드/현금영수증 공제" value={result.debitCardDeduction} />
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="소득공제 합계" value={result.totalIncomeDeduction} bold />
              </div>
            </div>
          </div>

          {/* 세액공제 상세 */}
          <div className="p-6 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full" />
              세액공제 상세 내역
            </h3>
            <div className="space-y-1">
              <Row label="근로소득세액공제" value={result.earnedIncomeTaxCredit} />
              <Row label="자녀세액공제" value={result.childTaxCredit} />
              <Row label="연금저축 세액공제" value={result.pensionSavingsCredit} />
              <Row label="의료비 세액공제" value={result.medicalCredit} />
              <Row label="교육비 세액공제" value={result.educationCredit} />
              <Row label="기부금 세액공제" value={result.donationCredit} />
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Row label="세액공제 합계" value={result.totalTaxCredit} bold />
              </div>
            </div>
          </div>

          {/* 버튼 */}
          <div className="p-6 border-t border-gray-100 flex gap-3">
            <button onClick={handleCopy} className="calc-btn-primary text-sm px-4 py-2.5 flex-1">
              {copied ? "복사됨!" : "결과 복사"}
            </button>
            <button onClick={handleReset} className="calc-btn-secondary text-sm px-4 py-2.5 flex-1">
              초기화
            </button>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">연말정산이란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            연말정산은 근로자가 1년 동안 급여에서 원천징수된 소득세를 정산하는 절차입니다.
            매월 급여에서 간이세액표에 따라 미리 공제된 세금과 실제로 내야 할 세금을 비교하여,
            더 낸 세금은 환급받고 덜 낸 세금은 추가로 납부합니다.
            각종 소득공제와 세액공제를 잘 활용하면 환급액을 늘릴 수 있습니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">소득공제 vs 세액공제 차이</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            소득공제는 과세표준(세금을 매기는 기준 금액)을 줄여주는 것이고,
            세액공제는 산출된 세금 자체를 직접 줄여주는 것입니다.
            일반적으로 고소득자는 소득공제가, 저소득자는 세액공제가 더 유리합니다.
          </p>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>소득공제</th>
                  <th>세액공제</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="font-medium">효과</td><td>과세표준 감소</td><td>산출세액 감소</td></tr>
                <tr><td className="font-medium">대표 항목</td><td>인적공제, 국민연금, 카드공제</td><td>자녀, 연금저축, 의료비, 교육비</td></tr>
                <tr><td className="font-medium">유리한 대상</td><td>고소득 (높은 세율 구간)</td><td>저소득 (낮은 세율 구간)</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">2026년 소득세 세율표</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>과세표준</th>
                  <th className="text-right">세율</th>
                  <th className="text-right">누진공제</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1,400만원 이하</td><td className="text-right font-medium">6%</td><td className="text-right">-</td></tr>
                <tr><td>1,400만 ~ 5,000만</td><td className="text-right font-medium">15%</td><td className="text-right">126만원</td></tr>
                <tr><td>5,000만 ~ 8,800만</td><td className="text-right font-medium">24%</td><td className="text-right">576만원</td></tr>
                <tr><td>8,800만 ~ 1.5억</td><td className="text-right font-medium">35%</td><td className="text-right">1,544만원</td></tr>
                <tr><td>1.5억 ~ 3억</td><td className="text-right font-medium">38%</td><td className="text-right">1,994만원</td></tr>
                <tr><td>3억 ~ 5억</td><td className="text-right font-medium">40%</td><td className="text-right">2,594만원</td></tr>
                <tr><td>5억 ~ 10억</td><td className="text-right font-medium">42%</td><td className="text-right">3,594만원</td></tr>
                <tr><td>10억 초과</td><td className="text-right font-medium">45%</td><td className="text-right">6,594만원</td></tr>
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
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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

      <p className="mt-6 text-xs text-gray-400 leading-relaxed">
        부양가족의 소득·나이 요건, 비과세소득, 보험료·주택·월세 공제, 카드 사용처별 추가공제, 교육비·의료비 한도 등은 모두 반영하지 못한 간이 예상치입니다. 최종 금액은 국세청 연말정산 간소화 자료와 원천징수영수증으로 확인하세요.
      </p>

      <RelatedTools current="year-end-tax" />

      {/* Mobile sticky result bar */}
      {result && (
        <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-[var(--card-bg)] border-t border-[var(--card-border)] px-4 py-3 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <div>
              <p className="text-[10px] text-[var(--muted)]">
                {result.refundOrPayment >= 0 ? "예상 환급액" : "추가 납부액"}
              </p>
              <p className={`text-lg font-extrabold ${result.refundOrPayment >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatNumber(Math.abs(result.refundOrPayment))}원
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
}: {
  label: string;
  value: number;
  bold?: boolean;
  accent?: "green" | "red";
}) {
  const formatted =
    value >= 0
      ? `${value.toLocaleString("ko-KR")}원`
      : `-${Math.abs(value).toLocaleString("ko-KR")}원`;

  return (
    <div className="flex justify-between items-center py-1.5">
      <span className={`text-sm ${bold ? "font-bold text-gray-900" : "text-gray-500"}`}>
        {label}
      </span>
      <span
        className={`text-sm tabular-nums ${bold ? "font-bold" : "font-medium"} ${
          accent === "green" ? "text-green-600 text-base" :
          accent === "red" ? "text-red-600 text-base" :
          value < 0 ? "text-red-400" :
          "text-gray-900"
        }`}
      >
        {formatted}
      </span>
    </div>
  );
}
