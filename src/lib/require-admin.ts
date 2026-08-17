import { auth } from "@/auth";

export async function getAdminSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
