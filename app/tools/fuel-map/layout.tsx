import { Metadata } from "next";

export const metadata: Metadata = {
  title: "전국 주유소 최저가 지도 - 시도별 주유소 가격 비교 | 계산기나라",
  description:
    "전국 시도별 최저가 주유소를 지도에서 확인하세요. 휘발유, 경유, LPG 가격을 비교하고 가장 저렴한 주유소를 찾아보세요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
