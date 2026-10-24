"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

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

const STATS = [
  { target: 2.5, decimals: 1, suffix: " jt+", unit: "Ton pasir terkirim" },
  { target: 12480, decimals: 0, suffix: "+", unit: "Klien terlayani" },
  { target: 34, decimals: 0, suffix: "", unit: "Provinsi terjangkau" },
  { target: 98.6, decimals: 1, suffix: "%", unit: "Pengiriman tepat waktu" },
] as const;

export function Stats() {
  return (
    <section aria-label="Capaian Juragan Pasir" className="relative z-10 -mt-14 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-stone-200/70 bg-stone-200/70 shadow-xl shadow-stone-900/10 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.unit} className="bg-card px-6 py-7 text-center">
              <dd className="text-3xl font-extrabold tracking-tight text-amber-700 sm:text-4xl">
                <CountUp target={s.target} decimals={s.decimals} suffix={s.suffix} />
              </dd>
              <dt className="mt-1.5 text-sm font-medium text-stone-500">{s.unit}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
