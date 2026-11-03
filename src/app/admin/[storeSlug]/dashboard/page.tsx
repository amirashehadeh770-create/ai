import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await requireStoreBySlug(storeSlug);

  const [productCount, orders, paidOrders] = await Promise.all([
    prisma.product.count({ where: { storeId: store.id } }),
    prisma.order.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
    prisma.order.findMany({ where: { storeId: store.id, status: "paid" } }),
  ]);

  const totalOrders = await prisma.order.count({ where: { storeId: store.id } });
  const revenueCents = paidOrders.reduce((sum, o) => sum + o.totalCents, 0);

  const stats = [
    { label: "Products", value: String(productCount), icon: <BoxIcon />, href: `/admin/${storeSlug}/products` },
    { label: "Total orders", value: String(totalOrders), icon: <BagIcon />, href: `/admin/${storeSlug}/orders` },
    { label: "Revenue (paid)", value: formatPrice(revenueCents), icon: <CoinIcon />, href: `/admin/${storeSlug}/orders` },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Overview</p>
          <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white">Dashboard</h1>
        </div>
        <Link
          href={`/admin/${storeSlug}/products/new`}
          className="rounded-md bg-[var(--accent)] px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90"
        >
          Add product
        </Link>
      </div>

      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-6 transition hover:border-white/25"
          >
            <div className="absolute inset-y-0 start-0 w-1 bg-[var(--accent)]" />
            <div className="flex items-start justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">{stat.label}</p>
              <span className="text-[var(--accent)]">{stat.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-extrabold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-extrabold uppercase tracking-tight text-white">Recent orders</h2>
        <Link
          href={`/admin/${storeSlug}/orders`}
          className="text-sm font-bold uppercase text-neutral-400 transition hover:text-white"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-neutral-900">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Items</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.03]">
                <td className="px-4 py-3 text-neutral-200">{order.customerEmail}</td>
                <td className="px-4 py-3 text-neutral-400">{order.items.length}</td>
                <td className="px-4 py-3 font-semibold text-white">{formatPrice(order.totalCents)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 text-neutral-500">{order.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="px-4 py-10 text-center text-sm text-neutral-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

function BoxIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="m3 8 9 5 9-5" />
      <path d="M12 13v8" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 7h14l-1 14H6z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9.5c-.5-1-1.6-1.5-3-1.5-1.7 0-3 .8-3 2s1.3 1.7 3 2 3 .8 3 2-1.3 2-3 2c-1.4 0-2.5-.5-3-1.5" />
      <path d="M12 6v2M12 16v2" />
    </svg>
  );
}
