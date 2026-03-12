export interface Item {
  title: string;
  href: string;
  emoji: string;
  desc: string;
  featured?: boolean;
}

export interface Section {
  key: string;
  label: string;
  fullLabel: string;
  icon: string;
  description: string;
  items: Item[];
}

const financeCalcs: Item[] = [
  { title: "환율 계산기", href: "/calculators/exchange-rate", emoji: "💱", desc: "실시간 환율 변환", featured: true },
  { title: "연봉 실수령액", href: "/calculators/salary", emoji: "💰", desc: "세후 월급 계산", featured: true },
  { title: "대출이자 계산기", href: "/calculators/loan", emoji: "🏦", desc: "원리금·원금균등", featured: true },
  { title: "예금이자 계산기", href: "/calculators/deposit", emoji: "🏦", desc: "예금 이자 수익" },
  { title: "적금 이자 계산기", href: "/calculators/savings", emoji: "💳", desc: "적금 만기 수령액" },
  { title: "퇴직금 계산기", href: "/calculators/retirement", emoji: "💼", desc: "퇴직금 예상액" },
  { title: "시급 월급 변환기", href: "/calculators/hourly-wage", emoji: "⏰", desc: "시급↔월급↔연봉 환산" },
  { title: "실업급여 계산기", href: "/calculators/unemployment", emoji: "📋", desc: "실업급여 수급액" },
  { title: "주식 수익률", href: "/calculators/stock-return", emoji: "📈", desc: "매매 수익률 분석" },
  { title: "물타기 계산기", href: "/calculators/average-price", emoji: "📉", desc: "평균 단가 계산" },
  { title: "인플레이션", href: "/calculators/inflation", emoji: "💸", desc: "화폐 가치 변화" },
  { title: "자동차세", href: "/calculators/car-tax", emoji: "🚗", desc: "연간 자동차세" },
  { title: "전기요금", href: "/calculators/electricity", emoji: "⚡", desc: "전기요금 계산" },
  { title: "부가세 계산기", href: "/calculators/vat", emoji: "🧾", desc: "부가가치세 계산" },
  { title: "로또 세금", href: "/calculators/lotto-tax", emoji: "🎰", desc: "당첨금 실수령액" },
  { title: "연말정산 계산기", href: "/calculators/year-end-tax", emoji: "🧾", desc: "환급액·추가납부 계산" },
];

const realEstateCalcs: Item[] = [
  { title: "중개수수료", href: "/calculators/brokerage-fee", emoji: "🏢", desc: "부동산 중개 수수료" },
  { title: "취득세 계산기", href: "/calculators/acquisition-tax", emoji: "🏠", desc: "주택 취득세", featured: true },
  { title: "양도소득세", href: "/calculators/capital-gains-tax", emoji: "💰", desc: "양도 차익 세금" },
  { title: "증여세 계산기", href: "/calculators/gift-tax", emoji: "🎁", desc: "증여 시 세금" },
  { title: "상속세 계산기", href: "/calculators/inheritance-tax", emoji: "📜", desc: "상속 시 세금" },
  { title: "전월세 전환", href: "/calculators/rent-conversion", emoji: "🏠", desc: "전세↔월세 전환" },
  { title: "청약 점수 계산기", href: "/calculators/housing-subscription", emoji: "🏗️", desc: "청약 가점 계산" },
];

const lifeCalcs: Item[] = [
  { title: "퍼센트 계산기", href: "/calculators/percent", emoji: "📊", desc: "비율·증감률 계산" },
  { title: "글자수 세기", href: "/calculators/character-count", emoji: "📝", desc: "글자·단어 수 세기" },
  { title: "나이 계산기", href: "/calculators/age", emoji: "🎂", desc: "만나이·한국나이", featured: true },
  { title: "날짜 계산기", href: "/calculators/dday", emoji: "📅", desc: "D-day·날짜 차이" },
  { title: "평수 계산기", href: "/calculators/pyeong", emoji: "🏢", desc: "평↔제곱미터" },
  { title: "단위 변환기", href: "/calculators/unit-converter", emoji: "🔄", desc: "길이·무게·부피" },
  { title: "비율 계산기", href: "/calculators/ratio", emoji: "📐", desc: "비율·비례 계산" },
  { title: "BMI 계산기", href: "/calculators/bmi", emoji: "⚖️", desc: "체질량지수 측정", featured: true },
  { title: "기초대사량(BMR)", href: "/calculators/bmr", emoji: "🔥", desc: "기초대사량 계산" },
  { title: "음주 측정기", href: "/calculators/alcohol", emoji: "🍺", desc: "혈중 알코올 농도" },
  { title: "연차 계산기", href: "/calculators/annual-leave", emoji: "🏖️", desc: "연차 발생·잔여" },
  { title: "학점 계산기", href: "/calculators/gpa", emoji: "🎓", desc: "학점 평균 계산" },
  { title: "표준체중 계산기", href: "/calculators/standard-weight", emoji: "🏋️", desc: "키·성별 표준체중" },
  { title: "공학용 계산기", href: "/calculators/scientific", emoji: "🔬", desc: "공학·과학 계산" },
  { title: "도시가스 요금", href: "/calculators/gas-bill", emoji: "🔥", desc: "도시가스 요금 계산" },
  { title: "유류비 계산기", href: "/calculators/fuel-cost", emoji: "⛽", desc: "자동차 주유비 계산" },
  { title: "TDEE 계산기", href: "/calculators/tdee", emoji: "🔥", desc: "일일 소비 칼로리" },
  { title: "체지방률 계산기", href: "/calculators/body-fat", emoji: "🏋️", desc: "US Navy 체지방률 측정" },
  { title: "물 섭취량 계산기", href: "/calculators/water-intake", emoji: "💧", desc: "하루 권장 물 섭취량" },
  { title: "AI 식단 추천", href: "/calculators/macro-diet", emoji: "🥗", desc: "AI 맞춤 식단 추천" },
  { title: "AI 운동 추천", href: "/calculators/exercise", emoji: "💪", desc: "AI 맞춤 운동 루틴" },
  { title: "군대 전역일", href: "/calculators/military", emoji: "🎖️", desc: "전역일·복무일수 계산" },
  { title: "택배 배송비", href: "/calculators/shipping", emoji: "📦", desc: "택배사별 요금 비교" },
  { title: "출산 예정일", href: "/calculators/due-date", emoji: "🤰", desc: "임신 주수·예정일 계산" },
  { title: "반려동물 나이", href: "/calculators/pet-age", emoji: "🐾", desc: "강아지·고양이 사람 나이 환산" },
];

const funCalcs: Item[] = [
  { title: "MBTI 궁합", href: "/calculators/mbti-compatibility", emoji: "💕", desc: "MBTI 유형 궁합", featured: true },
  { title: "이름 궁합", href: "/calculators/name-compatibility", emoji: "💘", desc: "이름으로 궁합 보기" },
  { title: "별자리 계산기", href: "/calculators/constellation", emoji: "⭐", desc: "생일 별자리 확인" },
  { title: "띠 계산기", href: "/calculators/zodiac", emoji: "🐉", desc: "태어난 해 띠" },
  { title: "혈액형 계산기", href: "/calculators/blood-type", emoji: "🩸", desc: "자녀 혈액형 확률" },
  { title: "AI 사주 분석", href: "/calculators/saju", emoji: "☯️", desc: "AI 사주팔자 분석" },
  { title: "AI 전생 테스트", href: "/calculators/past-life", emoji: "🔮", desc: "AI 전생 알아보기" },
  { title: "AI 오늘의 운세", href: "/calculators/daily-fortune", emoji: "🌟", desc: "AI 운세 확인" },
  { title: "커플 D-day", href: "/calculators/couple-dday", emoji: "💑", desc: "사귄 날 기념일" },
  { title: "AI 심리 분석", href: "/tools/psychology-test", emoji: "🧠", desc: "AI 심리테스트" },
  { title: "MBTI 검사", href: "/tools/mbti-test", emoji: "🧩", desc: "MBTI 유형 검사" },
  { title: "아재개그 생성기", href: "/tools/dad-joke", emoji: "😂", desc: "매일 새로운 아재개그" },
  { title: "AI 꿈 해몽", href: "/tools/dream-interpretation", emoji: "🌙", desc: "AI 꿈풀이 해석" },
  { title: "AI 타로", href: "/tools/tarot", emoji: "🃏", desc: "AI 타로 카드 운세" },
];

const drinkingGames: Item[] = [
  { title: "라이어 게임", href: "/tools/liar-game", emoji: "🤥", desc: "라이어를 찾아라", featured: true },
  { title: "진실 or 도전", href: "/tools/truth-or-dare", emoji: "🎯", desc: "진실 또는 도전" },
  { title: "폭탄 돌리기", href: "/tools/bomb-game", emoji: "💣", desc: "폭탄이 터지기 전에" },
  { title: "업다운 게임", href: "/tools/updown-game", emoji: "🔢", desc: "숫자 맞추기" },
  { title: "랜덤 지목", href: "/tools/random-pick", emoji: "🎰", desc: "무작위 지목" },
  { title: "베스킨라빈스 31", href: "/tools/baskin-robbins-31", emoji: "🍦", desc: "31을 외치면 패배" },
  { title: "초성 퀴즈", href: "/tools/chosung-quiz", emoji: "🔤", desc: "초성으로 맞추기" },
  { title: "이미지 게임", href: "/tools/image-game", emoji: "🖼️", desc: "떠오르는 사람 지목" },
  { title: "손병호 게임", href: "/tools/never-have-i-ever", emoji: "🖐️", desc: "나는 ~한 적 없다" },
  { title: "눈치 게임", href: "/tools/nunchi-game", emoji: "👀", desc: "같은 숫자 외치면 벌칙" },
  { title: "텔레파시 게임", href: "/tools/telepathy-game", emoji: "🧠", desc: "같은 답 맞추기" },
  { title: "사다리 타기", href: "/tools/ladder-game", emoji: "🧪", desc: "사다리로 결정" },
  { title: "밸런스 게임", href: "/tools/balance-game", emoji: "⚖️", desc: "둘 중 하나 선택" },
];

const games: Item[] = [
  { title: "반응속도 테스트", href: "/tools/reaction-test", emoji: "⚡", desc: "반응 속도 측정", featured: true },
  { title: "기억력 테스트", href: "/tools/memory-game", emoji: "🎮", desc: "카드 짝 맞추기" },
  { title: "색맹 테스트", href: "/tools/color-blind-test", emoji: "🎨", desc: "색상 구분 테스트" },
  { title: "2048", href: "/tools/game-2048", emoji: "🎮", desc: "숫자 합치기 퍼즐" },
  { title: "스도쿠", href: "/tools/sudoku", emoji: "🧩", desc: "숫자 퍼즐" },
  { title: "블록 탈출", href: "/tools/block-escape", emoji: "🚗", desc: "블록을 밀어 탈출" },
  { title: "지뢰찾기", href: "/tools/minesweeper", emoji: "💣", desc: "지뢰를 피해라" },
  { title: "스네이크", href: "/tools/snake-game", emoji: "🐍", desc: "뱀 키우기 게임" },
  { title: "오목", href: "/tools/omok", emoji: "⚫", desc: "AI와 오목 대결" },
  { title: "사과 게임", href: "/tools/apple-game", emoji: "🍎", desc: "합이 10! 숫자 퍼즐" },
  { title: "행성 합치기", href: "/tools/planet-merge", emoji: "🪐", desc: "행성 합쳐 진화시키기" },
];

const tools: Item[] = [
  { title: "타이머 & 스톱워치", href: "/tools/timer", emoji: "⏱️", desc: "시간 측정 도구" },
  { title: "JSON 포매터", href: "/tools/json-formatter", emoji: "📝", desc: "JSON 정렬·검증" },
  { title: "Base64 인코더", href: "/tools/base64", emoji: "🔐", desc: "인코딩·디코딩" },
  { title: "QR 코드 생성기", href: "/tools/qr-code", emoji: "📱", desc: "QR 코드 생성", featured: true },
  { title: "색상 변환기", href: "/tools/color-converter", emoji: "🎨", desc: "HEX·RGB·HSL 변환" },
  { title: "이미지 변환기", href: "/tools/image-converter", emoji: "🖼️", desc: "이미지 포맷 변환" },
  { title: "이미지 압축", href: "/tools/image-compress", emoji: "📦", desc: "이미지 용량 줄이기" },
  { title: "이미지 크기 조절", href: "/tools/image-resize", emoji: "📐", desc: "이미지 리사이즈" },
  { title: "이미지 모자이크", href: "/tools/image-mosaic", emoji: "🔲", desc: "모자이크 & 블러 처리" },
  { title: "이미지 워터마크", href: "/tools/image-watermark", emoji: "💧", desc: "텍스트 워터마크 추가" },
  { title: "이미지 자르기", href: "/tools/image-crop", emoji: "✂️", desc: "이미지 크롭" },
  { title: "이미지 회전", href: "/tools/image-rotate", emoji: "🔄", desc: "회전 & 뒤집기" },
  { title: "CSV JSON 변환기", href: "/tools/csv-json", emoji: "📄", desc: "CSV↔JSON 변환" },
  { title: "AI 닉네임 생성기", href: "/tools/nickname-generator", emoji: "🎭", desc: "AI 닉네임 생성" },
  { title: "Markdown HTML", href: "/tools/markdown-html", emoji: "📨", desc: "MD↔HTML 변환" },
  { title: "랜덤 숫자 생성기", href: "/tools/random-number", emoji: "🎲", desc: "무작위 숫자 생성" },
  { title: "타자 속도 측정", href: "/tools/typing-test", emoji: "⌨️", desc: "타이핑 속도 측정" },
  { title: "랜덤 룰렛", href: "/tools/random-roulette", emoji: "🎰", desc: "돌려서 결정하기" },
  { title: "이미지 PDF 변환", href: "/tools/image-to-pdf", emoji: "📄", desc: "이미지를 PDF로 합치기" },
  { title: "이미지 색상 추출", href: "/tools/image-color-picker", emoji: "🎨", desc: "이미지에서 색상 코드 추출" },
  { title: "주유소 최저가", href: "/tools/fuel-map", emoji: "⛽", desc: "전국 주유소 가격 지도" },
  { title: "AI 작명기", href: "/tools/name-generator", emoji: "✍️", desc: "AI 이름 짓기" },
  { title: "AI 선물 추천", href: "/tools/gift-recommendation", emoji: "🎁", desc: "AI 맞춤 선물 추천" },
  { title: "AI 인스타 해시태그", href: "/tools/hashtag-generator", emoji: "#️⃣", desc: "인스타 해시태그 생성" },
  { title: "AI 책 추천", href: "/tools/book-recommendation", emoji: "📚", desc: "AI 기분별 맞춤 도서 추천" },
  { title: "AI 오늘 뭐 먹지", href: "/tools/food-recommendation", emoji: "🍽️", desc: "AI 메뉴 추천" },
  { title: "AI 영화 추천", href: "/tools/movie-recommendation", emoji: "🎬", desc: "AI 기분별 영화 추천" },
  { title: "AI 여행지 추천", href: "/tools/travel-recommendation", emoji: "✈️", desc: "AI 맞춤 여행지 추천" },
  { title: "AI 패션 코디", href: "/tools/fashion-recommendation", emoji: "👗", desc: "AI 상황별 코디 추천" },
  { title: "비밀번호 생성기", href: "/tools/password-generator", emoji: "🔑", desc: "안전한 랜덤 비밀번호" },
];

export const sections: Section[] = [
  { key: "finance", label: "금융", fullLabel: "금융 계산기", icon: "💰", description: "연봉, 대출, 적금, 세금 등 금융 관련 계산기를 무료로 사용하세요.", items: financeCalcs },
  { key: "realestate", label: "부동산", fullLabel: "부동산 계산기", icon: "🏠", description: "취득세, 양도소득세, 중개수수료 등 부동산 관련 계산기를 무료로 사용하세요.", items: realEstateCalcs },
  { key: "life", label: "생활", fullLabel: "생활 계산기", icon: "📊", description: "나이, 날짜, BMI, 단위 변환 등 일상에서 자주 쓰는 계산기 모음입니다.", items: lifeCalcs },
  { key: "fun", label: "재미/운세", fullLabel: "재미/운세", icon: "🔮", description: "MBTI 궁합, 이름 궁합, 별자리, 운세 등 재미있는 테스트 모음입니다.", items: funCalcs },
  { key: "drinking", label: "술게임", fullLabel: "술게임 모음", icon: "🍻", description: "라이어 게임, 폭탄 돌리기, 업다운 등 모임에서 즐길 수 있는 술게임 모음입니다.", items: drinkingGames },
  { key: "games", label: "게임", fullLabel: "미니 게임", icon: "🎮", description: "2048, 스도쿠, 지뢰찾기 등 브라우저에서 바로 즐길 수 있는 미니 게임 모음입니다.", items: games },
  { key: "tools", label: "도구", fullLabel: "온라인 도구", icon: "🛠️", description: "JSON 포매터, QR 코드 생성기, 이미지 변환기 등 유용한 온라인 도구 모음입니다.", items: tools },
];

export const allItems = sections.flatMap((s) => s.items);

export const sectionColors: Record<string, { bg: string; iconBg: string; text: string; border: string; hoverBg: string; arrow: string }> = {
  finance:    { bg: "bg-blue-50",    iconBg: "bg-blue-100",    text: "text-blue-700",    border: "border-blue-100",    hoverBg: "hover:bg-blue-50/50",    arrow: "text-blue-400" },
  realestate: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-100", hoverBg: "hover:bg-emerald-50/50", arrow: "text-emerald-400" },
  life:       { bg: "bg-amber-50",   iconBg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-100",   hoverBg: "hover:bg-amber-50/50",   arrow: "text-amber-400" },
  fun:        { bg: "bg-pink-50",    iconBg: "bg-pink-100",    text: "text-pink-700",    border: "border-pink-100",    hoverBg: "hover:bg-pink-50/50",    arrow: "text-pink-400" },
  drinking:   { bg: "bg-purple-50",  iconBg: "bg-purple-100",  text: "text-purple-700",  border: "border-purple-100",  hoverBg: "hover:bg-purple-50/50",  arrow: "text-purple-400" },
  games:      { bg: "bg-red-50",     iconBg: "bg-red-100",     text: "text-red-700",     border: "border-red-100",     hoverBg: "hover:bg-red-50/50",     arrow: "text-red-400" },
  tools:      { bg: "bg-sky-50",     iconBg: "bg-sky-100",     text: "text-sky-700",     border: "border-sky-100",     hoverBg: "hover:bg-sky-50/50",     arrow: "text-sky-400" },
};
