import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { getI18n, tf } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const FEATURED_COUNT = 6;

export default async function StoreHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ storeSlug: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { storeSlug } = await params;
  const { category, q } = await searchParams;
  const query = q?.trim() ?? "";

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const { t } = await getI18n();
  const accent = store.accentColor;

  const [categories, allProducts, products] = await Promise.all([
    prisma.category.findMany({ where: { storeId: store.id }, orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "asc" },
      include: { category: { select: { name: true } } },
    }),
    prisma.product.findMany({
      where: {
        storeId: store.id,
        ...(category ? { category: { slug: category } } : {}),
        ...(query ? { name: { contains: query, mode: "insensitive" as const } } : {}),
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const imageForCategory = (categoryId: string) =>
    allProducts.find((p) => p.categoryId === categoryId)?.imageUrl ?? allProducts[0]?.imageUrl;

  const activeCategory = categories.find((c) => c.slug === category);
  const featured = allProducts.slice(0, FEATURED_COUNT);
  const promoImage = allProducts.at(-1)?.imageUrl;
  const performImage = allProducts.at(-2)?.imageUrl ?? promoImage;

  const perks = [
    { icon: <BadgeIcon />, title: t.storeHome.perkQuality, body: t.storeHome.perkQualityBody },
    { icon: <TruckIcon />, title: t.storeHome.perkShipping, body: t.storeHome.perkShippingBody },
    { icon: <ShieldIcon />, title: t.storeHome.perkSecure, body: t.storeHome.perkSecureBody },
    { icon: <ReturnIcon />, title: t.storeHome.perkReturns, body: t.storeHome.perkReturnsBody },
    { icon: <HeadsetIcon />, title: t.storeHome.perkSupport, body: t.storeHome.perkSupportBody },
  ];

  let productsHeading = activeCategory ? activeCategory.name : t.storeHome.allProducts;
  if (query) productsHeading = tf(t.storeHome.resultsFor, { q: query });

  return (
    <div className="bg-white text-neutral-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-neutral-950 text-white">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(55% 80% at 75% 35%, ${accent}33, transparent 65%)`,
          }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-6xl">
              {t.storeHome.heroTitleLine1}
              <br />
              <span style={{ color: accent }}>{t.storeHome.heroTitleLine2}</span>
            </h1>
            <p className="max-w-md text-lg text-neutral-300">{store.description}</p>

            <form
              action={`/store/${storeSlug}#products`}
              className="max-w-lg rounded-lg border border-white/15 bg-white/5 p-4"
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-300">
                {t.storeHome.findParts}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  name="category"
                  defaultValue={category ?? ""}
                  aria-label={t.nav.categories}
                  className="rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white"
                >
                  <option value="">{t.storeHome.allCategories}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder={t.nav.searchPlaceholder}
                  className="min-w-0 flex-1 rounded-md border border-white/15 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500"
                />
                <button
                  type="submit"
                  className="rounded-md px-5 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  {t.storeHome.findPartsButton}
                </button>
              </div>
            </form>
          </div>

          {store.heroImageUrl && (
            <div className="relative">
              <Image
                src={store.heroImageUrl}
                alt={store.name}
                width={802}
                height={492}
                sizes="(min-width: 768px) 560px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="h-auto w-full rounded-xl [mask-image:radial-gradient(85%_85%_at_50%_50%,#000_60%,transparent_100%)]"
              />
            </div>
          )}
        </div>

        {/* Perks */}
        <div className="relative border-t border-white/10 bg-neutral-900/80">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-6 sm:grid-cols-3 lg:grid-cols-5">
            {perks.map((perk) => (
              <li key={perk.title} className="flex items-center gap-3">
                <span className="shrink-0 text-neutral-300">{perk.icon}</span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wide text-white">
                    {perk.title}
                  </span>
                  <span className="block text-xs text-neutral-400">{perk.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Shop by Category */}
      <section id="categories" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="text-center text-2xl font-extrabold uppercase tracking-tight">
          {t.storeHome.shopByCategory}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-8">
          {categories.map((c) => {
            const img = imageForCategory(c.id);
            return (
              <Link
                key={c.id}
                href={`/store/${storeSlug}?category=${c.slug}#products`}
                className="group flex w-28 flex-col items-center text-center"
              >
                <span className="h-24 w-24 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 transition group-hover:ring-2 group-hover:ring-neutral-900">
                  {img && (
                    <Image
                      src={img}
                      alt={c.name}
                      width={192}
                      height={192}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  )}
                </span>
                <span className="mt-3 text-sm font-bold uppercase">{c.name}</span>
                <span className="text-xs text-neutral-500">{t.storeHome.shopNow}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-14">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold uppercase tracking-tight">{t.storeHome.featured}</h2>
            <Link
              href={`/store/${storeSlug}#products`}
              className="flex items-center gap-2 text-sm font-bold uppercase hover:underline"
            >
              {t.storeHome.viewAll}
              <ArrowIcon />
            </Link>
          </div>
          <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                href={`/store/${storeSlug}/product/${product.slug}`}
                name={product.name}
                imageUrl={product.imageUrl}
                price={formatPrice(product.priceCents)}
                subtitle={product.category?.name}
                className="w-44 shrink-0 snap-start sm:w-48 lg:w-auto"
              />
            ))}
          </div>
        </section>
      )}

      {/* Promo banners */}
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-14 md:grid-cols-2">
        <PromoBanner
          imageUrl={promoImage}
          eyebrow={t.storeHome.limitedOffer}
          eyebrowColor={accent}
          title={<>{t.storeHome.specialOffers}</>}
          body={t.storeHome.specialOffersBody}
          cta={
            <Link
              href={`/store/${storeSlug}#products`}
              className="inline-block rounded-md px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
              style={{ backgroundColor: accent }}
            >
              {t.storeHome.shopDeals}
            </Link>
          }
        />
        <PromoBanner
          imageUrl={performImage}
          eyebrow={t.storeHome.performEyebrow}
          title={
            <>
              {t.storeHome.performTitleLine1}{" "}
              <span style={{ color: accent }}>{t.storeHome.performTitleLine2}</span>
            </>
          }
          cta={
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/store/${storeSlug}?category=${c.slug}#products`}
                  className="rounded-md border border-white/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-white/10"
                >
                  {c.name}
                </Link>
              ))}
            </div>
          }
        />
      </section>

      {/* All products */}
      <section id="products" className="border-t border-neutral-200 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold uppercase tracking-tight">{productsHeading}</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/store/${storeSlug}#products`}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  !category ? "text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100"
                }`}
                style={!category ? { backgroundColor: accent } : undefined}
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
                      : "bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100"
                  }`}
                  style={category === c.slug ? { backgroundColor: accent } : undefined}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                href={`/store/${storeSlug}/product/${product.slug}`}
                name={product.name}
                imageUrl={product.imageUrl}
                price={formatPrice(product.priceCents)}
              />
            ))}
          </div>

          {products.length === 0 && <p className="text-neutral-500">{t.storeHome.noProducts}</p>}
        </div>
      </section>
    </div>
  );
}

function ProductCard({
  href,
  name,
  imageUrl,
  price,
  subtitle,
  className = "",
}: {
  href: string;
  name: string;
  imageUrl: string;
  price: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-neutral-300 hover:shadow-md ${className}`}
    >
      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
        <Image
          src={imageUrl}
          alt={name}
          width={400}
          height={400}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        {subtitle && <p className="text-xs uppercase text-neutral-500">{subtitle}</p>}
        <h3 className="text-sm font-medium text-neutral-900">{name}</h3>
        <p className="mt-1 text-sm font-bold text-neutral-900">{price}</p>
      </div>
    </Link>
  );
}

function PromoBanner({
  imageUrl,
  eyebrow,
  eyebrowColor,
  title,
  body,
  cta,
}: {
  imageUrl?: string;
  eyebrow: string;
  eyebrowColor?: string;
  title: React.ReactNode;
  body?: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-56 overflow-hidden rounded-xl bg-neutral-950 text-white">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt=""
          width={400}
          height={400}
          className="absolute inset-y-0 end-0 h-full w-1/2 object-cover opacity-70 [mask-image:linear-gradient(to_right,transparent,#000_45%)] rtl:[mask-image:linear-gradient(to_left,transparent,#000_45%)]"
        />
      )}
      <div className="relative flex max-w-[65%] flex-col justify-center gap-3 p-7">
        <p
          className="text-xs font-bold uppercase tracking-widest text-neutral-300"
          style={eyebrowColor ? { color: eyebrowColor } : undefined}
        >
          {eyebrow}
        </p>
        <h2 className="text-2xl font-extrabold uppercase leading-tight tracking-tight sm:text-3xl">
          {title}
        </h2>
        {body && <p className="text-sm text-neutral-300">{body}</p>}
        <div className="mt-1">{cta}</div>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="rtl:rotate-180">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 14-1.5 8 5-3 5 3-1.5-8" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 4h14v12H1z" />
      <path d="M15 9h4l4 4v3h-8z" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <path d="M21 15a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2zM3 15a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z" />
      <path d="M18 17v1a3 3 0 0 1-3 3h-3" />
    </svg>
  );
}
