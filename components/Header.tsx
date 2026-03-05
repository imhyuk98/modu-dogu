"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const financeCalcs = [
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
];

const realEstateCalcs = [
  { title: "중개수수료 계산기", href: "/calculators/brokerage-fee" },
  { title: "취득세 계산기", href: "/calculators/acquisition-tax" },
  { title: "양도소득세 계산기", href: "/calculators/capital-gains-tax" },
  { title: "증여세 계산기", href: "/calculators/gift-tax" },
  { title: "상속세 계산기", href: "/calculators/inheritance-tax" },
];

const lifeCalcs = [
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
];

const funCalcs = [
  { title: "MBTI 궁합", href: "/calculators/mbti-compatibility" },
  { title: "이름 궁합", href: "/calculators/name-compatibility" },
  { title: "별자리 계산기", href: "/calculators/constellation" },
  { title: "띠 계산기", href: "/calculators/zodiac" },
  { title: "혈액형 계산기", href: "/calculators/blood-type" },
];

const converterItems = [
  { title: "이미지 변환기", href: "/tools/image-converter" },
  { title: "CSV JSON 변환기", href: "/tools/csv-json" },
  { title: "Markdown HTML", href: "/tools/markdown-html" },
  { title: "Base64 인코더", href: "/tools/base64" },
  { title: "색상 변환기", href: "/tools/color-converter" },
];

const toolItems = [
  { title: "타이머 & 스톱워치", href: "/tools/timer" },
  { title: "JSON 포매터", href: "/tools/json-formatter" },
  { title: "QR 코드 생성기", href: "/tools/qr-code" },
  { title: "닉네임 생성기", href: "/tools/nickname-generator" },
  { title: "랜덤 룰렛", href: "/tools/random-roulette" },
  { title: "랜덤 숫자 생성기", href: "/tools/random-number" },
  { title: "타자 속도 측정", href: "/tools/typing-test" },
];

function DropdownMenu({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg py-2 min-w-[200px] z-50">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileSection({
  label,
  items,
  expanded,
  onToggle,
  onClose,
}: {
  label: string;
  items: { title: string; href: string }[];
  expanded: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        onClick={onToggle}
      >
        <span>{label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="bg-gray-50 px-4 py-2 grid grid-cols-2 gap-x-2 gap-y-0.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-2 py-1.5 text-sm text-gray-600 hover:text-blue-600 rounded"
              onClick={onClose}
            >
              {item.title}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          계산기나라
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            홈
          </Link>

          <DropdownMenu label="금융 계산기">
            {financeCalcs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <DropdownMenu label="부동산">
            {realEstateCalcs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <DropdownMenu label="생활 계산기">
            {lifeCalcs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <DropdownMenu label="재미/운세">
            {funCalcs.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <DropdownMenu label="변환기">
            {converterItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <DropdownMenu label="도구">
            {toolItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-1.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </DropdownMenu>

          <Link href="/about" className="hover:text-blue-600 transition-colors">
            소개
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white max-h-[80vh] overflow-y-auto">
          <Link
            href="/"
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            onClick={closeMobile}
          >
            홈
          </Link>

          <MobileSection
            label="금융 계산기"
            items={financeCalcs}
            expanded={mobileExpanded === "finance"}
            onToggle={() => setMobileExpanded(mobileExpanded === "finance" ? null : "finance")}
            onClose={closeMobile}
          />

          <MobileSection
            label="부동산"
            items={realEstateCalcs}
            expanded={mobileExpanded === "realestate"}
            onToggle={() => setMobileExpanded(mobileExpanded === "realestate" ? null : "realestate")}
            onClose={closeMobile}
          />

          <MobileSection
            label="생활 계산기"
            items={lifeCalcs}
            expanded={mobileExpanded === "life"}
            onToggle={() => setMobileExpanded(mobileExpanded === "life" ? null : "life")}
            onClose={closeMobile}
          />

          <MobileSection
            label="재미/운세"
            items={funCalcs}
            expanded={mobileExpanded === "fun"}
            onToggle={() => setMobileExpanded(mobileExpanded === "fun" ? null : "fun")}
            onClose={closeMobile}
          />

          <MobileSection
            label="변환기"
            items={converterItems}
            expanded={mobileExpanded === "converters"}
            onToggle={() => setMobileExpanded(mobileExpanded === "converters" ? null : "converters")}
            onClose={closeMobile}
          />

          <MobileSection
            label="도구"
            items={toolItems}
            expanded={mobileExpanded === "tools"}
            onToggle={() => setMobileExpanded(mobileExpanded === "tools" ? null : "tools")}
            onClose={closeMobile}
          />

          <Link
            href="/about"
            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100"
            onClick={closeMobile}
          >
            소개
          </Link>
        </div>
      )}
    </header>
  );
}
