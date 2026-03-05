"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Item {
  title: string;
  description: string;
  href: string;
  emoji: string;
}

const calculators: Item[] = [
  { title: "환율 계산기", description: "실시간 환율 기반으로 원화와 주요 외화 간 환율을 계산합니다.", href: "/calculators/exchange-rate", emoji: "\uD83D\uDCB1" },
  { title: "퍼센트 계산기", description: "백분율, 할인율, 증감률 등 다양한 퍼센트 계산을 합니다.", href: "/calculators/percent", emoji: "\uD83D\uDCCA" },
  { title: "글자수 세기", description: "글자수, 단어수, 바이트 수를 실시간으로 계산합니다.", href: "/calculators/character-count", emoji: "\uD83D\uDCDD" },
  { title: "연봉 실수령액 계산기", description: "연봉에서 4대보험과 소득세를 공제한 월 실수령액을 계산합니다.", href: "/calculators/salary", emoji: "\uD83D\uDCB0" },
  { title: "대출이자 계산기", description: "원리금균등 또는 원금균등 상환 방식의 대출이자를 계산합니다.", href: "/calculators/loan", emoji: "\uD83C\uDFE6" },
  { title: "퇴직금 계산기", description: "근무기간과 평균임금을 기반으로 퇴직금을 계산합니다.", href: "/calculators/retirement", emoji: "\uD83D\uDCBC" },
  { title: "날짜 계산기 (D-day)", description: "D-day 카운트다운, 두 날짜 사이의 일수 차이를 계산합니다.", href: "/calculators/dday", emoji: "\uD83D\uDCC5" },
  { title: "나이 계산기", description: "만 나이와 한국 나이를 계산하고 다음 생일까지 남은 일수를 확인합니다.", href: "/calculators/age", emoji: "\uD83C\uDF82" },
  { title: "평수 계산기", description: "평을 제곱미터(\u33A1)로, \u33A1를 평으로 간편하게 변환합니다.", href: "/calculators/pyeong", emoji: "\uD83C\uDFE2" },
  { title: "실업급여 계산기", description: "나이, 근속연수, 평균 월급으로 예상 실업급여를 계산합니다.", href: "/calculators/unemployment", emoji: "\uD83D\uDCCB" },
  { title: "단위 변환기", description: "길이, 무게, 온도, 넓이, 부피를 간편하게 변환합니다.", href: "/calculators/unit-converter", emoji: "\uD83D\uDD04" },
  { title: "비율 계산기", description: "비율 단순화, 비례식, 화면 비율을 계산합니다.", href: "/calculators/ratio", emoji: "\uD83D\uDCCF" },
  { title: "연차 계산기", description: "입사일 기준으로 발생한 연차 일수를 계산합니다.", href: "/calculators/annual-leave", emoji: "\uD83C\uDFD6\uFE0F" },
  { title: "적금 이자 계산기", description: "단리/복리 방식의 적금 만기 수령액과 이자를 계산합니다.", href: "/calculators/savings", emoji: "\uD83D\uDCB3" },
  { title: "학점 계산기", description: "대학교 평균 학점(GPA)을 4.5 또는 4.3 만점 기준으로 계산합니다.", href: "/calculators/gpa", emoji: "\uD83C\uDF93" },
  { title: "음주 측정기", description: "음주량과 시간으로 예상 혈중알코올농도를 계산합니다.", href: "/calculators/alcohol", emoji: "\uD83C\uDF7A" },
  { title: "전기요금 계산기", description: "월간 전력 사용량으로 가정용 전기요금을 누진제 기준으로 계산합니다.", href: "/calculators/electricity", emoji: "\u26A1" },
  { title: "자동차세 계산기", description: "배기량과 차령에 따른 자동차세를 계산합니다.", href: "/calculators/car-tax", emoji: "\uD83D\uDE97" },
  { title: "BMI 계산기", description: "키와 몸무게로 체질량지수(BMI)를 계산하고 비만도를 확인합니다.", href: "/calculators/bmi", emoji: "\u2696\uFE0F" },
  { title: "예금이자 계산기", description: "예치금액, 이자율, 기간으로 예금 만기 수령액을 계산합니다.", href: "/calculators/deposit", emoji: "\uD83C\uDFE6" },
  { title: "주식 수익률 계산기", description: "매수가, 매도가, 수수료, 세금을 반영한 순수익과 수익률을 계산합니다.", href: "/calculators/stock-return", emoji: "\uD83D\uDCC8" },
  { title: "물타기 계산기", description: "여러 차수의 매수를 입력하여 평균 매수단가를 계산합니다.", href: "/calculators/average-price", emoji: "\uD83D\uDCB9" },
  { title: "인플레이션 계산기", description: "물가상승률에 따른 미래 화폐가치와 구매력 변화를 계산합니다.", href: "/calculators/inflation", emoji: "\uD83D\uDCB8" },
  { title: "부가세 계산기", description: "공급가액에서 부가세를 계산하거나, 합계금액에서 역산합니다.", href: "/calculators/vat", emoji: "\uD83E\uDDFE" },
  { title: "로또 세금 계산기", description: "로또 당첨금에서 세금을 공제한 실수령액을 계산합니다.", href: "/calculators/lotto-tax", emoji: "\uD83C\uDFB0" },
  { title: "전월세 전환 계산기", description: "전세를 월세로, 월세를 전세로 전환할 때 적정 금액을 계산합니다.", href: "/calculators/rent-conversion", emoji: "\uD83C\uDFE0" },
  { title: "공학용 계산기", description: "삼각함수, 로그, 지수, 팩토리얼 등 공학용 계산을 합니다.", href: "/calculators/scientific", emoji: "\uD83D\uDD2C" },
];

const realEstateCalcs: Item[] = [
  { title: "중개수수료 계산기", description: "매매, 전세, 월세 거래 시 부동산 중개수수료를 계산합니다.", href: "/calculators/brokerage-fee", emoji: "\uD83C\uDFE2" },
  { title: "취득세 계산기", description: "주택 취득 시 취득세, 농어촌특별세, 지방교육세를 계산합니다.", href: "/calculators/acquisition-tax", emoji: "\uD83C\uDFE0" },
  { title: "양도소득세 계산기", description: "부동산 양도 시 양도소득세를 장기보유특별공제 포함하여 계산합니다.", href: "/calculators/capital-gains-tax", emoji: "\uD83D\uDCB0" },
  { title: "증여세 계산기", description: "증여재산가액과 관계별 공제액으로 증여세를 계산합니다.", href: "/calculators/gift-tax", emoji: "\uD83C\uDF81" },
  { title: "상속세 계산기", description: "상속재산, 배우자 유무, 자녀 수로 상속세를 계산합니다.", href: "/calculators/inheritance-tax", emoji: "\uD83D\uDCDC" },
];

const funCalcs: Item[] = [
  { title: "MBTI 궁합 테스트", description: "두 MBTI 유형의 궁합 점수와 상세 분석을 확인합니다.", href: "/calculators/mbti-compatibility", emoji: "\uD83D\uDC95" },
  { title: "이름 궁합 계산기", description: "두 이름의 획수로 궁합 퍼센트를 계산합니다.", href: "/calculators/name-compatibility", emoji: "\uD83D\uDC98" },
  { title: "별자리 계산기", description: "생일로 나의 별자리, 성격, 궁합, 행운의 숫자를 알아봅니다.", href: "/calculators/constellation", emoji: "\u2B50" },
  { title: "띠 계산기 (12간지)", description: "출생년도로 나의 띠, 천간, 오행, 성격, 궁합을 알아봅니다.", href: "/calculators/zodiac", emoji: "\uD83D\uDC09" },
  { title: "혈액형 계산기", description: "부모 혈액형으로 아기의 가능한 혈액형과 확률을 계산합니다.", href: "/calculators/blood-type", emoji: "\uD83E\uDE78" },
  { title: "사주팔자 계산기", description: "생년월일과 태어난 시간으로 사주팔자와 오행 분석을 확인합니다.", href: "/calculators/saju", emoji: "\u262F\uFE0F" },
  { title: "전생 테스트", description: "생년월일로 전생에서 어떤 삶을 살았는지 재미있게 알아봅니다.", href: "/calculators/past-life", emoji: "\uD83D\uDD2E" },
  { title: "오늘의 운세", description: "나의 띠로 오늘의 총운, 애정운, 재물운, 건강운, 직장운을 확인합니다.", href: "/calculators/daily-fortune", emoji: "\uD83C\uDF1F" },
  { title: "커플 D-day 계산기", description: "사귄 날짜부터 100일, 200일, 1000일 등 기념일을 계산합니다.", href: "/calculators/couple-dday", emoji: "\uD83D\uDC91" },
  { title: "심리테스트", description: "성격 유형, 연애 스타일, 스트레스 지수를 알아보는 심리테스트입니다.", href: "/tools/psychology-test", emoji: "\uD83E\uDDE0" },
  { title: "MBTI 성격유형 검사", description: "20가지 질문으로 나의 MBTI 성격유형을 알아봅니다.", href: "/tools/mbti-test", emoji: "\uD83E\uDDE9" },
];

const tools: Item[] = [
  { title: "타이머 & 스톱워치", description: "카운트다운 타이머와 랩 타임 스톱워치를 사용합니다.", href: "/tools/timer", emoji: "\u23F1\uFE0F" },
  { title: "JSON 포매터", description: "JSON 데이터를 보기 좋게 정리하거나 검증, 미니파이할 수 있습니다.", href: "/tools/json-formatter", emoji: "\uD83D\uDCDD" },
  { title: "Base64 인코더/디코더", description: "텍스트를 Base64로 인코딩하거나 디코딩합니다.", href: "/tools/base64", emoji: "\uD83D\uDD10" },
  { title: "QR 코드 생성기", description: "텍스트, URL, Wi-Fi 정보를 QR 코드로 변환합니다.", href: "/tools/qr-code", emoji: "\uD83D\uDCF1" },
  { title: "색상 변환기", description: "HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리봅니다.", href: "/tools/color-converter", emoji: "\uD83C\uDFA8" },
  { title: "이미지 변환기", description: "PNG, JPG, WebP 등 이미지 포맷을 브라우저에서 변환합니다.", href: "/tools/image-converter", emoji: "\uD83D\uDDBC\uFE0F" },
  { title: "CSV JSON 변환기", description: "CSV를 JSON으로, JSON을 CSV로 간편하게 변환합니다.", href: "/tools/csv-json", emoji: "\uD83D\uDCC4" },
  { title: "닉네임 생성기", description: "귀여운, 멋진, 웃긴, 게임용 스타일의 랜덤 닉네임을 생성합니다.", href: "/tools/nickname-generator", emoji: "\uD83C\uDFAD" },
  { title: "Markdown HTML 변환기", description: "마크다운을 HTML로 변환하고 미리보기할 수 있습니다.", href: "/tools/markdown-html", emoji: "\uD83D\uDCE8" },
  { title: "랜덤 숫자 생성기", description: "숫자 범위 지정, 여러 개 뽑기, 로또 번호 생성을 지원합니다.", href: "/tools/random-number", emoji: "\uD83C\uDFB2" },
  { title: "타자 속도 측정기", description: "한글 타이핑 속도와 정확도를 실시간으로 측정합니다.", href: "/tools/typing-test", emoji: "\u2328\uFE0F" },
  { title: "랜덤 룰렛 돌리기", description: "항목을 추가하고 룰렛을 돌려 점심 메뉴, 벌칙 등을 정합니다.", href: "/tools/random-roulette", emoji: "\uD83C\uDFB0" },
];

const games: Item[] = [
  { title: "라이어 게임", description: "참가자 중 라이어를 찾아내는 대화형 추리 게임입니다.", href: "/tools/liar-game", emoji: "\uD83E\uDD25" },
  { title: "진실 or 도전", description: "진실을 말하거나 도전 미션을 수행하는 파티 게임입니다.", href: "/tools/truth-or-dare", emoji: "\uD83C\uDFAF" },
  { title: "폭탄 돌리기", description: "랜덤 타이머 폭탄을 돌리며 긴장감을 즐기세요!", href: "/tools/bomb-game", emoji: "\uD83D\uDCA3" },
  { title: "업다운 게임", description: "1~100 숫자를 맞추는 스릴 넘치는 게임입니다.", href: "/tools/updown-game", emoji: "\uD83D\uDD22" },
  { title: "랜덤 지목", description: "룰렛처럼 돌려서 한 명을 뽑고 미션을 수행하세요!", href: "/tools/random-pick", emoji: "\uD83C\uDFB0" },
  { title: "술게임 모음", description: "5가지 인기 술게임을 한 곳에서 즐겨보세요.", href: "/tools/drinking-games", emoji: "\uD83C\uDF7B" },
  { title: "사다리 타기", description: "2~8명이 참여하는 사다리 타기 게임을 즐겨보세요.", href: "/tools/ladder-game", emoji: "\uD83E\uDDEA" },
  { title: "반응속도 테스트", description: "화면이 초록색으로 바뀌는 순간 클릭! 반응 속도를 측정합니다.", href: "/tools/reaction-test", emoji: "\u26A1" },
  { title: "기억력 테스트", description: "카드 뒤집기 게임으로 기억력을 테스트합니다.", href: "/tools/memory-game", emoji: "\uD83C\uDFAE" },
  { title: "색맹 테스트", description: "이시하라 스타일의 색각 검사로 색각 이상 여부를 확인합니다.", href: "/tools/color-blind-test", emoji: "\uD83C\uDFA8" },
  { title: "2048", description: "같은 숫자 타일을 합쳐 2048을 만드는 중독성 퍼즐 게임입니다.", href: "/tools/game-2048", emoji: "\uD83C\uDFAE" },
  { title: "스도쿠", description: "9x9 그리드에 1~9 숫자를 채우는 클래식 숫자 퍼즐입니다.", href: "/tools/sudoku", emoji: "\uD83E\uDDE9" },
  { title: "블록 탈출", description: "블록을 밀어서 빨간 블록을 탈출시키는 퍼즐 게임입니다.", href: "/tools/block-escape", emoji: "\uD83D\uDE97" },
  { title: "지뢰찾기", description: "숨겨진 지뢰를 피해 안전한 칸을 모두 열어보세요!", href: "/tools/minesweeper", emoji: "\uD83D\uDCA3" },
  { title: "스네이크 게임", description: "사과를 먹고 뱀을 성장시키는 클래식 아케이드 게임입니다.", href: "/tools/snake-game", emoji: "\uD83D\uDC0D" },
  { title: "오목", description: "가로, 세로, 대각선으로 5개를 먼저 놓으면 승리! AI 대전 지원.", href: "/tools/omok", emoji: "\u26AB" },
];

const allSections = [
  { label: "생활 계산기", items: calculators, hoverColor: "hover:border-blue-300" },
  { label: "부동산 계산기", items: realEstateCalcs, hoverColor: "hover:border-purple-300" },
  { label: "재미/운세", items: funCalcs, hoverColor: "hover:border-pink-300" },
  { label: "게임", items: games, hoverColor: "hover:border-orange-300" },
  { label: "온라인 도구", items: tools, hoverColor: "hover:border-green-300" },
];

const FAVORITES_KEY = "calc_favorites";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
  } catch { return []; }
}

function toggleFavorite(href: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(href) ? favs.filter((f) => f !== href) : [...favs, href];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  return next;
}

function CardGrid({ items, hoverColor, search, favorites, onToggleFav }: {
  items: Item[];
  hoverColor: string;
  search: string;
  favorites: string[];
  onToggleFav: (href: string) => void;
}) {
  const filtered = search
    ? items.filter((i) => i.title.includes(search) || i.description.includes(search))
    : items;

  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {filtered.map((item) => (
        <div key={item.href} className="relative group">
          <Link
            href={item.href}
            className={`block bg-white rounded-xl border border-gray-200 p-5 transition-all hover:shadow-lg ${hoverColor} hover:-translate-y-1`}
          >
            <div className="text-3xl mb-3">{item.emoji}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{item.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); onToggleFav(item.href); }}
            className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 border border-gray-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-yellow-50 hover:border-yellow-300"
            aria-label={favorites.includes(item.href) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            title={favorites.includes(item.href) ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            <span className={`text-sm ${favorites.includes(item.href) ? "text-yellow-500" : "text-gray-300"}`}>
              {favorites.includes(item.href) ? "\u2605" : "\u2606"}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const handleToggleFav = (href: string) => {
    setFavorites(toggleFavorite(href));
  };

  // Gather all favorite items
  const allItems = [...calculators, ...realEstateCalcs, ...funCalcs, ...tools];
  const favItems = allItems.filter((i) => favorites.includes(i.href));

  const hasSearchResults = search
    ? allSections.some((s) => s.items.some((i) => i.title.includes(search) || i.description.includes(search)))
    : true;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          생활 계산기 & 온라인 도구 모음
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          연봉, 대출, 건강, 근로 등 생활 계산기와 개발자 도구를 무료로 이용하세요.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="계산기 또는 도구 검색..."
            className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="검색 지우기"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </section>

      {/* Favorites */}
      {!search && favItems.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-yellow-500">&#9733;</span> 즐겨찾기
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favItems.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="block bg-yellow-50 rounded-xl border border-yellow-200 p-5 transition-all hover:shadow-lg hover:border-yellow-400 hover:-translate-y-1"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </Link>
                <button
                  onClick={() => handleToggleFav(item.href)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-yellow-300 hover:bg-red-50 hover:border-red-300 transition-colors"
                  aria-label="즐겨찾기 해제"
                  title="즐겨찾기 해제"
                >
                  <span className="text-yellow-500 text-sm">&#9733;</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Search no results */}
      {search && !hasSearchResults && (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-2">&quot;{search}&quot;에 대한 검색 결과가 없습니다.</p>
          <button onClick={() => setSearch("")} className="text-blue-600 hover:underline text-sm">
            검색 초기화
          </button>
        </div>
      )}

      {/* Sections */}
      {allSections.map((section) => {
        const filtered = search
          ? section.items.filter((i) => i.title.includes(search) || i.description.includes(search))
          : section.items;
        if (filtered.length === 0) return null;
        return (
          <section key={section.label} className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{section.label}</h2>
            <CardGrid
              items={section.items}
              hoverColor={section.hoverColor}
              search={search}
              favorites={favorites}
              onToggleFav={handleToggleFav}
            />
          </section>
        );
      })}
    </div>
  );
}
