"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

// 주수별 태아 크기 정보 (과일 비유)
const fetalSizeByWeek: Record<number, { size: string; fruit: string }> = {
  4: { size: "0.1cm (양귀비 씨앗)", fruit: "양귀비 씨앗" },
  5: { size: "0.2cm (참깨)", fruit: "참깨" },
  6: { size: "0.5cm (렌즈콩)", fruit: "렌즈콩" },
  7: { size: "1cm (블루베리)", fruit: "블루베리" },
  8: { size: "1.6cm (강낭콩)", fruit: "강낭콩" },
  9: { size: "2.3cm (포도알)", fruit: "포도알" },
  10: { size: "3.1cm (대추)", fruit: "대추" },
  11: { size: "4.1cm (무화과)", fruit: "무화과" },
  12: { size: "5.4cm (라임)", fruit: "라임" },
  13: { size: "7.4cm (레몬)", fruit: "레몬" },
  14: { size: "8.7cm (복숭아)", fruit: "복숭아" },
  15: { size: "10.1cm (사과)", fruit: "사과" },
  16: { size: "11.6cm (아보카도)", fruit: "아보카도" },
  17: { size: "13cm (배)", fruit: "배" },
  18: { size: "14.2cm (고구마)", fruit: "고구마" },
  19: { size: "15.3cm (망고)", fruit: "망고" },
  20: { size: "16.4cm (바나나)", fruit: "바나나" },
  21: { size: "26.7cm (당근)", fruit: "당근" },
  22: { size: "27.8cm (파파야)", fruit: "파파야" },
  23: { size: "28.9cm (자몽)", fruit: "자몽" },
  24: { size: "30cm (옥수수)", fruit: "옥수수" },
  25: { size: "34.6cm (참외)", fruit: "참외" },
  26: { size: "35.6cm (브로콜리)", fruit: "브로콜리" },
  27: { size: "36.6cm (컬리플라워)", fruit: "컬리플라워" },
  28: { size: "37.6cm (가지)", fruit: "가지" },
  29: { size: "38.6cm (호박)", fruit: "호박" },
  30: { size: "39.9cm (양배추)", fruit: "양배추" },
  31: { size: "41.1cm (코코넛)", fruit: "코코넛" },
  32: { size: "42.4cm (멜론)", fruit: "멜론" },
  33: { size: "43.7cm (파인애플)", fruit: "파인애플" },
  34: { size: "45cm (칸탈루프)", fruit: "칸탈루프" },
  35: { size: "46.2cm (꿀참외)", fruit: "꿀참외" },
  36: { size: "47.4cm (로메인상추)", fruit: "로메인상추" },
  37: { size: "48.6cm (겨울호박)", fruit: "겨울호박" },
  38: { size: "49.8cm (대파)", fruit: "대파" },
  39: { size: "50.7cm (작은 수박)", fruit: "작은 수박" },
  40: { size: "51.2cm (수박)", fruit: "수박" },
};

// 주요 검사 일정
const milestones = [
  { week: 5, label: "임신 확인", desc: "소변검사·혈액검사로 임신 확인", color: "bg-pink-500" },
  { week: 8, label: "첫 초음파", desc: "태아 심박동 확인, 임신 주수 확정", color: "bg-purple-500" },
  { week: 12, label: "기형아 검사 (1차)", desc: "목덜미 투명대 검사 (NT), 1차 통합선별검사", color: "bg-blue-500" },
  { week: 16, label: "기형아 검사 (2차)", desc: "2차 통합선별검사 (쿼드 검사)", color: "bg-blue-500" },
  { week: 20, label: "정밀 초음파", desc: "태아 구조 정밀 초음파 (20~24주)", color: "bg-indigo-500" },
  { week: 24, label: "임신성 당뇨 검사", desc: "경구 포도당 부하검사 (24~28주)", color: "bg-green-500" },
  { week: 28, label: "3차 접종/검사", desc: "빈혈·항체 검사, Rh- 면역글로불린", color: "bg-yellow-500" },
  { week: 32, label: "태동 검사", desc: "비수축 검사(NST) 시작", color: "bg-orange-500" },
  { week: 37, label: "만삭", desc: "만삭! 출산 준비 완료", color: "bg-red-500" },
];

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}년 ${m}월 ${d}일`;
}

function formatDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDayOfWeek(date: Date): string {
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

interface DueDateResult {
  dueDate: Date;
  currentWeeks: number;
  currentDays: number;
  totalDaysPregnant: number;
  daysRemaining: number;
  trimester: 1 | 2 | 3;
  progressPercent: number;
  milestoneSchedule: { week: number; label: string; desc: string; date: Date; color: string; passed: boolean }[];
  fetalSize: { size: string; fruit: string } | null;
}

function calculateDueDate(lmpDate: Date, cycleLength: number): DueDateResult {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 출산 예정일 = LMP + 280일 + (cycleLength - 28)일
  const adjustment = cycleLength - 28;
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280 + adjustment);

  // 현재 임신 일수 (LMP 기준)
  const totalDaysPregnant = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const currentWeeks = Math.floor(totalDaysPregnant / 7);
  const currentDays = totalDaysPregnant % 7;

  // 남은 일수
  const daysRemaining = Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // 삼분기 계산
  let trimester: 1 | 2 | 3 = 1;
  if (currentWeeks >= 28) trimester = 3;
  else if (currentWeeks >= 14) trimester = 2;

  // 진행률 (280일 기준)
  const totalDays = 280 + adjustment;
  const progressPercent = Math.min(100, Math.max(0, (totalDaysPregnant / totalDays) * 100));

  // 마일스톤 일정
  const milestoneSchedule = milestones.map((m) => {
    const date = new Date(lmpDate);
    date.setDate(date.getDate() + m.week * 7 + adjustment);
    return {
      ...m,
      date,
      passed: today >= date,
    };
  });

  // 태아 크기
  const fetalSize = fetalSizeByWeek[Math.min(currentWeeks, 40)] || null;

  return {
    dueDate,
    currentWeeks,
    currentDays,
    totalDaysPregnant,
    daysRemaining,
    trimester,
    progressPercent,
    milestoneSchedule,
    fetalSize,
  };
}

export default function DueDateCalculator() {
  const [lmpStr, setLmpStr] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo<DueDateResult | null>(() => {
    if (!lmpStr) return null;
    const lmpDate = new Date(lmpStr);
    if (isNaN(lmpDate.getTime())) return null;
    lmpDate.setHours(0, 0, 0, 0);

    // LMP must be in the past and within ~42 weeks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lmpDate > today) return null;
    const daysDiff = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 300) return null;

    return calculateDueDate(lmpDate, cycleLength);
  }, [lmpStr, cycleLength]);

  const trimesterLabel = (t: 1 | 2 | 3) => {
    switch (t) {
      case 1: return "1분기 (초기)";
      case 2: return "2분기 (중기)";
      case 3: return "3분기 (후기)";
    }
  };

  const trimesterColor = (t: 1 | 2 | 3) => {
    switch (t) {
      case 1: return "text-pink-600";
      case 2: return "text-purple-600";
      case 3: return "text-blue-600";
    }
  };

  const trimesterBg = (t: 1 | 2 | 3) => {
    switch (t) {
      case 1: return "bg-pink-500";
      case 2: return "bg-purple-500";
      case 3: return "bg-blue-500";
    }
  };

  const faqs = [
    {
      q: "출산 예정일은 정확한가요?",
      a: "출산 예정일은 통계적 예측값으로, 실제로 예정일에 출산하는 경우는 약 5%입니다. 대부분 예정일 전후 2주 이내(38~42주)에 출산하며, 이 범위 안이면 정상 분만으로 봅니다.",
    },
    {
      q: "네겔레 공식이란 무엇인가요?",
      a: "네겔레 공식(Naegele's rule)은 마지막 생리 시작일(LMP)에 280일(40주)을 더해 출산 예정일을 계산하는 방법입니다. 19세기 독일 산부인과 의사 프란츠 네겔레가 고안한 공식으로, 현재까지 가장 널리 사용됩니다.",
    },
    {
      q: "생리 주기가 불규칙하면 어떻게 하나요?",
      a: "생리 주기가 불규칙한 경우 LMP 기반 계산이 부정확할 수 있습니다. 이 경우 초음파 검사를 통해 태아의 크기로 임신 주수를 확정하는 것이 더 정확합니다. 보통 8~12주 초음파가 가장 정확합니다.",
    },
    {
      q: "임신 주수와 태아 나이는 다른 건가요?",
      a: "네, 임신 주수는 마지막 생리 시작일부터 계산하므로 실제 수정(배란)일보다 약 2주 앞서 있습니다. 즉, '임신 6주'라고 하면 실제 태아 나이는 약 4주입니다.",
    },
    {
      q: "삼분기(Trimester)는 어떻게 나뉘나요?",
      a: "1분기(1~13주): 주요 장기가 형성되는 시기. 입덧이 심할 수 있습니다. 2분기(14~27주): 안정기로 접어들며, 태동을 느끼기 시작합니다. 3분기(28~40주): 태아가 빠르게 성장하며, 출산을 준비하는 시기입니다.",
    },
  ];

  return (
    <div className="py-6">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          출산 예정일 계산기
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          마지막 생리 시작일로 출산 예정일과 현재 임신 주수를 계산합니다.
        </p>
      </div>

      {/* 입력 영역 */}
      <div className="calc-card p-6 mb-6">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              마지막 생리 시작일 (LMP)
            </label>
            <input
              type="date"
              value={lmpStr}
              onChange={(e) => setLmpStr(e.target.value)}
              max={formatDateInput(new Date())}
              className="calc-input calc-input-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              평균 생리 주기
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={21}
                max={35}
                value={cycleLength}
                onChange={(e) => setCycleLength(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-lg font-bold text-blue-600 min-w-[4rem] text-center tabular-nums">
                {cycleLength}일
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">일반적인 주기: 21~35일 (기본값: 28일)</p>
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <>
          {/* 출산 예정일 하이라이트 */}
          <div className="calc-card overflow-hidden mb-6 animate-fade-in">
            <div className="calc-result-header">
              <p className="text-blue-200 text-sm mb-1 relative z-10">출산 예정일</p>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight relative z-10">
                {formatDate(result.dueDate)}
              </p>
              <p className="text-blue-200/80 text-sm mt-1 relative z-10">
                ({getDayOfWeek(result.dueDate)}요일)
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* 핵심 정보 카드 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-pink-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-pink-500 font-medium mb-1">현재 임신 주수</p>
                  <p className="text-2xl font-extrabold text-pink-700">
                    {result.currentWeeks}<span className="text-base font-bold">주</span>{" "}
                    {result.currentDays}<span className="text-base font-bold">일</span>
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-500 font-medium mb-1">출산까지 남은 일</p>
                  <p className="text-2xl font-extrabold text-blue-700">
                    {result.daysRemaining > 0 ? (
                      <>D-{result.daysRemaining}</>
                    ) : result.daysRemaining === 0 ? (
                      <>D-Day</>
                    ) : (
                      <>D+{Math.abs(result.daysRemaining)}</>
                    )}
                  </p>
                </div>
              </div>

              {/* 삼분기 & 진행률 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${trimesterColor(result.trimester)}`}>
                    {trimesterLabel(result.trimester)}
                  </span>
                  <span className="text-xs text-gray-400 tabular-nums">
                    {result.progressPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="relative h-full rounded-full overflow-hidden bg-gray-100">
                    {/* 삼분기 구간 표시 */}
                    <div className="absolute inset-0 flex">
                      <div className="w-[35%] bg-pink-100 border-r border-white" />
                      <div className="w-[35%] bg-purple-100 border-r border-white" />
                      <div className="w-[30%] bg-blue-100" />
                    </div>
                    {/* 진행 바 */}
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${trimesterBg(result.trimester)}`}
                      style={{ width: `${result.progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>1분기</span>
                  <span>2분기</span>
                  <span>3분기</span>
                </div>
              </div>

              {/* 태아 크기 */}
              {result.fetalSize && result.currentWeeks >= 4 && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <p className="text-xs text-amber-600 font-medium mb-1">
                    {result.currentWeeks}주차 태아 크기
                  </p>
                  <p className="text-sm text-amber-800 font-bold">
                    {result.fetalSize.size}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    약 {result.fetalSize.fruit} 크기
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 주요 검사 일정 타임라인 */}
          <div className="calc-card p-6 mb-6 animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-5 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full" />
              주요 검사 일정
            </h3>
            <div className="relative">
              {/* 타임라인 세로선 */}
              <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
              <div className="space-y-4">
                {result.milestoneSchedule.map((m, i) => (
                  <div key={i} className="relative flex items-start gap-4 pl-6">
                    {/* 점 */}
                    <div
                      className={`absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white ${
                        m.passed ? m.color : "bg-gray-300"
                      } shadow-sm`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-sm font-bold ${m.passed ? "text-gray-900" : "text-gray-500"}`}>
                          {m.label}
                        </span>
                        <span className="text-xs text-gray-400">({m.week}주)</span>
                        {m.passed && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                            완료
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatDate(m.date)} ({getDayOfWeek(m.date)})
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 주수별 태아 크기 표 */}
          <div className="calc-card p-6 mb-6 animate-fade-in">
            <h3 className="font-bold text-gray-900 mb-4 text-sm flex items-center gap-2">
              <span className="w-1 h-4 bg-amber-500 rounded-full" />
              주수별 태아 크기
            </h3>
            <div className="overflow-x-auto -mx-2">
              <table className="calc-table">
                <thead>
                  <tr>
                    <th>주수</th>
                    <th>크기</th>
                    <th>비유</th>
                  </tr>
                </thead>
                <tbody>
                  {[8, 12, 16, 20, 24, 28, 32, 36, 40].map((w) => {
                    const info = fetalSizeByWeek[w];
                    const isCurrent = result.currentWeeks === w;
                    return (
                      <tr key={w} className={isCurrent ? "bg-blue-50" : ""}>
                        <td className={`font-medium ${isCurrent ? "text-blue-600" : ""}`}>
                          {w}주 {isCurrent && <span className="text-[10px]">(현재)</span>}
                        </td>
                        <td className="text-gray-600">{info.size.split("(")[0].trim()}</td>
                        <td className="text-gray-600">{info.fruit}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">출산 예정일 계산법</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            출산 예정일은 마지막 생리 시작일(LMP)을 기준으로 280일(40주)을 더하여 계산합니다.
            이를 <strong>네겔레 공식(Naegele&apos;s Rule)</strong>이라고 하며, 전 세계 산부인과에서
            가장 널리 사용하는 방법입니다. 이 공식은 생리 주기가 28일인 경우를 기본으로 하며,
            주기가 다르면 그 차이만큼 조정합니다. 예를 들어 생리 주기가 30일이면 예정일이 2일
            뒤로, 26일이면 2일 앞으로 조정됩니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">네겔레 공식 계산 방법</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            네겔레 공식은 간단한 수식으로도 계산할 수 있습니다:
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
            <p className="font-medium text-gray-800">1. 마지막 생리 시작일의 월에서 3을 뺍니다.</p>
            <p className="font-medium text-gray-800">2. 일(날짜)에 7을 더합니다.</p>
            <p className="font-medium text-gray-800">3. 필요시 연도에 1을 더합니다.</p>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <p className="text-gray-600">
                <strong>예시:</strong> LMP가 2025년 3월 15일인 경우<br />
                → 3월 - 3 = 12월 (전년도), 15일 + 7 = 22일<br />
                → 출산 예정일: 2025년 12월 22일
              </p>
            </div>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">임신 삼분기(Trimester) 안내</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>구분</th>
                  <th>기간</th>
                  <th>주요 특징</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium text-pink-600">1분기 (초기)</td>
                  <td>1~13주</td>
                  <td>주요 장기 형성, 입덧, 피로감</td>
                </tr>
                <tr>
                  <td className="font-medium text-purple-600">2분기 (중기)</td>
                  <td>14~27주</td>
                  <td>안정기, 태동 시작, 성별 확인 가능</td>
                </tr>
                <tr>
                  <td className="font-medium text-blue-600">3분기 (후기)</td>
                  <td>28~40주</td>
                  <td>급격한 성장, 출산 준비</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">임신 중 주요 검사 일정</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="calc-table">
              <thead>
                <tr>
                  <th>시기</th>
                  <th>검사명</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-medium">5주</td>
                  <td>임신 확인</td>
                  <td>소변/혈액 검사</td>
                </tr>
                <tr>
                  <td className="font-medium">8주</td>
                  <td>첫 초음파</td>
                  <td>심박동 확인, 주수 확정</td>
                </tr>
                <tr>
                  <td className="font-medium">11~13주</td>
                  <td>1차 기형아 검사</td>
                  <td>NT 검사 (목덜미 투명대)</td>
                </tr>
                <tr>
                  <td className="font-medium">15~18주</td>
                  <td>2차 기형아 검사</td>
                  <td>쿼드 검사</td>
                </tr>
                <tr>
                  <td className="font-medium">20~24주</td>
                  <td>정밀 초음파</td>
                  <td>태아 구조 정밀 검사</td>
                </tr>
                <tr>
                  <td className="font-medium">24~28주</td>
                  <td>임신성 당뇨 검사</td>
                  <td>경구 포도당 부하검사</td>
                </tr>
                <tr>
                  <td className="font-medium">37주~</td>
                  <td>만삭 검진</td>
                  <td>NST, 출산 준비 상태 확인</td>
                </tr>
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

      <RelatedTools current="due-date" />
    </div>
  );
}
