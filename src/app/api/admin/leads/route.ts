import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import type { NextRequest } from "next/server";

const STATUSES = ["BARU", "DIHUBUNGI", "PENAWARAN", "DEAL", "BATAL"] as const;

/** Leads Inbox — daftar permintaan penawaran masuk dari frontend */
export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const leads = await db.quoteRequest.findMany({
    where: status && STATUSES.includes(status as (typeof STATUSES)[number]) ? { status } : {},
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json({ ok: true, leads });
}

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(STATUSES).optional(),
  notes: z.string().max(2000).optional(),
});

/** Update status/notes lead (pipeline penjualan) */
export async function PATCH(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  try {
    const body = await request.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Data tidak valid" }, { status: 400 });
    }
    const { id, ...data } = parsed.data;
    const updated = await db.quoteRequest.update({ where: { id }, data });
    await logActivity(
      session.email,
      "update",
      "lead",
      id,
      `Status lead ${updated.ref} → ${updated.status}`
    );
    return NextResponse.json({ ok: true, lead: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal memperbarui lead" },
      { status: 500 }
    );
  }
}

/** Hapus lead */
export async function DELETE(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "ID wajib diisi" }, { status: 400 });
  }
  try {
    const lead = await db.quoteRequest.delete({ where: { id } });
    await logActivity(session.email, "delete", "lead", id, `Hapus lead ${lead.ref}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus lead" },
      { status: 500 }
    );
  }
}
