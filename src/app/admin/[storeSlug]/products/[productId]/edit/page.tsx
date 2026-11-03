import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productId: string }>;
}) {
  const { storeSlug, productId } = await params;
  const store = await requireStoreBySlug(storeSlug);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id: productId } }),
    prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } }),
  ]);

  if (!product || product.storeId !== store.id) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Catalog</p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white">Edit product</h1>
      </div>
      <ProductForm storeSlug={storeSlug} categories={categories} product={product} />
    </div>
  );
}
