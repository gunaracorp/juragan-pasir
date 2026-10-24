import { Header } from "@/components/juragan/header";
import { Hero } from "@/components/juragan/hero";
import { Stats } from "@/components/juragan/stats";
import { Products } from "@/components/juragan/products";
import { Calculator } from "@/components/juragan/calculator";
import { Segments } from "@/components/juragan/segments";
import { WhyUs } from "@/components/juragan/why-us";
import { Process } from "@/components/juragan/process";
import { Coverage } from "@/components/juragan/coverage";
import { Testimonials } from "@/components/juragan/testimonials";
import { Faq } from "@/components/juragan/faq";
import { QuoteForm } from "@/components/juragan/quote-form";
import { Footer } from "@/components/juragan/footer";
import { WhatsAppFloat } from "@/components/juragan/whatsapp-float";

/**
 * JURAGAN PASIR — Pusat Pasir Terbaik Se-Indonesia
 * Halaman utama satu-halaman: narasi merek dari atas (hero) ke bawah
 * (konversi), dengan struktur semantik penuh untuk mesin pencari.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="konten-utama" className="flex-1">
        <Hero />
        <Stats />
        <Products />
        <Calculator />
        <Segments />
        <WhyUs />
        <Process />
        <Coverage />
        <Testimonials />
        <Faq />
        <QuoteForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
