"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { cartTotalCents, useCartItems, useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

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

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">Your cart is empty</h1>
        <Link
          href={`/store/${storeSlug}`}
          className="mt-4 inline-block text-sm font-medium text-neutral-600 underline hover:text-neutral-900"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Your cart</h1>

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
            <p className="w-20 text-right text-sm font-semibold text-neutral-900">
              {formatPrice(item.priceCents * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(storeSlug, item.productId)}
              className="text-sm font-medium text-neutral-400 hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Link
          href={`/store/${storeSlug}`}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Continue shopping
        </Link>
        <div className="text-right">
          <p className="text-sm text-neutral-500">Total</p>
          <p className="text-xl font-bold text-neutral-900">{formatPrice(total)}</p>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/store/${storeSlug}/checkout`}
          className="rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Proceed to checkout
        </Link>
      </div>
    </div>
  );
}
