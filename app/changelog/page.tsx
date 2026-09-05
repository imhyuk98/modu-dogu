import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "변경 이력", description: "모두의도구의 계산 기준, 기능, 콘텐츠와 운영 변경 기록입니다.", alternates: { canonical: "/changelog" } };

const changes = [
  { date: "2026-09-05", title: "보안·개인정보·운영 신뢰성 개선", items: ["선택 동의 전 분석·광고 차단 및 분석 URL의 검색어·해시 제거", "금리·유가 자동 갱신 워크플로 복구와 오래된 데이터 경고 추가", "보안 헤더, 의존성 취약점 정리, 오류 화면과 접근성·운영 상태 자동 점검 추가"] },
  { date: "2026-09-04", title: "신뢰성·핵심 도구 개편", items: ["연차 계산을 재직/퇴사·입사일/회계연도 기준으로 분리하고 경계일 검증 추가", "평·㎡·ft² 양방향 변환과 아파트 면적 설명 교정", "4.0/4.3/4.5 학기·누적·목표 GPA 흐름 추가", "고위험 계산기 공통 기준·출처·한계 패널 추가"] },
  { date: "2026-09-04", title: "다국어·상점형 탐색 개편", items: ["영어 도구 24개를 브라우저에서 직접 작동하는 페이지로 개편", "홈과 카테고리 탐색 구조 및 모바일 접근성 개선", "정적 출력·브라우저 회귀 검사 확대"] },
  { date: "2026-03-12", title: "생활 도구 추가", items: ["비밀번호 생성기, 출산예정일, 반려동물 나이 도구 추가"] },
];

export default function ChangelogPage() { return <main className="mx-auto max-w-3xl px-4 py-12 text-gray-700"><p className="text-xs font-black tracking-[0.14em] text-[#a93d28]">CHANGELOG</p><h1 className="mt-2 text-3xl font-black text-gray-950">변경 이력</h1><p className="mt-4 leading-7">기준 변경과 사용자 결과에 영향을 주는 수정부터 기록합니다. 더 자세한 코드 단위 기록은 <a href="https://github.com/imhyuk98/modu-dogu/commits/master" target="_blank" rel="noreferrer" className="font-bold underline">GitHub 커밋</a>에서 확인할 수 있습니다.</p><ol className="mt-8 space-y-6">{changes.map((change) => <li key={`${change.date}-${change.title}`} className="calc-card p-6"><time className="font-mono text-xs font-bold text-[#a93d28]" dateTime={change.date}>{change.date}</time><h2 className="mt-2 text-xl font-bold text-gray-950">{change.title}</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7">{change.items.map((item) => <li key={item}>{item}</li>)}</ul></li>)}</ol><p className="mt-8 text-sm">문제를 발견했다면 <Link href="/feedback" className="font-bold underline">오류 제보 방법</Link>을 확인해 주세요.</p></main>; }
