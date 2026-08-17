"use client";

import { useEffect, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";

export function CheckoutSuccessContent({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = use(params);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart(storeSlug);
  }, [storeSlug, clearCart]);

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">Thank you for your order!</h1>
      <p className="mt-3 text-neutral-600">
        Your payment was successful. A confirmation has been recorded for this order.
      </p>
      {sessionId && <p className="mt-4 text-xs text-neutral-400">Reference: {sessionId}</p>}
      <Link
        href={`/store/${storeSlug}`}
        className="mt-8 inline-block rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        Continue shopping
      </Link>
    </div>
  );
}
