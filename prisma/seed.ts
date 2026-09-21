import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
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
    slug: "redline-auto",
    name: "Redline Auto",
    description: "Performance parts and accessories for cars, from stock upgrades to full builds.",
    accentColor: "#dc2626",
    logoUrl: "https://picsum.photos/seed/redline-auto-logo/128/128",
    adminEmail: "admin@redlineauto.test",
    adminPassword: "redlineauto123",
    categories: ["Engine", "Exterior", "Interior"],
    products: [
      {
        name: "Cold Air Intake Kit",
        slug: "cold-air-intake-kit",
        description: "High-flow intake kit for improved throttle response and sound.",
        priceCents: 18900,
        imageUrl: "https://picsum.photos/seed/redline-1/600/600",
        stock: 30,
        category: "Engine",
      },
      {
        name: "Performance Exhaust System",
        slug: "performance-exhaust-system",
        description: "Cat-back exhaust system with a deeper, sportier tone.",
        priceCents: 34900,
        imageUrl: "https://picsum.photos/seed/redline-2/600/600",
        stock: 15,
        category: "Engine",
      },
      {
        name: "Carbon Fiber Rear Spoiler",
        slug: "carbon-fiber-rear-spoiler",
        description: "Lightweight carbon fiber spoiler for added downforce and style.",
        priceCents: 25900,
        imageUrl: "https://picsum.photos/seed/redline-3/600/600",
        stock: 20,
        category: "Exterior",
      },
      {
        name: "LED Headlight Upgrade Kit",
        slug: "led-headlight-upgrade-kit",
        description: "Plug-and-play LED conversion kit with brighter, whiter light.",
        priceCents: 13900,
        imageUrl: "https://picsum.photos/seed/redline-4/600/600",
        stock: 25,
        category: "Exterior",
      },
      {
        name: "Racing Seat Cover Set",
        slug: "racing-seat-cover-set",
        description: "Bucket-style seat covers with reinforced side bolsters.",
        priceCents: 8900,
        imageUrl: "https://picsum.photos/seed/redline-5/600/600",
        stock: 40,
        category: "Interior",
      },
      {
        name: "Leather Steering Wheel Cover",
        slug: "leather-steering-wheel-cover",
        description: "Hand-stitched leather cover for improved grip and feel.",
        priceCents: 3900,
        imageUrl: "https://picsum.photos/seed/redline-6/600/600",
        stock: 50,
        category: "Interior",
      },
    ],
  },
  {
    slug: "throttle-moto",
    name: "Throttle Moto",
    description: "Gear, parts, and accessories built for riders who live on two wheels.",
    accentColor: "#f59e0b",
    logoUrl: "https://picsum.photos/seed/throttle-moto-logo/128/128",
    adminEmail: "admin@throttlemoto.test",
    adminPassword: "throttlemoto123",
    categories: ["Gear", "Parts", "Accessories"],
    products: [
      {
        name: "Full-Face Helmet",
        slug: "full-face-helmet",
        description: "DOT-certified helmet with anti-fog visor and quick-release strap.",
        priceCents: 19900,
        imageUrl: "https://picsum.photos/seed/throttle-1/600/600",
        stock: 25,
        category: "Gear",
      },
      {
        name: "Armored Riding Jacket",
        slug: "armored-riding-jacket",
        description: "Abrasion-resistant jacket with CE-rated shoulder and elbow armor.",
        priceCents: 22900,
        imageUrl: "https://picsum.photos/seed/throttle-2/600/600",
        stock: 18,
        category: "Gear",
      },
      {
        name: "Chain and Sprocket Kit",
        slug: "chain-and-sprocket-kit",
        description: "Heavy-duty O-ring chain with matched front and rear sprockets.",
        priceCents: 7900,
        imageUrl: "https://picsum.photos/seed/throttle-3/600/600",
        stock: 35,
        category: "Parts",
      },
      {
        name: "Slip-On Exhaust",
        slug: "slip-on-exhaust",
        description: "Lightweight slip-on muffler with a deeper exhaust note.",
        priceCents: 25900,
        imageUrl: "https://picsum.photos/seed/throttle-4/600/600",
        stock: 12,
        category: "Parts",
      },
      {
        name: "Tank Grip Pads",
        slug: "tank-grip-pads",
        description: "Traction pads that keep you locked to the tank under braking.",
        priceCents: 1900,
        imageUrl: "https://picsum.photos/seed/throttle-5/600/600",
        stock: 60,
        category: "Accessories",
      },
      {
        name: "Handlebar Phone Mount",
        slug: "handlebar-phone-mount",
        description: "Vibration-dampened mount for secure phone navigation.",
        priceCents: 2900,
        imageUrl: "https://picsum.photos/seed/throttle-6/600/600",
        stock: 45,
        category: "Accessories",
      },
    ],
  },
];

async function main() {
  const currentSlugs = stores.map((s) => s.slug);
  const removed = await prisma.store.deleteMany({
    where: { slug: { notIn: currentSlugs } },
  });
  if (removed.count > 0) {
    console.log(`Removed ${removed.count} store(s) no longer in the seed data.`);
  }

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
