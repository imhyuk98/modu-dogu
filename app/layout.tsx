import type { Metadata } from "next";
import { Gasoek_One, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import FloatingButtons from "@/components/FloatingButtons";
import Breadcrumb from "@/components/Breadcrumb";
import TrackVisit from "@/components/TrackVisit";
import RegisterSW from "@/components/RegisterSW";
import HtmlLanguageSync from "@/components/HtmlLanguageSync";
import ConsentBanner from "@/components/ConsentBanner";
import AdSenseScript from "@/components/AdSenseScript";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  display: "swap",
});

const gasoekOne = Gasoek_One({
  variable: "--font-gasoek-one",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://modu-dogu.pages.dev"),
  title: {
    default: "모두의도구 — 무료 계산기·테스트·게임·온라인 도구 124개",
    template: "%s | 모두의도구",
  },
  description:
    "생활·금융 계산기부터 테스트, 게임, 이미지·문서 온라인 도구까지 124개 기능을 회원가입 없이 무료로 이용하세요.",
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
  alternates: {
    canonical: "/",
    languages: { ko: "/", en: "/en", "x-default": "/" },
  },
  openGraph: {
    title: "무료 계산기·테스트·게임·온라인 도구 124개 | 모두의도구",
    description:
      "생활·금융 계산기부터 테스트, 게임, 이미지·문서 도구까지 회원가입 없이 이용하세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://modu-dogu.pages.dev",
    siteName: "모두의도구",
    images: [
      {
        url: "https://modu-dogu.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "무료 계산기·테스트·게임·온라인 도구 - 모두의도구",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "무료 계산기·테스트·게임·온라인 도구 124개 | 모두의도구",
    description:
      "생활·금융 계산기부터 테스트, 게임, 이미지·문서 도구까지 회원가입 없이 이용하세요.",
    images: ["https://modu-dogu.pages.dev/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang=location.pathname==='/en'||location.pathname.startsWith('/en/')?'en':'ko'" }} />
        <meta name="naver-site-verification" content="8856760dc5a9e429adfe0c65cb1bfe4206d6fdb2" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#a93d28" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${notoSansKr.variable} ${geistMono.variable} ${gasoekOne.variable} antialiased min-h-screen flex flex-col`}
      >
        <AdSenseScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "모두의도구 · Modu Tools",
              alternateName: ["modu-dogu", "Modu Tools"],
              url: "https://modu-dogu.pages.dev",
              description:
                "무료 계산기·테스트·게임·이미지·문서 온라인 도구 124개를 제공합니다.",
              inLanguage: ["ko", "en"],
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
        <HtmlLanguageSync />
        <Header />
        <main className="flex-1">
          <Breadcrumb />
          {children}
        </main>
        <Footer />
        <FloatingButtons />
        <TrackVisit />
        <RegisterSW />
        <ConsentBanner />
      </body>
    </html>
  );
}
