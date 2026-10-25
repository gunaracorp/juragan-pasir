import { z } from "zod";
import { db } from "@/lib/db";

/**
 * REGISTRY MODEL RESOURCE — jantung ekstensibilitas CMS.
 * Menambah jenis konten baru = tambah entri di sini + schema zod.
 * Semua CRUD, revisi, log, dan revalidation otomatis via Resource API.
 */

export type ResourceEntry = {
  delegate: () => any;
  schema: z.ZodObject<z.ZodRawShape>;
  label: (d: Record<string, unknown>) => string;
};

export const MODEL_REGISTRY: Record<string, ResourceEntry> = {
  product: {
    delegate: () => db.product,
    schema: z.object({
      name: z.string().min(1).max(120),
      alias: z.string().max(160).default(""),
      badge: z.string().max(60).nullable().optional(),
      useCase: z.string().max(2000).default(""),
      specJson: z.string().default("[]"),
      price: z.string().max(120).default(""),
      tone: z.string().max(20).default("#C29B4C"),
      calcBase: z.number().nonnegative().default(300),
      calcUnit: z.string().max(8).default("m3"),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.name ?? "Produk"),
  },
  segment: {
    delegate: () => db.segment,
    schema: z.object({
      icon: z.string().max(40).default("Home"),
      title: z.string().min(1).max(160),
      subtitle: z.string().max(300).default(""),
      pointsJson: z.string().default("[]"),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.title ?? "Segmen"),
  },
  faq: {
    delegate: () => db.faq,
    schema: z.object({
      question: z.string().min(1).max(400),
      answer: z.string().min(1).max(4000),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.question ?? "FAQ").slice(0, 60),
  },
  region: {
    delegate: () => db.region,
    schema: z.object({
      island: z.string().min(1).max(80),
      citiesJson: z.string().default("[]"),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.island ?? "Wilayah"),
  },
  testimonial: {
    delegate: () => db.testimonial,
    schema: z.object({
      name: z.string().min(1).max(120),
      role: z.string().max(200).default(""),
      initials: z.string().max(4).default(""),
      rating: z.number().int().min(1).max(5).default(5),
      text: z.string().min(1).max(2000),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.name ?? "Testimoni"),
  },
  stat: {
    delegate: () => db.stat,
    schema: z.object({
      icon: z.string().max(40).default("Gem"),
      target: z.number().default(0),
      decimals: z.number().int().min(0).max(2).default(0),
      suffix: z.string().max(12).default(""),
      label: z.string().min(1).max(120),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.label ?? "Statistik"),
  },
  process: {
    delegate: () => db.processStep,
    schema: z.object({
      icon: z.string().max(40).default("MessagesSquare"),
      title: z.string().min(1).max(160),
      body: z.string().max(1200).default(""),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.title ?? "Langkah"),
  },
  whyus: {
    delegate: () => db.whyUsItem,
    schema: z.object({
      icon: z.string().max(40).default("FlaskConical"),
      title: z.string().min(1).max(160),
      body: z.string().max(1200).default(""),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.title ?? "Keunggulan"),
  },
  // Registry Section Manager — kendali urutan & visibilitas halaman depan.
  // key tidak bisa diedit (identifier renderer); sisanya bebas diubah admin.
  sections: {
    delegate: () => db.section,
    schema: z.object({
      key: z.string().min(1).max(40),
      title: z.string().min(1).max(160),
      eyebrow: z.string().max(120).default(""),
      heading: z.string().max(160).default(""),
      highlight: z.string().max(160).default(""),
      description: z.string().max(600).default(""),
      order: z.number().int().default(0),
      visible: z.boolean().default(true),
    }),
    label: (d) => String(d.title ?? "Section"),
  },
};

export function getResource(model: string): ResourceEntry | null {
  return MODEL_REGISTRY[model] ?? null;
}
