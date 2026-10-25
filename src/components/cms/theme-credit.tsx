import Link from "next/link";
import { Award, ExternalLink } from "lucide-react";
import { THEME_CREDIT } from "@/lib/cms-version";
import { cn } from "@/lib/utils";

/**
 * THEME CREDIT — atribusi resmi tema CMS v.3 (Digiman Edition).
 * Satu komponen, tiga varian, dipakai konsisten di seluruh platform:
 *  - "line"   : baris teks kecil (footer publik, footer /cms, halaman login)
 *  - "badge"  : pil emas ringkas (sidebar admin, area sempit)
 *  - "award"  : kartu award besar (seksi Kredit di landing /cms)
 * Link selalu ke https://digiman.id (dofollow — atribusi pantas diberikan).
 */

export function ThemeCredit({
  variant = "line",
  className,
}: {
  variant?: "line" | "badge" | "award";
  className?: string;
}) {
  if (variant === "badge") {
    return (
      <Link
        href={THEME_CREDIT.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Tema oleh ${THEME_CREDIT.company} — ${THEME_CREDIT.domain}`}
        className={cn(
          "group inline-flex items-center gap-1.5 rounded-full border border-gold-500/30 bg-gold-500/[0.08] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-gold-300/90 transition-colors hover:border-gold-400/60 hover:bg-gold-500/15 hover:text-gold-200",
          className
        )}
      >
        <Award className="h-3 w-3 shrink-0 transition-transform group-hover:scale-110" aria-hidden="true" />
        {THEME_CREDIT.labelShort}
      </Link>
    );
  }

  if (variant === "award") {
    return (
      <div
        className={cn(
          "glass-card relative overflow-hidden rounded-[2rem] px-7 py-10 text-center sm:px-12",
          className
        )}
      >
        <div
          aria-hidden="true"
          className="anim-orb absolute -top-20 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-gold-500/12 blur-[70px]"
        />
        <div
          aria-hidden="true"
          className="anim-spin-slow absolute -right-24 -bottom-24 h-64 w-64 rounded-full border border-dashed border-gold-500/15"
        />

        <div className="relative">
          <span className="anim-pulse-glow mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/12 text-gold-300">
            <Award className="h-7 w-7" aria-hidden="true" />
          </span>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.28em] text-gold-400">
            Kredit Tema
          </p>
          <h3 className="mt-3 font-display text-2xl font-black leading-tight sm:text-3xl">
            Tema ini adalah karya{" "}
            <span className="text-gold-v2">{THEME_CREDIT.company}</span>
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55">
            {THEME_CREDIT.note}
          </p>

          <a
            href={THEME_CREDIT.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shine mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-7 py-3 text-sm font-bold text-night-950 shadow-[0_12px_36px_rgba(189,151,38,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Kunjungi {THEME_CREDIT.domain}
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Digiman Edition · CMS v.3.0
          </p>
        </div>
      </div>
    );
  }

  // variant === "line" (default)
  return (
    <p className={cn("flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/35", className)}>
      <Award className="h-3.5 w-3.5 text-gold-500/60" aria-hidden="true" />
      <span>{THEME_CREDIT.label}</span>
      <a
        href={THEME_CREDIT.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold text-gold-400/80 underline-offset-2 transition-colors hover:text-gold-300 hover:underline"
      >
        {THEME_CREDIT.domain}
      </a>
    </p>
  );
}
