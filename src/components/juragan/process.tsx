"use client";

import { ClipboardCheck, Handshake, MessagesSquare, Scale, type LucideIcon } from "lucide-react";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: MessagesSquare,
    title: "Konsultasi & Kebutuhan",
    body: "Ceritakan proyek Anda via WhatsApp, telepon, atau form. Individu cukup sebutkan perkiraan kebutuhan; organisasi bisa lampirkan permintaan resmi.",
  },
  {
    icon: ClipboardCheck,
    title: "Penawaran Tertulis",
    body: "Penawaran resmi berisi spesifikasi, harga rinci, dan jadwal dikirim maksimal 1×24 jam. Sampel material bisa diatur untuk kontrak besar.",
  },
  {
    icon: Handshake,
    title: "Kesepakatan & Jadwal",
    body: "Individu cukup sepakat via chat; kontraktor dan instansi kami siapkan PO/kontrak. Jadwal kirim dikunci sesuai ritme pekerjaan Anda.",
  },
  {
    icon: Scale,
    title: "Kirim & Terima Terukur",
    body: "Volume diukur (kubikasi/timbangan), surat jalan menyertai setiap armada, dan BAST ditandatangani saat penerimaan. Selesai dengan rapi.",
  },
];

export function Process() {
  return (
    <section
      id="proses"
      aria-labelledby="judul-proses"
      className="grain-texture relative scroll-mt-24 bg-stone-950 py-24"
    >
      <div
        aria-hidden="true"
        className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-amber-600/15 blur-[110px]"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          dark
          eyebrow="Alur Kerja"
          title="Dari Chat Sampai Pasir Sampai:"
          highlight="Empat Langkah"
          description="Proses yang sama rapihnya entah Anda seorang pemilik rumah atau pembeli 10.000 ton. Transparansi adalah prosedur baku kami."
        />

        <ol className="relative mx-auto grid max-w-5xl gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {/* Garis penghubung di desktop */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-stone-800 lg:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <li className="relative">
                <div className="flex flex-col items-start lg:items-center lg:text-center">
                  <span
                    aria-hidden="true"
                    className="relative z-10 mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                  >
                    <step.icon className="h-6 w-6" />
                  </span>
                  <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-500">
                    Langkah {i + 1}
                  </p>
                  <h3 className="text-lg font-extrabold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone-400">{step.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
