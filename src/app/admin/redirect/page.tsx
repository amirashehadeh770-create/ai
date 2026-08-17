import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AdminRedirectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  redirect(`/admin/${session.user.storeSlug}/dashboard`);
}
