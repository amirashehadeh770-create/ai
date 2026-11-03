"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ALLOWED_IMAGE_HOSTS } from "@/lib/allowed-image-hosts";

type Category = { id: string; name: string };

const inputClass =
  "mt-1.5 w-full rounded-md border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[var(--accent)] focus:outline-none";

type ProductFormProps = {
  storeSlug: string;
  categories: Category[];
  product?: {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    imageUrl: string;
    stock: number;
    categoryId: string | null;
  };
};

export function ProductForm({ storeSlug, categories, product }: ProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(
    product ? (product.priceCents / 100).toFixed(2) : ""
  );
  const [imageUrl, setImageUrl] = useState(
    product?.imageUrl ?? "https://picsum.photos/seed/new-product/600/600"
  );
  const [stock, setStock] = useState(product ? String(product.stock) : "0");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name,
      description,
      priceCents: Math.round(Number(price) * 100),
      imageUrl,
      stock: Number(stock),
      categoryId: categoryId || null,
    };

    const res = await fetch(
      product ? `/api/admin/products/${product.id}` : "/api/admin/products",
      {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong");
      setLoading(false);
      return;
    }

    router.push(`/admin/${storeSlug}/products`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5 rounded-xl border border-white/10 bg-neutral-900 p-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Price (USD)</label>
          <input
            required
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Image URL</label>
        <input
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className={inputClass}
        />
        <p className="mt-1 text-xs text-neutral-500">
          Must be an https:// URL from: {ALLOWED_IMAGE_HOSTS.join(", ")}
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-[var(--accent)] px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving…" : product ? "Save changes" : "Create product"}
      </button>
    </form>
  );
}
