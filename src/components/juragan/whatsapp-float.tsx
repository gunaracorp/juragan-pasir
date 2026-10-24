import { MessageCircle } from "lucide-react";
import { SITE, WA_DEFAULT_MESSAGE } from "@/lib/juragan-data";

/**
 * Tombol WhatsApp mengambang — kanal konversi utama pasar Indonesia.
 * Gaya kartu label putih + lingkaran hijau khas, selalu terjangkau ibu jari.
 */
export function WhatsAppFloat() {
  const waLink = `${SITE.wa}?text=${encodeURIComponent(WA_DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-3">
      {/* Label (desktop) */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden="true"
        tabIndex={-1}
        className="hidden items-center gap-2.5 rounded-full bg-white py-2.5 pl-4 pr-5 shadow-[0_10px_30px_rgba(2,23,16,0.25)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 md:flex"
      >
        <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wa opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-wa" />
        </span>
        <span className="leading-tight">
          <span className="block text-[13px] font-extrabold text-ink-900">Chat WhatsApp</span>
          <span className="block text-[11px] font-medium text-ink-400">{SITE.phone}</span>
        </span>
      </a>

      {/* Tombol bulat */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp Juragan Pasir (tab baru)"
        className="flex h-15 w-15 items-center justify-center rounded-full bg-wa text-white shadow-[0_10px_30px_rgba(31,184,87,0.45)] ring-4 ring-wa/20 transition-all hover:-translate-y-1 hover:bg-[#22c963]"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
        <span className="sr-only">Hubungi kami via WhatsApp: {SITE.phone}</span>
      </a>
    </div>
  );
}
