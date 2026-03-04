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
      { title: "퇴직금 계산기", href: "/calculators/retirement" },
      { title: "실업급여 계산기", href: "/calculators/unemployment" },
      { title: "적금 이자 계산기", href: "/calculators/savings" },
      { title: "전월세 전환", href: "/calculators/rent-conversion" },
      { title: "자동차세 계산기", href: "/calculators/car-tax" },
      { title: "전기요금 계산기", href: "/calculators/electricity" },
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
    ],
  },
  {
    label: "온라인 도구",
    items: [
      { title: "타이머 & 스톱워치", href: "/tools/timer" },
      { title: "JSON 포매터", href: "/tools/json-formatter" },
      { title: "Base64 인코더", href: "/tools/base64" },
      { title: "QR 코드 생성기", href: "/tools/qr-code" },
      { title: "색상 변환기", href: "/tools/color-converter" },
      { title: "이미지 변환기", href: "/tools/image-converter" },
      { title: "CSV JSON 변환기", href: "/tools/csv-json" },
      { title: "Markdown HTML", href: "/tools/markdown-html" },
    ],
  },
];

export default function Sidebar({ type }: { type: "calculators" | "tools" }) {
  const pathname = usePathname();

  // Show current type's categories first
  const sorted = type === "tools"
    ? [...categories].sort((a, b) => (a.label === "온라인 도구" ? -1 : b.label === "온라인 도구" ? 1 : 0))
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
