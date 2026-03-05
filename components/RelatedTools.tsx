import Link from "next/link";

const allItems: Record<string, { title: string; href: string; category: string }> = {
  "exchange-rate": { title: "환율 계산기", href: "/calculators/exchange-rate", category: "금융" },
  salary: { title: "연봉 실수령액", href: "/calculators/salary", category: "금융" },
  loan: { title: "대출이자 계산기", href: "/calculators/loan", category: "금융" },
  retirement: { title: "퇴직금 계산기", href: "/calculators/retirement", category: "금융" },
  unemployment: { title: "실업급여 계산기", href: "/calculators/unemployment", category: "금융" },
  savings: { title: "적금 이자 계산기", href: "/calculators/savings", category: "금융" },
  "rent-conversion": { title: "전월세 전환", href: "/calculators/rent-conversion", category: "금융" },
  deposit: { title: "예금이자 계산기", href: "/calculators/deposit", category: "금융" },
  "average-price": { title: "물타기 계산기", href: "/calculators/average-price", category: "금융" },
  inflation: { title: "인플레이션 계산기", href: "/calculators/inflation", category: "금융" },
  "stock-return": { title: "주식 수익률 계산기", href: "/calculators/stock-return", category: "금융" },
  "brokerage-fee": { title: "중개수수료 계산기", href: "/calculators/brokerage-fee", category: "부동산" },
  "acquisition-tax": { title: "취득세 계산기", href: "/calculators/acquisition-tax", category: "부동산" },
  "capital-gains-tax": { title: "양도소득세 계산기", href: "/calculators/capital-gains-tax", category: "부동산" },
  "gift-tax": { title: "증여세 계산기", href: "/calculators/gift-tax", category: "부동산" },
  "inheritance-tax": { title: "상속세 계산기", href: "/calculators/inheritance-tax", category: "부동산" },
  "lotto-tax": { title: "로또 세금 계산기", href: "/calculators/lotto-tax", category: "금융" },
  vat: { title: "부가세 계산기", href: "/calculators/vat", category: "금융" },
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
  "blood-type": { title: "혈액형 계산기", href: "/calculators/blood-type", category: "생활" },
  "nickname-generator": { title: "닉네임 생성기", href: "/tools/nickname-generator", category: "도구" },
  "mbti-compatibility": { title: "MBTI 궁합 테스트", href: "/calculators/mbti-compatibility", category: "재미" },
  "name-compatibility": { title: "이름 궁합 계산기", href: "/calculators/name-compatibility", category: "재미" },
  "typing-test": { title: "타자 속도 측정기", href: "/tools/typing-test", category: "도구" },
  constellation: { title: "별자리 계산기", href: "/calculators/constellation", category: "재미" },
  "random-number": { title: "랜덤 숫자 생성기", href: "/tools/random-number", category: "도구" },
  "random-roulette": { title: "랜덤 룰렛", href: "/tools/random-roulette", category: "도구" },
  zodiac: { title: "띠 계산기", href: "/calculators/zodiac", category: "생활" },
  "reaction-test": { title: "반응속도 테스트", href: "/tools/reaction-test", category: "도구" },
  "color-blind-test": { title: "색맹 테스트", href: "/tools/color-blind-test", category: "도구" },
  "memory-game": { title: "기억력 테스트", href: "/tools/memory-game", category: "도구" },
  "couple-dday": { title: "커플 D-day 계산기", href: "/calculators/couple-dday", category: "재미" },
  "psychology-test": { title: "심리테스트", href: "/tools/psychology-test", category: "재미" },
  saju: { title: "사주팔자 계산기", href: "/calculators/saju", category: "재미" },
  "past-life": { title: "전생 테스트", href: "/calculators/past-life", category: "재미" },
  "daily-fortune": { title: "오늘의 운세", href: "/calculators/daily-fortune", category: "재미" },
  "mbti-test": { title: "MBTI 성격유형 검사", href: "/tools/mbti-test", category: "재미" },
  "ladder-game": { title: "사다리 타기", href: "/tools/ladder-game", category: "도구" },
  "drinking-games": { title: "술게임 모음", href: "/tools/drinking-games", category: "재미" },
  scientific: { title: "공학용 계산기", href: "/calculators/scientific", category: "생활" },
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
  deposit: ["savings", "loan", "inflation", "exchange-rate"],
  "average-price": ["stock-return", "savings", "percent", "loan"],
  inflation: ["deposit", "savings", "exchange-rate", "loan"],
  "stock-return": ["average-price", "savings", "percent", "exchange-rate"],
  "brokerage-fee": ["acquisition-tax", "rent-conversion", "capital-gains-tax", "pyeong"],
  "acquisition-tax": ["brokerage-fee", "capital-gains-tax", "gift-tax", "loan"],
  "capital-gains-tax": ["acquisition-tax", "gift-tax", "inheritance-tax", "brokerage-fee"],
  "gift-tax": ["inheritance-tax", "capital-gains-tax", "acquisition-tax", "savings"],
  "inheritance-tax": ["gift-tax", "capital-gains-tax", "retirement", "savings"],
  "lotto-tax": ["salary", "gift-tax", "inheritance-tax", "percent"],
  vat: ["salary", "percent", "loan", "savings"],
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
  "blood-type": ["bmi", "age", "alcohol", "nickname-generator"],
  "nickname-generator": ["character-count", "qr-code", "blood-type", "timer"],
  "mbti-compatibility": ["name-compatibility", "blood-type", "nickname-generator", "bmi"],
  "name-compatibility": ["mbti-compatibility", "blood-type", "nickname-generator", "dday"],
  "typing-test": ["timer", "character-count", "nickname-generator", "json-formatter"],
  constellation: ["blood-type", "mbti-compatibility", "name-compatibility", "age"],
  "random-number": ["lotto-tax", "nickname-generator", "timer", "constellation"],
  "random-roulette": ["random-number", "nickname-generator", "timer", "zodiac"],
  zodiac: ["constellation", "blood-type", "age", "random-roulette"],
  "reaction-test": ["typing-test", "memory-game", "timer", "color-blind-test"],
  "color-blind-test": ["bmi", "reaction-test", "memory-game", "age"],
  "memory-game": ["reaction-test", "typing-test", "color-blind-test", "timer"],
  "couple-dday": ["dday", "name-compatibility", "mbti-compatibility", "constellation"],
  "psychology-test": ["mbti-compatibility", "name-compatibility", "couple-dday", "blood-type"],
  saju: ["daily-fortune", "zodiac", "constellation", "past-life"],
  "past-life": ["saju", "daily-fortune", "constellation", "mbti-compatibility"],
  "daily-fortune": ["saju", "zodiac", "constellation", "past-life"],
  "mbti-test": ["mbti-compatibility", "psychology-test", "name-compatibility", "blood-type"],
  "ladder-game": ["random-roulette", "random-number", "timer", "nickname-generator"],
  "drinking-games": ["random-roulette", "ladder-game", "random-number", "nickname-generator"],
  scientific: ["percent", "unit-converter", "ratio", "gpa"],
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
