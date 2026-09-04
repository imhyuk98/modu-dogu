import Sidebar from "@/components/Sidebar";
import AdSidebar from "@/components/AdSidebar";
import CalculatorTrustPanel from "@/components/CalculatorTrustPanel";

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
      <Sidebar type="calculators" />
      <main className="flex-1 min-w-0">
        {children}
        <CalculatorTrustPanel />
      </main>
      <AdSidebar />
    </div>
  );
}
