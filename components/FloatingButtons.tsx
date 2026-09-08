"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";

const subscribeToTheme = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("theme-change", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("theme-change", onStoreChange);
  };
};

const getThemeSnapshot = () => localStorage.getItem("theme") === "dark";
const getServerThemeSnapshot = () => false;
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerClientSnapshot = () => false;

export default function FloatingButtons() {
  const pathname = usePathname();
  const dark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  const mounted = useSyncExternalStore(
    subscribeToClient,
    getClientSnapshot,
    getServerClientSnapshot,
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  };

  if (!mounted || ["friendship-quiz", "friend-manual", "friend-chemistry", "compliment-card", "moon-compatibility", "friend-inbox"].some(slug => pathname === `/tools/${slug}`)) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {/* Dark mode toggle */}
      <button
        onClick={toggleTheme}
        className="site-float-theme w-11 h-11 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center"
        aria-label={dark ? "라이트 모드" : "다크 모드"}
      >
        {dark ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="site-float-top w-11 h-11 text-white rounded-full shadow-lg transition-all hover:scale-105 flex items-center justify-center"
        aria-label="맨 위로 이동"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
