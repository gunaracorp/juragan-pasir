"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, Calculator, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

/* Butiran pasir melayang — deterministik (tanpa Math.random) agar bebas hydration mismatch */
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

const TRUST_CHIPS = [
  { icon: BadgeCheck, label: "Standar SNI & tersaring" },
  { icon: ShieldCheck, label: "Garansi mutu: ganti jika tak sesuai" },
  { icon: Truck, label: "Kirim ke 34 provinsi" },
];

export function Hero() {
  const reduce = useReducedMotion();

  const particles = useMemo(
    () =>
      PARTICLES.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="sand-particle"
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

  return (
    <section
      aria-labelledby="judul-hero"
      className="grain-texture relative overflow-hidden bg-stone-950"
    >
      {/* Lapisan dekoratif: pendar amber + garis kontur gundukan */}
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full bg-amber-600/25 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-56 -left-40 h-[480px] w-[480px] rounded-full bg-amber-500/10 blur-[110px]"
      />
      <div aria-hidden="true" className="dune-lines absolute inset-0 opacity-70" />
      {!reduce && <div className="absolute inset-0 overflow-hidden">{particles}</div>}

      <div className="relative mx-auto max-w-7xl px-4 pb-28 pt-16 sm:px-6 sm:pt-20 lg:pb-36 lg:pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-amber-400"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Stok tersedia — siap kirim hari ini
          </motion.div>

          <motion.h1
            id="judul-hero"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
            className="text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Pusat Pasir Terbaik
            <br />
            <span className="text-glow-amber bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Se-Indonesia
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg"
          >
            Dari renovasi rumah pribadi sampai proyek nasional skala besar —{" "}
            <strong className="font-semibold text-white">semua kalangan kami layani</strong>.
            Pasir berkualitas tersaring, harga transparan tanpa biaya tersembunyi,
            dan pengiriman tepat waktu ke seluruh nusantara.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24, ease: "easeOut" }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              asChild
              size="lg"
              className="h-13 w-full bg-amber-600 px-8 text-base font-bold text-white shadow-lg shadow-amber-600/25 transition-all hover:-translate-y-0.5 hover:bg-amber-500 hover:shadow-xl hover:shadow-amber-600/30 sm:w-auto"
            >
              <a href="#penawaran">
                Minta Penawaran Gratis
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-13 w-full border-stone-700 bg-stone-900/60 px-8 text-base font-bold text-stone-100 backdrop-blur transition-all hover:border-amber-500/60 hover:bg-stone-800 hover:text-amber-300 sm:w-auto"
            >
              <a href="#kalkulator">
                <Calculator className="mr-1.5 h-4 w-4" aria-hidden="true" />
                Hitung Kebutuhan Pasir
              </a>
            </Button>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
            aria-label="Jaminan layanan"
          >
            {TRUST_CHIPS.map((chip) => (
              <li
                key={chip.label}
                className="flex items-center gap-2 text-sm font-medium text-stone-400"
              >
                <chip.icon className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                {chip.label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
