"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sections } from "@/lib/sections";

const MAX_LINKS = 9;

export default function Sidebar({ type }: { type: "calculators" | "tools" }) {
  const pathname = usePathname();
  if (pathname === "/tools/friend-inbox") return null;
  const activeSection = sections.find((section) =>
    section.items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)),
  );
  const fallbackKey = type === "tools" ? "tools" : "life";
  const section = activeSection ?? sections.find((candidate) => candidate.key === fallbackKey) ?? sections[0];
  const current = section.items.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  const items = [
    ...(current ? [current] : []),
    ...section.items.filter((item) => item.href !== current?.href && item.featured),
    ...section.items.filter((item) => item.href !== current?.href && !item.featured),
  ].slice(0, MAX_LINKS);

  return (
    <aside className="hidden w-56 flex-shrink-0 lg:block">
      <nav className="sticky top-20 rounded-2xl border border-[#e7ddd6] bg-white p-3" aria-label={`${section.fullLabel} 바로가기`}>
        <div className="mb-2 flex items-center justify-between px-2 py-1">
          <p className="text-xs font-black tracking-[0.08em] text-[#a93d28]">{section.icon} {section.fullLabel}</p>
          <Link href={`/category/${section.key}`} className="text-[11px] text-gray-500 hover:text-[#a93d28]">전체</Link>
        </div>
        <ul className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-3 py-2 text-sm transition-colors ${
                    active ? "bg-[#fff0e9] font-bold text-[#9d3926]" : "text-gray-600 hover:bg-[#faf6f3] hover:text-gray-900"
                  }`}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/#store-tool-directory" className="mt-3 block border-t border-[#eee6e1] px-2 pt-3 text-xs font-bold text-gray-500 hover:text-[#a93d28]">
          다른 도구도 구경하기 →
        </Link>
      </nav>
    </aside>
  );
}
