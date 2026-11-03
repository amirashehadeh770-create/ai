"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl ?? "/admin/redirect");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-neutral-950 px-6 py-16 text-neutral-200">
      <div className="mx-auto w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-8">
        <div className="mb-6 h-1 w-12 rounded-full bg-red-600" />
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-white">Store admin login</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Each store has its own separate admin account.
        </p>
  
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-neutral-400">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-white/15 bg-neutral-950 px-3 py-2 text-sm text-white focus:border-red-600 focus:outline-none"
            />
          </div>
  
          {error && <p className="text-sm text-red-400">{error}</p>}
  
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
  
        <p className="mt-6 text-center text-xs text-neutral-500">
          Demo credentials are in <code>SEED_CREDENTIALS.md</code> after seeding.
        </p>
        <Link
          href="/"
          className="mt-4 block text-center text-sm font-medium text-neutral-400 hover:text-white"
        >
          ← Back to marketplace
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
