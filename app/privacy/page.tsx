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
      <p className="text-sm font-black tracking-[0.14em] text-[#a93d28]">2026년 9월 8일 개정</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-950">개인정보처리방침</h1>
      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="mb-2 text-xl font-black text-gray-950">1. 운영자와 적용 범위</h2><p>모두의도구 운영자(imhyuk98)는 회원 계정이나 사용자 프로필을 만들지 않습니다. 별도 안내가 없는 계산기·텍스트·이미지 입력값은 브라우저 안에서 처리되며 운영자 데이터베이스로 전송하거나 저장하지 않습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">2. 브라우저에 저장되는 정보</h2><p>즐겨찾기, 최근 사용 도구, 게임 기록, 연속 방문 기록과 선택 쿠키 설정을 유지하기 위해 localStorage를 사용합니다. 이 정보는 해당 브라우저에만 남고 브라우저 사이트 데이터 삭제 기능으로 즉시 지울 수 있습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">3. 선택 분석 정보와 목적</h2><p>‘선택 쿠키 허용’을 누른 경우에만 Google Analytics를 불러옵니다. 페이지 경로·제목, 도구 시작·완료·공유 이벤트, 브라우저·기기 종류, 대략적인 지역, 언어, 방문 시각과 쿠키 기반 클라이언트 식별자가 서비스 이용 현황 분석과 오류·사용성 개선 목적으로 처리될 수 있습니다. 쿼리 문자열과 해시는 분석 주소에서 제거하며 도구 입력값은 분석 매개변수로 보내지 않습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">4. 보유기간과 파기</h2><p>브라우저 저장 정보는 사용자가 삭제할 때까지 보관됩니다. Google Analytics 이벤트 수준 자료는 속성 설정상 최대 14개월 보관 후 자동 삭제되도록 운영하며, 개인을 직접 식별하지 않는 집계 보고서는 더 오래 남을 수 있습니다. 푸터의 ‘선택 쿠키 설정’에서 ‘필수 기능만’을 선택하면 이후 분석 전송을 중단하고 이 사이트가 설정한 <code>_ga</code> 쿠키 삭제를 시도합니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">5. 국외 처리와 외부 처리자</h2><p>분석에 동의하면 위 분석 정보가 네트워크를 통해 미국 등 Google 인프라가 위치한 국가의 Google LLC로 전송되어 통계 분석과 서비스 운영 목적으로 처리될 수 있습니다. 전송 시점은 동의 후 사이트 이용 시이며 보유기간은 위 기준을 따릅니다. 자세한 처리는 <a href="https://policies.google.com/privacy?hl=ko" target="_blank" rel="noreferrer" className="font-bold underline">Google 개인정보처리방침</a>에서 확인할 수 있습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">6. 광고</h2><p>Google AdSense 식별자가 설정된 경우에도 선택 쿠키에 동의한 뒤에만 광고 스크립트와 광고 영역을 불러옵니다. 광고 과정에서 쿠키·기기 식별자·접속 정보가 Google에 의해 처리될 수 있습니다. 유럽경제지역·영국·스위스 등 인증된 동의 관리 플랫폼이 요구되는 지역에는 해당 절차가 준비되기 전 맞춤형 광고를 제공하지 않습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">7. 외부 요청과 공유 링크</h2><p>환율 조회, 카카오 지도, 외부 이미지 미리보기와 공식 출처 링크를 이용하면 해당 서비스에 IP 주소와 브라우저 정보가 전달될 수 있습니다. 텔레파시 초대의 이름과 답은 데이터베이스가 아니라 공유 URL에 포함되므로 링크 수신자와 브라우저 방문 기록에서 확인될 수 있습니다. 민감정보는 입력하지 마세요.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">8. 이용자의 권리와 문의</h2><p>선택 분석 동의를 언제든 철회하고 브라우저 저장 정보와 쿠키를 삭제할 수 있습니다. 운영자는 회원 데이터베이스를 보유하지 않아 계정 단위 열람·정정 대상은 없습니다. 개인정보를 포함하지 않는 일반 문의는 <a href="https://github.com/imhyuk98/modu-dogu/issues/new" target="_blank" rel="noreferrer" className="font-bold underline">공개 GitHub 이슈</a>를 이용하세요. 개인정보 노출 또는 보안 사고처럼 비공개 전달이 필요하면 <a href="https://github.com/imhyuk98/modu-dogu/security/advisories/new" target="_blank" rel="noreferrer" className="font-bold underline">비공개 보안 신고</a>를 이용할 수 있습니다.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">9. 친구 질문 결과함</h2><p>우정고사·친구 케미·사용 설명서·칭찬 카드의 새 초대는 완성 단계의 별도 저장 동의 후 닉네임, 질문 종류, 선택 답변, 생성·제출·만료 시각, 무작위 요청 식별자를 운영 데이터베이스에 저장합니다. 친구의 닉네임과 답변은 질문 생성자에게 표시됩니다. 이름은 본인 인증 정보가 아니므로 실명이나 연락처를 입력하지 마세요. 저장에 동의하지 않으면 서버 결과함을 만들거나 답변을 제출할 수 없으며, 선택 분석 동의와는 별개입니다.</p><p className="mt-3">Cloudflare, Inc.의 Workers·D1 인프라를 이용하며 제출·조회 시 국외 인프라에서 처리될 수 있습니다. 결과함은 생성일로부터 30일간 접근할 수 있고 만료 후 시간 단위 정리 작업으로 운영 데이터베이스에서 삭제합니다. 생성자는 결과함 화면에서 먼저 전체 삭제할 수 있습니다. Cloudflare 복구용 백업에는 요금제에 따라 추가 7~30일간 이력이 남을 수 있습니다. <a href="https://developers.cloudflare.com/d1/reference/time-travel/" target="_blank" rel="noreferrer" className="font-bold underline">백업 정책</a>을 참고하세요.</p><p className="mt-3">생성자 열람 키는 브라우저 localStorage와 생성자 전용 주소에 보관하며, 서버에는 키의 해시를 저장합니다. 전용 주소를 가진 사람은 전체 결과를 조회·삭제할 수 있으므로 다른 사람에게 공유하지 마세요. 주소와 브라우저 데이터를 모두 잃으면 사용자용 복구 기능은 없습니다. 답변은 결과함당 최대 100개이며 요청 빈도를 제한하기 위해 접속 주소를 임시 처리하지만 앱 데이터베이스에는 IP를 저장하지 않습니다. 인프라의 보안 처리는 Cloudflare 정책을 따릅니다.</p><p className="mt-3">기존 초대와 이미 공유된 결과 카드에는 링크 자체에 닉네임·답변이 들어 있으므로 결과함 삭제로 사본을 회수할 수 없습니다. 결과함 열람 키와 입력값은 분석 이벤트로 전송하지 않습니다. 개별 답변 삭제가 필요하면 생성자에게 결과함 삭제를 요청하거나 위 비공개 문의 경로로 연락해 주세요. 공개 이슈에는 전용 주소나 개인정보를 올리지 마세요.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-gray-950">10. 변경 고지</h2><p>처리 항목이나 외부 서비스가 바뀌면 시행 전에 이 페이지에 변경 내용과 개정일을 표시합니다. 중요한 변경은 사이트 화면에서도 별도로 알립니다.</p></section>
      </div>
    </article>
  );
}
