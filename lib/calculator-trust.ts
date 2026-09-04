export interface CalculatorSource {
  label: string;
  href: string;
}

export interface CalculatorTrustRecord {
  category: "금융" | "세금" | "고용" | "건강";
  effectiveDate: string;
  verifiedAt: string;
  formula: string;
  included: string[];
  excluded: string[];
  sources: CalculatorSource[];
}

const verifiedAt = "2026-09-04";
const incomeTax = { label: "국가법령정보센터 · 소득세법", href: "https://www.law.go.kr/법령/소득세법" };
const inheritanceTax = { label: "국가법령정보센터 · 상속세 및 증여세법", href: "https://www.law.go.kr/법령/상속세및증여세법" };
const laborLaw = { label: "국가법령정보센터 · 근로기준법", href: "https://www.law.go.kr/법령/근로기준법" };
const nps = { label: "국민연금공단 · 보험료율과 기준소득월액", href: "https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0038M0.do?menuId=MN24001113&tab=tab5" };
const nhis = { label: "국민건강보험공단 · 2026 보험료율", href: "https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html" };
const employmentInsurance = { label: "고용노동부 · 고용보험 보험료율", href: "https://moel.go.kr/info/astmgmt/employ/employList.do" };
const minimumWage = { label: "최저임금위원회 · 2026 적용 최저임금", href: "https://www.minimumwage.go.kr/" };
const whoBmi = { label: "WHO · Obesity and overweight", href: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" };
const cdcBmi = { label: "CDC · About BMI", href: "https://www.cdc.gov/bmi/about/index.html" };
const acogDueDate = { label: "ACOG · Methods for Estimating the Due Date", href: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date" };
const niddkPlanner = { label: "NIH/NIDDK · Body Weight Planner", href: "https://www.niddk.nih.gov/bwp" };

function record(
  category: CalculatorTrustRecord["category"],
  effectiveDate: string,
  formula: string,
  included: string[],
  excluded: string[],
  sources: CalculatorSource[],
): CalculatorTrustRecord {
  return { category, effectiveDate, verifiedAt, formula, included, excluded, sources };
}

export const calculatorTrustRecords: Record<string, CalculatorTrustRecord> = {
  "annual-leave": record("고용", "근로기준법 2026-08-20 시행본", "1년 미만은 개근한 달 × 1일, 1년 이상은 15일 + 계속근로 2년마다 1일(최대 25일)로 계산합니다.", ["입사일·계산 기준일", "재직/퇴사 구분", "출근율과 사용 연차", "입사일 기준 법정 발생분"], ["휴직·휴업의 출근 간주", "회사별 이월·촉진 절차", "회계연도별 세부 내규"], [laborLaw, { label: "고용노동부 · 연차유급휴가 행정해석 변경", href: "https://www.moel.go.kr/news/enews/report/enewsView.do?bbs_id=12&news_seq=13052" }]),
  salary: record("고용", "2026-07-01", "월 급여에서 국민연금 4.75%, 건강보험 3.595%, 장기요양보험과 고용보험 0.9%, 간이 소득세 추정액을 차감합니다.", ["2026년 7월 국민연금 상·하한", "직장가입자 근로자 부담분", "소득세·지방소득세 간이 추정"], ["부양가족·비과세 수당의 개별 차이", "연말정산 환급·추징", "회사별 공제"], [nps, nhis, employmentInsurance, { label: "국세청 · 근로소득 간이세액표", href: "https://www.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2226&nttSn=1295067" }]),
  "hourly-wage": record("고용", "2026-01-01", "입력한 시급·근로시간을 기준으로 기본 임금과 선택한 주휴시간을 합산합니다.", ["2026 최저임금 시간급 10,320원", "주당 근로시간", "주휴수당 선택"], ["연장·야간·휴일 가산", "수습·감시단속직 예외", "세금과 4대보험"], [minimumWage, laborLaw]),
  retirement: record("고용", "2026-09-04 확인", "1일 평균임금 × 30 × 계속근로일수 ÷ 365를 기본식으로 사용합니다.", ["퇴직 전 3개월 임금", "상여금·연차수당 입력분", "계속근로일수"], ["평균임금 제외기간의 모든 예외", "통상임금 최저 보정의 개별 판단", "퇴직연금 사업자 수수료"], [{ label: "찾기쉬운 생활법령 · 퇴직금 산정", href: "https://www.easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=82&onhunqueSeq=4845" }, laborLaw]),
  unemployment: record("고용", "2026-01-01 이후 이직자", "퇴직 전 월평균임금을 일액으로 환산한 60%를 2026년 상·하한 안에서 제한하고 연령·가입기간별 급여일수를 곱합니다.", ["2026 일 상한 68,100원", "8시간 기준 하한 66,048원", "연령과 고용보험 가입기간"], ["실제 수급자격 판정", "단시간 근로자의 개별 소정근로시간", "대기기간·조기재취업수당"], [{ label: "고용노동부 1350 · 2026 구직급여 상·하한", href: "https://1350.moel.go.kr/rtmview.do?id=1000324861" }, employmentInsurance]),
  "year-end-tax": record("세금", "2026 귀속 규정 확인", "입력한 총급여에서 근로소득공제와 선택한 인적·보험·의료·교육·카드 공제의 단순화된 금액을 반영해 결정세액을 추정합니다.", ["누진세율과 표준세액공제", "사용자가 입력한 주요 공제", "지방소득세 추정"], ["회사 원천징수 자료 자동 연동", "모든 공제 한도·중복 배제", "세액공제 증빙 판정"], [incomeTax, { label: "국세청 · 연말정산 종합 안내", href: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=6645&cntntsId=7878" }]),
  vat: record("세금", "2026-09-04 확인", "공급가액의 10%를 부가가치세로 계산하거나 합계액을 1.1로 나눠 공급가액을 역산합니다.", ["일반 세율 10%", "공급가액/합계액 양방향"], ["영세율·면세", "간이과세 업종별 부가가치율", "매입세액 공제"], [{ label: "국가법령정보센터 · 부가가치세법", href: "https://www.law.go.kr/법령/부가가치세법" }]),
  "capital-gains-tax": record("세금", "2026-01-01", "양도가액에서 취득가액·필요경비·기본공제를 차감하고 보유기간·주택 조건에 따른 선택 세율을 적용합니다.", ["입력한 취득·양도가액과 필요경비", "기본 누진세율", "선택한 1세대 1주택 고가주택 안분"], ["실거주·조정대상지역의 모든 특례", "다주택 중과 유예의 개별 판정", "장기보유특별공제 세부 예외"], [incomeTax]),
  "gift-tax": record("세금", "2026-01-02", "증여재산에서 관계별 공제를 뺀 과세표준에 10~50% 누진세율과 누진공제를 적용합니다.", ["관계별 기본공제", "혼인·출산 추가공제 선택", "신고세액공제 입력분"], ["10년 합산 과세의 전체 이력", "부담부증여", "재산평가와 세대생략 할증의 모든 사례"], [inheritanceTax]),
  "inheritance-tax": record("세금", "2026-01-02", "상속재산에서 입력한 공제액을 뺀 과세표준에 10~50% 누진세율과 누진공제를 적용합니다.", ["기초·일괄·배우자 등 입력 공제", "누진세율"], ["재산평가", "사전증여 합산", "가업·영농상속과 세대생략 등 특례"], [inheritanceTax]),
  "acquisition-tax": record("세금", "2026-09-04 확인", "취득가액에 주택 수·가액·지역 선택에 따른 취득세율과 부가세목을 적용합니다.", ["주택 취득가액", "주택 수와 조정대상지역 선택", "지방교육세·농어촌특별세의 단순 반영"], ["생애최초 감면", "일시적 2주택·상속주택 제외", "법인·신축·분양권 특례"], [{ label: "국가법령정보센터 · 지방세법", href: "https://www.law.go.kr/법령/지방세법" }, { label: "위택스 · 지방세 안내", href: "https://www.wetax.go.kr/" }]),
  "car-tax": record("세금", "2026-09-04 확인", "차종·배기량별 세액에 비영업용 승용차의 차령 경감과 지방교육세를 적용합니다.", ["배기량·차종", "차령 경감", "연납 시기별 공제 참고"], ["전기·수소차 외 세부 차종 예외", "지자체별 고지 시점", "자동차 등록 변경의 일할 계산"], [{ label: "국가법령정보센터 · 지방세법 자동차세", href: "https://www.law.go.kr/법령/지방세법" }]),
  "lotto-tax": record("세금", "2026-09-04 확인", "당첨금 구간별 기타소득 원천징수 세율을 적용해 예상 실수령액을 계산합니다.", ["구간별 소득세", "지방소득세"], ["복수 당첨·분할 수령", "해외 복권", "기타 소득과의 개별 신고 영향"], [incomeTax, { label: "동행복권 · 당첨금 지급안내", href: "https://www.dhlottery.co.kr/gameResult.do?method=byWin" }]),
  "brokerage-fee": record("금융", "2026-09-04 확인", "거래금액에 지역·거래종류별 상한요율을 곱하고 법정 한도액과 비교합니다. 월세 거래금액은 보증금 + 월세×100(5천만원 미만이면 ×70)입니다.", ["매매·전세·월세", "주택·오피스텔·그 밖의 중개대상물", "상한요율과 한도액"], ["당사자 협의로 낮아진 보수", "지역 조례 차이", "별도 부가세·실비"], [{ label: "국토교통부 · 중개보수 요율표", href: "https://irts.molit.go.kr/com/cmn/popup/fee/rtecsFeeRtoPopup.do" }]),
  "rent-conversion": record("금융", "2026-09-04 확인", "보증금 차액에 선택한 전월세전환율을 곱한 뒤 12개월로 나눠 월세를 환산합니다.", ["현재·변경 보증금", "사용자가 확인한 전환율"], ["주택 유형별 시장 금리", "관리비", "법 적용 여부와 계약 갱신 특례"], [{ label: "국가법령정보센터 · 주택임대차보호법 시행령", href: "https://www.law.go.kr/법령/주택임대차보호법시행령" }, { label: "한국은행 · 기준금리", href: "https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643" }]),
  loan: record("금융", "사용자가 입력한 금리 기준", "원리금균등 또는 원금균등 방식에 따라 월 이자율과 상환기간으로 상환표를 계산합니다.", ["원금·연이율·기간", "원리금균등/원금균등 선택"], ["만기일시상환", "중도상환수수료", "변동금리 변경", "인지세·보증료", "금융사별 일수 계산"], [{ label: "금융감독원 금융상품통합비교공시", href: "https://finlife.fss.or.kr/" }]),
  deposit: record("금융", "입력 금리 기준", "예치금에 연이율과 기간을 적용하고 단리·복리 선택 및 입력한 이자소득세율을 반영합니다.", ["원금·기간·연이율", "단리/복리", "세율 선택"], ["은행별 일수 계산", "중도해지 금리", "우대조건"], [{ label: "금융감독원 금융상품통합비교공시", href: "https://finlife.fss.or.kr/" }]),
  savings: record("금융", "입력 금리 기준", "매월 납입금별 남은 예치기간에 금리를 적용해 세전·세후 이자를 추정합니다.", ["월 납입액·기간·연이율", "단리/복리", "세율 선택"], ["납입일별 실제 일수", "중도해지·우대금리", "비과세 자격 판정"], [{ label: "금융감독원 금융상품통합비교공시", href: "https://finlife.fss.or.kr/" }]),
  "stock-return": record("금융", "2026-01-01", "매수·매도 금액에서 입력 수수료와 국내주식 거래세를 차감해 손익률을 계산합니다.", ["매매단가·수량", "수수료", "선택 시장 거래세"], ["배당·환율", "금융투자소득 과세의 개인별 적용", "증권사 최소수수료"], [{ label: "국가법령정보센터 · 증권거래세법", href: "https://www.law.go.kr/법령/증권거래세법" }]),
  electricity: record("금융", "2026-09-04 확인", "주택용 저압 사용량 구간별 기본요금·전력량요금에 기후환경요금, 연료비조정액, 부가가치세와 전력기금을 더합니다.", ["계절별 누진구간", "주택용 저압", "세금·기금"], ["복지·다자녀 할인", "고압 아파트", "검침일·연료비조정단가의 청구월 차이"], [{ label: "한국전력 · 전기요금표", href: "https://home.kepco.co.kr/kepco/front/html/CY/E/E/CYEEHP00101.html" }, { label: "한국전력 · 전기요금 계산기", href: "https://cyber.kepco.co.kr/ckepco/front/jsp/CY/J/J/CYJJPP000_SM.jsp" }]),
  "gas-bill": record("금융", "사용자 고지서 단가 기준", "사용량 × 보정계수 × 열량 × 지역 도시가스 단가에 부가가치세를 더합니다.", ["사용량", "고지서의 보정계수·열량·단가"], ["지역별 고정 기본요금", "용도·계절별 단가 자동 조회", "검침 오차"], [{ label: "한국가스공사 · 도시가스 요금 안내", href: "https://www.kogas.or.kr/site/koGas/1040300000000" }]),
  bmi: record("건강", "2026-09-04 확인", "체중(kg) ÷ 신장(m)의 제곱으로 BMI를 계산합니다.", ["성인 키와 체중", "BMI 구간 안내"], ["근육량·체지방 분포", "임신·소아 성장곡선", "질환 진단"], [whoBmi, cdcBmi]),
  bmr: record("건강", "Mifflin-St Jeor·개정 Harris-Benedict 추정식", "성별·나이·키·체중을 두 예측식에 넣어 휴식 에너지 소비량을 비교 추정합니다.", ["성별·연령·키·체중", "두 예측식 비교"], ["체성분·질환·약물", "간접열량측정", "임신·수유"], [{ label: "PubMed · Mifflin-St Jeor 원 연구", href: "https://pubmed.ncbi.nlm.nih.gov/2305711/" }, { label: "PubMed · Harris-Benedict 재평가", href: "https://pubmed.ncbi.nlm.nih.gov/6741850/" }]),
  tdee: record("건강", "Mifflin-St Jeor 식 × 활동계수", "추정 기초대사량에 사용자가 고른 고정 활동계수를 곱합니다.", ["기초대사량 추정", "활동수준 선택"], ["웨어러블 실측", "질환·임신·수유", "개인별 대사 적응"], [{ label: "PubMed · Mifflin-St Jeor 원 연구", href: "https://pubmed.ncbi.nlm.nih.gov/2305711/" }, niddkPlanner]),
  "body-fat": record("건강", "미 해군 둘레 기반 추정식", "키·목·허리와 선택한 엉덩이 둘레를 둘레식에 대입해 체지방률을 추정합니다.", ["입력한 신체 둘레", "성별 선택"], ["공식 해군 신체평가", "DEXA·생체전기저항 실측", "체형·측정자 오차", "의학적 진단"], [{ label: "미 해군 · Body Composition Assessment Guide", href: "https://www.mynavyhr.navy.mil/Portals/55/Support/Culture%20Resilience/Physical/Guide%204%20-%20Body%20Composition%20Assessment.pdf" }, cdcBmi]),
  "standard-weight": record("건강", "세 가지 역사적 참고식", "변형 Broca 식, BMI 22 역산, Devine 약물용량 참고식을 나란히 계산합니다.", ["성인 신장·성별", "세 식의 단순 비교"], ["건강 목표 판정", "근육량·골격", "소아·임신", "약물 용량 결정"], [whoBmi, cdcBmi, { label: "PubMed · 이상체중 공식의 기원과 용도", href: "https://pubmed.ncbi.nlm.nih.gov/10981254/" }]),
  "water-intake": record("건강", "체중 기반 단순 추정", "체중에 고정 ml 계수를 곱하고 활동·기온 선택값을 보정합니다.", ["체중", "활동·기온 입력 보정"], ["음식 속 수분", "심장·신장질환의 수분 제한", "임신·수유의 개별 필요량"], [{ label: "질병관리청 국가건강정보포털", href: "https://health.kdca.go.kr/healthinfo/" }]),
  "due-date": record("건강", "최종 월경 시작일 + 280일", "최종 월경 시작일에 280일을 더해 예정일을 계산합니다.", ["최종 월경 시작일", "주수·삼분기 날짜"], ["불규칙 주기", "배아이식일", "초기 초음파에 따른 의료진 보정"], [acogDueDate]),
  alcohol: record("건강", "Widmark 단순 추정", "섭취 알코올량과 체중·성별 분포계수, 경과시간으로 혈중알코올농도를 거칠게 추정합니다.", ["술의 도수·용량", "체중·성별·경과시간"], ["흡수 속도·음식·약물·간 기능", "측정기 오차", "운전 가능 여부 판단"], [{ label: "CDC · Impaired Driving", href: "https://www.cdc.gov/impaired-driving/about/index.html" }, { label: "CDC · Alcohol and sex considerations", href: "https://www.cdc.gov/alcohol/about-alcohol-use/alcohol-and-sex-considerations.html" }]),
  "macro-diet": record("건강", "고정 영양비율 추천", "추정 TDEE와 목표에 따른 열량 보정 후 단백질·지방·탄수화물 고정 비율로 식단 예시를 구성합니다.", ["성인 신체정보·활동수준", "목표별 열량 보정", "고정 음식 데이터"], ["알레르기·질환·약물", "영양소 결핍 평가", "의료·영양 처방"], [niddkPlanner, { label: "미국 HHS/USDA · 2025–2030 식생활지침", href: "https://odphp.health.gov/our-work/nutrition-physical-activity/dietary-guidelines" }]),
  exercise: record("건강", "고정 운동 데이터 추천", "입력한 목표·경험·환경에 맞는 운동을 내부 규칙표에서 선택해 주간 예시를 구성합니다.", ["목표·경험·가능 장비", "고정 운동 목록"], ["질환·통증·부상 평가", "실제 심박·소모열량 측정", "의료 처방"], [{ label: "미국 HHS · Physical Activity Guidelines", href: "https://health.gov/our-work/nutrition-physical-activity/physical-activity-guidelines" }, niddkPlanner]),
};
