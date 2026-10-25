/**
 * TIPE KONTEN CMS — kontrak data antara Backend (admin) dan Frontend
 */

export type CmsSection = {
  id: string;
  key: string;
  title: string;
  order: number;
  visible: boolean;
  eyebrow: string;
  heading: string;
  highlight: string;
  description: string;
};

export type CmsSettings = {
  siteName: string;
  legalName: string;
  domain: string;
  tagline: string;
  description: string;
  phone: string;
  phoneHref: string;
  waNumber: string;
  wa: string;
  email: string;
  hours: string;
  waMessage: string;
  address: {
    street: string;
    city: string;
    region: string;
    postal: string;
    country: string;
  };
  geo: { lat: number; lng: number };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    cta1: string;
    cta2: string;
    cardTitle: string;
    cardBadge: string;
    cardText: string;
    statNum: string;
    statLabel: string;
    chips: string[];
  };
  seo: { title: string; description: string; keywords: string[] };
  footer: { about: string; copyright: string };
};

export type CmsProduct = {
  id: string;
  name: string;
  alias: string;
  badge?: string | null;
  useCase: string;
  spec: string[];
  price: string;
  tone: string;
  calcBase: number;
  calcUnit: "m3" | "ton" | string;
};

export type CmsSegment = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  points: string[];
};

export type CmsFaq = { id: string; question: string; answer: string };

export type CmsRegion = { id: string; island: string; cities: string[] };

export type CmsTestimonial = {
  id: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  text: string;
};

export type CmsStat = {
  id: string;
  icon: string;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
};

export type CmsProcessStep = { id: string; icon: string; title: string; body: string };

export type CmsWhyUsItem = { id: string; icon: string; title: string; body: string };

/** Bundle konten penuh — satu kali query untuk seluruh halaman */
export type CmsContent = {
  settings: CmsSettings;
  sections: CmsSection[];
  products: CmsProduct[];
  segments: CmsSegment[];
  faqs: CmsFaq[];
  regions: CmsRegion[];
  testimonials: CmsTestimonial[];
  stats: CmsStat[];
  processSteps: CmsProcessStep[];
  whyUs: CmsWhyUsItem[];
};

/** Helper: ambil section berdasar key */
export function getSection(content: CmsContent, key: string): CmsSection | undefined {
  return content.sections.find((s) => s.key === key);
}
