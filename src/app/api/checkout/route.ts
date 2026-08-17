import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CheckoutRequestItem = {
  productId: string;
  quantity: number;
};

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const storeSlug: string | undefined = body.storeSlug;
  const email: string | undefined = body.email;
  const items: CheckoutRequestItem[] | undefined = body.items;

  if (!storeSlug || !email || !items || items.length === 0) {
    return NextResponse.json({ error: "Missing storeSlug, email, or items" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({ where: { slug: storeSlug } });
  if (!store) {
    return NextResponse.json({ error: "Store not found" }, { status: 404 });
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, storeId: store.id },
  });

  if (products.length !== productIds.length) {
    return NextResponse.json(
      { error: "One or more products are invalid for this store" },
      { status: 400 }
    );
  }

  const quantityByProductId = new Map(items.map((i) => [i.productId, i.quantity]));

  for (const product of products) {
    const quantity = quantityByProductId.get(product.id) ?? 0;
    if (quantity < 1 || quantity > product.stock) {
      return NextResponse.json(
        { error: `${product.name} does not have enough stock` },
        { status: 400 }
      );
    }
  }

  const totalCents = products.reduce(
    (sum, product) => sum + product.priceCents * (quantityByProductId.get(product.id) ?? 0),
    0
  );

  const order = await prisma.order.create({
    data: {
      storeId: store.id,
      customerEmail: email,
      status: "pending",
      totalCents,
      items: {
        create: products.map((product) => ({
          productId: product.id,
          quantity: quantityByProductId.get(product.id) ?? 0,
          priceCents: product.priceCents,
        })),
      },
    },
  });

  const origin = req.nextUrl.origin;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: products.map((product) => ({
      quantity: quantityByProductId.get(product.id) ?? 0,
      price_data: {
        currency: "usd",
        unit_amount: product.priceCents,
        product_data: {
          name: product.name,
          images: [product.imageUrl],
        },
      },
    })),
    success_url: `${origin}/store/${storeSlug}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/store/${storeSlug}/checkout`,
    metadata: { orderId: order.id, storeSlug },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return NextResponse.json({ url: session.url });
}
