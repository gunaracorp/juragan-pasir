/**
 * CMS CONTENT LAYER — lapisan integrasi antara Database dan Frontend
 *
 * Arsitektur 3-lapis:
 *   Backend (admin CRUD) → Database (SQLite/Prisma) → Frontend (render)
 *
 * Semua konten halaman depan dibaca di sini. Setiap kali admin
 * menyimpan perubahan, `revalidatePath("/")` memicu render ulang.
 */
import { cache } from "react";
import { db } from "@/lib/db";
import type {
  CmsContent,
  CmsSettings,
  CmsProduct,
  CmsSegment,
  CmsRegion,
} from "@/lib/cms-types";

function parseJsonArray<T = string>(json: string): T[] {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** Muat pengaturan situs + parsing field turunan */
async function loadSettings(): Promise<CmsSettings> {
  const s = await db.siteSettings.findUnique({ where: { id: "main" } });
  if (!s) {
    throw new Error("SiteSettings belum di-seed. Jalankan: bun scripts/seed.ts");
  }
  return {
    siteName: s.siteName,
    legalName: s.legalName,
    domain: s.domain,
    tagline: s.tagline,
    description: s.description,
    phone: s.phone,
    phoneHref: s.phoneHref,
    waNumber: s.waNumber,
    wa: `https://wa.me/${s.waNumber}`,
    email: s.email,
    hours: s.hours,
    waMessage: s.waMessage,
    address: {
      street: s.street,
      city: s.city,
      region: s.region,
      postal: s.postal,
      country: s.country,
    },
    geo: { lat: s.lat, lng: s.lng },
    hero: {
      badge: s.heroBadge,
      title1: s.heroTitle1,
      title2: s.heroTitle2,
      desc: s.heroDesc,
      cta1: s.heroCta1,
      cta2: s.heroCta2,
      cardTitle: s.heroCardTitle,
      cardBadge: s.heroCardBadge,
      cardText: s.heroCardText,
      statNum: s.heroStatNum,
      statLabel: s.heroStatLabel,
      chips: parseJsonArray(s.heroChipsJson),
    },
    seo: {
      title: s.seoTitle,
      description: s.seoDescription,
      keywords: s.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean),
    },
    footer: { about: s.footerAbout, copyright: s.footerCopyright },
  };
}

/**
 * Konten penuh — di-cache per-request via React cache().
 * Tanpa cache lintas-request agar perubahan admin langsung tampil.
 */
export const getCmsContent = cache(async (): Promise<CmsContent> => {
  const [settings, sections, products, segments, faqs, regions, testimonials, stats, processSteps, whyUs] =
    await Promise.all([
      loadSettings(),
      db.section.findMany({ orderBy: { order: "asc" } }),
      db.product.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.segment.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.faq.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.region.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.stat.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.processStep.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
      db.whyUsItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }),
    ]);

  return {
    settings,
    sections,
    products: products.map<CmsProduct>((p) => ({
      id: p.id,
      name: p.name,
      alias: p.alias,
      badge: p.badge,
      useCase: p.useCase,
      spec: parseJsonArray(p.specJson),
      price: p.price,
      tone: p.tone,
      calcBase: p.calcBase,
      calcUnit: p.calcUnit,
    })),
    segments: segments.map<CmsSegment>((s) => ({
      id: s.id,
      icon: s.icon,
      title: s.title,
      subtitle: s.subtitle,
      points: parseJsonArray(s.pointsJson),
    })),
    faqs: faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
    regions: regions.map<CmsRegion>((r) => ({
      id: r.id,
      island: r.island,
      cities: parseJsonArray(r.citiesJson),
    })),
    testimonials: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      initials: t.initials,
      rating: t.rating,
      text: t.text,
    })),
    stats: stats.map((st) => ({
      id: st.id,
      icon: st.icon,
      target: st.target,
      decimals: st.decimals,
      suffix: st.suffix,
      label: st.label,
    })),
    processSteps: processSteps.map((p) => ({
      id: p.id,
      icon: p.icon,
      title: p.title,
      body: p.body,
    })),
    whyUs: whyUs.map((w) => ({ id: w.id, icon: w.icon, title: w.title, body: w.body })),
  };
});

/** JSON-LD schema.org dibangun dari database (E-E-A-T) */
export async function buildSchemaFromDb() {
  const { settings, products, faqs, regions } = await getCmsContent();
  const SITE = settings;

  const org = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE.domain}/#organization`,
    name: SITE.siteName,
    legalName: SITE.legalName,
    url: SITE.domain,
    description: SITE.description,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: "Rp 180.000 - Rp 1.500.000",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postal,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    areaServed: regions.flatMap((r) => r.cities.map((c) => ({ "@type": "City", name: c }))),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1248",
      bestRating: "5",
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.siteName,
    description: SITE.description,
    inLanguage: "id-ID",
    publisher: { "@id": `${SITE.domain}/#organization` },
  };

  const catalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE.domain}/#products`,
    name: `Katalog Pasir Galunggung — ${SITE.siteName}`,
    itemListElement: products.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: p.name,
        alternateName: p.alias,
        description: p.useCase,
        category: "Material Konstruksi > Pasir",
        brand: { "@type": "Brand", name: SITE.siteName },
      },
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "IDR",
        description: p.price,
      },
      seller: { "@id": `${SITE.domain}/#organization` },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE.domain}/#faq`,
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: SITE.domain },
      { "@type": "ListItem", position: 2, name: "Produk Pasir", item: `${SITE.domain}/#produk` },
      { "@type": "ListItem", position: 3, name: "Minta Penawaran", item: `${SITE.domain}/#penawaran` },
    ],
  };

  return [org, website, catalog, faqSchema, breadcrumb];
}
