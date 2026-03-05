import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ScrollToTop from "@/components/ScrollToTop";
import Breadcrumb from "@/components/Breadcrumb";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "계산기나라 - 생활 계산기 모음",
    template: "%s | 계산기나라",
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
    title: "계산기나라 - 생활 계산기 & 온라인 도구 모음",
    description:
      "연봉 실수령액, 대출이자, 환율, 부동산 세금, 주식 수익률, MBTI, 운세, JSON 포매터, QR코드 등 60가지 이상의 생활 계산기와 온라인 도구를 무료로 제공합니다.",
    type: "website",
    locale: "ko_KR",
    url: "https://vibe-revenue.pages.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 pt-4">
            <Breadcrumb />
          </div>
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
