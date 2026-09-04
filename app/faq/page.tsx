import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/faq", languages: { ko: "/faq", en: "/en/faq", "x-default": "/faq" } },
  title: "자주 묻는 질문 (FAQ) - 모두의도구",
  description:
    "모두의도구 이용 방법, 계산 정확도, 개인정보 처리, 추천·테스트 기능 등 자주 묻는 질문과 답변을 확인하세요.",
  keywords: ["모두의도구 FAQ", "자주 묻는 질문", "모두의도구 사용법", "온라인 계산기 FAQ"],
  openGraph: {
    images: ["/og-image.png"],
    title: "자주 묻는 질문 (FAQ) - 모두의도구",
    description: "모두의도구 이용 방법, 계산 정확도, 개인정보 처리, 추천·테스트 기능 등 자주 묻는 질문과 답변을 확인하세요.",
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
        a: "법령·공공기관 자료를 확인할 수 있는 계산기는 적용 기준일, 공식, 포함·제외 항목과 출처를 함께 표시합니다. 결과는 입력값을 단순화한 참고용 추정치이며 실제 세금·급여·계약 금액은 개인별 조건에 따라 달라질 수 있습니다.",
      },
      {
        q: "연봉 계산기의 세금 기준은 언제 것인가요?",
        a: "4대보험은 2026년 7월 이후 요율과 국민연금 상·하한액을 적용합니다. 소득세는 본인 1인, 비과세 급여 없음 기준의 추정치이며 실제 원천징수액은 부양가족과 비과세 항목 등에 따라 달라질 수 있습니다.",
      },
      {
        q: "금리 데이터는 실시간인가요?",
        a: "아닙니다. 화면에 표시되는 평균 금리는 기준월이 적힌 저장 자료일 뿐 현재 금융회사 제안 금리가 아닙니다. 계산은 사용자가 입력한 연이율로 진행하므로 계약서나 금융회사 공시에서 확인한 금리로 바꿔 주세요.",
      },
      {
        q: "환율 계산기의 환율은 실시간인가요?",
        a: "실시간 시세가 아닙니다. Frankfurter API가 제공하는 유럽중앙은행(ECB) 기준 최근 영업일 환율을 평일 하루 단위로 불러오며 화면에 기준일을 표시합니다. 은행 환전 환율·우대율·수수료와는 다릅니다.",
      },
      {
        q: "부동산 세금 계산이 실제와 다를 수 있나요?",
        a: "네, 부동산 세금은 개인의 주택 보유 수, 보유 기간, 조정대상지역 여부, 감면 혜택 등 다양한 변수에 따라 달라집니다. 정확한 세액은 세무사와 상담하시기를 권장합니다.",
      },
    ],
  },
  {
    category: "추천·테스트 기능",
    items: [
      {
        q: "추천·테스트 기능은 인공지능을 사용하나요?",
        a: "현재 추천·테스트 기능은 서버의 인공지능 API를 사용하지 않습니다. 공개된 고정 데이터, 입력 조건별 점수, 무작위 섞기 같은 브라우저 규칙으로 결과를 만듭니다. 그래서 '조건별 추천', '성향 테스트', '카드 뽑기'처럼 실제 작동 방식에 맞게 표시합니다.",
      },
      {
        q: "추천 결과가 매번 다른 이유는?",
        a: "같은 조건이라도 다양한 결과를 경험할 수 있도록 약간의 랜덤 요소가 포함되어 있습니다. '다시 추천받기' 버튼을 누르면 새로운 조합의 결과를 볼 수 있습니다.",
      },
      {
        q: "오행·운세·전생 테스트는 믿을 수 있나요?",
        a: "오행 성향, 띠 운세, 전생 콘셉트 테스트는 고정 규칙과 무작위 요소로 만든 오락 콘텐츠입니다. 미래 예측이나 전통 명리학 감정을 제공하지 않으며 건강·재물·관계 결정을 위한 근거로 사용하면 안 됩니다.",
      },
      {
        q: "식단·운동 추천을 그대로 따라해도 되나요?",
        a: "아니요. 고정된 규칙과 예시 데이터로 만든 일반 정보이며 개인의 건강 상태, 알레르기, 기저질환을 판단하지 않습니다. 치료나 식이 제한과 관련된 결정은 의료·영양 전문가와 상담하세요.",
      },
    ],
  },
  {
    category: "개인정보 & 데이터",
    items: [
      {
        q: "입력한 정보가 서버에 저장되나요?",
        a: "계산·테스트 입력값은 브라우저에서 처리하며 모두의도구 서버 계정에 저장하지 않습니다. 다만 환율처럼 외부 공개 데이터를 불러오는 기능과 방문 통계·광고 기능은 네트워크 요청을 할 수 있습니다. 텔레파시 초대 링크에 넣은 이름과 답은 링크 문자열에 포함되므로 공유 대상을 확인하세요.",
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
        a: "네. 하단의 의견 보내기에서 공개 GitHub Issues로 요청할 수 있습니다. 계좌·주민번호 같은 민감정보는 적지 마세요.",
      },
      {
        q: "계산 결과에 오류가 있을 때는 어떻게 하나요?",
        a: "하단의 오류 제보 링크에서 사용한 입력값, 기대 결과, 확인한 공식 출처를 남겨주세요. 재현 가능한 제보부터 검토하며 변경 내용은 업데이트 기록에 남깁니다.",
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
          <a className="text-sm font-semibold text-blue-700 underline underline-offset-4" href="/feedback">
            의견·오류 제보 방법 보기
          </a>
        </div>
      </div>
    </>
  );
}
