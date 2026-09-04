"use client";

import Link from "next/link";
import type { EnglishTool } from "@/lib/en-tools";
import { englishToolHref, englishTools } from "@/lib/en-tools";
import {
  AgeCalculatorEn,
  BmiCalculatorEn,
  CharacterCounterEn,
  DateDifferenceEn,
  PercentageCalculatorEn,
  UnitConverterEn,
} from "./EnglishCalculators";
import {
  Base64En,
  ColorConverterEn,
  CsvJsonEn,
  JsonFormatterEn,
  PasswordGeneratorEn,
  QrCodeEn,
  RandomNumberEn,
  TimerEn,
} from "./EnglishUtilities";
import {
  MemoryGameEn,
  NameCompatibilityEn,
  NameGeneratorEn,
  ReactionTestEn,
} from "./EnglishCreativeTools";
import { ImageCompressEn, ImageResizeEn } from "./EnglishImageTools";

const toolComponents: Record<string, React.ComponentType> = {
  age: AgeCalculatorEn,
  percent: PercentageCalculatorEn,
  bmi: BmiCalculatorEn,
  "unit-converter": UnitConverterEn,
  dday: DateDifferenceEn,
  "character-count": CharacterCounterEn,
  "password-generator": PasswordGeneratorEn,
  "random-number": RandomNumberEn,
  "json-formatter": JsonFormatterEn,
  "csv-json": CsvJsonEn,
  base64: Base64En,
  "color-converter": ColorConverterEn,
  "qr-code": QrCodeEn,
  timer: TimerEn,
  "image-resize": ImageResizeEn,
  "image-compress": ImageCompressEn,
  "name-generator": NameGeneratorEn,
  "name-compatibility": NameCompatibilityEn,
  "reaction-test": ReactionTestEn,
  "memory-game": MemoryGameEn,
};

const guideCopy: Record<string, { heading: string; body: string }> = {
  age: { heading: "How this age calculator works", body: "Choose a date of birth to calculate completed years, months, and days. Total days use calendar dates, so daylight-saving changes do not alter the answer." },
  percent: { heading: "Four percentage calculations in one place", body: "Use “% of value” for a portion, “part of whole” for a ratio, “% change” to compare two values, or “discount” to find a sale price." },
  bmi: { heading: "Reading your BMI result", body: "For adults, the usual reference ranges are under 18.5, 18.5–24.9, 25–29.9, and 30 or higher. Treat the result as a broad screening measure." },
  "unit-converter": { heading: "Accurate everyday conversions", body: "Select a category and two units, then enter a value. Length and weight use standard fixed factors; temperature uses the Celsius, Fahrenheit, and Kelvin formulas." },
  dday: { heading: "Counting days between dates", body: "The result excludes the start date. For an inclusive count that includes both the start and end date, add one day to the answer." },
  "character-count": { heading: "Counts that update as you type", body: "Characters use Unicode code points, while bytes use UTF-8 encoding. These totals can differ for emoji and non-Latin characters." },
  "password-generator": { heading: "Private by design", body: "Passwords are produced with the browser’s cryptographic random generator. Generation and copying happen on your device; the password is not sent to our server." },
  "random-number": { heading: "Fair, flexible number draws", body: "Set any whole-number range, choose up to 100 results, and decide whether a number may appear more than once." },
  "json-formatter": { heading: "Format before you debug", body: "Paste JSON, then format it for readability or minify it for transport. Invalid input shows the parser’s error so you can find the problem quickly." },
  "csv-json": { heading: "Local CSV and JSON conversion", body: "The CSV parser supports quoted fields, commas, and line breaks. The first CSV row becomes the JSON object keys. Your data stays in the browser." },
  base64: { heading: "Unicode-safe Base64", body: "This tool encodes text as UTF-8 before converting it to Base64, so emoji and international characters round-trip correctly." },
  "color-converter": { heading: "One color, three common formats", body: "Pick a color or enter a six-digit HEX value. The equivalent RGB and HSL values are calculated instantly and can be copied." },
  "qr-code": { heading: "Create a sharp QR code", body: "Enter a complete URL or any text, generate the code, then download a high-resolution PNG. Test printed codes before distributing them widely." },
  timer: { heading: "A distraction-free browser timer", body: "Use countdown mode for a fixed session or stopwatch mode to count upward. Keep this tab open while the timer is running." },
  "image-resize": { heading: "Resize without uploading", body: "The browser reads and redraws the selected image locally. Lock the aspect ratio to avoid stretching, then download the resized copy." },
  "image-compress": { heading: "Balance quality and file size", body: "Lower quality normally creates a smaller file. WebP is usually efficient for the web; JPG offers broad compatibility. Your original file is unchanged." },
  "name-generator": { heading: "Names for stories, games, and ideas", body: "Pick a tone and generate a fresh shortlist. Click any suggestion to copy it, then check availability or cultural context before publishing." },
  "name-compatibility": { heading: "A playful result to share", body: "The score is deterministic, so the same pair of names always gets the same result. It is a game, not a measure of a real relationship." },
  "reaction-test": { heading: "How to get a cleaner reaction score", body: "Wait until the panel turns green, then tap immediately. Run five rounds, use the average, and avoid switching tabs during a round." },
  "memory-game": { heading: "A quick memory challenge", body: "Turn over two cards per move and remember their positions. Match all six pairs in as few moves as possible, then shuffle for a new board." },
};

function relatedTools(current: EnglishTool) {
  const sameSection = englishTools.filter((tool) => tool.section === current.section && tool.slug !== current.slug);
  const others = englishTools.filter((tool) => tool.section !== current.section && tool.slug !== current.slug);
  return [...sameSection, ...others].slice(0, 4);
}

export default function EnglishToolPage({ tool }: { tool: EnglishTool }) {
  const Tool = toolComponents[tool.slug];
  const guide = guideCopy[tool.slug];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <nav className="mb-7 flex flex-wrap items-center gap-2 text-sm text-[#806b60]" aria-label="Breadcrumb">
        <Link href="/en" className="hover:text-[#a93d28]">Home</Link><span aria-hidden="true">/</span>
        <Link href={`/en#${tool.section}`} className="capitalize hover:text-[#a93d28]">{tool.section.replace("-", " ")}</Link><span aria-hidden="true">/</span>
        <span aria-current="page" className="font-bold text-[#513b31]">{tool.shortTitle}</span>
      </nav>

      <header className="mb-7 border-b border-[#e8d9cf] pb-7">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.15em] text-[#a93d28]">Free · no sign-up · browser-based</p>
        <div className="flex items-start gap-4">
          <span aria-hidden="true" className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#f5ede7] text-3xl">{tool.emoji}</span>
          <div><h1 className="text-3xl font-black tracking-[-0.035em] text-[#271f1b] sm:text-5xl">{tool.title}</h1><p className="mt-3 max-w-3xl text-base leading-7 text-[#6e5a50] sm:text-lg">{tool.description}</p></div>
        </div>
      </header>

      <section className="calc-card p-4 sm:p-7" aria-label={`${tool.title} controls`}>
        {Tool ? <Tool /> : <p>This tool is temporarily unavailable.</p>}
      </section>

      <section className="mt-10 grid gap-5 border-y border-[#e8d9cf] py-8 sm:grid-cols-[0.7fr_1.3fr]">
        <h2 className="text-2xl font-black tracking-tight text-[#271f1b]">{guide.heading}</h2>
        <p className="leading-7 text-[#6e5a50]">{guide.body}</p>
      </section>

      <section className="mt-10" aria-labelledby="related-english-tools">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#a93d28]">Keep exploring</p><h2 id="related-english-tools" className="text-2xl font-black text-[#271f1b]">Related free tools</h2></div><Link href="/en#all-tools" className="text-sm font-bold text-[#a93d28]">View all →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{relatedTools(tool).map((item) => <Link key={`${item.group}-${item.slug}`} href={englishToolHref(item)} className="rounded-2xl border border-[#e8d9cf] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#a93d28]"><span className="text-2xl">{item.emoji}</span><strong className="mt-3 block text-[#3f3029]">{item.shortTitle}</strong><small className="mt-1 block leading-5 text-[#806b60]">{item.description}</small></Link>)}</div>
      </section>
    </div>
  );
}
