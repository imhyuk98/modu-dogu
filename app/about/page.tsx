import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/about", languages: { ko: "/about", en: "/en/about", "x-default": "/about" } },
  title: "사이트 소개",
  description: "모두의도구는 친구와 함께하는 테스트·게임, 오늘의 운세와 120가지 이상의 무료 생활 계산기·온라인 도구를 제공하는 사이트입니다.",
  keywords: ["모두의도구", "사이트 소개", "무료 계산기", "온라인 도구"],
  openGraph: {
    images: ["/og-image.png"],
    title: "사이트 소개 | 모두의도구",
    description: "친구와 함께하는 테스트·게임부터 생활 계산기까지 120가지 이상의 무료 콘텐츠를 제공합니다.",
    url: "https://modu-dogu.pages.dev/about",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">사이트 소개</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            모두의도구란?
          </h2>
          <p>
            모두의도구는 친구와 함께 결과를 비교하는 테스트와 게임, 매일 보는
            운세 콘텐츠를 중심으로 생활 계산기와 온라인 도구까지 한곳에서
            무료로 이용할 수 있는 서비스입니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">특징</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>회원가입 없이 무료로 이용 가능</li>
            <li>친구 초대 링크와 결과 카드 공유</li>
            <li>최신 세율 및 요율 반영</li>
            <li>모바일에서도 편리하게 사용 가능</li>
            <li>개인정보 수집 없이 안전하게 이용</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">면책 조항</h2>
          <p>
            본 사이트에서 제공하는 계산 결과는 참고용이며, 실제 금액은 개인의
            상황에 따라 다를 수 있습니다. 정확한 금액은 관련 기관에 문의하시기
            바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">문의</h2>
          <p>
            사이트 이용 중 문의사항이 있으시면 아래 이메일로 연락 주세요.
          </p>
          <p className="font-medium text-gray-900">
            이메일: contact@example.com
          </p>
        </section>
      </div>
    </div>
  );
}
