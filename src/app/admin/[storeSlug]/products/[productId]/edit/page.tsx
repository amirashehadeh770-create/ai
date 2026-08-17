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
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Edit product</h1>
      <ProductForm storeSlug={storeSlug} categories={categories} product={product} />
    </div>
  );
}
