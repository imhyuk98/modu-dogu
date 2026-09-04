import { Metadata } from "next";
import { calculateBMI } from "@/lib/calculations";

const HEIGHTS = [150, 155, 160, 163, 165, 168, 170, 173, 175, 178, 180, 183, 185, 190];
const WEIGHTS = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

export function generateStaticParams() {
  const params: { params: string }[] = [];
  for (const h of HEIGHTS) {
    for (const w of WEIGHTS) {
      params.push({ params: `${h}-${w}` });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ params: string }>;
}): Promise<Metadata> {
  const { params: slug } = await params;
  const [heightStr, weightStr] = slug.split("-");
  const height = parseInt(heightStr);
  const weight = parseInt(weightStr);
  const result = calculateBMI(height, weight);

  const title = `키 ${height}cm 몸무게 ${weight}kg BMI ${result.bmi} (${result.category}) | 모두의도구`;
  const description = `키 ${height}cm, 몸무게 ${weight}kg의 BMI는 ${result.bmi}로 '${result.category}' 범위입니다. ${result.description} BMI 계산 결과와 표준 체중, 건강 관리 팁을 확인하세요.`;

  return {
    alternates: { canonical: "/calculators/bmi" },
    robots: { index: false, follow: true },
    title,
    description,
    keywords: [
      `키 ${height} 몸무게 ${weight} BMI`,
      `${height}cm ${weight}kg BMI`,
      `BMI ${result.bmi}`,
      `BMI ${result.category}`,
      `키 ${height}cm 표준체중`,
      "BMI 계산기",
      "체질량지수 계산",
    ],
    openGraph: {
      images: ["/og-image.png"],
      title,
      description,
      url: `https://modu-dogu.pages.dev/calculators/bmi/${slug}`,
    },
    other: {
      "script:ld+json": JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: `BMI 계산기 - 키 ${height}cm 몸무게 ${weight}kg`,
        description,
        url: `https://modu-dogu.pages.dev/calculators/bmi/${slug}`,
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "KRW",
        },
      }),
    },
  };
}

export default function BMIParamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
