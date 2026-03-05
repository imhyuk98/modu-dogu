import { Metadata } from "next";
import { sections } from "@/lib/sections";

export function generateStaticParams() {
  return sections.map((s) => ({ slug: s.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const section = sections.find((s) => s.key === slug);
  if (!section) {
    return { title: "카테고리 | 계산기나라", description: "무료 온라인 계산기 모음" };
  }

  const title = `${section.fullLabel} - 무료 온라인 ${section.fullLabel} 모음 | 계산기나라`;
  const description = section.description;

  return {
    title,
    description,
    openGraph: { title, description },
    alternates: { canonical: `https://vibe-revenue.pages.dev/category/${slug}` },
  };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
