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
  LoanCalculatorEn,
  GpaCalculatorEn,
  AreaConverterEn,
  RunningPaceEn,
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
  loan: LoanCalculatorEn,
  gpa: GpaCalculatorEn,
  pyeong: AreaConverterEn,
  "running-pace": RunningPaceEn,
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
  loan: { heading: "Compare repayment structures", body: "Enter the principal, fixed annual rate, and whole-year term. Level-payment loans keep the scheduled payment broadly even, while equal-principal loans start higher and decline. Fees and lender rules are excluded." },
  gpa: { heading: "Credit-weighted, not a simple average", body: "Each grade point is multiplied by its course credits before the totals are divided. Select P/F to exclude a course, and confirm your school’s scale and repeat-course policy." },
  pyeong: { heading: "Three floor-area units", body: "Enter any one of square meters, Korean pyeong, or square feet to see all three. Pyeong is a convenience conversion; official Korean property records use square meters." },
  "running-pace": { heading: "From finish time to training pace", body: "Distance divided by elapsed time gives average pace per kilometer. Mile pace and average speed are derived from the same inputs, without claiming to predict a future race result." },
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

const examples: Record<string, string> = {
  age: "Choose January 1, 2000 to see completed years, months, days, total days, and the next birthday countdown.",
  percent: "Enter 80 and 25 in “% of value” to get 20.",
  bmi: "At 170 cm and 65 kg, the metric result is about 22.5.",
  "unit-converter": "Convert 1 kilometer to miles, or 32°F to 0°C.",
  dday: "January 1 to January 11 is a 10-day difference because the start date is excluded.",
  "character-count": "Paste a draft to compare its character, word, paragraph, and UTF-8 byte totals.",
  loan: "A $250,000 loan at 6.5% for 30 years shows the first payment and lifetime interest estimate.",
  gpa: "Three 3-credit courses graded 4.0, 3.7, and 3.3 produce a 3.67 weighted GPA.",
  pyeong: "Enter 84 m² to get about 25.41 pyeong and 904.17 ft².",
  "running-pace": "A 5 km finish in 25:00 equals 5:00/km and about 8:03/mile.",
  "password-generator": "Select 18 characters with letters, numbers, and symbols, then generate and copy a new value.",
  "random-number": "Draw five unique values from 1 through 45 for a quick randomized list.",
  "json-formatter": "Format {\"hello\":\"world\"} to display an indented object and validate its syntax.",
  "csv-json": "A CSV header of name,score followed by Alex,10 becomes one JSON object.",
  base64: "Encode Hello 👋 and decode the result to verify a Unicode-safe round trip.",
  "color-converter": "Enter #A93D28 to see equivalent RGB and HSL values.",
  "qr-code": "Enter a complete HTTPS page address, generate the code, then scan the preview before printing.",
  timer: "Set 25:00 for a focus session, or use the stopwatch and record lap times.",
  "image-resize": "Load a 1200×800 image, lock its ratio, and set the width to 600 for a 600×400 copy.",
  "image-compress": "Load a photo, compare its original and result sizes, then adjust quality before download.",
  "name-generator": "Choose a fantasy tone and generate several candidates for a game character.",
  "name-compatibility": "Enter Alex and Jordan; the same pair returns the same playful score each time.",
  "reaction-test": "Complete all five rounds and compare the average with your own next attempt.",
  "memory-game": "Match all six pairs, then replay to try to use fewer turns.",
};

const limitations: Record<string, string> = {
  age: "Calendar age can differ from legal age rules that use a specific jurisdiction or cut-off time.",
  percent: "The tool performs arithmetic only; it does not decide which business, tax, or statistical percentage definition applies.",
  bmi: "BMI is an adult population screening ratio and does not directly measure body fat or diagnose health.",
  "unit-converter": "Displayed decimals are rounded, and category-specific units such as shoe sizes are not covered.",
  dday: "The result uses calendar dates and does not count business days or local holidays.",
  "character-count": "Publishers and platforms may count emoji, line breaks, or words differently.",
  loan: "Fees, changing rates, insurance, taxes, and lender-specific schedules are excluded.",
  gpa: "Schools may use different grade points, repeats, rounding, and pass/fail policies.",
  pyeong: "Rounded conversions can differ slightly when converted back; official documents should use m².",
  "running-pace": "Average pace does not account for hills, stops, GPS drift, weather, or fatigue.",
  "password-generator": "No generator can protect a password that is reused, exposed, or stored insecurely; use a password manager and MFA.",
  "random-number": "Browser randomness is suitable for ordinary draws, not regulated lotteries, audits, or cryptographic key generation.",
  "json-formatter": "Valid syntax does not mean the data matches an application’s schema or business rules.",
  "csv-json": "Complex spreadsheets, formulas, encodings, and schema types may need a dedicated data tool.",
  base64: "Base64 is an encoding, not encryption, and anyone can decode the output.",
  "color-converter": "Screens and color profiles can render the same numeric color differently.",
  "qr-code": "A generated code preserves the supplied text but cannot verify whether a destination is safe or permanent.",
  timer: "Browsers may throttle background tabs or pause timers when a device sleeps.",
  "image-resize": "Browser memory limits may prevent very large images from loading or exporting.",
  "image-compress": "Compression may reduce visual quality, and PNG inputs may become larger with an unsuitable output format.",
  "name-generator": "Suggestions are from fixed local lists and are not checked for trademarks, domains, culture, or real-world availability.",
  "name-compatibility": "The score is entertainment only and has no evidence-based relationship meaning.",
  "reaction-test": "Device latency, display refresh rate, input hardware, and anticipation affect the score.",
  "memory-game": "The game records this round only and is not a cognitive or medical assessment.",
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

      <section className="mt-8 grid gap-3 md:grid-cols-3" aria-label="Example, privacy, and limitations">
        <div className="rounded-2xl border border-[#e8d9cf] bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#a93d28]">Example</p><p className="mt-2 text-sm leading-6 text-[#6e5a50]">{examples[tool.slug]}</p></div>
        <div className="rounded-2xl border border-[#e8d9cf] bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#a93d28]">Privacy</p><p className="mt-2 text-sm leading-6 text-[#6e5a50]">Tool inputs and files are processed in this browser and are not saved to a Modu Tools account. Ordinary site analytics or ads may load separately.</p></div>
        <div className="rounded-2xl border border-[#e8d9cf] bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.12em] text-[#a93d28]">Limitations</p><p className="mt-2 text-sm leading-6 text-[#6e5a50]">{limitations[tool.slug]}</p></div>
      </section>

      <section className="mt-10" aria-labelledby="related-english-tools">
        <div className="mb-4 flex items-end justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-[#a93d28]">Keep exploring</p><h2 id="related-english-tools" className="text-2xl font-black text-[#271f1b]">Related free tools</h2></div><Link href="/en#all-tools" className="text-sm font-bold text-[#a93d28]">View all →</Link></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{relatedTools(tool).map((item) => <Link key={`${item.group}-${item.slug}`} href={englishToolHref(item)} className="rounded-2xl border border-[#e8d9cf] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#a93d28]"><span className="text-2xl">{item.emoji}</span><strong className="mt-3 block text-[#3f3029]">{item.shortTitle}</strong><small className="mt-1 block leading-5 text-[#806b60]">{item.description}</small></Link>)}</div>
      </section>
    </div>
  );
}
