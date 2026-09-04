import type { Metadata } from "next";

const baseUrl = "https://modu-dogu.pages.dev";

export const metadata: Metadata = {
  title: { default: "Modu Tools — Free Calculators & Online Tools", template: "%s | Modu Tools" },
  description: "Free calculators, converters, image tools, developer utilities, and quick games. No sign-up—just open a tool and use it.",
  keywords: ["free online tools", "online calculators", "browser tools", "image tools", "developer tools"],
  alternates: { canonical: "/en", languages: { en: "/en", ko: "/", "x-default": "/" } },
  openGraph: { type: "website", locale: "en_US", url: `${baseUrl}/en`, siteName: "Modu Tools", title: "Modu Tools — Free Calculators & Online Tools", description: "Calculate, convert, create, or play with 20 free browser-based tools.", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: "Modu Tools — Free Calculators & Online Tools", description: "Calculate, convert, create, or play with 20 free browser-based tools.", images: ["/og-image.png"] },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <div lang="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Modu Tools", alternateName: "ModuDogu", url: `${baseUrl}/en`, description: "Free calculators, converters, image tools, developer utilities, and quick games.", inLanguage: "en" }) }} />
      {children}
    </div>
  );
}
