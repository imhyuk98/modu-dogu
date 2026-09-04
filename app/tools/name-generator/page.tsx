"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ================================================================
   Types
   ================================================================ */
type NameTab = "baby" | "pet" | "business" | "game";

interface GeneratedName {
  name: string;
  meaning: string;
  score: number;
}

/* ================================================================
   Tab configuration
   ================================================================ */
const tabConfig: Record<NameTab, { label: string; emoji: string; activeBg: string }> = {
  baby: { label: "아기 이름", emoji: "👶", activeBg: "bg-pink-700" },
  pet: { label: "반려동물", emoji: "🐾", activeBg: "bg-amber-500" },
  business: { label: "사업체 이름", emoji: "🏢", activeBg: "bg-blue-500" },
  game: { label: "게임 캐릭터", emoji: "🎮", activeBg: "bg-purple-500" },
};

/* ================================================================
   Baby Name Database (100+ names)
   ================================================================ */
interface BabyName {
  name: string;
  hanja: string;
  meaning: string;
  gender: "male" | "female" | "unisex";
  categories: string[];
}

const babyNames: BabyName[] = [
  // 남자 - 지혜
  { name: "지훈", hanja: "志勳", meaning: "뜻을 세워 큰 공을 세우는 사람", gender: "male", categories: ["지혜", "용기"] },
  { name: "준혁", hanja: "俊赫", meaning: "준수하고 빛나는 사람", gender: "male", categories: ["지혜", "빛"] },
  { name: "도윤", hanja: "道允", meaning: "바른 길을 따르는 너그러운 사람", gender: "male", categories: ["지혜"] },
  { name: "시우", hanja: "時宇", meaning: "시대를 이끌어가는 넓은 그릇", gender: "male", categories: ["지혜", "용기"] },
  { name: "현우", hanja: "賢宇", meaning: "어질고 지혜로운 사람", gender: "male", categories: ["지혜"] },
  { name: "지호", hanja: "志浩", meaning: "큰 뜻을 품고 넓은 세상을 향하는 사람", gender: "male", categories: ["지혜", "용기"] },
  { name: "민준", hanja: "敏俊", meaning: "민첩하고 준수한 사람", gender: "male", categories: ["지혜"] },
  { name: "서진", hanja: "瑞珍", meaning: "상서롭고 귀한 보배", gender: "male", categories: ["지혜", "행복"] },
  { name: "예준", hanja: "睿俊", meaning: "슬기롭고 뛰어난 사람", gender: "male", categories: ["지혜"] },
  { name: "건우", hanja: "建宇", meaning: "세상을 건설하는 큰 그릇", gender: "male", categories: ["지혜", "용기"] },

  // 남자 - 용기
  { name: "태현", hanja: "泰賢", meaning: "크고 태평하며 현명한 사람", gender: "male", categories: ["용기", "지혜"] },
  { name: "우진", hanja: "宇振", meaning: "세상을 떨치는 큰 인물", gender: "male", categories: ["용기"] },
  { name: "승민", hanja: "承民", meaning: "백성을 이끌고 계승하는 사람", gender: "male", categories: ["용기"] },
  { name: "강민", hanja: "剛敏", meaning: "강하고 민첩한 사람", gender: "male", categories: ["용기"] },
  { name: "준서", hanja: "俊瑞", meaning: "뛰어나고 상서로운 사람", gender: "male", categories: ["용기", "행복"] },
  { name: "동현", hanja: "東賢", meaning: "동쪽의 현명한 빛", gender: "male", categories: ["용기", "빛"] },
  { name: "재윤", hanja: "在潤", meaning: "세상에 윤택함을 가져오는 사람", gender: "male", categories: ["용기", "행복"] },
  { name: "성준", hanja: "成俊", meaning: "이룰 것을 이루는 뛰어난 사람", gender: "male", categories: ["용기"] },

  // 남자 - 자연/빛
  { name: "하준", hanja: "夏俊", meaning: "여름처럼 활기차고 뛰어난 사람", gender: "male", categories: ["자연"] },
  { name: "이준", hanja: "以俊", meaning: "뛰어난 인품으로 세상을 이끄는 사람", gender: "male", categories: ["빛"] },
  { name: "수호", hanja: "守護", meaning: "소중한 것을 지키는 수호자", gender: "male", categories: ["용기", "사랑"] },
  { name: "한결", hanja: "한결", meaning: "변함없이 한결같은 사람 (순우리말)", gender: "male", categories: ["자연"] },
  { name: "은호", hanja: "恩浩", meaning: "은혜가 넓고 큰 사람", gender: "male", categories: ["사랑", "빛"] },
  { name: "율", hanja: "律", meaning: "바른 법도를 지키는 사람", gender: "male", categories: ["지혜"] },
  { name: "산", hanja: "山", meaning: "산처럼 듬직하고 변함없는 사람", gender: "male", categories: ["자연"] },
  { name: "찬", hanja: "燦", meaning: "찬란하게 빛나는 사람", gender: "male", categories: ["빛"] },

  // 남자 - 행복/사랑
  { name: "유준", hanja: "裕俊", meaning: "넉넉하고 뛰어난 사람", gender: "male", categories: ["행복"] },
  { name: "시현", hanja: "時賢", meaning: "때를 아는 현명한 사람", gender: "male", categories: ["지혜", "행복"] },
  { name: "주원", hanja: "周元", meaning: "두루 원만한 사람", gender: "male", categories: ["행복"] },
  { name: "윤호", hanja: "允浩", meaning: "너그럽고 넓은 사람", gender: "male", categories: ["사랑", "행복"] },

  // 여자 - 아름다움
  { name: "서연", hanja: "瑞延", meaning: "상서로운 기운이 뻗어나가는 아이", gender: "female", categories: ["아름다움", "행복"] },
  { name: "지유", hanja: "知柔", meaning: "지혜롭고 부드러운 사람", gender: "female", categories: ["아름다움", "지혜"] },
  { name: "하은", hanja: "夏恩", meaning: "여름 은혜처럼 풍성한 사람", gender: "female", categories: ["아름다움", "자연"] },
  { name: "수아", hanja: "秀雅", meaning: "빼어나고 우아한 사람", gender: "female", categories: ["아름다움"] },
  { name: "지아", hanja: "智雅", meaning: "지혜롭고 우아한 사람", gender: "female", categories: ["아름다움", "지혜"] },
  { name: "서윤", hanja: "瑞潤", meaning: "상서롭고 윤택한 사람", gender: "female", categories: ["아름다움", "행복"] },
  { name: "하윤", hanja: "夏潤", meaning: "여름처럼 빛나고 윤택한 사람", gender: "female", categories: ["아름다움", "자연"] },
  { name: "민서", hanja: "敏瑞", meaning: "민첩하고 상서로운 사람", gender: "female", categories: ["아름다움", "지혜"] },
  { name: "예은", hanja: "禮恩", meaning: "예의 바르고 은혜로운 사람", gender: "female", categories: ["아름다움", "사랑"] },
  { name: "채원", hanja: "彩園", meaning: "아름다운 색채의 동산", gender: "female", categories: ["아름다움", "자연"] },

  // 여자 - 지혜
  { name: "수빈", hanja: "秀彬", meaning: "빼어나고 빛나는 사람", gender: "female", categories: ["지혜", "빛"] },
  { name: "지민", hanja: "智旻", meaning: "지혜로운 하늘", gender: "female", categories: ["지혜", "자연"] },
  { name: "유나", hanja: "柔娜", meaning: "부드럽고 아리따운 사람", gender: "female", categories: ["지혜", "아름다움"] },
  { name: "예린", hanja: "藝麟", meaning: "재주가 뛰어난 귀한 사람", gender: "female", categories: ["지혜"] },
  { name: "다은", hanja: "多恩", meaning: "은혜가 많은 사람", gender: "female", categories: ["지혜", "사랑"] },
  { name: "소율", hanja: "素律", meaning: "순수하고 바른 사람", gender: "female", categories: ["지혜"] },
  { name: "은서", hanja: "恩瑞", meaning: "은혜롭고 상서로운 사람", gender: "female", categories: ["지혜", "행복"] },
  { name: "시은", hanja: "詩恩", meaning: "시처럼 아름다운 은혜", gender: "female", categories: ["지혜", "아름다움"] },

  // 여자 - 자연
  { name: "하린", hanja: "夏麟", meaning: "여름의 귀한 사람", gender: "female", categories: ["자연"] },
  { name: "나윤", hanja: "娜潤", meaning: "아리따우며 윤택한 사람", gender: "female", categories: ["자연", "아름다움"] },
  { name: "소은", hanja: "素恩", meaning: "순수한 은혜를 가진 사람", gender: "female", categories: ["자연", "사랑"] },
  { name: "연우", hanja: "蓮雨", meaning: "연꽃 위의 비처럼 맑은 사람", gender: "female", categories: ["자연"] },
  { name: "봄", hanja: "봄", meaning: "새 생명이 시작되는 봄 (순우리말)", gender: "female", categories: ["자연"] },
  { name: "나래", hanja: "나래", meaning: "날개처럼 자유롭게 (순우리말)", gender: "female", categories: ["자연"] },
  { name: "아라", hanja: "아라", meaning: "바다를 뜻하는 순우리말", gender: "female", categories: ["자연"] },
  { name: "별", hanja: "별", meaning: "하늘의 별처럼 빛나는 존재 (순우리말)", gender: "female", categories: ["자연", "빛"] },

  // 여자 - 행복/빛
  { name: "유진", hanja: "裕珍", meaning: "넉넉하고 귀한 보배", gender: "female", categories: ["행복"] },
  { name: "서현", hanja: "瑞賢", meaning: "상서롭고 현명한 사람", gender: "female", categories: ["행복", "지혜"] },
  { name: "하영", hanja: "夏映", meaning: "여름처럼 밝게 빛나는 사람", gender: "female", categories: ["빛", "자연"] },
  { name: "지원", hanja: "志媛", meaning: "뜻을 가진 아름다운 사람", gender: "female", categories: ["빛", "용기"] },
  { name: "예지", hanja: "睿智", meaning: "슬기롭고 지혜로운 사람", gender: "female", categories: ["빛", "지혜"] },
  { name: "빛나", hanja: "빛나", meaning: "빛처럼 밝게 빛나는 사람 (순우리말)", gender: "female", categories: ["빛"] },

  // 여자 - 사랑
  { name: "사랑", hanja: "사랑", meaning: "모두에게 사랑받는 존재 (순우리말)", gender: "female", categories: ["사랑"] },
  { name: "다인", hanja: "多仁", meaning: "어진 마음이 많은 사람", gender: "female", categories: ["사랑"] },
  { name: "은지", hanja: "恩知", meaning: "은혜를 아는 사람", gender: "female", categories: ["사랑", "지혜"] },
  { name: "하음", hanja: "하음", meaning: "크고 아름다운 소리 (순우리말)", gender: "female", categories: ["사랑", "아름다움"] },

  // 중성 - 다양한 의미
  { name: "하늘", hanja: "하늘", meaning: "하늘처럼 끝없이 넓은 사람 (순우리말)", gender: "unisex", categories: ["자연"] },
  { name: "이슬", hanja: "이슬", meaning: "이슬처럼 맑고 깨끗한 사람 (순우리말)", gender: "unisex", categories: ["자연"] },
  { name: "도담", hanja: "도담", meaning: "건강하게 자라는 아이 (순우리말)", gender: "unisex", categories: ["행복"] },
  { name: "가온", hanja: "가온", meaning: "세상의 중심 (순우리말)", gender: "unisex", categories: ["행복", "용기"] },
  { name: "윤서", hanja: "潤瑞", meaning: "윤택하고 상서로운 사람", gender: "unisex", categories: ["행복", "아름다움"] },
  { name: "시안", hanja: "時安", meaning: "평안한 시대를 여는 사람", gender: "unisex", categories: ["행복"] },
  { name: "리안", hanja: "理安", meaning: "이치에 밝고 편안한 사람", gender: "unisex", categories: ["지혜", "행복"] },
  { name: "단", hanja: "丹", meaning: "붉고 정성스러운 마음", gender: "unisex", categories: ["사랑"] },
  { name: "아인", hanja: "雅人", meaning: "우아한 사람", gender: "unisex", categories: ["아름다움"] },
  { name: "한", hanja: "翰", meaning: "크고 빛나는 날개", gender: "unisex", categories: ["자연", "빛"] },
  { name: "다온", hanja: "다온", meaning: "좋은 모든 것이 오다 (순우리말)", gender: "unisex", categories: ["행복"] },
  { name: "나온", hanja: "나온", meaning: "세상에 나온 귀한 존재 (순우리말)", gender: "unisex", categories: ["행복", "빛"] },
  { name: "새온", hanja: "새온", meaning: "새로운 것이 온다 (순우리말)", gender: "unisex", categories: ["행복"] },
  { name: "결", hanja: "결", meaning: "고운 결을 가진 사람 (순우리말)", gender: "unisex", categories: ["아름다움"] },
  { name: "온", hanja: "溫", meaning: "온화하고 따뜻한 사람", gender: "unisex", categories: ["사랑"] },
  { name: "찬솔", hanja: "찬솔", meaning: "빛나는 소나무처럼 곧은 사람 (순우리말)", gender: "unisex", categories: ["자연", "빛"] },

  // 추가 남자 이름
  { name: "민재", hanja: "旻宰", meaning: "하늘 아래 다스리는 사람", gender: "male", categories: ["용기", "자연"] },
  { name: "정우", hanja: "正宇", meaning: "바르고 넓은 사람", gender: "male", categories: ["지혜"] },
  { name: "현준", hanja: "賢俊", meaning: "어질고 준수한 사람", gender: "male", categories: ["지혜", "아름다움"] },
  { name: "태민", hanja: "泰民", meaning: "태평하게 백성을 다스리는 사람", gender: "male", categories: ["용기"] },
  { name: "지환", hanja: "志煥", meaning: "뜻이 빛나는 사람", gender: "male", categories: ["빛", "용기"] },
  { name: "승현", hanja: "承賢", meaning: "현명함을 이어받은 사람", gender: "male", categories: ["지혜"] },
  { name: "우빈", hanja: "宇彬", meaning: "세상에 빛나는 사람", gender: "male", categories: ["빛"] },
  { name: "세준", hanja: "世俊", meaning: "세상에서 뛰어난 사람", gender: "male", categories: ["용기"] },
  { name: "진우", hanja: "眞宇", meaning: "참되고 넓은 사람", gender: "male", categories: ["지혜", "용기"] },
  { name: "현서", hanja: "賢瑞", meaning: "현명하고 상서로운 사람", gender: "male", categories: ["지혜", "행복"] },

  // 추가 여자 이름
  { name: "윤아", hanja: "潤雅", meaning: "윤택하고 우아한 사람", gender: "female", categories: ["아름다움"] },
  { name: "지현", hanja: "知賢", meaning: "지혜롭고 현명한 사람", gender: "female", categories: ["지혜"] },
  { name: "채영", hanja: "彩英", meaning: "아름다운 빛깔의 꽃", gender: "female", categories: ["아름다움", "자연"] },
  { name: "소영", hanja: "素英", meaning: "순수하고 아름다운 꽃", gender: "female", categories: ["아름다움", "자연"] },
  { name: "은비", hanja: "恩菲", meaning: "은혜로운 향기", gender: "female", categories: ["사랑", "아름다움"] },
  { name: "미래", hanja: "未來", meaning: "밝은 미래를 향해 나아가는 사람", gender: "female", categories: ["빛", "행복"] },
  { name: "세아", hanja: "世雅", meaning: "세상에 우아함을 더하는 사람", gender: "female", categories: ["아름다움"] },
  { name: "시아", hanja: "詩雅", meaning: "시처럼 아름다운 사람", gender: "female", categories: ["아름다움", "지혜"] },
  { name: "하율", hanja: "夏律", meaning: "여름의 율동처럼 활기찬 사람", gender: "female", categories: ["자연", "행복"] },
  { name: "초아", hanja: "初雅", meaning: "처음처럼 순수하고 우아한 사람", gender: "female", categories: ["아름다움"] },
];

const meaningCategories = ["지혜", "용기", "아름다움", "자연", "행복", "빛", "사랑"];

/* ================================================================
   Pet Name Database (60+ per style)
   ================================================================ */
const petNames: Record<string, { cute: string[]; cool: string[]; funny: string[] }> = {
  dog: {
    cute: [
      "콩이", "뭉치", "보리", "초코", "달이", "몽이", "꾸미", "코코", "누리", "봄이",
      "솜이", "두부", "하루", "나비", "까미", "루미", "미미", "구름", "별이", "꿀이",
      "단추", "호두", "모찌", "토리", "복이", "밤이", "쿠키", "도리", "또리", "푸딩",
      "달콤", "찌니", "구슬", "아롱", "다롱", "사랑", "우유", "포도", "딸기", "망고",
      "라떼", "카라멜", "마카롱", "젤리", "사탕", "솜솜", "쿠쿠", "포포", "루루", "나나",
      "체리", "피치", "코코넛", "바닐라", "버블", "허니", "슈가", "미소", "반짝", "눈송이",
      "은하", "무지개", "이슬", "꽃잎", "햇살", "달빛",
    ],
    cool: [
      "제우스", "아레스", "토르", "헤라", "카이저", "레오", "타이탄", "마르스", "네로", "맥스",
      "블레이드", "섀도우", "스톰", "울프", "팽", "킹", "에이스", "발키리", "아폴로", "오딘",
      "프레야", "로키", "헤르메스", "아틀라스", "제트", "블리츠", "타이거", "팬텀", "레이븐", "나이트",
      "무사", "장군", "무적", "황금", "백호", "흑룡", "청룡", "주작", "현무", "용왕",
      "태양", "번개", "폭풍", "화산", "사자", "독수리", "매", "늑대", "표범", "코브라",
      "파이어", "아이스", "드래곤", "피닉스", "나이트폴", "벼락", "천둥", "해일", "대지", "바위",
      "철벽", "강철", "다이아", "빅터", "히어로", "렉스",
    ],
    funny: [
      "멍뭉이", "왈왈이", "깡총이", "방구", "빵빵이", "돼지", "먹보", "게으름", "잠꾸러기", "투덜이",
      "엉뚱이", "장난꾸러기", "개구장이", "통통이", "땅콩", "감자", "고구마", "호박", "가지", "무우",
      "양파", "마늘", "파프리카", "브로콜리", "당근", "배추", "시금치", "고추", "오이", "토마토",
      "김밥", "떡볶이", "순대", "어묵", "호떡", "붕어빵", "만두", "짜장", "짬뽕", "탕수육",
      "치킨", "피자", "햄버거", "라면", "김치", "삼겹살", "족발", "보쌈", "곱창", "마라탕",
      "팥빙수", "냉면", "칼국수", "수제비", "잔치국수", "비빔밥", "불고기", "갈비", "찜닭", "제육",
      "돈까스", "카레", "우동", "소바", "타코야끼", "오므라이스",
    ],
  },
  cat: {
    cute: [
      "나비", "야옹이", "냥이", "루나", "미미", "코코", "모모", "까미", "하양", "구름",
      "달이", "별이", "솜이", "두부", "치즈", "모찌", "꾸미", "봄이", "꽃이", "눈이",
      "라떼", "카푸치노", "아메", "우유", "크림", "바닐라", "캐러멜", "말차", "초코", "딸기",
      "요거트", "푸딩", "마카롱", "젤리", "캔디", "슈가", "허니", "쿠키", "토피", "무스",
      "소다", "시럽", "크로플", "타르트", "에클레어", "티라미수", "브라우니", "머핀", "스콘", "와플",
      "팬케이크", "도넛", "크레페", "슈크림", "카스테라", "롤케이크", "파운드", "쉬폰", "무지개", "은하",
      "오로라", "허브", "로즈", "릴리", "데이지", "자스민",
    ],
    cool: [
      "팬서", "오닉스", "미스트", "섀도우", "미드나이트", "스모크", "에보니", "오셀롯", "링스", "재규어",
      "레파드", "치타", "퓨마", "바스테트", "스핑크스", "라이온", "타이거", "블랙", "그레이", "실버",
      "골드", "다이아", "루비", "사파이어", "에메랄드", "아메시스트", "진주", "오팔", "재스퍼", "토파즈",
      "달빛", "태양", "별빛", "혜성", "유성", "오리온", "시리우스", "카시오페아", "안드로메다", "베가",
      "폴라리스", "알타이르", "아크투루스", "레굴루스", "스피카", "데네브", "리겔", "프로키온", "카펠라", "알데바란",
      "미라", "칸", "소마", "카르마", "젠", "아우라", "엘리트", "노블", "로얄", "프린스",
      "임페리얼", "마제스틱", "그랜드", "셀레스트", "루미너스", "레이디언트",
    ],
    funny: [
      "냥냥이", "미야옹", "츄르중독", "캣닢", "골골이", "집사", "고냥이", "야옹야옹", "냥냥펀치", "집사부르기",
      "참치", "연어", "닭가슴", "새우깡", "소시지", "햄", "치킨너겟", "스팸", "베이컨", "살라미",
      "고등어", "삼치", "갈치", "꽁치", "멸치", "오징어", "문어", "낙지", "조개", "전복",
      "랍스터", "크랩", "굴", "홍합", "가리비", "성게", "해삼", "미역", "다시마", "김",
      "야근중", "택배왔다", "뒹굴뒹굴", "늘어져", "박스러브", "키보드위", "모니터뒤", "커튼뒤", "선반위", "서랍속",
      "냉장고위", "소파아래", "이불속", "방구석", "창문턱", "베란다", "가방속", "신발위", "세탁기위", "옷장속",
      "꾹꾹이", "그루밍", "꼬리흔들", "배뒤집기", "빵만들기", "앞발모아",
    ],
  },
  etc: {
    cute: [
      "또또", "쪼꼬", "미니", "아기", "꼬마", "콩알", "새싹", "동글", "포롱", "호롱",
      "깜찍이", "앙", "쮸", "뽀뽀", "방울", "방울이", "딸랑이", "종이", "물방울", "요정",
      "엔젤", "페어리", "님프", "픽시", "유니콘", "레인보우", "스타", "문", "선", "클라우드",
      "드림", "위시", "매직", "스파클", "글리터", "트윙클", "샤인", "글로우", "블룸", "블로썸",
      "페탈", "리프", "시드", "버드", "스프링", "오텀", "윈터", "썸머", "스노우", "레인",
      "미스티", "브리즈", "웨이브", "코랄", "펄", "쉘", "샌드", "디저트", "포레스트", "가든",
      "메도우", "밸리", "힐", "레이크", "리버", "오션",
    ],
    cool: [
      "아틀라스", "제우스", "오딘", "토르", "로키", "프레야", "발키리", "아레스", "헤르메스", "포세이돈",
      "하데스", "아폴로", "아르테미스", "아테나", "디오니소스", "헤파이토스", "데메테르", "페르세포네", "이카루스", "테세우스",
      "아킬레스", "헤라클레스", "오디세우스", "페르세우스", "프로메테우스", "판도라", "메두사", "켈베로스", "페가수스", "미노타우로스",
      "센타우로스", "키메라", "하이드라", "그리폰", "피닉스", "드래곤", "와이번", "바실리스크", "크라켄", "리바이어던",
      "베히모스", "유니콘", "페가수스", "만티코어", "스핑크스", "가고일", "골렘", "리치", "팬텀", "스펙터",
      "나이트메어", "미스틱", "엘리시온", "아르카디아", "올림푸스", "발할라", "아스가르드", "카멜롯", "아틀란티스", "엘도라도",
      "샹그릴라", "유토피아", "엑스칼리버", "듀란달", "롱기누스", "미올니르",
    ],
    funny: [
      "댕댕이", "짹짹이", "삐약이", "꽥꽥이", "꿀꿀이", "음메", "매에", "꼬끼오", "개굴이", "꿈틀이",
      "알밤", "도토리", "밤송이", "솔방울", "연꽃", "해바라기", "민들레", "코스모스", "장미", "튤립",
      "수선화", "라벤더", "카네이션", "백합", "국화", "벚꽃", "진달래", "개나리", "무궁화", "목련",
      "매화", "동백", "수국", "아이리스", "프리지아", "히아신스", "클로버", "데이지", "팬지", "제비꽃",
      "나팔꽃", "달리아", "거베라", "카모마일", "재스민", "라일락", "안개꽃", "금잔화", "해당화", "능소화",
      "배롱나무", "소나무", "대나무", "은행나무", "단풍나무", "버드나무", "벗나무", "감나무", "사과나무", "귤나무",
      "포도나무", "복숭아나무", "매실나무", "자두나무", "살구나무", "호두나무",
    ],
  },
};

/* ================================================================
   Business Name Database
   ================================================================ */
const businessDB = {
  modern: {
    prefixes: [
      "넥스트", "프라임", "스마트", "퓨처", "이노", "테크", "디지털", "클라우드",
      "비전", "코어", "글로벌", "알파", "오메가", "제니스", "버텍스", "피크",
      "엘리트", "프론트", "모멘텀", "시너지", "인피니트", "퀀텀", "네오", "젠",
    ],
    suffixes: [
      "랩", "허브", "스페이스", "플러스", "프로", "솔루션", "네트워크", "시스템",
      "그룹", "파트너스", "코퍼레이션", "인더스트리", "벤처스", "캐피탈", "리서치", "미디어",
    ],
    connectors: ["앤", "&", "플러스", ""],
  },
  traditional: {
    prefixes: [
      "대한", "한성", "동방", "청운", "태양", "금강", "백두", "한라",
      "아리", "나라", "이음", "바른", "으뜸", "한길", "큰솔", "참",
      "새한", "미래", "푸른", "든든", "신한", "일등", "정인", "다움",
    ],
    suffixes: [
      "상사", "산업", "통상", "건설", "물산", "유통", "기업", "공업",
      "제약", "식품", "농산", "무역", "개발", "정밀", "전자", "에너지",
    ],
    connectors: [""],
  },
  friendly: {
    prefixes: [
      "행복한", "따뜻한", "즐거운", "편안한", "밝은", "사랑의", "우리", "함께",
      "소중한", "작은", "달콤한", "향기로운", "싱그러운", "정다운", "다정한", "포근한",
      "아늑한", "고운", "맑은", "깨끗한", "상쾌한", "건강한", "자연의", "초록",
    ],
    suffixes: [
      "마을", "이야기", "공방", "아뜰리에", "하우스", "가든", "키친", "카페",
      "스토리", "빌리지", "쿠킹", "베이커리", "플라워", "라이프", "테라스", "살롱",
    ],
    connectors: [" ", "의 "],
  },
};

/* ================================================================
   Game Character Name Database
   ================================================================ */
const gameCharDB = {
  rpg: {
    prefixes: ["아이언", "다크", "실버", "골든", "크리스탈", "블러드", "스타", "쉐도우", "선라이즈", "문라이트",
      "세이크리드", "커스드", "에인션트", "로열", "드래곤", "피닉스", "엘프", "드워프"],
    names: ["나이트", "팔라딘", "아사신", "레인저", "소서러", "네크로맨서", "위자드", "워록", "클레릭", "드루이드",
      "바바리안", "글래디에이터", "센티넬", "템플러", "크루세이더", "발키리", "세이지", "버서커"],
    suffixes: ["블레이드", "소울", "하트", "본", "브링어", "워커", "세이버", "스트라이커"],
  },
  fps: {
    prefixes: ["택티컬", "사일런트", "래피드", "프로스트", "블레이즈", "고스트", "스텔스", "벤전스",
      "레이지", "데들리", "레서", "바이퍼", "스나이퍼", "스페셜", "코버트", "로그"],
    names: ["헌터", "리퍼", "스나이퍼", "에이전트", "솔저", "레인저", "커맨더", "파일럿",
      "스카우트", "가디언", "옵스", "델타", "브라보", "알파", "오스카", "탱고"],
    suffixes: ["원", "프라임", "엘리트", "X", "제로", "오메가"],
  },
  mmorpg: {
    prefixes: ["엘더", "아케인", "이터널", "미스틱", "셀레스티얼", "인페르널", "디바인", "보이드",
      "프라이멀", "룬", "에테리얼", "어비셜", "래디언트", "쉐도우", "크로노", "아스트랄"],
    names: ["세이지", "오라클", "챔피온", "프로펫", "가디언", "디펜더", "아바타", "히어로",
      "마스터", "로드", "에이스", "스톰브링어", "라이트브링어", "듀얼리스트", "원더러", "시커"],
    suffixes: ["오브라이트", "오브다크", "오브카오스", "오브오더", "본", "브레이커", "포지", "워든"],
  },
  casual: {
    prefixes: ["해피", "럭키", "슈퍼", "울트라", "메가", "매직", "크레이지", "펑키",
      "쿨", "어메이징", "판타스틱", "원더풀", "스페셜", "레전드", "에픽", "미라클"],
    names: ["플레이어", "게이머", "스타", "챔프", "마스터", "킹", "퀸", "보스",
      "히어로", "닌자", "사무라이", "파이터", "워리어", "런너", "댄서", "드리머"],
    suffixes: ["짱", "왕", "신", "고수", "달인", "프로", "매니아", "마니아"],
  },
};

/* ================================================================
   Helper functions
   ================================================================ */
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomScore(): number {
  return Math.floor(Math.random() * 21) + 80; // 80-100
}

function generateBabyNames(
  lastName: string,
  gender: "male" | "female" | "all",
  categories: string[],
  charCount: "2" | "3"
): GeneratedName[] {
  let pool = babyNames.filter((n) => {
    if (gender !== "all" && n.gender !== gender && n.gender !== "unisex") return false;
    if (categories.length > 0 && !categories.some((c) => n.categories.includes(c))) return false;
    if (charCount === "2" && n.name.length !== 1) return false;
    if (charCount === "3" && n.name.length !== 2) return false;
    return true;
  });

  // If pool is too small, relax category filter
  if (pool.length < 5) {
    pool = babyNames.filter((n) => {
      if (gender !== "all" && n.gender !== gender && n.gender !== "unisex") return false;
      if (charCount === "2" && n.name.length !== 1) return false;
      if (charCount === "3" && n.name.length !== 2) return false;
      return true;
    });
  }

  // Shuffle and pick 5
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 5).map((n) => ({
    name: lastName + n.name,
    meaning: `${n.hanja !== n.name ? `(${n.hanja}) ` : ""}${n.meaning}`,
    score: randomScore(),
  }));
}

function generatePetNames(
  animal: string,
  style: "cute" | "cool" | "funny"
): GeneratedName[] {
  const key = animal === "dog" ? "dog" : animal === "cat" ? "cat" : "etc";
  const pool = petNames[key][style];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const styleDesc: Record<string, string> = {
    cute: "귀엽고 사랑스러운 느낌의 이름",
    cool: "멋지고 강인한 느낌의 이름",
    funny: "유머러스하고 재미있는 이름",
  };
  return shuffled.slice(0, 5).map((name) => ({
    name,
    meaning: styleDesc[style],
    score: randomScore(),
  }));
}

function generateBusinessNames(
  industry: string,
  keyword: string,
  style: "modern" | "traditional" | "friendly"
): GeneratedName[] {
  const db = businessDB[style];
  const results: GeneratedName[] = [];
  const used = new Set<string>();
  const styleDesc: Record<string, string> = {
    modern: "현대적이고 세련된 느낌",
    traditional: "신뢰감 있는 전통적 느낌",
    friendly: "친근하고 따뜻한 느낌",
  };

  let attempts = 0;
  while (results.length < 5 && attempts < 100) {
    attempts++;
    const prefix = pick(db.prefixes);
    const suffix = pick(db.suffixes);
    const connector = pick(db.connectors);
    let name: string;

    if (keyword && Math.random() > 0.5) {
      name = `${prefix}${connector}${keyword}`;
    } else {
      name = `${prefix}${connector}${suffix}`;
    }

    if (!used.has(name)) {
      used.add(name);
      results.push({
        name,
        meaning: `${styleDesc[style]} | ${industry} 분야에 적합`,
        score: randomScore(),
      });
    }
  }
  return results;
}

function generateGameNames(
  genre: string,
  feel: string
): GeneratedName[] {
  const key = genre === "fps" ? "fps" : genre === "mmorpg" ? "mmorpg" : genre === "casual" ? "casual" : "rpg";
  const db = gameCharDB[key];
  const results: GeneratedName[] = [];
  const used = new Set<string>();

  let attempts = 0;
  while (results.length < 5 && attempts < 100) {
    attempts++;
    const prefix = pick(db.prefixes);
    const name = pick(db.names);
    const suffix = pick(db.suffixes);
    const num = Math.floor(Math.random() * 100);

    const patterns = [
      `${prefix}${name}`,
      `${name}${suffix}`,
      `${prefix}${name}${num}`,
      `${prefix}${suffix}`,
      `${name}${num}`,
    ];
    const chosen = pick(patterns);

    if (!used.has(chosen)) {
      used.add(chosen);
      results.push({
        name: chosen,
        meaning: `${feel ? feel + " 느낌의 " : ""}${genre.toUpperCase()} 게임 캐릭터 이름`,
        score: randomScore(),
      });
    }
  }
  return results;
}

/* ================================================================
   FAQ Data
   ================================================================ */
const faqData = [
  {
    q: "한국 이름에서 성(姓)과 이름은 어떻게 구성되나요?",
    a: "한국 이름은 보통 성 1글자 + 이름 1~2글자로 구성됩니다. 예를 들어 '김지훈'에서 '김'이 성이고 '지훈'이 이름입니다. 성은 약 300개 정도가 있으며, 김, 이, 박, 최, 정이 가장 많습니다.",
  },
  {
    q: "돌림자(항렬)란 무엇인가요?",
    a: "돌림자는 같은 세대(항렬)에 속하는 가족 구성원이 공유하는 글자입니다. 전통적으로 족보에 따라 정해지며, 같은 세대의 사촌들이 이름에 같은 글자를 공유합니다. 현대에는 점차 사용이 줄고 있습니다.",
  },
  {
    q: "한자 이름과 순우리말 이름의 차이는?",
    a: "한자 이름은 한자의 뜻을 조합하여 깊은 의미를 담는 전통적 방식입니다. 순우리말 이름(예: 하늘, 이슬, 나래)은 한자 없이 고유한 한국어 단어를 사용합니다. 최근에는 순우리말 이름도 많이 선호됩니다.",
  },
  {
    q: "이름을 지을 때 고려해야 할 점은?",
    a: "발음이 자연스러운지, 성과의 조화가 좋은지, 불쾌한 의미의 동음이의어가 없는지 확인하세요. 또한 이름의 한자 뜻이 긍정적인지, 획수가 적절한지도 고려하는 것이 좋습니다.",
  },
  {
    q: "반려동물 이름은 어떻게 짓는 것이 좋나요?",
    a: "반려동물은 짧고 부르기 쉬운 2~3음절 이름이 좋습니다. 동물이 자기 이름에 반응하려면 명확한 발음이 중요합니다. 외모 특징, 성격, 좋아하는 음식 등에서 영감을 얻으면 특별한 이름을 지을 수 있습니다.",
  },
  {
    q: "사업체 이름을 정할 때 주의사항은?",
    a: "상호등기 시 동일 시/군/구 내 같은 업종에서 동일 상호를 사용할 수 없습니다. 상표등록 여부도 확인해야 합니다. 인터넷 도메인 확보가 가능한지, 발음이 쉽고 기억하기 좋은지도 중요합니다.",
  },
];

/* ================================================================
   Main Component
   ================================================================ */
export default function NameGenerator() {
  const [activeTab, setActiveTab] = useState<NameTab>("baby");
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Baby inputs
  const [lastName, setLastName] = useState("김");
  const [babyGender, setBabyGender] = useState<"male" | "female" | "all">("all");
  const [babyCategories, setBabyCategories] = useState<string[]>([]);
  const [charCount, setCharCount] = useState<"2" | "3">("3");

  // Pet inputs
  const [petAnimal, setPetAnimal] = useState("dog");
  const [petStyle, setPetStyle] = useState<"cute" | "cool" | "funny">("cute");

  // Business inputs
  const [bizIndustry, setBizIndustry] = useState("");
  const [bizKeyword, setBizKeyword] = useState("");
  const [bizStyle, setBizStyle] = useState<"modern" | "traditional" | "friendly">("modern");

  // Game inputs
  const [gameGenre, setGameGenre] = useState("rpg");
  const [gameFeel, setGameFeel] = useState("");

  const handleGenerate = useCallback(() => {
    setCopiedIndex(null);
    switch (activeTab) {
      case "baby":
        setResults(generateBabyNames(lastName, babyGender, babyCategories, charCount));
        break;
      case "pet":
        setResults(generatePetNames(petAnimal, petStyle));
        break;
      case "business":
        setResults(generateBusinessNames(bizIndustry || "일반", bizKeyword, bizStyle));
        break;
      case "game":
        setResults(generateGameNames(gameGenre, gameFeel));
        break;
    }
  }, [activeTab, lastName, babyGender, babyCategories, charCount, petAnimal, petStyle, bizIndustry, bizKeyword, bizStyle, gameGenre, gameFeel]);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const toggleCategory = (cat: string) => {
    setBabyCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const currentTab = tabConfig[activeTab];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        이름 후보 추천
      </h1>
      <p className="text-gray-500 mb-8">
        아기 이름, 반려동물 이름, 사업체 이름, 게임 캐릭터 이름을 도구가 추천해 드립니다.
      </p>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {(Object.keys(tabConfig) as NameTab[]).map((tab) => {
          const cfg = tabConfig[tab];
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setResults([]); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                isActive
                  ? `${cfg.activeBg} text-white shadow-md`
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{cfg.emoji}</span>
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Input Section */}
      <div className="calc-card p-6 mb-6">
        {/* Baby Name Inputs */}
        {activeTab === "baby" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성(姓)</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={2}
                placeholder="예: 김"
                className="calc-input max-w-[120px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
              <div className="flex gap-2">
                {([
                  { value: "all", label: "전체" },
                  { value: "male", label: "남자" },
                  { value: "female", label: "여자" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBabyGender(opt.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      babyGender === opt.value
                        ? "bg-pink-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                원하는 의미/느낌 (복수 선택 가능)
              </label>
              <div className="flex flex-wrap gap-2">
                {meaningCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      babyCategories.includes(cat)
                        ? "bg-pink-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">글자수</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setCharCount("2")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    charCount === "2"
                      ? "bg-pink-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  2자 (성+1)
                </button>
                <button
                  onClick={() => setCharCount("3")}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    charCount === "3"
                      ? "bg-pink-700 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  3자 (성+2)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pet Name Inputs */}
        {activeTab === "pet" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">동물 종류</label>
              <div className="flex gap-2">
                {([
                  { value: "dog", label: "강아지", emoji: "🐶" },
                  { value: "cat", label: "고양이", emoji: "🐱" },
                  { value: "etc", label: "기타", emoji: "🐹" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPetAnimal(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      petAnimal === opt.value
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">스타일</label>
              <div className="flex gap-2">
                {([
                  { value: "cute", label: "귀여운", emoji: "💕" },
                  { value: "cool", label: "멋진", emoji: "⚡" },
                  { value: "funny", label: "웃긴", emoji: "😂" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPetStyle(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      petStyle === opt.value
                        ? "bg-amber-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Business Name Inputs */}
        {activeTab === "business" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">업종</label>
              <input
                type="text"
                value={bizIndustry}
                onChange={(e) => setBizIndustry(e.target.value)}
                placeholder="예: IT, 카페, 건설, 유통..."
                className="calc-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                키워드 (선택)
              </label>
              <input
                type="text"
                value={bizKeyword}
                onChange={(e) => setBizKeyword(e.target.value)}
                placeholder="예: 테크, 그린, 블루..."
                className="calc-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">느낌</label>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: "modern", label: "모던/세련", emoji: "🏙️" },
                  { value: "traditional", label: "전통/신뢰", emoji: "🏛️" },
                  { value: "friendly", label: "친근/따뜻", emoji: "🌿" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setBizStyle(opt.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      bizStyle === opt.value
                        ? "bg-blue-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span>{opt.emoji}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Game Character Inputs */}
        {activeTab === "game" && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">게임 장르</label>
              <div className="flex gap-2 flex-wrap">
                {([
                  { value: "rpg", label: "RPG" },
                  { value: "fps", label: "FPS/슈팅" },
                  { value: "mmorpg", label: "MMORPG" },
                  { value: "casual", label: "캐주얼" },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setGameGenre(opt.value)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      gameGenre === opt.value
                        ? "bg-purple-500 text-white shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종족/직업/느낌 (선택)
              </label>
              <input
                type="text"
                value={gameFeel}
                onChange={(e) => setGameFeel(e.target.value)}
                placeholder="예: 전사, 마법사, 어둠의..."
                className="calc-input"
              />
            </div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          className={`w-full mt-6 py-3.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg text-lg text-white ${currentTab.activeBg}`}
        >
          이름 생성하기
        </button>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="calc-card overflow-hidden mb-6">
          <div className={`${currentTab.activeBg} text-white p-4 text-center`}>
            <p className="text-lg font-bold">
              {currentTab.emoji} {currentTab.label} 추천 결과
            </p>
          </div>

          <div className="p-4 space-y-3">
            {results.map((item, i) => (
              <div
                key={`${item.name}-${i}`}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <span className="text-gray-400 text-sm font-mono w-6 text-right pt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg font-bold text-gray-900">{item.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      item.score >= 95 ? "bg-red-100 text-red-600" :
                      item.score >= 90 ? "bg-orange-100 text-orange-600" :
                      "bg-blue-100 text-blue-600"
                    }`}>
                      궁합 {item.score}점
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.meaning}</p>
                </div>
                <button
                  onClick={() => handleCopy(item.name, i)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    copiedIndex === i
                      ? "bg-green-100 text-green-700"
                      : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700 opacity-70 group-hover:opacity-100"
                  }`}
                >
                  {copiedIndex === i ? "복사됨!" : "복사"}
                </button>
              </div>
            ))}

            <button
              onClick={handleGenerate}
              className="w-full mt-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              다시 생성
            </button>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">자주 묻는 질문 (FAQ)</h2>
        <div className="calc-faq">
          {faqData.map((item, i) => (
            <div key={i} className="calc-faq-item">
              <button
                className="calc-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="calc-faq-a">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이름 후보 추천란?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            이름 후보 추천는 아기 이름, 반려동물 이름, 사업체 이름, 게임 캐릭터 이름을 자동으로 추천해주는 무료 온라인 도구입니다.
            한자 뜻풀이가 포함된 아기 이름 데이터베이스를 기반으로 성별, 원하는 의미, 글자수에 맞는 최적의 이름을 제안합니다.
            반려동물 이름은 귀여운, 멋진, 웃긴 스타일별로 분류되어 있어 반려동물의 성격에 맞는 이름을 쉽게 찾을 수 있습니다.
          </p>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">이름 짓기 팁</h2>
          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              <strong>아기 이름:</strong> 한자의 획수, 음양오행, 발음의 조화를 고려하세요.
              성과 이름을 함께 불렀을 때 자연스러운 발음이 중요합니다. 또한 이니셜이나 약자가 부정적 의미를 갖지 않는지 확인하세요.
            </p>
            <p>
              <strong>반려동물 이름:</strong> 2~3음절의 짧은 이름이 동물이 인식하기 쉽습니다.
              발음이 명확하고 다른 명령어와 혼동되지 않는 이름을 선택하세요.
            </p>
            <p>
              <strong>사업체 이름:</strong> 기억하기 쉽고 업종을 직관적으로 알 수 있는 이름이 좋습니다.
              도메인, 상표 등록 가능 여부도 함께 확인하세요.
            </p>
          </div>
        </div>
      </section>

      <RelatedTools current="name-generator" />
    </div>
  );
}
