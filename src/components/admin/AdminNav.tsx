"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/admin/SignOutButton";

export function AdminNav({ storeSlug }: { storeSlug: string }) {
  const pathname = usePathname();
  const links = [
    { href: `/admin/${storeSlug}/dashboard`, label: "Dashboard" },
    { href: `/admin/${storeSlug}/products`, label: "Products" },
    { href: `/admin/${storeSlug}/orders`, label: "Orders" },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-6 text-sm font-medium uppercase tracking-wide text-neutral-400">
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`border-b-2 pb-0.5 transition ${
              active ? "border-[var(--accent)] text-white" : "border-transparent hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <Link
        href={`/store/${storeSlug}`}
        className="rounded-md border border-white/20 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/10"
      >
        View storefront
      </Link>
      <SignOutButton />
    </nav>
  );
}
