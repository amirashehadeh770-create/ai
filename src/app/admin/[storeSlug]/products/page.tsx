import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <Link
          href={`/admin/${storeSlug}/products/new`}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Add product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Product</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 rounded object-cover"
                    />
                    <span className="font-medium text-neutral-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-neutral-600">
                  {product.category?.name ?? "—"}
                </td>
                <td className="px-4 py-2 text-neutral-800">{formatPrice(product.priceCents)}</td>
                <td className="px-4 py-2 text-neutral-600">{product.stock}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/${storeSlug}/products/${product.id}/edit`}
                      className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
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
          <p className="p-4 text-sm text-neutral-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
