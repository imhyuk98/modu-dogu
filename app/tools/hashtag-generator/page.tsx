"use client";

import { useState, useCallback, useMemo } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ═══ Types ═══ */
type Category =
  | "food"
  | "cafe"
  | "travel"
  | "daily"
  | "fashion"
  | "beauty"
  | "fitness"
  | "pet"
  | "landscape"
  | "selfie"
  | "couple"
  | "parenting";

type Mood = "emotional" | "bright" | "humor" | "luxury" | "nature" | "vintage";
type TagCount = 10 | 20 | 30;
type Language = "kr" | "mixed";
type Popularity = "high" | "medium" | "niche";

interface Hashtag {
  text: string;
  category: Category;
  popularity: Popularity;
  language: "kr" | "en";
}

/* ═══ Config ═══ */
const categoryConfig: Record<
  Category,
  { label: string; emoji: string }
> = {
  food: { label: "음식", emoji: "🍔" },
  cafe: { label: "카페", emoji: "☕" },
  travel: { label: "여행", emoji: "✈️" },
  daily: { label: "일상", emoji: "📸" },
  fashion: { label: "패션", emoji: "👗" },
  beauty: { label: "뷰티", emoji: "💄" },
  fitness: { label: "운동", emoji: "💪" },
  pet: { label: "반려동물", emoji: "🐶" },
  landscape: { label: "풍경", emoji: "🌄" },
  selfie: { label: "셀카", emoji: "🤳" },
  couple: { label: "커플", emoji: "💑" },
  parenting: { label: "육아", emoji: "👶" },
};

const moodConfig: Record<Mood, { label: string; emoji: string }> = {
  emotional: { label: "감성", emoji: "🌙" },
  bright: { label: "밝은", emoji: "☀️" },
  humor: { label: "유머", emoji: "😂" },
  luxury: { label: "고급", emoji: "✨" },
  nature: { label: "자연", emoji: "🌿" },
  vintage: { label: "빈티지", emoji: "📷" },
};

const popularityLabels: Record<Popularity, { label: string; color: string; desc: string }> = {
  high: { label: "인기", color: "bg-red-100 text-red-700 border-red-200", desc: "높은 노출, 경쟁이 치열합니다" },
  medium: { label: "중간", color: "bg-amber-100 text-amber-700 border-amber-200", desc: "적절한 노출과 도달률의 균형" },
  niche: { label: "니치", color: "bg-emerald-100 text-emerald-700 border-emerald-200", desc: "세부 주제와 관련된 태그" },
};

/* ═══ Hashtag Database (500+) ═══ */
const hashtagDB: Hashtag[] = [
  // ── 음식 (food) ──
  { text: "#먹스타그램", category: "food", popularity: "high", language: "kr" },
  { text: "#맛집", category: "food", popularity: "high", language: "kr" },
  { text: "#맛집추천", category: "food", popularity: "high", language: "kr" },
  { text: "#오늘뭐먹지", category: "food", popularity: "high", language: "kr" },
  { text: "#푸드스타그램", category: "food", popularity: "high", language: "kr" },
  { text: "#먹방", category: "food", popularity: "high", language: "kr" },
  { text: "#디저트", category: "food", popularity: "medium", language: "kr" },
  { text: "#홈쿡", category: "food", popularity: "medium", language: "kr" },
  { text: "#요리스타그램", category: "food", popularity: "medium", language: "kr" },
  { text: "#맛있다", category: "food", popularity: "medium", language: "kr" },
  { text: "#집밥", category: "food", popularity: "medium", language: "kr" },
  { text: "#야식", category: "food", popularity: "medium", language: "kr" },
  { text: "#점심", category: "food", popularity: "medium", language: "kr" },
  { text: "#저녁메뉴", category: "food", popularity: "medium", language: "kr" },
  { text: "#브런치", category: "food", popularity: "medium", language: "kr" },
  { text: "#맛집탐방", category: "food", popularity: "medium", language: "kr" },
  { text: "#혼밥", category: "food", popularity: "niche", language: "kr" },
  { text: "#자취요리", category: "food", popularity: "niche", language: "kr" },
  { text: "#오늘의메뉴", category: "food", popularity: "niche", language: "kr" },
  { text: "#레시피공유", category: "food", popularity: "niche", language: "kr" },
  { text: "#맛집지도", category: "food", popularity: "niche", language: "kr" },
  { text: "#간식스타그램", category: "food", popularity: "niche", language: "kr" },
  { text: "#배달음식", category: "food", popularity: "niche", language: "kr" },
  { text: "#제철음식", category: "food", popularity: "niche", language: "kr" },
  { text: "#foodie", category: "food", popularity: "high", language: "en" },
  { text: "#foodstagram", category: "food", popularity: "high", language: "en" },
  { text: "#yummy", category: "food", popularity: "high", language: "en" },
  { text: "#delicious", category: "food", popularity: "high", language: "en" },
  { text: "#instafood", category: "food", popularity: "high", language: "en" },
  { text: "#foodporn", category: "food", popularity: "high", language: "en" },
  { text: "#homecooking", category: "food", popularity: "medium", language: "en" },
  { text: "#foodphotography", category: "food", popularity: "medium", language: "en" },
  { text: "#eeeeeats", category: "food", popularity: "medium", language: "en" },
  { text: "#foodlover", category: "food", popularity: "medium", language: "en" },
  { text: "#koreanfood", category: "food", popularity: "niche", language: "en" },
  { text: "#mukbang", category: "food", popularity: "niche", language: "en" },
  { text: "#homemade", category: "food", popularity: "medium", language: "en" },
  { text: "#cooking", category: "food", popularity: "medium", language: "en" },
  { text: "#recipe", category: "food", popularity: "medium", language: "en" },
  { text: "#dessert", category: "food", popularity: "medium", language: "en" },

  // ── 카페 (cafe) ──
  { text: "#카페스타그램", category: "cafe", popularity: "high", language: "kr" },
  { text: "#카페추천", category: "cafe", popularity: "high", language: "kr" },
  { text: "#카페투어", category: "cafe", popularity: "high", language: "kr" },
  { text: "#커피스타그램", category: "cafe", popularity: "high", language: "kr" },
  { text: "#커피", category: "cafe", popularity: "high", language: "kr" },
  { text: "#디저트카페", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#감성카페", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#핫플", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#브런치카페", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#카페일상", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#라떼", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#아메리카노", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#카페맛집", category: "cafe", popularity: "medium", language: "kr" },
  { text: "#분위기좋은카페", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#동네카페", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#카페인테리어", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#로스터리카페", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#수제디저트", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#카페탐방", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#핸드드립", category: "cafe", popularity: "niche", language: "kr" },
  { text: "#cafestagram", category: "cafe", popularity: "high", language: "en" },
  { text: "#coffeetime", category: "cafe", popularity: "high", language: "en" },
  { text: "#coffeelover", category: "cafe", popularity: "high", language: "en" },
  { text: "#coffee", category: "cafe", popularity: "high", language: "en" },
  { text: "#cafe", category: "cafe", popularity: "high", language: "en" },
  { text: "#latte", category: "cafe", popularity: "medium", language: "en" },
  { text: "#latteart", category: "cafe", popularity: "medium", language: "en" },
  { text: "#coffeeshop", category: "cafe", popularity: "medium", language: "en" },
  { text: "#barista", category: "cafe", popularity: "medium", language: "en" },
  { text: "#cafehopping", category: "cafe", popularity: "niche", language: "en" },
  { text: "#specialtycoffee", category: "cafe", popularity: "niche", language: "en" },
  { text: "#pourover", category: "cafe", popularity: "niche", language: "en" },

  // ── 여행 (travel) ──
  { text: "#여행스타그램", category: "travel", popularity: "high", language: "kr" },
  { text: "#여행", category: "travel", popularity: "high", language: "kr" },
  { text: "#국내여행", category: "travel", popularity: "high", language: "kr" },
  { text: "#해외여행", category: "travel", popularity: "high", language: "kr" },
  { text: "#여행기록", category: "travel", popularity: "high", language: "kr" },
  { text: "#트립스타그램", category: "travel", popularity: "medium", language: "kr" },
  { text: "#여행사진", category: "travel", popularity: "medium", language: "kr" },
  { text: "#여행에미치다", category: "travel", popularity: "medium", language: "kr" },
  { text: "#힐링여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#제주여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#부산여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#강릉여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#서울여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#가족여행", category: "travel", popularity: "medium", language: "kr" },
  { text: "#혼행", category: "travel", popularity: "niche", language: "kr" },
  { text: "#배낭여행", category: "travel", popularity: "niche", language: "kr" },
  { text: "#캠핑", category: "travel", popularity: "niche", language: "kr" },
  { text: "#숙소추천", category: "travel", popularity: "niche", language: "kr" },
  { text: "#여행꿀팁", category: "travel", popularity: "niche", language: "kr" },
  { text: "#여행코스", category: "travel", popularity: "niche", language: "kr" },
  { text: "#드라이브코스", category: "travel", popularity: "niche", language: "kr" },
  { text: "#travel", category: "travel", popularity: "high", language: "en" },
  { text: "#travelgram", category: "travel", popularity: "high", language: "en" },
  { text: "#wanderlust", category: "travel", popularity: "high", language: "en" },
  { text: "#vacation", category: "travel", popularity: "high", language: "en" },
  { text: "#instatravel", category: "travel", popularity: "high", language: "en" },
  { text: "#travelphotography", category: "travel", popularity: "medium", language: "en" },
  { text: "#travelkorea", category: "travel", popularity: "medium", language: "en" },
  { text: "#explore", category: "travel", popularity: "medium", language: "en" },
  { text: "#adventure", category: "travel", popularity: "medium", language: "en" },
  { text: "#traveldiaries", category: "travel", popularity: "niche", language: "en" },
  { text: "#backpacking", category: "travel", popularity: "niche", language: "en" },
  { text: "#solotravel", category: "travel", popularity: "niche", language: "en" },

  // ── 일상 (daily) ──
  { text: "#일상", category: "daily", popularity: "high", language: "kr" },
  { text: "#데일리", category: "daily", popularity: "high", language: "kr" },
  { text: "#소통", category: "daily", popularity: "high", language: "kr" },
  { text: "#좋아요", category: "daily", popularity: "high", language: "kr" },
  { text: "#팔로우", category: "daily", popularity: "high", language: "kr" },
  { text: "#인스타", category: "daily", popularity: "high", language: "kr" },
  { text: "#좋반", category: "daily", popularity: "medium", language: "kr" },
  { text: "#선팔", category: "daily", popularity: "medium", language: "kr" },
  { text: "#맞팔", category: "daily", popularity: "medium", language: "kr" },
  { text: "#일상스타그램", category: "daily", popularity: "medium", language: "kr" },
  { text: "#오늘의기록", category: "daily", popularity: "medium", language: "kr" },
  { text: "#하루기록", category: "daily", popularity: "medium", language: "kr" },
  { text: "#소확행", category: "daily", popularity: "medium", language: "kr" },
  { text: "#주말", category: "daily", popularity: "medium", language: "kr" },
  { text: "#힐링", category: "daily", popularity: "medium", language: "kr" },
  { text: "#오늘하루", category: "daily", popularity: "niche", language: "kr" },
  { text: "#나만의시간", category: "daily", popularity: "niche", language: "kr" },
  { text: "#취미생활", category: "daily", popularity: "niche", language: "kr" },
  { text: "#감사일기", category: "daily", popularity: "niche", language: "kr" },
  { text: "#일상공유", category: "daily", popularity: "niche", language: "kr" },
  { text: "#daily", category: "daily", popularity: "high", language: "en" },
  { text: "#instadaily", category: "daily", popularity: "high", language: "en" },
  { text: "#instagood", category: "daily", popularity: "high", language: "en" },
  { text: "#photooftheday", category: "daily", popularity: "high", language: "en" },
  { text: "#like4like", category: "daily", popularity: "high", language: "en" },
  { text: "#follow", category: "daily", popularity: "high", language: "en" },
  { text: "#likeforlikes", category: "daily", popularity: "medium", language: "en" },
  { text: "#followme", category: "daily", popularity: "medium", language: "en" },
  { text: "#lifestyle", category: "daily", popularity: "medium", language: "en" },
  { text: "#weekendvibes", category: "daily", popularity: "niche", language: "en" },
  { text: "#happydays", category: "daily", popularity: "niche", language: "en" },

  // ── 패션 (fashion) ──
  { text: "#패션스타그램", category: "fashion", popularity: "high", language: "kr" },
  { text: "#오오티디", category: "fashion", popularity: "high", language: "kr" },
  { text: "#데일리룩", category: "fashion", popularity: "high", language: "kr" },
  { text: "#코디", category: "fashion", popularity: "high", language: "kr" },
  { text: "#패션", category: "fashion", popularity: "high", language: "kr" },
  { text: "#스타일", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#오늘의코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#쇼핑", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#데일리코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#봄코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#여름코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#가을코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#겨울코디", category: "fashion", popularity: "medium", language: "kr" },
  { text: "#출근룩", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#캐주얼룩", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#미니멀룩", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#스트릿패션", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#신상", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#하울", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#빈티지패션", category: "fashion", popularity: "niche", language: "kr" },
  { text: "#ootd", category: "fashion", popularity: "high", language: "en" },
  { text: "#fashion", category: "fashion", popularity: "high", language: "en" },
  { text: "#style", category: "fashion", popularity: "high", language: "en" },
  { text: "#outfit", category: "fashion", popularity: "high", language: "en" },
  { text: "#outfitoftheday", category: "fashion", popularity: "medium", language: "en" },
  { text: "#streetstyle", category: "fashion", popularity: "medium", language: "en" },
  { text: "#fashionista", category: "fashion", popularity: "medium", language: "en" },
  { text: "#lookbook", category: "fashion", popularity: "medium", language: "en" },
  { text: "#casualstyle", category: "fashion", popularity: "niche", language: "en" },
  { text: "#minimalfashion", category: "fashion", popularity: "niche", language: "en" },
  { text: "#kfashion", category: "fashion", popularity: "niche", language: "en" },

  // ── 뷰티 (beauty) ──
  { text: "#뷰티스타그램", category: "beauty", popularity: "high", language: "kr" },
  { text: "#메이크업", category: "beauty", popularity: "high", language: "kr" },
  { text: "#화장품", category: "beauty", popularity: "high", language: "kr" },
  { text: "#뷰티", category: "beauty", popularity: "high", language: "kr" },
  { text: "#스킨케어", category: "beauty", popularity: "high", language: "kr" },
  { text: "#립스틱", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#데일리메이크업", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#화장품추천", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#파운데이션", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#기초화장품", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#피부관리", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#네일아트", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#헤어스타일", category: "beauty", popularity: "medium", language: "kr" },
  { text: "#글로우메이크업", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#쿠션팩트", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#아이메이크업", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#클렌징", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#홈케어", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#뷰티리뷰", category: "beauty", popularity: "niche", language: "kr" },
  { text: "#beauty", category: "beauty", popularity: "high", language: "en" },
  { text: "#makeup", category: "beauty", popularity: "high", language: "en" },
  { text: "#skincare", category: "beauty", popularity: "high", language: "en" },
  { text: "#cosmetics", category: "beauty", popularity: "medium", language: "en" },
  { text: "#makeuptutorial", category: "beauty", popularity: "medium", language: "en" },
  { text: "#kbeauty", category: "beauty", popularity: "medium", language: "en" },
  { text: "#glowingskin", category: "beauty", popularity: "medium", language: "en" },
  { text: "#lipstick", category: "beauty", popularity: "medium", language: "en" },
  { text: "#nailart", category: "beauty", popularity: "niche", language: "en" },
  { text: "#skincareroutine", category: "beauty", popularity: "niche", language: "en" },
  { text: "#beautyblogger", category: "beauty", popularity: "niche", language: "en" },

  // ── 운동 (fitness) ──
  { text: "#운동스타그램", category: "fitness", popularity: "high", language: "kr" },
  { text: "#헬스타그램", category: "fitness", popularity: "high", language: "kr" },
  { text: "#오운완", category: "fitness", popularity: "high", language: "kr" },
  { text: "#헬스", category: "fitness", popularity: "high", language: "kr" },
  { text: "#다이어트", category: "fitness", popularity: "high", language: "kr" },
  { text: "#운동", category: "fitness", popularity: "high", language: "kr" },
  { text: "#홈트", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#필라테스", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#요가", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#러닝", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#크로스핏", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#바디프로필", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#체중관리", category: "fitness", popularity: "medium", language: "kr" },
  { text: "#등운동", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#하체운동", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#가슴운동", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#유산소", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#스트레칭", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#운동루틴", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#식단관리", category: "fitness", popularity: "niche", language: "kr" },
  { text: "#fitness", category: "fitness", popularity: "high", language: "en" },
  { text: "#gym", category: "fitness", popularity: "high", language: "en" },
  { text: "#workout", category: "fitness", popularity: "high", language: "en" },
  { text: "#fitnessmotivation", category: "fitness", popularity: "medium", language: "en" },
  { text: "#healthylifestyle", category: "fitness", popularity: "medium", language: "en" },
  { text: "#bodybuilding", category: "fitness", popularity: "medium", language: "en" },
  { text: "#pilates", category: "fitness", popularity: "medium", language: "en" },
  { text: "#yoga", category: "fitness", popularity: "medium", language: "en" },
  { text: "#running", category: "fitness", popularity: "medium", language: "en" },
  { text: "#homeworkout", category: "fitness", popularity: "niche", language: "en" },
  { text: "#legday", category: "fitness", popularity: "niche", language: "en" },
  { text: "#fitlife", category: "fitness", popularity: "niche", language: "en" },

  // ── 반려동물 (pet) ──
  { text: "#멍스타그램", category: "pet", popularity: "high", language: "kr" },
  { text: "#냥스타그램", category: "pet", popularity: "high", language: "kr" },
  { text: "#반려견", category: "pet", popularity: "high", language: "kr" },
  { text: "#반려묘", category: "pet", popularity: "high", language: "kr" },
  { text: "#펫스타그램", category: "pet", popularity: "high", language: "kr" },
  { text: "#강아지", category: "pet", popularity: "high", language: "kr" },
  { text: "#고양이", category: "pet", popularity: "high", language: "kr" },
  { text: "#댕댕이", category: "pet", popularity: "medium", language: "kr" },
  { text: "#냥이", category: "pet", popularity: "medium", language: "kr" },
  { text: "#강아지스타그램", category: "pet", popularity: "medium", language: "kr" },
  { text: "#고양이스타그램", category: "pet", popularity: "medium", language: "kr" },
  { text: "#반려동물", category: "pet", popularity: "medium", language: "kr" },
  { text: "#산책", category: "pet", popularity: "medium", language: "kr" },
  { text: "#애견카페", category: "pet", popularity: "niche", language: "kr" },
  { text: "#강아지간식", category: "pet", popularity: "niche", language: "kr" },
  { text: "#반려견산책", category: "pet", popularity: "niche", language: "kr" },
  { text: "#고양이장난감", category: "pet", popularity: "niche", language: "kr" },
  { text: "#펫용품", category: "pet", popularity: "niche", language: "kr" },
  { text: "#유기견입양", category: "pet", popularity: "niche", language: "kr" },
  { text: "#dog", category: "pet", popularity: "high", language: "en" },
  { text: "#cat", category: "pet", popularity: "high", language: "en" },
  { text: "#pet", category: "pet", popularity: "high", language: "en" },
  { text: "#dogsofinstagram", category: "pet", popularity: "high", language: "en" },
  { text: "#catsofinstagram", category: "pet", popularity: "high", language: "en" },
  { text: "#puppy", category: "pet", popularity: "medium", language: "en" },
  { text: "#kitten", category: "pet", popularity: "medium", language: "en" },
  { text: "#petlover", category: "pet", popularity: "medium", language: "en" },
  { text: "#petsofinstagram", category: "pet", popularity: "medium", language: "en" },
  { text: "#doglover", category: "pet", popularity: "niche", language: "en" },
  { text: "#catlover", category: "pet", popularity: "niche", language: "en" },
  { text: "#adoptdontshop", category: "pet", popularity: "niche", language: "en" },

  // ── 풍경 (landscape) ──
  { text: "#풍경스타그램", category: "landscape", popularity: "high", language: "kr" },
  { text: "#하늘", category: "landscape", popularity: "high", language: "kr" },
  { text: "#감성사진", category: "landscape", popularity: "high", language: "kr" },
  { text: "#일몰", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#노을", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#바다", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#산", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#자연", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#풍경", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#꽃", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#벚꽃", category: "landscape", popularity: "medium", language: "kr" },
  { text: "#단풍", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#구름", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#별", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#야경", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#일출", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#사진스타그램", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#필름사진", category: "landscape", popularity: "niche", language: "kr" },
  { text: "#nature", category: "landscape", popularity: "high", language: "en" },
  { text: "#sky", category: "landscape", popularity: "high", language: "en" },
  { text: "#sunset", category: "landscape", popularity: "high", language: "en" },
  { text: "#landscape", category: "landscape", popularity: "high", language: "en" },
  { text: "#naturephotography", category: "landscape", popularity: "medium", language: "en" },
  { text: "#ocean", category: "landscape", popularity: "medium", language: "en" },
  { text: "#mountains", category: "landscape", popularity: "medium", language: "en" },
  { text: "#sunrise", category: "landscape", popularity: "medium", language: "en" },
  { text: "#flowers", category: "landscape", popularity: "medium", language: "en" },
  { text: "#nightview", category: "landscape", popularity: "niche", language: "en" },
  { text: "#landscapephotography", category: "landscape", popularity: "niche", language: "en" },
  { text: "#goldenhour", category: "landscape", popularity: "niche", language: "en" },

  // ── 셀카 (selfie) ──
  { text: "#셀카", category: "selfie", popularity: "high", language: "kr" },
  { text: "#셀피", category: "selfie", popularity: "high", language: "kr" },
  { text: "#거울샷", category: "selfie", popularity: "high", language: "kr" },
  { text: "#데일리셀카", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#얼스타그램", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#셀카스타그램", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#오늘의셀카", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#인스타셀카", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#셀카놀이", category: "selfie", popularity: "niche", language: "kr" },
  { text: "#폰카", category: "selfie", popularity: "niche", language: "kr" },
  { text: "#셀스타그램", category: "selfie", popularity: "niche", language: "kr" },
  { text: "#프로필사진", category: "selfie", popularity: "niche", language: "kr" },
  { text: "#인생샷", category: "selfie", popularity: "medium", language: "kr" },
  { text: "#포토부스", category: "selfie", popularity: "niche", language: "kr" },
  { text: "#selfie", category: "selfie", popularity: "high", language: "en" },
  { text: "#selca", category: "selfie", popularity: "high", language: "en" },
  { text: "#mirrorselfie", category: "selfie", popularity: "medium", language: "en" },
  { text: "#me", category: "selfie", popularity: "medium", language: "en" },
  { text: "#selfietime", category: "selfie", popularity: "medium", language: "en" },
  { text: "#instaselfie", category: "selfie", popularity: "niche", language: "en" },
  { text: "#selfieoftheday", category: "selfie", popularity: "niche", language: "en" },

  // ── 커플 (couple) ──
  { text: "#커플스타그램", category: "couple", popularity: "high", language: "kr" },
  { text: "#럽스타그램", category: "couple", popularity: "high", language: "kr" },
  { text: "#데이트", category: "couple", popularity: "high", language: "kr" },
  { text: "#커플", category: "couple", popularity: "high", language: "kr" },
  { text: "#커플룩", category: "couple", popularity: "medium", language: "kr" },
  { text: "#데이트코스", category: "couple", popularity: "medium", language: "kr" },
  { text: "#커플사진", category: "couple", popularity: "medium", language: "kr" },
  { text: "#연애", category: "couple", popularity: "medium", language: "kr" },
  { text: "#남자친구", category: "couple", popularity: "medium", language: "kr" },
  { text: "#여자친구", category: "couple", popularity: "medium", language: "kr" },
  { text: "#기념일", category: "couple", popularity: "medium", language: "kr" },
  { text: "#데이트장소", category: "couple", popularity: "niche", language: "kr" },
  { text: "#커플여행", category: "couple", popularity: "niche", language: "kr" },
  { text: "#커플일상", category: "couple", popularity: "niche", language: "kr" },
  { text: "#연애스타그램", category: "couple", popularity: "niche", language: "kr" },
  { text: "#프로포즈", category: "couple", popularity: "niche", language: "kr" },
  { text: "#couple", category: "couple", popularity: "high", language: "en" },
  { text: "#couplegoals", category: "couple", popularity: "high", language: "en" },
  { text: "#love", category: "couple", popularity: "high", language: "en" },
  { text: "#relationship", category: "couple", popularity: "medium", language: "en" },
  { text: "#datenight", category: "couple", popularity: "medium", language: "en" },
  { text: "#lovebirds", category: "couple", popularity: "medium", language: "en" },
  { text: "#coupletravel", category: "couple", popularity: "niche", language: "en" },
  { text: "#couplephotography", category: "couple", popularity: "niche", language: "en" },

  // ── 육아 (parenting) ──
  { text: "#육아스타그램", category: "parenting", popularity: "high", language: "kr" },
  { text: "#아기", category: "parenting", popularity: "high", language: "kr" },
  { text: "#맘스타그램", category: "parenting", popularity: "high", language: "kr" },
  { text: "#육아일기", category: "parenting", popularity: "high", language: "kr" },
  { text: "#아들스타그램", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#딸스타그램", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#육아", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#아기옷", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#아이와함께", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#육아맘", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#신생아", category: "parenting", popularity: "medium", language: "kr" },
  { text: "#돌잔치", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#아기이유식", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#어린이집", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#아기장난감", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#육아팁", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#워킹맘", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#출산준비", category: "parenting", popularity: "niche", language: "kr" },
  { text: "#baby", category: "parenting", popularity: "high", language: "en" },
  { text: "#momlife", category: "parenting", popularity: "high", language: "en" },
  { text: "#babygirl", category: "parenting", popularity: "medium", language: "en" },
  { text: "#babyboy", category: "parenting", popularity: "medium", language: "en" },
  { text: "#parenting", category: "parenting", popularity: "medium", language: "en" },
  { text: "#newborn", category: "parenting", popularity: "medium", language: "en" },
  { text: "#toddler", category: "parenting", popularity: "niche", language: "en" },
  { text: "#motherhood", category: "parenting", popularity: "niche", language: "en" },
  { text: "#familytime", category: "parenting", popularity: "niche", language: "en" },

  // ── 분위기별 공통 태그 (mood-based, category: daily used as general) ──
  // 감성
  { text: "#감성", category: "daily", popularity: "medium", language: "kr" },
  { text: "#감성스타그램", category: "daily", popularity: "medium", language: "kr" },
  { text: "#분위기", category: "daily", popularity: "niche", language: "kr" },
  { text: "#무드", category: "daily", popularity: "niche", language: "kr" },
  { text: "#감성글", category: "daily", popularity: "niche", language: "kr" },
  { text: "#aesthetic", category: "daily", popularity: "medium", language: "en" },
  { text: "#mood", category: "daily", popularity: "medium", language: "en" },
  { text: "#vibes", category: "daily", popularity: "medium", language: "en" },

  // 밝은
  { text: "#행복", category: "daily", popularity: "medium", language: "kr" },
  { text: "#좋은하루", category: "daily", popularity: "niche", language: "kr" },
  { text: "#기분좋은", category: "daily", popularity: "niche", language: "kr" },
  { text: "#에너지", category: "daily", popularity: "niche", language: "kr" },
  { text: "#happy", category: "daily", popularity: "medium", language: "en" },
  { text: "#positivevibes", category: "daily", popularity: "niche", language: "en" },
  { text: "#goodvibes", category: "daily", popularity: "medium", language: "en" },
  { text: "#smile", category: "daily", popularity: "medium", language: "en" },

  // 유머
  { text: "#웃김", category: "daily", popularity: "niche", language: "kr" },
  { text: "#유머", category: "daily", popularity: "niche", language: "kr" },
  { text: "#재밌다", category: "daily", popularity: "niche", language: "kr" },
  { text: "#funny", category: "daily", popularity: "medium", language: "en" },
  { text: "#lol", category: "daily", popularity: "medium", language: "en" },
  { text: "#meme", category: "daily", popularity: "medium", language: "en" },

  // 고급
  { text: "#럭셔리", category: "daily", popularity: "niche", language: "kr" },
  { text: "#프리미엄", category: "daily", popularity: "niche", language: "kr" },
  { text: "#luxury", category: "daily", popularity: "medium", language: "en" },
  { text: "#premium", category: "daily", popularity: "niche", language: "en" },
  { text: "#elegant", category: "daily", popularity: "niche", language: "en" },

  // 자연
  { text: "#자연스러운", category: "daily", popularity: "niche", language: "kr" },
  { text: "#초록초록", category: "daily", popularity: "niche", language: "kr" },
  { text: "#greenlife", category: "daily", popularity: "niche", language: "en" },
  { text: "#naturelover", category: "daily", popularity: "niche", language: "en" },

  // 빈티지
  { text: "#빈티지", category: "daily", popularity: "niche", language: "kr" },
  { text: "#레트로", category: "daily", popularity: "niche", language: "kr" },
  { text: "#필름카메라", category: "daily", popularity: "niche", language: "kr" },
  { text: "#vintage", category: "daily", popularity: "medium", language: "en" },
  { text: "#retro", category: "daily", popularity: "medium", language: "en" },
  { text: "#filmphotography", category: "daily", popularity: "niche", language: "en" },
  { text: "#analog", category: "daily", popularity: "niche", language: "en" },
];

/* ═══ Mood-based tag mapping ═══ */
const moodTags: Record<Mood, string[]> = {
  emotional: ["#감성", "#감성스타그램", "#분위기", "#무드", "#감성글", "#aesthetic", "#mood", "#vibes"],
  bright: ["#행복", "#좋은하루", "#기분좋은", "#에너지", "#happy", "#positivevibes", "#goodvibes", "#smile"],
  humor: ["#웃김", "#유머", "#재밌다", "#funny", "#lol", "#meme"],
  luxury: ["#럭셔리", "#프리미엄", "#luxury", "#premium", "#elegant"],
  nature: ["#자연스러운", "#초록초록", "#greenlife", "#naturelover"],
  vintage: ["#빈티지", "#레트로", "#필름카메라", "#vintage", "#retro", "#filmphotography", "#analog"],
};

/* ═══ Shuffle helper ═══ */
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ═══ Main Component ═══ */
export default function HashtagGenerator() {
  const [category, setCategory] = useState<Category>("food");
  const [keyword, setKeyword] = useState("");
  const [mood, setMood] = useState<Mood>("emotional");
  const [tagCount, setTagCount] = useState<TagCount>(20);
  const [language, setLanguage] = useState<Language>("mixed");
  const [generated, setGenerated] = useState<Hashtag[]>([]);
  const [removed, setRemoved] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    // Filter tags by category
    let pool = hashtagDB.filter((h) => h.category === category);

    // Filter by language
    if (language === "kr") {
      pool = pool.filter((h) => h.language === "kr");
    }
    // "mixed" keeps both kr and en

    // Balance popularity tiers: ~30% high, ~40% medium, ~30% niche
    const highTags = shuffleArray(pool.filter((h) => h.popularity === "high"));
    const medTags = shuffleArray(pool.filter((h) => h.popularity === "medium"));
    const nicheTags = shuffleArray(pool.filter((h) => h.popularity === "niche"));

    const highCount = Math.round(tagCount * 0.3);
    const medCount = Math.round(tagCount * 0.4);
    const nicheCount = tagCount - highCount - medCount;

    let result: Hashtag[] = [
      ...highTags.slice(0, highCount),
      ...medTags.slice(0, medCount),
      ...nicheTags.slice(0, nicheCount),
    ];

    // Add mood tags
    const moodTagTexts = moodTags[mood] || [];
    const moodFiltered = language === "kr"
      ? moodTagTexts.filter((t) => !t.match(/^#[a-zA-Z]/))
      : moodTagTexts;

    const moodHashtags: Hashtag[] = shuffleArray(moodFiltered).slice(0, Math.min(3, moodFiltered.length)).map((text) => {
      const found = hashtagDB.find((h) => h.text === text);
      return found || { text, category: "daily" as Category, popularity: "niche" as Popularity, language: text.match(/^#[a-zA-Z]/) ? "en" as const : "kr" as const };
    });

    result = [...result, ...moodHashtags];

    // Add keyword-based tags
    if (keyword.trim()) {
      const keywords = keyword.split(/[,\s]+/).filter(Boolean);
      keywords.forEach((kw) => {
        const clean = kw.replace(/^#/, "");
        if (clean) {
          result.push({
            text: `#${clean}`,
            category,
            popularity: "niche",
            language: /^[a-zA-Z]/.test(clean) ? "en" : "kr",
          });
        }
      });
    }

    // Deduplicate
    const seen = new Set<string>();
    result = result.filter((h) => {
      if (seen.has(h.text)) return false;
      seen.add(h.text);
      return true;
    });

    // Trim to desired count
    result = result.slice(0, tagCount);

    setGenerated(result);
    setRemoved(new Set());
    setCopied(false);
  }, [category, keyword, mood, tagCount, language]);

  const activeTags = useMemo(
    () => generated.filter((h) => !removed.has(h.text)),
    [generated, removed]
  );

  const groupedTags = useMemo(() => {
    const groups: Record<Popularity, Hashtag[]> = { high: [], medium: [], niche: [] };
    activeTags.forEach((h) => {
      groups[h.popularity].push(h);
    });
    return groups;
  }, [activeTags]);

  const allText = useMemo(
    () => activeTags.map((h) => h.text).join(" "),
    [activeTags]
  );

  const charCount = allText.length;

  const toggleTag = (text: string) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(text)) {
        next.delete(text);
      } else {
        next.add(text);
      }
      return next;
    });
    setCopied(false);
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(allText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = allText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        인스타 해시태그 추천
      </h1>
      <p className="text-gray-500 mb-8">
        카테고리와 분위기를 선택하면 인스타그램에 최적화된 해시태그를 자동으로 추천합니다.
      </p>

      {/* ── Input Form ── */}
      <div className="calc-card p-6 mb-6 space-y-6">
        {/* 카테고리 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">카테고리</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {(Object.keys(categoryConfig) as Category[]).map((c) => {
              const cfg = categoryConfig[c];
              const isActive = category === c;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`p-2.5 rounded-xl border-2 transition-all text-center text-sm ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500 shadow-md scale-105"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="text-lg mb-0.5">{cfg.emoji}</div>
                  <div className="font-medium text-xs">{cfg.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 키워드 입력 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            키워드 입력 <span className="text-gray-400 font-normal">(선택사항)</span>
          </label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="예: 홍대, 브런치, 주말나들이 (쉼표 또는 공백으로 구분)"
            className="calc-input"
          />
        </div>

        {/* 분위기 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">분위기</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {(Object.keys(moodConfig) as Mood[]).map((m) => {
              const cfg = moodConfig[m];
              const isActive = mood === m;
              return (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`p-2.5 rounded-xl border-2 transition-all text-center text-sm ${
                    isActive
                      ? "bg-purple-500 text-white border-purple-500 shadow-md scale-105"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                  }`}
                >
                  <div className="text-lg mb-0.5">{cfg.emoji}</div>
                  <div className="font-medium text-xs">{cfg.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 해시태그 수 & 언어 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">해시태그 수</label>
            <div className="flex gap-2">
              {([10, 20, 30] as TagCount[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setTagCount(n)}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all text-sm ${
                    tagCount === n
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {n}개
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">언어</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage("kr")}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all text-sm ${
                  language === "kr"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                한국어만
              </button>
              <button
                onClick={() => setLanguage("mixed")}
                className={`flex-1 py-2.5 rounded-lg font-medium transition-all text-sm ${
                  language === "mixed"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                한국어+영어
              </button>
            </div>
          </div>
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          className="w-full calc-btn-primary py-3.5 text-base"
        >
          해시태그 생성하기
        </button>
      </div>

      {/* ── Output ── */}
      {generated.length > 0 && (
        <div className="calc-card overflow-hidden mb-6">
          {/* Header */}
          <div className="calc-result-header">
            <p className="text-sm opacity-80 relative z-10">{categoryConfig[category].emoji} {categoryConfig[category].label} 해시태그</p>
            <p className="text-2xl font-bold mt-1 relative z-10">{activeTags.length}개 생성 완료</p>
            <p className="text-xs opacity-60 mt-1 relative z-10">태그를 클릭하면 제거/추가할 수 있습니다</p>
          </div>

          <div className="p-5 space-y-6">
            {/* Copy All + Stats */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>
                  글자 수: <strong className={charCount > 2200 ? "text-red-600" : "text-gray-900"}>{charCount.toLocaleString()}</strong>
                  <span className="text-gray-400"> / 2,200</span>
                </span>
                <span>|</span>
                <span>
                  태그: <strong className="text-gray-900">{activeTags.length}</strong>개
                </span>
              </div>
              <button
                onClick={handleCopyAll}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-gray-900 text-white hover:bg-gray-800 shadow-sm"
                }`}
              >
                {copied ? "복사 완료!" : "전체 복사"}
              </button>
            </div>

            {/* Grouped tags */}
            {(["high", "medium", "niche"] as Popularity[]).map((tier) => {
              const tags = groupedTags[tier];
              if (tags.length === 0) return null;
              const cfg = popularityLabels[tier];
              return (
                <div key={tier}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400">{cfg.desc}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((h) => {
                      const isRemoved = removed.has(h.text);
                      return (
                        <button
                          key={h.text}
                          onClick={() => toggleTag(h.text)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                            isRemoved
                              ? "bg-gray-100 text-gray-400 border-gray-200 line-through opacity-50"
                              : h.language === "en"
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {h.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Regenerate */}
            <button
              onClick={handleGenerate}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-medium hover:border-gray-400 hover:text-gray-700 transition-colors"
            >
              다시 생성하기
            </button>
          </div>
        </div>
      )}

      {/* ── Strategy Tips ── */}
      <div className="calc-card p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">💡</span>
          인스타그램 해시태그 전략 팁
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 text-sm mb-2">인기 해시태그 (30%)</h3>
            <p className="text-red-700 text-xs leading-relaxed">
              게시물 수 100만 이상의 대형 태그. 초기 노출에 유리하지만 경쟁이 치열하여 빠르게 묻힐 수 있습니다.
              전체의 30% 정도만 사용하는 것이 효과적입니다.
            </p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="font-semibold text-amber-800 text-sm mb-2">중간 인기 해시태그 (40%)</h3>
            <p className="text-amber-700 text-xs leading-relaxed">
              게시물 수 10만~100만의 중형 태그. 노출과 도달률의 균형이 좋아 가장 효과적인 구간입니다.
              전체의 40% 정도가 최적입니다.
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <h3 className="font-semibold text-emerald-800 text-sm mb-2">니치 해시태그 (30%)</h3>
            <p className="text-emerald-700 text-xs leading-relaxed">
              데이터에 기록된 게시물 수 10만 이하의 소형 태그입니다. 세부 주제를 표현할 때 참고할 수 있지만
              노출이나 도달률을 보장하지 않습니다.
            </p>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 text-sm mb-2">추가 꿀팁</h3>
            <ul className="text-blue-700 text-xs leading-relaxed space-y-1">
              <li>- 해시태그는 최대 30개까지 사용 가능</li>
              <li>- 캡션 또는 첫 번째 댓글에 추가</li>
              <li>- 관련 없는 태그는 오히려 도달률을 낮춤</li>
              <li>- 매번 같은 태그 조합은 피하세요</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── SEO Content ── */}
      <section className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">인스타 해시태그 생성기 사용법</h2>
          <p className="text-gray-600 leading-relaxed">
            1. 게시물에 맞는 카테고리를 선택하세요 (음식, 카페, 여행 등 12개 카테고리).
            2. 추가 키워드가 있다면 자유롭게 입력하세요.
            3. 원하는 분위기를 선택하세요 (감성, 밝은, 유머, 고급, 자연, 빈티지).
            4. 해시태그 수와 언어를 설정한 후 &quot;해시태그 생성하기&quot; 버튼을 누르세요.
            5. 생성된 해시태그에서 불필요한 태그는 클릭하여 제거하고, &quot;전체 복사&quot;로 한 번에 복사하세요.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">왜 해시태그가 중요한가요?</h2>
          <p className="text-gray-600 leading-relaxed">
            인스타그램 해시태그는 내 게시물을 팔로워가 아닌 사람들에게도 노출시키는 핵심 도구입니다.
            해시태그는 게시물의 주제를 설명하는 보조 수단입니다. 추천 목록은 고정 데이터에서 고른 예시이며,
            플랫폼 알고리즘의 노출이나 도달률을 예측하거나 보장하지 않습니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">자주 묻는 질문 (FAQ)</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">해시태그는 몇 개가 적당한가요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                인스타그램에서는 최대 30개까지 사용할 수 있습니다. 일반적으로 20~25개를 사용하는 것이
                가장 효과적이라고 알려져 있습니다. 너무 적으면 노출이 부족하고, 너무 많으면 스팸으로 인식될 수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">한국어와 영어 태그를 섞어 써도 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                네, 한국어와 영어 해시태그를 섞어 사용하면 국내외 사용자 모두에게 도달할 수 있어 효과적입니다.
                특히 음식, 여행, 패션 관련 게시물에서 혼합 사용이 좋은 결과를 보여줍니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">매번 같은 해시태그를 사용해도 되나요?</h3>
              <p className="text-gray-600 text-sm mt-1">
                같은 해시태그를 반복 사용하면 인스타그램 알고리즘에 의해 &quot;섀도우밴&quot;을 받을 수 있습니다.
                매 게시물마다 해시태그 조합을 변경하는 것을 권장합니다. 이 도구의 &quot;다시 생성&quot; 기능을 활용하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      <RelatedTools current="hashtag-generator" />
    </div>
  );
}
