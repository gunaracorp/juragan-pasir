import { NextResponse } from "next/server";
import { z } from "zod";
<<<<<<< HEAD
import { db } from "@/lib/db";

/**
 * API PENERIMAAN PERMINTAAN PENAWARAN (Integration Layer)
 * Lead tersimpan permanen ke database CMS → muncul di Leads Inbox admin.
 * Validasi ketat server-side (input hygiene) dengan zod.
=======

/**
 * API penerimaan permintaan penawaran.
 * Validasi ketat di server (input hygiene) — data dicatat ke log server
 * dan bisa dialihkan ke CRM/WhatsApp gateway di kemudian hari.
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
 */

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(120),
  phone: z
    .string()
    .trim()
    .min(9, "Nomor WhatsApp tidak valid")
    .max(20)
    .regex(/^[+0-9()\-\s]+$/, "Nomor hanya boleh berisi angka dan karakter telepon"),
<<<<<<< HEAD
  clientType: z.string().trim().min(2).max(80),
  sandType: z.string().trim().min(1).max(80),
  volume: z.string().trim().min(1).max(80),
=======
  clientType: z.enum(["perseorangan", "kontraktor", "perusahaan", "instansi"]),
  sandType: z.string().trim().min(1).max(60),
  volume: z.string().trim().min(1).max(60),
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f
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

<<<<<<< HEAD
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
=======
    // Di produksi: teruskan ke CRM / email / WhatsApp gateway.
    console.log(`[QUOTE BARU ${ref}]`, JSON.stringify(data));
>>>>>>> 452733ccbfbe95fbead2cb9e2abc022d0594cb5f

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
