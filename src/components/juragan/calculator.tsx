"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calculator as CalculatorIcon, Info, RotateCcw, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
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

/* ------------------------------ KOMPONEN ------------------------------ */

export function Calculator() {
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
      <Label htmlFor={`calc-${label}`} className="text-sm font-semibold text-stone-800">
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
          className="h-12 rounded-lg border-stone-300 pr-14 text-base font-semibold"
          aria-label={`${label} dalam ${unit}`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-400">
          {unit}
        </span>
      </div>
    </div>
  );

  return (
    <section
      id="kalkulator"
      aria-labelledby="judul-kalkulator"
      className="scroll-mt-24 bg-stone-950 py-24"
    >
      <div className="grain-texture relative">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-500/10 blur-[100px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            dark
            eyebrow="Alat Gratis"
            title="Kalkulator Pasir:"
            highlight="Hitung Sebelum Beli"
            description="Tiga dimensi, dua klik — tahu persis volume pasir, armada yang pas, dan estimasi biayanya. Tidak perlu ahli untuk mulai bijak berhitung."
          />

          <Reveal>
            <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-stone-700/60 bg-stone-900 shadow-2xl lg:grid-cols-[1.1fr_1fr]">
              {/* Panel input (terang — kontras maksimal untuk form) */}
              <div className="bg-card p-6 sm:p-8">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-stone-900">
                  <CalculatorIcon className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  Data Area &amp; Jenis Pekerjaan
                </h3>

                <div className="grid gap-5 sm:grid-cols-3">
                  {num(length, "Panjang", "meter", setLength, 500)}
                  {num(width, "Lebar", "meter", setWidth, 500)}
                  {num(thickness, "Tebal", "cm", setThickness, 500)}
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold text-stone-800">
                      Jenis pekerjaan
                    </Label>
                    <Select value={job} onValueChange={(v) => setJob(v as JobKey)}>
                      <SelectTrigger className="h-12 rounded-lg border-stone-300 bg-white text-base font-semibold">
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
                    <Label className="text-sm font-semibold text-stone-800">
                      Wilayah pengiriman
                    </Label>
                    <Select value={area} onValueChange={(v) => setArea(v as AreaKey)}>
                      <SelectTrigger className="h-12 rounded-lg border-stone-300 bg-white text-base font-semibold">
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

                <p className="mt-5 flex items-start gap-2 rounded-lg bg-secondary p-3.5 text-xs leading-relaxed text-stone-600">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
                  {result.note}
                </p>

                <Button
                  variant="ghost"
                  onClick={reset}
                  className="mt-4 h-10 text-sm font-semibold text-stone-500 hover:bg-secondary hover:text-stone-700"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  Reset perhitungan
                </Button>
              </div>

              {/* Panel hasil */}
              <div className="relative border-t border-stone-800 bg-gradient-to-br from-amber-600/15 via-stone-900 to-stone-900 p-6 sm:p-8 lg:border-l lg:border-t-0">
                <h3 className="mb-6 flex items-center gap-2 text-lg font-extrabold text-white">
                  <Truck className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  Hasil Perhitungan
                </h3>

                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Volume kebutuhan pasir
                    </dt>
                    <dd className="mt-1 text-4xl font-extrabold tracking-tight text-white">
                      {formatID(result.vol, 2)}
                      <span className="ml-1.5 text-lg font-bold text-amber-500">m³</span>
                    </dd>
                    {result.vol > 0 && (
                      <p className="mt-1 text-xs text-stone-500">
                        Dasar: {formatID(result.raw, 2)} m³ + faktor jenis pekerjaan
                      </p>
                    )}
                  </div>

                  <div className="border-t border-stone-800 pt-5">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Rekomendasi armada
                    </dt>
                    <dd className="mt-1 text-xl font-extrabold text-amber-400">
                      {result.fleet ? result.fleet.name : "—"}
                    </dd>
                    {result.fleet && (
                      <p className="mt-1 text-xs text-stone-500">
                        Kapasitas {result.fleet.cap}
                        {result.fleet.trips > 1 ? ` · ${result.fleet.trips} ritase` : ""}
                      </p>
                    )}
                  </div>

                  <div className="border-t border-stone-800 pt-5">
                    <dt className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Estimasi biaya material
                    </dt>
                    <dd className="mt-1 text-2xl font-extrabold tracking-tight text-white">
                      {result.vol > 0
                        ? `Rp ${formatID(result.low / 1000, 0)} rb – ${formatID(result.high / 1000, 0)} rb`
                        : "Rp 0"}
                    </dd>
                    <p className="mt-1 text-xs text-stone-500">
                      Belum termasuk ongkos angkut & PPN
                    </p>
                  </div>
                </dl>

                <Button
                  asChild
                  className="mt-7 h-12 w-full bg-amber-600 text-base font-bold text-white shadow-lg shadow-amber-600/25 transition-all hover:bg-amber-500"
                >
                  <a href="#penawaran">
                    Kunci Harga Resminya
                    <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <p className="mt-3 text-center text-xs text-stone-500">
                  Penawaran tertulis dikirim maks. 1×24 jam.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
