"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/lib/juragan-data";
import { Reveal } from "./reveal";

const CLIENT_TYPES = [
  { value: "Perseorangan / Rumah Tangga", label: "Perseorangan / Rumah Tangga" },
  { value: "Kontraktor / Developer", label: "Kontraktor / Developer" },
  { value: "Perusahaan / Industri", label: "Perusahaan / Industri" },
  { value: "Instansi Pemerintah / Organisasi", label: "Instansi Pemerintah / Organisasi" },
] as const;

const VOLUMES = [
  { value: "< 5 m3 (renovasi kecil)", label: "< 5 m³ (renovasi kecil)" },
  { value: "5-20 m3 (rumah / ritase rutin)", label: "5–20 m³ (rumah / ritase rutin)" },
  { value: "20-100 m3 (proyek menengah)", label: "20–100 m³ (proyek menengah)" },
  { value: "> 100 m3 (proyek besar / kontrak)", label: "> 100 m³ (proyek besar / kontrak)" },
  { value: "Belum tahu - mohon bantu hitung", label: "Belum tahu — mohon bantu hitung" },
] as const;

/**
 * FORMULIR PENAWARAN → LANGSUNG WHATSAPP
 * Saat dikirim, seluruh isian tersusun otomatis menjadi pesan rapi lalu
 * dibuka di WhatsApp +62 813-1651-6524 — tanpa server, tanpa jeda,
 * percakapan langsung tersambung ke juragan.
 */
export function QuoteForm() {
  const [clientType, setClientType] = useState<string>("");
  const [sandType, setSandType] = useState<string>("");
  const [volume, setVolume] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const city = String(fd.get("city") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!clientType || !sandType || !volume) {
      setError("Mohon lengkapi tipe klien, jenis pasir, dan perkiraan volume agar kami bisa menyiapkan penawaran yang tepat.");
      return;
    }
    setError("");

    const lines = [
      "Halo *Juragan Pasir Galunggung*!",
      "Saya ingin meminta penawaran pasir:",
      "",
      `• Nama: ${name}`,
      `• No. WhatsApp: ${phone}`,
      `• Saya adalah: ${clientType}`,
      `• Jenis pasir: ${sandType}`,
      `• Perkiraan volume: ${volume}`,
      `• Kota pengiriman: ${city}`,
    ];
    if (message) lines.push(`• Catatan: ${message}`);
    lines.push("", "Mohon dibantu penawaran resminya ya. Terima kasih!");

    const url = `${SITE.wa}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const field =
    "h-12 rounded-xl border-line bg-cream-50 text-base text-ink-900 focus-visible:ring-gold-500";

  return (
    <section
      id="penawaran"
      aria-labelledby="judul-penawaran"
      className="grain-texture relative scroll-mt-24 bg-night-900 py-24"
    >
      <div aria-hidden="true" className="diagonal-lines absolute inset-0" />
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gold-500/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
          {/* Kolom narasi + kontak */}
          <Reveal>
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/35 bg-gold-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              Minta Penawaran
            </p>
            <h2
              id="judul-penawaran"
              className="mt-5 font-display text-3xl font-bold leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
            >
              Ceritakan Proyek Anda,{" "}
              <em className="text-gold-bright font-bold italic">Kami Kirim Harganya</em>
            </h2>
            <div className="gold-divider mt-6 w-24" aria-hidden="true" />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60">
              Isi formulir ini — pesan Anda otomatis tersusun rapi dan langsung
              terbuka di WhatsApp kami. Penawaran resmi tertulis dikirim
              maksimal 1×24 jam kerja, lengkap dengan spesifikasi, rincian
              harga, dan jadwal pengiriman.
            </p>

            <ul className="mt-8 space-y-4" aria-label="Keunggulan proses penawaran">
              {[
                ["Langsung ke WhatsApp juragan", "tanpa menunggu, tanpa perantara"],
                ["Penawaran resmi & tertulis", "bisa dipakai untuk tender/PO"],
                ["Sampel material tersedia", "untuk kontrak volume besar"],
              ].map(([strong, rest]) => (
                <li key={strong} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gold-400"
                  />
                  <p className="text-sm text-white/60">
                    <strong className="font-bold text-white">{strong}</strong> — {rest}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-white/10 bg-night-950/80 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/45">
                Lebih suka bicara langsung?
              </p>
              <a
                href={SITE.phoneHref}
                className="mt-2 block font-display text-2xl font-bold tracking-tight text-gold-300 transition-colors hover:text-gold-200"
                aria-label={`Telepon atau WhatsApp ${SITE.phone}`}
              >
                {SITE.phone}
              </a>
              <p className="mt-1 text-sm text-white/45">
                Telepon / WhatsApp · {SITE.hours}
              </p>
            </div>
          </Reveal>

          {/* Formulir */}
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-white/10 bg-card p-6 shadow-[0_30px_80px_rgba(2,23,16,0.55)] sm:p-8"
              aria-label="Formulir permintaan penawaran via WhatsApp"
            >
              {/* Banner kanal WhatsApp */}
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-wa/30 bg-wa/10 px-4 py-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wa"
                >
                  <MessageCircle className="h-4.5 w-4.5 text-white" />
                </span>
                <p className="text-xs leading-relaxed text-ink-700">
                  <strong className="font-bold text-ink-900">
                    Terhubung langsung ke WhatsApp {SITE.phone}
                  </strong>{" "}
                  — saat Anda menekan kirim, pesan penawaran tersusun otomatis.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="qf-name" className="text-sm font-semibold text-ink-900">
                    Nama lengkap *
                  </Label>
                  <Input
                    id="qf-name"
                    name="name"
                    required
                    minLength={2}
                    placeholder="cth. Budi Santoso"
                    className={field}
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qf-phone" className="text-sm font-semibold text-ink-900">
                    No. WhatsApp *
                  </Label>
                  <Input
                    id="qf-phone"
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    pattern="[+0-9()\-\s]{9,20}"
                    placeholder="cth. 0812-3456-7890"
                    className={field}
                    autoComplete="tel"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qf-type" className="text-sm font-semibold text-ink-900">
                    Saya adalah *
                  </Label>
                  <Select
                    value={clientType}
                    onValueChange={(v) => {
                      setClientType(v);
                      setError("");
                    }}
                  >
                    <SelectTrigger id="qf-type" className={field}>
                      <SelectValue placeholder="Pilih tipe klien" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLIENT_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qf-sand" className="text-sm font-semibold text-ink-900">
                    Jenis pasir *
                  </Label>
                  <Select
                    value={sandType}
                    onValueChange={(v) => {
                      setSandType(v);
                      setError("");
                    }}
                  >
                    <SelectTrigger id="qf-sand" className={field}>
                      <SelectValue placeholder="Pilih / tanya rekomendasi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pasir Galunggung Cor">Pasir Galunggung Cor</SelectItem>
                      <SelectItem value="Pasir Urug Gunung">Pasir Urug Gunung</SelectItem>
                      <SelectItem value="Pasir Galunggung Pasang">Pasir Galunggung Pasang</SelectItem>
                      <SelectItem value="Pasir Halus Galunggung">Pasir Halus Galunggung</SelectItem>
                      <SelectItem value="Pasir Silika Vulkanik">Pasir Silika Vulkanik</SelectItem>
                      <SelectItem value="Pasir Merah / Bangka">Pasir Merah / Bangka</SelectItem>
                      <SelectItem value="Belum tahu - minta saran">Belum tahu — minta saran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qf-volume" className="text-sm font-semibold text-ink-900">
                    Perkiraan volume *
                  </Label>
                  <Select
                    value={volume}
                    onValueChange={(v) => {
                      setVolume(v);
                      setError("");
                    }}
                  >
                    <SelectTrigger id="qf-volume" className={field}>
                      <SelectValue placeholder="Pilih rentang volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {VOLUMES.map((v) => (
                        <SelectItem key={v.value} value={v.value}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="qf-city" className="text-sm font-semibold text-ink-900">
                    Kota pengiriman *
                  </Label>
                  <Input
                    id="qf-city"
                    name="city"
                    required
                    minLength={2}
                    placeholder="cth. Bekasi"
                    className={field}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <Label htmlFor="qf-message" className="text-sm font-semibold text-ink-900">
                  Catatan tambahan{" "}
                  <span className="font-normal text-ink-400">(opsional)</span>
                </Label>
                <Textarea
                  id="qf-message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="cth. Butuh kirim Jumat pagi, lokasi gang kecil, mohon bantu hitung kebutuhan pasir untuk plat lantai 8×6 m."
                  className="rounded-xl border-line bg-cream-50 text-base text-ink-900 focus-visible:ring-gold-500"
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-b from-gold-400 to-gold-600 text-base font-bold text-night-950 shadow-[0_10px_30px_rgba(189,151,38,0.35)] ring-1 ring-gold-300/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(189,151,38,0.5)]"
              >
                Kirim via WhatsApp
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="mt-3.5 text-center text-xs leading-relaxed text-ink-400">
                Dengan mengirim formulir, Anda setuju dihubungi tim kami via
                WhatsApp/telepon. Data Anda kami jaga dan tidak dibagikan ke
                pihak ketiga.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
