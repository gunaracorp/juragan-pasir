import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * API PENERIMAAN PERMINTAAN PENAWARAN (Integration Layer)
 * Lead tersimpan permanen ke database CMS → muncul di Leads Inbox admin.
 * Validasi ketat server-side (input hygiene) dengan zod.
 */

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp tidak valid")
    .max(20)
    .regex(/^[+0-9()\-\s]+$/, "Nomor hanya boleh berisi angka dan karakter telepon"),
  clientType: z.string().trim().min(2).max(80),
  sandType: z.string().trim().min(1).max(80),
  volume: z.string().trim().min(1).max(80),
  city: z.string().trim().min(2, "Sebutkan kota pengiriman").max(80),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = quoteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Data tidak valid",
          issues: parsed.error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const ref = `JP-${Date.now().toString(36).toUpperCase()}`;

    // Simpan permanen → Leads Inbox admin CMS
    await db.quoteRequest.create({
      data: {
        ref,
        name: data.name,
        phone: data.phone,
        clientType: data.clientType,
        sandType: data.sandType,
        volume: data.volume,
        city: data.city,
        message: data.message || null,
      },
    });

    return NextResponse.json({
      ok: true,
      reference: ref,
      message:
        "Permintaan penawaran diterima. Tim kami akan menghubungi WhatsApp Anda maksimal 1x24 jam kerja.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Permintaan tidak dapat diproses" },
      { status: 500 }
    );
  }
}
