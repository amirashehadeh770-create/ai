import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";

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

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Dashboard</h1>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Products</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{productCount}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Total orders</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{totalOrders}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <p className="text-sm text-neutral-500">Revenue (paid)</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{formatPrice(revenueCents)}</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Recent orders</h2>
        <Link
          href={`/admin/${storeSlug}/orders`}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          View all →
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Items</th>
              <th className="px-4 py-2 font-medium">Total</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-2 text-neutral-800">{order.customerEmail}</td>
                <td className="px-4 py-2 text-neutral-600">{order.items.length}</td>
                <td className="px-4 py-2 font-medium text-neutral-900">
                  {formatPrice(order.totalCents)}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-neutral-500">
                  {order.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-4 text-sm text-neutral-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
