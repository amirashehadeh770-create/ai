"use client";

import { useState, use } from "react";
import Link from "next/link";
import { cartTotalCents, useCartItems } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = use(params);
  const items = useCartItems(storeSlug);
  const total = cartTotalCents(items);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeSlug,
          email,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Checkout</h1>

      <div className="mb-6 rounded-lg border border-neutral-200 bg-white p-4">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between py-1 text-sm">
            <span className="text-neutral-700">
              {item.name} × {item.quantity}
            </span>
            <span className="font-medium text-neutral-900">
              {formatPrice(item.priceCents * item.quantity)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 text-sm font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            placeholder="you@example.com"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Redirecting to payment…" : "Continue to payment"}
        </button>
        <p className="text-center text-xs text-neutral-400">
          You&apos;ll be redirected to Stripe&apos;s secure checkout (test mode).
        </p>
      </form>
    </div>
  );
}
