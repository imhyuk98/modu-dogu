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
  { title: "환율 계산기", href: "/calculators/exchange-rate", emoji: "💱", desc: "금액을 입력해 다른 통화로 환산해요", featured: true },
  { title: "연봉 실수령액", href: "/calculators/salary", emoji: "💰", desc: "연봉 기준 세후 월 실수령액을 계산해요", featured: true },
  { title: "대출이자 계산기", href: "/calculators/loan", emoji: "🏦", desc: "상환 방식별 월 납입금과 총이자를 계산해요", featured: true },
  { title: "예금이자 계산기", href: "/calculators/deposit", emoji: "🏦", desc: "예치 기간과 금리로 만기 이자를 계산해요" },
  { title: "적금 이자 계산기", href: "/calculators/savings", emoji: "💳", desc: "월 납입액과 금리로 만기 수령액을 계산해요" },
  { title: "퇴직금 계산기", href: "/calculators/retirement", emoji: "💼", desc: "근속기간과 평균임금으로 예상 퇴직금을 계산해요" },
  { title: "시급 월급 변환기", href: "/calculators/hourly-wage", emoji: "⏰", desc: "시급·월급·연봉을 서로 환산해요" },
  { title: "실업급여 계산기", href: "/calculators/unemployment", emoji: "📋", desc: "조건에 따른 예상 지급액과 기간을 확인해요" },
  { title: "주식 수익률", href: "/calculators/stock-return", emoji: "📈", desc: "매수가와 매도가로 수익금과 수익률을 계산해요" },
  { title: "물타기 계산기", href: "/calculators/average-price", emoji: "📉", desc: "추가 매수 뒤 바뀌는 평균단가를 계산해요" },
  { title: "인플레이션", href: "/calculators/inflation", emoji: "💸", desc: "과거 금액과 현재 화폐가치를 비교해요" },
  { title: "1회당 비용", href: "/calculators/cost-per-use", emoji: "🧾", desc: "가격과 사용 횟수로 1회당 비용을 계산해요", featured: true },
  { title: "자동차세", href: "/calculators/car-tax", emoji: "🚗", desc: "배기량과 연식으로 예상 자동차세를 계산해요" },
  { title: "전기요금", href: "/calculators/electricity", emoji: "⚡", desc: "사용량에 따른 예상 전기요금을 계산해요" },
  { title: "부가세 계산기", href: "/calculators/vat", emoji: "🧾", desc: "합계액과 공급가액에서 부가세를 계산해요" },
  { title: "로또 세금", href: "/calculators/lotto-tax", emoji: "🎰", desc: "당첨금에서 세금을 뺀 실수령액을 계산해요" },
  { title: "연말정산 계산기", href: "/calculators/year-end-tax", emoji: "🧾", desc: "소득과 공제액으로 예상 환급·납부액을 계산해요" },
];

const realEstateCalcs: Item[] = [
  { title: "중개수수료", href: "/calculators/brokerage-fee", emoji: "🏢", desc: "거래 유형과 금액으로 중개수수료를 계산해요" },
  { title: "취득세 계산기", href: "/calculators/acquisition-tax", emoji: "🏠", desc: "주택 가격과 보유 조건으로 취득세를 계산해요", featured: true },
  { title: "양도소득세", href: "/calculators/capital-gains-tax", emoji: "💰", desc: "취득·양도 조건으로 예상 양도소득세를 계산해요" },
  { title: "증여세 계산기", href: "/calculators/gift-tax", emoji: "🎁", desc: "증여 금액과 관계에 따른 예상 세금을 계산해요" },
  { title: "상속세 계산기", href: "/calculators/inheritance-tax", emoji: "📜", desc: "상속 재산과 공제 조건으로 예상 세금을 계산해요" },
  { title: "전월세 전환", href: "/calculators/rent-conversion", emoji: "🏠", desc: "보증금과 월세의 전환 금액을 비교해요" },
  { title: "청약 점수 계산기", href: "/calculators/housing-subscription", emoji: "🏗️", desc: "무주택·부양가족·가입 기간으로 가점을 계산해요" },
];

const lifeCalcs: Item[] = [
  { title: "퍼센트 계산기", href: "/calculators/percent", emoji: "📊", desc: "비율·증감률·전체값을 간편하게 계산해요" },
  { title: "글자수 세기", href: "/calculators/character-count", emoji: "📝", desc: "공백 포함·제외 글자 수와 단어 수를 세어요" },
  { title: "나이 계산기", href: "/calculators/age", emoji: "🎂", desc: "생년월일로 만 나이와 연령을 계산해요", featured: true },
  { title: "날짜 계산기", href: "/calculators/dday", emoji: "📅", desc: "두 날짜의 차이와 디데이를 계산해요" },
  { title: "평수 계산기", href: "/calculators/pyeong", emoji: "🏢", desc: "평과 제곱미터를 서로 변환해요" },
  { title: "단위 변환기", href: "/calculators/unit-converter", emoji: "🔄", desc: "길이·무게·부피 등 여러 단위를 변환해요" },
  { title: "비율 계산기", href: "/calculators/ratio", emoji: "📐", desc: "주어진 비율로 필요한 값을 계산해요" },
  { title: "BMI 계산기", href: "/calculators/bmi", emoji: "⚖️", desc: "키와 몸무게로 BMI와 체중 범위를 확인해요", featured: true },
  { title: "기초대사량(BMR)", href: "/calculators/bmr", emoji: "🔥", desc: "나이·키·체중으로 기초대사량을 계산해요" },
  { title: "음주 측정기", href: "/calculators/alcohol", emoji: "🍺", desc: "음주량과 시간으로 예상 혈중알코올농도를 계산해요" },
  { title: "연차 계산기", href: "/calculators/annual-leave", emoji: "🏖️", desc: "입사일과 근무기간으로 발생 연차를 계산해요" },
  { title: "학점 계산기", href: "/calculators/gpa", emoji: "🎓", desc: "과목별 학점과 성적으로 평균 평점을 계산해요" },
  { title: "표준체중 계산기", href: "/calculators/standard-weight", emoji: "🏋️", desc: "키와 성별을 기준으로 표준체중을 확인해요" },
  { title: "공학용 계산기", href: "/calculators/scientific", emoji: "🔬", desc: "삼각함수·로그 등 공학 계산을 지원해요" },
  { title: "도시가스 요금", href: "/calculators/gas-bill", emoji: "🔥", desc: "사용량에 따른 예상 도시가스 요금을 계산해요" },
  { title: "유류비 계산기", href: "/calculators/fuel-cost", emoji: "⛽", desc: "거리·연비·유가로 예상 유류비를 계산해요" },
  { title: "TDEE 계산기", href: "/calculators/tdee", emoji: "🔥", desc: "활동량을 반영한 하루 소비 칼로리를 계산해요" },
  { title: "체지방률 계산기", href: "/calculators/body-fat", emoji: "🏋️", desc: "신체 치수로 예상 체지방률을 계산해요" },
  { title: "물 섭취량 계산기", href: "/calculators/water-intake", emoji: "💧", desc: "체중과 활동량에 따른 하루 물 섭취량을 확인해요" },
  { title: "식단 구성 도우미", href: "/calculators/macro-diet", emoji: "🥗", desc: "목표 칼로리와 영양 비율에 맞는 식단을 추천해요" },
  { title: "운동 루틴 추천", href: "/calculators/exercise", emoji: "💪", desc: "목표와 운동 환경에 맞는 루틴을 추천해요" },
  { title: "러닝 페이스", href: "/calculators/running-pace", emoji: "🏁", desc: "거리와 기록으로 평균 페이스와 예상 기록을 계산해요", featured: true },
  { title: "군대 전역일", href: "/calculators/military", emoji: "🎖️", desc: "입대일과 군별 복무기간으로 전역일을 계산해요" },
  { title: "택배 배송비", href: "/calculators/shipping", emoji: "📦", desc: "택배사와 크기별 예상 배송비를 비교해요" },
  { title: "출산 예정일", href: "/calculators/due-date", emoji: "🤰", desc: "기준일로 임신 주수와 출산 예정일을 계산해요" },
  { title: "반려동물 나이", href: "/calculators/pet-age", emoji: "🐾", desc: "반려동물 나이를 사람 나이로 환산해요" },
];

const funCalcs: Item[] = [
  { title: "MBTI 궁합", href: "/calculators/mbti-compatibility", emoji: "💕", desc: "우리 MBTI 조합 괜찮음?", featured: true },
  { title: "이름 궁합", href: "/calculators/name-compatibility", emoji: "💘", desc: "이름만 넣고 케미 확인" },
  { title: "별자리 계산기", href: "/calculators/constellation", emoji: "⭐", desc: "내 별자리 바로 찾기" },
  { title: "띠 계산기", href: "/calculators/zodiac", emoji: "🐉", desc: "나 무슨 띠였더라?" },
  { title: "혈액형 계산기", href: "/calculators/blood-type", emoji: "🩸", desc: "우리 애 혈액형 뭐 나옴?" },
  { title: "간단 오행 성향 테스트", href: "/calculators/saju", emoji: "☯️", desc: "생년월일을 오락용 규칙으로 풀어봐요" },
  { title: "전생 콘셉트 테스트", href: "/calculators/past-life", emoji: "🔮", desc: "전생의 나 뭐였을까?" },
  { title: "오늘의 띠 운세", href: "/calculators/daily-fortune", emoji: "🌟", desc: "오늘 운빨 몇 점?" },
  { title: "커플 D-day", href: "/calculators/couple-dday", emoji: "💑", desc: "다음 기념일 놓치지 않기" },
  { title: "심리 성향 테스트", href: "/tools/psychology-test", emoji: "🧠", desc: "내 선택엔 다 이유가 있음" },
  { title: "MBTI 검사", href: "/tools/mbti-test", emoji: "🧩", desc: "질문 몇 개로 내 유형 찾기" },
  { title: "에너지 성향 테스트", href: "/tools/energy-type-test", emoji: "⚡", desc: "나는 충전형? 방전형?", featured: true },
  { title: "퍼스널 스타일 테스트", href: "/tools/personal-style-test", emoji: "🎨", desc: "옷장 말고 취향부터 분석" },
  { title: "친구 케미 테스트", href: "/tools/friend-chemistry", emoji: "🧩", desc: "링크 보내고 우정 점수 확인", featured: true },
  { title: "아재개그 생성기", href: "/tools/dad-joke", emoji: "😂", desc: "웃으면 자존심 상함" },
  { title: "꿈 키워드 풀이", href: "/tools/dream-interpretation", emoji: "🌙", desc: "그 꿈, 그냥 꿈은 아닐지도" },
  { title: "타로 카드", href: "/tools/tarot", emoji: "🃏", desc: "지금 나한테 필요한 카드" },
];

const drinkingGames: Item[] = [
  { title: "라이어 게임", href: "/tools/liar-game", emoji: "🤥", desc: "한 명만 모르는 그 단어", featured: true },
  { title: "진실 or 도전", href: "/tools/truth-or-dare", emoji: "🎯", desc: "말할래? 시킬까?" },
  { title: "폭탄 돌리기", href: "/tools/bomb-game", emoji: "💣", desc: "언제 터질지 아무도 모름" },
  { title: "업다운 게임", href: "/tools/updown-game", emoji: "🔢", desc: "숫자 하나로 은근 쫄림" },
  { title: "랜덤 지목", href: "/tools/random-pick", emoji: "🎰", desc: "다음 타자 바로 검거" },
  { title: "베스킨라빈스 31", href: "/tools/baskin-robbins-31", emoji: "🍦", desc: "31 말하는 순간 끝" },
  { title: "초성 퀴즈", href: "/tools/chosung-quiz", emoji: "🔤", desc: "초성만 보고 맞히면 됨" },
  { title: "이미지 게임", href: "/tools/image-game", emoji: "🖼️", desc: "보자마자 생각난 사람" },
  { title: "손병호 게임", href: "/tools/never-have-i-ever", emoji: "🖐️", desc: "해봤으면 조용히 손 접기" },
  { title: "눈치 게임", href: "/tools/nunchi-game", emoji: "👀", desc: "겹치는 순간 바로 아웃" },
  { title: "텔레파시 게임", href: "/tools/telepathy-game", emoji: "🧠", desc: "찐친이면 같은 답 나옴" },
  { title: "사다리 타기", href: "/tools/ladder-game", emoji: "🧪", desc: "결정 못 하면 사다리행" },
  { title: "밸런스 게임", href: "/tools/balance-game", emoji: "⚖️", desc: "평생 하나만 골라야 한다면" },
  { title: "취향 월드컵", href: "/tools/ideal-type-worldcup", emoji: "🏆", desc: "내 취향 최종 우승자는?" },
];

const games: Item[] = [
  { title: "반응속도 테스트", href: "/tools/reaction-test", emoji: "⚡", desc: "내 손이 뇌보다 빠를까?", featured: true },
  { title: "기억력 테스트", href: "/tools/memory-game", emoji: "🎮", desc: "방금 본 것도 기억 안 난다면" },
  { title: "색맹 테스트", href: "/tools/color-blind-test", emoji: "🎨", desc: "색 구분, 얼마나 잘할까?" },
  { title: "2048", href: "/tools/game-2048", emoji: "🎮", desc: "숫자 합치다 시간 순삭" },
  { title: "스도쿠", href: "/tools/sudoku", emoji: "🧩", desc: "빈칸 하나가 왜 안 보이지" },
  { title: "블록 탈출", href: "/tools/block-escape", emoji: "🚗", desc: "이 차만 빼면 되는데" },
  { title: "지뢰찾기", href: "/tools/minesweeper", emoji: "💣", desc: "한 칸 잘못 열면 끝" },
  { title: "스네이크", href: "/tools/snake-game", emoji: "🐍", desc: "먹을수록 길어지는 그 게임" },
  { title: "오목", href: "/tools/omok", emoji: "⚫", desc: "컴퓨터 상대로 다섯 줄 도전" },
  { title: "사과 게임", href: "/tools/apple-game", emoji: "🍎", desc: "합이 10이면 바로 삭제" },
  { title: "행성 합치기", href: "/tools/planet-merge", emoji: "🪐", desc: "합치다 보면 우주 완성" },
  { title: "디지털 키캡 피젯", href: "/tools/digital-fidget", emoji: "⌨️", desc: "딸깍, 한 번만 더" },
];

const tools: Item[] = [
  { title: "타이머 & 스톱워치", href: "/tools/timer", emoji: "⏱️", desc: "타이머와 스톱워치로 시간을 측정해요" },
  { title: "JSON 포매터", href: "/tools/json-formatter", emoji: "📝", desc: "JSON 코드를 정렬하고 형식을 검증해요" },
  { title: "Base64 인코더", href: "/tools/base64", emoji: "🔐", desc: "텍스트를 Base64로 인코딩·디코딩해요" },
  { title: "QR 코드 생성기", href: "/tools/qr-code", emoji: "📱", desc: "텍스트와 링크를 QR 코드로 만들어요", featured: true },
  { title: "색상 변환기", href: "/tools/color-converter", emoji: "🎨", desc: "HEX·RGB·HSL 색상 코드를 변환해요" },
  { title: "이미지 변환기", href: "/tools/image-converter", emoji: "🖼️", desc: "JPG·PNG·WebP 등 이미지 형식을 변환해요" },
  { title: "이미지 압축", href: "/tools/image-compress", emoji: "📦", desc: "이미지 품질을 조절해 파일 용량을 줄여요" },
  { title: "이미지 크기 조절", href: "/tools/image-resize", emoji: "📐", desc: "가로·세로 픽셀을 지정해 이미지 크기를 바꿔요" },
  { title: "이미지 모자이크", href: "/tools/image-mosaic", emoji: "🔲", desc: "선택한 영역에 모자이크나 블러를 적용해요" },
  { title: "이미지 워터마크", href: "/tools/image-watermark", emoji: "💧", desc: "이미지에 텍스트 워터마크를 추가해요" },
  { title: "이미지 자르기", href: "/tools/image-crop", emoji: "✂️", desc: "원하는 영역만 선택해 이미지를 잘라요" },
  { title: "이미지 회전", href: "/tools/image-rotate", emoji: "🔄", desc: "이미지를 회전하거나 좌우로 뒤집어요" },
  { title: "CSV JSON 변환기", href: "/tools/csv-json", emoji: "📄", desc: "CSV와 JSON 데이터를 서로 변환해요" },
  { title: "닉네임 조합기", href: "/tools/nickname-generator", emoji: "🎭", desc: "원하는 분위기에 맞는 닉네임을 추천해요" },
  { title: "Markdown HTML", href: "/tools/markdown-html", emoji: "📨", desc: "Markdown과 HTML 코드를 서로 변환해요" },
  { title: "랜덤 숫자 생성기", href: "/tools/random-number", emoji: "🎲", desc: "지정한 범위에서 무작위 숫자를 생성해요" },
  { title: "타자 속도 측정", href: "/tools/typing-test", emoji: "⌨️", desc: "분당 타수와 입력 정확도를 측정해요" },
  { title: "랜덤 룰렛", href: "/tools/random-roulette", emoji: "🎰", desc: "항목을 입력해 무작위 결과를 뽑아요" },
  { title: "이미지 PDF 변환", href: "/tools/image-to-pdf", emoji: "📄", desc: "여러 이미지를 하나의 PDF로 만들어요" },
  { title: "이미지 색상 추출", href: "/tools/image-color-picker", emoji: "🎨", desc: "이미지에서 원하는 색상 코드를 추출해요" },
  { title: "주유소 최저가", href: "/tools/fuel-map", emoji: "⛽", desc: "주변 주유소의 위치와 가격을 지도에서 비교해요" },
  { title: "이름 후보 추천", href: "/tools/name-generator", emoji: "✍️", desc: "조건에 맞는 이름 후보를 추천해요" },
  { title: "선물 아이디어 추천", href: "/tools/gift-recommendation", emoji: "🎁", desc: "선물할 대상과 예산에 맞는 아이디어를 추천해요" },
  { title: "인스타 해시태그 추천", href: "/tools/hashtag-generator", emoji: "#️⃣", desc: "게시물 내용에 맞는 해시태그를 추천해요" },
  { title: "밈 카드 만들기", href: "/tools/meme-card", emoji: "🪪", desc: "문구를 넣어 영수증·상장·속보 카드를 만들어요", featured: true },
  { title: "책 추천 도우미", href: "/tools/book-recommendation", emoji: "📚", desc: "기분과 관심사에 맞는 책을 추천해요" },
  { title: "오늘 뭐 먹지", href: "/tools/food-recommendation", emoji: "🍽️", desc: "취향과 상황에 맞는 메뉴를 추천해요" },
  { title: "영화 추천 도우미", href: "/tools/movie-recommendation", emoji: "🎬", desc: "장르와 기분에 맞는 영화를 추천해요" },
  { title: "여행지 추천 도우미", href: "/tools/travel-recommendation", emoji: "✈️", desc: "취향과 조건에 맞는 여행지를 추천해요" },
  { title: "패션 코디 추천", href: "/tools/fashion-recommendation", emoji: "👗", desc: "상황과 취향에 맞는 코디를 추천해요" },
  { title: "비밀번호 생성기", href: "/tools/password-generator", emoji: "🔑", desc: "길이와 조건을 정해 무작위 비밀번호를 만들어요" },
];

export const sections: Section[] = [
  { key: "finance", label: "금융", fullLabel: "필요한 금액을 한눈에 보는 금융 계산기", icon: "💰", description: "연봉, 대출, 이자와 세금을 입력한 조건에 맞춰 간편하게 계산해요.", items: financeCalcs },
  { key: "realestate", label: "부동산", fullLabel: "계약 비용을 미리 보는 부동산 계산기", icon: "🏠", description: "집을 사고팔거나 계약하기 전에 필요한 비용과 세금을 확인해요.", items: realEstateCalcs },
  { key: "life", label: "생활 계산", fullLabel: "일상에서 바로 쓰는 생활 계산기", icon: "📊", description: "나이, 날짜, 건강, 단위처럼 일상에서 자주 필요한 값을 계산해요.", items: lifeCalcs },
  { key: "fun", label: "운세·테스트", fullLabel: "결과 뜨면 일단 공유하는 테스트·운세", icon: "🔮", description: "믿는 건 자유, 친구한테 보내는 건 거의 필수.", items: funCalcs },
  { key: "drinking", label: "같이 놀기", fullLabel: "모이면 바로 켜는 게임", icon: "🍻", description: "어색한 공기 끝. 폰 하나만 가운데 두면 준비 완료.", items: drinkingGames },
  { key: "games", label: "잠깐 게임", fullLabel: "딱 한 판만 하려던 미니 게임", icon: "🎮", description: "설치는 귀찮고 심심한 건 못 참을 때.", items: games },
  { key: "tools", label: "온라인 도구", fullLabel: "만들고 변환하는 온라인 도구", icon: "🛠️", description: "이미지, 문서, 색상과 QR 코드 작업을 설치 없이 빠르게 처리해요.", items: tools },
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
