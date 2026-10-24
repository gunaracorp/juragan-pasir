import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * API penerimaan permintaan penawaran.
 * Validasi ketat di server (input hygiene) — data dicatat ke log server
 * dan bisa dialihkan ke CRM/WhatsApp gateway di kemudian hari.
 */

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp tidak valid")
    .max(20)
    .regex(/^[+0-9()\-\s]+$/, "Nomor hanya boleh berisi angka dan karakter telepon"),
  clientType: z.enum(["perseorangan", "kontraktor", "perusahaan", "instansi"]),
  sandType: z.string().trim().min(1).max(60),
  volume: z.string().trim().min(1).max(60),
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

    // Di produksi: teruskan ke CRM / email / WhatsApp gateway.
    console.log(`[QUOTE BARU ${ref}]`, JSON.stringify(data));

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
