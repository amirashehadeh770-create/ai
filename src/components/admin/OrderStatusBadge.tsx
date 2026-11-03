const STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-500/15 text-green-400 ring-green-500/30",
  fulfilled: "bg-sky-500/15 text-sky-400 ring-sky-500/30",
  cancelled: "bg-red-500/15 text-red-400 ring-red-500/30",
};

export function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ring-1 ${
        STATUS_STYLES[status] ?? "bg-white/5 text-neutral-300 ring-white/15"
      }`}
    >
      {status}
    </span>
  );
}
