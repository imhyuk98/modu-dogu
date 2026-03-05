// 2025년 기준 4대보험 요율
const INSURANCE_RATES = {
  nationalPension: 0.045, // 국민연금 4.5%
  healthInsurance: 0.03545, // 건강보험 3.545%
  longTermCare: 0.1295, // 장기요양보험 (건강보험의 12.95%)
  employmentInsurance: 0.009, // 고용보험 0.9%
};

// 국민연금 상한/하한 (월 기준)
const PENSION_UPPER_LIMIT = 5_900_000; // 월 590만원
const PENSION_LOWER_LIMIT = 370_000; // 월 37만원

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

  // 소득세율 (2025년 기준)
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

  // 장기요양보험 (건강보험료의 12.95%)
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

export interface AnnualLeaveResult {
  totalLeave: number;
  usedYears: number;
  usedMonths: number;
  details: { period: string; days: number; description: string }[];
}

export function calculateAnnualLeave(startDate: Date, today: Date): AnnualLeaveResult {
  const details: { period: string; days: number; description: string }[] = [];
  let totalLeave = 0;

  const diffTime = today.getTime() - startDate.getTime();
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const usedYears = Math.floor(totalDays / 365);
  const usedMonths = Math.floor((totalDays % 365) / 30);

  if (totalDays < 0) {
    return { totalLeave: 0, usedYears: 0, usedMonths: 0, details: [] };
  }

  // 1년 미만: 1개월 개근 시 1일씩 (최대 11일)
  if (usedYears < 1) {
    const monthsWorked = Math.min(Math.floor(totalDays / 30), 11);
    totalLeave = monthsWorked;
    details.push({
      period: "입사일 ~ 1년 미만",
      days: monthsWorked,
      description: `1개월 개근 시 1일 (${monthsWorked}개월)`,
    });
  } else {
    // 1년차 월차 (최대 11일)
    details.push({
      period: "1년차 (월차)",
      days: 11,
      description: "1개월 개근 시 1일 × 11개월",
    });
    totalLeave += 11;

    // 1년 이상: 매년 15일 기본 + 2년마다 1일 추가 (최대 25일)
    for (let year = 1; year <= usedYears; year++) {
      const bonus = Math.floor((year - 1) / 2);
      const yearLeave = Math.min(15 + bonus, 25);
      details.push({
        period: `${year + 1}년차`,
        days: yearLeave,
        description: year === 1 ? "기본 15일" : `15일 + 추가 ${bonus}일`,
      });
      totalLeave += yearLeave;
    }
  }

  return { totalLeave, usedYears, usedMonths, details };
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
  const genderConstant = gender === "male" ? 0.7 : 0.6;

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

  // 상한: 66,000원 / 하한: 최저임금의 80% × 1일 소정근로시간(8h)
  const lowerLimit = Math.round(10030 * 0.8 * 8); // 2025 최저임금 기준
  dailyAmount = Math.min(66000, Math.max(lowerLimit, dailyAmount));

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
