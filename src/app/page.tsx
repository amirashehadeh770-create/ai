import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight">Marketplace</span>
          <Link
            href="/admin/login"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
          >
            Store admin login
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Independent stores, one marketplace
          </h1>
          <p className="mt-3 text-neutral-600">
            Each store below is a fully separate business — its own products, its own
            checkout, its own team behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Link
              key={store.id}
              href={`/store/${store.slug}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: store.accentColor }}
              />
              <div className="flex items-center gap-4 p-6">
                <Image
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  width={56}
                  height={56}
                  className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-neutral-900 group-hover:underline">
                    {store.name}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600">{store.description}</p>
                  <p className="mt-2 text-xs font-medium text-neutral-400">
                    {store._count.products} products
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {stores.length === 0 && (
          <p className="text-neutral-500">
            No stores yet. Run <code>npx prisma db seed</code> to add sample stores.
          </p>
        )}
      </main>

      <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-400">
        Marketplace — independent stores, one platform.
      </footer>
    </div>
  );
}
