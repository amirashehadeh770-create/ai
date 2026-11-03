"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="uppercase transition hover:text-white"
    >
      Sign out
    </button>
  );
}
