import type { Metadata } from "next";
import { telepathyTierCopy, type TelepathyTier } from "@/lib/telepathy";

const tiers: TelepathyTier[] = ["perfect", "great", "spark"];

export function generateStaticParams() {
  return tiers.map((tier) => ({ tier }));
}

export async function generateMetadata({ params }: { params: Promise<{ tier: string }> }): Promise<Metadata> {
  const { tier: rawTier } = await params;
  const tier = tiers.includes(rawTier as TelepathyTier) ? rawTier as TelepathyTier : "spark";
  const copy = telepathyTierCopy[tier];
  return {
    title: `${copy.title} - 친구 텔레파시 결과`,
    description: `${copy.description} 친구와 같은 질문에 답하고 텔레파시 일치율을 확인해보세요.`,
    alternates: { canonical: `/tools/telepathy-game/result/${tier}` },
    robots: { index: false, follow: true },
    openGraph: {
      title: `${copy.emoji} ${copy.title} | 친구 텔레파시`,
      description: "우리 둘의 텔레파시는 몇 퍼센트일까요? 결과를 확인하고 나와도 비교해보세요.",
      url: `/tools/telepathy-game/result/${tier}`,
      images: ["/og-image.png"],
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
