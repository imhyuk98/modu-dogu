import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about cost, accounts, privacy, supported devices, and Modu Tools results.",
  alternates: { canonical: "/en/faq", languages: { en: "/en/faq", ko: "/faq", "x-default": "/faq" } },
};

const questions = [
  ["Are the tools free?", "Yes. The tools in the English collection can be used without payment or registration."],
  ["Do I need an account?", "No. Open a tool and use it immediately."],
  ["Are my passwords, text, or images uploaded?", "Password generation, text conversion, and the English image resize and compression tools run in your browser. Their working content is not uploaded to our server."],
  ["Can I use the site on my phone?", "Yes. The English home and tool screens are designed for modern mobile and desktop browsers."],
  ["Are calculator results official?", "No. Results are for general reference. Check important health, legal, tax, or financial decisions with a qualified professional or official source."],
  ["Why are some Korean tools unavailable in English?", "The first English release focuses on tools that work consistently across countries. Korea-specific tax and public-system calculators remain in Korean."],
];

export default function EnglishFaqPage() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-sm font-black uppercase tracking-[0.14em] text-[#a93d28]">Need a quick answer?</p><h1 className="mt-2 text-4xl font-black tracking-tight text-[#271f1b]">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-[#e8d9cf] border-y border-[#e8d9cf]">{questions.map(([question, answer]) => <section key={question} className="py-6"><h2 className="text-lg font-black text-[#3f3029]">{question}</h2><p className="mt-2 leading-7 text-[#6e5a50]">{answer}</p></section>)}</div>
    </article>
  );
}
