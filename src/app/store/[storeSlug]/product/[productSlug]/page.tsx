import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "@/components/store/AddToCartButton";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ storeSlug: string; productSlug: string }>;
}) {
  const { storeSlug, productSlug } = await params;
  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const product = await prisma.product.findUnique({
    where: { storeId_slug: { storeId: store.id, slug: productSlug } },
    include: { category: true },
  });
  if (!product) notFound();

  return (
    <div>
      <Link
        href={`/store/${storeSlug}`}
        className="mb-6 inline-block text-sm font-medium text-neutral-500 hover:text-neutral-900"
      >
        ← Back to {store.name}
      </Link>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div>
          {product.category && (
            <p className="text-sm font-medium text-neutral-400">{product.category.name}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">{product.name}</h1>
          <p className="mt-3 text-xl font-semibold text-neutral-800">
            {formatPrice(product.priceCents)}
          </p>
          <p className="mt-4 text-neutral-600">{product.description}</p>
          <p className="mt-2 text-sm text-neutral-400">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="mt-6 max-w-xs">
            <AddToCartButton
              storeSlug={storeSlug}
              productId={product.id}
              name={product.name}
              slug={product.slug}
              priceCents={product.priceCents}
              imageUrl={product.imageUrl}
              accentColor={store.accentColor}
              inStock={product.stock > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
