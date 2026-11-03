import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getStoreBySlug } from "@/lib/store-data";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminStoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.storeSlug !== storeSlug) {
    notFound();
  }

  const store = await getStoreBySlug(storeSlug);
  if (!store) notFound();

  const [firstWord, ...restWords] = store.name.split(" ");
  const rest = restWords.join(" ");

  return (
    <div
      className="flex min-h-screen flex-col bg-neutral-950 text-neutral-200"
      style={{ "--accent": store.accentColor } as React.CSSProperties}
    >
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="h-1 w-full bg-[var(--accent)]" />
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src={store.logoUrl}
              alt={`${store.name} logo`}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15"
            />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-500">
                Admin
              </span>
              <span className="text-lg font-extrabold uppercase leading-none tracking-widest text-white">
                <span className="text-[var(--accent)]">{firstWord}</span>
                {rest ? <span className="font-semibold"> {rest}</span> : null}
              </span>
            </div>
          </div>
          <AdminNav storeSlug={storeSlug} />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
