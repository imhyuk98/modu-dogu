import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Modu Tools privacy policy covering cookies, analytics, advertising, and local browser processing.",
  alternates: { canonical: "/en/privacy", languages: { en: "/en/privacy", ko: "/privacy", "x-default": "/privacy" } },
};

export default function EnglishPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-[#6e5a50]">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a93d28]">Last updated September 4, 2026</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#271f1b]">Privacy policy</h1>
      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">1. Information we collect</h2><p>Modu Tools does not require an account and does not directly ask for personal profile information. Basic technical and usage information may be collected automatically through the third-party services described below.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">2. Cookies and analytics</h2><p>The site may use cookies and Google Analytics to understand visits and improve the service. You can restrict cookies in your browser settings, although some site features may be affected.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">3. Advertising</h2><p>The site may use Google AdSense. Google and its partners may use cookies or similar technologies to serve and measure ads, subject to their own policies and the consent requirements that apply in your region.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">4. Local browser processing</h2><p>The English password, text conversion, image resize, and image compression tools process their working content in your browser. That content is not intentionally transmitted to our server by those tools.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">5. Changes to this policy</h2><p>We may update this policy to reflect changes in the service or applicable requirements. The updated date on this page will change when the policy is revised.</p></section>
      </div>
    </article>
  );
}
