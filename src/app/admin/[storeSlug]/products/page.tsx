import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

const LOW_STOCK = 5;

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await requireStoreBySlug(storeSlug);

  const products = await prisma.product.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Catalog</p>
          <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white">Products</h1>
        </div>
        <Link
          href={`/admin/${storeSlug}/products/new`}
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Product</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Price</th>
              <th className="px-4 py-3 font-semibold">Stock</th>
              <th className="px-4 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-md object-cover ring-1 ring-white/10"
                    />
                    <span className="font-semibold text-white">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {product.category ? (
                    <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-medium uppercase text-neutral-300 ring-1 ring-white/10">
                      {product.category.name}
                    </span>
                  ) : (
                    <span className="text-neutral-500">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-white">{formatPrice(product.priceCents)}</td>
                <td className={`px-4 py-3 font-medium ${product.stock <= LOW_STOCK ? "text-[var(--accent)]" : "text-neutral-300"}`}>
                  {product.stock}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/admin/${storeSlug}/products/${product.id}/edit`}
                      className="text-xs font-bold uppercase tracking-wide text-neutral-300 transition hover:text-white"
                    >
                      Edit
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
