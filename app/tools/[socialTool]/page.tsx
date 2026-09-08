import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SocialGame from "@/components/viral/SocialGame";
import BirthdayMoon from "@/components/viral/BirthdayMoon";
import { socialGames, type SocialMode } from "@/lib/social-games";

const routes = ["friendship-quiz", "friend-manual", "compliment-card", "moon-compatibility"];
export const dynamicParams = false;
export function generateStaticParams() { return routes.map((socialTool) => ({ socialTool })); }
export async function generateMetadata({ params }: { params: Promise<{ socialTool: string }> }): Promise<Metadata> {
  const { socialTool } = await params;
  if (!routes.includes(socialTool)) return {};
  const game = socialTool === "moon-compatibility" ? { title: "생일 달 궁합 카드", description: "두 생일의 달 모티브로 만드는 오락용 관계 카드. 생년월일을 공유 링크에 넣지 않고 결과를 이미지로 남겨보세요." } : socialGames[socialTool as SocialMode];
  const url = `https://modu-dogu.pages.dev/tools/${socialTool}`;
  const image = `https://modu-dogu.pages.dev/og/social/${socialTool}.png`;
  return { title: `${game.title} - 무료 친구 공유 놀이`, description: game.description, alternates: { canonical: url }, openGraph: { title: game.title, description: game.description, url, images: [{url:image,width:1200,height:630,alt:game.title}] }, twitter: {card:"summary_large_image",title:game.title,description:game.description,images:[image]} };
}
export default async function Page({ params }: { params: Promise<{ socialTool: string }> }) {
  const { socialTool } = await params;
  if (!routes.includes(socialTool)) notFound();
  return socialTool === "moon-compatibility" ? <BirthdayMoon /> : <SocialGame mode={socialTool as SocialMode} />;
}
