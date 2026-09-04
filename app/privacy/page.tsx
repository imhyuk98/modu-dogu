import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "개인정보처리방침",
  description: "모두의도구 개인정보처리방침 - 쿠키, Google Analytics, Google AdSense 등 제3자 서비스 이용에 대한 안내입니다.",
  keywords: ["개인정보처리방침", "모두의도구", "쿠키정책", "개인정보보호"],
  openGraph: {
    images: ["/og-image.png"],
    title: "개인정보처리방침 | 모두의도구",
    description: "모두의도구 개인정보처리방침 - 쿠키, Google Analytics, Google AdSense 등 제3자 서비스 이용에 대한 안내입니다.",
    url: "https://modu-dogu.pages.dev/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        개인정보처리방침
      </h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            1. 개인정보의 수집 및 이용 목적
          </h2>
          <p>
            모두의도구(이하 &quot;사이트&quot;)는 별도의 회원가입 없이 이용 가능한
            서비스로, 이용자의 개인정보를 직접 수집하지 않습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            2. 쿠키 및 자동 수집 정보
          </h2>
          <p>
            사이트는 서비스 개선 및 광고 제공을 위해 쿠키(Cookie)를 사용할 수
            있습니다. Google Analytics를 통해 방문자 통계 데이터를 수집하며,
            Google AdSense를 통해 맞춤형 광고를 제공할 수 있습니다.
          </p>
          <p>
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우
            일부 서비스 이용에 제한이 있을 수 있습니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            3. 제3자 서비스
          </h2>
          <p>사이트는 다음 제3자 서비스를 이용합니다:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Google Analytics: 웹사이트 방문 통계 분석</li>
            <li>Google AdSense: 광고 서비스 제공</li>
          </ul>
          <p>
            각 서비스의 개인정보 처리에 대한 자세한 사항은 해당 서비스의
            개인정보처리방침을 참고하시기 바랍니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">
            4. 개인정보처리방침의 변경
          </h2>
          <p>
            본 개인정보처리방침은 법령 및 서비스 변경사항을 반영하여 수정될 수
            있으며, 변경 시 사이트를 통해 공지합니다.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900">5. 문의</h2>
          <p>
            개인정보 관련 문의사항은 사이트 소개 페이지의 연락처를 통해 문의해
            주시기 바랍니다.
          </p>
        </section>

        <p className="text-sm text-gray-400 mt-8">
          시행일자: 2025년 1월 1일
        </p>
      </div>
    </div>
  );
}
