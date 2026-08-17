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
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Add product</h1>
      <ProductForm storeSlug={storeSlug} categories={categories} />
    </div>
  );
}
