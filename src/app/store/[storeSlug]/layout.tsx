import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/store-data";
import { StoreHeader } from "@/components/store/StoreHeader";
import { getI18n, tf } from "@/lib/i18n";

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

  const { t } = await getI18n();

  return (
    <div className="flex min-h-full flex-col bg-white text-neutral-900">
      <StoreHeader
        storeSlug={store.slug}
        storeName={store.name}
        logoUrl={store.logoUrl}
        accentColor={store.accentColor}
      />

      <main className="w-full flex-1">{children}</main>

      <footer className="border-t border-white/10 bg-neutral-950">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.footer.information}</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              <li><Link href={`/store/${store.slug}`} className="hover:text-white">{t.footer.aboutUs}</Link></li>
              <li><Link href={`/store/${store.slug}`} className="hover:text-white">{t.footer.shipping}</Link></li>
              <li><Link href={`/store/${store.slug}`} className="hover:text-white">{t.footer.returns}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.footer.customerService}</h3>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              <li><Link href={`/store/${store.slug}/cart`} className="hover:text-white">{t.footer.yourCart}</Link></li>
              <li><Link href={`/store/${store.slug}#products`} className="hover:text-white">{t.footer.browseProducts}</Link></li>
              <li><Link href="/admin/login" className="hover:text-white">{t.footer.storeAdmin}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.footer.stayConnected}</h3>
            <p className="mt-4 text-sm text-neutral-400">
              {tf(t.footer.stayConnectedBody, { store: store.name })}
            </p>
            <div className="mt-4 flex max-w-xs overflow-hidden rounded-md border border-white/15">
              <input
                type="email"
                placeholder={t.footer.emailAddress}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
              />
              <span
                className="px-3 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: store.accentColor }}
              >
                {t.footer.join}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">{t.footer.subscribe}</h3>
            <div className="mt-4 flex gap-3 text-neutral-400">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15" aria-hidden>X</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15" aria-hidden>in</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15" aria-hidden>f</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 text-center text-xs text-neutral-500">
          {tf(t.footer.partOfPlatform, { store: store.name })}
        </div>
      </footer>
    </div>
  );
}
