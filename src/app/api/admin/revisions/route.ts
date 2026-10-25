import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import { getResource } from "@/lib/cms-resource-registry";
import type { NextRequest } from "next/server";

/** Daftar revisi konten (seperti WordPress Revisions) */
export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const url = new URL(request.url);
  const entityType = url.searchParams.get("entityType");
  const entityId = url.searchParams.get("entityId");

  const revisions = await db.contentRevision.findMany({
    where: {
      ...(entityType ? { entityType } : {}),
      ...(entityId ? { entityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ ok: true, revisions });
}

/** Rollback ke revisi tertentu — data disimpan kembali ke model asalnya */
export async function POST(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  try {
    const { revisionId } = (await request.json()) as { revisionId?: string };
    if (!revisionId) {
      return NextResponse.json({ ok: false, error: "revisionId wajib" }, { status: 400 });
    }

    const revision = await db.contentRevision.findUnique({ where: { id: revisionId } });
    if (!revision) {
      return NextResponse.json({ ok: false, error: "Revisi tidak ditemukan" }, { status: 404 });
    }

    const data = JSON.parse(revision.dataJson);
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;

    if (revision.entityType === "settings") {
      await db.siteSettings.update({ where: { id: "main" }, data });
    } else {
      const res = getResource(revision.entityType);
      if (!res) {
        return NextResponse.json(
          { ok: false, error: "Tipe entitas tidak didukung rollback" },
          { status: 400 }
        );
      }
      // Sanitasi field sesuai schema agar rollback aman
      const parsed = res.schema.safeParse(data);
      if (!parsed.success) {
        return NextResponse.json(
          { ok: false, error: "Data revisi tidak kompatibel dengan schema terkini" },
          { status: 400 }
        );
      }
      await res
        .delegate()
        .update({ where: { id: revision.entityId }, data: JSON.parse(JSON.stringify(parsed.data)) });
    }

    await logActivity(
      session.email,
      "revert",
      revision.entityType,
      revision.entityId,
      `Rollback ke revisi ${revision.id.slice(-6)}: ${revision.label}`
    );
    revalidatePath("/");

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal rollback" },
      { status: 500 }
    );
  }
}
