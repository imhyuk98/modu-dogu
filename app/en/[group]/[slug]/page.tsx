import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EnglishToolPage from "@/components/en/EnglishToolPage";
import { englishToolHref, englishTools, getEnglishTool } from "@/lib/en-tools";

const baseUrl = "https://modu-dogu.pages.dev";

export const dynamicParams = false;

export function generateStaticParams() {
  return englishTools.map((tool) => ({ group: tool.group, slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ group: string; slug: string }> }): Promise<Metadata> {
  const { group, slug } = await params;
  const tool = getEnglishTool(group, slug);
  if (!tool) return {};
  const englishPath = englishToolHref(tool);
  const koreanPath = `/${tool.group}/${tool.slug}`;
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: {
      canonical: englishPath,
      languages: { en: englishPath, ko: koreanPath, "x-default": koreanPath },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      title: `${tool.title} | Modu Tools`,
      description: tool.description,
      url: `${baseUrl}${englishPath}`,
      images: ["/og-image.png"],
    },
    twitter: { card: "summary_large_image", title: `${tool.title} | Modu Tools`, description: tool.description, images: ["/og-image.png"] },
  };
}

export default async function EnglishToolRoute({ params }: { params: Promise<{ group: string; slug: string }> }) {
  const { group, slug } = await params;
  const tool = getEnglishTool(group, slug);
  if (!tool) notFound();
  const path = englishToolHref(tool);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: tool.title, description: tool.description, url: `${baseUrl}${path}`, applicationCategory: tool.section === "fun" ? "EntertainmentApplication" : "UtilitiesApplication", operatingSystem: "Any", inLanguage: "en", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      <EnglishToolPage tool={tool} />
    </>
  );
}
