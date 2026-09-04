import type { Metadata } from "next";
import { Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FloatingButtons from "@/components/FloatingButtons";
import Breadcrumb from "@/components/Breadcrumb";
import TrackVisit from "@/components/TrackVisit";
import RegisterSW from "@/components/RegisterSW";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modu-dogu.pages.dev"),
  title: {
    default: "모두의도구 - 친구와 같이 하는 무료 테스트·게임",
    template: "%s | 모두의도구",
  },
  description:
    "친구와 같이 하는 텔레파시 게임, 케미 테스트, 오늘의 운세와 성향 테스트를 무료로 즐기고 결과를 공유하세요. 생활 계산기와 온라인 도구도 제공합니다.",
  keywords: [
    "계산기",
    "연봉 실수령액",
    "대출이자 계산기",
    "환율 계산기",
    "퍼센트 계산기",
    "BMI 계산기",
    "퇴직금 계산기",
    "취득세 계산기",
    "주식 수익률",
    "MBTI 궁합",
    "온라인 도구",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "친구와 같이 하고, 결과를 나눠보세요 | 모두의도구",
    description:
      "텔레파시 게임, 친구 케미, 성향 테스트와 오늘의 운세를 가입 없이 바로 즐겨보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://modu-dogu.pages.dev",
    siteName: "모두의도구",
    images: [
      {
        url: "https://modu-dogu.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "친구와 같이 하는 무료 테스트와 게임 - 모두의도구",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "친구와 같이 하고, 결과를 나눠보세요 | 모두의도구",
    description:
      "텔레파시 게임, 친구 케미, 성향 테스트와 오늘의 운세를 가입 없이 바로 즐겨보세요.",
    images: ["https://modu-dogu.pages.dev/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta name="naver-site-verification" content="8856760dc5a9e429adfe0c65cb1bfe4206d6fdb2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#a93d28" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3204700288703280"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${notoSansKr.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "모두의도구",
              alternateName: "modu-dogu",
              url: "https://modu-dogu.pages.dev",
              description:
                "친구와 함께 즐기고 결과를 공유하는 무료 테스트·게임과 생활 도구를 제공합니다.",
              inLanguage: "ko",
              publisher: {
                "@type": "Organization",
                name: "모두의도구",
                url: "https://modu-dogu.pages.dev",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://modu-dogu.pages.dev/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">
          <Breadcrumb />
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <TrackVisit />
        <RegisterSW />
      </body>
    </html>
  );
}
