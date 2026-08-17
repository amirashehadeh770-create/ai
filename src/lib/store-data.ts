import { prisma } from "@/lib/prisma";

export async function getStoreBySlug(storeSlug: string) {
  return prisma.store.findUnique({ where: { slug: storeSlug } });
}

export async function requireStoreBySlug(storeSlug: string) {
  const store = await getStoreBySlug(storeSlug);
  if (!store) {
    throw new Error(`Store not found: ${storeSlug}`);
  }
  return store;
}
