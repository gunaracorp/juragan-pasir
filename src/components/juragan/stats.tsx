"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
<<<<<<< HEAD
import { getIcon } from "./icon-map";
import type { CmsStat } from "@/lib/cms-types";
=======
import { Gem, Landmark, Truck, Users } from "lucide-react";
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f

/* Format angka gaya Indonesia: 2.500.000 — deterministik, aman dari hydration mismatch */
function formatID(n: number, decimals = 0) {
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${withDots},${dec}` : withDots;
}

function CountUp({
  target,
  decimals = 0,
  suffix = "",
  duration = 1600,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  return (
    <span ref={ref} className="tabular">
      {formatID(value, decimals)}
      {suffix}
    </span>
  );
}

<<<<<<< HEAD
/**
 * STATISTIK PRESTASI — angka target, suffix, dan label sepenuhnya dari CMS.
 * CountUp berbasis requestAnimationFrame dengan easing cubic — deterministik.
 */
export function Stats({ stats }: { stats: CmsStat[] }) {
=======
const STATS = [
  { icon: Gem, target: 2.5, decimals: 1, suffix: " jt+", label: "Ton pasir terkirim" },
  { icon: Users, target: 12480, decimals: 0, suffix: "+", label: "Klien terlayani" },
  { icon: Landmark, target: 34, decimals: 0, suffix: "", label: "Provinsi terjangkau" },
  { icon: Truck, target: 98.6, decimals: 1, suffix: "%", label: "Kirim tepat waktu" },
] as const;

export function Stats() {
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
  return (
    <section
      aria-label="Capaian Juragan Pasir"
      className="grain-texture relative bg-night-900 pb-20"
    >
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
<<<<<<< HEAD
          {stats.map((s) => {
            const Icon = getIcon(s.icon);
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-8 text-center transition-colors duration-300 hover:border-gold-500/35"
              >
                <span
                  aria-hidden="true"
                  className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10"
                >
                  <Icon className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
                </span>
                <dd className="font-display text-4xl font-bold tracking-tight text-gold-bright lg:text-[2.6rem]">
                  <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} />
                </dd>
                <dt className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                  {s.label}
                </dt>
              </div>
            );
          })}
=======
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-8 text-center transition-colors duration-300 hover:border-gold-500/35"
            >
              <span
                aria-hidden="true"
                className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-gold-500/30 bg-gold-500/10"
              >
                <s.icon className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
              </span>
              <dd className="font-display text-4xl font-bold tracking-tight text-gold-bright lg:text-[2.6rem]">
                <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                {s.label}
              </dt>
            </div>
          ))}
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
        </dl>
      </div>
    </section>
  );
}
