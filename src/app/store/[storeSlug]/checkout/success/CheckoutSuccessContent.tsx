"use client";

import { useEffect, use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useI18n } from "@/components/i18n/I18nProvider";

export function CheckoutSuccessContent({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = use(params);
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((state) => state.clearCart);
  const { t } = useI18n();

  useEffect(() => {
    clearCart(storeSlug);
  }, [storeSlug, clearCart]);

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-neutral-900">{t.checkout.successTitle}</h1>
      <p className="mt-3 text-neutral-600">{t.checkout.successBody}</p>
      {sessionId && (
        <p className="mt-4 text-xs text-neutral-400">
          {t.checkout.reference} {sessionId}
        </p>
      )}
      <Link
        href={`/store/${storeSlug}`}
        className="mt-8 inline-block rounded-md bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
      >
        {t.cart.continueShopping}
      </Link>
    </div>
  );
}
