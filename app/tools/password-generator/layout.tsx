import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "비밀번호 생성기 - 안전한 랜덤 비밀번호 만들기 | 모두의도구",
  description:
    "강력한 랜덤 비밀번호를 무료로 생성하세요. 길이, 대소문자, 숫자, 특수문자를 설정하여 안전한 비밀번호를 만들 수 있습니다.",
  keywords: ["비밀번호 생성기", "랜덤 비밀번호", "패스워드 생성", "강력한 비밀번호", "비밀번호 만들기", "password generator"],
  openGraph: {
    title: "비밀번호 생성기 - 안전한 랜덤 비밀번호 만들기 | 모두의도구",
    description: "강력한 랜덤 비밀번호를 무료로 생성하세요. 길이, 대소문자, 숫자, 특수문자를 설정할 수 있습니다.",
    url: "https://modu-dogu.pages.dev/tools/password-generator",
  },
};

export default function PasswordGeneratorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "비밀번호 생성기",
            description: "강력한 랜덤 비밀번호를 무료로 생성하세요. 길이, 대소문자, 숫자, 특수문자를 설정할 수 있습니다.",
            url: "https://modu-dogu.pages.dev/tools/password-generator",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
          }),
        }}
      />
      {children}
    </>
  );
}
