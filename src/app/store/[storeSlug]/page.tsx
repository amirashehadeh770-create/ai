import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StoreHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { storeSlug } = await params;
  const { category } = await searchParams;

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        storeId: store.id,
        ...(category ? { category: { slug: category } } : {}),
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">{store.name}</h1>
        <p className="mt-2 max-w-2xl text-neutral-600">{store.description}</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/store/${storeSlug}`}
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            !category
              ? "bg-neutral-900 text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/store/${storeSlug}?category=${c.slug}`}
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              category === c.slug
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/store/${storeSlug}/product/${product.slug}`}
            className="group overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
          >
            <div className="aspect-square w-full overflow-hidden bg-neutral-100">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={400}
                height={400}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h2 className="text-sm font-medium text-neutral-900">{product.name}</h2>
              <p className="mt-1 text-sm font-semibold text-neutral-700">
                {formatPrice(product.priceCents)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-neutral-500">No products found in this category.</p>
      )}
    </div>
  );
}
