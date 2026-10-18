import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getI18n, tf } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export const dynamic = "force-dynamic";

const NAV_ITEMS = [
  { key: "home", icon: HomeIcon, active: true },
  { key: "allStores", icon: GridIcon, active: false },
  { key: "parts", icon: GearIcon, active: false },
  { key: "modsAccessories", icon: WrenchIcon, active: false },
  { key: "myGarage", icon: CarIcon, active: false },
  { key: "orders", icon: BoxIcon, active: false },
  { key: "saved", icon: HeartIcon, active: false },
  { key: "notifications", icon: BellIcon, active: false },
  { key: "support", icon: SupportIcon, active: false },
] as const;

export default async function HomePage() {
  const { t } = await getI18n();
  const stores = await prisma.store.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { products: true } },
      categories: { orderBy: { name: "asc" }, select: { name: true } },
    },
  });

  return (
    <div className="w-full flex-1 bg-neutral-950 text-neutral-200">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-500">
              <TurboIcon />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-extrabold uppercase tracking-widest text-white">
                Twin <span className="text-red-500">Turbo</span>
              </span>
              <span className="block text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                {t.brand.tagline}
              </span>
            </span>
          </Link>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              <SearchIcon />
            </span>
            <input
              type="search"
              placeholder={t.nav.searchPlaceholder}
              className="w-full rounded-full border border-white/10 bg-neutral-900 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-red-500/50 focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300">
              <BellIcon />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </span>
            <LanguageSwitcher className="hidden items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white sm:flex" />
            <Link
              href="/admin/login"
              className="flex items-center gap-2 rounded-full border border-white/10 py-1 pl-3 pr-1 text-sm text-neutral-200 transition hover:border-white/25"
            >
              <span className="hidden text-xs text-neutral-400 sm:block">{t.nav.storeAdmin}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-neutral-300">
                <UserIcon />
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1440px] gap-6 px-4 py-6 sm:px-6">
        {/* Sidebar */}
        <aside className="hidden w-60 shrink-0 lg:block">
          <nav className="space-y-1 rounded-2xl border border-white/10 bg-neutral-900/40 p-3">
            {NAV_ITEMS.map(({ key, icon: Icon, active }) => (
              <span
                key={key}
                className={`flex cursor-default items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-red-600 text-white"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon />
                {t.nav[key]}
              </span>
            ))}
          </nav>

          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-red-600/20 to-neutral-900 p-5">
            <p className="text-sm font-bold text-red-400">{t.brand.onePlatformTitle}</p>
            <p className="mt-1 text-xs leading-relaxed text-neutral-400">
              {t.brand.onePlatformBody}
            </p>
            <span className="mt-4 block text-sm font-extrabold uppercase tracking-widest text-white">
              Twin <span className="text-red-500">Turbo</span>
            </span>
          </div>
        </aside>

        {/* Main column */}
        <main className="min-w-0 flex-1 space-y-8">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-900">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(70% 120% at 85% 15%, rgba(225,29,72,0.45), transparent 55%), radial-gradient(50% 80% at 70% 90%, rgba(225,29,72,0.18), transparent 70%)",
              }}
            />
            <div className="relative flex flex-col gap-4 px-8 py-14 sm:px-12 sm:py-16">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
                {t.landing.heroEyebrow}
              </p>
              <h1 className="max-w-2xl text-3xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl">
                {t.landing.heroTitleLine1}
                <br />
                <span className="text-red-500">{t.landing.heroTitleLine2}</span>
              </h1>
              <p className="max-w-lg text-sm text-neutral-300 sm:text-base">
                {t.landing.heroSubtitle}
              </p>
            </div>
          </section>

          {/* Available stores */}
          <section>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white sm:text-2xl">{t.landing.availableStores}</h2>
              <span className="text-neutral-500">
                <GridIcon />
              </span>
            </div>
            <p className="mb-6 text-sm text-neutral-500">
              {t.landing.availableStoresSubtitle}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {stores.map((store) => (
                <Link
                  key={store.id}
                  href={`/store/${store.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 transition hover:-translate-y-0.5 hover:border-red-500/50"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/${store.slug}-banner/800/400`}
                      alt={`${store.name} storefront`}
                      width={800}
                      height={400}
                      className="h-full w-full object-cover opacity-70 transition group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
                    <div className="absolute inset-x-4 bottom-3 flex items-center gap-3">
                      <Image
                        src={store.logoUrl}
                        alt={`${store.name} logo`}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/20"
                      />
                      <span className="text-lg font-extrabold uppercase tracking-wide text-white drop-shadow">
                        {store.name}
                      </span>
                    </div>
                    <span
                      className="absolute left-4 top-4 h-1.5 w-10 rounded-full"
                      style={{ backgroundColor: store.accentColor }}
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm leading-relaxed text-neutral-400">{store.description}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-3 text-xs text-neutral-300">
                      {store.categories.slice(0, 3).map((c) => (
                        <span key={c.name} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          {c.name}
                        </span>
                      ))}
                      <span className="flex items-center gap-1.5 text-neutral-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-600" />
                        {tf(t.landing.productsCount, { count: store._count.products })}
                      </span>
                    </div>

                    <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition group-hover:bg-red-500">
                      {t.landing.visitStore}
                      <span className="rtl:rotate-180">
                        <ArrowIcon />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {stores.length === 0 && (
              <p className="text-neutral-500">{t.landing.noStores}</p>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-4 px-6 py-8 text-sm text-neutral-500 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3 text-neutral-400">
            <SocialDot label="IG" />
            <SocialDot label="TT" />
            <SocialDot label="YT" />
            <SocialDot label="WA" />
          </div>
          <p>{t.landing.footerRights}</p>
          <p className="uppercase tracking-widest text-neutral-600">{t.landing.footerSlogan}</p>
        </div>
      </footer>
    </div>
  );
}

function SocialDot({ label }: { label: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[10px] font-bold text-neutral-400">
      {label}
    </span>
  );
}

/* ---- inline icons (no icon dependency) ---- */
function iconProps() {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function TurboIcon() {
  return (
    <svg {...iconProps()} width={22} height={22}>
      <circle cx="10" cy="14" r="6" />
      <path d="M10 14h11a3 3 0 0 0 0-6h-6" />
      <path d="M14 8a4 4 0 0 0-4-4" />
      <circle cx="10" cy="14" r="1.5" fill="currentColor" />
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8.6 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.2.62.78 1.05 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function WrenchIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.7 2.7-2.7-2.7z" />
    </svg>
  );
}
function CarIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M5 13 6.5 8a2 2 0 0 1 1.9-1.4h7.2A2 2 0 0 1 17.5 8L19 13" />
      <path d="M3 13h18v5H3z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </svg>
  );
}
function BoxIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M21 8 12 3 3 8l9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
    </svg>
  );
}
function HeartIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M20.8 5.6a5 5 0 0 0-7.1 0L12 7.3l-1.7-1.7a5 5 0 1 0-7.1 7.1L12 21l8.8-8.3a5 5 0 0 0 0-7.1z" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <path d="M18 19a2 2 0 0 1-2 2h-3" />
      <rect x="2" y="15" width="4" height="6" rx="1" />
      <rect x="18" y="15" width="4" height="6" rx="1" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg {...iconProps()} width={16} height={16}>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg {...iconProps()} width={16} height={16}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
