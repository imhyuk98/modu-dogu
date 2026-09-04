import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "자주 묻는 질문 (FAQ) - 모두의도구",
  description:
    "모두의도구 이용 방법, 계산 정확도, 개인정보 처리, AI 기능 등 자주 묻는 질문과 답변을 확인하세요.",
  keywords: ["모두의도구 FAQ", "자주 묻는 질문", "모두의도구 사용법", "온라인 계산기 FAQ"],
  openGraph: {
    images: ["/og-image.png"],
    title: "자주 묻는 질문 (FAQ) - 모두의도구",
    description: "모두의도구 이용 방법, 계산 정확도, 개인정보 처리, AI 기능 등 자주 묻는 질문과 답변을 확인하세요.",
    url: "https://modu-dogu.pages.dev/faq",
  },
};

const faqs = [
  {
    category: "서비스 이용",
    items: [
      {
        q: "모두의도구는 무료인가요?",
        a: "네, 모두의도구의 모든 계산기와 도구는 100% 무료로 이용하실 수 있습니다. 회원가입이나 로그인도 필요하지 않습니다.",
      },
      {
        q: "회원가입이 필요한가요?",
        a: "아닙니다. 별도의 회원가입 없이 바로 모든 기능을 이용하실 수 있습니다.",
      },
      {
        q: "모바일에서도 이용할 수 있나요?",
        a: "네, 모두의도구는 반응형 웹으로 제작되어 스마트폰, 태블릿, PC 등 모든 기기에서 최적화된 화면으로 이용하실 수 있습니다.",
      },
      {
        q: "앱으로도 출시되나요?",
        a: "현재는 웹 서비스로만 제공하고 있습니다. 모바일 브라우저에서 홈 화면에 추가하시면 앱처럼 편리하게 이용하실 수 있습니다.",
      },
      {
        q: "즐겨찾기 기능은 어떻게 사용하나요?",
        a: "홈페이지에서 각 도구 카드의 별(★) 아이콘을 클릭하면 즐겨찾기에 추가됩니다. 즐겨찾기한 도구는 상단에 모아서 볼 수 있습니다. 브라우저의 로컬 저장소에 저장되므로 같은 브라우저에서는 유지됩니다.",
      },
    ],
  },
  {
    category: "계산 정확도",
    items: [
      {
        q: "계산 결과는 정확한가요?",
        a: "모두의도구는 공식 산출 기준(국세청, 고용노동부, 한국은행 등)을 바탕으로 계산합니다. 다만 실제 세금이나 급여는 개인별 상황에 따라 차이가 있을 수 있으므로 참고용으로 활용해 주세요.",
      },
      {
        q: "연봉 계산기의 세금 기준은 언제 것인가요?",
        a: "2025년 기준 소득세율, 4대보험 요율을 적용하고 있습니다. 세법이나 요율이 변경되면 업데이트합니다.",
      },
      {
        q: "금리 데이터는 실시간인가요?",
        a: "한국은행 경제통계시스템(ECOS)에서 매일 자동으로 최신 데이터를 가져옵니다. 다만 한국은행 통계 특성상 1~2개월 전 데이터가 최신일 수 있습니다.",
      },
      {
        q: "환율 계산기의 환율은 실시간인가요?",
        a: "외부 환율 API를 통해 최신 환율 데이터를 제공합니다. 다만 실제 은행 환전 시에는 은행별 우대율, 수수료 등에 따라 차이가 있을 수 있습니다.",
      },
      {
        q: "부동산 세금 계산이 실제와 다를 수 있나요?",
        a: "네, 부동산 세금은 개인의 주택 보유 수, 보유 기간, 조정대상지역 여부, 감면 혜택 등 다양한 변수에 따라 달라집니다. 정확한 세액은 세무사와 상담하시기를 권장합니다.",
      },
    ],
  },
  {
    category: "AI 기능",
    items: [
      {
        q: "AI 기능은 실제 인공지능인가요?",
        a: "모두의도구의 AI 기능은 방대한 데이터베이스와 알고리즘을 기반으로 사용자 입력에 맞는 최적의 결과를 분석·추천합니다. 입력 조건에 따라 점수를 계산하고 가장 적합한 결과를 도출하는 규칙 기반 AI 시스템입니다.",
      },
      {
        q: "AI 추천 결과가 매번 다른 이유는?",
        a: "같은 조건이라도 다양한 결과를 경험할 수 있도록 약간의 랜덤 요소가 포함되어 있습니다. '다시 추천받기' 버튼을 누르면 새로운 조합의 결과를 볼 수 있습니다.",
      },
      {
        q: "AI 사주/운세는 믿을 수 있나요?",
        a: "AI 사주, 운세, 전생 테스트 등은 재미와 흥미를 위한 엔터테인먼트 콘텐츠입니다. 전통적인 해석 방법을 기반으로 하지만, 실제 운세로 받아들이기보다 재미로 즐겨주세요.",
      },
      {
        q: "AI 식단/운동 추천을 그대로 따라해도 되나요?",
        a: "일반적인 영양학 및 운동과학 기준으로 추천하지만, 개인의 건강 상태나 알레르기, 기저질환 등을 고려하지 못할 수 있습니다. 건강 관련 중요한 결정은 반드시 전문의와 상담하세요.",
      },
    ],
  },
  {
    category: "개인정보 & 데이터",
    items: [
      {
        q: "입력한 정보가 서버에 저장되나요?",
        a: "아닙니다. 모두의도구의 모든 계산과 분석은 사용자의 브라우저(클라이언트)에서만 처리됩니다. 입력하신 정보는 서버로 전송되거나 저장되지 않습니다.",
      },
      {
        q: "쿠키를 사용하나요?",
        a: "즐겨찾기 기능을 위해 브라우저의 로컬 저장소(localStorage)를 사용합니다. 광고 서비스(Google AdSense)에서 쿠키를 사용할 수 있으며, 자세한 내용은 개인정보처리방침을 확인해 주세요.",
      },
      {
        q: "이미지 도구 사용 시 이미지가 업로드되나요?",
        a: "아닙니다. 이미지 크기 조절, 모자이크, 자르기, 회전, 변환 등 모든 이미지 처리는 브라우저 내에서 Canvas API를 사용하여 처리됩니다. 이미지가 외부 서버로 전송되지 않으므로 안심하고 사용하세요.",
      },
    ],
  },
  {
    category: "기타",
    items: [
      {
        q: "새로운 계산기나 도구를 요청할 수 있나요?",
        a: "네, 필요한 계산기나 도구가 있다면 언제든 요청해 주세요. 많은 분들이 원하는 기능을 우선적으로 추가하고 있습니다.",
      },
      {
        q: "계산 결과에 오류가 있을 때는 어떻게 하나요?",
        a: "계산 오류를 발견하시면 알려주세요. 빠르게 확인 후 수정하겠습니다. 정확한 서비스를 위해 지속적으로 검증하고 있습니다.",
      },
      {
        q: "어떤 기기와 브라우저를 지원하나요?",
        a: "Chrome, Safari, Firefox, Edge 등 최신 브라우저를 지원합니다. 최적의 경험을 위해 최신 버전의 브라우저 사용을 권장합니다.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.flatMap((cat) =>
              cat.items.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.a,
                },
              }))
            ),
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          자주 묻는 질문 (FAQ)
        </h1>
        <p className="text-gray-500 mb-10">
          모두의도구 이용에 대해 궁금한 점을 확인하세요.
        </p>

        <div className="space-y-10">
          {faqs.map((category) => (
            <section key={category.category}>
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                      <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">
                        {item.q}
                      </span>
                      <svg
                        className="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform group-open:rotate-180"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-2xl text-center">
          <p className="text-gray-700 font-medium mb-1">
            원하는 답변을 찾지 못하셨나요?
          </p>
          <p className="text-gray-500 text-sm">
            추가 문의사항이 있으시면 언제든 알려주세요. 빠르게 답변드리겠습니다.
          </p>
        </div>
      </div>
    </>
  );
}
