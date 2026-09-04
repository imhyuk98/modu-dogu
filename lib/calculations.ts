// 2026년 7월 이후 직장가입자 근로자 부담 기준
export const SALARY_CALCULATION_BASIS = {
  effectiveFrom: "2026-07-01",
  nationalPension: 0.0475, // 국민연금 4.75% (총 9.5%)
  healthInsurance: 0.03595, // 건강보험 3.595% (총 7.19%)
  longTermCare: 0.1314, // 장기요양보험 (건강보험료의 약 13.14%)
  employmentInsurance: 0.009, // 고용보험 0.9%
  pensionUpperLimit: 6_590_000,
  pensionLowerLimit: 410_000,
} as const;

const INSURANCE_RATES = SALARY_CALCULATION_BASIS;
const PENSION_UPPER_LIMIT = SALARY_CALCULATION_BASIS.pensionUpperLimit;
const PENSION_LOWER_LIMIT = SALARY_CALCULATION_BASIS.pensionLowerLimit;

// 근로소득세 간이세액표 (월급여 기준, 부양가족 1인 기준 근사치)
function calculateIncomeTax(monthlyGross: number): number {
  // 간이세액표 근사 계산
  const annual = monthlyGross * 12;

  // 근로소득공제
  let deduction = 0;
  if (annual <= 5_000_000) {
    deduction = annual * 0.7;
  } else if (annual <= 15_000_000) {
    deduction = 3_500_000 + (annual - 5_000_000) * 0.4;
  } else if (annual <= 45_000_000) {
    deduction = 7_500_000 + (annual - 15_000_000) * 0.15;
  } else if (annual <= 100_000_000) {
    deduction = 12_000_000 + (annual - 45_000_000) * 0.05;
  } else {
    deduction = 14_750_000 + (annual - 100_000_000) * 0.02;
  }

  // 근로소득금액
  const earnedIncome = annual - deduction;

  // 기본공제 (본인 150만원) + 표준세액공제
  const personalDeduction = 1_500_000;
  const standardDeduction = 130_000;

  // 국민연금 공제 (연간)
  const monthlySalary = Math.min(Math.max(monthlyGross, PENSION_LOWER_LIMIT), PENSION_UPPER_LIMIT);
  const pensionDeduction = monthlySalary * INSURANCE_RATES.nationalPension * 12;

  // 건강보험 + 장기요양 공제 (연간)
  const healthDeduction =
    monthlyGross * INSURANCE_RATES.healthInsurance * 12 +
    monthlyGross * INSURANCE_RATES.healthInsurance * INSURANCE_RATES.longTermCare * 12;

  // 고용보험 공제
  const employmentDeduction = monthlyGross * INSURANCE_RATES.employmentInsurance * 12;

  // 과세표준
  const taxableIncome = Math.max(
    0,
    earnedIncome - personalDeduction - pensionDeduction - healthDeduction - employmentDeduction
  );

  // 소득세 기본세율 기준 근사 계산
  let tax = 0;
  if (taxableIncome <= 14_000_000) {
    tax = taxableIncome * 0.06;
  } else if (taxableIncome <= 50_000_000) {
    tax = 840_000 + (taxableIncome - 14_000_000) * 0.15;
  } else if (taxableIncome <= 88_000_000) {
    tax = 6_240_000 + (taxableIncome - 50_000_000) * 0.24;
  } else if (taxableIncome <= 150_000_000) {
    tax = 15_360_000 + (taxableIncome - 88_000_000) * 0.35;
  } else if (taxableIncome <= 300_000_000) {
    tax = 37_060_000 + (taxableIncome - 150_000_000) * 0.38;
  } else if (taxableIncome <= 500_000_000) {
    tax = 94_060_000 + (taxableIncome - 300_000_000) * 0.4;
  } else if (taxableIncome <= 1_000_000_000) {
    tax = 174_060_000 + (taxableIncome - 500_000_000) * 0.42;
  } else {
    tax = 384_060_000 + (taxableIncome - 1_000_000_000) * 0.45;
  }

  // 표준세액공제 적용
  tax = Math.max(0, tax - standardDeduction);

  // 월 소득세
  return Math.round(tax / 12);
}

export interface SalaryResult {
  annualSalary: number;
  monthlyGross: number;
  nationalPension: number;
  healthInsurance: number;
  longTermCare: number;
  employmentInsurance: number;
  incomeTax: number;
  localIncomeTax: number;
  totalDeductions: number;
  monthlyNet: number;
}

export function calculateSalary(annualSalary: number): SalaryResult {
  const monthlyGross = Math.round(annualSalary / 12);

  // 국민연금 (상한/하한 적용)
  const pensionBase = Math.min(Math.max(monthlyGross, PENSION_LOWER_LIMIT), PENSION_UPPER_LIMIT);
  const nationalPension = Math.round(pensionBase * INSURANCE_RATES.nationalPension);

  // 건강보험
  const healthInsurance = Math.round(monthlyGross * INSURANCE_RATES.healthInsurance);

  // 장기요양보험 (건강보험료의 약 13.14%)
  const longTermCare = Math.round(healthInsurance * INSURANCE_RATES.longTermCare);

  // 고용보험
  const employmentInsurance = Math.round(monthlyGross * INSURANCE_RATES.employmentInsurance);

  // 소득세
  const incomeTax = calculateIncomeTax(monthlyGross);

  // 지방소득세 (소득세의 10%)
  const localIncomeTax = Math.round(incomeTax * 0.1);

  const totalDeductions =
    nationalPension + healthInsurance + longTermCare + employmentInsurance + incomeTax + localIncomeTax;

  const monthlyNet = monthlyGross - totalDeductions;

  return {
    annualSalary,
    monthlyGross,
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    incomeTax,
    localIncomeTax,
    totalDeductions,
    monthlyNet,
  };
}

// ==================== 대출이자 계산기 ====================

export type RepaymentType = "equalPrincipalInterest" | "equalPrincipal";

export interface LoanMonthlyDetail {
  month: number;
  principal: number;
  interest: number;
  payment: number;
  remainingBalance: number;
}

export interface LoanResult {
  loanAmount: number;
  totalInterest: number;
  totalPayment: number;
  monthlyPayments: LoanMonthlyDetail[];
}

export function calculateLoan(
  loanAmount: number,
  annualRate: number,
  years: number,
  type: RepaymentType
): LoanResult {
  const months = years * 12;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayments: LoanMonthlyDetail[] = [];
  let totalInterest = 0;
  let remaining = loanAmount;

  if (type === "equalPrincipalInterest") {
    // 원리금균등상환
    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

    for (let i = 1; i <= months; i++) {
      const interest = Math.round(remaining * monthlyRate);
      const principal = Math.round(monthlyPayment - interest);
      remaining = Math.max(0, remaining - principal);
      totalInterest += interest;
      monthlyPayments.push({
        month: i,
        principal,
        interest,
        payment: Math.round(monthlyPayment),
        remainingBalance: remaining,
      });
    }
  } else {
    // 원금균등상환
    const monthlyPrincipal = Math.round(loanAmount / months);

    for (let i = 1; i <= months; i++) {
      const interest = Math.round(remaining * monthlyRate);
      const principal = i === months ? remaining : monthlyPrincipal;
      remaining = Math.max(0, remaining - principal);
      totalInterest += interest;
      monthlyPayments.push({
        month: i,
        principal,
        interest,
        payment: principal + interest,
        remainingBalance: remaining,
      });
    }
  }

  return {
    loanAmount,
    totalInterest,
    totalPayment: loanAmount + totalInterest,
    monthlyPayments,
  };
}

// ==================== BMI 계산기 ====================

export interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
}

export function calculateBMI(heightCm: number, weightKg: number): BMIResult {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const rounded = Math.round(bmi * 10) / 10;

  if (rounded < 18.5) {
    return { bmi: rounded, category: "저체중", color: "text-blue-500", description: "정상 체중보다 낮습니다. 균형 잡힌 식단을 권장합니다." };
  } else if (rounded < 23) {
    return { bmi: rounded, category: "정상", color: "text-green-500", description: "건강한 체중 범위입니다. 현재 상태를 유지하세요." };
  } else if (rounded < 25) {
    return { bmi: rounded, category: "과체중", color: "text-yellow-500", description: "정상 범위를 약간 초과했습니다. 식이조절과 운동을 권장합니다." };
  } else if (rounded < 30) {
    return { bmi: rounded, category: "비만", color: "text-orange-500", description: "비만 단계입니다. 건강 관리가 필요합니다." };
  } else {
    return { bmi: rounded, category: "고도비만", color: "text-red-500", description: "고도비만 단계입니다. 전문의 상담을 권장합니다." };
  }
}

// ==================== 퇴직금 계산기 ====================

export interface RetirementResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
  averageDailyWage: number;
  retirementPay: number;
}

export function calculateRetirement(
  startDate: Date,
  endDate: Date,
  recentThreeMonthPay: number,
  recentThreeMonthDays: number
): RetirementResult {
  const diffTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;

  // 1일 평균임금
  const averageDailyWage = Math.round(recentThreeMonthPay / recentThreeMonthDays);

  // 퇴직금 = 1일 평균임금 × 30일 × (재직일수 / 365)
  const retirementPay = Math.round(averageDailyWage * 30 * (totalDays / 365));

  return {
    totalDays,
    years,
    months,
    days,
    averageDailyWage,
    retirementPay,
  };
}

// ==================== 연차 계산기 ====================

export type AnnualLeaveBasis = "hire-date" | "fiscal-year";
export type AnnualLeaveMode = "employed" | "separation";

export interface AnnualLeaveInput {
  startDate: string;
  referenceDate: string;
  basis: AnnualLeaveBasis;
  mode: AnnualLeaveMode;
  usedLeave: number;
  attendanceAtLeast80: boolean;
  perfectAttendanceMonths?: number;
}

export interface AnnualLeaveDetail {
  grantDate: string;
  days: number;
  kind: "monthly" | "annual" | "fiscal";
  description: string;
}

export interface AnnualLeaveResult {
  currentGranted: number;
  currentAvailable: number;
  historicalGenerated: number;
  statutoryCurrentAvailable: number;
  completedYears: number;
  completedMonths: number;
  details: AnnualLeaveDetail[];
  warning?: string;
}

const DAY_MS = 86_400_000;

function parseDateOnly(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysInUtcMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

function addUtcMonthsClamped(date: Date, months: number) {
  const targetMonth = date.getUTCMonth() + months;
  const year = date.getUTCFullYear() + Math.floor(targetMonth / 12);
  const month = ((targetMonth % 12) + 12) % 12;
  return new Date(Date.UTC(year, month, Math.min(date.getUTCDate(), daysInUtcMonth(year, month))));
}

function addUtcYearsClamped(date: Date, years: number) {
  const year = date.getUTCFullYear() + years;
  return new Date(Date.UTC(year, date.getUTCMonth(), Math.min(date.getUTCDate(), daysInUtcMonth(year, date.getUTCMonth()))));
}

function roundToOne(value: number) {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}

function calculateHireDateSchedule(
  start: Date,
  reference: Date,
  attendanceAtLeast80: boolean,
  perfectAttendanceMonths?: number,
) {
  const details: AnnualLeaveDetail[] = [];
  let completedMonths = 0;
  for (let month = 1; month <= 1_200; month += 1) {
    if (addUtcMonthsClamped(start, month) > reference) break;
    completedMonths = month;
  }
  let firstYearCompletedMonths = 0;
  for (let month = 1; month <= 11; month += 1) {
    const grantDate = addUtcMonthsClamped(start, month);
    if (grantDate > reference) break;
    firstYearCompletedMonths += 1;
  }
  const creditedMonthly = Math.min(
    firstYearCompletedMonths,
    Math.max(0, Math.floor(perfectAttendanceMonths ?? firstYearCompletedMonths)),
  );
  if (creditedMonthly > 0) {
    details.push({
      grantDate: formatDateOnly(addUtcMonthsClamped(start, creditedMonthly)),
      days: creditedMonthly,
      kind: "monthly",
      description: `최초 1년 중 개근한 달 ${creditedMonthly}개월 × 1일`,
    });
  }

  let completedYears = 0;
  for (let year = 1; year <= 80; year += 1) {
    const grantDate = addUtcYearsClamped(start, year);
    if (grantDate > reference) break;
    completedYears = year;
    const days = attendanceAtLeast80
      ? Math.min(15 + Math.floor((year - 1) / 2), 25)
      : Math.min(12, Math.max(0, Math.floor(perfectAttendanceMonths ?? 0)));
    details.push({
      grantDate: formatDateOnly(grantDate),
      days,
      kind: "annual",
      description: attendanceAtLeast80
        ? `${year}년 근속 완료: 기본 15일${days > 15 ? ` + 가산 ${days - 15}일` : ""}`
        : `직전 1년 출근율 80% 미만: 개근한 달 ${days}개월 × 1일`,
    });
  }

  const firstAnniversary = addUtcYearsClamped(start, 1);
  let currentGranted = reference < firstAnniversary ? creditedMonthly : 0;
  const latestAnnual = [...details].reverse().find((detail) => detail.kind === "annual");
  if (latestAnnual) {
    const expiresOn = addUtcYearsClamped(parseDateOnly(latestAnnual.grantDate)!, 1);
    if (reference < expiresOn) currentGranted = latestAnnual.days;
  }

  return {
    details,
    completedMonths,
    completedYears,
    currentGranted,
    historicalGenerated: details.reduce((sum, detail) => sum + detail.days, 0),
  };
}

function calculateFiscalYearGrant(start: Date, reference: Date, attendanceAtLeast80: boolean) {
  const referenceYear = reference.getUTCFullYear();
  const firstFiscalGrantYear = start.getUTCFullYear() + 1;
  if (referenceYear < firstFiscalGrantYear) return null;

  const grantDate = new Date(Date.UTC(referenceYear, 0, 1));
  if (grantDate > reference) return null;
  if (referenceYear === firstFiscalGrantYear) {
    const yearStart = new Date(Date.UTC(start.getUTCFullYear(), 0, 1));
    const nextYear = new Date(Date.UTC(start.getUTCFullYear() + 1, 0, 1));
    const daysInYear = Math.round((nextYear.getTime() - yearStart.getTime()) / DAY_MS);
    const employedDays = Math.round((nextYear.getTime() - start.getTime()) / DAY_MS);
    return {
      grantDate: formatDateOnly(grantDate),
      days: attendanceAtLeast80 ? roundToOne(15 * employedDays / daysInYear) : 0,
      description: `입사 첫해 재직 ${employedDays}/${daysInYear}일을 15일에 비례한 참고 배정`,
    };
  }

  const serviceYearsAtGrant = Math.max(1, referenceYear - start.getUTCFullYear());
  const days = attendanceAtLeast80
    ? Math.min(15 + Math.floor((serviceYearsAtGrant - 1) / 2), 25)
    : 0;
  return {
    grantDate: formatDateOnly(grantDate),
    days,
    description: `1월 1일 일괄 배정 참고값: ${days}일`,
  };
}

/**
 * 근로기준법 제60조의 입사일 기준 발생분을 중심으로 계산합니다.
 * 회계연도 기준은 법정 산식이 하나로 정해져 있지 않아 1월 1일 배정 예시와
 * 입사일 기준 법정 최저치를 함께 반환합니다.
 */
export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const start = parseDateOnly(input.startDate);
  const reference = parseDateOnly(input.referenceDate);
  if (!start || !reference || reference < start) {
    return {
      currentGranted: 0,
      currentAvailable: 0,
      historicalGenerated: 0,
      statutoryCurrentAvailable: 0,
      completedYears: 0,
      completedMonths: 0,
      details: [],
      warning: "입사일과 계산 기준일을 확인해 주세요.",
    };
  }

  const statutory = calculateHireDateSchedule(
    start,
    reference,
    input.attendanceAtLeast80,
    input.perfectAttendanceMonths,
  );
  const usedLeave = Math.max(0, input.usedLeave || 0);
  const statutoryCurrentAvailable = Math.max(0, roundToOne(statutory.currentGranted - usedLeave));

  if (input.basis === "hire-date") {
    return {
      currentGranted: statutory.currentGranted,
      currentAvailable: statutoryCurrentAvailable,
      historicalGenerated: statutory.historicalGenerated,
      statutoryCurrentAvailable,
      completedYears: statutory.completedYears,
      completedMonths: statutory.completedMonths,
      details: statutory.details,
      warning: usedLeave > statutory.currentGranted
        ? "입력한 사용 연차가 현재 사용기간의 발생 연차보다 큽니다. 이전 발생분이나 회사 이월 규정을 확인하세요."
        : undefined,
    };
  }

  const fiscalGrant = calculateFiscalYearGrant(start, reference, input.attendanceAtLeast80);
  const currentGranted = fiscalGrant?.days ?? statutory.currentGranted;
  return {
    currentGranted,
    currentAvailable: Math.max(0, roundToOne(currentGranted - usedLeave)),
    historicalGenerated: statutory.historicalGenerated,
    statutoryCurrentAvailable,
    completedYears: statutory.completedYears,
    completedMonths: statutory.completedMonths,
    details: fiscalGrant
      ? [{ ...fiscalGrant, kind: "fiscal" }, ...statutory.details]
      : statutory.details,
    warning: "회계연도 기준은 회사 규정에 따라 비례·이월·정산 방식이 다릅니다. 표시된 1월 1일 배정값은 예시이며, 입사일 기준보다 불리한 차이는 별도 정산해야 할 수 있습니다.",
  };
}

// ==================== 면적 변환 ====================

export const SQUARE_METERS_PER_PYEONG = 400 / 121;
export const SQUARE_METERS_PER_SQUARE_FOOT = 0.09290304;

export type AreaUnit = "pyeong" | "sqm" | "sqft";

export function convertArea(value: number, from: AreaUnit) {
  const squareMeters = from === "sqm"
    ? value
    : from === "pyeong"
      ? value * SQUARE_METERS_PER_PYEONG
      : value * SQUARE_METERS_PER_SQUARE_FOOT;
  return {
    sqm: squareMeters,
    pyeong: squareMeters / SQUARE_METERS_PER_PYEONG,
    sqft: squareMeters / SQUARE_METERS_PER_SQUARE_FOOT,
  };
}

// ==================== GPA 계산 ====================

export function calculateWeightedGpa(rows: Array<{ credits: number; points: number; excluded?: boolean }>) {
  const included = rows.filter((row) => !row.excluded && row.credits > 0);
  const credits = included.reduce((sum, row) => sum + row.credits, 0);
  const qualityPoints = included.reduce((sum, row) => sum + row.credits * row.points, 0);
  return { credits, qualityPoints, gpa: credits > 0 ? qualityPoints / credits : 0 };
}

export function calculateRequiredGpa(
  currentGpa: number,
  completedCredits: number,
  targetGpa: number,
  remainingCredits: number,
) {
  if (remainingCredits <= 0) return null;
  return (targetGpa * (completedCredits + remainingCredits) - currentGpa * completedCredits) / remainingCredits;
}

// ==================== 적금 이자 계산기 ====================

export type SavingsType = "simple" | "compound";

export interface SavingsResult {
  monthlyDeposit: number;
  totalDeposit: number;
  totalInterest: number;
  taxAmount: number;
  netInterest: number;
  totalAmount: number;
}

export function calculateSavings(
  monthlyDeposit: number,
  annualRate: number,
  months: number,
  type: SavingsType,
  taxRate: number = 15.4
): SavingsResult {
  const totalDeposit = monthlyDeposit * months;
  let totalInterest = 0;
  const monthlyRate = annualRate / 100 / 12;

  if (type === "simple") {
    // 단리: 매월 납입금에 대해 남은 개월 수만큼 이자
    for (let i = 1; i <= months; i++) {
      totalInterest += monthlyDeposit * (annualRate / 100) * ((months - i + 1) / 12);
    }
  } else {
    // 복리: 매월 복리 계산
    let balance = 0;
    for (let i = 1; i <= months; i++) {
      balance = (balance + monthlyDeposit) * (1 + monthlyRate);
    }
    totalInterest = balance - totalDeposit;
  }

  totalInterest = Math.round(totalInterest);
  const taxAmount = Math.round(totalInterest * (taxRate / 100));
  const netInterest = totalInterest - taxAmount;
  const totalAmount = totalDeposit + netInterest;

  return { monthlyDeposit, totalDeposit, totalInterest, taxAmount, netInterest, totalAmount };
}

// ==================== 전월세 전환 계산기 ====================

export interface RentConversionResult {
  monthlyRent: number;
  deposit: number;
  conversionRate: number;
}

export function convertJeonseToMonthly(
  jeonseDeposit: number,
  newDeposit: number,
  conversionRate: number
): RentConversionResult {
  const diff = jeonseDeposit - newDeposit;
  const monthlyRent = Math.round((diff * (conversionRate / 100)) / 12);
  return { monthlyRent, deposit: newDeposit, conversionRate };
}

export function convertMonthlyToJeonse(
  currentDeposit: number,
  monthlyRent: number,
  conversionRate: number
): RentConversionResult {
  const additionalDeposit = Math.round((monthlyRent * 12) / (conversionRate / 100));
  const deposit = currentDeposit + additionalDeposit;
  return { monthlyRent: 0, deposit, conversionRate };
}

// ==================== 날짜 계산기 (D-day) ====================

export interface DdayResult {
  targetDate: Date;
  today: Date;
  diffDays: number;
  diffWeeks: number;
  diffMonths: number;
  diffYears: number;
  isPast: boolean;
}

export function calculateDday(targetDate: Date, today: Date): DdayResult {
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isPast = diffDays < 0;
  const absDays = Math.abs(diffDays);

  return {
    targetDate,
    today,
    diffDays,
    diffWeeks: Math.floor(absDays / 7),
    diffMonths: Math.floor(absDays / 30),
    diffYears: Math.floor(absDays / 365),
    isPast,
  };
}

export interface DateDiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function calculateDateDiff(startDate: Date, endDate: Date): DateDiffResult {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return {
    years: Math.floor(totalDays / 365),
    months: Math.floor((totalDays % 365) / 30),
    days: totalDays % 30,
    totalDays,
  };
}

// ==================== 음주 측정기 ====================

export interface AlcoholResult {
  bac: number;           // 혈중알코올농도 (%)
  status: string;
  color: string;
  soberHours: number;    // 분해 예상 시간
  canDrive: boolean;
}

export function calculateBAC(
  gender: "male" | "female",
  weightKg: number,
  drinks: { type: string; volume: number; percent: number; count: number }[],
  hoursSinceDrinking: number
): AlcoholResult {
  // Widmark 공식
  const genderConstant = gender === "male" ? 0.68 : 0.55;

  // 총 알코올 섭취량 (g)
  let totalAlcohol = 0;
  for (const drink of drinks) {
    totalAlcohol += drink.volume * (drink.percent / 100) * 0.7894 * drink.count;
  }

  // BAC = (알코올g / (체중kg × 성별계수)) - (시간 × 0.015)
  let bac = (totalAlcohol / (weightKg * genderConstant * 10)) - (hoursSinceDrinking * 0.015);
  bac = Math.max(0, Math.round(bac * 1000) / 1000);

  const soberHours = bac > 0 ? Math.ceil(bac / 0.015) : 0;
  const canDrive = bac < 0.03;

  let status: string;
  let color: string;
  if (bac === 0) {
    status = "정상"; color = "text-green-500";
  } else if (bac < 0.03) {
    status = "정상 (운전 가능)"; color = "text-green-500";
  } else if (bac < 0.08) {
    status = "면허정지 수준"; color = "text-yellow-500";
  } else if (bac < 0.2) {
    status = "면허취소 수준"; color = "text-orange-500";
  } else {
    status = "위험 수준"; color = "text-red-500";
  }

  return { bac, status, color, soberHours, canDrive };
}

// ==================== 나이 계산기 ====================

export interface AgeResult {
  koreanAge: number;
  internationalAge: number;
  birthDate: Date;
  nextBirthday: Date;
  daysUntilBirthday: number;
}

export function calculateAge(birthDate: Date, today: Date): AgeResult {
  const koreanAge = today.getFullYear() - birthDate.getFullYear() + 1;

  let internationalAge = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    internationalAge--;
  }

  // 다음 생일
  const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday <= today) {
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
  }
  const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return { koreanAge, internationalAge, birthDate, nextBirthday, daysUntilBirthday };
}

// ==================== 실업급여 계산기 ====================

export interface UnemploymentResult {
  dailyAmount: number;
  monthlyAmount: number;
  totalDays: number;
  totalAmount: number;
  durationMonths: number;
}

export function calculateUnemployment(
  age: number,
  workedYears: number,
  avgMonthlyPay: number
): UnemploymentResult {
  // 1일 평균임금의 60%
  const dailyWage = Math.round(avgMonthlyPay / 30);
  let dailyAmount = Math.round(dailyWage * 0.6);

  // 2026-07-01 이후: 상한 68,100원 / 하한: 최저임금의 80% × 8시간
  const lowerLimit = Math.round(10_320 * 0.8 * 8);
  dailyAmount = Math.min(68_100, Math.max(lowerLimit, dailyAmount));

  // 소정급여일수 (나이 + 근속연수 기준)
  let totalDays: number;
  const isOver50 = age >= 50;

  if (workedYears < 1) {
    totalDays = 120;
  } else if (workedYears < 3) {
    totalDays = isOver50 ? 180 : 150;
  } else if (workedYears < 5) {
    totalDays = isOver50 ? 210 : 180;
  } else if (workedYears < 10) {
    totalDays = isOver50 ? 240 : 210;
  } else {
    totalDays = isOver50 ? 270 : 240;
  }

  const totalAmount = dailyAmount * totalDays;
  const monthlyAmount = dailyAmount * 30;
  const durationMonths = Math.round(totalDays / 30);

  return { dailyAmount, monthlyAmount, totalDays, totalAmount, durationMonths };
}
