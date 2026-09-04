"use client";

import { useState, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
interface DreamKeyword {
  keyword: string;
  interpretation: string;
  luckScore: number;
  luckyNumber: number;
  category: string;
  wealth: string;
  love: string;
  health: string;
}

/* ─── Dream Keyword Database (80+) ─── */
const dreamDatabase: DreamKeyword[] = [
  // ── 동물 (Animals) ──
  { keyword: "뱀", interpretation: "뱀 꿈은 재물운과 깊은 관련이 있습니다. 큰 뱀은 큰 재물을, 작은 뱀은 소소한 행운을 의미합니다. 뱀이 몸을 감는 꿈은 귀인의 도움을 받게 될 징조입니다.", luckScore: 85, luckyNumber: 7, category: "동물", wealth: "큰 재물이 들어올 수 있는 시기입니다. 투자에 좋은 기회가 올 수 있습니다.", love: "새로운 인연이 다가올 수 있습니다. 기존 관계는 더욱 깊어집니다.", health: "전반적으로 양호하나, 소화기 건강에 신경 쓰세요." },
  { keyword: "개", interpretation: "개 꿈은 충성스러운 사람이 곁에 있음을 의미합니다. 개가 따르는 꿈은 좋은 친구나 동료를 만날 징조이며, 짖는 개는 주변의 경고 신호일 수 있습니다.", luckScore: 70, luckyNumber: 3, category: "동물", wealth: "안정적인 수입이 유지됩니다. 큰 변화보다 꾸준함이 중요합니다.", love: "믿을 수 있는 사람이 곁에 있습니다. 신뢰를 쌓아가세요.", health: "규칙적인 운동이 건강 유지의 핵심입니다." },
  { keyword: "고양이", interpretation: "고양이 꿈은 직감과 독립심을 상징합니다. 고양이가 다가오는 꿈은 숨겨진 비밀이 드러날 수 있음을 의미하며, 여성적인 에너지와도 관련됩니다.", luckScore: 60, luckyNumber: 9, category: "동물", wealth: "예상치 못한 지출에 주의하세요. 절약이 곧 재물입니다.", love: "상대방의 숨겨진 마음을 읽을 수 있는 시기입니다.", health: "충분한 수면이 건강의 열쇠입니다." },
  { keyword: "돼지", interpretation: "돼지 꿈은 전통적으로 큰 재물운을 의미하는 대길몽입니다. 특히 황금돼지 꿈은 로또나 횡재의 징조로 해석됩니다. 돼지가 집에 들어오는 꿈은 가정에 복이 들어옴을 뜻합니다.", luckScore: 95, luckyNumber: 8, category: "동물", wealth: "대박의 기운이 있습니다! 복권이나 투자에 행운이 따를 수 있습니다.", love: "풍요롭고 안정적인 관계가 기대됩니다.", health: "식습관 관리에 신경 쓰면 더욱 건강해집니다." },
  { keyword: "용", interpretation: "용 꿈은 최고의 길몽 중 하나입니다. 승진, 합격, 대성공을 암시하며, 하늘을 나는 용은 큰 뜻을 이루게 될 것을 의미합니다. 태몽으로도 매우 좋은 꿈입니다.", luckScore: 98, luckyNumber: 1, category: "동물", wealth: "최고의 재물운! 사업 확장이나 큰 투자에 적극적으로 나서세요.", love: "이상적인 만남이 기다리고 있습니다. 자신감을 가지세요.", health: "넘치는 에너지를 느낄 수 있는 시기입니다." },
  { keyword: "호랑이", interpretation: "호랑이 꿈은 강한 권력과 위엄을 상징합니다. 호랑이를 타는 꿈은 큰 성공을, 호랑이에게 쫓기는 꿈은 현재의 어려움을 극복하게 됨을 의미합니다.", luckScore: 88, luckyNumber: 5, category: "동물", wealth: "리더십을 발휘하면 재물운이 따릅니다.", love: "강렬한 만남이 있을 수 있습니다. 용기를 내세요.", health: "활력이 넘치는 시기입니다. 새로운 운동을 시작해보세요." },
  { keyword: "물고기", interpretation: "물고기 꿈은 재물과 풍요를 상징합니다. 물고기를 잡는 꿈은 원하는 것을 얻게 됨을 의미하며, 큰 물고기일수록 큰 행운이 따릅니다.", luckScore: 82, luckyNumber: 6, category: "동물", wealth: "재물운이 상승하는 시기입니다. 적극적인 재테크를 추천합니다.", love: "감정적으로 풍요로운 시기입니다.", health: "수분 섭취에 신경 쓰세요." },
  { keyword: "새", interpretation: "새 꿈은 자유와 희망, 좋은 소식을 상징합니다. 새가 날아오는 꿈은 기쁜 소식이 올 징조이며, 새가 노래하는 꿈은 행복한 일이 생길 것을 의미합니다.", luckScore: 75, luckyNumber: 4, category: "동물", wealth: "새로운 수입원이 생길 수 있습니다.", love: "설레는 소식이 기다리고 있습니다.", health: "정신적 건강에도 신경 쓰세요. 명상이 도움됩니다." },
  { keyword: "말", interpretation: "말 꿈은 성공과 전진을 상징합니다. 말을 타는 꿈은 목표 달성이 가까워짐을 의미하며, 백마는 특히 길몽입니다. 빠르게 달리는 말은 승진이나 합격을 암시합니다.", luckScore: 80, luckyNumber: 2, category: "동물", wealth: "빠른 성과가 기대됩니다. 적극적으로 도전하세요.", love: "이상적인 파트너를 만날 수 있습니다.", health: "활동적인 시기, 충분한 휴식도 필요합니다." },
  { keyword: "거미", interpretation: "거미 꿈은 인내와 창의성을 상징합니다. 거미줄을 치는 꿈은 계획이 착착 진행됨을 의미하며, 큰 거미는 조력자의 출현을 암시합니다.", luckScore: 55, luckyNumber: 11, category: "동물", wealth: "꾸준한 노력이 결실을 맺게 됩니다.", love: "인연의 실이 이어지고 있습니다. 인내심을 가지세요.", health: "스트레스 관리에 신경 쓰세요." },
  { keyword: "쥐", interpretation: "쥐 꿈은 근면과 재치를 상징합니다. 쥐가 식량을 모으는 꿈은 재물이 쌓임을 의미합니다. 단, 쥐가 도망가는 꿈은 기회를 놓칠 수 있음을 경고합니다.", luckScore: 62, luckyNumber: 12, category: "동물", wealth: "작은 것부터 모으면 큰 재물이 됩니다.", love: "세심한 배려가 관계를 발전시킵니다.", health: "위생 관리에 특히 신경 쓰세요." },
  { keyword: "토끼", interpretation: "토끼 꿈은 행운과 다산을 상징합니다. 하얀 토끼는 특히 좋은 징조이며, 토끼가 뛰어다니는 꿈은 기쁜 일이 연달아 생길 것을 의미합니다.", luckScore: 78, luckyNumber: 15, category: "동물", wealth: "연달아 좋은 기회가 찾아옵니다.", love: "사랑스러운 만남이 기다리고 있습니다.", health: "가벼운 운동이 컨디션을 좋게 합니다." },
  { keyword: "곰", interpretation: "곰 꿈은 강인한 힘과 보호를 상징합니다. 곰이 나타나는 꿈은 든든한 지원자가 있음을 의미하며, 어미곰은 가족의 사랑을 상징합니다.", luckScore: 68, luckyNumber: 10, category: "동물", wealth: "안정적인 재정 상태가 유지됩니다.", love: "가족적인 따뜻한 사랑을 느낄 수 있습니다.", health: "충분한 영양 섭취가 중요합니다." },
  { keyword: "사슴", interpretation: "사슴 꿈은 우아함과 행운을 상징합니다. 사슴이 다가오는 꿈은 좋은 기회가 찾아올 징조이며, 사슴뿔은 지위 상승을 의미합니다.", luckScore: 73, luckyNumber: 14, category: "동물", wealth: "품격 있는 기회가 찾아옵니다.", love: "우아한 만남이 기대됩니다.", health: "자연 속에서의 휴식이 도움됩니다." },
  { keyword: "코끼리", interpretation: "코끼리 꿈은 지혜, 장수, 큰 행운을 상징합니다. 코끼리를 타는 꿈은 높은 지위에 오를 것을 암시하며, 코끼리 떼는 큰 재물을 의미합니다.", luckScore: 90, luckyNumber: 16, category: "동물", wealth: "규모가 큰 재물운이 따릅니다. 대형 프로젝트에 기회가 있습니다.", love: "오래 지속될 깊은 사랑이 기대됩니다.", health: "장기적인 건강 관리가 좋은 결과를 가져옵니다." },
  { keyword: "나비", interpretation: "나비 꿈은 변화와 아름다움을 상징합니다. 나비가 날아다니는 꿈은 인생의 전환점이 가까워짐을 의미하며, 화려한 나비는 기쁜 소식을 암시합니다.", luckScore: 72, luckyNumber: 20, category: "동물", wealth: "변화가 곧 기회입니다. 새로운 도전에 나서세요.", love: "아름다운 사랑이 시작될 수 있습니다.", health: "마음의 평화가 건강의 바탕입니다." },

  // ── 자연 (Nature) ──
  { keyword: "물", interpretation: "맑은 물 꿈은 정화와 새로운 시작을 상징합니다. 깨끗한 물은 행운을, 흐린 물은 걱정거리를 의미합니다. 물이 넘치는 꿈은 풍요로움의 상징입니다.", luckScore: 74, luckyNumber: 6, category: "자연", wealth: "재물의 흐름이 좋아집니다. 물처럼 자연스럽게 흘러갈 것입니다.", love: "감정이 풍부해지는 시기입니다.", health: "수분 보충과 해독이 필요한 시기입니다." },
  { keyword: "불", interpretation: "불 꿈은 열정과 변화를 상징합니다. 활활 타오르는 불은 사업의 번창을, 불이 꺼지는 꿈은 재충전이 필요함을 의미합니다. 집에 불이 나는 꿈은 역설적으로 길몽입니다.", luckScore: 77, luckyNumber: 9, category: "자연", wealth: "열정을 쏟은 만큼 보상이 따릅니다.", love: "뜨거운 감정이 싹트는 시기입니다.", health: "과로에 주의하세요. 열정도 조절이 필요합니다." },
  { keyword: "바람", interpretation: "바람 꿈은 변화와 새로운 기운을 상징합니다. 시원한 바람은 좋은 변화를, 강한 바람은 시련을 넘기게 됨을 의미합니다.", luckScore: 58, luckyNumber: 13, category: "자연", wealth: "변화의 바람을 잘 타면 수익이 생깁니다.", love: "새로운 만남의 바람이 불어옵니다.", health: "감기 예방에 신경 쓰세요." },
  { keyword: "산", interpretation: "산 꿈은 목표와 도전을 상징합니다. 산에 오르는 꿈은 목표 달성이 가까워짐을 의미하며, 산 정상에 서는 꿈은 큰 성취를 암시합니다.", luckScore: 80, luckyNumber: 1, category: "자연", wealth: "꾸준한 노력이 큰 성과로 이어집니다.", love: "함께 목표를 향해 가는 동반자를 만날 수 있습니다.", health: "체력 단련이 필요한 시기입니다." },
  { keyword: "바다", interpretation: "바다 꿈은 무한한 가능성과 잠재의식을 상징합니다. 잔잔한 바다는 마음의 평화를, 파도치는 바다는 감정의 기복을 의미합니다. 넓은 바다는 큰 기회를 암시합니다.", luckScore: 76, luckyNumber: 7, category: "자연", wealth: "넓은 시야로 보면 큰 기회가 보입니다.", love: "깊은 감정이 교류되는 시기입니다.", health: "정신적 휴식이 필요합니다." },
  { keyword: "비", interpretation: "비 꿈은 정화와 풍요를 상징합니다. 비가 내리는 꿈은 근심이 씻겨 나감을 의미하며, 비 맞는 꿈은 축복이 내려옴을 뜻합니다.", luckScore: 69, luckyNumber: 18, category: "자연", wealth: "곧 좋은 소식이 찾아옵니다.", love: "감성적인 만남이 있을 수 있습니다.", health: "면역력 관리에 신경 쓰세요." },
  { keyword: "눈", interpretation: "눈 꿈은 순수함과 새로운 시작을 상징합니다. 하얀 눈이 내리는 꿈은 깨끗한 시작을, 눈이 쌓인 풍경은 풍요로운 미래를 의미합니다.", luckScore: 71, luckyNumber: 22, category: "자연", wealth: "깨끗한 마음으로 시작하면 재물이 따릅니다.", love: "순수한 사랑이 찾아올 수 있습니다.", health: "보온에 신경 쓰세요." },
  { keyword: "하늘", interpretation: "하늘 꿈은 희망과 무한한 가능성을 상징합니다. 맑은 하늘은 밝은 미래를, 별이 빛나는 하늘은 소원 성취를 의미합니다.", luckScore: 83, luckyNumber: 3, category: "자연", wealth: "높은 목표를 세워도 달성할 수 있습니다.", love: "이상적인 사랑이 가까이 있습니다.", health: "긍정적인 마인드가 건강을 지켜줍니다." },
  { keyword: "꽃", interpretation: "꽃 꿈은 아름다움과 사랑, 축하를 상징합니다. 꽃이 피는 꿈은 기쁜 일이 생길 징조이며, 꽃다발을 받는 꿈은 사랑이나 인정을 받게 됨을 의미합니다.", luckScore: 79, luckyNumber: 17, category: "자연", wealth: "노력한 일이 꽃을 피웁니다.", love: "아름다운 사랑이 꽃피는 시기입니다.", health: "알레르기에 주의하세요." },
  { keyword: "나무", interpretation: "나무 꿈은 성장과 안정을 상징합니다. 큰 나무는 든든한 기반을, 새싹이 나는 나무는 새로운 시작을 의미합니다. 열매 맺는 나무는 성과를 암시합니다.", luckScore: 73, luckyNumber: 5, category: "자연", wealth: "장기적인 투자가 결실을 맺습니다.", love: "뿌리 깊은 관계가 형성됩니다.", health: "꾸준한 건강 관리가 중요합니다." },
  { keyword: "달", interpretation: "달 꿈은 여성적 에너지와 직관을 상징합니다. 보름달은 소원 성취를, 초승달은 새로운 시작을 의미합니다. 밝은 달빛은 진실이 밝혀짐을 암시합니다.", luckScore: 81, luckyNumber: 15, category: "자연", wealth: "직감을 따르면 좋은 결과가 있습니다.", love: "로맨틱한 만남이 기대됩니다.", health: "수면의 질에 신경 쓰세요." },
  { keyword: "별", interpretation: "별 꿈은 희망과 소원 성취를 상징합니다. 별똥별은 소원이 이루어질 징조이며, 밝은 별은 앞길이 밝음을 의미합니다.", luckScore: 84, luckyNumber: 24, category: "자연", wealth: "소원이 이루어질 때가 가까워지고 있습니다.", love: "운명적인 만남의 가능성이 있습니다.", health: "마음의 평화가 건강에 도움됩니다." },
  { keyword: "해", interpretation: "해(태양) 꿈은 생명력, 성공, 번영을 상징합니다. 떠오르는 해는 새로운 시작과 승승장구를, 밝은 햇살은 행복한 나날을 의미합니다.", luckScore: 92, luckyNumber: 1, category: "자연", wealth: "밝은 재물운! 자신감을 가지고 도전하세요.", love: "밝고 따뜻한 사랑이 기대됩니다.", health: "활력이 넘치는 시기입니다." },
  { keyword: "구름", interpretation: "구름 꿈은 상상력과 변화를 상징합니다. 흰 구름은 평화를, 먹구름은 일시적인 어려움을 의미합니다. 구름 위를 걷는 꿈은 큰 성취를 암시합니다.", luckScore: 63, luckyNumber: 19, category: "자연", wealth: "상황이 곧 개선될 것입니다.", love: "가볍고 즐거운 만남이 있을 수 있습니다.", health: "기분 전환이 필요한 시기입니다." },
  { keyword: "무지개", interpretation: "무지개 꿈은 최고의 길몽 중 하나입니다. 희망, 행운, 약속을 상징하며, 어려운 시기 후 좋은 일이 찾아올 것을 의미합니다.", luckScore: 93, luckyNumber: 7, category: "자연", wealth: "노력의 보상이 화려하게 찾아옵니다.", love: "아름다운 사랑의 약속이 이루어집니다.", health: "마음과 몸이 모두 건강한 시기입니다." },
  { keyword: "지진", interpretation: "지진 꿈은 큰 변화와 전환점을 상징합니다. 불안할 수 있지만, 기존 질서가 무너지고 새로운 기회가 열림을 의미합니다.", luckScore: 45, luckyNumber: 21, category: "자연", wealth: "변동성이 크지만 기회도 있습니다.", love: "관계에 변화가 올 수 있습니다.", health: "스트레스 관리가 중요합니다." },
  { keyword: "홍수", interpretation: "홍수 꿈은 감정의 범람과 변화를 상징합니다. 홍수로 물이 넘치는 꿈은 역설적으로 재물이 넘침을 의미하는 길몽으로 해석되기도 합니다.", luckScore: 65, luckyNumber: 28, category: "자연", wealth: "넘치는 재물운이지만 관리가 필요합니다.", love: "감정이 넘치는 시기, 솔직해지세요.", health: "감정 조절에 신경 쓰세요." },

  // ── 행동 (Actions) ──
  { keyword: "떨어지다", interpretation: "떨어지는 꿈은 현재 삶에서 불안감이나 통제력 상실을 느끼고 있음을 반영합니다. 하지만 이는 새로운 시작의 신호이기도 합니다. 안전하게 착지하면 문제 해결을 의미합니다.", luckScore: 40, luckyNumber: 23, category: "행동", wealth: "큰 결정은 신중하게 하세요.", love: "불안감을 솔직히 표현하면 관계가 나아집니다.", health: "심리적 안정이 필요합니다." },
  { keyword: "날다", interpretation: "나는 꿈은 자유와 해방감을 상징합니다. 높이 나는 꿈은 목표 달성과 성공을, 자유롭게 나는 꿈은 현실의 속박에서 벗어나고 싶은 마음을 반영합니다.", luckScore: 86, luckyNumber: 11, category: "행동", wealth: "높은 목표가 이루어질 수 있습니다.", love: "자유롭고 설레는 연애가 기대됩니다.", health: "정신적 활력이 넘치는 시기입니다." },
  { keyword: "달리다", interpretation: "달리는 꿈은 목표를 향한 전진을 상징합니다. 빠르게 달리는 꿈은 성공이 가까워짐을, 달리지 못하는 꿈은 현재의 장애물을 의미합니다.", luckScore: 72, luckyNumber: 4, category: "행동", wealth: "속도감 있게 목표에 다가가고 있습니다.", love: "적극적인 태도가 좋은 결과를 만듭니다.", health: "체력 관리에 신경 쓰세요." },
  { keyword: "쫓기다", interpretation: "쫓기는 꿈은 현실에서 회피하고 싶은 문제가 있음을 반영합니다. 문제를 직면하면 해결의 실마리를 찾을 수 있다는 메시지입니다.", luckScore: 35, luckyNumber: 25, category: "행동", wealth: "미루던 재정 문제를 해결할 때입니다.", love: "관계에서 도망치지 말고 대면하세요.", health: "스트레스 해소가 시급합니다." },
  { keyword: "싸우다", interpretation: "싸우는 꿈은 내면의 갈등이나 경쟁 상황을 반영합니다. 싸움에서 이기는 꿈은 어려움 극복을, 지는 꿈은 양보가 필요함을 의미합니다.", luckScore: 50, luckyNumber: 8, category: "행동", wealth: "경쟁에서 이길 수 있는 힘이 있습니다.", love: "갈등을 대화로 풀어가세요.", health: "혈압 관리에 주의하세요." },
  { keyword: "울다", interpretation: "우는 꿈은 감정의 정화를 상징합니다. 시원하게 우는 꿈은 스트레스 해소와 새로운 시작을, 슬퍼서 우는 꿈은 기쁜 일이 올 전조일 수 있습니다.", luckScore: 55, luckyNumber: 26, category: "행동", wealth: "감정을 정리하면 판단력이 좋아집니다.", love: "진심을 표현하면 관계가 깊어집니다.", health: "감정 표현이 건강에 도움됩니다." },
  { keyword: "웃다", interpretation: "웃는 꿈은 행복과 만족을 상징합니다. 크게 웃는 꿈은 기쁜 소식이 올 징조이며, 함께 웃는 꿈은 좋은 인간관계를 의미합니다.", luckScore: 78, luckyNumber: 17, category: "행동", wealth: "긍정적인 마인드가 재물을 끌어옵니다.", love: "즐거운 만남이 기대됩니다.", health: "웃음은 최고의 건강법입니다." },
  { keyword: "죽다", interpretation: "죽는 꿈은 끝이 아닌 변화와 재탄생을 상징합니다. 자신이 죽는 꿈은 새로운 시작을, 다른 사람이 죽는 꿈은 그 관계의 변화를 의미합니다. 전통적으로 길몽입니다.", luckScore: 70, luckyNumber: 30, category: "행동", wealth: "새로운 기회가 열립니다. 변화를 두려워하지 마세요.", love: "관계가 한 단계 발전할 수 있습니다.", health: "생활 습관의 변화가 필요한 시기입니다." },
  { keyword: "결혼하다", interpretation: "결혼하는 꿈은 결합과 새로운 시작을 상징합니다. 본인의 결혼은 인생의 전환점을, 타인의 결혼은 좋은 소식을 듣게 됨을 의미합니다.", luckScore: 82, luckyNumber: 2, category: "행동", wealth: "협력을 통해 더 큰 성과를 얻을 수 있습니다.", love: "사랑이 결실을 맺는 시기입니다.", health: "정서적 안정감이 건강에 도움됩니다." },
  { keyword: "시험보다", interpretation: "시험 꿈은 자기 검증과 불안감을 반영합니다. 시험에 합격하는 꿈은 노력의 결실을, 떨어지는 꿈은 역설적으로 좋은 결과를 암시합니다.", luckScore: 60, luckyNumber: 100, category: "행동", wealth: "준비한 만큼 성과가 나타납니다.", love: "상대방에게 인정받게 됩니다.", health: "긴장을 풀고 릴렉스하세요." },
  { keyword: "수영하다", interpretation: "수영하는 꿈은 감정의 바다를 헤쳐나가는 것을 상징합니다. 자유롭게 수영하는 꿈은 어려움을 잘 극복하고 있음을, 빠지는 꿈은 도움이 필요함을 의미합니다.", luckScore: 67, luckyNumber: 14, category: "행동", wealth: "꾸준히 나아가면 목표에 도달합니다.", love: "감정의 흐름에 몸을 맡기세요.", health: "수영이나 수중 운동이 도움됩니다." },
  { keyword: "노래하다", interpretation: "노래하는 꿈은 감정 표현과 자신감을 상징합니다. 크게 노래하는 꿈은 자기 표현의 욕구를, 아름다운 노래는 행복한 일이 올 것을 의미합니다.", luckScore: 74, luckyNumber: 33, category: "행동", wealth: "자신의 재능이 인정받게 됩니다.", love: "감정을 솔직히 표현하면 좋은 반응이 있습니다.", health: "스트레스 해소에 노래가 효과적입니다." },

  // ── 사물 (Objects) ──
  { keyword: "돈", interpretation: "돈 꿈은 가치와 자존감을 상징합니다. 돈을 줍는 꿈은 예상치 못한 행운을, 돈을 잃는 꿈은 역설적으로 이익을 의미합니다. 많은 돈은 풍요로움의 징조입니다.", luckScore: 88, luckyNumber: 8, category: "사물", wealth: "재물운이 매우 강한 시기입니다!", love: "물질적 안정이 관계에도 좋은 영향을 줍니다.", health: "마음의 풍요가 건강의 바탕입니다." },
  { keyword: "집", interpretation: "집 꿈은 자아와 안정감을 상징합니다. 새 집은 새로운 시작을, 큰 집은 성공과 번영을 의미합니다. 집을 짓는 꿈은 인생의 기반을 다지는 것을 암시합니다.", luckScore: 80, luckyNumber: 10, category: "사물", wealth: "부동산이나 안정적인 투자가 유리합니다.", love: "안정적인 관계가 형성됩니다.", health: "가정에서의 편안한 휴식이 중요합니다." },
  { keyword: "차", interpretation: "자동차 꿈은 인생의 방향과 통제력을 상징합니다. 새 차는 새로운 출발을, 운전하는 꿈은 인생을 주도하고 있음을 의미합니다.", luckScore: 72, luckyNumber: 27, category: "사물", wealth: "목표를 향해 빠르게 나아가고 있습니다.", love: "함께 여행을 떠나면 관계가 좋아집니다.", health: "안전에 주의하세요." },
  { keyword: "신발", interpretation: "신발 꿈은 사회적 지위와 인생의 여정을 상징합니다. 새 신발은 새로운 기회를, 신발을 잃는 꿈은 방향 전환이 필요함을 의미합니다.", luckScore: 65, luckyNumber: 29, category: "사물", wealth: "새로운 방향으로의 전환이 이익을 가져옵니다.", love: "함께 걸어갈 사람이 나타날 수 있습니다.", health: "발 건강에 신경 쓰세요." },
  { keyword: "옷", interpretation: "옷 꿈은 자기 이미지와 사회적 역할을 상징합니다. 새 옷은 새로운 변화를, 아름다운 옷은 인정과 칭찬을 받게 됨을 의미합니다.", luckScore: 68, luckyNumber: 16, category: "사물", wealth: "외적 투자가 좋은 결과를 가져옵니다.", love: "매력이 상승하는 시기입니다.", health: "체온 조절에 신경 쓰세요." },
  { keyword: "반지", interpretation: "반지 꿈은 약속과 영원을 상징합니다. 반지를 끼는 꿈은 중요한 약속이나 계약을, 반지를 받는 꿈은 사랑의 고백을 의미합니다.", luckScore: 83, luckyNumber: 2, category: "사물", wealth: "좋은 계약이나 거래가 성사됩니다.", love: "사랑의 약속이 이루어질 수 있습니다.", health: "정서적 안정감이 좋습니다." },
  { keyword: "칼", interpretation: "칼 꿈은 결단력과 분리를 상징합니다. 칼을 쥐는 꿈은 중요한 결정을 내릴 때가 됐음을, 칼에 베이는 꿈은 관계의 변화를 의미합니다.", luckScore: 48, luckyNumber: 31, category: "사물", wealth: "과감한 결단이 이익을 가져옵니다.", love: "확실한 결정이 필요한 시기입니다.", health: "안전에 주의하세요." },
  { keyword: "거울", interpretation: "거울 꿈은 자기 성찰과 진실을 상징합니다. 거울에 비친 모습이 좋으면 자신감 상승을, 깨진 거울은 고정관념의 파괴와 새로운 시각을 의미합니다.", luckScore: 57, luckyNumber: 12, category: "사물", wealth: "자신을 돌아보면 새로운 기회가 보입니다.", love: "자기 사랑이 좋은 관계의 시작입니다.", health: "정기 검진을 받아보세요." },
  { keyword: "열쇠", interpretation: "열쇠 꿈은 기회와 해결책을 상징합니다. 열쇠를 찾는 꿈은 문제 해결의 실마리를, 문을 여는 열쇠는 새로운 기회가 열림을 의미합니다.", luckScore: 79, luckyNumber: 7, category: "사물", wealth: "기회의 문이 열리고 있습니다.", love: "마음의 문을 열면 사랑이 찾아옵니다.", health: "건강 문제의 해결책을 찾을 수 있습니다." },
  { keyword: "전화", interpretation: "전화 꿈은 소통과 연결을 상징합니다. 전화를 받는 꿈은 중요한 소식이 올 징조이며, 전화를 거는 꿈은 누군가에게 연락하고 싶은 마음을 반영합니다.", luckScore: 64, luckyNumber: 11, category: "사물", wealth: "연락이 기회로 이어질 수 있습니다.", love: "그리운 사람과의 연결이 이어집니다.", health: "대화를 통한 스트레스 해소가 효과적입니다." },
  { keyword: "책", interpretation: "책 꿈은 지식과 성장을 상징합니다. 책을 읽는 꿈은 지혜를 얻게 됨을, 많은 책은 다양한 기회가 있음을 의미합니다.", luckScore: 71, luckyNumber: 42, category: "사물", wealth: "배움이 곧 재물로 이어집니다.", love: "지적인 만남이 기대됩니다.", health: "정신적 성장이 전반적 건강에 도움됩니다." },

  // ── 사람 (People) ──
  { keyword: "부모", interpretation: "부모님 꿈은 보호와 근원을 상징합니다. 부모님이 건강한 모습은 가정의 안녕을, 부모님과 대화하는 꿈은 조언이 필요한 시기임을 의미합니다.", luckScore: 72, luckyNumber: 3, category: "사람", wealth: "가족과의 협력이 재물운을 높입니다.", love: "가족의 지지가 사랑에 힘이 됩니다.", health: "가족 건강 검진을 고려해보세요." },
  { keyword: "연인", interpretation: "연인 꿈은 사랑과 친밀감을 상징합니다. 연인과 행복한 꿈은 관계의 안정을, 다투는 꿈은 역설적으로 관계가 더 깊어질 수 있음을 의미합니다.", luckScore: 75, luckyNumber: 14, category: "사람", wealth: "파트너와의 협력이 재물에 도움됩니다.", love: "사랑이 더욱 깊어지는 시기입니다.", health: "함께하는 활동이 건강에 좋습니다." },
  { keyword: "아기", interpretation: "아기 꿈은 새로운 시작과 순수함을 상징합니다. 아기를 안는 꿈은 좋은 일이 생길 징조이며, 태몽의 경우 건강한 자녀를 의미합니다. 귀여운 아기는 재물운과도 연결됩니다.", luckScore: 87, luckyNumber: 9, category: "사람", wealth: "새로운 프로젝트가 좋은 결실을 맺습니다.", love: "새로운 생명같은 사랑이 시작될 수 있습니다.", health: "체력 관리에 신경 쓰세요." },
  { keyword: "죽은 사람", interpretation: "돌아가신 분의 꿈은 그리움과 메시지를 상징합니다. 돌아가신 분이 웃는 꿈은 축복을, 무언가를 주는 꿈은 행운이 따를 것을 의미합니다. 전통적으로 조상의 보살핌으로 해석합니다.", luckScore: 75, luckyNumber: 44, category: "사람", wealth: "조상의 도움으로 재물운이 따릅니다.", love: "과거의 인연이 현재에 영향을 줍니다.", health: "마음의 치유가 필요한 시기일 수 있습니다." },
  { keyword: "유명인", interpretation: "유명인 꿈은 욕망과 목표를 상징합니다. 유명인을 만나는 꿈은 자신의 잠재력이 높음을, 유명인이 되는 꿈은 인정받고 싶은 욕구를 반영합니다.", luckScore: 66, luckyNumber: 35, category: "사람", wealth: "자신의 가치를 높이면 재물이 따릅니다.", love: "매력이 빛나는 시기입니다.", health: "자존감을 높이는 활동이 도움됩니다." },
  { keyword: "낯선 사람", interpretation: "낯선 사람 꿈은 자아의 새로운 면을 상징합니다. 친절한 낯선 사람은 도움을 줄 귀인의 출현을, 무서운 낯선 사람은 내면의 두려움을 반영합니다.", luckScore: 55, luckyNumber: 37, category: "사람", wealth: "새로운 인맥이 기회가 됩니다.", love: "예상치 못한 만남이 있을 수 있습니다.", health: "새로운 환경에 적응이 필요합니다." },
  { keyword: "친구", interpretation: "친구 꿈은 사회적 관계와 지지를 상징합니다. 친구와 즐거운 꿈은 우정의 강화를, 친구와 다투는 꿈은 소통의 필요성을 의미합니다.", luckScore: 69, luckyNumber: 6, category: "사람", wealth: "인맥이 재물운에 도움이 됩니다.", love: "우정에서 사랑으로 발전할 수 있습니다.", health: "사회적 활동이 건강에 도움됩니다." },

  // ── 상황 (Situations) ──
  { keyword: "치아 빠지는 꿈", interpretation: "치아가 빠지는 꿈은 가장 흔한 꿈 중 하나로, 자존감의 변화나 중요한 것을 잃는 것에 대한 두려움을 반영합니다. 하지만 전통적으로는 가족에게 좋은 일이 생길 징조로도 해석됩니다.", luckScore: 45, luckyNumber: 32, category: "상황", wealth: "재정 관리를 꼼꼼히 하세요.", love: "자신감이 매력의 핵심입니다.", health: "치아와 뼈 건강에 신경 쓰세요." },
  { keyword: "임신 꿈", interpretation: "임신 꿈은 새로운 프로젝트나 아이디어의 탄생을 상징합니다. 실제 임신이 아니더라도 창의적 에너지가 넘치는 시기입니다. 태몽의 경우 건강한 자녀를 의미합니다.", luckScore: 85, luckyNumber: 9, category: "상황", wealth: "새로운 사업이나 투자가 좋은 결실을 맺습니다.", love: "사랑의 결실이 기대됩니다.", health: "여성 건강에 특히 신경 쓰세요." },
  { keyword: "이사 꿈", interpretation: "이사 꿈은 인생의 전환과 새로운 환경을 상징합니다. 좋은 집으로 이사하는 꿈은 상황이 나아짐을, 이사 과정이 순탄한 꿈은 순조로운 변화를 의미합니다.", luckScore: 70, luckyNumber: 18, category: "상황", wealth: "새로운 환경이 재물운을 가져옵니다.", love: "새로운 환경에서 새로운 인연을 만납니다.", health: "환경 변화에 적응하는 시간이 필요합니다." },
  { keyword: "시험 꿈", interpretation: "시험 꿈은 평가에 대한 불안을 반영합니다. 시험을 잘 보는 꿈은 준비가 잘 되어 있음을, 시험에 늦는 꿈은 기회를 놓칠까 하는 걱정을 의미합니다.", luckScore: 55, luckyNumber: 100, category: "상황", wealth: "철저한 준비가 성과로 이어집니다.", love: "상대방의 기대에 부응하려 노력하세요.", health: "시험 스트레스를 잘 관리하세요." },
  { keyword: "사고 꿈", interpretation: "사고 꿈은 삶에서 통제할 수 없는 상황에 대한 두려움을 반영합니다. 하지만 전통적으로 사고 꿈은 액을 꿈으로 푼 것으로, 오히려 안전을 암시합니다.", luckScore: 42, luckyNumber: 13, category: "상황", wealth: "리스크 관리에 신경 쓰세요.", love: "상대방을 더 소중히 여기게 됩니다.", health: "안전에 각별히 주의하세요." },
  { keyword: "결혼 꿈", interpretation: "결혼 꿈은 인생의 중요한 결합과 약속을 상징합니다. 행복한 결혼 꿈은 좋은 일이 생길 징조이며, 결혼 준비 꿈은 중요한 프로젝트의 시작을 의미합니다.", luckScore: 81, luckyNumber: 22, category: "상황", wealth: "파트너십이 재물운을 높입니다.", love: "사랑의 결실이 가까워지고 있습니다.", health: "정서적 안정감이 건강에 좋습니다." },
  { keyword: "졸업 꿈", interpretation: "졸업 꿈은 한 단계의 완성과 새로운 시작을 상징합니다. 졸업장을 받는 꿈은 노력의 인정을, 졸업식에 참석하는 꿈은 성취감을 의미합니다.", luckScore: 76, luckyNumber: 20, category: "상황", wealth: "그동안의 노력이 보상으로 돌아옵니다.", love: "관계가 한 단계 성숙해집니다.", health: "새로운 건강 목표를 세워보세요." },
  { keyword: "전쟁 꿈", interpretation: "전쟁 꿈은 내면의 갈등이나 큰 변화를 상징합니다. 전쟁에서 살아남는 꿈은 어려움을 극복하게 됨을, 전쟁이 끝나는 꿈은 평화로운 시기가 옴을 의미합니다.", luckScore: 38, luckyNumber: 45, category: "상황", wealth: "격동의 시기를 잘 버티면 큰 보상이 옵니다.", love: "갈등을 극복하면 관계가 단단해집니다.", health: "심리적 케어가 필요합니다." },
  { keyword: "여행 꿈", interpretation: "여행 꿈은 인생의 여정과 탐험을 상징합니다. 즐거운 여행은 좋은 변화를, 외국 여행은 넓어지는 세계관을 의미합니다.", luckScore: 77, luckyNumber: 15, category: "상황", wealth: "시야를 넓히면 새로운 기회가 보입니다.", love: "함께 여행할 인연이 기대됩니다.", health: "충분한 휴식과 재충전이 필요합니다." },
  { keyword: "추락 꿈", interpretation: "추락하는 꿈은 현재 상황에서의 불안감과 두려움을 반영합니다. 하지만 추락 후 무사한 꿈은 역경을 극복하게 됨을 의미하며, 새로운 도약의 전조가 될 수 있습니다.", luckScore: 37, luckyNumber: 23, category: "상황", wealth: "무리한 투자는 피하세요.", love: "불안한 마음을 솔직히 나누세요.", health: "고소공포증이나 불안 장애에 관심을 가지세요." },
  { keyword: "화재 꿈", interpretation: "화재 꿈은 변화와 재생을 상징합니다. 집에 불이 나는 꿈은 역설적으로 큰 재물운을 의미하며, 불길이 클수록 더 큰 행운을 암시합니다. 한국 전통에서 대표적인 길몽입니다.", luckScore: 83, luckyNumber: 36, category: "상황", wealth: "큰 재물운의 징조입니다! 적극적으로 기회를 잡으세요.", love: "열정적인 사랑이 시작될 수 있습니다.", health: "열이 많은 체질이면 주의가 필요합니다." },
  { keyword: "도둑 꿈", interpretation: "도둑 꿈은 상실과 변화를 상징합니다. 도둑이 물건을 훔쳐가는 꿈은 역설적으로 근심이 사라짐을 의미하며, 도둑을 잡는 꿈은 손실을 회복하게 됨을 뜻합니다.", luckScore: 58, luckyNumber: 41, category: "상황", wealth: "재정 보안에 신경 쓰세요. 잃는 것이 곧 얻는 것일 수 있습니다.", love: "마음을 빼앗길 만큼 매력적인 사람을 만날 수 있습니다.", health: "보안과 안전에 신경 쓰세요." },

  // ── 추가 키워드들 ──
  { keyword: "계단", interpretation: "계단 꿈은 인생의 단계적 성장을 상징합니다. 계단을 오르는 꿈은 발전과 성공을, 내려가는 꿈은 겸손함이 필요함을 의미합니다.", luckScore: 68, luckyNumber: 7, category: "사물", wealth: "단계적으로 목표에 다가가고 있습니다.", love: "관계가 점점 발전하고 있습니다.", health: "무릎과 관절 건강에 신경 쓰세요." },
  { keyword: "다리", interpretation: "다리(bridge) 꿈은 전환과 연결을 상징합니다. 다리를 건너는 꿈은 어려움을 극복함을, 아름다운 다리는 좋은 인연을 의미합니다.", luckScore: 70, luckyNumber: 19, category: "사물", wealth: "새로운 기회로 넘어가는 시기입니다.", love: "인연의 다리가 놓여지고 있습니다.", health: "과도기적 스트레스에 주의하세요." },
  { keyword: "금", interpretation: "금 꿈은 최고의 가치와 번영을 상징합니다. 금을 줍는 꿈은 큰 재물을, 금반지나 금목걸이는 귀한 인연을 의미합니다.", luckScore: 94, luckyNumber: 8, category: "사물", wealth: "최고의 재물운! 로또나 투자에 행운이 따릅니다.", love: "귀한 인연이 기다리고 있습니다.", health: "건강도 금같이 소중히 관리하세요." },
  { keyword: "보석", interpretation: "보석 꿈은 가치 있는 것과 아름다움을 상징합니다. 보석을 얻는 꿈은 소중한 것을 얻게 됨을, 빛나는 보석은 재능의 발현을 의미합니다.", luckScore: 86, luckyNumber: 33, category: "사물", wealth: "숨겨진 재능이 재물로 이어집니다.", love: "보석같이 빛나는 사랑이 기대됩니다.", health: "자신을 가꾸는 것이 건강의 시작입니다." },
  { keyword: "학교", interpretation: "학교 꿈은 배움과 성장, 과거의 기억을 상징합니다. 학교에 다시 다니는 꿈은 새로운 것을 배울 시기임을, 학교에서 즐거운 꿈은 좋은 인간관계를 의미합니다.", luckScore: 62, luckyNumber: 40, category: "상황", wealth: "자기계발이 재물운을 높입니다.", love: "학창시절 같은 순수한 사랑이 기대됩니다.", health: "지적 활동이 두뇌 건강에 좋습니다." },
  { keyword: "병원", interpretation: "병원 꿈은 치유와 회복을 상징합니다. 병원에 가는 꿈은 문제 해결의 의지를, 병원에서 나오는 꿈은 회복과 새 출발을 의미합니다.", luckScore: 50, luckyNumber: 47, category: "상황", wealth: "건강이 최우선, 건강해야 돈도 법니다.", love: "서로를 치유해주는 관계가 중요합니다.", health: "건강 검진을 받아보세요." },
  { keyword: "비행기", interpretation: "비행기 꿈은 높은 목표와 야망을 상징합니다. 비행기를 타는 꿈은 큰 도약을, 비행기가 이륙하는 꿈은 프로젝트의 시작을 의미합니다.", luckScore: 82, luckyNumber: 5, category: "사물", wealth: "큰 목표를 향해 나아갈 때입니다.", love: "관계가 새로운 차원으로 발전합니다.", health: "높은 곳에서의 안전에 주의하세요." },
  { keyword: "꿈속의 꿈", interpretation: "꿈속에서 꿈을 꾸는 것은 깊은 잠재의식의 메시지입니다. 현실과 꿈의 경계를 탐험하고 있으며, 중요한 깨달음이 다가오고 있음을 의미합니다.", luckScore: 60, luckyNumber: 99, category: "상황", wealth: "직감을 믿으면 좋은 결과가 있습니다.", love: "깊은 감정의 교류가 필요합니다.", health: "수면의 질에 특히 신경 쓰세요." },
  { keyword: "귀신", interpretation: "귀신 꿈은 해결되지 않은 과거의 문제나 두려움을 상징합니다. 귀신을 물리치는 꿈은 문제 해결을, 귀신이 도와주는 꿈은 보이지 않는 도움을 의미합니다.", luckScore: 40, luckyNumber: 13, category: "상황", wealth: "과거의 문제를 정리하면 재물운이 트입니다.", love: "과거의 상처를 치유하면 새 사랑이 옵니다.", health: "심리적 안정이 필요합니다." },
  { keyword: "태풍", interpretation: "태풍 꿈은 격렬한 변화와 시련을 상징합니다. 태풍이 지나간 후의 평화는 어려움 극복 후의 안정을, 태풍 속에서 무사한 꿈은 강한 의지를 의미합니다.", luckScore: 43, luckyNumber: 38, category: "자연", wealth: "시련 후에 큰 기회가 옵니다.", love: "폭풍 같은 감정 후 더 단단해집니다.", health: "면역력 강화에 힘쓰세요." },
  { keyword: "꿈에서 깨다", interpretation: "꿈에서 깨어나는 꿈은 각성과 깨달음을 상징합니다. 새로운 인식이 열리고 있으며, 현실에서 중요한 깨달음을 얻게 될 것을 의미합니다.", luckScore: 65, luckyNumber: 50, category: "상황", wealth: "새로운 시각으로 기회를 발견합니다.", love: "관계에 대한 새로운 깨달음이 있습니다.", health: "충분한 수면이 가장 중요합니다." },
];

/* ─── Category colors ─── */
const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  "동물": { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "자연": { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  "행동": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "사물": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  "사람": { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  "상황": { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

/* ─── Category emojis ─── */
const categoryEmojis: Record<string, string> = {
  "동물": "🐾",
  "자연": "🌿",
  "행동": "🏃",
  "사물": "💎",
  "사람": "👤",
  "상황": "🎭",
};

/* ─── Popular dream keywords ─── */
const popularKeywords = [
  "뱀", "돼지", "용", "돈", "치아 빠지는 꿈", "물", "불", "임신 꿈",
  "날다", "죽다", "떨어지다", "호랑이", "아기", "금", "결혼 꿈",
  "바다", "쫓기다", "화재 꿈", "물고기", "코끼리",
];

/* ─── FAQ Data ─── */
const faqData = [
  {
    q: "꿈 해몽은 과학적인가요?",
    a: "꿈 해몽은 전통 문화와 심리학적 해석을 기반으로 합니다. 과학적으로 증명된 것은 아니지만, 꿈은 잠재의식의 반영으로 자기 이해에 도움을 줄 수 있습니다. 재미로 참고하시되, 중요한 결정은 합리적 판단으로 하시길 권장합니다.",
  },
  {
    q: "같은 꿈을 반복해서 꾸면 어떤 의미인가요?",
    a: "반복되는 꿈은 해결되지 않은 감정이나 문제가 있을 때 자주 나타납니다. 꿈의 내용과 관련된 현실의 문제를 인식하고 해결하려 노력하면 반복몽이 줄어들 수 있습니다.",
  },
  {
    q: "무서운 꿈을 꾸면 나쁜 일이 생기나요?",
    a: "전통적으로 한국에서는 무서운 꿈이 오히려 길몽인 경우가 많습니다. 예를 들어 죽는 꿈은 새로운 시작을, 화재 꿈은 큰 재물을 의미합니다. 꿈은 현실과 반대로 해석되는 경우가 많으니 걱정하지 마세요.",
  },
  {
    q: "태몽은 실제로 의미가 있나요?",
    a: "태몽은 한국 문화에서 오래된 전통입니다. 과학적 근거는 없지만, 임신 중 꿈은 호르몬 변화와 기대감이 반영된 것으로 봅니다. 용, 돼지, 호랑이, 과일 등의 태몽은 건강한 자녀를 기원하는 의미로 해석됩니다.",
  },
  {
    q: "꿈에서 로또 번호가 보이면 실제로 당첨될 수 있나요?",
    a: "꿈에서 본 숫자로 로또에 당첨된 사례가 보도된 적 있지만, 이는 우연의 일치입니다. 다만, 돼지꿈이나 금꿈 등 재물과 관련된 꿈을 꾸면 행운의 기운이 있다고 전통적으로 해석하니, 재미로 참고해보세요.",
  },
  {
    q: "여러 키워드를 동시에 해석할 수 있나요?",
    a: "네! 꿈에 나온 여러 요소를 쉼표(,)나 공백으로 구분하여 입력하면, 각 키워드별 해석과 종합 해석을 모두 제공합니다. 예를 들어 '뱀, 돈, 산'처럼 입력해보세요.",
  },
];

export default function DreamInterpretationPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<DreamKeyword[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats: Record<string, DreamKeyword[]> = {};
    dreamDatabase.forEach((d) => {
      if (!cats[d.category]) cats[d.category] = [];
      cats[d.category].push(d);
    });
    return cats;
  }, []);

  const handleInterpret = () => {
    if (!input.trim()) return;

    const keywords = input
      .replace(/,/g, " ")
      .split(/\s+/)
      .filter((k) => k.length > 0);

    const matched: DreamKeyword[] = [];
    keywords.forEach((kw) => {
      const found = dreamDatabase.filter(
        (d) => d.keyword.includes(kw) || kw.includes(d.keyword)
      );
      found.forEach((f) => {
        if (!matched.find((m) => m.keyword === f.keyword)) {
          matched.push(f);
        }
      });
    });

    setResults(matched);
    setShowResult(true);
  };

  const handleKeywordClick = (keyword: string) => {
    setInput(keyword);
    setResults([dreamDatabase.find((d) => d.keyword === keyword)!]);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInterpret();
  };

  const averageLuck = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.luckScore, 0) / results.length)
    : 0;

  const allLuckyNumbers = results.map((r) => r.luckyNumber);

  const getLuckColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-500";
  };

  const getLuckBarColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getLuckLabel = (score: number) => {
    if (score >= 90) return "대길";
    if (score >= 75) return "길";
    if (score >= 55) return "보통";
    if (score >= 35) return "소흉";
    return "흉";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          꿈 키워드 풀이
        </h1>
        <p className="text-gray-500 mt-2 mb-8">
          꿈 키워드를 입력하면 도구가 꿈을 해석해드립니다
        </p>
      </div>

      {/* Input Section */}
      <div className="calc-card p-6 mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          꿈 키워드 입력
        </label>
        <p className="text-xs text-gray-400 mb-3">
          쉼표(,) 또는 공백으로 여러 키워드를 입력할 수 있습니다
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 뱀, 돈, 바다"
            className="calc-input flex-1"
          />
          <button
            onClick={handleInterpret}
            className="calc-btn-primary px-6 flex-shrink-0"
          >
            해몽하기
          </button>
        </div>

        {/* Quick keyword pills */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2">자주 찾는 꿈</p>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.slice(0, 10).map((kw) => (
              <button
                key={kw}
                onClick={() => handleKeywordClick(kw)}
                className="calc-preset"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Browse */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">카테고리별 꿈 키워드</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(categories).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {categoryEmojis[cat]} {cat} ({categories[cat].length})
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
            {categories[selectedCategory].map((d) => (
              <button
                key={d.keyword}
                onClick={() => handleKeywordClick(d.keyword)}
                className="calc-preset"
              >
                {d.keyword}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {showResult && (
        <div className="space-y-6 mb-8 animate-fade-in">
          {results.length === 0 ? (
            <div className="calc-card p-8 text-center">
              <div className="text-5xl mb-4">🔮</div>
              <p className="text-gray-500 text-lg mb-2">
                해당 키워드의 해몽 결과를 찾을 수 없습니다.
              </p>
              <p className="text-gray-400 text-sm">
                다른 키워드를 입력하거나 카테고리에서 선택해보세요.
              </p>
            </div>
          ) : (
            <>
              {/* Overall Score */}
              {results.length > 1 && (
                <div className="calc-card overflow-hidden">
                  <div className="calc-result-header">
                    <p className="text-sm text-blue-100 mb-1">종합 해몽 결과</p>
                    <p className="text-4xl font-extrabold relative z-10">
                      {getLuckLabel(averageLuck)}
                    </p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">종합 행운 점수</span>
                      <span className={`text-lg font-bold ${getLuckColor(averageLuck)}`}>
                        {averageLuck}점
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${getLuckBarColor(averageLuck)}`}
                        style={{ width: `${averageLuck}%` }}
                      />
                    </div>
                    {allLuckyNumbers.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">행운의 숫자:</span>
                        <div className="flex gap-1.5">
                          {allLuckyNumbers.map((n, i) => (
                            <span key={i} className="inline-flex items-center justify-center w-8 h-8 bg-blue-50 text-blue-700 font-bold rounded-lg text-xs">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Individual Results */}
              {results.map((r) => {
                const catColor = categoryColors[r.category] || categoryColors["상황"];
                return (
                  <div key={r.keyword} className="calc-card overflow-hidden">
                    {/* Result Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categoryEmojis[r.category] || "🔮"}</span>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              &ldquo;{r.keyword}&rdquo; 꿈 해몽
                            </h3>
                            <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${catColor.bg} ${catColor.text}`}>
                              {r.category}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-extrabold ${getLuckColor(r.luckScore)}`}>
                            {r.luckScore}
                          </div>
                          <div className="text-xs text-gray-400">행운 점수</div>
                        </div>
                      </div>

                      {/* Luck bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-700 ${getLuckBarColor(r.luckScore)}`}
                          style={{ width: `${r.luckScore}%` }}
                        />
                      </div>

                      {/* Interpretation */}
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {r.interpretation}
                      </p>
                    </div>

                    {/* Fortune Categories */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💰</span>
                          <span className="text-sm font-semibold text-gray-700">재물운</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{r.wealth}</p>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💕</span>
                          <span className="text-sm font-semibold text-gray-700">연애운</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{r.love}</p>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💪</span>
                          <span className="text-sm font-semibold text-gray-700">건강운</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{r.health}</p>
                      </div>
                    </div>

                    {/* Lucky Number */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">행운의 숫자</span>
                        <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-xl">
                          {r.luckyNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* Popular Dreams Section */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">인기 꿈 키워드 TOP 20</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {popularKeywords.map((kw, i) => {
            const entry = dreamDatabase.find((d) => d.keyword === kw);
            return (
              <button
                key={kw}
                onClick={() => handleKeywordClick(kw)}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
              >
                <span className="text-xs font-bold text-gray-400 w-5">
                  {i + 1}
                </span>
                <span className="truncate">{kw}</span>
                {entry && (
                  <span className={`ml-auto text-xs font-medium ${getLuckColor(entry.luckScore)}`}>
                    {entry.luckScore}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="calc-seo-card mb-6">
        <h2 className="calc-seo-title">꿈 키워드 풀이이란?</h2>
        <div className="text-sm text-gray-600 leading-relaxed space-y-3">
          <p>
            꿈 키워드 풀이은 한국 전통 해몽학과 현대 심리학적 해석을 결합하여 꿈의 의미를
            분석해드리는 서비스입니다. 80가지 이상의 꿈 키워드 데이터베이스를 기반으로
            동물, 자연, 행동, 사물, 사람, 상황 등 다양한 카테고리의 꿈을 해석합니다.
          </p>
          <p>
            꿈 해몽은 오래전부터 동서양을 막론하고 이어져 온 전통입니다. 한국에서는
            특히 태몽, 재물몽, 길몽 등의 개념이 문화적으로 깊이 자리잡고 있으며,
            꿈을 통해 미래의 길흉을 점치는 전통이 있습니다. 본 서비스는 이러한
            전통적 해석과 함께 현대 심리학적 관점을 더해 종합적인 꿈 풀이를 제공합니다.
          </p>
          <p>
            각 꿈 키워드에 대해 상세한 해석, 행운 점수(1~100), 행운의 숫자, 그리고
            재물운/연애운/건강운 등 카테고리별 운세를 확인할 수 있습니다. 여러 키워드를
            한 번에 입력하여 종합적인 해몽 결과를 받아보세요.
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">자주 묻는 질문</h2>
        <div className="calc-faq">
          {faqData.map((item, i) => (
            <div key={i} className="calc-faq-item">
              <button
                className="calc-faq-q"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                    openFaq === i ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === i && (
                <div className="calc-faq-a">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools current="dream-interpretation" />
    </div>
  );
}
