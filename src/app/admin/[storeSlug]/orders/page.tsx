import { prisma } from "@/lib/prisma";
import { requireStoreBySlug } from "@/lib/store-data";
import { formatPrice } from "@/lib/format";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  const { storeSlug } = await params;
  const store = await requireStoreBySlug(storeSlug);

  const orders = await prisma.order.findMany({
    where: { storeId: store.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--accent)]">Sales</p>
        <h1 className="mt-1 text-3xl font-extrabold uppercase tracking-tight text-white">Orders</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-white/10 bg-neutral-900 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-white">{order.customerEmail}</p>
                <p className="text-xs text-neutral-500">
                  {order.createdAt.toLocaleString()} · {order.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-extrabold text-white">{formatPrice(order.totalCents)}</span>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
            </div>
            <ul className="mt-4 space-y-1 border-t border-white/5 pt-3 text-sm text-neutral-400">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} × {item.quantity} — {formatPrice(item.priceCents * item.quantity)}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {orders.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 bg-neutral-900/50 px-4 py-14 text-center">
            <p className="font-semibold text-white">No orders yet</p>
            <p className="mt-1 text-sm text-neutral-500">New orders from your storefront will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
