import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.storeId = user.storeId;
        token.storeSlug = user.storeSlug;
        token.storeName = user.storeName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.storeId = token.storeId as string;
        session.user.storeSlug = token.storeSlug as string;
        session.user.storeName = token.storeName as string;
      }
      return session;
    },
  },
};
