import { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR 코드 생성기 - 무료 온라인 QR 코드 만들기",
  description:
    "텍스트, URL, 연락처 등을 QR 코드로 변환할 수 있는 무료 온라인 QR 코드 생성기입니다.",
  keywords: [
    "QR 코드 생성기",
    "QR 코드 만들기",
    "QR code generator",
    "무료 QR 코드",
    "온라인 QR 코드",
  ],
  openGraph: {
    title: "QR 코드 생성기 - 무료 온라인 QR 코드 만들기",
    description:
      "텍스트, URL, 연락처 등을 QR 코드로 변환할 수 있는 무료 온라인 QR 코드 생성기입니다.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "QR 코드 생성기",
            description:
              "텍스트, URL, 연락처 등을 QR 코드로 변환할 수 있는 무료 온라인 QR 코드 생성기입니다.",
            url: "https://vibe-revenue.pages.dev/tools/qr-code",
            applicationCategory: "UtilityApplication",
            operatingSystem: "All",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "KRW",
            },
          }),
        }}
      />
      {children}
    </>
  );
}
