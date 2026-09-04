export type EnglishToolGroup = "calculators" | "tools";

export interface EnglishTool {
  slug: string;
  group: EnglishToolGroup;
  section: "calculators" | "web-tools" | "fun";
  title: string;
  shortTitle: string;
  description: string;
  emoji: string;
  keywords: string[];
  featured?: boolean;
}

export const englishTools: EnglishTool[] = [
  {
    slug: "age",
    group: "calculators",
    section: "calculators",
    title: "Age Calculator",
    shortTitle: "Age Calculator",
    description: "Calculate your exact age, total days lived, and time until your next birthday.",
    emoji: "🎂",
    keywords: ["age calculator", "how old am I", "birthday calculator", "exact age"],
    featured: true,
  },
  {
    slug: "percent",
    group: "calculators",
    section: "calculators",
    title: "Percentage Calculator",
    shortTitle: "Percentage",
    description: "Calculate percentages, percentage change, discounts, and proportions in seconds.",
    emoji: "📊",
    keywords: ["percentage calculator", "percent change", "discount calculator"],
    featured: true,
  },
  {
    slug: "bmi",
    group: "calculators",
    section: "calculators",
    title: "BMI Calculator",
    shortTitle: "BMI Calculator",
    description: "Check your body mass index using metric or US units and see the standard BMI range.",
    emoji: "⚖️",
    keywords: ["BMI calculator", "body mass index", "healthy weight calculator"],
  },
  {
    slug: "unit-converter",
    group: "calculators",
    section: "calculators",
    title: "Unit Converter",
    shortTitle: "Unit Converter",
    description: "Convert length, weight, and temperature units with instant, accurate results.",
    emoji: "🔄",
    keywords: ["unit converter", "length converter", "weight converter", "temperature converter"],
  },
  {
    slug: "dday",
    group: "calculators",
    section: "calculators",
    title: "Date Difference Calculator",
    shortTitle: "Date Difference",
    description: "Find the number of days between two dates or count down to an important date.",
    emoji: "📅",
    keywords: ["date difference calculator", "days between dates", "date countdown"],
  },
  {
    slug: "character-count",
    group: "calculators",
    section: "calculators",
    title: "Word & Character Counter",
    shortTitle: "Character Counter",
    description: "Count characters, words, sentences, paragraphs, and UTF-8 bytes as you type.",
    emoji: "📝",
    keywords: ["character counter", "word counter", "letter count", "text counter"],
  },
  {
    slug: "password-generator",
    group: "tools",
    section: "web-tools",
    title: "Secure Password Generator",
    shortTitle: "Password Generator",
    description: "Create strong random passwords locally with custom length and character options.",
    emoji: "🔐",
    keywords: ["password generator", "random password", "strong password generator"],
    featured: true,
  },
  {
    slug: "random-number",
    group: "tools",
    section: "web-tools",
    title: "Random Number Generator",
    shortTitle: "Random Number",
    description: "Draw one or more random numbers from any range, with or without duplicates.",
    emoji: "🎲",
    keywords: ["random number generator", "number picker", "random draw"],
  },
  {
    slug: "json-formatter",
    group: "tools",
    section: "web-tools",
    title: "JSON Formatter & Validator",
    shortTitle: "JSON Formatter",
    description: "Format, validate, and minify JSON safely in your browser.",
    emoji: "🧹",
    keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "minify JSON"],
    featured: true,
  },
  {
    slug: "csv-json",
    group: "tools",
    section: "web-tools",
    title: "CSV to JSON Converter",
    shortTitle: "CSV ↔ JSON",
    description: "Convert CSV to JSON or JSON arrays to CSV without uploading your data.",
    emoji: "🔁",
    keywords: ["CSV to JSON", "JSON to CSV", "CSV converter", "data converter"],
  },
  {
    slug: "base64",
    group: "tools",
    section: "web-tools",
    title: "Base64 Encoder & Decoder",
    shortTitle: "Base64 Tool",
    description: "Encode Unicode text to Base64 or decode Base64 back to readable text.",
    emoji: "🔤",
    keywords: ["Base64 encoder", "Base64 decoder", "encode Base64", "decode Base64"],
  },
  {
    slug: "color-converter",
    group: "tools",
    section: "web-tools",
    title: "HEX, RGB & HSL Color Converter",
    shortTitle: "Color Converter",
    description: "Pick a color and instantly copy its HEX, RGB, and HSL values.",
    emoji: "🎨",
    keywords: ["color converter", "HEX to RGB", "RGB to HSL", "color picker"],
  },
  {
    slug: "qr-code",
    group: "tools",
    section: "web-tools",
    title: "Free QR Code Generator",
    shortTitle: "QR Code Generator",
    description: "Turn a URL or any text into a downloadable high-resolution QR code.",
    emoji: "📱",
    keywords: ["QR code generator", "free QR code", "create QR code"],
  },
  {
    slug: "timer",
    group: "tools",
    section: "web-tools",
    title: "Online Timer & Stopwatch",
    shortTitle: "Timer & Stopwatch",
    description: "Run a simple countdown timer or stopwatch in any browser.",
    emoji: "⏱️",
    keywords: ["online timer", "stopwatch", "countdown timer", "web timer"],
  },
  {
    slug: "image-resize",
    group: "tools",
    section: "web-tools",
    title: "Image Resizer",
    shortTitle: "Image Resizer",
    description: "Resize JPG, PNG, and WebP images to exact pixel dimensions in your browser.",
    emoji: "📐",
    keywords: ["image resizer", "resize image", "change image size", "resize photo"],
  },
  {
    slug: "image-compress",
    group: "tools",
    section: "web-tools",
    title: "Image Compressor",
    shortTitle: "Image Compressor",
    description: "Reduce image file size with adjustable quality and download the compressed result.",
    emoji: "🗜️",
    keywords: ["image compressor", "compress image", "reduce image size", "photo compressor"],
  },
  {
    slug: "name-generator",
    group: "tools",
    section: "fun",
    title: "Random Name Generator",
    shortTitle: "Name Generator",
    description: "Generate modern, classic, fantasy, or gender-neutral names for any project.",
    emoji: "✨",
    keywords: ["name generator", "random name generator", "character name generator"],
    featured: true,
  },
  {
    slug: "name-compatibility",
    group: "calculators",
    section: "fun",
    title: "Name Compatibility Test",
    shortTitle: "Name Compatibility",
    description: "Enter two names for a playful, repeatable compatibility score and result card.",
    emoji: "💞",
    keywords: ["name compatibility", "love calculator", "compatibility test"],
  },
  {
    slug: "reaction-test",
    group: "tools",
    section: "fun",
    title: "Reaction Time Test",
    shortTitle: "Reaction Test",
    description: "Measure how quickly you react when the screen changes color.",
    emoji: "⚡",
    keywords: ["reaction time test", "reaction speed", "click speed test"],
  },
  {
    slug: "memory-game",
    group: "tools",
    section: "fun",
    title: "Memory Match Game",
    shortTitle: "Memory Game",
    description: "Flip cards, find every matching pair, and challenge your memory.",
    emoji: "🧠",
    keywords: ["memory game", "card matching game", "memory test"],
  },
];

export const englishSections = [
  {
    key: "calculators" as const,
    label: "Calculators",
    fullLabel: "Everyday calculators",
    icon: "🧮",
    description: "Clear answers for dates, percentages, health, and everyday conversions.",
  },
  {
    key: "web-tools" as const,
    label: "Web tools",
    fullLabel: "Private browser tools",
    icon: "🛠️",
    description: "Fast utilities for text, data, images, passwords, and quick decisions.",
  },
  {
    key: "fun" as const,
    label: "Fun & games",
    fullLabel: "Quick breaks worth sharing",
    icon: "🎮",
    description: "Small games and playful generators for solo breaks or group chats.",
  },
];

export function getEnglishTool(group: string, slug: string) {
  return englishTools.find((tool) => tool.group === group && tool.slug === slug);
}

export function englishToolHref(tool: Pick<EnglishTool, "group" | "slug">) {
  return `/en/${tool.group}/${tool.slug}`;
}

export const localizedKoreanPaths = new Set(
  englishTools.map((tool) => `/${tool.group}/${tool.slug}`),
);
