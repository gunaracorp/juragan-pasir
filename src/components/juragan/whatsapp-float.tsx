import { MessageCircle } from "lucide-react";
import { SITE } from "@/lib/juragan-data";

/**
 * Tombol WhatsApp mengambang — kanal konversi utama pasar Indonesia.
 * Selalu terjangkau ibu jari, kontras kuat, dan berlabel aksesibel.
 */
export function WhatsAppFloat() {
  return (
    <a
      href={SITE.wa}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp Juragan Pasir (tab baru)"
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-900/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2"
    >
      <MessageCircle className="h-7 w-7" aria-hidden="true" />
      <span className="sr-only">Hubungi kami via WhatsApp: {SITE.phone}</span>
    </a>
  );
}
