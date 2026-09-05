import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy", languages: { ko: "/privacy", en: "/en/privacy", "x-default": "/privacy" } },
  title: "개인정보처리방침",
  description: "모두의도구의 로컬 저장소, 선택 쿠키, Google Analytics, 광고 및 외부 데이터 요청 처리 방침입니다.",
  openGraph: { images: ["/og-image.png"], title: "개인정보처리방침 | 모두의도구", description: "도구 입력값과 선택 쿠키의 처리 방식을 확인하세요.", url: "https://modu-dogu.pages.dev/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-gray-700">
      <p className="text-sm font-black tracking-[0.14em] text-[#a93d28]">2026년 9월 5일 개정</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950">개인정보처리방침</h1>
      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="mb-2 text-xl font-black text-gray-950">1. 계정과 도구 입력값</h2><p>모두의도구는 회원가입이나 사용자 프로필을 요구하지 않습니다. 계산기·텍스트·이미지 도구의 입력값은 각 페이지에 별도 설명이 없는 한 브라우저에서 처리하며, 운영자 서버 계정에 저장하지 않습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">2. 필수 브라우저 저장소</h2><p>즐겨찾기, 최근 사용 도구, 게임 기록, 연속 방문 기록과 선택 쿠키 설정을 유지하기 위해 localStorage를 사용합니다. 이 정보는 현재 브라우저에 남으며 브라우저 설정에서 삭제할 수 있습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">3. 선택 쿠키와 방문 통계</h2><p>‘선택 쿠키 허용’을 누른 경우에만 Google Analytics를 불러옵니다. 페이지 경로, 페이지 제목, 도구 시작·완료·공유 같은 사용 이벤트와 Google이 제공하는 기본 기술 정보가 처리될 수 있습니다. 분석용 페이지 주소에서는 쿼리 문자열과 해시를 제거하며 계산·게임 입력값을 분석 매개변수로 보내지 않습니다.</p><p className="mt-2">푸터의 ‘선택 쿠키 설정’에서 언제든 동의를 변경할 수 있습니다. ‘필수 기능만’을 선택하면 이후 분석 이벤트 전송을 중단하고 이 사이트가 설정한 <code>_ga</code> 쿠키 삭제를 시도합니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">4. 광고</h2><p>Google AdSense 식별자가 배포 환경에 설정된 경우에도 선택 쿠키에 동의한 뒤에만 광고 스크립트와 광고 영역을 불러옵니다. 광고가 설정되지 않은 환경에서는 빈 광고 자리를 표시하지 않습니다. 지역별 추가 동의 요건이 필요한 경우 별도의 적합한 동의 절차를 적용합니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">5. 외부 서비스 요청</h2><p>환율 조회, 카카오 지도, 공식 출처 링크처럼 기능상 필요한 경우 해당 외부 서비스로 네트워크 요청이 발생할 수 있습니다. 텔레파시 초대에 입력한 이름과 답은 서버 데이터베이스가 아니라 공유 URL에 포함되므로 링크를 받은 사람과 브라우저 방문 기록에서 확인될 수 있습니다. 민감정보는 입력하지 마세요.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">6. 문의와 변경</h2><p>오류·개인정보 문의는 <a href="https://github.com/imhyuk98/modu-dogu/issues/new" target="_blank" rel="noreferrer" className="font-bold underline">공개 GitHub 이슈</a>로 접수합니다. 개인정보를 이슈에 적지 말고 재현 가능한 가상값으로 바꿔 주세요. 방침이 바뀌면 이 페이지의 개정일을 함께 갱신합니다.</p></section>
      </div>
    </article>
  );
}
