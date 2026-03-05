"use client";

import { useState, useEffect } from "react";
import RelatedTools from "@/components/RelatedTools";

const 천간 = ["갑", "을", "병", "정", "무", "기", "경", "신", "임", "계"];
const 천간한자 = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const 지지 = ["자", "축", "인", "묘", "진", "사", "오", "미", "신", "유", "술", "해"];
const 지지한자 = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const 천간오행: Record<string, string> = {
  갑: "목", 을: "목", 병: "화", 정: "화", 무: "토", 기: "토", 경: "금", 신: "금", 임: "수", 계: "수",
};
const 지지오행: Record<string, string> = {
  자: "수", 축: "토", 인: "목", 묘: "목", 진: "토", 사: "화", 오: "화", 미: "토", 신: "금", 유: "금", 술: "토", 해: "수",
};
function get오행(char: string, type: "천간" | "지지"): string {
  return type === "천간" ? (천간오행[char] || "토") : (지지오행[char] || "토");
}

const 오행색상: Record<string, string> = {
  목: "bg-green-500", 화: "bg-red-500", 토: "bg-yellow-500", 금: "bg-gray-400", 수: "bg-blue-500",
};

const 오행텍스트색상: Record<string, string> = {
  목: "text-green-600", 화: "text-red-600", 토: "text-yellow-600", 금: "text-gray-500", 수: "text-blue-600",
};

const 시진목록 = [
  { label: "자시 (23:00~01:00)", value: 0 },
  { label: "축시 (01:00~03:00)", value: 1 },
  { label: "인시 (03:00~05:00)", value: 2 },
  { label: "묘시 (05:00~07:00)", value: 3 },
  { label: "진시 (07:00~09:00)", value: 4 },
  { label: "사시 (09:00~11:00)", value: 5 },
  { label: "오시 (11:00~13:00)", value: 6 },
  { label: "미시 (13:00~15:00)", value: 7 },
  { label: "신시 (15:00~17:00)", value: 8 },
  { label: "유시 (17:00~19:00)", value: 9 },
  { label: "술시 (19:00~21:00)", value: 10 },
  { label: "해시 (21:00~23:00)", value: 11 },
  { label: "모름", value: -1 },
];

// 월주 천간 계산: 년간 인덱스에 따른 1월(인월)의 천간 시작
// 갑/기년 → 병인월(2), 을/경년 → 무인월(4), 병/신년 → 경인월(6), 정/임년 → 임인월(8), 무/계년 → 갑인월(0)
const 월간시작 = [2, 4, 6, 8, 0]; // 년간%5 인덱스

// 시주 천간 계산: 일간에 따른 자시의 천간 시작
// 갑/기일 → 갑자시(0), 을/경일 → 병자시(2), 병/신일 → 무자시(4), 정/임일 → 경자시(6), 무/계일 → 임자시(8)
const 시간시작 = [0, 2, 4, 6, 8]; // 일간%5 인덱스

// 정확한 일주 계산: 기준일(1900-01-01 = 경자일, 천간6 지지0)에서 날짜 차이로 계산
function getDaysSinceReference(year: number, month: number, day: number): number {
  const ref = new Date(1900, 0, 1); // 1900년 1월 1일
  const target = new Date(year, month - 1, day);
  return Math.floor((target.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24));
}

const 일간성격: Record<string, string> = {
  갑: "큰 나무처럼 곧고 당당한 성격입니다. 리더십이 강하고 정의감이 넘칩니다. 새로운 것을 개척하는 힘이 있으며, 한번 결심하면 끝까지 밀고 나가는 추진력을 가지고 있습니다.",
  을: "덩굴이나 풀처럼 유연하고 적응력이 뛰어납니다. 부드러운 외모와 달리 내면은 강인합니다. 예술적 감각이 뛰어나고 사람들과의 관계에서 조화를 잘 이룹니다.",
  병: "태양처럼 밝고 따뜻한 성격입니다. 활발하고 에너지가 넘치며 주변 사람들에게 희망을 줍니다. 다소 급한 면이 있지만 넓은 포용력으로 많은 사람에게 사랑받습니다.",
  정: "촛불처럼 은은하고 섬세한 성격입니다. 감성이 풍부하고 배려심이 깊습니다. 내면의 열정은 강하지만 겉으로는 차분하게 표현하며, 학문이나 예술에 재능이 있습니다.",
  무: "큰 산처럼 듬직하고 신뢰감을 주는 성격입니다. 중심을 잘 잡고 묵묵히 자신의 길을 걸어갑니다. 포용력이 넓고 의리가 있어 주변에 많은 사람이 모입니다.",
  기: "논밭처럼 만물을 품어주는 따뜻한 성격입니다. 실용적이고 현실적이며 꼼꼼합니다. 겉으로는 평범해 보이지만 내면에 깊은 지혜를 품고 있으며 참을성이 강합니다.",
  경: "강철처럼 단단하고 결단력 있는 성격입니다. 원칙을 중시하고 불의에 타협하지 않습니다. 냉철한 판단력과 추진력이 뛰어나며 한번 맡은 일은 반드시 완수합니다.",
  신: "보석처럼 세련되고 완벽을 추구하는 성격입니다. 미적 감각이 뛰어나고 디테일에 강합니다. 까다로운 면이 있지만 자기 분야에서 전문성을 발휘하는 능력이 탁월합니다.",
  임: "넓은 바다처럼 포용력이 크고 지혜로운 성격입니다. 자유로운 영혼으로 새로운 도전을 즐깁니다. 상상력과 직관이 뛰어나며, 어떤 환경에서든 적응하는 유연함을 지녔습니다.",
  계: "이슬이나 빗물처럼 맑고 순수한 성격입니다. 감수성이 풍부하고 직관력이 뛰어납니다. 조용하지만 깊이 있는 생각을 하며, 작은 것에서도 진리를 발견하는 통찰력이 있습니다.",
};

interface SajuResult {
  년간: number; 년지: number;
  월간: number; 월지: number;
  일간: number; 일지: number;
  시간: number; 시지: number;
  오행비율: Record<string, number>;
}

function calculateSaju(year: number, month: number, day: number, hour: number): SajuResult {
  // 년주
  const 년간 = (year - 4) % 10;
  const 년지 = (year - 4) % 12;

  // 월주
  const 월간시작값 = 월간시작[년간 % 5];
  const 월간 = (월간시작값 + (month - 1)) % 10;
  const 월지 = (month + 1) % 12; // 인=2 for 1월

  // 일주 (만세력 기준 정확 계산: 1900-01-01 = 경자일, 천간6 지지0)
  const daysDiff = getDaysSinceReference(year, month, day);
  const 일간 = ((daysDiff % 10) + 6) % 10; // 경(6)부터 시작
  const 일지 = ((daysDiff % 12) + 0) % 12; // 자(0)부터 시작

  // 시주
  let 시간idx = 0;
  let 시지idx = 0;
  if (hour >= 0) {
    시지idx = hour; // 시진 인덱스 직접 사용
    const 시간시작값 = 시간시작[일간 % 5];
    시간idx = (시간시작값 + hour) % 10;
  } else {
    // 모름인 경우 - 기본값
    시간idx = 0;
    시지idx = 0;
  }

  // 오행 비율
  const pairs: Array<{ char: string; type: "천간" | "지지" }> = [
    { char: 천간[년간], type: "천간" }, { char: 지지[년지], type: "지지" },
    { char: 천간[월간], type: "천간" }, { char: 지지[월지], type: "지지" },
    { char: 천간[일간], type: "천간" }, { char: 지지[일지], type: "지지" },
  ];
  if (hour >= 0) {
    pairs.push({ char: 천간[시간idx], type: "천간" }, { char: 지지[시지idx], type: "지지" });
  }

  const 오행비율: Record<string, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  pairs.forEach((p) => {
    const oh = get오행(p.char, p.type);
    if (oh) 오행비율[oh]++;
  });

  return {
    년간, 년지, 월간, 월지, 일간, 일지,
    시간: 시간idx, 시지: 시지idx,
    오행비율,
  };
}

export default function SajuCalculator() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [hour, setHour] = useState(-1);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [copied, setCopied] = useState(false);

  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 선택된 일이 해당 월의 최대일을 초과하면 조정
  useEffect(() => {
    if (day > daysInMonth) {
      setDay(daysInMonth);
    }
  }, [day, daysInMonth]);

  const handleCalculate = () => {
    setResult(calculateSaju(year, month, day, hour));
  };

  const handleReset = () => {
    setYear(1990);
    setMonth(1);
    setDay(1);
    setHour(-1);
    setResult(null);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    const pillars = [
      `년주: ${천간한자[result.년간]}${지지한자[result.년지]}`,
      `월주: ${천간한자[result.월간]}${지지한자[result.월지]}`,
      `일주: ${천간한자[result.일간]}${지지한자[result.일지]}`,
    ];
    if (hour >= 0) {
      pillars.push(`시주: ${천간한자[result.시간]}${지지한자[result.시지]}`);
    }
    const ohText = (["목", "화", "토", "금", "수"] as const).map((oh) => `${oh}: ${result.오행비율[oh]}개`).join(", ");
    const text = `[사주팔자] ${year}년 ${month}월 ${day}일\n${pillars.join(" / ")}\n오행: ${ohText}\n일간: ${천간한자[result.일간]} ${천간[result.일간]}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const totalOh = result ? Object.values(result.오행비율).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">사주팔자 계산기</h1>
      <p className="text-gray-500 mb-8">
        생년월일과 태어난 시간을 입력하면 사주팔자와 오행 분석 결과를 확인할 수 있습니다.
      </p>

      {/* 입력 영역 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">출생년도</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">월</label>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {months.map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">일</label>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {days.map((d) => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">태어난 시간</label>
            <select
              value={hour}
              onChange={(e) => setHour(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {시진목록.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCalculate}
            className="flex-1 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            사주 보기
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            초기화
          </button>
        </div>
      </div>

      {/* 결과 영역 */}
      {result && (
        <div className="space-y-6">
          {/* 사주 팔자 카드 */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-gray-900">나의 사주팔자</h2>
              <button
                onClick={handleCopy}
                className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-gray-500"
              >
                {copied ? "복사됨!" : "복사"}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "시주", 간: result.시간, 지: result.시지, show: hour >= 0 },
                { label: "일주", 간: result.일간, 지: result.일지, show: true },
                { label: "월주", 간: result.월간, 지: result.월지, show: true },
                { label: "년주", 간: result.년간, 지: result.년지, show: true },
              ].map((col) => (
                <div key={col.label} className="text-center">
                  <div className="text-xs text-gray-500 mb-2">{col.label}</div>
                  {col.show ? (
                    <div className="bg-white rounded-lg border border-purple-200 p-3 space-y-2">
                      <div>
                        <div className={`text-2xl font-bold ${오행텍스트색상[get오행(천간[col.간], "천간")]}`}>
                          {천간한자[col.간]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {천간[col.간]} ({get오행(천간[col.간], "천간")})
                        </div>
                      </div>
                      <div className="border-t border-gray-100 pt-2">
                        <div className={`text-2xl font-bold ${오행텍스트색상[get오행(지지[col.지], "지지")]}`}>
                          {지지한자[col.지]}
                        </div>
                        <div className="text-xs text-gray-500">
                          {지지[col.지]} ({get오행(지지[col.지], "지지")})
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg border border-dashed border-gray-300 p-3 space-y-2">
                      <div className="text-2xl text-gray-300">?</div>
                      <div className="border-t border-gray-100 pt-2">
                        <div className="text-2xl text-gray-300">?</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 오행 비율 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">오행 분석</h2>
            <div className="space-y-3">
              {(["목", "화", "토", "금", "수"] as const).map((oh) => {
                const count = result.오행비율[oh];
                const pct = totalOh > 0 ? (count / totalOh) * 100 : 0;
                const labels: Record<string, string> = {
                  목: "木 목 (나무)", 화: "火 화 (불)", 토: "土 토 (흙)", 금: "金 금 (쇠)", 수: "水 수 (물)",
                };
                return (
                  <div key={oh}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{labels[oh]}</span>
                      <span className="text-gray-500">{count}개 ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4">
                      <div
                        className={`${오행색상[oh]} h-4 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 일간 성격 분석 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              일간 성격 분석 - {천간한자[result.일간]} {천간[result.일간]}일간
            </h2>
            <p className="text-gray-600 leading-relaxed">{일간성격[천간[result.일간]]}</p>
          </div>

          {/* 오행 과다/부족 분석 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">오행 균형 분석</h2>
            <div className="space-y-3">
              {(["목", "화", "토", "금", "수"] as const).map((oh) => {
                const count = result.오행비율[oh];
                const avg = totalOh / 5;
                let status = "";
                let color = "";
                if (count === 0) { status = "부재 - 보완이 필요합니다"; color = "text-red-600"; }
                else if (count <= avg * 0.5) { status = "부족 - 의식적으로 키워보세요"; color = "text-orange-600"; }
                else if (count >= avg * 1.8) { status = "과다 - 조절이 필요합니다"; color = "text-yellow-600"; }
                else { status = "적정 - 균형이 잘 맞습니다"; color = "text-green-600"; }
                const names: Record<string, string> = { 목: "木", 화: "火", 토: "土", 금: "金", 수: "水" };
                return (
                  <div key={oh} className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{names[oh]} {oh}</span>
                    <span className={`text-sm ${color}`}>{status}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 안내 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
            <p className="text-sm text-amber-700">
              본 결과는 양력 기준 만세력 계산을 기반으로 하며, 참고용입니다. 보다 정확한 해석은 전문 역학인 상담을 권장합니다.
            </p>
          </div>
        </div>
      )}

      {/* SEO 콘텐츠 */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">사주팔자란?</h2>
          <p className="text-gray-600 leading-relaxed">
            사주팔자는 태어난 해(년주), 달(월주), 날(일주), 시간(시주)의 네 기둥에
            각각 천간과 지지 두 글자씩 총 8글자로 구성됩니다. 천간은 갑을병정무기경신임계의 10가지,
            지지는 자축인묘진사오미신유술해의 12가지로 이루어져 있으며,
            이들의 조합으로 개인의 타고난 기질과 운명의 흐름을 살펴봅니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">오행이란?</h2>
          <p className="text-gray-600 leading-relaxed">
            오행은 목(나무), 화(불), 토(흙), 금(쇠), 수(물)의 다섯 가지 원소로,
            만물의 변화와 상호작용을 설명하는 동양 철학의 핵심 개념입니다.
            사주에서 오행의 균형은 건강, 성격, 직업 적성 등에 영향을 미친다고 합니다.
          </p>
        </div>
      </section>

      <RelatedTools current="saju" />
    </div>
  );
}
