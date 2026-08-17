"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

type AddToCartButtonProps = {
  storeSlug: string;
  productId: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl: string;
  accentColor: string;
  inStock: boolean;
};

export function AddToCartButton({
  storeSlug,
  productId,
  name,
  slug,
  priceCents,
  imageUrl,
  accentColor,
  inStock,
}: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  if (!inStock) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-md bg-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-500"
      >
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addItem(storeSlug, { productId, name, slug, priceCents, imageUrl });
        setAdded(true);
        router.refresh();
        setTimeout(() => setAdded(false), 1500);
      }}
      style={{ backgroundColor: accentColor }}
      className="w-full rounded-md px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
    >
      {added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
