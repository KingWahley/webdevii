"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-neutral-100 flex flex-col justify-center items-center px-6 py-12">
      <div className="w-full max-w-md space-y-8 bg-[#161616] border border-[#262626] p-8 sm:p-10 rounded-[2.5rem] shadow-2xl">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-[#FF6B35] uppercase tracking-wider">
            <span>●</span>
            <span>Admin Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">
            Portfolio Dashboard
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sign in to manage projects, blog posts, messages, and profile settings.
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800/80 rounded-2xl text-red-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@example.com"
              className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-white rounded-2xl p-4 text-sm outline-none transition duration-300 placeholder-neutral-700"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••••••"
              className="w-full bg-[#0F0F0F] border border-[#262626] focus:border-[#FF6B35] focus:ring-0 text-white rounded-2xl p-4 text-sm outline-none transition duration-300 placeholder-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF6B35] text-neutral-950 font-black uppercase py-4 rounded-2xl text-xs tracking-wider hover:bg-[#e05a2b] active:scale-95 transition duration-300 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#FF6B35]/20"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="pt-4 border-t border-[#262626] text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-white transition-colors"
          >
            ← Return to Portfolio Website
          </Link>
        </div>
      </div>
    </div>
  );
}
