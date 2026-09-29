"use client";

import Image from "next/image";
import Link from "next/link";
import { cartItemCount, useCartItems } from "@/lib/cart-store";

type StoreHeaderProps = {
  storeSlug: string;
  storeName: string;
  logoUrl: string;
  accentColor: string;
};

export function StoreHeader({ storeSlug, storeName, logoUrl, accentColor }: StoreHeaderProps) {
  const items = useCartItems(storeSlug);
  const count = cartItemCount(items);

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href={`/store/${storeSlug}`} className="flex items-center gap-3">
          <Image
            src={logoUrl}
            alt={`${storeName} logo`}
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-semibold tracking-tight text-neutral-900">{storeName}</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-neutral-600">
          <Link href={`/store/${storeSlug}`} className="hover:text-neutral-900">
            Website
          </Link>
          <Link href="/" className="hover:text-neutral-900">
            All stores
          </Link>
          <Link href={`/store/${storeSlug}/cart`} className="hover:text-neutral-900">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
        </nav>
      </div>
    </header>
  );
}
