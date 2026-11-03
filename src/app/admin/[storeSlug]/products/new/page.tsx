import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await requireStoreBySlug(storeSlug);
  const categories = await prisma.category.findMany({
    where: { storeId: store.id },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Catalog</p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white">Add product</h1>
      </div>
      <ProductForm storeSlug={storeSlug} categories={categories} />
    </div>
  );
}
