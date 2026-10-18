import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_IMAGE_HOSTS, isAllowedImageUrl } from "@/lib/allowed-image-hosts";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.storeId !== session.user.storeId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const { name, description, priceCents, imageUrl, stock, categoryId } = body;

  if (categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: categoryId, storeId: session.user.storeId },
    });
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }
  }

  if (imageUrl != null && !isAllowedImageUrl(imageUrl)) {
    return NextResponse.json(
      {
        error: `Image URL must be an https:// URL from one of: ${ALLOWED_IMAGE_HOSTS.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      priceCents: priceCents != null ? Number(priceCents) : undefined,
      imageUrl,
      stock: stock != null ? Number(stock) : undefined,
      categoryId: categoryId || null,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing || existing.storeId !== session.user.storeId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return NextResponse.json(
        { error: "This product has existing orders and can't be deleted." },
        { status: 409 }
      );
    }
    throw err;
  }

  return NextResponse.json({ success: true });
}
