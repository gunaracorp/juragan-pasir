"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/juragan/logo";
import { ThemeCredit } from "@/components/cms/theme-credit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CMS_NAME,
  CMS_VERSION,
  CMS_CODENAME,
} from "@/lib/cms-version";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  History,
  Inbox,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

/**
 * LOGIN CMS v.3 — DIGIMAN EDITION
 * Split-screen premium: panel kiri peraga brand (desktop), panel kanan form.
 * Animasi: fade-up bertahap, orb bergerak, kilau tombol, guncangan saat error.
 * Logika auth tetap sama: POST /api/admin/login (JWT httpOnly).
 * Kredit tema: PT Digital Bisnis Manajemen — digiman.id
 */

const PANEL_FEATURES = [
  {
    icon: Zap,
    title: "Edit Langsung Tampil",
    desc: "Simpan di dashboard, website berubah seketika.",
  },
  {
    icon: Inbox,
    title: "Leads Masuk Terkontrol",
    desc: "Pipeline 5 status + tautan WhatsApp siap kirim.",
  },
  {
    icon: History,
    title: "Rollback Satu Klik",
    desc: "Setiap konten punya riwayat versi yang aman.",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [shakeKey, setShakeKey] = useState(0);
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
        setShakeKey((k) => k + 1); // picu animasi guncang
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Tidak dapat menghubungi server");
      setShakeKey((k) => k + 1);
      setLoading(false);
    }
  }

  return (
    <div className="grain-texture relative flex min-h-screen bg-night-950 text-white">
      {/* ══ LATAR ══ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tech-grid absolute inset-0" />
        <div className="anim-orb absolute -left-24 top-[-6rem] h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]" />
        <div className="anim-orb absolute -right-24 bottom-[-6rem] h-96 w-96 rounded-full bg-night-600/40 blur-[120px] [animation-delay:-6s]" />
      </div>

      {/* ══ PANEL KIRI — PERAGA BRAND (desktop) ══ */}
      <aside className="relative hidden w-[46%] shrink-0 flex-col justify-between overflow-hidden border-r border-white/10 bg-gradient-to-br from-night-900 via-night-950 to-night-850 p-12 lg:flex xl:p-16">
        <div
          aria-hidden="true"
          className="anim-spin-slow absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full border border-dashed border-gold-500/15"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-gold-500/8 blur-[90px]"
        />

        <div className="anim-fade-up relative">
          <div className="flex items-center gap-3">
            <LogoMark className="h-11 w-11" />
            <div>
              <p className="font-display text-lg font-black tracking-tight">
                {CMS_NAME} <span className="text-gold-400">CMS</span>
              </p>
              <span className="mt-1 inline-block rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-px text-[9px] font-bold uppercase tracking-[0.22em] text-gold-300">
                v.{CMS_VERSION} · {CMS_CODENAME}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <h2 className="anim-fade-up anim-delay-1 font-display text-4xl font-black leading-[1.12] xl:text-5xl">
            Satu Pintu.
            <br />
            <span className="text-gold-v2">Kendali Penuh Website.</span>
          </h2>
          <p className="anim-fade-up anim-delay-2 mt-5 max-w-md text-base leading-relaxed text-white/55">
            Di balik pintu ini seluruh website Anda menanti: produk, testimoni, section,
            leads, sampai export HTML — semua dalam genggaman Anda.
          </p>

          <ul className="mt-10 space-y-4">
            {PANEL_FEATURES.map((f, i) => (
              <li
                key={f.title}
                className={`anim-fade-up anim-delay-${i + 3} flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur transition-colors hover:border-gold-500/35`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gold-500/35 bg-gold-500/12 text-gold-300">
                  <f.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">{f.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-white/50">{f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="anim-fade-in anim-delay-6 relative space-y-2.5">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Juragan Pasir Galunggung — Dibangun dengan {CMS_NAME} CMS
          </p>
          <ThemeCredit variant="line" className="justify-start" />
        </div>
      </aside>

      {/* ══ PANEL KANAN — FORM ══ */}
      <main className="relative flex min-h-screen w-full flex-col items-center justify-center px-4 py-10 sm:px-8 lg:w-[54%]">
        {/* Brand mini (mobile) */}
        <div className="anim-fade-up mb-8 flex flex-col items-center text-center lg:hidden">
          <LogoMark className="h-14 w-14" />
          <h1 className="mt-4 font-display text-2xl font-bold">
            Juragan Pasir <span className="text-gold-400">CMS</span>
          </h1>
          <span className="mt-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
            v.{CMS_VERSION} · {CMS_CODENAME}
          </span>
        </div>

        <div className="anim-fade-up anim-delay-2 w-full max-w-md">
          <div className="mb-6 hidden items-center gap-2 lg:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              CMS v.{CMS_VERSION}
            </span>
          </div>

          <h2 className="font-display text-3xl font-black tracking-tight xl:text-4xl">
            Selamat Datang Kembali
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Masuk untuk mengendalikan konten website Juragan Pasir.
          </p>

          {/* Kartu form */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 rounded-3xl border border-white/10 bg-night-900/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur sm:p-8"
          >
            <div className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-semibold text-white/80">
                  Email admin
                </Label>
                <div className="group relative">
                  <Mail
                    className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-gold-400"
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
                    className="h-12 rounded-xl border-white/15 bg-white/5 pl-10 text-base text-white transition-all placeholder:text-white/30 focus:border-gold-500/50 focus-visible:ring-gold-500/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-white/80">
                    Password
                  </Label>
                  <span className="text-[11px] font-semibold text-white/35">Minimal 8 karakter</span>
                </div>
                <div className="group relative">
                  <LockKeyhole
                    className="absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-white/35 transition-colors group-focus-within:text-gold-400"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl border-white/15 bg-white/5 pl-10 pr-12 text-base text-white transition-all placeholder:text-white/30 focus:border-gold-500/50 focus-visible:ring-gold-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-gold-300"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div key={shakeKey} role="alert" className="anim-shake">
                  <p className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/15 px-4 py-3 text-sm font-medium text-red-300">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="btn-shine h-12 w-full rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 text-base font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] transition-all hover:-translate-y-0.5 hover:from-gold-300 hover:to-gold-500 disabled:translate-y-0 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Memverifikasi…
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-white/35">
            <ShieldCheck className="h-3.5 w-3.5 text-gold-500/60" aria-hidden="true" />
            Kredensial default: admin@juraganpasir.id / juragan2026
          </p>

          <div className="mt-5 flex items-center justify-center gap-5 text-xs font-semibold">
            <Link
              href="/cms"
              className="inline-flex items-center gap-1.5 text-gold-300/80 transition-colors hover:text-gold-300"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Tentang CMS v.{CMS_VERSION}
            </Link>
            <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-white/40 transition-colors hover:text-gold-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Kembali ke website
            </Link>
          </div>

          <ThemeCredit variant="line" className="mt-6" />
        </div>
      </main>
    </div>
  );
}
