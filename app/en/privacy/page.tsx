import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Modu Tools handles local storage, optional cookies, analytics, advertising, and external data requests.",
  alternates: { canonical: "/en/privacy", languages: { en: "/en/privacy", ko: "/privacy", "x-default": "/privacy" } },
};

export default function EnglishPrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-[#6e5a50]">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a93d28]">Updated September 5, 2026</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-[#271f1b]">Privacy policy</h1>
      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">1. Accounts and tool inputs</h2><p>Modu Tools does not require an account or personal profile. Unless a tool says otherwise, calculator, text, and image inputs are processed in your browser and are not stored in an operator account or database.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">2. Essential browser storage</h2><p>Local storage keeps favorites, recent tools, game records, return streaks, and your optional-cookie choice. It stays in the current browser and can be removed through browser settings.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">3. Optional cookies and analytics</h2><p>Google Analytics loads only after you choose “Allow optional cookies.” It may process page paths, page titles, start, completion and share events, and the basic technical information Google provides. Query strings and hashes are removed from analytics page locations, and tool inputs are not sent as analytics parameters.</p><p className="mt-2">You can change the choice through “Cookie choices” in the footer. Choosing “Essential only” stops future analytics events and attempts to remove this site’s <code>_ga</code> cookies.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">4. Advertising</h2><p>If a Google AdSense identifier is configured, its script and ad units load only after optional-cookie consent. No empty ad placeholder is shown when advertising is not configured. A separate compliant consent process will be used where regional requirements demand one.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">5. External requests and shared links</h2><p>Exchange-rate lookups, Kakao Maps, and official-source links may contact their respective services. A telepathy invitation stores the entered name and answers in the shared URL rather than a site database; recipients and browser history may therefore reveal them. Do not enter sensitive information.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">6. Contact and changes</h2><p>Report privacy or product issues through the <a href="https://github.com/imhyuk98/modu-dogu/issues/new" target="_blank" rel="noreferrer" className="font-black underline">public GitHub issue form</a>. Do not post personal information; substitute reproducible sample values. This date will change when the policy is revised.</p></section>
      </div>
    </article>
  );
}
