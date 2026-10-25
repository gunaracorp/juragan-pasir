"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator as CalculatorIcon, Info, RotateCcw, Truck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import type { CmsSection } from "@/lib/cms-types";

/* Format angka gaya Indonesia (deterministik, bebas hydration mismatch) */
function formatID(n: number, decimals = 0) {
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const withDots = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? `${withDots},${dec}` : withDots;
}

/* ---------------------- MODEL KALKULASI TEKNIS ---------------------- */

type JobKey = "cor" | "urug" | "plester" | "pasang";

const JOBS: Record<
  JobKey,
  { label: string; factor: number; base: number; note: string }
> = {
  cor: {
    label: "Cor / Beton bertulang",
    factor: 1.05,
    base: 350,
    note: "Faktor 5% menutup kehilangan saat pengadukan & pemadatan beton.",
  },
  urug: {
    label: "Urug / Penurunan lahan",
    factor: 1.15,
    base: 210,
    note: "Faktor 15% mengantisipasi pemadatan alami pasir urug.",
  },
  plester: {
    label: "Plester & Acian",
    factor: 1.1,
    base: 290,
    note: "Faktor 10% untuk susut Mortar dan ketidakrataan dinding.",
  },
  pasang: {
    label: "Pasangan bata / keramik",
    factor: 1.1,
    base: 275,
    note: "Faktor 10% menyesuaikan sambungan adukan bata.",
  },
};

type AreaKey = "jabodetabek" | "jawa" | "sumatra" | "kalimantan" | "sulawesi" | "balinusra" | "malukupapua";

const AREAS: Record<AreaKey, { label: string; mult: number }> = {
  jabodetabek: { label: "Jabodetabek", mult: 1.0 },
  jawa: { label: "Jawa (luar Jabodetabek)", mult: 0.92 },
  sumatra: { label: "Sumatra", mult: 1.08 },
  kalimantan: { label: "Kalimantan", mult: 1.12 },
  sulawesi: { label: "Sulawesi", mult: 1.12 },
  balinusra: { label: "Bali & Nusa Tenggara", mult: 1.18 },
  malukupapua: { label: "Maluku & Papua", mult: 1.35 },
};

function recommendFleet(volume: number) {
  if (volume <= 0) return null;
  if (volume <= 2)
    return { name: "1× Pickup", cap: "±1,5–2 m³", trips: 1 };
  if (volume <= 6)
    return { name: "1× Dump Truck kecil", cap: "±6 m³", trips: 1 };
  if (volume <= 10)
    return { name: "1× Dump Truck sedang", cap: "±10 m³", trips: 1 };
  if (volume <= 16)
    return { name: "1× Truk Fuso besar", cap: "±15 m³", trips: 1 };
  const trips = Math.ceil(volume / 15);
  return { name: `${trips}× rit Truk Fuso`, cap: "±15 m³ / rit", trips };
}

/**
 * KALKULATOR PASIR — judul dari CMS; model perhitungan teknis tetap di kode
 * (faktor pemadatan & tarif area adalah logika bisnis, bukan konten).
 */
export function Calculator({ section }: { section?: CmsSection }) {
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [thickness, setThickness] = useState("10");
  const [job, setJob] = useState<JobKey>("cor");
  const [area, setArea] = useState<AreaKey>("jabodetabek");

  const result = useMemo(() => {
    const P = Math.max(parseFloat(length) || 0, 0);
    const L = Math.max(parseFloat(width) || 0, 0);
    const T = Math.max(parseFloat(thickness) || 0, 0) / 100; // cm → m
    const raw = P * L * T;
    const vol = raw * JOBS[job].factor;
    const base = JOBS[job].base * AREAS[area].mult;
    const low = base * 0.92;
    const high = base * 1.08;
    return {
      raw,
      vol,
      fleet: recommendFleet(vol),
      low: vol * low,
      high: vol * high,
      note: JOBS[job].note,
    };
  }, [length, width, thickness, job, area]);

  const reset = () => {
    setLength("6");
    setWidth("4");
    setThickness("10");
    setJob("cor");
    setArea("jabodetabek");
  };

  const num = (v: string, label: string, unit: string, setter: (v: string) => void, max: number) => (
    <div className="space-y-1.5">
      <Label htmlFor={`calc-${label}`} className="text-sm font-semibold text-ink-900">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={`calc-${label}`}
          type="number"
          min={0}
          max={max}
          step="0.1"
          inputMode="decimal"
          value={v}
          onChange={(e) => setter(e.target.value)}
          className="h-12 rounded-xl border-line bg-cream-50 pr-14 text-base font-semibold text-ink-900"
          aria-label={`${label} dalam ${unit}`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-ink-400">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <section
      id="kalkulator"
      aria-labelledby="judul-kalkulator"
      className="grain-texture relative scroll-mt-24 bg-night-900 py-24"
    >
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-gold-500/10 blur-[110px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow={section?.eyebrow || "Alat Gratis"}
          title={section?.heading || "Kalkulator Pasir:"}
          highlight={section?.highlight || "Hitung Sebelum Beli"}
          description={section?.description}
        />

        <Reveal>
          <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-night-950 shadow-[0_30px_80px_rgba(2,23,16,0.5)] lg:grid-cols-[1.1fr_1fr]">
            {/* Panel input (terang — kontras maksimal untuk form) */}
            <div className="bg-card p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-ink-900">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-500/15"
                >
                  <CalculatorIcon className="h-4.5 w-4.5 text-gold-600" />
                </span>
                Data Area &amp; Jenis Pekerjaan
              </h3>

              <div className="grid gap-5 sm:grid-cols-3">
                {num(length, "Panjang", "meter", setLength, 500)}
                {num(width, "Lebar", "meter", setWidth, 500)}
                {num(thickness, "Tebal", "cm", setThickness, 500)}
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-ink-900">
                    Jenis pekerjaan
                  </Label>
                  <Select value={job} onValueChange={(v) => setJob(v as JobKey)}>
                    <SelectTrigger className="h-12 rounded-xl border-line bg-cream-50 text-base font-semibold text-ink-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(JOBS) as JobKey[]).map((k) => (
                        <SelectItem key={k} value={k}>
                          {JOBS[k].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-semibold text-ink-900">
                    Wilayah pengiriman
                  </Label>
                  <Select value={area} onValueChange={(v) => setArea(v as AreaKey)}>
                    <SelectTrigger className="h-12 rounded-xl border-line bg-cream-50 text-base font-semibold text-ink-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(AREAS) as AreaKey[]).map((k) => (
                        <SelectItem key={k} value={k}>
                          {AREAS[k].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="mt-5 flex items-start gap-2 rounded-xl bg-cream-100 p-4 text-xs leading-relaxed text-ink-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
                {result.note}
              </p>

              <button
                type="button"
                onClick={reset}
                className="mt-4 inline-flex h-10 items-center text-sm font-semibold text-ink-400 transition-colors hover:text-ink-700"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                Reset perhitungan
              </button>
            </div>

            {/* Panel hasil */}
            <div className="relative border-t border-white/10 bg-gradient-to-br from-night-800 via-night-950 to-night-950 p-6 sm:p-8 lg:border-l lg:border-t-0">
              <h3 className="mb-6 flex items-center gap-2.5 text-lg font-bold text-white">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gold-500/30 bg-gold-500/10"
                >
                  <Truck className="h-4.5 w-4.5 text-gold-400" />
                </span>
                Hasil Perhitungan
              </h3>

              <dl className="space-y-5">
                <div>
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                    Volume kebutuhan pasir
                  </dt>
                  <dd className="mt-1.5 font-display text-4xl font-bold tracking-tight text-gold-bright">
                    {formatID(result.vol, 2)}
                    <span className="ml-1.5 text-lg font-bold text-white/70">m³</span>
                  </dd>
                  {result.vol > 0 && (
                    <p className="mt-1 text-xs text-white/40">
                      Dasar: {formatID(result.raw, 2)} m³ + faktor jenis pekerjaan
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 pt-5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                    Rekomendasi armada
                  </dt>
                  <dd className="mt-1.5 font-display text-xl font-bold text-gold-300">
                    {result.fleet ? result.fleet.name : "—"}
                  </dd>
                  {result.fleet && (
                    <p className="mt-1 text-xs text-white/40">
                      Kapasitas {result.fleet.cap}
                      {result.fleet.trips > 1 ? ` · ${result.fleet.trips} ritase` : ""}
                    </p>
                  )}
                </div>

                <div className="border-t border-white/10 pt-5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                    Estimasi biaya material
                  </dt>
                  <dd className="mt-1.5 font-display text-2xl font-bold tracking-tight text-white">
                    {result.vol > 0
                      ? `Rp ${formatID(result.low, 0)} – ${formatID(result.high, 0)} ribu`
                      : "Rp 0"}
                  </dd>
                  <p className="mt-1 text-xs text-white/40">
                    Belum termasuk ongkos angkut &amp; PPN
                  </p>
                </div>
              </dl>

              <a
                href="#penawaran"
                className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-base font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] ring-1 ring-gold-300/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(189,151,38,0.5)]"
              >
                Kunci Harga Resminya
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <p className="mt-3 text-center text-xs text-white/40">
                Penawaran tertulis dikirim maks. 1×24 jam.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
