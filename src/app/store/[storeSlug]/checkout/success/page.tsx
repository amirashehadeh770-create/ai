import { Suspense } from "react";
import { CheckoutSuccessContent } from "./CheckoutSuccessContent";

export default function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ storeSlug: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent params={params} />
    </Suspense>
  );
}
