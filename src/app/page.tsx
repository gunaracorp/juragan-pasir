<<<<<<< HEAD
import type { Metadata } from "next";
import { Header, type NavLink } from "@/components/juragan/header";
=======
import { Header } from "@/components/juragan/header";
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
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
<<<<<<< HEAD
import { getCmsContent, buildSchemaFromDb } from "@/lib/cms-content";
import { getSection } from "@/lib/cms-types";

/**
 * JURAGAN PASIR CMS — FRONTEND
 * Halaman dirender dari registry Section di database (plugin architecture):
 * urutan, visibilitas, dan judul tiap section dikendalikan dari /admin.
 * Menambah section baru = daftarkan renderer + tambah baris — tanpa rombak kode.
 *
 * force-dynamic: konten HARUS selalu mengikuti database secara real-time
 * (perilaku WordPress) — setiap simpanan admin langsung tampil.
 */
export const dynamic = "force-dynamic";

const SECTION_ANCHORS: Record<string, NavLink> = {
  products: { href: "#produk", label: "Produk Pasir" },
  calculator: { href: "#kalkulator", label: "Kalkulator" },
  segments: { href: "#segmen", label: "Segmen Klien" },
  whyus: { href: "#keunggulan", label: "Keunggulan" },
  process: { href: "#proses", label: "Proses" },
  coverage: { href: "#jangkauan", label: "Jangkauan" },
  testimonials: { href: "#testimoni", label: "Testimoni" },
  faq: { href: "#faq", label: "FAQ" },
};

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getCmsContent();
  return {
    metadataBase: new URL(settings.domain),
    title: {
      default: settings.seo.title,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.seo.description,
    keywords: settings.seo.keywords,
    authors: [{ name: settings.legalName, url: settings.domain }],
    creator: settings.legalName,
    publisher: settings.legalName,
    category: "Material Konstruksi",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url: settings.domain,
      siteName: settings.siteName,
      title: settings.seo.title,
      description: settings.seo.description,
    },
  };
}

export default async function Home() {
  const content = await getCmsContent();
  const { settings, sections } = content;

  // Navigasi dinamis: hanya section visible yang muncul di menu
  const nav = sections
    .filter((s) => s.visible && SECTION_ANCHORS[s.key])
    .map((s) => SECTION_ANCHORS[s.key]);

  // JSON-LD dari database
  const schema = await buildSchemaFromDb();

  /** Registry renderer — titik ekstensi untuk section baru */
  const renderSection = (key: string) => {
    switch (key) {
      case "hero":
        return <Hero key={key} settings={settings} section={getSection(content, key)} />;
      case "stats":
        return <Stats key={key} stats={content.stats} />;
      case "products":
        return (
          <Products key={key} products={content.products} section={getSection(content, key)} />
        );
      case "calculator":
        return <Calculator key={key} section={getSection(content, key)} />;
      case "segments":
        return (
          <Segments key={key} segments={content.segments} section={getSection(content, key)} />
        );
      case "whyus":
        return <WhyUs key={key} items={content.whyUs} section={getSection(content, key)} />;
      case "process":
        return (
          <Process key={key} steps={content.processSteps} section={getSection(content, key)} />
        );
      case "coverage":
        return (
          <Coverage key={key} regions={content.regions} section={getSection(content, key)} />
        );
      case "testimonials":
        return (
          <Testimonials
            key={key}
            testimonials={content.testimonials}
            section={getSection(content, key)}
          />
        );
      case "faq":
        return <Faq key={key} faqs={content.faqs} section={getSection(content, key)} />;
      case "quote":
        return (
          <QuoteForm
            key={key}
            settings={settings}
            products={content.products}
            section={getSection(content, key)}
          />
        );
      default:
        // Section terdaftar tanpa renderer: dilewati dengan aman (plugin belum aktif)
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header site={settings} nav={nav} />
      <main id="konten-utama" className="flex-1">
        {sections
          .filter((s) => s.visible)
          .map((s) => renderSection(s.key))}
      </main>
      <Footer settings={settings} products={content.products} />
      <WhatsAppFloat settings={settings} />
=======

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
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
    </div>
  );
}
