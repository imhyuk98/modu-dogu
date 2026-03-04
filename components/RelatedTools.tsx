import Link from "next/link";

const allItems: Record<string, { title: string; href: string; category: string }> = {
  "exchange-rate": { title: "환율 계산기", href: "/calculators/exchange-rate", category: "금융" },
  salary: { title: "연봉 실수령액", href: "/calculators/salary", category: "금융" },
  loan: { title: "대출이자 계산기", href: "/calculators/loan", category: "금융" },
  retirement: { title: "퇴직금 계산기", href: "/calculators/retirement", category: "금융" },
  unemployment: { title: "실업급여 계산기", href: "/calculators/unemployment", category: "금융" },
  savings: { title: "적금 이자 계산기", href: "/calculators/savings", category: "금융" },
  "rent-conversion": { title: "전월세 전환", href: "/calculators/rent-conversion", category: "금융" },
  "car-tax": { title: "자동차세 계산기", href: "/calculators/car-tax", category: "금융" },
  electricity: { title: "전기요금 계산기", href: "/calculators/electricity", category: "금융" },
  percent: { title: "퍼센트 계산기", href: "/calculators/percent", category: "생활" },
  "character-count": { title: "글자수 세기", href: "/calculators/character-count", category: "생활" },
  age: { title: "나이 계산기", href: "/calculators/age", category: "생활" },
  dday: { title: "날짜 계산기", href: "/calculators/dday", category: "생활" },
  pyeong: { title: "평수 계산기", href: "/calculators/pyeong", category: "생활" },
  "unit-converter": { title: "단위 변환기", href: "/calculators/unit-converter", category: "생활" },
  ratio: { title: "비율 계산기", href: "/calculators/ratio", category: "생활" },
  bmi: { title: "BMI 계산기", href: "/calculators/bmi", category: "생활" },
  alcohol: { title: "음주 측정기", href: "/calculators/alcohol", category: "생활" },
  "annual-leave": { title: "연차 계산기", href: "/calculators/annual-leave", category: "생활" },
  gpa: { title: "학점 계산기", href: "/calculators/gpa", category: "생활" },
  timer: { title: "타이머 & 스톱워치", href: "/tools/timer", category: "도구" },
  "json-formatter": { title: "JSON 포매터", href: "/tools/json-formatter", category: "도구" },
  "qr-code": { title: "QR 코드 생성기", href: "/tools/qr-code", category: "도구" },
  "image-converter": { title: "이미지 변환기", href: "/tools/image-converter", category: "변환기" },
  "csv-json": { title: "CSV JSON 변환기", href: "/tools/csv-json", category: "변환기" },
  "markdown-html": { title: "Markdown HTML", href: "/tools/markdown-html", category: "변환기" },
  base64: { title: "Base64 인코더", href: "/tools/base64", category: "변환기" },
  "color-converter": { title: "색상 변환기", href: "/tools/color-converter", category: "변환기" },
};

// Manual related mappings — shows same-category items + specific cross-links
const relatedMap: Record<string, string[]> = {
  "exchange-rate": ["salary", "savings", "loan", "percent"],
  salary: ["retirement", "unemployment", "annual-leave", "loan"],
  loan: ["savings", "rent-conversion", "salary", "percent"],
  retirement: ["salary", "unemployment", "annual-leave", "savings"],
  unemployment: ["salary", "retirement", "annual-leave", "loan"],
  savings: ["loan", "rent-conversion", "exchange-rate", "percent"],
  "rent-conversion": ["loan", "savings", "electricity", "pyeong"],
  "car-tax": ["electricity", "loan", "salary", "percent"],
  electricity: ["car-tax", "rent-conversion", "pyeong", "percent"],
  percent: ["ratio", "unit-converter", "gpa", "savings"],
  "character-count": ["percent", "unit-converter", "dday", "age"],
  age: ["dday", "bmi", "annual-leave", "retirement"],
  dday: ["age", "annual-leave", "character-count", "timer"],
  pyeong: ["unit-converter", "rent-conversion", "electricity", "ratio"],
  "unit-converter": ["pyeong", "ratio", "percent", "color-converter"],
  ratio: ["percent", "unit-converter", "pyeong", "bmi"],
  bmi: ["alcohol", "age", "ratio", "percent"],
  alcohol: ["bmi", "age", "timer", "dday"],
  "annual-leave": ["salary", "retirement", "dday", "unemployment"],
  gpa: ["percent", "ratio", "character-count", "salary"],
  timer: ["dday", "alcohol", "json-formatter", "qr-code"],
  "json-formatter": ["csv-json", "base64", "markdown-html", "timer"],
  "qr-code": ["image-converter", "base64", "color-converter", "timer"],
  "image-converter": ["csv-json", "color-converter", "qr-code", "markdown-html"],
  "csv-json": ["json-formatter", "markdown-html", "base64", "image-converter"],
  "markdown-html": ["csv-json", "json-formatter", "character-count", "base64"],
  base64: ["json-formatter", "csv-json", "markdown-html", "color-converter"],
  "color-converter": ["image-converter", "base64", "unit-converter", "qr-code"],
};

export default function RelatedTools({ current }: { current: string }) {
  const keys = relatedMap[current] || [];
  const items = keys.map((k) => allItems[k]).filter(Boolean);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 pt-8 border-t border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">관련 도구</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-center"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
