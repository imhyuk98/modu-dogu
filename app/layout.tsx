import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: {
    default: "모두의도구 - 생활 계산기 모음",
    template: "%s | 모두의도구",
  },
  description:
    "연봉 실수령액, 대출이자, 환율, 부동산 세금, 주식 수익률, MBTI, 운세, JSON 포매터, QR코드 등 60가지 이상의 생활 계산기와 온라인 도구를 무료로 제공합니다.",
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
  openGraph: {
    title: "모두의도구 - 생활 계산기 & 온라인 도구 모음",
    description:
      "연봉 실수령액, 대출이자, 환율, 부동산 세금, 주식 수익률, MBTI, 운세, JSON 포매터, QR코드 등 60가지 이상의 생활 계산기와 온라인 도구를 무료로 제공합니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://modu-dogu.pages.dev",
    siteName: "모두의도구",
    images: [
      {
        url: "https://modu-dogu.pages.dev/og-image.svg",
        width: 1200,
        height: 630,
        alt: "모두의도구 - 생활 계산기 & 온라인 도구 모음",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "모두의도구 - 생활 계산기 & 온라인 도구 모음",
    description:
      "연봉 실수령액, 대출이자, 환율, 부동산 세금, 주식 수익률, MBTI, 운세, JSON 포매터, QR코드 등 60가지 이상의 생활 계산기와 온라인 도구를 무료로 제공합니다.",
    images: ["https://modu-dogu.pages.dev/og-image.svg"],
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
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body
        className={`${geistMono.variable} antialiased min-h-screen flex flex-col`}
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
                "연봉 실수령액, 대출이자, 환율, 부동산 세금, 주식 수익률, MBTI, 운세, JSON 포매터, QR코드 등 70가지 이상의 생활 계산기와 온라인 도구를 무료로 제공합니다.",
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3204700288703280"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 pt-4">
            <Breadcrumb />
          </div>
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
