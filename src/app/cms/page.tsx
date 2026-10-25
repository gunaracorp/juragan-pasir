import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/juragan/logo";
import { Reveal } from "@/components/cms/reveal";
import { ThemeCredit } from "@/components/cms/theme-credit";
import {
  CMS_NAME,
  CMS_VERSION,
  CMS_CODENAME,
  CMS_KEUNGGULAN,
  CMS_STATS,
  CMS_TECH,
} from "@/lib/cms-version";
import {
  ArrowRight,
  Database,
  ExternalLink,
  Eye,
  FileDown,
  History,
  Inbox,
  LayoutDashboard,
  ListOrdered,
  MousePointerClick,
  Puzzle,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: `${CMS_NAME} CMS v.${CMS_VERSION} — ${CMS_CODENAME}`,
  description:
    "Platform CMS 3-lapis untuk Juragan Pasir Galunggung: edit di backend, frontend langsung berubah. 9 keunggulan, SEO otomatis, keamanan berlapis.",
};

/** Peta ikon keunggulan (dari cms-version.ts) */
const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  list: ListOrdered,
  database: Database,
  inbox: Inbox,
  history: History,
  export: FileDown,
  search: Search,
  shield: ShieldCheck,
  puzzle: Puzzle,
};

const ALUR = [
  {
    step: "01",
    icon: LayoutDashboard,
    title: "Masuk ke CMS",
    desc: "Login aman ke panel kendali. Semua konten website menanti di satu dashboard.",
  },
  {
    step: "02",
    icon: MousePointerClick,
    title: "Edit & Simpan",
    desc: "Ubah produk, harga, testimoni, urutan section — semua lewat form yang tervalidasi.",
  },
  {
    step: "03",
    icon: Eye,
    title: "Frontend Langsung Berubah",
    desc: "Tanpa deploy, tanpa cache. Website terbaru tampil seketika untuk semua pengunjung.",
  },
];

export default function CmsHomePage() {
  return (
    <div className="grain-texture relative min-h-screen overflow-x-clip bg-night-950 text-white">
      {/* ══ LATAR GLOBAL ══ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="tech-grid absolute inset-0" />
        <div className="anim-orb absolute -top-32 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[130px]" />
        <div className="anim-orb absolute right-[-8rem] top-[38rem] h-96 w-96 rounded-full bg-night-600/40 blur-[110px] [animation-delay:-5s]" />
        <div className="anim-orb absolute left-[-6rem] top-[75rem] h-80 w-80 rounded-full bg-gold-600/10 blur-[100px] [animation-delay:-9s]" />
      </div>

      {/* ══ HEADER ══ */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-night-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/cms" className="flex items-center gap-3">
            <LogoMark className="h-9 w-9" />
            <span className="flex flex-col leading-none">
              <span className="text-sm font-extrabold tracking-tight">
                {CMS_NAME} <span className="text-gold-400">CMS</span>
              </span>
              <span className="mt-1 w-fit rounded-full border border-gold-500/40 bg-gold-500/10 px-2 py-px text-[9px] font-bold uppercase tracking-[0.2em] text-gold-300">
                v.{CMS_VERSION}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/60 md:flex" aria-label="Navigasi CMS">
            <a href="#keunggulan" className="transition-colors hover:text-gold-300">Keunggulan</a>
            <a href="#alur" className="transition-colors hover:text-gold-300">Cara Kerja</a>
            <a href="#teknologi" className="transition-colors hover:text-gold-300">Teknologi</a>
            <a href="#kredit" className="transition-colors hover:text-gold-300">Kredit</a>
          </nav>
          <Link
            href="/admin/login"
            className="btn-shine inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-5 text-sm font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Masuk CMS
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      <main className="relative">
        {/* ══ HERO ══ */}
        <section className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
          <div className="anim-fade-up mx-auto max-w-3xl text-center">
            <span className="anim-pulse-glow inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              CMS v.{CMS_VERSION} — {CMS_CODENAME}
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-[1.08] sm:text-6xl">
              Kendali Penuh Website,
              <br />
              <span className="text-gold-v2">Sekali Simpan Langsung Jadi.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
              {CMS_NAME} adalah CMS tiga lapis — <strong className="text-white/85">Frontend</strong>,{" "}
              <strong className="text-white/85">Backend</strong>, dan{" "}
              <strong className="text-white/85">Integrasi</strong> — yang mengubah website Juragan Pasir
              menjadi sistem hidup: edit di panel admin, perubahan tampil seketika. Tanpa koding. Tanpa ribet.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/admin/login"
                className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3.5 text-base font-bold text-night-950 shadow-[0_16px_44px_rgba(189,151,38,0.4)] transition-transform hover:-translate-y-0.5"
              >
                Masuk ke Dashboard
                <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
              </Link>
              <a
                href="#keunggulan"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-bold text-white/80 transition-colors hover:border-gold-500/50 hover:text-gold-300"
              >
                Jelajahi Keunggulan
              </a>
            </div>
          </div>

          {/* Chip melayang */}
          <div className="anim-float pointer-events-none absolute left-4 top-[25rem] hidden rounded-2xl border border-gold-500/30 bg-night-900/80 px-3.5 py-2.5 shadow-xl backdrop-blur xl:block">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Sinkronisasi</p>
            <p className="text-xs font-extrabold text-gold-300">Admin → Frontend · Real-time</p>
          </div>
          <div className="anim-float pointer-events-none absolute right-6 top-[31rem] hidden rounded-2xl border border-white/15 bg-night-900/80 px-3.5 py-2.5 shadow-xl backdrop-blur [animation-delay:-3s] xl:block">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Export Mandiri</p>
            <p className="text-xs font-extrabold text-white">1 File HTML · Offline</p>
          </div>

          {/* Statistik */}
          <Reveal delay={150} className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {CMS_STATS.map((s) => (
              <div
                key={s.label}
                className="glass-card rounded-2xl px-5 py-6 text-center transition-transform hover:-translate-y-1"
              >
                <p className="font-display text-3xl font-black text-gold-bright sm:text-4xl">{s.value}</p>
                <p className="mt-1.5 text-xs font-bold uppercase tracking-widest text-white/45">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ══ KEUNGGULAN ══ */}
        <section id="keunggulan" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-400">Keunggulan CMS</p>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-5xl">
              Sembilan Alasan Website Ini{" "}
              <span className="text-gold-v2">Tak Pernah Diam</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              Dirancang sebagai mesin pertumbuhan: setiap fitur bekerja agar bisnis Anda tampil
              profesional, cepat dijangkau klien, dan bebas biaya developer berulang.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CMS_KEUNGGULAN.map((k, i) => {
              const Icon = ICONS[k.icon] ?? Sparkles;
              return (
                <Reveal key={k.title} delay={(i % 3) * 110}>
                  <article className="group glass-card relative h-full overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-400/60 hover:shadow-[0_24px_60px_rgba(189,151,38,0.18)]">
                    <div
                      aria-hidden="true"
                      className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold-500/0 blur-2xl transition-all duration-500 group-hover:bg-gold-500/15"
                    />
                    <div className="flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/35 bg-gold-500/12 text-gold-300 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5.5 w-5.5" aria-hidden="true" />
                      </span>
                      <span className="font-display text-2xl font-black text-white/10 transition-colors group-hover:text-gold-500/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold text-white">{k.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-white/55">{k.desc}</p>
                    <ul className="mt-4 space-y-1.5">
                      {k.points.map((p) => (
                        <li key={p} className="flex items-center gap-2 text-xs font-bold text-gold-300/85">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ══ ALUR 3 LANGKAH ══ */}
        <section id="alur" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold-400">Cara Kerja</p>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-5xl">
              Tiga Langkah, <span className="text-gold-v2">Nol Drama</span>
            </h2>
          </Reveal>

          <div className="relative mt-14 grid gap-6 md:grid-cols-3">
            {/* garis koneksi (desktop) */}
            <svg
              aria-hidden="true"
              className="absolute left-[16%] right-[16%] top-10 hidden h-6 md:block"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
            >
              <path
                d="M0 5 H100"
                stroke="rgba(212,174,54,0.5)"
                strokeWidth="0.35"
                fill="none"
                className="flow-dash"
              />
            </svg>
            {ALUR.map((a, i) => (
              <Reveal key={a.step} delay={i * 140}>
                <div className="glass-card relative h-full rounded-3xl p-7 text-center transition-transform hover:-translate-y-1.5">
                  <span className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold-500/40 bg-night-900 text-gold-300 shadow-[0_10px_30px_rgba(2,23,16,0.6)]">
                    <a.icon className="h-8 w-8" aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 font-display text-xs font-black text-night-950">
                      {a.step}
                    </span>
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{a.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-white/55">{a.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ══ TEKNOLOGI (MARQUEE) ══ */}
        <section id="teknologi" className="relative scroll-mt-24 border-y border-white/10 bg-night-900/50 py-10">
          <p className="mb-6 text-center text-xs font-black uppercase tracking-[0.28em] text-white/35">
            Dibangun di atas Teknologi Modern
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
            <div className="marquee-track gap-4">
              {[...CMS_TECH, ...CMS_TECH].map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className="flex items-center gap-2 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.04] px-6 py-2.5 text-sm font-bold text-white/70"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden="true" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA FINAL ══ */}
        <section className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6">
          <Reveal>
            <div className="glass-card relative overflow-hidden rounded-[2.5rem] px-8 py-14 text-center sm:px-14">
              <div
                aria-hidden="true"
                className="anim-orb absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-500/15 blur-[80px]"
              />
              <LogoMark className="anim-float mx-auto h-16 w-16" />
              <h2 className="mt-6 font-display text-3xl font-black sm:text-4xl">
                Website Anda, <span className="text-gold-v2">Anda yang Kendalikan.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/55">
                Buka panel CMS sekarang dan rasakan kemudahan mengubah konten — dari produk baru
                sampai testimoni pelanggan — semua tampil seketika di website.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/admin/login"
                  className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-8 py-3.5 text-base font-bold text-night-950 shadow-[0_16px_44px_rgba(189,151,38,0.4)] transition-transform hover:-translate-y-0.5"
                >
                  Masuk ke CMS v.{CMS_VERSION}
                  <ArrowRight className="h-4.5 w-4.5" aria-hidden="true" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-base font-bold text-white/80 transition-colors hover:border-gold-500/50 hover:text-gold-300"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Lihat Website
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ══ KREDIT TEMA ══ */}
      <section id="kredit" className="relative mx-auto max-w-4xl scroll-mt-24 px-4 pb-10 pt-6 sm:px-6">
        <Reveal>
          <ThemeCredit variant="award" />
        </Reveal>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="relative border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="flex items-center gap-2 text-sm font-bold text-white/70">
            <LogoMark className="h-6 w-6" />
            {CMS_NAME} CMS <span className="text-gold-400">v.{CMS_VERSION}</span>
          </p>
          <div className="flex flex-col items-center gap-1.5 sm:items-end">
            <p className="text-xs text-white/35">
              {CMS_CODENAME} · Dibangun untuk Juragan Pasir Galunggung © {new Date().getFullYear()}
            </p>
            <ThemeCredit variant="line" />
          </div>
        </div>
      </footer>
    </div>
  );
}
