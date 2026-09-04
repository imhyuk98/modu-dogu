import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn what Modu Tools offers and how its free browser-based tools work.",
  alternates: { canonical: "/en/about", languages: { en: "/en/about", ko: "/about", "x-default": "/about" } },
};

export default function EnglishAboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 text-[#6e5a50]">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a93d28]">About the site</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight text-[#271f1b]">Useful things should be easy to use.</h1>
      <div className="mt-8 space-y-8 leading-7">
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">What is Modu Tools?</h2><p>Modu Tools is the English collection from 모두의도구: free calculators, converters, image utilities, generators, and quick games that work without an account.</p></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">What to expect</h2><ul className="list-disc space-y-2 pl-5"><li>Free access with no sign-up.</li><li>Responsive layouts for phones, tablets, and desktops.</li><li>Local browser processing for passwords, text, and selected image tools.</li><li>Plain-language explanations alongside professional calculators.</li></ul></section>
        <section><h2 className="mb-2 text-xl font-black text-[#3f3029]">A note about results</h2><p>Calculation results are provided for general reference. Health-related results are screening information, not medical advice. Entertainment scores and games are just for fun.</p></section>
      </div>
    </article>
  );
}
