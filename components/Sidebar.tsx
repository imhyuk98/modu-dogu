"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const categories = [
  {
    label: "금융 계산기",
    items: [
      { title: "환율 계산기", href: "/calculators/exchange-rate" },
      { title: "연봉 실수령액", href: "/calculators/salary" },
      { title: "대출이자 계산기", href: "/calculators/loan" },
      { title: "예금이자 계산기", href: "/calculators/deposit" },
      { title: "적금 이자 계산기", href: "/calculators/savings" },
      { title: "퇴직금 계산기", href: "/calculators/retirement" },
      { title: "실업급여 계산기", href: "/calculators/unemployment" },
      { title: "주식 수익률 계산기", href: "/calculators/stock-return" },
      { title: "물타기 계산기", href: "/calculators/average-price" },
      { title: "인플레이션 계산기", href: "/calculators/inflation" },
      { title: "전월세 전환", href: "/calculators/rent-conversion" },
      { title: "자동차세 계산기", href: "/calculators/car-tax" },
      { title: "전기요금 계산기", href: "/calculators/electricity" },
      { title: "부가세 계산기", href: "/calculators/vat" },
      { title: "로또 세금 계산기", href: "/calculators/lotto-tax" },
    ],
  },
  {
    label: "부동산",
    items: [
      { title: "중개수수료 계산기", href: "/calculators/brokerage-fee" },
      { title: "취득세 계산기", href: "/calculators/acquisition-tax" },
      { title: "양도소득세 계산기", href: "/calculators/capital-gains-tax" },
      { title: "증여세 계산기", href: "/calculators/gift-tax" },
      { title: "상속세 계산기", href: "/calculators/inheritance-tax" },
    ],
  },
  {
    label: "생활 계산기",
    items: [
      { title: "퍼센트 계산기", href: "/calculators/percent" },
      { title: "글자수 세기", href: "/calculators/character-count" },
      { title: "나이 계산기", href: "/calculators/age" },
      { title: "날짜 계산기", href: "/calculators/dday" },
      { title: "평수 계산기", href: "/calculators/pyeong" },
      { title: "단위 변환기", href: "/calculators/unit-converter" },
      { title: "비율 계산기", href: "/calculators/ratio" },
      { title: "BMI 계산기", href: "/calculators/bmi" },
      { title: "음주 측정기", href: "/calculators/alcohol" },
      { title: "연차 계산기", href: "/calculators/annual-leave" },
      { title: "학점 계산기", href: "/calculators/gpa" },
      { title: "공학용 계산기", href: "/calculators/scientific" },
    ],
  },
  {
    label: "재미/운세",
    items: [
      { title: "MBTI 궁합", href: "/calculators/mbti-compatibility" },
      { title: "이름 궁합", href: "/calculators/name-compatibility" },
      { title: "별자리 계산기", href: "/calculators/constellation" },
      { title: "띠 계산기", href: "/calculators/zodiac" },
      { title: "혈액형 계산기", href: "/calculators/blood-type" },
      { title: "사주팔자", href: "/calculators/saju" },
      { title: "전생 테스트", href: "/calculators/past-life" },
      { title: "오늘의 운세", href: "/calculators/daily-fortune" },
      { title: "커플 D-day", href: "/calculators/couple-dday" },
      { title: "심리테스트", href: "/tools/psychology-test" },
      { title: "MBTI 검사기", href: "/tools/mbti-test" },
      { title: "술게임 모음", href: "/tools/drinking-games" },
    ],
  },
  {
    label: "변환기",
    items: [
      { title: "이미지 변환기", href: "/tools/image-converter" },
      { title: "CSV JSON 변환기", href: "/tools/csv-json" },
      { title: "Markdown HTML", href: "/tools/markdown-html" },
      { title: "Base64 인코더", href: "/tools/base64" },
      { title: "색상 변환기", href: "/tools/color-converter" },
    ],
  },
  {
    label: "도구",
    items: [
      { title: "타이머 & 스톱워치", href: "/tools/timer" },
      { title: "JSON 포매터", href: "/tools/json-formatter" },
      { title: "QR 코드 생성기", href: "/tools/qr-code" },
      { title: "닉네임 생성기", href: "/tools/nickname-generator" },
      { title: "랜덤 룰렛", href: "/tools/random-roulette" },
      { title: "랜덤 숫자 생성기", href: "/tools/random-number" },
      { title: "타자 속도 측정", href: "/tools/typing-test" },
      { title: "반응속도 테스트", href: "/tools/reaction-test" },
      { title: "색맹 테스트", href: "/tools/color-blind-test" },
      { title: "기억력 테스트", href: "/tools/memory-game" },
      { title: "사다리 타기", href: "/tools/ladder-game" },
    ],
  },
];

export default function Sidebar({ type }: { type: "calculators" | "tools" }) {
  const pathname = usePathname();

  // Show current type's categories first
  const toolLabels = ["변환기", "도구"];
  const sorted = type === "tools"
    ? [...categories].sort((a, b) => {
        const aIsTool = toolLabels.includes(a.label) ? -1 : 0;
        const bIsTool = toolLabels.includes(b.label) ? -1 : 0;
        return aIsTool - bIsTool;
      })
    : categories;

  return (
    <aside className="hidden lg:block w-56 flex-shrink-0">
      <nav className="sticky top-20 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 pb-8">
        {sorted.map((cat) => (
          <div key={cat.label}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5 px-2">
              {cat.label}
            </p>
            <ul className="space-y-0.5">
              {cat.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`block px-2 py-1.5 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
