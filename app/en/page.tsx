import type { Metadata } from "next";
import EnglishHome from "@/components/en/EnglishHome";

export const metadata: Metadata = {
  title: { absolute: "Modu Tools — Free Calculators & Online Tools" },
};

export default function EnglishHomePage() {
  return <EnglishHome />;
}
