import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/admin/SignOutButton";

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

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Admin
            </span>
            <h1 className="font-semibold text-neutral-900">{session.user.storeName}</h1>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium text-neutral-600">
            <Link href={`/admin/${storeSlug}/dashboard`} className="hover:text-neutral-900">
              Dashboard
            </Link>
            <Link href={`/admin/${storeSlug}/products`} className="hover:text-neutral-900">
              Products
            </Link>
            <Link href={`/admin/${storeSlug}/orders`} className="hover:text-neutral-900">
              Orders
            </Link>
            <Link href={`/store/${storeSlug}`} className="hover:text-neutral-900">
              Website
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
