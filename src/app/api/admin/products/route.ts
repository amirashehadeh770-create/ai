import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_IMAGE_HOSTS, isAllowedImageUrl } from "@/lib/allowed-image-hosts";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, priceCents, imageUrl, stock, categoryId } = body;

  if (!name || !description || priceCents == null || !imageUrl) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!isAllowedImageUrl(imageUrl)) {
    return NextResponse.json(
      {
        error: `Image URL must be an https:// URL from one of: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, storeId: session.user.storeId },
    });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
  }

  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 1;
  while (
    await prisma.product.findUnique({
      where: { storeId_slug: { storeId: session.user.storeId, slug } },
    })
  ) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const product = await prisma.product.create({
    data: {
      storeId: session.user.storeId,
      categoryId: categoryId || null,
      name,
      slug,
      description,
      priceCents: Number(priceCents),
      imageUrl,
      stock: Number(stock ?? 0),
    },
  });

  return NextResponse.json(product, { status: 201 });
}
