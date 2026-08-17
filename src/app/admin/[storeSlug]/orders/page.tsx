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
      <h1 className="mb-6 text-2xl font-bold text-neutral-900">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-lg border border-neutral-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-neutral-900">{order.customerEmail}</p>
                <p className="text-xs text-neutral-400">
                  {order.createdAt.toLocaleString()} · {order.id}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-900">
                  {formatPrice(order.totalCents)}
                </span>
                <OrderStatusSelect orderId={order.id} status={order.status} />
              </div>
            </div>
            <ul className="mt-3 space-y-1 text-sm text-neutral-600">
              {order.items.map((item) => (
                <li key={item.id}>
                  {item.product.name} × {item.quantity} — {formatPrice(item.priceCents * item.quantity)}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {orders.length === 0 && (
          <p className="text-sm text-neutral-500">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
