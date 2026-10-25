"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, Medal, ShieldCheck, Truck } from "lucide-react";
import type { CmsSection, CmsSettings } from "@/lib/cms-types";

/* Partikel emas melayang — deterministik (tanpa Math.random) agar bebas hydration mismatch */
const PARTICLES = [
  { left: "6%", size: 5, dur: 14, delay: 0, drift: 26 },
  { left: "14%", size: 3, dur: 18, delay: 2.2, drift: -18 },
  { left: "23%", size: 4, dur: 15, delay: 5.1, drift: 30 },
  { left: "35%", size: 3, dur: 20, delay: 1.2, drift: -26 },
  { left: "47%", size: 5, dur: 16, delay: 7.4, drift: 22 },
  { left: "58%", size: 3, dur: 21, delay: 3.3, drift: -30 },
  { left: "69%", size: 4, dur: 13, delay: 8.6, drift: 18 },
  { left: "78%", size: 3, dur: 19, delay: 4.4, drift: -22 },
  { left: "88%", size: 5, dur: 17, delay: 6.2, drift: 28 },
  { left: "95%", size: 3, dur: 15, delay: 9.1, drift: -16 },
];

const CHIP_ICONS = [BadgeCheck, ShieldCheck, Truck];

/**
 * HERO — seluruh narasi, CTA, kartu garansi, dan chip kepercayaan
 * dikendalikan penuh dari CMS (SiteSettings + Section registry).
 */
export function Hero({
  settings,
  section,
}: {
  settings: CmsSettings;
  section?: CmsSection;
}) {
  const reduce = useReducedMotion();
  const hero = settings.hero;

  const particles = useMemo(
    () =>
      PARTICLES.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="gold-particle"
          style={{
            left: p.left,
            top: "-12px",
            width: p.size,
            height: p.size,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
            ["--drift-x" as string]: `${p.drift}px`,
          }}
        />
      )),
    []
  );

  const chipCount = Math.min(hero.chips.length, CHIP_ICONS.length);

  return (
    <section
      aria-labelledby="judul-hero"
      className="grain-texture relative overflow-hidden bg-night-900"
    >
      {/* Lapisan dekoratif: pendar zamrud kanan-atas + garis diagonal + cincin */}
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-44 h-[620px] w-[620px] rounded-full bg-[#2e472a] opacity-70 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 -left-40 h-[480px] w-[480px] rounded-full bg-night-600/40 blur-[120px]"
      />
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      {/* Cincin lingkaran dekoratif */}
      <div
        aria-hidden="true"
        className="absolute -right-24 top-1/3 hidden h-[420px] w-[420px] rounded-full border border-gold-500/15 lg:block"
      />
      <div
        aria-hidden="true"
        className="absolute -right-10 top-[42%] hidden h-[640px] w-[640px] rounded-full border border-gold-500/10 lg:block"
      />
      <span
        aria-hidden="true"
        className="absolute right-[8%] bottom-16 hidden h-2 w-2 rounded-full bg-gold-500/70 lg:block"
      />
      <span
        aria-hidden="true"
        className="absolute left-[46%] top-24 hidden h-1.5 w-1.5 rounded-full bg-gold-400/50 lg:block"
      />
      {!reduce && <div className="absolute inset-0 overflow-hidden">{particles}</div>}

      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:pb-32 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr]">
          {/* Kolom narasi — rata kiri seperti standar situs kelas dunia */}
          <div>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-gold-400"
              />
              {hero.badge}
            </motion.div>

            <motion.h1
              id="judul-hero"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
              className="font-display text-[2.6rem] font-bold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[4.2rem]"
            >
              {hero.title1}
              <br />
              <em className="text-gold-bright font-bold italic">
                {hero.title2}
              </em>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
              className="mt-6 max-w-xl text-base leading-relaxed text-white/65 sm:text-lg"
            >
              {hero.desc}
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
              className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <a
                href="#penawaran"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-8 text-base font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] ring-1 ring-gold-300/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(189,151,38,0.5)]"
              >
                {hero.cta1}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#produk"
                className="inline-flex h-[52px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 text-base font-bold text-white backdrop-blur transition-all hover:border-gold-500/50 hover:text-gold-300"
              >
                <Calculator className="h-4 w-4" aria-hidden="true" />
                {hero.cta2}
              </a>
            </motion.div>

            <motion.ul
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
              aria-label="Jaminan layanan"
            >
              {hero.chips.slice(0, chipCount).map((chip, i) => {
                const Icon = CHIP_ICONS[i] ?? BadgeCheck;
                return (
                  <li
                    key={chip}
                    className="flex items-center gap-2 text-sm font-medium text-white/55"
                  >
                    <Icon className="h-4 w-4 text-gold-400" aria-hidden="true" />
                    {chip}
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* Kartu kaca "Garansi Mutu" — pengakuan standar mutu, seperti lencana sertifikasi */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="glass-card relative rounded-3xl px-8 py-10 text-center">
              <span
                aria-hidden="true"
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold-400/50 bg-gold-500/15"
              >
                <Medal className="h-8 w-8 text-gold-300" strokeWidth={1.6} />
              </span>
              {hero.cardTitle.split("\n").map((line, i) => (
                <span key={i} className="block font-display text-2xl font-bold leading-snug text-white sm:text-[1.7rem]">
                  {line}
                </span>
              ))}
              <div className="gold-divider mx-auto mt-5 w-28" aria-hidden="true" />
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
                {hero.cardBadge}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {hero.cardText}
              </p>
            </div>

            {/* Kartu mini mengambang: kepercayaan klien */}
            <div className="absolute -bottom-7 -left-4 rounded-2xl border border-white/10 bg-night-950/95 px-5 py-4 shadow-2xl backdrop-blur sm:-left-8">
              <p className="font-display text-2xl font-bold text-gold-300 tabular">
                {hero.statNum}
              </p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                {hero.statLabel}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
