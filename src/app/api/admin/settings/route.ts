import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import type { NextRequest } from "next/server";

/** Schema pengaturan situs — SEMUA field bisa diedit dari admin */
const settingsSchema = z.object({
  siteName: z.string().min(1).max(160),
  legalName: z.string().min(1).max(160),
  domain: z.string().min(1).max(200),
  tagline: z.string().max(200),
  description: z.string().max(3000),
  phone: z.string().max(40),
  phoneHref: z.string().max(60),
  waNumber: z.string().max(20),
  email: z.string().max(120),
  hours: z.string().max(120),
  waMessage: z.string().max(500),
  street: z.string().max(300),
  city: z.string().max(80),
  region: z.string().max(80),
  postal: z.string().max(12),
  country: z.string().max(4),
  lat: z.number(),
  lng: z.number(),
  heroBadge: z.string().max(200),
  heroTitle1: z.string().max(200),
  heroTitle2: z.string().max(200),
  heroDesc: z.string().max(1200),
  heroCta1: z.string().max(80),
  heroCta2: z.string().max(80),
  heroCardTitle: z.string().max(200),
  heroCardBadge: z.string().max(200),
  heroCardText: z.string().max(500),
  heroStatNum: z.string().max(20),
  heroStatLabel: z.string().max(80),
  heroChipsJson: z.string().max(1000),
  seoTitle: z.string().max(200),
  seoDescription: z.string().max(500),
  seoKeywords: z.string().max(2000),
  footerAbout: z.string().max(1000),
  footerCopyright: z.string().max(300),
});

export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  try {
    const body = await request.json();
    const parsed = settingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message ?? "Data tidak valid",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const updated = await db.siteSettings.update({
      where: { id: "main" },
      data: JSON.parse(JSON.stringify(parsed.data)),
    });

    await db.contentRevision.create({
      data: {
        entityType: "settings",
        entityId: "main",
        label: "Ubah Pengaturan Situs",
        dataJson: JSON.stringify(updated),
      },
    });
    await logActivity(session.email, "update", "settings", "main", "Pengaturan situs diperbarui");
    revalidatePath("/");

    return NextResponse.json({ ok: true, settings: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal menyimpan pengaturan" },
      { status: 500 }
    );
  }
}
