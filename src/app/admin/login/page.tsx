"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/juragan/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

/**
 * HALAMAN LOGIN CMS — gerbang masuk backend.
 * Desain konsisten dengan brand: malam + emas.
 */
export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Login gagal");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server");
      setLoading(false);
    }
  }

  return (
    <div className="grain-texture relative flex min-h-screen items-center justify-center bg-night-950 px-4">
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#2e472a]/50 blur-[120px]"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-flex items-center justify-center">
            <LogoMark className="h-14 w-14" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">
            Juragan Pasir <span className="text-gold-400">CMS</span>
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            Panel kendali penuh konten website Anda
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-night-900/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur"
        >
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-semibold text-white/80">
                Email admin
              </Label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                  aria-hidden="true"
                />
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@juraganpasir.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-white/15 bg-white/5 pl-10 text-base text-white placeholder:text-white/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-semibold text-white/80">
                Password
              </Label>
              <div className="relative">
                <LockKeyhole
                  className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                  aria-hidden="true"
                />
                <Input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-white/15 bg-white/5 pl-10 text-base text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/40 bg-destructive/15 px-4 py-3 text-sm font-medium text-red-300"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 text-base font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] hover:from-gold-300 hover:to-gold-500"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Memverifikasi…
                </>
              ) : (
                "Masuk ke Dashboard"
              )}
            </Button>
          </div>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-white/35">
          <ShieldCheck className="h-3.5 w-3.5 text-gold-500/60" aria-hidden="true" />
          Kredensial default: admin@juraganpasir.id / juragan2026
        </p>
        <p className="mt-2 text-center text-xs text-white/30">
          <a href="/" className="transition-colors hover:text-gold-300">
            ← Kembali ke website
          </a>
        </p>
      </div>
    </div>
  );
}
