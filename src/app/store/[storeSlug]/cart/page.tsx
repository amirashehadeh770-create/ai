"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { cartTotalCents, useCartItems, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/components/i18n/I18nProvider";

export default function CartPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = use(params);
  const items = useCartItems(storeSlug);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = cartTotalCents(items);
  const { t, dir } = useI18n();

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">{t.cart.empty}</h1>
        <Link
          href={`/store/${storeSlug}`}
          className="mt-4 inline-block text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
        >
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">{t.cart.title}</h1>

      <div className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 py-4">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={72}
              height={72}
              className="h-18 w-18 rounded-md object-cover"
            />
            <div className="flex-1">
              <Link
                href={`/store/${storeSlug}/product/${item.slug}`}
                className="font-medium text-neutral-900 hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-sm text-neutral-500">{formatPrice(item.priceCents)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                setQuantity(storeSlug, item.productId, Number(e.target.value))
              }
              className="w-16 rounded-md border border-neutral-300 px-2 py-1 text-center text-sm"
            />
            <p className="w-20 text-end text-sm font-semibold text-neutral-900">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(storeSlug, item.productId)}
              className="text-sm font-medium text-neutral-400 hover:text-red-600"
            >
              {t.cart.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/store/${storeSlug}`}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          {dir === "rtl" ? "→" : "←"} {t.cart.continueShopping}
        </Link>
        <div className="text-end">
          <p className="text-sm text-neutral-500">{t.cart.total}</p>
          <p className="text-xl font-bold text-neutral-900">{formatPrice(total)}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/store/${storeSlug}/checkout`}
          className="rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          {t.cart.proceedToCheckout}
        </Link>
      </div>
    </div>
  );
}
