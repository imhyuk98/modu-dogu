"use client";

import { useState, useCallback } from "react";
import RelatedTools from "@/components/RelatedTools";

/* ══════════════════════════════════════════
   Types
   ══════════════════════════════════════════ */

interface Movie {
  titleKR: string;
  titleEN: string;
  year: number;
  director: string;
  genres: Genre[];
  country: Country;
  rating: number;
  duration: number;
  platforms: Platform[];
  description: string;
  moods: Mood[];
  recommendReason: string;
}

type Mood = "심심할 때" | "우울할 때" | "신날 때" | "데이트" | "혼자" | "가족과" | "친구와" | "밤에 못 잘 때";
type Genre = "액션" | "로맨스" | "코미디" | "공포" | "SF" | "판타지" | "드라마" | "스릴러" | "애니메이션" | "다큐" | "뮤지컬" | "범죄";
type Country = "한국" | "미국" | "일본" | "유럽" | "기타";
type Era = "최신(2020~)" | "2010년대" | "2000년대" | "클래식(~1999)" | "상관없음";
type Duration = "짧은영화(~100분)" | "보통(100~130분)" | "긴영화(130분~)" | "상관없음";
type Platform = "넷플릭스" | "왓챠" | "디즈니+" | "극장" | "상관없음";

/* ══════════════════════════════════════════
   Constants
   ══════════════════════════════════════════ */

const MOODS: Mood[] = ["심심할 때", "우울할 때", "신날 때", "데이트", "혼자", "가족과", "친구와", "밤에 못 잘 때"];
const GENRES: Genre[] = ["액션", "로맨스", "코미디", "공포", "SF", "판타지", "드라마", "스릴러", "애니메이션", "다큐", "뮤지컬", "범죄"];
const COUNTRIES: Country[] = ["한국", "미국", "일본", "유럽", "기타"];
const ERAS: Era[] = ["최신(2020~)", "2010년대", "2000년대", "클래식(~1999)", "상관없음"];
const DURATIONS: Duration[] = ["짧은영화(~100분)", "보통(100~130분)", "긴영화(130분~)", "상관없음"];
const PLATFORMS: Platform[] = ["넷플릭스", "왓챠", "디즈니+", "극장", "상관없음"];

const MOOD_EMOJI: Record<Mood, string> = {
  "심심할 때": "😐", "우울할 때": "😢", "신날 때": "🥳", "데이트": "💕",
  "혼자": "🧘", "가족과": "👨‍👩‍👧‍👦", "친구와": "🍿", "밤에 못 잘 때": "🌙",
};

const GENRE_EMOJI: Record<Genre, string> = {
  "액션": "💥", "로맨스": "💗", "코미디": "😂", "공포": "👻", "SF": "🚀", "판타지": "🧙",
  "드라마": "🎭", "스릴러": "😱", "애니메이션": "🎨", "다큐": "📹", "뮤지컬": "🎵", "범죄": "🔫",
};

const PLATFORM_COLOR: Record<string, string> = {
  "넷플릭스": "bg-red-100 text-red-700",
  "왓챠": "bg-pink-100 text-pink-700",
  "디즈니+": "bg-blue-100 text-blue-700",
  "극장": "bg-amber-100 text-amber-700",
};

/* ══════════════════════════════════════════
   Movie Database (150+)
   ══════════════════════════════════════════ */

const MOVIES: Movie[] = [
  // ── 한국 영화 (40+) ──
  { titleKR: "기생충", titleEN: "Parasite", year: 2019, director: "봉준호", genres: ["드라마", "스릴러"], country: "한국", rating: 9.5, duration: 132, platforms: ["왓챠", "넷플릭스"], description: "반지하에 사는 기택 가족이 부유한 박사장 가족에게 기생하며 벌어지는 이야기. 칸 황금종려상과 아카데미 작품상을 동시에 수상한 한국 영화의 역사.", moods: ["혼자", "친구와", "밤에 못 잘 때"], recommendReason: "한국 영화의 정점을 경험할 수 있는 걸작" },
  { titleKR: "올드보이", titleEN: "Oldboy", year: 2003, director: "박찬욱", genres: ["스릴러", "드라마"], country: "한국", rating: 9.0, duration: 120, platforms: ["왓챠", "넷플릭스"], description: "이유도 모른 채 15년간 감금됐다 풀려난 남자의 복수극. 충격적인 반전과 강렬한 연출로 세계적 명성을 얻은 작품.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "잊을 수 없는 반전의 충격을 선사하는 걸작 스릴러" },
  { titleKR: "부산행", titleEN: "Train to Busan", year: 2016, director: "연상호", genres: ["액션", "스릴러"], country: "한국", rating: 8.5, duration: 118, platforms: ["넷플릭스", "왓챠"], description: "KTX 열차 안에서 좀비 바이러스가 퍼지며 벌어지는 생존 사투. 긴장감 넘치는 전개와 감동적인 결말이 인상적.", moods: ["심심할 때", "친구와"], recommendReason: "한국형 좀비 영화의 교과서, 손에 땀을 쥐게 한다" },
  { titleKR: "극한직업", titleEN: "Extreme Job", year: 2019, director: "이병헌", genres: ["코미디", "액션"], country: "한국", rating: 8.0, duration: 111, platforms: ["넷플릭스", "왓챠"], description: "마약반 형사들이 잠복 수사를 위해 치킨집을 인수했는데 치킨이 대박나버린 이야기. 한국 영화 역대 흥행 2위.", moods: ["심심할 때", "신날 때", "친구와", "가족과"], recommendReason: "웃음이 보장되는 한국 코미디의 걸작" },
  { titleKR: "범죄도시", titleEN: "The Roundup", year: 2017, director: "강윤성", genres: ["액션", "범죄"], country: "한국", rating: 8.3, duration: 121, platforms: ["넷플릭스", "왓챠"], description: "서울 금천서 강력반 마석도 형사가 중국 동포 조직과 맞서 싸우는 통쾌한 액션. 마동석의 대표작.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "마동석의 통쾌한 주먹 액션이 스트레스를 날려준다" },
  { titleKR: "살인의 추억", titleEN: "Memories of Murder", year: 2003, director: "봉준호", genres: ["드라마", "스릴러", "범죄"], country: "한국", rating: 9.3, duration: 132, platforms: ["왓챠", "넷플릭스"], description: "1986년 화성 연쇄살인 사건을 모티브로 한 실화 기반 영화. 범인을 쫓는 형사들의 좌절과 분노를 그린 봉준호 감독의 대표작.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "한국 영화사 최고의 걸작으로 꼽히는 불후의 명작" },
  { titleKR: "괴물", titleEN: "The Host", year: 2006, director: "봉준호", genres: ["액션", "드라마", "SF"], country: "한국", rating: 8.5, duration: 120, platforms: ["왓챠", "넷플릭스"], description: "한강에서 나타난 괴물에게 딸을 빼앗긴 가족의 사투. 가족애와 사회 풍자를 담은 봉준호 감독의 괴수 영화.", moods: ["심심할 때", "가족과", "친구와"], recommendReason: "괴수 영화이면서 동시에 깊은 가족 드라마" },
  { titleKR: "공동경비구역 JSA", titleEN: "Joint Security Area", year: 2000, director: "박찬욱", genres: ["드라마", "스릴러"], country: "한국", rating: 8.8, duration: 110, platforms: ["왓챠"], description: "판문점 공동경비구역에서 벌어진 총격 사건의 진실을 추적하는 이야기. 남북 병사들의 우정과 비극을 그린 감동작.", moods: ["혼자", "우울할 때"], recommendReason: "남북 분단의 비극을 가슴 아프게 그린 명작" },
  { titleKR: "건축학개론", titleEN: "Architecture 101", year: 2012, director: "이용주", genres: ["로맨스", "드라마"], country: "한국", rating: 7.8, duration: 118, platforms: ["왓챠", "넷플릭스"], description: "대학 시절 첫사랑의 추억과 15년 후 재회를 그린 로맨스. 누구나 공감할 수 있는 풋풋한 첫사랑 이야기.", moods: ["우울할 때", "데이트", "혼자"], recommendReason: "첫사랑의 설렘과 아련함을 다시 느끼게 해주는 영화" },
  { titleKR: "써니", titleEN: "Sunny", year: 2011, director: "강형철", genres: ["코미디", "드라마"], country: "한국", rating: 8.2, duration: 124, platforms: ["왓챠", "넷플릭스"], description: "고등학교 시절 7인조 여학생 그룹 '써니'의 25년 후 재회 이야기. 웃음과 눈물이 공존하는 우정 영화.", moods: ["우울할 때", "친구와", "가족과"], recommendReason: "웃다가 울게 만드는 우정과 청춘의 이야기" },
  { titleKR: "베테랑", titleEN: "Veteran", year: 2015, director: "류승완", genres: ["액션", "범죄"], country: "한국", rating: 8.3, duration: 123, platforms: ["넷플릭스", "왓챠"], description: "광수대 형사 서도철이 재벌 3세의 범죄를 파헤치는 통쾌한 액션 영화. 유아인의 악역 연기가 인상적.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "정의로운 형사의 통쾌한 활약이 카타르시스를 준다" },
  { titleKR: "암살", titleEN: "Assassination", year: 2015, director: "최동훈", genres: ["액션", "드라마"], country: "한국", rating: 8.5, duration: 139, platforms: ["넷플릭스", "왓챠"], description: "1933년 일제강점기, 독립군 저격수들의 친일파 암살 작전. 스타 배우들의 열연과 탄탄한 스토리가 돋보이는 대작.", moods: ["심심할 때", "가족과", "친구와"], recommendReason: "역사적 감동과 액션의 쾌감을 동시에 느낄 수 있다" },
  { titleKR: "관상", titleEN: "The Face Reader", year: 2013, director: "한재림", genres: ["드라마"], country: "한국", rating: 8.0, duration: 139, platforms: ["왓챠", "넷플릭스"], description: "조선 최고의 관상가 내경이 수양대군의 야심을 읽어내며 벌어지는 역사 드라마. 송강호의 명연기가 빛나는 작품.", moods: ["심심할 때", "혼자"], recommendReason: "역사의 소용돌이 속 인간의 운명을 그린 수작" },
  { titleKR: "타짜", titleEN: "Tazza: The High Rollers", year: 2006, director: "최동훈", genres: ["범죄", "드라마"], country: "한국", rating: 8.5, duration: 139, platforms: ["왓챠", "넷플릭스"], description: "타고난 손재주를 가진 고니가 도박판에 뛰어들며 벌어지는 이야기. 화려한 카드 기술과 반전이 매력적.", moods: ["심심할 때", "친구와", "밤에 못 잘 때"], recommendReason: "긴장감 넘치는 도박 세계의 스릴을 만끽할 수 있다" },
  { titleKR: "신과함께: 죄와 벌", titleEN: "Along with the Gods", year: 2017, director: "김용화", genres: ["판타지", "드라마"], country: "한국", rating: 7.8, duration: 139, platforms: ["넷플릭스", "왓챠"], description: "소방관 김자홍이 사후 세계에서 7번의 재판을 받으며 전생의 죄를 심판받는 판타지. 감동적인 가족 이야기.", moods: ["가족과", "우울할 때"], recommendReason: "가족에 대한 사랑을 다시 생각하게 만드는 감동작" },
  { titleKR: "남한산성", titleEN: "The Fortress", year: 2017, director: "황동혁", genres: ["드라마"], country: "한국", rating: 7.5, duration: 140, platforms: ["넷플릭스", "왓챠"], description: "병자호란 당시 남한산성에 갇힌 인조와 신하들의 47일간의 항전. 주전파와 주화파의 팽팽한 대립을 그린 역사극.", moods: ["혼자"], recommendReason: "역사 속 선택의 무게를 느낄 수 있는 묵직한 영화" },
  { titleKR: "엑시트", titleEN: "Exit", year: 2019, director: "이상근", genres: ["액션", "코미디"], country: "한국", rating: 7.8, duration: 103, platforms: ["넷플릭스", "왓챠"], description: "도심에 독가스가 퍼진 재난 상황에서 클라이밍 실력으로 탈출하는 청년의 이야기. 긴박한 액션과 유머가 공존.", moods: ["심심할 때", "신날 때", "데이트", "친구와"], recommendReason: "가볍게 즐기기 좋은 재난 액션 코미디" },
  { titleKR: "미나리", titleEN: "Minari", year: 2020, director: "정이삭", genres: ["드라마"], country: "한국", rating: 8.0, duration: 115, platforms: ["왓챠", "넷플릭스"], description: "1980년대 미국 아칸소로 이주한 한국인 가족의 아메리칸 드림을 그린 영화. 윤여정의 아카데미 여우조연상 수상작.", moods: ["혼자", "가족과", "우울할 때"], recommendReason: "잔잔하지만 깊은 울림을 주는 가족 이야기" },
  { titleKR: "헤어질 결심", titleEN: "Decision to Leave", year: 2022, director: "박찬욱", genres: ["로맨스", "스릴러"], country: "한국", rating: 8.5, duration: 138, platforms: ["왓챠"], description: "산악 추락사 사건을 수사하는 형사가 용의자의 아내에게 빠져드는 미스터리 로맨스. 박찬욱 감독의 섬세한 연출이 돋보이는 작품.", moods: ["혼자", "밤에 못 잘 때", "데이트"], recommendReason: "아름답고 슬픈 사랑의 미스터리에 빠져들게 된다" },
  { titleKR: "택시운전사", titleEN: "A Taxi Driver", year: 2017, director: "장훈", genres: ["드라마"], country: "한국", rating: 8.5, duration: 137, platforms: ["넷플릭스", "왓챠"], description: "1980년 광주민주화운동을 취재하러 온 독일 기자를 태운 택시운전사의 실화. 송강호 주연의 감동 실화.", moods: ["혼자", "가족과"], recommendReason: "역사의 현장을 함께 달리는 듯한 감동을 선사한다" },
  { titleKR: "아저씨", titleEN: "The Man from Nowhere", year: 2010, director: "이정범", genres: ["액션", "스릴러"], country: "한국", rating: 8.7, duration: 119, platforms: ["넷플릭스", "왓챠"], description: "이웃집 소녀를 구하기 위해 과거를 버린 남자가 다시 싸움에 나서는 원빈 주연의 액션 영화. 강렬한 액션과 감동이 공존.", moods: ["심심할 때", "혼자", "밤에 못 잘 때"], recommendReason: "원빈의 카리스마 넘치는 액션이 압도적인 명작" },
  { titleKR: "변호인", titleEN: "The Attorney", year: 2013, director: "양우석", genres: ["드라마"], country: "한국", rating: 8.5, duration: 127, platforms: ["넷플릭스", "왓챠"], description: "세무 변호사 송우석이 부림사건을 계기로 인권 변호사로 변모하는 이야기. 고 노무현 전 대통령을 모티브로 한 작품.", moods: ["혼자", "우울할 때"], recommendReason: "정의를 위해 싸우는 한 사람의 용기에 감동받게 된다" },
  { titleKR: "서울의 봄", titleEN: "12.12: The Day", year: 2023, director: "김성수", genres: ["드라마", "스릴러"], country: "한국", rating: 8.8, duration: 141, platforms: ["넷플릭스", "왓챠"], description: "1979년 12.12 군사반란의 9시간을 그린 실화 기반 영화. 황정민과 정우성의 명연기가 빛나는 역사 스릴러.", moods: ["심심할 때", "혼자", "친구와"], recommendReason: "긴박한 역사의 밤을 함께 체험하는 몰입감이 압도적" },
  { titleKR: "파묘", titleEN: "Exhuma", year: 2024, director: "장재현", genres: ["공포", "스릴러"], country: "한국", rating: 8.0, duration: 134, platforms: ["넷플릭스"], description: "풍수사와 무당이 의문의 묘를 파헤치며 벌어지는 오컬트 미스터리. 한국적 공포와 역사적 맥락이 결합된 작품.", moods: ["친구와", "밤에 못 잘 때"], recommendReason: "한국적 공포의 새로운 지평을 연 오컬트 걸작" },
  { titleKR: "밀양", titleEN: "Secret Sunshine", year: 2007, director: "이창동", genres: ["드라마"], country: "한국", rating: 8.5, duration: 142, platforms: ["왓챠"], description: "아들을 잃은 여인이 밀양에서 신앙과 용서 사이에서 갈등하는 이야기. 전도연의 칸 여우주연상 수상작.", moods: ["혼자"], recommendReason: "인간 내면의 깊은 고통과 구원을 탐구하는 영화" },
  { titleKR: "추격자", titleEN: "The Chaser", year: 2008, director: "나홍진", genres: ["스릴러", "범죄"], country: "한국", rating: 8.8, duration: 125, platforms: ["왓챠", "넷플릭스"], description: "전직 형사 출신 포주가 사라진 여성들을 추적하며 연쇄살인범과 대결하는 이야기. 실화에서 영감을 받은 강렬한 스릴러.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "숨 막히는 추격전이 심장을 쫄깃하게 만든다" },
  { titleKR: "곡성", titleEN: "The Wailing", year: 2016, director: "나홍진", genres: ["공포", "스릴러"], country: "한국", rating: 8.5, duration: 156, platforms: ["넷플릭스", "왓챠"], description: "전라도 곡성 마을에 의문의 일본인이 나타난 후 벌어지는 연쇄 사건. 공포와 미스터리가 결합된 걸작.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "보고 나서도 해석이 분분한 미스터리 공포의 정점" },
  { titleKR: "국제시장", titleEN: "Ode to My Father", year: 2014, director: "윤제균", genres: ["드라마"], country: "한국", rating: 7.8, duration: 126, platforms: ["넷플릭스", "왓챠"], description: "한국전쟁부터 현재까지, 가족을 위해 헌신한 아버지 덕수의 일대기. 한국 현대사를 관통하는 감동 드라마.", moods: ["가족과", "우울할 때"], recommendReason: "부모님 세대의 희생과 사랑에 눈시울이 붉어진다" },
  { titleKR: "완벽한 타인", titleEN: "Intimate Strangers", year: 2018, director: "이재규", genres: ["코미디", "드라마"], country: "한국", rating: 7.8, duration: 115, platforms: ["넷플릭스", "왓챠"], description: "친구 모임에서 서로의 핸드폰을 공개하기로 한 후 드러나는 비밀들. 누구에게나 숨기고 싶은 것이 있다.", moods: ["친구와", "데이트"], recommendReason: "관계 속 비밀에 대해 생각하게 만드는 유쾌한 영화" },
  { titleKR: "7번방의 선물", titleEN: "Miracle in Cell No.7", year: 2013, director: "이환경", genres: ["드라마", "코미디"], country: "한국", rating: 8.0, duration: 127, platforms: ["넷플릭스", "왓챠"], description: "지적장애를 가진 아버지 용구가 억울하게 투옥된 후, 7번방 동료들과 딸의 감동 이야기.", moods: ["우울할 때", "가족과"], recommendReason: "아버지와 딸의 순수한 사랑에 눈물이 멈추지 않는다" },
  { titleKR: "내부자들", titleEN: "Inside Men", year: 2015, director: "우민호", genres: ["범죄", "드라마"], country: "한국", rating: 8.3, duration: 130, platforms: ["넷플릭스", "왓챠"], description: "정치인, 재벌, 언론의 유착 관계를 파헤치는 정치 범죄 스릴러. 이병헌과 조승우의 강렬한 대결이 압권.", moods: ["심심할 때", "혼자"], recommendReason: "권력의 민낯을 적나라하게 보여주는 통쾌한 영화" },
  { titleKR: "범죄도시 2", titleEN: "The Roundup", year: 2022, director: "이상용", genres: ["액션", "범죄"], country: "한국", rating: 8.0, duration: 106, platforms: ["넷플릭스", "왓챠"], description: "마석도 형사가 베트남으로 도주한 한국인 범죄자를 추적하는 시리즈 2편. 더 강력해진 마동석의 액션.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "마석도의 통쾌한 주먹이 다시 돌아왔다" },
  { titleKR: "스물", titleEN: "Twenty", year: 2015, director: "이병헌", genres: ["코미디", "드라마"], country: "한국", rating: 7.5, duration: 115, platforms: ["넷플릭스", "왓챠"], description: "스무 살 세 친구의 좌충우돌 청춘 이야기. 취업, 연애, 우정 사이에서 방황하는 현실적인 청춘 코미디.", moods: ["신날 때", "친구와", "우울할 때"], recommendReason: "20대의 방황과 우정에 공감하며 웃고 울게 된다" },
  { titleKR: "도둑들", titleEN: "The Thieves", year: 2012, director: "최동훈", genres: ["액션", "범죄"], country: "한국", rating: 7.8, duration: 135, platforms: ["넷플릭스", "왓챠"], description: "한국과 홍콩의 도둑들이 마카오 카지노에서 다이아몬드를 훔치는 하이스트 영화. 화려한 캐스팅과 스케일.", moods: ["심심할 때", "친구와"], recommendReason: "화려한 도둑들의 대작전이 시원하게 펼쳐진다" },
  { titleKR: "1987", titleEN: "1987: When the Day Comes", year: 2017, director: "장준환", genres: ["드라마"], country: "한국", rating: 8.5, duration: 129, platforms: ["넷플릭스", "왓챠"], description: "1987년 민주화 운동을 배경으로, 한 대학생의 죽음이 거대한 민주화 물결로 이어지는 과정을 그린 실화 기반 영화.", moods: ["혼자"], recommendReason: "민주주의를 향한 뜨거운 열정에 가슴이 뜨거워진다" },
  { titleKR: "말할 수 없는 비밀", titleEN: "Secret", year: 2007, director: "주걸륜", genres: ["로맨스", "판타지"], country: "기타", rating: 8.0, duration: 101, platforms: ["왓챠"], description: "음악 학교에서 만난 소녀의 비밀을 알게 된 소년의 판타지 로맨스. 주걸륜이 감독과 주연을 맡은 작품.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "아름다운 음악과 함께하는 가슴 아픈 로맨스" },
  { titleKR: "과속스캔들", titleEN: "Scandal Makers", year: 2008, director: "강형철", genres: ["코미디", "드라마"], country: "한국", rating: 7.8, duration: 108, platforms: ["넷플릭스", "왓챠"], description: "젊은 라디오 DJ 앞에 갑자기 나타난 딸과 손자. 차승원의 코미디 연기가 빛나는 가족 코미디.", moods: ["가족과", "신날 때", "심심할 때"], recommendReason: "온 가족이 함께 웃으며 볼 수 있는 유쾌한 영화" },
  { titleKR: "범죄도시 3", titleEN: "The Roundup: No Way Out", year: 2023, director: "이상용", genres: ["액션", "범죄"], country: "한국", rating: 7.8, duration: 105, platforms: ["넷플릭스"], description: "마석도 형사가 일본 야쿠자와 연결된 마약 범죄 조직을 소탕하는 시리즈 3편.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "시원시원한 마석도의 액션을 다시 한번 즐길 수 있다" },
  { titleKR: "범죄도시 4", titleEN: "The Roundup: Punishment", year: 2024, director: "허명행", genres: ["액션", "범죄"], country: "한국", rating: 7.5, duration: 109, platforms: ["넷플릭스"], description: "온라인 불법 도박 사이트를 운영하는 범죄 조직을 마석도가 추적하는 시리즈 4편.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "변함없이 통쾌한 마석도 시리즈의 최신작" },

  // ── 미국 영화 (50+) ──
  { titleKR: "인셉션", titleEN: "Inception", year: 2010, director: "크리스토퍼 놀란", genres: ["SF", "액션", "스릴러"], country: "미국", rating: 9.3, duration: 148, platforms: ["넷플릭스", "왓챠"], description: "타인의 꿈에 침투하여 아이디어를 심는 산업 스파이의 이야기. 꿈 속의 꿈이라는 혁신적 구조가 돋보이는 걸작.", moods: ["혼자", "밤에 못 잘 때", "심심할 때"], recommendReason: "보면 볼수록 새로운 것을 발견하는 놀란의 걸작" },
  { titleKR: "인터스텔라", titleEN: "Interstellar", year: 2014, director: "크리스토퍼 놀란", genres: ["SF", "드라마"], country: "미국", rating: 9.5, duration: 169, platforms: ["넷플릭스", "왓챠"], description: "멸망 위기의 지구를 떠나 새로운 터전을 찾아 우주로 떠나는 탐험대의 이야기. 시간과 사랑에 대한 깊은 성찰.", moods: ["혼자", "우울할 때", "밤에 못 잘 때"], recommendReason: "우주적 스케일과 아버지의 사랑이 감동을 준다" },
  { titleKR: "쇼생크 탈출", titleEN: "The Shawshank Redemption", year: 1994, director: "프랭크 다라본트", genres: ["드라마"], country: "미국", rating: 9.7, duration: 142, platforms: ["왓챠", "넷플릭스"], description: "억울하게 투옥된 은행가 앤디가 쇼생크 교도소에서 희망을 잃지 않고 자유를 향해 나아가는 이야기. IMDB 1위 영화.", moods: ["우울할 때", "혼자"], recommendReason: "희망의 힘을 믿게 만드는 영화사 최고의 명작" },
  { titleKR: "펄프 픽션", titleEN: "Pulp Fiction", year: 1994, director: "쿠엔틴 타란티노", genres: ["범죄", "드라마"], country: "미국", rating: 9.0, duration: 154, platforms: ["왓챠", "넷플릭스"], description: "LA의 갱스터, 복서, 강도 커플의 이야기가 비선형적으로 교차하는 타란티노의 대표작.", moods: ["혼자", "밤에 못 잘 때", "친구와"], recommendReason: "독특한 구성과 중독성 있는 대사가 매력적인 걸작" },
  { titleKR: "포레스트 검프", titleEN: "Forrest Gump", year: 1994, director: "로버트 저메키스", genres: ["드라마", "로맨스"], country: "미국", rating: 9.2, duration: 142, platforms: ["왓챠", "넷플릭스"], description: "IQ 75의 순수한 청년 포레스트 검프가 미국 현대사의 주요 사건들을 관통하며 살아가는 감동적인 이야기.", moods: ["우울할 때", "혼자", "가족과"], recommendReason: "순수한 마음으로 세상을 살아가는 감동을 선사한다" },
  { titleKR: "다크 나이트", titleEN: "The Dark Knight", year: 2008, director: "크리스토퍼 놀란", genres: ["액션", "범죄", "드라마"], country: "미국", rating: 9.3, duration: 152, platforms: ["넷플릭스", "왓챠"], description: "배트맨과 광기의 빌런 조커의 대결. 히스 레저의 전설적인 조커 연기로 슈퍼히어로 영화의 새 지평을 연 작품.", moods: ["심심할 때", "혼자", "밤에 못 잘 때"], recommendReason: "히스 레저의 조커가 영화사를 바꾼 전설적 작품" },
  { titleKR: "어벤져스: 엔드게임", titleEN: "Avengers: Endgame", year: 2019, director: "루소 형제", genres: ["액션", "SF"], country: "미국", rating: 8.8, duration: 181, platforms: ["디즈니+"], description: "타노스에게 패배한 어벤져스가 잃어버린 동료들을 되찾기 위해 시간 여행에 나서는 MCU의 집대성.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "10년간의 MCU 서사를 완벽하게 마무리한 대작" },
  { titleKR: "라라랜드", titleEN: "La La Land", year: 2016, director: "데이미언 셔젤", genres: ["로맨스", "뮤지컬"], country: "미국", rating: 9.0, duration: 128, platforms: ["넷플릭스", "왓챠"], description: "LA에서 꿈을 좇는 재즈 피아니스트와 배우 지망생의 사랑과 꿈의 이야기. 아름다운 음악과 영상미.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "꿈과 사랑 사이의 선택에 가슴이 아려온다" },
  { titleKR: "탑건: 매버릭", titleEN: "Top Gun: Maverick", year: 2022, director: "조셉 코신스키", genres: ["액션", "드라마"], country: "미국", rating: 8.8, duration: 130, platforms: ["넷플릭스"], description: "전설의 파일럿 매버릭이 젊은 조종사들을 훈련시키며 불가능한 임무에 도전하는 이야기. 36년 만의 속편.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "압도적인 공중 액션이 극장 밖에서도 짜릿하다" },
  { titleKR: "오펜하이머", titleEN: "Oppenheimer", year: 2023, director: "크리스토퍼 놀란", genres: ["드라마"], country: "미국", rating: 9.0, duration: 180, platforms: ["넷플릭스"], description: "원자폭탄을 개발한 물리학자 오펜하이머의 일대기. 과학과 도덕 사이의 갈등을 그린 놀란의 역작.", moods: ["혼자"], recommendReason: "인류 역사를 바꾼 한 과학자의 무게감을 느낄 수 있다" },
  { titleKR: "노트북", titleEN: "The Notebook", year: 2004, director: "닉 카사베츠", genres: ["로맨스", "드라마"], country: "미국", rating: 8.5, duration: 123, platforms: ["넷플릭스", "왓챠"], description: "여름날의 첫사랑, 이별, 그리고 재회. 노아와 앨리의 아름다운 사랑 이야기. 로맨스 영화의 정석.", moods: ["데이트", "우울할 때"], recommendReason: "순수한 사랑의 아름다움을 느끼게 해주는 로맨스의 정석" },
  { titleKR: "타이타닉", titleEN: "Titanic", year: 1997, director: "제임스 카메론", genres: ["로맨스", "드라마"], country: "미국", rating: 9.0, duration: 194, platforms: ["디즈니+", "넷플릭스"], description: "침몰하는 타이타닉호 위에서 피어난 잭과 로즈의 비극적 사랑. 역사상 가장 위대한 로맨스 영화 중 하나.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "시대를 초월한 불멸의 러브 스토리" },
  { titleKR: "매트릭스", titleEN: "The Matrix", year: 1999, director: "워쇼스키 자매", genres: ["SF", "액션"], country: "미국", rating: 9.2, duration: 136, platforms: ["넷플릭스", "왓챠"], description: "현실이 가상이라는 진실을 알게 된 네오가 기계와의 전쟁에 뛰어드는 SF 액션의 교과서.", moods: ["심심할 때", "혼자", "밤에 못 잘 때"], recommendReason: "SF 영화의 패러다임을 바꾼 혁명적 걸작" },
  { titleKR: "위대한 쇼맨", titleEN: "The Greatest Showman", year: 2017, director: "마이클 그레이시", genres: ["뮤지컬", "드라마"], country: "미국", rating: 8.0, duration: 105, platforms: ["디즈니+", "넷플릭스"], description: "서커스의 전설 P.T. 바넘의 이야기를 화려한 뮤지컬로 그린 작품. 중독성 있는 OST가 매력적.", moods: ["신날 때", "가족과", "데이트"], recommendReason: "화려한 무대와 감동적인 음악이 기분을 UP 시켜준다" },
  { titleKR: "겨울왕국", titleEN: "Frozen", year: 2013, director: "크리스 벅", genres: ["애니메이션", "판타지", "뮤지컬"], country: "미국", rating: 8.0, duration: 102, platforms: ["디즈니+"], description: "얼음의 마법을 가진 엘사 여왕과 동생 안나의 모험. Let It Go는 전 세계적 히트곡이 되었다.", moods: ["가족과", "신날 때", "우울할 때"], recommendReason: "온 가족이 함께 즐길 수 있는 디즈니 애니메이션" },
  { titleKR: "인사이드 아웃", titleEN: "Inside Out", year: 2015, director: "피트 닥터", genres: ["애니메이션", "코미디", "드라마"], country: "미국", rating: 8.8, duration: 95, platforms: ["디즈니+"], description: "11살 소녀 라일리의 머릿속 감정들 - 기쁨, 슬픔, 버럭, 까칠, 소심의 모험. 감정에 대한 깊은 통찰.", moods: ["가족과", "우울할 때", "혼자"], recommendReason: "모든 감정이 소중하다는 것을 깨닫게 해주는 명작" },
  { titleKR: "코코", titleEN: "Coco", year: 2017, director: "리 언크리치", genres: ["애니메이션", "판타지"], country: "미국", rating: 9.0, duration: 105, platforms: ["디즈니+"], description: "음악을 사랑하는 소년 미구엘이 죽은 자의 세계에서 가족의 비밀을 발견하는 이야기. 감동적인 가족애.", moods: ["가족과", "우울할 때"], recommendReason: "가족의 소중함을 다시 느끼게 해주는 감동의 애니메이션" },
  { titleKR: "업", titleEN: "Up", year: 2009, director: "피트 닥터", genres: ["애니메이션", "코미디"], country: "미국", rating: 8.5, duration: 96, platforms: ["디즈니+"], description: "아내와의 약속을 지키기 위해 풍선을 달고 남미로 떠나는 78세 칼 할아버지의 모험.", moods: ["가족과", "우울할 때", "혼자"], recommendReason: "첫 10분 만에 눈물을 흘리게 만드는 픽사의 걸작" },
  { titleKR: "주토피아", titleEN: "Zootopia", year: 2016, director: "바이런 하워드", genres: ["애니메이션", "코미디"], country: "미국", rating: 8.3, duration: 108, platforms: ["디즈니+"], description: "동물들이 사는 도시 주토피아에서 토끼 경찰 주디가 여우 닉과 함께 사건을 해결하는 이야기.", moods: ["가족과", "심심할 때", "신날 때"], recommendReason: "재미와 메시지를 모두 잡은 디즈니 애니메이션" },
  { titleKR: "조커", titleEN: "Joker", year: 2019, director: "토드 필립스", genres: ["드라마", "스릴러", "범죄"], country: "미국", rating: 8.8, duration: 122, platforms: ["넷플릭스", "왓챠"], description: "사회에서 소외된 코미디언 아서 플렉이 광기의 빌런 조커로 변해가는 과정. 호아킨 피닉스의 압도적 연기.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "한 인간이 광기로 빠져드는 과정이 충격적이다" },
  { titleKR: "그래비티", titleEN: "Gravity", year: 2013, director: "알폰소 쿠아론", genres: ["SF", "스릴러"], country: "미국", rating: 8.3, duration: 91, platforms: ["넷플릭스"], description: "우주 공간에서 고립된 우주비행사의 생존기. 우주의 광활함과 고독을 압도적인 영상으로 담아낸 작품.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "우주의 고독 속에서 살아남으려는 의지가 감동적이다" },
  { titleKR: "위플래쉬", titleEN: "Whiplash", year: 2014, director: "데이미언 셔젤", genres: ["드라마"], country: "미국", rating: 9.0, duration: 107, platforms: ["넷플릭스", "왓챠"], description: "재즈 드러머 앤드류와 악마 같은 교수 플레처의 극한 대결. 완벽을 향한 집착과 광기를 그린 걸작.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "완벽을 향한 집념과 광기에 전율하게 된다" },
  { titleKR: "기묘한 이야기", titleEN: "Get Out", year: 2017, director: "조던 필", genres: ["공포", "스릴러"], country: "미국", rating: 8.5, duration: 104, platforms: ["넷플릭스"], description: "흑인 남자 크리스가 백인 여자친구의 가족을 만나러 갔다가 겪는 공포. 인종 차별을 호러로 풀어낸 독창적 작품.", moods: ["밤에 못 잘 때", "혼자"], recommendReason: "사회적 메시지와 공포가 완벽하게 결합된 걸작" },
  { titleKR: "캐치 미 이프 유 캔", titleEN: "Catch Me If You Can", year: 2002, director: "스티븐 스필버그", genres: ["범죄", "드라마", "코미디"], country: "미국", rating: 8.5, duration: 141, platforms: ["넷플릭스", "왓챠"], description: "10대 천재 사기꾼 프랭크 애버그네일의 실화. FBI 요원과의 쫓고 쫓기는 유쾌한 범죄 드라마.", moods: ["심심할 때", "친구와"], recommendReason: "실화라는 게 믿기지 않는 유쾌한 사기극" },
  { titleKR: "글래디에이터", titleEN: "Gladiator", year: 2000, director: "리들리 스콧", genres: ["액션", "드라마"], country: "미국", rating: 8.8, duration: 155, platforms: ["넷플릭스"], description: "로마 장군에서 검투사로 전락한 막시무스의 복수극. 러셀 크로우의 카리스마 넘치는 연기가 돋보이는 역사 대작.", moods: ["심심할 때", "혼자"], recommendReason: "장엄한 로마 시대를 배경으로 한 복수와 명예의 서사시" },
  { titleKR: "레버넌트: 죽음에서 돌아온 자", titleEN: "The Revenant", year: 2015, director: "알레한드로 이냐리투", genres: ["드라마", "액션"], country: "미국", rating: 8.5, duration: 156, platforms: ["디즈니+", "넷플릭스"], description: "곰에게 공격받고 동료에게 배신당한 탐험가의 생존과 복수. 디카프리오의 첫 아카데미상 수상작.", moods: ["혼자"], recommendReason: "극한의 생존 의지와 자연의 경이로움에 압도된다" },
  { titleKR: "어바웃 타임", titleEN: "About Time", year: 2013, director: "리처드 커티스", genres: ["로맨스", "코미디", "판타지"], country: "미국", rating: 8.8, duration: 123, platforms: ["넷플릭스", "왓챠"], description: "시간 여행 능력을 가진 청년 팀이 사랑과 인생의 소중함을 깨달아가는 이야기. 웃음과 감동이 가득한 로맨스.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "평범한 하루하루가 얼마나 소중한지 깨닫게 해준다" },
  { titleKR: "소울", titleEN: "Soul", year: 2020, director: "피트 닥터", genres: ["애니메이션", "코미디"], country: "미국", rating: 8.5, duration: 100, platforms: ["디즈니+"], description: "재즈 피아니스트 조가 사후 세계에서 영혼 22번과 함께 '삶의 불꽃'을 찾아가는 철학적 애니메이션.", moods: ["혼자", "우울할 때", "가족과"], recommendReason: "삶의 의미에 대해 깊이 생각하게 만드는 픽사 걸작" },
  { titleKR: "월-E", titleEN: "WALL-E", year: 2008, director: "앤드류 스탠턴", genres: ["애니메이션", "SF", "로맨스"], country: "미국", rating: 8.8, duration: 98, platforms: ["디즈니+"], description: "인류가 떠난 지구에서 혼자 쓰레기를 정리하는 로봇 월-E의 사랑 이야기. 대사 없이도 감동을 전하는 걸작.", moods: ["혼자", "우울할 때", "데이트"], recommendReason: "로봇의 순수한 사랑이 마음을 따뜻하게 녹여준다" },
  { titleKR: "가디언즈 오브 갤럭시", titleEN: "Guardians of the Galaxy", year: 2014, director: "제임스 건", genres: ["SF", "액션", "코미디"], country: "미국", rating: 8.5, duration: 121, platforms: ["디즈니+"], description: "은하계의 어울리지 않는 다섯 멤버가 팀을 이루어 우주를 구하는 이야기. 유머와 음악이 매력적인 MCU 작품.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "신나는 올드팝과 유쾌한 캐릭터들이 기분을 좋게 만든다" },
  { titleKR: "스파이더맨: 뉴 유니버스", titleEN: "Spider-Man: Into the Spider-Verse", year: 2018, director: "밥 페르세케티", genres: ["애니메이션", "액션", "SF"], country: "미국", rating: 9.0, duration: 117, platforms: ["넷플릭스"], description: "평범한 소년 마일스가 여러 차원의 스파이더맨들과 함께 세상을 구하는 이야기. 혁신적인 애니메이션 스타일.", moods: ["심심할 때", "신날 때", "혼자"], recommendReason: "애니메이션의 새로운 가능성을 보여준 혁신적 작품" },
  { titleKR: "듄", titleEN: "Dune", year: 2021, director: "드니 빌뇌브", genres: ["SF", "드라마"], country: "미국", rating: 8.5, duration: 155, platforms: ["넷플릭스", "왓챠"], description: "사막 행성 아라키스를 배경으로 한 우주적 스케일의 서사시. 하우스 아트레이데스의 폴의 운명적 여정.", moods: ["혼자", "심심할 때"], recommendReason: "압도적인 스케일과 영상미가 숨을 멎게 한다" },
  { titleKR: "듄: 파트 2", titleEN: "Dune: Part Two", year: 2024, director: "드니 빌뇌브", genres: ["SF", "액션", "드라마"], country: "미국", rating: 8.8, duration: 166, platforms: ["넷플릭스"], description: "프레멘과 함께 하카넨에 맞서 싸우는 폴 아트레이데스의 예언적 여정. 장엄한 전투 장면이 압권.", moods: ["혼자", "심심할 때"], recommendReason: "SF 서사시의 완벽한 두 번째 장을 경험할 수 있다" },
  { titleKR: "그랜드 부다페스트 호텔", titleEN: "The Grand Budapest Hotel", year: 2014, director: "웨스 앤더슨", genres: ["코미디", "드라마"], country: "미국", rating: 8.5, duration: 99, platforms: ["디즈니+", "왓챠"], description: "유럽의 전설적인 호텔 컨시어지 구스타브와 로비보이 제로의 모험. 웨스 앤더슨 특유의 대칭적 영상미.", moods: ["혼자", "데이트"], recommendReason: "독특한 미장센과 유머가 어우러진 예술적 코미디" },
  { titleKR: "보헤미안 랩소디", titleEN: "Bohemian Rhapsody", year: 2018, director: "브라이언 싱어", genres: ["드라마", "뮤지컬"], country: "미국", rating: 8.5, duration: 134, platforms: ["디즈니+", "넷플릭스"], description: "전설의 록밴드 퀸의 보컬 프레디 머큐리의 일대기. 라이브 에이드 공연 장면은 영화사에 남을 명장면.", moods: ["신날 때", "혼자", "우울할 때"], recommendReason: "프레디 머큐리의 음악과 삶에 전율하게 된다" },
  { titleKR: "라이온 킹", titleEN: "The Lion King", year: 1994, director: "로저 알러스", genres: ["애니메이션", "드라마"], country: "미국", rating: 8.8, duration: 88, platforms: ["디즈니+"], description: "아프리카 대초원의 사자 왕자 심바의 성장과 귀환 이야기. 디즈니 애니메이션의 최고 걸작 중 하나.", moods: ["가족과", "우울할 때", "신날 때"], recommendReason: "세대를 초월하여 사랑받는 디즈니의 불멸의 명작" },
  { titleKR: "토이 스토리", titleEN: "Toy Story", year: 1995, director: "존 래시터", genres: ["애니메이션", "코미디"], country: "미국", rating: 8.5, duration: 81, platforms: ["디즈니+"], description: "장난감들이 살아 움직이는 세계. 카우보이 우디와 우주 비행사 버즈의 우정 이야기. 세계 최초 3D 장편 애니메이션.", moods: ["가족과", "심심할 때"], recommendReason: "모든 세대가 함께 즐길 수 있는 애니메이션의 고전" },
  { titleKR: "기생충 (영어판)", titleEN: "Parasite", year: 2019, director: "봉준호", genres: ["드라마", "스릴러"], country: "미국", rating: 9.5, duration: 132, platforms: ["넷플릭스"], description: "아카데미 작품상을 수상한 봉준호 감독의 걸작. 계급 간의 갈등을 블랙코미디로 풀어낸 작품.", moods: ["혼자", "친구와"], recommendReason: "비영어권 최초 아카데미 작품상의 역사를 체험하자" },
  { titleKR: "세 얼간이", titleEN: "3 Idiots", year: 2009, director: "라지쿠마르 히라니", genres: ["코미디", "드라마"], country: "기타", rating: 9.0, duration: 170, platforms: ["넷플릭스", "왓챠"], description: "인도 명문 공대의 세 친구가 보여주는 웃음, 감동, 교육에 대한 성찰. 인도 영화 역대 최고 흥행작 중 하나.", moods: ["친구와", "우울할 때", "가족과"], recommendReason: "웃고 울며 삶의 의미를 깨닫게 해주는 명작" },
  { titleKR: "이터널 선샤인", titleEN: "Eternal Sunshine of the Spotless Mind", year: 2004, director: "미셸 공드리", genres: ["로맨스", "SF", "드라마"], country: "미국", rating: 9.0, duration: 108, platforms: ["왓챠"], description: "헤어진 연인의 기억을 지우는 시술을 받은 남녀의 이야기. 기억과 사랑에 대한 철학적 로맨스.", moods: ["혼자", "우울할 때", "밤에 못 잘 때"], recommendReason: "사랑과 기억에 대한 가장 아름다운 영화" },
  { titleKR: "배트맨 비긴즈", titleEN: "Batman Begins", year: 2005, director: "크리스토퍼 놀란", genres: ["액션", "드라마"], country: "미국", rating: 8.3, duration: 140, platforms: ["넷플릭스"], description: "브루스 웨인이 배트맨이 되기까지의 여정을 그린 다크 나이트 시리즈의 시작. 놀란의 리얼리즘 히어로물.", moods: ["심심할 때", "혼자"], recommendReason: "슈퍼히어로 영화에 리얼리즘을 더한 혁신적 작품" },
  { titleKR: "해리 포터와 마법사의 돌", titleEN: "Harry Potter and the Sorcerer's Stone", year: 2001, director: "크리스 콜럼버스", genres: ["판타지", "드라마"], country: "미국", rating: 8.3, duration: 152, platforms: ["넷플릭스", "왓챠"], description: "마법 학교 호그와트에 입학한 해리 포터의 첫 번째 모험. 전 세계 수억 명을 매료시킨 판타지 시리즈의 시작.", moods: ["가족과", "심심할 때", "혼자"], recommendReason: "마법 세계로의 초대장, 모든 세대의 판타지 고전" },
  { titleKR: "반지의 제왕: 반지 원정대", titleEN: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, director: "피터 잭슨", genres: ["판타지", "액션", "드라마"], country: "미국", rating: 9.3, duration: 178, platforms: ["넷플릭스"], description: "절대 반지를 파괴하기 위해 모험을 떠나는 반지 원정대의 이야기. 판타지 영화의 절대적 걸작.", moods: ["심심할 때", "혼자"], recommendReason: "판타지 영화의 정점, 중간계의 세계에 빠져들게 된다" },
  { titleKR: "기묘한 가족", titleEN: "Everything Everywhere All at Once", year: 2022, director: "다니엘 콴", genres: ["SF", "액션", "코미디"], country: "미국", rating: 8.8, duration: 139, platforms: ["넷플릭스"], description: "세탁소를 운영하는 중국계 이민자 에블린이 멀티버스를 넘나들며 세상을 구하는 이야기. 아카데미 7관왕.", moods: ["심심할 때", "혼자", "가족과"], recommendReason: "기발한 멀티버스 속에 담긴 가족 사랑이 감동적이다" },

  // ── 일본 영화 (20+) ──
  { titleKR: "센과 치히로의 행방불명", titleEN: "Spirited Away", year: 2001, director: "미야자키 하야오", genres: ["애니메이션", "판타지"], country: "일본", rating: 9.5, duration: 125, platforms: ["넷플릭스"], description: "신비한 세계에 빠진 소녀 치히로가 부모를 구하기 위해 목욕탕에서 일하며 성장하는 이야기. 아카데미 장편 애니메이션상 수상.", moods: ["혼자", "가족과", "우울할 때"], recommendReason: "미야자키 하야오의 상상력이 만들어낸 불후의 걸작" },
  { titleKR: "너의 이름은.", titleEN: "Your Name", year: 2016, director: "신카이 마코토", genres: ["애니메이션", "로맨스", "판타지"], country: "일본", rating: 9.0, duration: 106, platforms: ["넷플릭스"], description: "서로의 몸이 바뀌는 소년과 소녀의 시공간을 초월한 사랑. 압도적인 영상미와 감동적인 스토리.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "아름다운 영상과 음악이 가슴을 울리는 로맨스" },
  { titleKR: "하울의 움직이는 성", titleEN: "Howl's Moving Castle", year: 2004, director: "미야자키 하야오", genres: ["애니메이션", "판타지", "로맨스"], country: "일본", rating: 8.8, duration: 119, platforms: ["넷플릭스"], description: "저주로 할머니가 된 소녀 소피가 마법사 하울의 움직이는 성에서 살게 되는 이야기. 반전쟁 메시지를 담은 작품.", moods: ["데이트", "가족과", "혼자"], recommendReason: "지브리의 마법 같은 세계관에 빠져드는 힐링 애니" },
  { titleKR: "원피스 필름 레드", titleEN: "One Piece Film: Red", year: 2022, director: "다니구치 고로", genres: ["애니메이션", "액션"], country: "일본", rating: 7.5, duration: 115, platforms: ["넷플릭스"], description: "전설의 가수 우타의 라이브에 모인 루피 일행이 거대한 음모에 맞서는 이야기. 원피스 극장판 역대 최고 흥행.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "원피스 팬이라면 반드시 봐야 할 최고의 극장판" },
  { titleKR: "더 퍼스트 슬램덩크", titleEN: "The First Slam Dunk", year: 2022, director: "이노우에 다케히코", genres: ["애니메이션", "드라마"], country: "일본", rating: 9.0, duration: 124, platforms: ["넷플릭스"], description: "북산 고교 농구부의 산왕공고전을 그린 슬램덩크의 극장판. 원작자가 직접 감독한 화제작.", moods: ["신날 때", "친구와", "혼자"], recommendReason: "만화 역사의 전설을 스크린에서 만나는 감동" },
  { titleKR: "스즈메의 문단속", titleEN: "Suzume", year: 2022, director: "신카이 마코토", genres: ["애니메이션", "판타지"], country: "일본", rating: 8.3, duration: 122, platforms: ["넷플릭스"], description: "재앙의 문을 닫기 위해 일본 전역을 여행하는 소녀 스즈메의 모험. 신카이 마코토의 재난 3부작 완결편.", moods: ["혼자", "심심할 때", "데이트"], recommendReason: "아름다운 영상미와 여행의 설렘이 가득한 모험" },
  { titleKR: "날씨의 아이", titleEN: "Weathering with You", year: 2019, director: "신카이 마코토", genres: ["애니메이션", "로맨스", "판타지"], country: "일본", rating: 8.0, duration: 112, platforms: ["넷플릭스"], description: "비가 멈추지 않는 도쿄에서 날씨를 맑게 하는 소녀를 만난 소년의 이야기. 너의 이름은 후속작.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "사랑을 위해 세상을 선택하는 용기에 감동받는다" },
  { titleKR: "이웃집 토토로", titleEN: "My Neighbor Totoro", year: 1988, director: "미야자키 하야오", genres: ["애니메이션", "판타지"], country: "일본", rating: 8.8, duration: 86, platforms: ["넷플릭스"], description: "시골로 이사한 사츠키와 메이 자매가 숲의 정령 토토로를 만나는 이야기. 지브리의 마스코트가 된 작품.", moods: ["가족과", "우울할 때", "혼자"], recommendReason: "순수한 어린 시절의 설렘을 다시 느끼게 해준다" },
  { titleKR: "모노노케 히메", titleEN: "Princess Mononoke", year: 1997, director: "미야자키 하야오", genres: ["애니메이션", "판타지", "액션"], country: "일본", rating: 9.0, duration: 134, platforms: ["넷플릭스"], description: "인간과 자연의 대립을 그린 미야자키 하야오의 서사시. 숲의 공주 산과 청년 아시타카의 이야기.", moods: ["혼자", "심심할 때"], recommendReason: "자연과 인간의 공존에 대해 깊이 생각하게 만든다" },
  { titleKR: "천공의 성 라퓨타", titleEN: "Castle in the Sky", year: 1986, director: "미야자키 하야오", genres: ["애니메이션", "판타지", "액션"], country: "일본", rating: 8.5, duration: 124, platforms: ["넷플릭스"], description: "하늘에 떠 있는 전설의 성 라퓨타를 찾아 떠나는 소년 파즈와 소녀 시타의 모험.", moods: ["가족과", "심심할 때", "혼자"], recommendReason: "지브리 모험 애니메이션의 원점이자 정수" },
  { titleKR: "바람이 분다", titleEN: "The Wind Rises", year: 2013, director: "미야자키 하야오", genres: ["애니메이션", "드라마", "로맨스"], country: "일본", rating: 8.3, duration: 126, platforms: ["넷플릭스"], description: "제로센 전투기를 설계한 호리코시 지로의 일대기를 그린 미야자키 하야오의 은퇴작(이었던 작품).", moods: ["혼자", "우울할 때"], recommendReason: "꿈을 좇는 것의 아름다움과 비극을 담은 수작" },
  { titleKR: "벼랑 위의 포뇨", titleEN: "Ponyo", year: 2008, director: "미야자키 하야오", genres: ["애니메이션", "판타지"], country: "일본", rating: 7.8, duration: 101, platforms: ["넷플릭스"], description: "인간이 되고 싶은 금붕어 공주 포뇨와 소년 소스케의 우정 이야기. 아이들에게 추천하는 지브리 입문작.", moods: ["가족과", "심심할 때"], recommendReason: "아이들과 함께 보기에 완벽한 따뜻한 지브리 애니" },
  { titleKR: "극장판 귀멸의 칼날: 무한열차편", titleEN: "Demon Slayer: Mugen Train", year: 2020, director: "소토자키 하루오", genres: ["애니메이션", "액션"], country: "일본", rating: 8.3, duration: 117, platforms: ["넷플릭스"], description: "탄지로 일행이 무한열차에서 하급 상현 엔무와 대결하는 이야기. 렌고쿠의 활약이 인상적인 작품.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "화려한 액션과 가슴 뜨거운 감동이 공존하는 애니" },
  { titleKR: "극장판 주술회전 0", titleEN: "Jujutsu Kaisen 0", year: 2021, director: "박성후", genres: ["애니메이션", "액션"], country: "일본", rating: 8.0, duration: 105, platforms: ["넷플릭스"], description: "특급 저주에 씌인 소년 오카코츠 유타가 주술고전에 입학하여 성장하는 이야기. 주술회전의 프리퀄.", moods: ["심심할 때", "신날 때"], recommendReason: "주술회전 팬이라면 놓칠 수 없는 전일담" },
  { titleKR: "언어의 정원", titleEN: "The Garden of Words", year: 2013, director: "신카이 마코토", genres: ["애니메이션", "로맨스", "드라마"], country: "일본", rating: 7.8, duration: 46, platforms: ["넷플릭스"], description: "비 오는 날에만 만나는 소년과 여성의 풋풋한 교감. 신카이 마코토의 46분 단편이지만 깊은 여운.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "짧지만 깊은 감동을 주는 아름다운 단편 애니" },
  { titleKR: "그대들은 어떻게 살 것인가", titleEN: "The Boy and the Heron", year: 2023, director: "미야자키 하야오", genres: ["애니메이션", "판타지"], country: "일본", rating: 8.0, duration: 124, platforms: ["넷플릭스"], description: "어머니를 잃은 소년 마히토가 신비한 탑에서 이세계 모험을 떠나는 이야기. 미야자키 하야오의 마지막(?) 작품.", moods: ["혼자", "가족과"], recommendReason: "거장의 마지막 메시지를 담은 신비로운 모험" },
  { titleKR: "시간을 달리는 소녀", titleEN: "The Girl Who Leapt Through Time", year: 2006, director: "호소다 마모루", genres: ["애니메이션", "SF", "로맨스"], country: "일본", rating: 8.3, duration: 98, platforms: ["왓챠"], description: "시간 도약 능력을 얻은 고교생 마코토가 청춘의 소중함을 깨닫는 이야기. 호소다 마모루의 출세작.", moods: ["데이트", "혼자", "우울할 때"], recommendReason: "청춘의 시간이 얼마나 소중한지 느끼게 해준다" },
  { titleKR: "늑대아이", titleEN: "Wolf Children", year: 2012, director: "호소다 마모루", genres: ["애니메이션", "드라마", "판타지"], country: "일본", rating: 8.5, duration: 117, platforms: ["왓챠"], description: "늑대인간과 사랑에 빠진 여대생이 두 아이를 키우는 이야기. 어머니의 헌신과 사랑을 담은 감동작.", moods: ["가족과", "우울할 때", "혼자"], recommendReason: "어머니의 무한한 사랑에 눈물이 멈추지 않는다" },

  // ── 유럽 영화 (15+) ──
  { titleKR: "아멜리에", titleEN: "Amelie", year: 2001, director: "장피에르 주네", genres: ["로맨스", "코미디"], country: "유럽", rating: 8.8, duration: 122, platforms: ["왓챠"], description: "파리의 카페 종업원 아멜리가 주변 사람들을 몰래 행복하게 만들어주는 이야기. 프랑스 감성 영화의 정수.", moods: ["데이트", "우울할 때", "혼자"], recommendReason: "파리의 낭만과 따뜻한 유머가 마음을 치유해준다" },
  { titleKR: "시네마 천국", titleEN: "Cinema Paradiso", year: 1988, director: "주세페 토르나토레", genres: ["드라마", "로맨스"], country: "유럽", rating: 9.2, duration: 155, platforms: ["왓챠"], description: "시칠리아 작은 마을의 영화관에서 자란 소년 토토의 성장 이야기. 영화에 대한 사랑이 가득한 명작.", moods: ["혼자", "우울할 때"], recommendReason: "영화를 사랑하는 사람이라면 반드시 봐야 할 걸작" },
  { titleKR: "인생은 아름다워", titleEN: "Life Is Beautiful", year: 1997, director: "로베르토 베니니", genres: ["드라마", "코미디"], country: "유럽", rating: 9.5, duration: 116, platforms: ["왓챠", "넷플릭스"], description: "나치 수용소에서 아들을 지키기 위해 모든 것을 게임이라고 속이는 아버지의 이야기. 웃음 뒤에 숨은 깊은 감동.", moods: ["가족과", "우울할 때", "혼자"], recommendReason: "아버지의 사랑이 얼마나 위대한지 느끼게 해준다" },
  { titleKR: "레옹", titleEN: "Leon: The Professional", year: 1994, director: "뤽 베송", genres: ["액션", "드라마", "스릴러"], country: "유럽", rating: 9.2, duration: 110, platforms: ["넷플릭스", "왓챠"], description: "고독한 청부업자 레옹과 가족을 잃은 소녀 마틸다의 특별한 인연. 장 르노와 나탈리 포트만의 명연기.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "고독한 킬러와 소녀의 관계가 마음을 울리는 명작" },
  { titleKR: "그랑블루", titleEN: "The Big Blue", year: 1988, director: "뤽 베송", genres: ["드라마", "로맨스"], country: "유럽", rating: 8.3, duration: 168, platforms: ["왓챠"], description: "프리다이빙 세계챔피언 자크 마욜의 실화를 바탕으로 한 바다와 우정의 이야기. 아름다운 바다 영상이 압권.", moods: ["혼자", "우울할 때"], recommendReason: "바다의 신비로움과 인간의 한계에 대한 아름다운 영화" },
  { titleKR: "위대한 독재자", titleEN: "The Great Dictator", year: 1940, director: "찰리 채플린", genres: ["코미디", "드라마"], country: "유럽", rating: 9.0, duration: 125, platforms: ["왓챠"], description: "찰리 채플린이 히틀러를 풍자한 코미디 걸작. 마지막 연설은 영화사상 가장 감동적인 장면 중 하나.", moods: ["혼자"], recommendReason: "80년이 넘은 영화지만 여전히 울림을 주는 명연설" },
  { titleKR: "올드보이 (원작)", titleEN: "Oldboy", year: 2003, director: "박찬욱", genres: ["스릴러", "드라마"], country: "한국", rating: 9.0, duration: 120, platforms: ["왓챠"], description: "복수 3부작의 두 번째 작품. 15년 감금의 이유를 찾아가는 충격적 스릴러.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "반전의 충격이 오래도록 여운을 남기는 걸작" },
  { titleKR: "양들의 침묵", titleEN: "The Silence of the Lambs", year: 1991, director: "조나단 드미", genres: ["스릴러", "범죄"], country: "미국", rating: 9.0, duration: 118, platforms: ["넷플릭스", "왓챠"], description: "FBI 수습요원 클라리스가 연쇄살인범을 잡기 위해 천재적 식인 살인마 한니발 렉터의 도움을 구하는 이야기.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "한니발 렉터의 소름 끼치는 카리스마에 전율하게 된다" },
  { titleKR: "빠삐용", titleEN: "Papillon", year: 1973, director: "프랭클린 J. 샤프너", genres: ["드라마"], country: "미국", rating: 8.5, duration: 150, platforms: ["왓챠"], description: "억울하게 수감된 남자가 악명 높은 감옥에서 탈출을 시도하는 실화. 자유를 향한 인간의 의지를 그린 명작.", moods: ["혼자"], recommendReason: "자유를 향한 불굴의 의지가 감동을 준다" },
  { titleKR: "비포 선라이즈", titleEN: "Before Sunrise", year: 1995, director: "리처드 링클레이터", genres: ["로맨스", "드라마"], country: "유럽", rating: 8.8, duration: 101, platforms: ["왓챠"], description: "비엔나에서 하룻밤을 보내는 미국 청년과 프랑스 여성의 대화 로맨스. 비포 3부작의 시작.", moods: ["데이트", "혼자", "밤에 못 잘 때"], recommendReason: "대화만으로 사랑에 빠지는 가장 로맨틱한 영화" },
  { titleKR: "나르니아 연대기", titleEN: "The Chronicles of Narnia", year: 2005, director: "앤드류 아담슨", genres: ["판타지", "액션"], country: "미국", rating: 7.5, duration: 143, platforms: ["디즈니+"], description: "옷장 너머 마법의 나라 나르니아에서 펼쳐지는 네 남매의 모험. C.S. 루이스의 고전 판타지 원작.", moods: ["가족과", "심심할 때"], recommendReason: "온 가족이 함께 즐길 수 있는 클래식 판타지" },
  { titleKR: "택시 드라이버", titleEN: "Taxi Driver", year: 1976, director: "마틴 스코세이지", genres: ["드라마", "스릴러"], country: "미국", rating: 9.0, duration: 114, platforms: ["왓챠", "넷플릭스"], description: "베트남전 참전 후 택시 운전사가 된 트래비스의 광기와 고독. 로버트 드 니로의 전설적 연기.", moods: ["혼자", "밤에 못 잘 때"], recommendReason: "도시의 고독과 광기를 그린 뉴 할리우드의 정수" },
  { titleKR: "미드나잇 인 파리", titleEN: "Midnight in Paris", year: 2011, director: "우디 앨런", genres: ["로맨스", "코미디", "판타지"], country: "유럽", rating: 8.0, duration: 94, platforms: ["왓챠"], description: "파리에서 밤마다 1920년대로 시간 여행하는 작가 길의 이야기. 파리의 아름다움과 향수가 가득.", moods: ["데이트", "혼자", "우울할 때"], recommendReason: "파리의 밤과 황금시대의 낭만에 빠져드는 영화" },
  { titleKR: "완벽한 하루", titleEN: "Perfect Days", year: 2023, director: "빔 벤더스", genres: ["드라마"], country: "유럽", rating: 8.3, duration: 123, platforms: ["왓챠"], description: "도쿄에서 공중화장실을 청소하는 남자 히라야마의 평범하지만 아름다운 일상. 야쿠쇼 코지 주연.", moods: ["혼자", "우울할 때"], recommendReason: "평범한 일상의 아름다움을 재발견하게 해주는 영화" },
  { titleKR: "킹스맨: 시크릿 에이전트", titleEN: "Kingsman: The Secret Service", year: 2014, director: "매튜 본", genres: ["액션", "코미디"], country: "유럽", rating: 8.3, duration: 129, platforms: ["디즈니+", "넷플릭스"], description: "영국 비밀 스파이 조직 킹스맨에 스카우트된 불량 청년 에그시의 성장 이야기. 스타일리시한 액션이 매력.", moods: ["심심할 때", "신날 때", "친구와"], recommendReason: "세련된 영국식 유머와 화끈한 액션의 완벽한 조합" },
  { titleKR: "그녀", titleEN: "Her", year: 2013, director: "스파이크 존즈", genres: ["로맨스", "SF", "드라마"], country: "미국", rating: 8.5, duration: 126, platforms: ["왓챠", "넷플릭스"], description: "AI 운영체제 사만다와 사랑에 빠진 외로운 남자 테오도르의 이야기. 현대 사회의 외로움과 사랑을 탐구.", moods: ["혼자", "우울할 때", "밤에 못 잘 때"], recommendReason: "AI 시대의 사랑과 외로움에 대한 아름다운 성찰" },
];

/* ══════════════════════════════════════════
   Scoring / Recommendation Engine
   ══════════════════════════════════════════ */

function scoreMovie(
  movie: Movie,
  mood: Mood | null,
  selectedGenres: Genre[],
  country: Country | null,
  era: Era,
  dur: Duration,
  platform: Platform,
): number {
  let score = 0;

  // Mood match (highest weight)
  if (mood && movie.moods.includes(mood)) score += 40;

  // Genre match
  if (selectedGenres.length > 0) {
    const genreMatches = movie.genres.filter((g) => selectedGenres.includes(g)).length;
    score += genreMatches * 20;
  }

  // Country match
  if (country && movie.country === country) score += 15;

  // Era match
  if (era !== "상관없음") {
    if (era === "최신(2020~)" && movie.year >= 2020) score += 10;
    else if (era === "2010년대" && movie.year >= 2010 && movie.year < 2020) score += 10;
    else if (era === "2000년대" && movie.year >= 2000 && movie.year < 2010) score += 10;
    else if (era === "클래식(~1999)" && movie.year < 2000) score += 10;
  }

  // Duration match
  if (dur !== "상관없음") {
    if (dur === "짧은영화(~100분)" && movie.duration <= 100) score += 8;
    else if (dur === "보통(100~130분)" && movie.duration > 100 && movie.duration <= 130) score += 8;
    else if (dur === "긴영화(130분~)" && movie.duration > 130) score += 8;
  }

  // Platform match
  if (platform !== "상관없음" && movie.platforms.includes(platform)) score += 12;

  // Bonus for high rating
  score += movie.rating * 2;

  // Small random factor for variety
  score += Math.random() * 5;

  return score;
}

/* ══════════════════════════════════════════
   Component
   ══════════════════════════════════════════ */

function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating / 2);
  const halfStar = rating % 2 >= 1;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-400">
      {"★".repeat(fullStars)}
      {halfStar && "½"}
      {"☆".repeat(emptyStars)}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export default function MovieRecommendationPage() {
  const [mood, setMood] = useState<Mood | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [country, setCountry] = useState<Country | null>(null);
  const [era, setEra] = useState<Era>("상관없음");
  const [duration, setDuration] = useState<Duration>("상관없음");
  const [platform, setPlatform] = useState<Platform>("상관없음");
  const [results, setResults] = useState<Movie[] | null>(null);
  const [animating, setAnimating] = useState(false);

  const toggleGenre = useCallback((g: Genre) => {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  }, []);

  const recommend = useCallback(() => {
    setAnimating(true);
    setTimeout(() => {
      const scored = MOVIES.map((m) => ({
        movie: m,
        score: scoreMovie(m, mood, selectedGenres, country, era, duration, platform),
      }));
      scored.sort((a, b) => b.score - a.score);
      setResults(scored.slice(0, 5).map((s) => s.movie));
      setAnimating(false);
    }, 600);
  }, [mood, selectedGenres, country, era, duration, platform]);

  const reset = useCallback(() => {
    setResults(null);
    setMood(null);
    setSelectedGenres([]);
    setCountry(null);
    setEra("상관없음");
    setDuration("상관없음");
    setPlatform("상관없음");
  }, []);

  const canRecommend = mood || selectedGenres.length > 0 || country;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl text-3xl mb-4">
          🎬
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          영화 추천 도우미
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          기분과 취향을 선택하면 도구가 맞춤 영화를 추천해드립니다
        </p>
      </div>

      {!results ? (
        <div className="space-y-6">
          {/* Mood */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">기분 / 상황</h2>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(mood === m ? null : m)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    mood === m
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {MOOD_EMOJI[m]} {m}
                </button>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-1">장르 (다중선택)</h2>
            <p className="text-xs text-gray-400 mb-3">좋아하는 장르를 여러 개 선택할 수 있어요</p>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedGenres.includes(g)
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {GENRE_EMOJI[g]} {g}
                </button>
              ))}
            </div>
          </div>

          {/* Country */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">국가</h2>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(country === c ? null : c)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    country === c
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Era */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">시대</h2>
            <div className="flex flex-wrap gap-2">
              {ERAS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEra(e)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    era === e
                      ? "bg-amber-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">길이</h2>
            <div className="flex flex-wrap gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    duration === d
                      ? "bg-sky-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="calc-card p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">플랫폼</h2>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    platform === p
                      ? "bg-red-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Recommend Button */}
          <button
            onClick={recommend}
            disabled={!canRecommend || animating}
            className={`w-full py-4 rounded-2xl text-base font-bold transition-all ${
              canRecommend
                ? "calc-btn-primary w-full"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {animating ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                도구가 분석 중...
              </span>
            ) : (
              "🎬 영화 추천 도우미받기"
            )}
          </button>
          {!canRecommend && (
            <p className="text-center text-xs text-gray-400">
              기분, 장르, 국가 중 하나 이상을 선택해주세요
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="calc-result-header !rounded-2xl mb-6">
            <p className="text-sm opacity-80 mb-1">조건별 맞춤 추천 결과</p>
            <p className="text-2xl font-bold">TOP 5 영화</p>
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs">
              {mood && <span className="bg-white/20 px-2 py-1 rounded-full">{MOOD_EMOJI[mood]} {mood}</span>}
              {selectedGenres.map((g) => (
                <span key={g} className="bg-white/20 px-2 py-1 rounded-full">{GENRE_EMOJI[g]} {g}</span>
              ))}
              {country && <span className="bg-white/20 px-2 py-1 rounded-full">{country}</span>}
            </div>
          </div>

          {/* Movie Cards */}
          {results.map((movie, idx) => (
            <div
              key={`${movie.titleKR}-${idx}`}
              className="calc-card p-5 animate-fade-in"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 leading-tight">
                    {movie.titleKR}
                    <span className="text-xs text-gray-400 font-normal ml-1.5">
                      {movie.titleEN} ({movie.year})
                    </span>
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                    <span>{movie.director}</span>
                    <span>{movie.duration}분</span>
                    <span>{movie.country}</span>
                    <StarRating rating={movie.rating} />
                  </div>
                </div>
              </div>

              {/* Genre tags */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {movie.genres.map((g) => (
                  <span key={g} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {GENRE_EMOJI[g]} {g}
                  </span>
                ))}
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {movie.platforms.map((p) => (
                  <span key={p} className={`text-xs px-2 py-0.5 rounded-full font-medium ${PLATFORM_COLOR[p] || "bg-gray-100 text-gray-600"}`}>
                    {p}
                  </span>
                ))}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {movie.description}
              </p>

              {/* Recommendation reason */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                <p className="text-xs font-bold text-purple-700 mb-1">🤖 추천 이유</p>
                <p className="text-sm text-purple-600">{movie.recommendReason}</p>
              </div>
            </div>
          ))}

          {/* Retry Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={recommend}
              className="flex-1 calc-btn-primary"
            >
              🔄 다시 추천받기
            </button>
            <button
              onClick={reset}
              className="flex-1 calc-btn-secondary"
            >
              ↩️ 조건 변경하기
            </button>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 space-y-6">
        <div className="calc-seo-card">
          <h2 className="calc-seo-title">영화 추천 도우미 사용법</h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>1. <strong>기분/상황</strong>을 선택하세요 - 지금 기분에 맞는 영화를 추천합니다.</p>
            <p>2. <strong>장르</strong>를 선택하세요 - 여러 장르를 동시에 선택할 수 있습니다.</p>
            <p>3. <strong>국가, 시대, 길이, 플랫폼</strong>을 선택하면 더 정확한 추천을 받을 수 있습니다.</p>
            <p>4. <strong>영화 추천 도우미받기</strong> 버튼을 누르면 맞춤 영화 TOP 5를 추천해드립니다.</p>
            <p>5. 마음에 들지 않으면 <strong>다시 추천받기</strong>를 눌러 새로운 영화를 추천받으세요.</p>
          </div>
        </div>

        <div className="calc-seo-card">
          <h2 className="calc-seo-title">150편 이상의 영화 데이터베이스</h2>
          <div className="text-sm text-gray-600 space-y-2 leading-relaxed">
            <p>한국, 미국, 일본, 유럽 등 다양한 국가의 명작과 최신 영화 150편 이상을 데이터베이스에 보유하고 있습니다.</p>
            <p>기생충, 인터스텔라, 센과 치히로의 행방불명 등 평점이 검증된 영화들만 엄선했습니다.</p>
            <p>넷플릭스, 왓챠, 디즈니+ 등 OTT 플랫폼별 필터링도 지원합니다.</p>
          </div>
        </div>
      </section>

      <RelatedTools current="movie-recommendation" />
    </div>
  );
}
