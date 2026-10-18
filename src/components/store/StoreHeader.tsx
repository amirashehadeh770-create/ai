"use client";

import Image from "next/image";
import Link from "next/link";
import { cartItemCount, useCartItems } from "@/lib/cart-store";
import { useI18n } from "@/components/i18n/I18nProvider";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

type StoreHeaderProps = {
  storeSlug: string;
  storeName: string;
  logoUrl: string;
  accentColor: string;
};

export function StoreHeader({ storeSlug, storeName, logoUrl, accentColor }: StoreHeaderProps) {
  const items = useCartItems(storeSlug);
  const count = cartItemCount(items);
  const { t } = useI18n();

  const [firstWord, ...restWords] = storeName.split(" ");
  const rest = restWords.join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href={`/store/${storeSlug}`} className="flex items-center gap-3">
          <Image
            src={logoUrl}
            alt={`${storeName} logo`}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15"
          />
          <span className="text-lg font-extrabold uppercase tracking-widest text-white">
            <span style={{ color: accentColor }}>{firstWord}</span>
            {rest ? <span className="font-semibold"> {rest}</span> : null}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium uppercase tracking-wide text-neutral-300 md:flex">
          <Link href={`/store/${storeSlug}`} className="transition hover:text-white">
            {t.nav.home}
          </Link>
          <Link href={`/store/${storeSlug}#products`} className="transition hover:text-white">
            {t.nav.shop}
          </Link>
          <Link href={`/store/${storeSlug}#categories`} className="transition hover:text-white">
            {t.nav.categories}
          </Link>
          <Link href="/" className="transition hover:text-white">
            {t.nav.allStores}
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-neutral-300">
          <LanguageSwitcher className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white" />
          <Link
            href={`/store/${storeSlug}#products`}
            aria-label={t.nav.searchPlaceholder}
            className="transition hover:text-white"
          >
            <SearchIcon />
          </Link>
          <Link
            href="/admin/login"
            aria-label={t.nav.storeAdmin}
            className="transition hover:text-white"
          >
            <UserIcon />
          </Link>
          <Link
            href={`/store/${storeSlug}/cart`}
            aria-label={t.nav.cart}
            className="relative transition hover:text-white"
          >
            <CartIcon />
            {count > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
