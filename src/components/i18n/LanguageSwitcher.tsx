"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "./I18nProvider";
import { LOCALE_COOKIE, localeNames, localeShort, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale } = useI18n();
  const router = useRouter();
  const next: Locale = locale === "en" ? "ar" : "en";

  function switchTo(target: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => switchTo(next)}
      aria-label={`${localeNames[next]}`}
      title={localeNames[next]}
      className={
        className ||
        "flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
      }
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
      </svg>
      {localeShort[locale]}
    </button>
  );
}
