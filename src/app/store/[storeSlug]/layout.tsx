import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/store-data";
import { StoreHeader } from "@/components/store/StoreHeader";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await getStoreBySlug(storeSlug);

  if (!store) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col">
      <StoreHeader
        storeSlug={store.slug}
        storeName={store.name}
        logoUrl={store.logoUrl}
        accentColor={store.accentColor}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
      <footer className="border-t border-neutral-200 bg-white py-6 text-center text-sm text-neutral-400">
        {store.name} — part of the Marketplace platform.
      </footer>
    </div>
  );
}
