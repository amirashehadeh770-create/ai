import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    storeId: string;
    storeSlug: string;
    storeName: string;
  }

  interface Session {
    user: {
      storeId: string;
      storeSlug: string;
      storeName: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    storeId?: string;
    storeSlug?: string;
    storeName?: string;
  }
}
