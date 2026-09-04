"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */
type Gender = "남성" | "여성";
type BodyType = "마른" | "보통" | "통통" | "근육질";
type Situation = "출근" | "데이트" | "캐주얼" | "소개팅" | "면접" | "여행" | "운동" | "결혼식" | "파티";
type Season = "봄(10~20℃)" | "여름(25℃~)" | "가을(10~20℃)" | "겨울(~10℃)" | "환절기";
type Style = "미니멀" | "캐주얼" | "스트릿" | "클래식" | "로맨틱" | "스포티" | "비즈니스";
type ColorPref = "무채색" | "파스텔" | "비비드" | "어스톤" | "상관없음";
type Budget = "~5만원" | "~10만원" | "~20만원" | "~50만원" | "상관없음";

interface OutfitPiece {
  item: string;
  color: string;
  tip: string;
}

interface Outfit {
  name: string;
  gender: Gender;
  top: OutfitPiece;
  bottom: OutfitPiece;
  outer: OutfitPiece | null;
  shoes: OutfitPiece;
  accessories: OutfitPiece;
  situations: Situation[];
  seasons: Season[];
  styles: Style[];
  bodyTypes: BodyType[];
  budgetLevel: number; // 1~5
  colorTone: ColorPref[];
  description: string;
  stylingTip: string;
  colors: string[]; // hex palette
}

/* ══════════════════════════════════════════
   Constants
   ══════════════════════════════════════════ */
const GENDERS: Gender[] = ["남성", "여성"];
const BODY_TYPES: BodyType[] = ["마른", "보통", "통통", "근육질"];
const SITUATIONS: Situation[] = ["출근", "데이트", "캐주얼", "소개팅", "면접", "여행", "운동", "결혼식", "파티"];
const SEASONS: Season[] = ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)", "겨울(~10℃)", "환절기"];
const STYLES: Style[] = ["미니멀", "캐주얼", "스트릿", "클래식", "로맨틱", "스포티", "비즈니스"];
const COLOR_PREFS: ColorPref[] = ["무채색", "파스텔", "비비드", "어스톤", "상관없음"];
const BUDGETS: Budget[] = ["~5만원", "~10만원", "~20만원", "~50만원", "상관없음"];

const BUDGET_LEVEL: Record<Budget, number> = {
  "~5만원": 1,
  "~10만원": 2,
  "~20만원": 3,
  "~50만원": 4,
  "상관없음": 5,
};

const SITUATION_EMOJI: Record<Situation, string> = {
  "출근": "💼", "데이트": "💕", "캐주얼": "😎", "소개팅": "💘",
  "면접": "🤝", "여행": "✈️", "운동": "🏃", "결혼식": "💒", "파티": "🎉",
};

const STYLE_BADGE: Record<Style, string> = {
  "미니멀": "🤍", "캐주얼": "👕", "스트릿": "🧢", "클래식": "🎩",
  "로맨틱": "🌸", "스포티": "⚡", "비즈니스": "👔",
};

/* ══════════════════════════════════════════
   Outfit Database — 남성 (60+)
   ══════════════════════════════════════════ */
const MALE_OUTFITS: Outfit[] = [
  // 출근 코디
  { name: "모던 오피스룩", gender: "남성", top: { item: "슬림핏 화이트 셔츠", color: "화이트", tip: "깔끔하게 다림질하여 단정한 느낌" }, bottom: { item: "네이비 슬랙스", color: "네이비", tip: "테이퍼드핏으로 깔끔하게" }, outer: { item: "차콜 블레이저", color: "차콜", tip: "어깨 라인이 딱 맞는 사이즈" }, shoes: { item: "블랙 더비슈즈", color: "블랙", tip: "광택 있는 가죽 소재" }, accessories: { item: "실버 시계", color: "실버", tip: "심플한 메탈 밴드" }, situations: ["출근", "면접"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["비즈니스", "클래식", "미니멀"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 3, colorTone: ["무채색"], description: "깔끔하고 단정한 오피스 스타일", stylingTip: "셔츠 소매를 블레이저 밖으로 1cm 정도 보이게 하면 세련된 느낌", colors: ["#FFFFFF", "#1B3A5C", "#36454F", "#000000", "#C0C0C0"] },
  { name: "비즈니스 캐주얼", gender: "남성", top: { item: "스카이블루 옥스포드 셔츠", color: "스카이블루", tip: "단추 하나 풀어 여유 있게" }, bottom: { item: "베이지 치노팬츠", color: "베이지", tip: "롤업하면 캐주얼한 느낌" }, outer: null, shoes: { item: "브라운 로퍼", color: "브라운", tip: "양말은 무채색으로" }, accessories: { item: "가죽 벨트", color: "브라운", tip: "구두와 벨트 컬러 통일" }, situations: ["출근", "캐주얼"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["비즈니스", "캐주얼"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 2, colorTone: ["파스텔", "어스톤"], description: "격식과 편안함을 동시에", stylingTip: "팬츠 끝단을 한 번 접어 발목을 드러내면 세련된 무드", colors: ["#87CEEB", "#F5F5DC", "#8B4513", "#8B4513"] },
  { name: "포멀 수트룩", gender: "남성", top: { item: "라이트그레이 드레스셔츠", color: "라이트그레이", tip: "카라가 깔끔한 레귤러핏" }, bottom: { item: "다크네이비 수트 팬츠", color: "다크네이비", tip: "구김 없이 프레스" }, outer: { item: "다크네이비 수트 재킷", color: "다크네이비", tip: "2버튼 싱글 브레스티드" }, shoes: { item: "블랙 옥스포드", color: "블랙", tip: "캡토 디자인 추천" }, accessories: { item: "실크 넥타이", color: "버건디", tip: "풀윈저 매듭 추천" }, situations: ["면접", "결혼식"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "겨울(~10℃)", "환절기"], styles: ["클래식", "비즈니스"], bodyTypes: ["보통", "마른", "근육질", "통통"], budgetLevel: 4, colorTone: ["무채색"], description: "격식 있는 자리에 완벽한 정장", stylingTip: "수트 재킷 버튼은 서 있을 때 잠그고 앉을 때 푸세요", colors: ["#D3D3D3", "#1B2A4A", "#1B2A4A", "#000000", "#800020"] },
  // 데이트 코디
  { name: "로맨틱 데이트룩", gender: "남성", top: { item: "크림색 니트", color: "크림", tip: "부드러운 캐시미어 터치" }, bottom: { item: "다크그레이 슬랙스", color: "다크그레이", tip: "핏이 좋은 스트레이트" }, outer: { item: "캐멀 코트", color: "캐멀", tip: "무릎 기장이 클래식" }, shoes: { item: "브라운 첼시부츠", color: "브라운", tip: "스웨이드 소재 추천" }, accessories: { item: "머플러", color: "베이지", tip: "자연스럽게 감아 드레이프" }, situations: ["데이트", "소개팅"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["클래식", "로맨틱"], bodyTypes: ["보통", "마른"], budgetLevel: 4, colorTone: ["어스톤", "무채색"], description: "따뜻하고 세련된 가을/겨울 데이트룩", stylingTip: "따뜻한 톤의 색상을 매치하면 부드러운 인상을 줍니다", colors: ["#FFFDD0", "#696969", "#C19A6B", "#8B4513", "#F5F5DC"] },
  { name: "깔끔 캐주얼 데이트", gender: "남성", top: { item: "네이비 반팔 린넨셔츠", color: "네이비", tip: "적당히 여유 있는 핏" }, bottom: { item: "화이트 면바지", color: "화이트", tip: "살짝 와이드한 핏" }, outer: null, shoes: { item: "화이트 캔버스 스니커즈", color: "화이트", tip: "깨끗하게 관리" }, accessories: { item: "실버 팔찌", color: "실버", tip: "얇은 체인 타입" }, situations: ["데이트", "캐주얼"], seasons: ["여름(25℃~)", "봄(10~20℃)"], styles: ["캐주얼", "미니멀"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "여름 데이트에 적합한 청량한 룩", stylingTip: "린넨 소재는 구김이 자연스러워 오히려 멋스러움", colors: ["#1B3A5C", "#FFFFFF", "#FFFFFF", "#C0C0C0"] },
  // 캐주얼
  { name: "데일리 캐주얼", gender: "남성", top: { item: "그레이 크루넥 티셔츠", color: "그레이", tip: "적당한 두께감으로 라인 살리기" }, bottom: { item: "인디고 데님 진", color: "인디고", tip: "슬림 스트레이트핏" }, outer: null, shoes: { item: "블랙 컨버스", color: "블랙", tip: "로우컷 기본 모델" }, accessories: { item: "캡 모자", color: "블랙", tip: "무지 볼캡이 무난" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["캐주얼", "미니멀"], bodyTypes: ["보통", "마른", "근육질", "통통"], budgetLevel: 1, colorTone: ["무채색"], description: "매일 입기 좋은 기본 캐주얼", stylingTip: "단색 티에 데님 조합은 실패 없는 공식", colors: ["#808080", "#3F5277", "#000000", "#000000"] },
  { name: "스트릿 캐주얼", gender: "남성", top: { item: "오버사이즈 그래픽 티", color: "블랙", tip: "큰 로고나 프린트 포인트" }, bottom: { item: "와이드 카고팬츠", color: "카키", tip: "밑단이 넓은 와이드핏" }, outer: null, shoes: { item: "뉴발란스 530", color: "화이트/실버", tip: "볼륨감 있는 어글리슈즈" }, accessories: { item: "비니", color: "블랙", tip: "얕게 눌러 쓰기" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["스트릿", "캐주얼"], bodyTypes: ["보통", "마른"], budgetLevel: 2, colorTone: ["무채색", "어스톤"], description: "트렌디한 스트릿 감성", stylingTip: "상의는 타이트하게, 하의는 넉넉하게 실루엣 대비", colors: ["#000000", "#5C6B3C", "#FFFFFF", "#000000"] },
  // 소개팅
  { name: "첫인상 소개팅룩", gender: "남성", top: { item: "화이트 헨리넥 티", color: "화이트", tip: "단추 하나만 풀어 여유 있게" }, bottom: { item: "네이비 슬랙스", color: "네이비", tip: "스트레이트핏으로 단정하게" }, outer: { item: "베이지 가디건", color: "베이지", tip: "어깨에 살짝 걸쳐도 멋" }, shoes: { item: "화이트 가죽 스니커즈", color: "화이트", tip: "미니멀한 디자인" }, accessories: { item: "가죽 팔찌", color: "브라운", tip: "단독 착용이 깔끔" }, situations: ["소개팅", "데이트"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["캐주얼", "미니멀", "로맨틱"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 2, colorTone: ["무채색", "어스톤"], description: "호감형 첫인상을 위한 깔끔한 룩", stylingTip: "무채색 + 한 가지 포인트 컬러로 센스 있는 인상", colors: ["#FFFFFF", "#1B3A5C", "#F5F5DC", "#FFFFFF", "#8B4513"] },
  // 여행
  { name: "편안한 여행룩", gender: "남성", top: { item: "스트라이프 반팔 티", color: "네이비/화이트", tip: "마린 스트라이프 추천" }, bottom: { item: "베이지 반바지", color: "베이지", tip: "무릎 위 기장" }, outer: null, shoes: { item: "샌들", color: "브라운", tip: "스트랩 샌들이 실용적" }, accessories: { item: "선글라스", color: "블랙", tip: "라운드 프레임" }, situations: ["여행", "캐주얼"], seasons: ["여름(25℃~)"], styles: ["캐주얼"], bodyTypes: ["보통", "마른", "통통", "근육질"], budgetLevel: 1, colorTone: ["무채색", "어스톤"], description: "바다가 어울리는 여름 여행룩", stylingTip: "스트라이프는 시선을 분산시켜 체형 보완에 효과적", colors: ["#1B3A5C", "#FFFFFF", "#F5F5DC", "#8B4513", "#000000"] },
  { name: "시티 투어룩", gender: "남성", top: { item: "올리브 린넨 셔츠", color: "올리브", tip: "한 사이즈 업으로 여유 있게" }, bottom: { item: "크림 치노팬츠", color: "크림", tip: "스트레이트핏 추천" }, outer: null, shoes: { item: "화이트 스니커즈", color: "화이트", tip: "쿠션감 좋은 모델" }, accessories: { item: "크로스백", color: "카키", tip: "미니 크로스백" }, situations: ["여행", "캐주얼"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["캐주얼", "미니멀"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 2, colorTone: ["어스톤"], description: "도시 여행에 적합한 편안하고 멋진 룩", stylingTip: "어스톤 컬러 조합은 도시 배경과 잘 어울림", colors: ["#708238", "#FFFDD0", "#FFFFFF", "#5C6B3C"] },
  // 운동
  { name: "트레이닝룩", gender: "남성", top: { item: "블랙 드라이핏 티셔츠", color: "블랙", tip: "흡습속건 기능성 소재" }, bottom: { item: "그레이 조거팬츠", color: "그레이", tip: "밑단 밴드 처리" }, outer: null, shoes: { item: "블랙 러닝화", color: "블랙", tip: "쿠션감 좋은 러닝화" }, accessories: { item: "스포츠 워치", color: "블랙", tip: "방수 기능 필수" }, situations: ["운동"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)", "겨울(~10℃)", "환절기"], styles: ["스포티"], bodyTypes: ["보통", "마른", "근육질", "통통"], budgetLevel: 2, colorTone: ["무채색"], description: "기능적이면서 스타일리시한 운동복", stylingTip: "올블랙 운동복에 밝은 색 운동화가 포인트", colors: ["#000000", "#808080", "#000000", "#000000"] },
  // 결혼식
  { name: "하객룩 (캐주얼)", gender: "남성", top: { item: "페일핑크 셔츠", color: "페일핑크", tip: "밝은 톤으로 화사하게" }, bottom: { item: "네이비 슬랙스", color: "네이비", tip: "프레스 라인 살리기" }, outer: { item: "네이비 블레이저", color: "네이비", tip: "금속 버튼 디테일" }, shoes: { item: "브라운 로퍼", color: "브라운", tip: "태슬 로퍼 추천" }, accessories: { item: "포켓치프", color: "화이트", tip: "TV폴드로 단정하게" }, situations: ["결혼식", "파티"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["클래식", "로맨틱"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 3, colorTone: ["파스텔", "무채색"], description: "격식 있으면서 화사한 하객 스타일", stylingTip: "포켓치프 하나로 격이 달라집니다", colors: ["#FFD1DC", "#1B3A5C", "#1B3A5C", "#8B4513", "#FFFFFF"] },
  // 파티
  { name: "나이트 파티룩", gender: "남성", top: { item: "블랙 터틀넥", color: "블랙", tip: "슬림핏으로 라인 강조" }, bottom: { item: "블랙 슬림 팬츠", color: "블랙", tip: "스키니~슬림핏" }, outer: { item: "블랙 레더 재킷", color: "블랙", tip: "바이커 스타일" }, shoes: { item: "블랙 부츠", color: "블랙", tip: "사이드짚 부츠" }, accessories: { item: "실버 체인 목걸이", color: "실버", tip: "레이어드로 포인트" }, situations: ["파티"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["스트릿", "클래식"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 4, colorTone: ["무채색"], description: "시크하고 강렬한 올블랙 파티룩", stylingTip: "올블랙에는 실버 액세서리로 포인트를 주세요", colors: ["#000000", "#000000", "#000000", "#000000", "#C0C0C0"] },
  // 추가 코디 — 계절별/스타일별 다양화
  { name: "여름 쿨톤 오피스", gender: "남성", top: { item: "민트 폴로셔츠", color: "민트", tip: "카라를 세워 착용" }, bottom: { item: "그레이 린넨 팬츠", color: "그레이", tip: "통풍이 좋은 린넨 소재" }, outer: null, shoes: { item: "네이비 로퍼", color: "네이비", tip: "양말 없이 맨발 느낌" }, accessories: { item: "가죽 시계", color: "브라운", tip: "얇은 케이스" }, situations: ["출근", "캐주얼"], seasons: ["여름(25℃~)"], styles: ["비즈니스", "캐주얼"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 2, colorTone: ["파스텔"], description: "시원하면서 단정한 여름 오피스룩", stylingTip: "여름에는 밝은 색상 셔츠가 청량한 인상을 줍니다", colors: ["#98FF98", "#808080", "#1B3A5C", "#8B4513"] },
  { name: "겨울 웜톤 캐주얼", gender: "남성", top: { item: "버건디 울 니트", color: "버건디", tip: "목이 넉넉한 크루넥" }, bottom: { item: "다크브라운 코듀로이", color: "다크브라운", tip: "와이드핏 코듀로이" }, outer: { item: "올리브 패딩 조끼", color: "올리브", tip: "경량 패딩으로 레이어드" }, shoes: { item: "브라운 워커", color: "브라운", tip: "방수 기능 추천" }, accessories: { item: "니트 비니", color: "베이지", tip: "접어서 얕게 착용" }, situations: ["캐주얼"], seasons: ["겨울(~10℃)"], styles: ["캐주얼", "클래식"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["어스톤"], description: "따뜻한 색감의 겨울 캐주얼", stylingTip: "어스톤 컬러 레이어링은 겨울에 따뜻한 분위기 연출", colors: ["#800020", "#3E2723", "#708238", "#8B4513", "#F5F5DC"] },
  { name: "미니멀 모노톤", gender: "남성", top: { item: "블랙 오버핏 티", color: "블랙", tip: "드롭숄더 디자인" }, bottom: { item: "블랙 와이드 팬츠", color: "블랙", tip: "주름 디테일" }, outer: null, shoes: { item: "블랙 더비슈즈", color: "블랙", tip: "무광 가죽" }, accessories: { item: "블랙 토트백", color: "블랙", tip: "미니멀 디자인" }, situations: ["캐주얼", "출근"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["미니멀"], bodyTypes: ["마른", "보통"], budgetLevel: 3, colorTone: ["무채색"], description: "올블랙 미니멀 무드", stylingTip: "같은 색이라도 소재를 달리하면 입체감 UP", colors: ["#000000", "#000000", "#000000", "#000000"] },
  { name: "프레피 캐주얼", gender: "남성", top: { item: "네이비 스트라이프 니트", color: "네이비/화이트", tip: "어깨 핏이 중요" }, bottom: { item: "카키 치노팬츠", color: "카키", tip: "약간 테이퍼드" }, outer: null, shoes: { item: "브라운 보트슈즈", color: "브라운", tip: "양말 없이 착용" }, accessories: { item: "캔버스 토트백", color: "네이비", tip: "심플한 디자인" }, situations: ["캐주얼", "데이트"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["클래식", "캐주얼"], bodyTypes: ["보통", "마른"], budgetLevel: 2, colorTone: ["무채색", "어스톤"], description: "지적이고 깔끔한 프레피 스타일", stylingTip: "스트라이프 니트는 체형을 날씬하게 보이게 하는 효과", colors: ["#1B3A5C", "#FFFFFF", "#5C6B3C", "#8B4513", "#1B3A5C"] },
  { name: "리조트 바캉스룩", gender: "남성", top: { item: "플로럴 하와이안 셔츠", color: "네이비/컬러", tip: "오버핏으로 여유 있게" }, bottom: { item: "화이트 린넨 반바지", color: "화이트", tip: "무릎 위 기장" }, outer: null, shoes: { item: "브라운 슬리퍼", color: "브라운", tip: "가죽 슬리퍼" }, accessories: { item: "밀짚모자", color: "내추럴", tip: "챙이 넓은 타입" }, situations: ["여행", "캐주얼"], seasons: ["여름(25℃~)"], styles: ["캐주얼"], bodyTypes: ["보통", "마른", "근육질", "통통"], budgetLevel: 2, colorTone: ["비비드", "어스톤"], description: "휴양지 감성 가득한 바캉스룩", stylingTip: "하와이안 셔츠는 단추를 절반만 채우면 시원한 느낌", colors: ["#1B3A5C", "#FF6347", "#FFFFFF", "#8B4513", "#D2B48C"] },
  { name: "레트로 스트릿", gender: "남성", top: { item: "빈티지 럭비 티", color: "그린/버건디", tip: "오버핏 카라 디자인" }, bottom: { item: "워싱 데님 진", color: "라이트블루", tip: "빈티지 워싱" }, outer: null, shoes: { item: "뉴발란스 574", color: "그린", tip: "레트로 컬러" }, accessories: { item: "크로스 메신저백", color: "블랙", tip: "컴팩트 사이즈" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["스트릿", "캐주얼"], bodyTypes: ["보통", "마른"], budgetLevel: 2, colorTone: ["비비드", "어스톤"], description: "90년대 레트로 감성 스트릿", stylingTip: "레트로 컬러 스니커즈가 전체 룩의 포인트", colors: ["#006400", "#800020", "#ADD8E6", "#006400", "#000000"] },
  { name: "스마트 캐주얼 면접", gender: "남성", top: { item: "라이트블루 셔츠", color: "라이트블루", tip: "깨끗하게 다림질" }, bottom: { item: "차콜 울 팬츠", color: "차콜", tip: "테이퍼드핏" }, outer: { item: "네이비 니트 가디건", color: "네이비", tip: "V넥 버튼 가디건" }, shoes: { item: "블랙 로퍼", color: "블랙", tip: "페니 로퍼" }, accessories: { item: "심플 서류가방", color: "블랙", tip: "A4 사이즈 브리프케이스" }, situations: ["면접", "출근"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["비즈니스", "클래식"], bodyTypes: ["보통", "마른", "통통", "근육질"], budgetLevel: 3, colorTone: ["무채색", "파스텔"], description: "신뢰감을 주는 스마트 캐주얼 면접룩", stylingTip: "면접에서는 너무 화려한 것보다 단정함이 승리", colors: ["#ADD8E6", "#36454F", "#1B3A5C", "#000000", "#000000"] },
  { name: "겨울 히트텍 레이어드", gender: "남성", top: { item: "그레이 후드티", color: "그레이", tip: "기모 안감으로 보온" }, bottom: { item: "블랙 기모 팬츠", color: "블랙", tip: "기모 스트레이트" }, outer: { item: "블랙 롱패딩", color: "블랙", tip: "무릎 길이" }, shoes: { item: "블랙 패딩부츠", color: "블랙", tip: "방한 기능" }, accessories: { item: "울 머플러", color: "그레이", tip: "두꺼운 니트 소재" }, situations: ["캐주얼"], seasons: ["겨울(~10℃)"], styles: ["캐주얼"], bodyTypes: ["보통", "마른", "통통", "근육질"], budgetLevel: 3, colorTone: ["무채색"], description: "한겨울에도 따뜻한 레이어드룩", stylingTip: "패딩 안에 후드를 꺼내 입으면 스타일리시한 느낌", colors: ["#808080", "#000000", "#000000", "#000000", "#808080"] },
  { name: "봄 파스텔 데이트", gender: "남성", top: { item: "라벤더 맨투맨", color: "라벤더", tip: "부드러운 코튼 소재" }, bottom: { item: "화이트 팬츠", color: "화이트", tip: "와이드 스트레이트" }, outer: null, shoes: { item: "화이트 가죽 스니커즈", color: "화이트", tip: "미니멀 디자인" }, accessories: { item: "실버 반지", color: "실버", tip: "심플한 밴드 타입" }, situations: ["데이트", "소개팅", "캐주얼"], seasons: ["봄(10~20℃)"], styles: ["로맨틱", "캐주얼", "미니멀"], bodyTypes: ["보통", "마른"], budgetLevel: 2, colorTone: ["파스텔"], description: "봄 감성 가득한 파스텔 데이트룩", stylingTip: "파스텔 톤은 한 가지만 사용하고 나머지는 화이트로", colors: ["#E6E6FA", "#FFFFFF", "#FFFFFF", "#C0C0C0"] },
  { name: "어스톤 레이어드", gender: "남성", top: { item: "모카 터틀넥", color: "모카", tip: "슬림핏으로 레이어드 기본" }, bottom: { item: "올리브 와이드팬츠", color: "올리브", tip: "핀턱 디테일" }, outer: { item: "베이지 트렌치코트", color: "베이지", tip: "벨트를 뒤로 묶어 캐주얼하게" }, shoes: { item: "브라운 더비슈즈", color: "브라운", tip: "무광 가죽" }, accessories: { item: "브라운 숄더백", color: "브라운", tip: "미디엄 사이즈" }, situations: ["출근", "데이트", "캐주얼"], seasons: ["가을(10~20℃)", "환절기"], styles: ["클래식", "미니멀"], bodyTypes: ["보통", "마른"], budgetLevel: 3, colorTone: ["어스톤"], description: "가을 감성 어스톤 레이어드 코디", stylingTip: "같은 톤의 다른 컬러를 겹쳐 입으면 고급스러운 무드", colors: ["#967969", "#708238", "#F5F5DC", "#8B4513", "#8B4513"] },
  { name: "애슬레저룩", gender: "남성", top: { item: "블랙 크롭 맨투맨", color: "블랙", tip: "적당한 오버핏" }, bottom: { item: "블랙 트랙팬츠", color: "블랙", tip: "사이드 라인 디테일" }, outer: { item: "블랙 윈드브레이커", color: "블랙", tip: "가벼운 나일론 소재" }, shoes: { item: "에어맥스", color: "블랙/화이트", tip: "볼륨 있는 솔" }, accessories: { item: "스포츠 백팩", color: "블랙", tip: "심플한 디자인" }, situations: ["운동", "캐주얼"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["스포티", "스트릿"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "운동과 일상을 넘나드는 애슬레저", stylingTip: "올블랙 애슬레저에 화이트 솔 스니커즈가 세련된 포인트", colors: ["#000000", "#000000", "#000000", "#000000", "#FFFFFF"] },
  { name: "비비드 포인트 캐주얼", gender: "남성", top: { item: "레드 스웨트셔츠", color: "레드", tip: "채도 높은 레드" }, bottom: { item: "블랙 스키니 진", color: "블랙", tip: "스트레치 소재" }, outer: null, shoes: { item: "블랙 하이탑 스니커즈", color: "블랙", tip: "컨버스 척70" }, accessories: { item: "블랙 볼캡", color: "블랙", tip: "무지 디자인" }, situations: ["캐주얼", "파티"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["스트릿", "캐주얼"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["비비드"], description: "강렬한 컬러 포인트 스트릿룩", stylingTip: "비비드 컬러는 상의 하나만! 나머지는 블랙으로", colors: ["#FF0000", "#000000", "#000000", "#000000"] },
  // 추가 남성 코디
  { name: "그린 어스 캐주얼", gender: "남성", top: { item: "카키 헨리넥 티", color: "카키", tip: "내추럴 컬러 포인트" }, bottom: { item: "베이지 와이드 치노", color: "베이지", tip: "편한 핏감" }, outer: null, shoes: { item: "베이지 수에드 스니커즈", color: "베이지", tip: "톤온톤 매치" }, accessories: { item: "캔버스 에코백", color: "카키", tip: "자연스러운 소재" }, situations: ["캐주얼", "여행"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["캐주얼", "미니멀"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 1, colorTone: ["어스톤"], description: "자연스럽고 편안한 어스 톤 코디", stylingTip: "어스톤 코디는 같은 계열 색을 3가지 이내로", colors: ["#5C6B3C", "#F5F5DC", "#F5F5DC", "#5C6B3C"] },
  { name: "댄디 주말룩", gender: "남성", top: { item: "화이트 피케셔츠", color: "화이트", tip: "카라가 있어 단정" }, bottom: { item: "네이비 버뮤다 팬츠", color: "네이비", tip: "무릎 위 5cm 기장" }, outer: null, shoes: { item: "화이트 에스파드리유", color: "화이트", tip: "여름 포인트 슈즈" }, accessories: { item: "브라운 레더 벨트", color: "브라운", tip: "얇은 벨트" }, situations: ["캐주얼", "데이트"], seasons: ["여름(25℃~)", "봄(10~20℃)"], styles: ["캐주얼", "클래식"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "깔끔한 여름 주말 외출룩", stylingTip: "화이트와 네이비 조합은 여름 최고의 공식", colors: ["#FFFFFF", "#1B3A5C", "#FFFFFF", "#8B4513"] },
  { name: "모던 그레이 코디", gender: "남성", top: { item: "차콜 목폴라", color: "차콜", tip: "슬림핏으로 깔끔하게" }, bottom: { item: "라이트그레이 울 팬츠", color: "라이트그레이", tip: "와이드핏" }, outer: { item: "다크그레이 싱글코트", color: "다크그레이", tip: "미디엄 기장" }, shoes: { item: "블랙 첼시부츠", color: "블랙", tip: "광택 가죽" }, accessories: { item: "그레이 울 머플러", color: "그레이", tip: "심플하게 한 번 감기" }, situations: ["출근", "데이트", "소개팅"], seasons: ["겨울(~10℃)"], styles: ["미니멀", "클래식"], bodyTypes: ["마른", "보통"], budgetLevel: 4, colorTone: ["무채색"], description: "톤온톤 그레이의 모던한 겨울룩", stylingTip: "같은 색 계열의 명도 차이로 깊이감을 표현", colors: ["#36454F", "#D3D3D3", "#696969", "#000000", "#808080"] },
  { name: "아이비리그 캐주얼", gender: "남성", top: { item: "그린 V넥 니트 조끼", color: "그린", tip: "셔츠 위에 레이어드" }, bottom: { item: "네이비 면바지", color: "네이비", tip: "클래식 스트레이트" }, outer: null, shoes: { item: "브라운 윙팁", color: "브라운", tip: "클래식한 디테일" }, accessories: { item: "가죽 북커버", color: "브라운", tip: "지적인 소품" }, situations: ["캐주얼", "출근"], seasons: ["가을(10~20℃)", "봄(10~20℃)"], styles: ["클래식", "캐주얼"], bodyTypes: ["보통", "마른"], budgetLevel: 3, colorTone: ["어스톤", "무채색"], description: "클래식한 아이비리그 감성", stylingTip: "니트 조끼 레이어드는 셔츠 카라를 밖으로 빼주세요", colors: ["#006400", "#1B3A5C", "#8B4513", "#8B4513"] },
  { name: "여름 올화이트", gender: "남성", top: { item: "화이트 린넨 셔츠", color: "화이트", tip: "오버핏 린넨" }, bottom: { item: "화이트 린넨 팬츠", color: "화이트", tip: "와이드핏" }, outer: null, shoes: { item: "화이트 에스파드리유", color: "화이트", tip: "캔버스 소재" }, accessories: { item: "골드 팔찌", color: "골드", tip: "얇은 체인" }, situations: ["데이트", "여행", "파티"], seasons: ["여름(25℃~)"], styles: ["미니멀", "로맨틱"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "시원한 올화이트 여름 코디", stylingTip: "올화이트 코디에는 골드 액세서리가 포인트", colors: ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFD700"] },
  { name: "테크웨어", gender: "남성", top: { item: "블랙 테크 티셔츠", color: "블랙", tip: "기능성 소재" }, bottom: { item: "블랙 카고조거", color: "블랙", tip: "멀티 포켓" }, outer: { item: "블랙 고어텍스 재킷", color: "블랙", tip: "방수/방풍" }, shoes: { item: "블랙 트레일러닝화", color: "블랙", tip: "그립감 좋은 아웃솔" }, accessories: { item: "블랙 슬링백", color: "블랙", tip: "기능성 소재" }, situations: ["캐주얼", "여행"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["스트릿"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 4, colorTone: ["무채색"], description: "기능성과 스타일의 조화", stylingTip: "테크웨어는 소재의 차이로 디테일을 살리세요", colors: ["#000000", "#000000", "#000000", "#000000", "#000000"] },
  { name: "코지 홈웨어 외출", gender: "남성", top: { item: "오트밀 와플 니트", color: "오트밀", tip: "와플 조직 텍스처" }, bottom: { item: "그레이 스웨트팬츠", color: "그레이", tip: "테이퍼드핏" }, outer: { item: "베이지 플리스 집업", color: "베이지", tip: "반짚업 디자인" }, shoes: { item: "뉴발란스 992", color: "그레이", tip: "편안한 데일리화" }, accessories: { item: "토트백", color: "내추럴", tip: "캔버스 소재" }, situations: ["캐주얼"], seasons: ["겨울(~10℃)", "환절기"], styles: ["캐주얼"], bodyTypes: ["보통", "통통", "마른"], budgetLevel: 2, colorTone: ["어스톤", "무채색"], description: "편안하면서 멋스러운 코지 외출룩", stylingTip: "뉴트럴 톤의 편안한 소재 믹스가 핵심", colors: ["#C8AD7F", "#808080", "#F5F5DC", "#808080", "#D2B48C"] },
  { name: "서머 비비드", gender: "남성", top: { item: "코발트블루 반팔 티", color: "코발트블루", tip: "선명한 색감" }, bottom: { item: "화이트 쇼츠", color: "화이트", tip: "5부 기장" }, outer: null, shoes: { item: "화이트 스니커즈", color: "화이트", tip: "클래식 로우컷" }, accessories: { item: "선글라스", color: "블랙", tip: "웨이퍼러" }, situations: ["캐주얼", "여행"], seasons: ["여름(25℃~)"], styles: ["캐주얼"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 1, colorTone: ["비비드"], description: "시선을 사로잡는 비비드 여름룩", stylingTip: "비비드 컬러 하나 + 화이트 기반이면 깔끔", colors: ["#0047AB", "#FFFFFF", "#FFFFFF", "#000000"] },
  { name: "가을 트렌치코트룩", gender: "남성", top: { item: "스트라이프 니트", color: "네이비/크림", tip: "가로 스트라이프" }, bottom: { item: "다크네이비 슬랙스", color: "다크네이비", tip: "테이퍼드핏" }, outer: { item: "베이지 트렌치코트", color: "베이지", tip: "허리 벨트 묶기" }, shoes: { item: "브라운 더비슈즈", color: "브라운", tip: "무광 가죽" }, accessories: { item: "가죽 크로스백", color: "브라운", tip: "미니 사이즈" }, situations: ["출근", "데이트", "캐주얼"], seasons: ["가을(10~20℃)", "환절기"], styles: ["클래식", "캐주얼"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["어스톤", "무채색"], description: "가을의 정석, 트렌치코트 코디", stylingTip: "트렌치코트 벨트는 뒤에서 묶으면 캐주얼, 앞에서 묶으면 포멀", colors: ["#1B3A5C", "#FFFDD0", "#F5F5DC", "#8B4513", "#8B4513"] },
  // 통통 체형 특화
  { name: "슬림핏 통통체형 코디", gender: "남성", top: { item: "다크네이비 V넥 니트", color: "다크네이비", tip: "V넥으로 목선 길어보이게" }, bottom: { item: "블랙 스트레이트 팬츠", color: "블랙", tip: "일자핏으로 라인 정리" }, outer: null, shoes: { item: "블랙 로퍼", color: "블랙", tip: "심플한 디자인" }, accessories: { item: "가죽 벨트", color: "블랙", tip: "심플한 버클" }, situations: ["출근", "캐주얼", "소개팅"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["미니멀", "비즈니스"], bodyTypes: ["통통"], budgetLevel: 2, colorTone: ["무채색"], description: "체형을 슬림하게 보이게 하는 다크톤 코디", stylingTip: "V넥 + 세로 라인 팬츠로 시각적 슬림 효과", colors: ["#1B2A4A", "#000000", "#000000", "#000000"] },
  { name: "근육질 피트룩", gender: "남성", top: { item: "블랙 헨리넥 티", color: "블랙", tip: "적당한 슬림핏으로 라인 강조" }, bottom: { item: "다크그레이 조거", color: "다크그레이", tip: "테이퍼드 조거" }, outer: null, shoes: { item: "블랙 트레이닝화", color: "블랙", tip: "심플한 디자인" }, accessories: { item: "스포츠 워치", color: "블랙", tip: "디지털 타입" }, situations: ["캐주얼", "운동"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["스포티", "캐주얼"], bodyTypes: ["근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "운동하는 남자의 건강한 일상룩", stylingTip: "근육질 체형은 너무 타이트하면 과하니 적당한 슬림핏이 핵심", colors: ["#000000", "#696969", "#000000", "#000000"] },
];

/* ══════════════════════════════════════════
   Outfit Database — 여성 (60+)
   ══════════════════════════════════════════ */
const FEMALE_OUTFITS: Outfit[] = [
  // 출근
  { name: "모던 오피스 우먼", gender: "여성", top: { item: "화이트 블라우스", color: "화이트", tip: "실크 소재로 고급스럽게" }, bottom: { item: "블랙 와이드 슬랙스", color: "블랙", tip: "하이웨이스트로 라인 정리" }, outer: { item: "베이지 블레이저", color: "베이지", tip: "오버핏으로 트렌디하게" }, shoes: { item: "블랙 스틸레토", color: "블랙", tip: "5~7cm가 편안" }, accessories: { item: "골드 이어링", color: "골드", tip: "심플한 후프 타입" }, situations: ["출근", "면접"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["비즈니스", "클래식", "미니멀"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["무채색", "어스톤"], description: "세련되고 프로페셔널한 오피스룩", stylingTip: "블라우스를 프론트 턱인하면 허리 라인이 살아납니다", colors: ["#FFFFFF", "#000000", "#F5F5DC", "#000000", "#FFD700"] },
  { name: "페미닌 오피스룩", gender: "여성", top: { item: "라벤더 니트", color: "라벤더", tip: "부드러운 캐시미어" }, bottom: { item: "네이비 H라인 스커트", color: "네이비", tip: "무릎 기장" }, outer: null, shoes: { item: "베이지 플랫슈즈", color: "베이지", tip: "리본 디테일" }, accessories: { item: "진주 목걸이", color: "화이트", tip: "싱글 진주 펜던트" }, situations: ["출근", "데이트"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["로맨틱", "비즈니스"], bodyTypes: ["보통", "마른"], budgetLevel: 3, colorTone: ["파스텔"], description: "여성스러우면서 단정한 오피스 스타일", stylingTip: "파스텔 니트와 네이비 스커트는 페미닌 오피스의 정석", colors: ["#E6E6FA", "#1B3A5C", "#F5F5DC", "#FFFFFF"] },
  // 데이트
  { name: "로맨틱 원피스 데이트", gender: "여성", top: { item: "플로럴 원피스", color: "피치/플로럴", tip: "잔꽃 패턴이 로맨틱" }, bottom: { item: "(원피스)", color: "-", tip: "A라인 실루엣" }, outer: { item: "크림 가디건", color: "크림", tip: "어깨에 걸치기" }, shoes: { item: "베이지 스트랩 샌들", color: "베이지", tip: "앵클 스트랩" }, accessories: { item: "리본 헤어밴드", color: "핑크", tip: "너비 3cm 새틴" }, situations: ["데이트", "소개팅"], seasons: ["봄(10~20℃)", "여름(25℃~)"], styles: ["로맨틱"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["파스텔"], description: "사랑스러운 봄 데이트 원피스룩", stylingTip: "플로럴 원피스에는 단색 아우터로 균형을 맞추세요", colors: ["#FFDAB9", "#FF69B4", "#FFFDD0", "#F5F5DC", "#FFB6C1"] },
  { name: "시크 데이트룩", gender: "여성", top: { item: "블랙 실크 캐미솔", color: "블랙", tip: "레이스 트리밍" }, bottom: { item: "블랙 와이드 팬츠", color: "블랙", tip: "하이웨이스트" }, outer: { item: "블랙 오버사이즈 블레이저", color: "블랙", tip: "어깨 드롭" }, shoes: { item: "블랙 스트랩 힐", color: "블랙", tip: "앵클 스트랩" }, accessories: { item: "골드 레이어드 목걸이", color: "골드", tip: "2~3줄 레이어드" }, situations: ["데이트", "파티"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "여름(25℃~)"], styles: ["미니멀", "클래식"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 3, colorTone: ["무채색"], description: "모던하고 세련된 시크 데이트룩", stylingTip: "올블랙에 골드 주얼리가 고급스러운 포인트", colors: ["#000000", "#000000", "#000000", "#000000", "#FFD700"] },
  // 캐주얼
  { name: "데일리 캐주얼", gender: "여성", top: { item: "화이트 크롭 티", color: "화이트", tip: "적당한 기장" }, bottom: { item: "하이웨이스트 데님", color: "미디엄블루", tip: "스트레이트핏" }, outer: null, shoes: { item: "화이트 에어포스", color: "화이트", tip: "로우 모델" }, accessories: { item: "미니 크로스백", color: "블랙", tip: "체인 스트랩" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["캐주얼"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 1, colorTone: ["무채색"], description: "매일 입는 기본 중의 기본 캐주얼", stylingTip: "크롭 티 + 하이웨이스트 데님으로 다리 길어 보이는 효과", colors: ["#FFFFFF", "#4682B4", "#FFFFFF", "#000000"] },
  { name: "스트릿 걸리시", gender: "여성", top: { item: "오버사이즈 그래픽 티", color: "블랙", tip: "턱인 스타일" }, bottom: { item: "카고 미니스커트", color: "카키", tip: "포켓 디테일" }, outer: null, shoes: { item: "플랫폼 스니커즈", color: "화이트", tip: "키높이 효과" }, accessories: { item: "볼캡", color: "블랙", tip: "커브드 캡" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)"], styles: ["스트릿", "캐주얼"], bodyTypes: ["마른", "보통"], budgetLevel: 1, colorTone: ["무채색", "어스톤"], description: "힙하고 발랄한 스트릿 걸리시룩", stylingTip: "오버사이즈 상의를 미니스커트에 턱인하면 비율이 좋아져요", colors: ["#000000", "#5C6B3C", "#FFFFFF", "#000000"] },
  // 소개팅
  { name: "호감형 소개팅룩", gender: "여성", top: { item: "페일핑크 니트", color: "페일핑크", tip: "얼굴이 화사해 보이는 색" }, bottom: { item: "크림 A라인 스커트", color: "크림", tip: "무릎 기장" }, outer: null, shoes: { item: "베이지 메리제인", color: "베이지", tip: "로우힐" }, accessories: { item: "진주 이어링", color: "화이트", tip: "드롭 타입" }, situations: ["소개팅", "데이트"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["로맨틱", "캐주얼"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 2, colorTone: ["파스텔"], description: "첫인상을 사로잡는 소프트 핑크 소개팅룩", stylingTip: "핑크 계열은 피부 톤을 밝게 보이게 합니다", colors: ["#FFD1DC", "#FFFDD0", "#F5F5DC", "#FFFFFF"] },
  // 면접
  { name: "프로페셔널 면접룩", gender: "여성", top: { item: "화이트 셔츠 블라우스", color: "화이트", tip: "깔끔한 카라" }, bottom: { item: "네이비 테이퍼드 팬츠", color: "네이비", tip: "슬림한 핏" }, outer: { item: "네이비 크롭 재킷", color: "네이비", tip: "허리 기장" }, shoes: { item: "블랙 펌프스", color: "블랙", tip: "5cm 굽" }, accessories: { item: "심플 시계", color: "실버", tip: "얇은 메탈 밴드" }, situations: ["면접", "출근"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "겨울(~10℃)", "환절기"], styles: ["비즈니스", "클래식"], bodyTypes: ["보통", "마른", "통통", "근육질"], budgetLevel: 3, colorTone: ["무채색"], description: "신뢰감과 전문성을 보여주는 면접 코디", stylingTip: "면접에서는 액세서리를 최소화하고 깔끔함에 집중", colors: ["#FFFFFF", "#1B3A5C", "#1B3A5C", "#000000", "#C0C0C0"] },
  // 여행
  { name: "봄 피크닉룩", gender: "여성", top: { item: "기엄 체크 블라우스", color: "레드/화이트", tip: "프렌치 무드" }, bottom: { item: "화이트 A라인 스커트", color: "화이트", tip: "미디 기장" }, outer: null, shoes: { item: "화이트 캔버스 스니커즈", color: "화이트", tip: "로우컷" }, accessories: { item: "라탄 바스켓 백", color: "내추럴", tip: "미니 사이즈" }, situations: ["여행", "데이트", "캐주얼"], seasons: ["봄(10~20℃)", "여름(25℃~)"], styles: ["로맨틱", "캐주얼"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["비비드", "어스톤"], description: "로맨틱한 봄 소풍 코디", stylingTip: "체크 패턴에 화이트를 매치하면 산뜻한 봄 느낌", colors: ["#FF0000", "#FFFFFF", "#FFFFFF", "#D2B48C"] },
  { name: "여름 리조트룩", gender: "여성", top: { item: "화이트 리넨 원피스", color: "화이트", tip: "셔링 디테일" }, bottom: { item: "(원피스)", color: "-", tip: "미디 기장" }, outer: null, shoes: { item: "탄 슬라이드", color: "탄", tip: "가죽 슬라이드" }, accessories: { item: "라피아 햇", color: "내추럴", tip: "넓은 챙" }, situations: ["여행"], seasons: ["여름(25℃~)"], styles: ["로맨틱", "미니멀"], bodyTypes: ["마른", "보통", "통통"], budgetLevel: 2, colorTone: ["무채색", "어스톤"], description: "해변이 어울리는 리조트 원피스", stylingTip: "화이트 원피스에 내추럴 소재 소품으로 리조트 무드 완성", colors: ["#FFFFFF", "#D2B48C", "#D2B48C"] },
  // 운동
  { name: "스타일리시 운동룩", gender: "여성", top: { item: "네이비 스포츠 브라탑", color: "네이비", tip: "서포트 좋은 타입" }, bottom: { item: "블랙 레깅스", color: "블랙", tip: "하이웨이스트" }, outer: { item: "화이트 크롭 윈드브레이커", color: "화이트", tip: "지퍼 하프 오픈" }, shoes: { item: "그레이 트레이닝화", color: "그레이", tip: "쿠션감 좋은 모델" }, accessories: { item: "스포츠 헤어밴드", color: "네이비", tip: "와이드 타입" }, situations: ["운동"], seasons: ["봄(10~20℃)", "여름(25℃~)", "가을(10~20℃)", "겨울(~10℃)", "환절기"], styles: ["스포티"], bodyTypes: ["마른", "보통", "근육질", "통통"], budgetLevel: 2, colorTone: ["무채색"], description: "운동할 때도 스타일리시하게", stylingTip: "크롭 아우터 + 레깅스는 비율을 좋게 만드는 조합", colors: ["#1B3A5C", "#000000", "#FFFFFF", "#808080", "#1B3A5C"] },
  // 결혼식
  { name: "하객 원피스룩", gender: "여성", top: { item: "세이지그린 원피스", color: "세이지그린", tip: "랩 디자인으로 허리 강조" }, bottom: { item: "(원피스)", color: "-", tip: "미디 기장" }, outer: { item: "아이보리 볼레로", color: "아이보리", tip: "짧은 기장" }, shoes: { item: "골드 스트랩 힐", color: "골드", tip: "5~7cm" }, accessories: { item: "클러치백", color: "골드", tip: "이브닝 클러치" }, situations: ["결혼식", "파티"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["클래식", "로맨틱"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["어스톤", "파스텔"], description: "품격 있는 하객 원피스 스타일", stylingTip: "결혼식 하객은 화이트/블랙을 피하고 컬러 원피스가 매너", colors: ["#9DC183", "#FFFFF0", "#FFD700", "#FFD700"] },
  // 파티
  { name: "글래머러스 파티룩", gender: "여성", top: { item: "블랙 시퀸 톱", color: "블랙", tip: "글리터 디테일" }, bottom: { item: "블랙 슬림 팬츠", color: "블랙", tip: "하이웨이스트 스키니" }, outer: null, shoes: { item: "블랙 스틸레토", color: "블랙", tip: "9cm 이상" }, accessories: { item: "스터드 이어링", color: "실버", tip: "큐빅 포인트" }, situations: ["파티"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "겨울(~10℃)"], styles: ["클래식"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 4, colorTone: ["무채색"], description: "화려하고 시크한 파티 스타일", stylingTip: "시퀸 아이템은 하나만! 나머지는 심플하게", colors: ["#000000", "#000000", "#000000", "#C0C0C0"] },
  // 추가 여성 코디
  { name: "미니멀 모노톤", gender: "여성", top: { item: "블랙 터틀넥", color: "블랙", tip: "슬림핏" }, bottom: { item: "그레이 와이드 팬츠", color: "그레이", tip: "핀턱 디테일" }, outer: { item: "차콜 롱코트", color: "차콜", tip: "더블 브레스트" }, shoes: { item: "블랙 앵클부츠", color: "블랙", tip: "포인티드 토" }, accessories: { item: "미니 숄더백", color: "블랙", tip: "체인 스트랩" }, situations: ["출근", "캐주얼"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["미니멀", "클래식"], bodyTypes: ["마른", "보통"], budgetLevel: 3, colorTone: ["무채색"], description: "세련된 모노톤 미니멀 코디", stylingTip: "모노톤 코디는 소재와 실루엣의 차이로 깊이감을 주세요", colors: ["#000000", "#808080", "#36454F", "#000000", "#000000"] },
  { name: "봄 파스텔 레이어드", gender: "여성", top: { item: "스카이블루 니트 베스트", color: "스카이블루", tip: "셔츠 위에 레이어드" }, bottom: { item: "화이트 플리츠 스커트", color: "화이트", tip: "미디 기장 플리츠" }, outer: null, shoes: { item: "화이트 메리제인", color: "화이트", tip: "라운드 토" }, accessories: { item: "블루 헤어핀", color: "스카이블루", tip: "진주 디테일" }, situations: ["캐주얼", "데이트", "소개팅"], seasons: ["봄(10~20℃)"], styles: ["로맨틱", "캐주얼"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["파스텔"], description: "봄바람에 어울리는 파스텔 레이어드", stylingTip: "파스텔 + 화이트 조합은 봄의 정석", colors: ["#87CEEB", "#FFFFFF", "#FFFFFF", "#87CEEB"] },
  { name: "가을 니트 원피스", gender: "여성", top: { item: "카멜 니트 원피스", color: "카멜", tip: "벨트로 허리 강조" }, bottom: { item: "(원피스)", color: "-", tip: "무릎 아래 기장" }, outer: { item: "브라운 가죽 재킷", color: "브라운", tip: "크롭 기장" }, shoes: { item: "브라운 롱부츠", color: "브라운", tip: "무릎 아래 기장" }, accessories: { item: "골드 체인 벨트", color: "골드", tip: "허리에 포인트" }, situations: ["데이트", "캐주얼", "출근"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["클래식", "로맨틱"], bodyTypes: ["마른", "보통"], budgetLevel: 3, colorTone: ["어스톤"], description: "가을 감성 가득한 니트 원피스룩", stylingTip: "니트 원피스에 부츠는 가을의 베스트 조합", colors: ["#C19A6B", "#8B4513", "#8B4513", "#FFD700"] },
  { name: "비비드 스트릿", gender: "여성", top: { item: "옐로 크롭 맨투맨", color: "옐로", tip: "짧은 기장" }, bottom: { item: "블랙 카고팬츠", color: "블랙", tip: "와이드핏" }, outer: null, shoes: { item: "컨버스 하이탑", color: "블랙", tip: "클래식 모델" }, accessories: { item: "체인 벨트", color: "실버", tip: "포인트 액세서리" }, situations: ["캐주얼"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["스트릿"], bodyTypes: ["마른", "보통"], budgetLevel: 1, colorTone: ["비비드"], description: "눈에 띄는 비비드 스트릿 코디", stylingTip: "비비드 컬러 크롭탑 + 블랙 와이드로 비율 강조", colors: ["#FFD700", "#000000", "#000000", "#C0C0C0"] },
  { name: "겨울 코지룩", gender: "여성", top: { item: "아이보리 터틀넥 니트", color: "아이보리", tip: "청키 니트" }, bottom: { item: "브라운 코듀로이 팬츠", color: "브라운", tip: "와이드핏" }, outer: { item: "베이지 테디 코트", color: "베이지", tip: "오버핏 양털" }, shoes: { item: "크림 어그부츠", color: "크림", tip: "미니 기장" }, accessories: { item: "니트 머플러", color: "베이지", tip: "볼륨감 있게" }, situations: ["캐주얼"], seasons: ["겨울(~10℃)"], styles: ["캐주얼", "로맨틱"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["어스톤"], description: "포근하고 사랑스러운 겨울 코지룩", stylingTip: "뉴트럴 톤 + 텍스처 믹스로 따뜻한 겨울 감성", colors: ["#FFFFF0", "#8B4513", "#F5F5DC", "#FFFDD0", "#F5F5DC"] },
  { name: "여름 린넨 코디", gender: "여성", top: { item: "베이지 린넨 크롭 탑", color: "베이지", tip: "내추럴 구김 매력" }, bottom: { item: "화이트 린넨 와이드팬츠", color: "화이트", tip: "밴딩 허리" }, outer: null, shoes: { item: "탄 슬리퍼", color: "탄", tip: "미니멀 디자인" }, accessories: { item: "쉘 목걸이", color: "내추럴", tip: "여름 감성" }, situations: ["캐주얼", "여행"], seasons: ["여름(25℃~)"], styles: ["미니멀", "캐주얼"], bodyTypes: ["마른", "보통", "통통"], budgetLevel: 1, colorTone: ["어스톤", "무채색"], description: "시원하고 자연스러운 린넨 코디", stylingTip: "린넨의 자연스러운 구김이 오히려 멋스러움의 포인트", colors: ["#F5F5DC", "#FFFFFF", "#D2B48C", "#D2B48C"] },
  { name: "클래식 트렌치 코디", gender: "여성", top: { item: "스트라이프 보트넥 티", color: "네이비/화이트", tip: "프렌치 시크" }, bottom: { item: "다크네이비 스트레이트 진", color: "다크네이비", tip: "하이웨이스트" }, outer: { item: "베이지 트렌치코트", color: "베이지", tip: "클래식 더블" }, shoes: { item: "블랙 발레 플랫", color: "블랙", tip: "리본 디테일" }, accessories: { item: "실크 스카프", color: "레드", tip: "목에 가볍게" }, situations: ["출근", "캐주얼", "데이트"], seasons: ["가을(10~20℃)", "봄(10~20℃)", "환절기"], styles: ["클래식", "캐주얼"], bodyTypes: ["보통", "마른", "통통"], budgetLevel: 3, colorTone: ["무채색", "어스톤"], description: "파리지엔 감성 트렌치코트 코디", stylingTip: "스트라이프 + 트렌치는 시대를 초월한 프렌치 시크", colors: ["#1B3A5C", "#FFFFFF", "#F5F5DC", "#000000", "#FF0000"] },
  { name: "올블랙 시크", gender: "여성", top: { item: "블랙 리브드 니트", color: "블랙", tip: "바디핏" }, bottom: { item: "블랙 레더 스커트", color: "블랙", tip: "미니 기장" }, outer: { item: "블랙 라이더 재킷", color: "블랙", tip: "크롭 기장" }, shoes: { item: "블랙 앵클부츠", color: "블랙", tip: "청키힐" }, accessories: { item: "실버 체인 목걸이", color: "실버", tip: "레이어드" }, situations: ["파티", "데이트", "캐주얼"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["스트릿", "클래식"], bodyTypes: ["마른", "보통"], budgetLevel: 3, colorTone: ["무채색"], description: "카리스마 넘치는 올블랙 시크룩", stylingTip: "같은 블랙이라도 가죽/니트/울 소재 믹스로 풍부하게", colors: ["#000000", "#000000", "#000000", "#000000", "#C0C0C0"] },
  { name: "편안한 애슬레저", gender: "여성", top: { item: "그레이 크롭 후드", color: "그레이", tip: "짧은 기장" }, bottom: { item: "블랙 와이드 조거", color: "블랙", tip: "밴딩 허리" }, outer: null, shoes: { item: "뉴발란스 530", color: "화이트/실버", tip: "볼륨 스니커즈" }, accessories: { item: "스포츠 캡", color: "블랙", tip: "포니테일에 맞게" }, situations: ["캐주얼", "운동"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["스포티", "캐주얼"], bodyTypes: ["보통", "마른", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "운동과 일상의 경계를 허무는 애슬레저", stylingTip: "크롭 후드 + 와이드 조거로 편안한 비율 완성", colors: ["#808080", "#000000", "#FFFFFF", "#000000"] },
  { name: "걸리시 캠퍼스룩", gender: "여성", top: { item: "크림 케이블 니트", color: "크림", tip: "아기자기한 조직감" }, bottom: { item: "체크 미니스커트", color: "그레이/체크", tip: "A라인" }, outer: null, shoes: { item: "로퍼", color: "블랙", tip: "코인 로퍼" }, accessories: { item: "니삭스", color: "그레이", tip: "무릎 아래 기장" }, situations: ["캐주얼", "소개팅"], seasons: ["가을(10~20℃)", "봄(10~20℃)"], styles: ["캐주얼", "로맨틱"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["무채색"], description: "사랑스러운 캠퍼스 걸리시룩", stylingTip: "체크 스커트 + 케이블 니트는 교복 감성의 정석", colors: ["#FFFDD0", "#808080", "#000000", "#808080"] },
  { name: "파워 수트", gender: "여성", top: { item: "블랙 브라렛 or 튜브탑", color: "블랙", tip: "이너는 심플하게" }, bottom: { item: "블랙 와이드 수트팬츠", color: "블랙", tip: "하이웨이스트" }, outer: { item: "블랙 더블 블레이저", color: "블랙", tip: "오버핏" }, shoes: { item: "블랙 슬링백 힐", color: "블랙", tip: "포인티드 토" }, accessories: { item: "골드 커프 팔찌", color: "골드", tip: "볼드한 디자인" }, situations: ["출근", "파티", "면접"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["비즈니스", "미니멀"], bodyTypes: ["마른", "보통", "근육질"], budgetLevel: 4, colorTone: ["무채색"], description: "당당하고 파워풀한 수트 코디", stylingTip: "오버핏 블레이저를 어깨에 걸치면 카리스마 UP", colors: ["#000000", "#000000", "#000000", "#000000", "#FFD700"] },
  { name: "봄 원피스 나들이", gender: "여성", top: { item: "민트 셔링 원피스", color: "민트", tip: "허리 셔링으로 핏 살리기" }, bottom: { item: "(원피스)", color: "-", tip: "미디 기장" }, outer: null, shoes: { item: "화이트 플랫폼 샌들", color: "화이트", tip: "스트랩 타입" }, accessories: { item: "밀짚 토트백", color: "내추럴", tip: "미디엄 사이즈" }, situations: ["캐주얼", "데이트", "여행"], seasons: ["봄(10~20℃)", "여름(25℃~)"], styles: ["로맨틱", "캐주얼"], bodyTypes: ["마른", "보통", "통통"], budgetLevel: 2, colorTone: ["파스텔"], description: "산뜻한 봄 나들이 원피스", stylingTip: "셔링 원피스는 체형에 관계없이 예쁜 핏을 만들어줍니다", colors: ["#98FF98", "#FFFFFF", "#D2B48C"] },
  { name: "겨울 패딩 코디", gender: "여성", top: { item: "크림 기모 맨투맨", color: "크림", tip: "두꺼운 기모" }, bottom: { item: "블랙 기모 레깅스", color: "블랙", tip: "기모 안감" }, outer: { item: "블랙 숏패딩", color: "블랙", tip: "크롭 기장" }, shoes: { item: "화이트 털부츠", color: "화이트", tip: "방한 기능" }, accessories: { item: "니트 귀마개", color: "크림", tip: "귀여운 포인트" }, situations: ["캐주얼"], seasons: ["겨울(~10℃)"], styles: ["캐주얼"], bodyTypes: ["보통", "마른", "통통", "근육질"], budgetLevel: 2, colorTone: ["무채색"], description: "따뜻하면서 귀여운 겨울 패딩 코디", stylingTip: "숏패딩 + 레깅스는 하체가 길어 보이는 비율 꿀팁", colors: ["#FFFDD0", "#000000", "#000000", "#FFFFFF", "#FFFDD0"] },
  { name: "여름 비비드 원피스", gender: "여성", top: { item: "코랄 슬리브리스 원피스", color: "코랄", tip: "밝은 코랄 색상" }, bottom: { item: "(원피스)", color: "-", tip: "미니~미디 기장" }, outer: null, shoes: { item: "화이트 스니커즈", color: "화이트", tip: "심플한 디자인" }, accessories: { item: "비즈 팔찌", color: "멀티컬러", tip: "여름 포인트" }, situations: ["캐주얼", "데이트", "여행"], seasons: ["여름(25℃~)"], styles: ["캐주얼", "로맨틱"], bodyTypes: ["마른", "보통"], budgetLevel: 1, colorTone: ["비비드"], description: "화사한 컬러의 여름 원피스", stylingTip: "비비드 원피스에는 심플한 화이트 슈즈가 정답", colors: ["#FF7F50", "#FFFFFF", "#FF6347"] },
  { name: "어스톤 레이어드", gender: "여성", top: { item: "모카 리브 니트", color: "모카", tip: "슬림핏" }, bottom: { item: "올리브 와이드 팬츠", color: "올리브", tip: "핀턱" }, outer: { item: "카멜 핸드메이드 코트", color: "카멜", tip: "미디엄 기장" }, shoes: { item: "브라운 앵클부츠", color: "브라운", tip: "스택힐" }, accessories: { item: "브라운 토트백", color: "브라운", tip: "구조적 디자인" }, situations: ["출근", "데이트", "캐주얼"], seasons: ["가을(10~20℃)", "겨울(~10℃)"], styles: ["클래식", "미니멀"], bodyTypes: ["보통", "마른"], budgetLevel: 4, colorTone: ["어스톤"], description: "고급스러운 어스톤 레이어드", stylingTip: "어스톤 코디는 같은 톤의 다른 색을 겹겹이", colors: ["#967969", "#708238", "#C19A6B", "#8B4513", "#8B4513"] },
  { name: "레트로 프레피", gender: "여성", top: { item: "네이비 V넥 니트 조끼", color: "네이비", tip: "화이트 셔츠 레이어드" }, bottom: { item: "그레이 플리츠 미니", color: "그레이", tip: "교복 느낌" }, outer: null, shoes: { item: "화이트 메리제인", color: "화이트", tip: "둥근 토" }, accessories: { item: "리본 헤어타이", color: "네이비", tip: "포니테일에" }, situations: ["캐주얼", "소개팅"], seasons: ["봄(10~20℃)", "가을(10~20℃)"], styles: ["클래식", "캐주얼", "로맨틱"], bodyTypes: ["마른", "보통"], budgetLevel: 2, colorTone: ["무채색"], description: "지적이고 사랑스러운 프레피룩", stylingTip: "니트 조끼 + 플리츠 스커트는 댄디한 걸리시 무드", colors: ["#1B3A5C", "#808080", "#FFFFFF", "#1B3A5C"] },
  // 통통 체형 특화
  { name: "체형 커버 A라인 코디", gender: "여성", top: { item: "블랙 V넥 블라우스", color: "블랙", tip: "V넥으로 목선 정리" }, bottom: { item: "다크네이비 A라인 스커트", color: "다크네이비", tip: "무릎 기장 A라인" }, outer: null, shoes: { item: "누드 펌프스", color: "누드", tip: "5cm 힐로 비율 좋게" }, accessories: { item: "롱 펜던트 목걸이", color: "실버", tip: "세로 라인 강조" }, situations: ["출근", "소개팅", "데이트"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["클래식", "미니멀"], bodyTypes: ["통통"], budgetLevel: 2, colorTone: ["무채색"], description: "체형을 자연스럽게 커버하는 A라인 코디", stylingTip: "V넥 + 롱 목걸이로 세로 라인 강조하면 슬림 효과", colors: ["#000000", "#1B2A4A", "#DEB887", "#C0C0C0"] },
  { name: "커브 피트 캐주얼", gender: "여성", top: { item: "다크네이비 랩 블라우스", color: "다크네이비", tip: "랩 디자인으로 허리 강조" }, bottom: { item: "블랙 부츠컷 팬츠", color: "블랙", tip: "부츠컷으로 밸런스" }, outer: null, shoes: { item: "블랙 앵클부츠", color: "블랙", tip: "뾰족한 토" }, accessories: { item: "스카프", color: "네이비/화이트", tip: "목에 포인트로" }, situations: ["캐주얼", "출근"], seasons: ["봄(10~20℃)", "가을(10~20℃)", "환절기"], styles: ["캐주얼", "클래식"], bodyTypes: ["통통"], budgetLevel: 2, colorTone: ["무채색"], description: "커브 있는 체형을 멋지게 살리는 코디", stylingTip: "랩 디자인은 허리를 강조해 글래머러스한 실루엣 연출", colors: ["#1B2A4A", "#000000", "#000000", "#1B3A5C"] },
];

const ALL_OUTFITS = [...MALE_OUTFITS, ...FEMALE_OUTFITS];

/* ══════════════════════════════════════════
   Scoring
   ══════════════════════════════════════════ */
function scoreOutfit(
  outfit: Outfit,
  gender: Gender,
  bodyType: BodyType,
  situation: Situation,
  season: Season,
  style: Style,
  colorPref: ColorPref,
  budget: Budget
): number {
  let score = 0;
  if (outfit.gender !== gender) return -1;
  if (outfit.bodyTypes.includes(bodyType)) score += 20;
  else score -= 10;
  if (outfit.situations.includes(situation)) score += 30;
  if (outfit.seasons.includes(season)) score += 25;
  if (outfit.styles.includes(style)) score += 20;
  if (colorPref === "상관없음" || outfit.colorTone.includes(colorPref)) score += 10;
  const bl = BUDGET_LEVEL[budget];
  if (bl === 5 || outfit.budgetLevel <= bl) score += 10;
  else if (outfit.budgetLevel === bl + 1) score += 3;
  else score -= 5;
  return score;
}

function getDailyOutfits(gender: Gender): Outfit[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const filtered = ALL_OUTFITS.filter((o) => o.gender === gender);
  const shuffled = [...filtered].sort((a, b) => {
    const ha = hashStr(a.name + seed);
    const hb = hashStr(b.name + seed);
    return ha - hb;
  });
  return shuffled.slice(0, 2);
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */
export default function FashionRecommendationPage() {
  const [gender, setGender] = useState<Gender>("여성");
  const [bodyType, setBodyType] = useState<BodyType>("보통");
  const [situation, setSituation] = useState<Situation>("캐주얼");
  const [season, setSeason] = useState<Season>("봄(10~20℃)");
  const [style, setStyle] = useState<Style>("캐주얼");
  const [colorPref, setColorPref] = useState<ColorPref>("상관없음");
  const [budget, setBudget] = useState<Budget>("상관없음");
  const [showResult, setShowResult] = useState(false);
  const [key, setKey] = useState(0);

  const results = useMemo(() => {
    if (!showResult) return [];
    const scored = ALL_OUTFITS.map((o) => ({
      outfit: o,
      score: scoreOutfit(o, gender, bodyType, situation, season, style, colorPref, budget),
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
    return scored;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResult, gender, bodyType, situation, season, style, colorPref, budget, key]);

  const dailyOutfits = useMemo(() => getDailyOutfits(gender), [gender]);

  const maxScore = results.length > 0 ? results[0].score : 1;

  function handleRecommend() {
    setShowResult(true);
    setKey((k) => k + 1);
  }

  function handleReset() {
    setShowResult(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          👗 패션 코디 추천
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          상황, 체형, 스타일에 맞는 코디를 도구가 추천합니다
        </p>
      </div>

      {/* Input Form */}
      <div className="calc-card p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-xl">📝</span> 나의 정보 입력
        </h2>

        {/* 성별 */}
        <OptionGroup label="성별" options={GENDERS} value={gender} onChange={(v) => setGender(v as Gender)} />

        {/* 체형 */}
        <OptionGroup label="체형" options={BODY_TYPES} value={bodyType} onChange={(v) => setBodyType(v as BodyType)} />

        {/* 상황 */}
        <OptionGroup label="상황" options={SITUATIONS} value={situation} onChange={(v) => setSituation(v as Situation)} emojis={SITUATIONS.map((s) => SITUATION_EMOJI[s])} />

        {/* 계절 */}
        <OptionGroup label="계절/날씨" options={SEASONS} value={season} onChange={(v) => setSeason(v as Season)} />

        {/* 스타일 */}
        <OptionGroup label="선호 스타일" options={STYLES} value={style} onChange={(v) => setStyle(v as Style)} emojis={STYLES.map((s) => STYLE_BADGE[s])} />

        {/* 컬러 */}
        <OptionGroup label="컬러 선호" options={COLOR_PREFS} value={colorPref} onChange={(v) => setColorPref(v as ColorPref)} />

        {/* 예산 */}
        <OptionGroup label="예산" options={BUDGETS} value={budget} onChange={(v) => setBudget(v as Budget)} />

        <button onClick={handleRecommend} className="calc-btn-primary w-full text-base py-3.5">
          ✨ 코디 추천받기
        </button>
      </div>

      {/* Results */}
      {showResult && results.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 text-center">
            🎯 추천 코디 TOP 3
          </h2>

          {results.map(({ outfit, score }, idx) => {
            const pct = Math.round((score / maxScore) * 100);
            const mainStyles = outfit.styles.slice(0, 2);
            return (
              <div key={outfit.name + idx} className="calc-card overflow-hidden">
                {/* Header */}
                <div className={`px-5 py-4 ${idx === 0 ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white" : "bg-gray-50"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${idx === 0 ? "text-white" : "text-gray-800"}`}>
                        {idx + 1}위
                      </span>
                      <span className={`text-lg font-bold ${idx === 0 ? "text-white" : "text-gray-900"}`}>
                        {outfit.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {mainStyles.map((s) => (
                        <span key={s} className={`text-xs px-2 py-0.5 rounded-full ${idx === 0 ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}`}>
                          {STYLE_BADGE[s]} {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className={`text-sm mt-1 ${idx === 0 ? "text-blue-100" : "text-gray-500"}`}>
                    {outfit.description}
                  </p>
                </div>

                {/* Outfit pieces */}
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <PieceCard emoji="👕" label="상의" piece={outfit.top} />
                    <PieceCard emoji="👖" label="하의" piece={outfit.bottom} />
                    {outfit.outer && <PieceCard emoji="🧥" label="아우터" piece={outfit.outer} />}
                    <PieceCard emoji="👟" label="신발" piece={outfit.shoes} />
                    <PieceCard emoji="💍" label="소품" piece={outfit.accessories} />
                  </div>

                  {/* Color palette */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">컬러 팔레트</span>
                    <div className="flex gap-1">
                      {outfit.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-5 h-5 rounded-full border border-gray-200"
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Styling tip */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="text-sm text-amber-800">
                      <span className="font-semibold">💡 조건별 스타일링 팁:</span> {outfit.stylingTip}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium">적합도</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-600">{pct}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-center">
            <button onClick={handleReset} className="calc-btn-secondary">
              🔄 다시 추천받기
            </button>
          </div>
        </div>
      )}

      {showResult && results.length === 0 && (
        <div className="calc-card p-8 text-center animate-fade-in">
          <p className="text-4xl mb-3">😅</p>
          <p className="text-gray-600 font-medium">조건에 맞는 코디를 찾지 못했어요.</p>
          <p className="text-gray-400 text-sm mt-1">조건을 변경해 보세요.</p>
          <button onClick={handleReset} className="calc-btn-primary mt-4">다시 시도</button>
        </div>
      )}

      {/* 오늘의 코디 */}
      <div className="calc-card p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">📅</span> 오늘의 코디 ({gender})
        </h2>
        <p className="text-xs text-gray-400 mb-4">매일 새로운 코디가 추천됩니다</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {dailyOutfits.map((o, i) => (
            <div key={o.name} className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800">{i + 1}. {o.name}</span>
                {o.styles.slice(0, 1).map((s) => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    {STYLE_BADGE[s]} {s}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500">{o.description}</p>
              <div className="text-xs text-gray-600 space-y-0.5">
                <p>👕 {o.top.item} ({o.top.color})</p>
                {o.bottom.item !== "(원피스)" && <p>👖 {o.bottom.item} ({o.bottom.color})</p>}
                {o.outer && <p>🧥 {o.outer.item} ({o.outer.color})</p>}
                <p>👟 {o.shoes.item} ({o.shoes.color})</p>
              </div>
              <div className="flex gap-1 mt-1">
                {o.colors.map((c, ci) => (
                  <span key={ci} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fashion Tips */}
      <div className="calc-card p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="text-xl">💡</span> 패션 코디 꿀팁
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: "체형에 맞는 핏 선택", tip: "마른 체형은 레이어드로 볼륨을, 통통 체형은 세로 라인과 A라인으로 균형을 맞추세요.", icon: "👤" },
            { title: "컬러 3가지 법칙", tip: "한 코디에 3가지 이내 색상만 사용하면 깔끔하고 정돈된 느낌을 줄 수 있습니다.", icon: "🎨" },
            { title: "핏의 대비 활용", tip: "상의가 오버핏이면 하의는 슬림하게, 하의가 와이드면 상의는 슬림하게 대비시키세요.", icon: "📐" },
            { title: "소재 믹스 매치", tip: "같은 색이라도 니트, 가죽, 면 등 다른 소재를 섞으면 입체감이 생깁니다.", icon: "🧵" },
            { title: "악세서리의 힘", tip: "심플한 코디도 시계, 팔찌, 스카프 하나로 완성도가 크게 달라집니다.", icon: "✨" },
            { title: "계절감 있는 소재", tip: "봄가을은 면/린넨, 여름은 시어서커/린넨, 겨울은 울/캐시미어가 기본입니다.", icon: "🌤️" },
          ].map((t) => (
            <div key={t.title} className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-sm text-gray-800 mb-1">{t.icon} {t.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="calc-seo-card">
        <h2 className="calc-seo-title">패션 코디 추천이란?</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          패션 코디 추천은 성별, 체형, 상황, 날씨, 스타일 선호도를 종합적으로 분석하여
          가장 적합한 코디를 추천해주는 서비스입니다. 출근 코디, 데이트 코디, 소개팅 코디,
          면접 코디, 여행 코디 등 다양한 상황에 맞는 120가지 이상의 코디 데이터베이스를
          기반으로 맞춤 추천을 제공합니다. &quot;오늘 뭐 입지?&quot; 고민될 때 활용해 보세요.
        </p>
      </div>

      <RelatedTools current="fashion-recommendation" />
    </div>
  );
}

/* ══════════════════════════════════════════
   Sub-components
   ══════════════════════════════════════════ */
function OptionGroup({
  label,
  options,
  value,
  onChange,
  emojis,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  emojis?: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
              value === opt
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {emojis ? `${emojis[i]} ${opt}` : opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function PieceCard({ emoji, label, piece }: { emoji: string; label: string; piece: OutfitPiece }) {
  if (piece.item === "(원피스)") return null;
  return (
    <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
      <span className="text-xl">{emoji}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <p className="text-sm text-gray-600">{piece.item}</p>
        <p className="text-xs text-gray-400">컬러: {piece.color} | {piece.tip}</p>
      </div>
    </div>
  );
}
