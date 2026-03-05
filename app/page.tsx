import Link from "next/link";

const calculators = [
  // 1,497,100 월간 검색량
  {
    title: "환율 계산기",
    description: "실시간 환율 기반으로 원화와 주요 외화 간 환율을 계산합니다.",
    href: "/calculators/exchange-rate",
    emoji: "\uD83D\uDCB1",
  },
  // 833,900 월간 검색량
  {
    title: "퍼센트 계산기",
    description: "백분율, 할인율, 증감률 등 다양한 퍼센트 계산을 합니다.",
    href: "/calculators/percent",
    emoji: "\uD83D\uDCCA",
  },
  // 2위: 807,400
  {
    title: "글자수 세기",
    description: "글자수, 단어수, 바이트 수를 실시간으로 계산합니다.",
    href: "/calculators/character-count",
    emoji: "\uD83D\uDCDD",
  },
  // 3위: 473,800 월간 검색량
  {
    title: "연봉 실수령액 계산기",
    description: "연봉에서 4대보험과 소득세를 공제한 월 실수령액을 계산합니다.",
    href: "/calculators/salary",
    emoji: "\uD83D\uDCB0",
  },
  // 2위: 406,900
  {
    title: "대출이자 계산기",
    description: "원리금균등 또는 원금균등 상환 방식의 대출이자를 계산합니다.",
    href: "/calculators/loan",
    emoji: "\uD83C\uDFE6",
  },
  // 3위: 369,000
  {
    title: "퇴직금 계산기",
    description: "근무기간과 평균임금을 기반으로 퇴직금을 계산합니다.",
    href: "/calculators/retirement",
    emoji: "\uD83D\uDCBC",
  },
  // 4위: 360,100
  {
    title: "날짜 계산기 (D-day)",
    description: "D-day 카운트다운, 두 날짜 사이의 일수 차이를 계산합니다.",
    href: "/calculators/dday",
    emoji: "\uD83D\uDCC5",
  },
  // 5위: 296,600
  {
    title: "나이 계산기",
    description: "만 나이와 한국 나이를 계산하고 다음 생일까지 남은 일수를 확인합니다.",
    href: "/calculators/age",
    emoji: "\uD83C\uDF82",
  },
  // 187,000
  {
    title: "평수 계산기",
    description: "평을 제곱미터(㎡)로, ㎡를 평으로 간편하게 변환합니다.",
    href: "/calculators/pyeong",
    emoji: "\uD83C\uDFE2",
  },
  // 158,300
  {
    title: "실업급여 계산기",
    description: "나이, 근속연수, 평균 월급으로 예상 실업급여를 계산합니다.",
    href: "/calculators/unemployment",
    emoji: "\uD83D\uDCCB",
  },
  // 7위: 131,200
  {
    title: "단위 변환기",
    description: "길이, 무게, 온도, 넓이, 부피를 간편하게 변환합니다.",
    href: "/calculators/unit-converter",
    emoji: "\uD83D\uDD04",
  },
  // 47,900
  {
    title: "비율 계산기",
    description: "비율 단순화, 비례식, 화면 비율을 계산합니다.",
    href: "/calculators/ratio",
    emoji: "\uD83D\uDCCF",
  },
  // 41,900
  {
    title: "연차 계산기",
    description: "입사일 기준으로 발생한 연차 일수를 계산합니다.",
    href: "/calculators/annual-leave",
    emoji: "\uD83C\uDFD6\uFE0F",
  },
  // 29,710
  {
    title: "적금 이자 계산기",
    description: "단리/복리 방식의 적금 만기 수령액과 이자를 계산합니다.",
    href: "/calculators/savings",
    emoji: "\uD83D\uDCB3",
  },
  // 15,710
  {
    title: "학점 계산기",
    description: "대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산합니다.",
    href: "/calculators/gpa",
    emoji: "\uD83C\uDF93",
  },
  // 8,720
  {
    title: "음주 측정기",
    description: "음주량과 시간으로 예상 혈중알코올농도를 계산합니다.",
    href: "/calculators/alcohol",
    emoji: "\uD83C\uDF7A",
  },
  // 27,320
  {
    title: "전기요금 계산기",
    description: "월간 전력 사용량으로 가정용 전기요금을 누진제 기준으로 계산합니다.",
    href: "/calculators/electricity",
    emoji: "\u26A1",
  },
  // 23,030
  {
    title: "자동차세 계산기",
    description: "배기량과 차령에 따른 자동차세를 계산합니다.",
    href: "/calculators/car-tax",
    emoji: "\uD83D\uDE97",
  },
  // 7,260
  {
    title: "BMI 계산기",
    description: "키와 몸무게로 체질량지수(BMI)를 계산하고 비만도를 확인합니다.",
    href: "/calculators/bmi",
    emoji: "\u2696\uFE0F",
  },
  // 예금이자
  {
    title: "예금이자 계산기",
    description: "예치금액, 이자율, 기간으로 예금 만기 수령액을 계산합니다.",
    href: "/calculators/deposit",
    emoji: "\uD83C\uDFE6",
  },
  // 주식 수익률
  {
    title: "주식 수익률 계산기",
    description: "매수가, 매도가, 수수료, 세금을 반영한 순수익과 수익률을 계산합니다.",
    href: "/calculators/stock-return",
    emoji: "\uD83D\uDCC8",
  },
  // 물타기
  {
    title: "물타기 계산기",
    description: "여러 차수의 매수를 입력하여 평균 매수단가를 계산합니다.",
    href: "/calculators/average-price",
    emoji: "\uD83D\uDCB9",
  },
  // 인플레이션
  {
    title: "인플레이션 계산기",
    description: "물가상승률에 따른 미래 화폐가치와 구매력 변화를 계산합니다.",
    href: "/calculators/inflation",
    emoji: "\uD83D\uDCB8",
  },
  // 부가세
  {
    title: "부가세 계산기",
    description: "공급가액에서 부가세를 계산하거나, 합계금액에서 역산합니다.",
    href: "/calculators/vat",
    emoji: "\uD83E\uDDFE",
  },
  // 로또 세금
  {
    title: "로또 세금 계산기",
    description: "로또 당첨금에서 세금을 공제한 실수령액을 계산합니다.",
    href: "/calculators/lotto-tax",
    emoji: "\uD83C\uDFB0",
  },
  // 12위: 600
  {
    title: "전월세 전환 계산기",
    description: "전세를 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.",
    href: "/calculators/rent-conversion",
    emoji: "\uD83C\uDFE0",
  },
];

const realEstateCalcs = [
  {
    title: "중개수수료 계산기",
    description: "매매, 전세, 월세 거래 시 부동산 중개수수료를 계산합니다.",
    href: "/calculators/brokerage-fee",
    emoji: "\uD83C\uDFE2",
  },
  {
    title: "취득세 계산기",
    description: "주택 취득 시 취득세, 농어촌특별세, 지방교육세를 계산합니다.",
    href: "/calculators/acquisition-tax",
    emoji: "\uD83C\uDFE0",
  },
  {
    title: "양도소득세 계산기",
    description: "부동산 양도 시 양도소득세를 장기보유특별공제 포함하여 계산합니다.",
    href: "/calculators/capital-gains-tax",
    emoji: "\uD83D\uDCB0",
  },
  {
    title: "증여세 계산기",
    description: "증여재산가액과 관계별 공제액으로 증여세를 계산합니다.",
    href: "/calculators/gift-tax",
    emoji: "\uD83C\uDF81",
  },
  {
    title: "상속세 계산기",
    description: "상속재산, 배우자 유무, 자녀 수로 상속세를 계산합니다.",
    href: "/calculators/inheritance-tax",
    emoji: "\uD83D\uDCDC",
  },
];

const funCalcs = [
  {
    title: "MBTI 궁합 테스트",
    description: "두 MBTI 유형의 궁합 점수와 상세 분석을 확인합니다.",
    href: "/calculators/mbti-compatibility",
    emoji: "\uD83D\uDC95",
  },
  {
    title: "이름 궁합 계산기",
    description: "두 이름의 획수로 궁합 퍼센트를 계산합니다.",
    href: "/calculators/name-compatibility",
    emoji: "\uD83D\uDC98",
  },
  {
    title: "별자리 계산기",
    description: "생일로 나의 별자리, 성격, 궁합, 행운의 숫자를 알아봅니다.",
    href: "/calculators/constellation",
    emoji: "\u2B50",
  },
  {
    title: "띠 계산기 (12간지)",
    description: "출생년도로 나의 띠, 천간, 오행, 성격, 궁합을 알아봅니다.",
    href: "/calculators/zodiac",
    emoji: "\uD83D\uDC09",
  },
  {
    title: "혈액형 계산기",
    description: "부모 혈액형으로 아기의 가능한 혈액형과 확률을 계산합니다.",
    href: "/calculators/blood-type",
    emoji: "\uD83E\uDE78",
  },
];

const tools = [
  {
    title: "타이머 & 스톱워치",
    description: "카운트다운 타이머와 랩 타임 스톱워치를 사용합니다.",
    href: "/tools/timer",
    emoji: "\u23F1\uFE0F",
  },
  {
    title: "JSON 포매터",
    description: "JSON 데이터를 보기 좋게 정리하거나 검증, 미니파이할 수 있습니다.",
    href: "/tools/json-formatter",
    emoji: "\uD83D\uDCDD",
  },
  {
    title: "Base64 인코더/디코더",
    description: "텍스트를 Base64로 인코딩하거나 디코딩합니다.",
    href: "/tools/base64",
    emoji: "\uD83D\uDD10",
  },
  {
    title: "QR 코드 생성기",
    description: "텍스트, URL, Wi-Fi 정보를 QR 코드로 변환합니다.",
    href: "/tools/qr-code",
    emoji: "\uD83D\uDCF1",
  },
  {
    title: "색상 변환기",
    description: "HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리봅니다.",
    href: "/tools/color-converter",
    emoji: "\uD83C\uDFA8",
  },
  {
    title: "이미지 변환기",
    description: "PNG, JPG, WebP 등 이미지 포맷을 브라우저에서 변환합니다.",
    href: "/tools/image-converter",
    emoji: "\uD83D\uDDBC\uFE0F",
  },
  {
    title: "CSV JSON 변환기",
    description: "CSV를 JSON으로, JSON을 CSV로 간편하게 변환합니다.",
    href: "/tools/csv-json",
    emoji: "\uD83D\uDCC4",
  },
  {
    title: "닉네임 생성기",
    description: "귀여운, 멋진, 웃긴, 게임용 스타일의 랜덤 닉네임을 생성합니다.",
    href: "/tools/nickname-generator",
    emoji: "\uD83C\uDFAD",
  },
  {
    title: "Markdown HTML 변환기",
    description: "마크다운을 HTML로 변환하고 미리보기할 수 있습니다.",
    href: "/tools/markdown-html",
    emoji: "\uD83D\uDCE8",
  },
  {
    title: "랜덤 숫자 생성기",
    description: "숫자 범위 지정, 여러 개 뽑기, 로또 번호 생성을 지원합니다.",
    href: "/tools/random-number",
    emoji: "\uD83C\uDFB2",
  },
  {
    title: "타자 속도 측정기",
    description: "한글 타이핑 속도와 정확도를 실시간으로 측정합니다.",
    href: "/tools/typing-test",
    emoji: "\u2328\uFE0F",
  },
  {
    title: "랜덤 룰렛 돌리기",
    description: "항목을 추가하고 룰렛을 돌려 점심 메뉴, 벌칙 등을 정합니다.",
    href: "/tools/random-roulette",
    emoji: "\uD83C\uDFB0",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          생활 계산기 & 온라인 도구 모음
        </h1>
        <p className="text-gray-600 text-lg">
          연봉, 대출, 건강, 근로 등 생활 계산기와 개발자 도구를 무료로 이용하세요.
        </p>
      </section>

      <h2 className="text-xl font-bold text-gray-900 mb-4">생활 계산기</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-blue-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{calc.emoji}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {calc.title}
            </h2>
            <p className="text-sm text-gray-500">{calc.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">부동산 계산기</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {realEstateCalcs.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-purple-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{calc.emoji}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {calc.title}
            </h2>
            <p className="text-sm text-gray-500">{calc.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">재미/운세</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {funCalcs.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-pink-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{calc.emoji}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {calc.title}
            </h2>
            <p className="text-sm text-gray-500">{calc.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">온라인 도구</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="block bg-white rounded-xl border border-gray-200 p-6 transition-all hover:shadow-lg hover:border-green-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{tool.emoji}</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {tool.title}
            </h2>
            <p className="text-sm text-gray-500">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
