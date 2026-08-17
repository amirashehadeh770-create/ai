import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

type ProductSeed = {
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  category: string;
};

type StoreSeed = {
  slug: string;
  name: string;
  description: string;
  accentColor: string;
  logoUrl: string;
  adminEmail: string;
  adminPassword: string;
  categories: string[];
  products: ProductSeed[];
};

const stores: StoreSeed[] = [
  {
    slug: "urban-threads",
    name: "Urban Threads",
    description: "Everyday streetwear and apparel, made to last.",
    accentColor: "#e11d48",
    logoUrl: "https://picsum.photos/seed/urban-threads-logo/128/128",
    adminEmail: "admin@urbanthreads.test",
    adminPassword: "urbanthreads123",
    categories: ["Tops", "Bottoms", "Accessories"],
    products: [
      {
        name: "Classic Crew Tee",
        slug: "classic-crew-tee",
        description: "100% cotton crew neck tee in a relaxed fit.",
        priceCents: 2500,
        imageUrl: "https://picsum.photos/seed/ut-1/600/600",
        stock: 40,
        category: "Tops",
      },
      {
        name: "Heavyweight Hoodie",
        slug: "heavyweight-hoodie",
        description: "Brushed fleece hoodie built for cold mornings.",
        priceCents: 6800,
        imageUrl: "https://picsum.photos/seed/ut-2/600/600",
        stock: 25,
        category: "Tops",
      },
      {
        name: "Straight Leg Denim",
        slug: "straight-leg-denim",
        description: "Mid-rise straight leg jeans in washed indigo.",
        priceCents: 7200,
        imageUrl: "https://picsum.photos/seed/ut-3/600/600",
        stock: 30,
        category: "Bottoms",
      },
      {
        name: "Cargo Joggers",
        slug: "cargo-joggers",
        description: "Tapered joggers with utility pockets.",
        priceCents: 5900,
        imageUrl: "https://picsum.photos/seed/ut-4/600/600",
        stock: 35,
        category: "Bottoms",
      },
      {
        name: "Canvas Tote Bag",
        slug: "canvas-tote-bag",
        description: "Heavy canvas tote with reinforced straps.",
        priceCents: 1800,
        imageUrl: "https://picsum.photos/seed/ut-5/600/600",
        stock: 60,
        category: "Accessories",
      },
      {
        name: "Wool Beanie",
        slug: "wool-beanie",
        description: "Ribbed knit beanie in merino wool.",
        priceCents: 2200,
        imageUrl: "https://picsum.photos/seed/ut-6/600/600",
        stock: 50,
        category: "Accessories",
      },
    ],
  },
  {
    slug: "greenleaf-grocer",
    name: "GreenLeaf Grocer",
    description: "Fresh produce and pantry staples, delivered.",
    accentColor: "#16a34a",
    logoUrl: "https://picsum.photos/seed/greenleaf-logo/128/128",
    adminEmail: "admin@greenleafgrocer.test",
    adminPassword: "greenleaf123",
    categories: ["Produce", "Pantry", "Dairy"],
    products: [
      {
        name: "Organic Avocados (3-pack)",
        slug: "organic-avocados-3-pack",
        description: "Ripe, ready-to-eat organic avocados.",
        priceCents: 599,
        imageUrl: "https://picsum.photos/seed/gg-1/600/600",
        stock: 100,
        category: "Produce",
      },
      {
        name: "Heirloom Tomatoes (lb)",
        slug: "heirloom-tomatoes-lb",
        description: "Locally grown heirloom tomatoes, sold by the pound.",
        priceCents: 449,
        imageUrl: "https://picsum.photos/seed/gg-2/600/600",
        stock: 80,
        category: "Produce",
      },
      {
        name: "Extra Virgin Olive Oil 500ml",
        slug: "extra-virgin-olive-oil-500ml",
        description: "Cold-pressed olive oil, single origin.",
        priceCents: 1299,
        imageUrl: "https://picsum.photos/seed/gg-3/600/600",
        stock: 60,
        category: "Pantry",
      },
      {
        name: "Artisan Sourdough Loaf",
        slug: "artisan-sourdough-loaf",
        description: "Naturally leavened sourdough, baked daily.",
        priceCents: 699,
        imageUrl: "https://picsum.photos/seed/gg-4/600/600",
        stock: 40,
        category: "Pantry",
      },
      {
        name: "Free-Range Eggs (dozen)",
        slug: "free-range-eggs-dozen",
        description: "A dozen large free-range eggs.",
        priceCents: 549,
        imageUrl: "https://picsum.photos/seed/gg-5/600/600",
        stock: 70,
        category: "Dairy",
      },
      {
        name: "Grass-Fed Butter 250g",
        slug: "grass-fed-butter-250g",
        description: "Creamy, cultured grass-fed butter.",
        priceCents: 649,
        imageUrl: "https://picsum.photos/seed/gg-6/600/600",
        stock: 55,
        category: "Dairy",
      },
    ],
  },
  {
    slug: "technest",
    name: "TechNest",
    description: "Gadgets and accessories for modern living.",
    accentColor: "#2563eb",
    logoUrl: "https://picsum.photos/seed/technest-logo/128/128",
    adminEmail: "admin@technest.test",
    adminPassword: "technest123",
    categories: ["Audio", "Wearables", "Accessories"],
    products: [
      {
        name: "Wireless Earbuds Pro",
        slug: "wireless-earbuds-pro",
        description: "Active noise cancelling earbuds with 30h battery.",
        priceCents: 12900,
        imageUrl: "https://picsum.photos/seed/tn-1/600/600",
        stock: 45,
        category: "Audio",
      },
      {
        name: "Bluetooth Travel Speaker",
        slug: "bluetooth-travel-speaker",
        description: "Compact waterproof speaker with 20h playtime.",
        priceCents: 5900,
        imageUrl: "https://picsum.photos/seed/tn-2/600/600",
        stock: 35,
        category: "Audio",
      },
      {
        name: "Fitness Tracker Band",
        slug: "fitness-tracker-band",
        description: "Heart-rate and sleep tracking wristband.",
        priceCents: 4900,
        imageUrl: "https://picsum.photos/seed/tn-3/600/600",
        stock: 50,
        category: "Wearables",
      },
      {
        name: "Smartwatch Series X",
        slug: "smartwatch-series-x",
        description: "AMOLED display smartwatch with GPS.",
        priceCents: 19900,
        imageUrl: "https://picsum.photos/seed/tn-4/600/600",
        stock: 20,
        category: "Wearables",
      },
      {
        name: "65W USB-C Fast Charger",
        slug: "65w-usb-c-fast-charger",
        description: "Compact GaN charger, charges laptops and phones.",
        priceCents: 3400,
        imageUrl: "https://picsum.photos/seed/tn-5/600/600",
        stock: 65,
        category: "Accessories",
      },
      {
        name: "Braided USB-C Cable 2m",
        slug: "braided-usb-c-cable-2m",
        description: "Durable braided cable rated for 20k bends.",
        priceCents: 1500,
        imageUrl: "https://picsum.photos/seed/tn-6/600/600",
        stock: 90,
        category: "Accessories",
      },
    ],
  },
];

async function main() {
  const credentialLines: string[] = [
    "# Seeded Admin Credentials",
    "",
    "Generated by `prisma/seed.ts`. These are for local development / demo use only.",
    "",
    "| Store | Login URL | Email | Password |",
    "|---|---|---|---|",
  ];

  for (const storeSeed of stores) {
    const passwordHash = await bcrypt.hash(storeSeed.adminPassword, 10);

    const store = await prisma.store.upsert({
      where: { slug: storeSeed.slug },
      update: {
        name: storeSeed.name,
        description: storeSeed.description,
        accentColor: storeSeed.accentColor,
        logoUrl: storeSeed.logoUrl,
      },
      create: {
        slug: storeSeed.slug,
        name: storeSeed.name,
        description: storeSeed.description,
        accentColor: storeSeed.accentColor,
        logoUrl: storeSeed.logoUrl,
      },
    });

    await prisma.adminUser.upsert({
      where: { email: storeSeed.adminEmail },
      update: { passwordHash, storeId: store.id },
      create: {
        email: storeSeed.adminEmail,
        passwordHash,
        storeId: store.id,
      },
    });

    const categoryIdByName = new Map<string, string>();
    for (const categoryName of storeSeed.categories) {
      const slug = categoryName.toLowerCase().replace(/\s+/g, "-");
      const category = await prisma.category.upsert({
        where: { storeId_slug: { storeId: store.id, slug } },
        update: { name: categoryName },
        create: { storeId: store.id, name: categoryName, slug },
      });
      categoryIdByName.set(categoryName, category.id);
    }

    for (const product of storeSeed.products) {
      await prisma.product.upsert({
        where: { storeId_slug: { storeId: store.id, slug: product.slug } },
        update: {
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          stock: product.stock,
          categoryId: categoryIdByName.get(product.category),
        },
        create: {
          storeId: store.id,
          categoryId: categoryIdByName.get(product.category),
          name: product.name,
          slug: product.slug,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
          stock: product.stock,
        },
      });
    }

    credentialLines.push(
      `| ${storeSeed.name} | /admin/login (store: \`${storeSeed.slug}\`) | ${storeSeed.adminEmail} | ${storeSeed.adminPassword} |`
    );

    console.log(`Seeded store "${storeSeed.name}" (${storeSeed.slug})`);
  }

  const fs = await import("node:fs/promises");
  await fs.writeFile("SEED_CREDENTIALS.md", credentialLines.join("\n") + "\n", "utf-8");

  console.log("\nAdmin credentials written to SEED_CREDENTIALS.md\n");
  console.log(credentialLines.join("\n"));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
