import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { getI18n } from "@/lib/i18n";

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

  const { t } = await getI18n();
  const accent = store.accentColor;

  const [categories, allProducts, products] = await Promise.all([
    prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { name: "asc" },
      select: { id: true, categoryId: true, imageUrl: true },
    }),
    prisma.product.findMany({
      where: {
        storeId: store.id,
        ...(category ? { category: { slug: category } } : {}),
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const imageForCategory = (categoryId: string) =>
    allProducts.find((p) => p.categoryId === categoryId)?.imageUrl ?? allProducts[0]?.imageUrl;

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="bg-neutral-950 text-neutral-200">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-neutral-950">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(60% 90% at 82% 20%, ${accent}55, transparent 60%), radial-gradient(40% 60% at 78% 80%, ${accent}22, transparent 70%)`,
          }}
        />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 py-24 md:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-400">
            {store.name}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight text-white sm:text-6xl">
            {t.storeHome.heroTitleLine1}
            <br />
            <span style={{ color: accent }}>{t.storeHome.heroTitleLine2}</span>
          </h1>
          <p className="max-w-xl text-lg text-neutral-300">{store.description}</p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Link
              href={`/store/${storeSlug}#products`}
              className="rounded-md px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              {t.storeHome.shopNow}
            </Link>
            <Link
              href={`/store/${storeSlug}#categories`}
              className="rounded-md border border-white/25 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
            >
              {t.storeHome.browseCategories}
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold tracking-tight text-white">{t.storeHome.shopByCategory}</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categories.map((c) => {
            const img = imageForCategory(c.id);
            return (
              <Link
                key={c.id}
                href={`/store/${storeSlug}?category=${c.slug}#products`}
                className="group relative overflow-hidden rounded-lg border border-white/10 bg-neutral-900"
              >
                <div className="aspect-square w-full overflow-hidden">
                  {img && (
                    <Image
                      src={img}
                      alt={c.name}
                      width={400}
                      height={400}
                      className="h-full w-full object-cover opacity-80 transition group-hover:scale-105 group-hover:opacity-100"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                </div>
                <span className="absolute inset-x-0 bottom-0 bg-neutral-100 py-2 text-center text-sm font-semibold text-neutral-900">
                  {c.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Special Offers banner */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div
          className="flex flex-col items-start justify-between gap-6 rounded-xl border border-white/10 p-8 sm:flex-row sm:items-center"
          style={{ background: `linear-gradient(120deg, ${accent}22, rgba(255,255,255,0.03))` }}
        >
          <div>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white">
              {t.storeHome.specialOffers}
            </h2>
            <p className="mt-1 text-neutral-300">{t.storeHome.specialOffersBody}</p>
          </div>
          <Link
            href={`/store/${storeSlug}#products`}
            className="shrink-0 rounded-md border border-white/30 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
          >
            {t.storeHome.viewMore}
          </Link>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {activeCategory ? activeCategory.name : t.storeHome.allProducts}
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/store/${storeSlug}#products`}
              className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                !category
                  ? "text-neutral-900"
                  : "bg-white/5 text-neutral-300 hover:bg-white/10"
              }`}
              style={!category ? { backgroundColor: accent, color: "#fff" } : undefined}
            >
              {t.storeHome.all}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/store/${storeSlug}?category=${c.slug}#products`}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  category === c.slug
                    ? "text-white"
                    : "bg-white/5 text-neutral-300 hover:bg-white/10"
                }`}
                style={category === c.slug ? { backgroundColor: accent } : undefined}
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/store/${storeSlug}/product/${product.slug}`}
              className="group overflow-hidden rounded-lg border border-white/10 bg-neutral-900 transition hover:border-white/25 hover:shadow-lg hover:shadow-black/40"
            >
              <div className="aspect-square w-full overflow-hidden bg-neutral-800">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-white">{product.name}</h3>
                <p className="mt-1 text-sm font-semibold" style={{ color: accent }}>
                  {formatPrice(product.priceCents)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-neutral-400">{t.storeHome.noProducts}</p>
        )}
      </section>
    </div>
  );
}
