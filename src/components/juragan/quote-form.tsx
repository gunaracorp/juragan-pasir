"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { PRODUCTS } from "@/lib/juragan-data";
import { Reveal } from "./reveal";

const CLIENT_TYPES = [
  { value: "perseorangan", label: "Perseorangan / Rumah Tangga" },
  { value: "kontraktor", label: "Kontraktor / Developer" },
  { value: "perusahaan", label: "Perusahaan / Industri" },
  { value: "instansi", label: "Instansi Pemerintah / Organisasi" },
] as const;

const VOLUMES = [
  { value: "kecil", label: "< 5 m³ (renovasi kecil)" },
  { value: "menengah", label: "5–20 m³ (rumah / ritase rutin)" },
  { value: "besar", label: "20–100 m³ (proyek menengah)" },
  { value: "masif", label: "> 100 m³ (proyek besar / kontrak)" },
  { value: "belum-tahu", label: "Belum tahu — mohon bantu hitung" },
] as const;

type Status = "idle" | "loading";

export function QuoteForm() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Status>("idle");
  const [clientType, setClientType] = useState<string>("");
  const [sandType, setSandType] = useState<string>("");
  const [volume, setVolume] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      clientType,
      sandType,
      volume,
      city: String(fd.get("city") || ""),
      message: String(fd.get("message") || ""),
    };

    if (!clientType || !sandType || !volume) {
      toast({
        title: "Lengkapi pilihan Anda",
        description:
          "Tipe klien, jenis pasir, dan perkiraan volume wajib dipilih agar kami bisa menyiapkan penawaran yang tepat.",
        variant: "destructive",
      });
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        toast({
          title: "Penawaran sedang diproses!",
          description: `Nomor referensi Anda ${json.reference}. ${json.message}`,
          variant: "default",
        });
        form.reset();
        setClientType("");
        setSandType("");
        setVolume("");
      } else {
        toast({
          title: "Data belum lengkap",
          description:
            json.issues?.[0]?.message ??
            "Periksa kembali isian Anda, lalu kirim ulang formulir.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Koneksi bermasalah",
        description:
          "Gagal mengirim permintaan. Coba lagi, atau langsung hubungi WhatsApp kami.",
        variant: "destructive",
      });
    } finally {
      setStatus("idle");
    }
  }

  const field =
    "h-12 rounded-lg border-stone-300 bg-white text-base focus-visible:ring-amber-600";

  return (
    <section
      id="penawaran"
      aria-labelledby="judul-penawaran"
      className="grain-texture relative scroll-mt-24 bg-stone-950 py-24"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-amber-600/20 blur-[110px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.15fr]">
          {/* Kolom narasi + kontak */}
          <Reveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-amber-500">
              Minta Penawaran
            </p>
            <h2
              id="judul-penawaran"
              className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl"
            >
              Ceritakan Proyek Anda,{" "}
              <span className="text-amber-400">Kami Kirim Harganya</span>
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-stone-300">
              Isi formulir ini dan terima penawaran resmi tertulis maksimal 1×24 jam
              kerja — lengkap dengan spesifikasi pasir, rincian harga, dan jadwal
              pengiriman. Gratis, tanpa kewajiban apa pun.
            </p>

            <ul className="mt-8 space-y-4" aria-label="Keunggulan proses penawaran">
              {[
                ["Respon WhatsApp hari yang sama", "untuk jam kerja Senin–Sabtu"],
                ["Penawaran resmi & tertulis", "bisa dipakai untuk tender/PO"],
                ["Sampel material tersedia", "untuk kontrak volume besar"],
              ].map(([strong, rest]) => (
                <li key={strong} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-500"
                  />
                  <p className="text-sm text-stone-300">
                    <strong className="font-bold text-white">{strong}</strong> — {rest}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-10 rounded-2xl border border-stone-800 bg-stone-900/80 p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Lebih suka bicara langsung?
              </p>
              <a
                href="tel:+6281220008000"
                className="mt-2 block text-2xl font-extrabold tracking-tight text-amber-400 transition-colors hover:text-amber-300"
                aria-label="Telepon atau WhatsApp 0812-2000-8000"
              >
                0812-2000-8000
              </a>
              <p className="mt-1 text-sm text-stone-400">
                Telepon / WhatsApp · Senin–Sabtu 07.00–18.00 WIB
              </p>
            </div>
          </Reveal>

          {/* Formulir */}
          <Reveal delay={0.12}>
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-stone-200/60 bg-card p-6 shadow-2xl sm:p-8"
              aria-label="Formulir permintaan penawaran"
              noValidate={false}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="qf-name" className="text-sm font-semibold">
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
                  <Label htmlFor="qf-phone" className="text-sm font-semibold">
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
                  <Label htmlFor="qf-type" className="text-sm font-semibold">
                    Saya adalah *
                  </Label>
                  <Select value={clientType} onValueChange={setClientType}>
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
                  <Label htmlFor="qf-sand" className="text-sm font-semibold">
                    Jenis pasir *
                  </Label>
                  <Select value={sandType} onValueChange={setSandType}>
                    <SelectTrigger id="qf-sand" className={field}>
                      <SelectValue placeholder="Pilih / tanya rekomendasi" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRODUCTS.map((p) => (
                        <SelectItem key={p.id} value={p.name}>
                          {p.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="belum-tahu">Belum tahu — minta saran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="qf-volume" className="text-sm font-semibold">
                    Perkiraan volume *
                  </Label>
                  <Select value={volume} onValueChange={setVolume}>
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
                  <Label htmlFor="qf-city" className="text-sm font-semibold">
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
                <Label htmlFor="qf-message" className="text-sm font-semibold">
                  Catatan tambahan{" "}
                  <span className="font-normal text-stone-400">(opsional)</span>
                </Label>
                <Textarea
                  id="qf-message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="cth. Butuh kirim Jumat pagi, lokasi gang kecil, mohon bantu hitung kebutuhan pasir untuk plat lantai 8×6 m."
                  className="rounded-lg border-stone-300 bg-white text-base focus-visible:ring-amber-600"
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="mt-6 h-13 w-full bg-amber-600 text-base font-bold text-white shadow-lg shadow-amber-600/25 transition-all hover:bg-amber-500 disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Mengirim permintaan…
                  </>
                ) : (
                  <>
                    Kirim &amp; Terima Penawaran
                    <Send className="ml-1.5 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
              <p className="mt-3.5 text-center text-xs leading-relaxed text-stone-500">
                Dengan mengirim formulir, Anda setuju dihubungi tim kami via
                WhatsApp/telepon. Data Anda kami jaga dan tidak dibagikan ke pihak
                ketiga.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
