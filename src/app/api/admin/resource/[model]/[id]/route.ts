import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import { getResource } from "@/lib/cms-resource-registry";
import type { NextRequest } from "next/server";

function refresh() {
  revalidatePath("/");
}

// ---------------- PUT: update item ----------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const { model, id } = await params;
  const res = getResource(model);
  if (!res) {
    return NextResponse.json({ ok: false, error: "Model tidak dikenal" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const parsed = res.schema.safeParse(body);
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

    // Revisi = keadaan LAMA sebelum diubah (agar rollback mengembalikan versi sebelumnya)
    const existing = (await res.delegate().findUnique({ where: { id } })) as Record<
      string,
      unknown
    > | null;
    if (existing) {
      await db.contentRevision.create({
        data: {
          entityType: model,
          entityId: id,
          label: `Sebelum ubah: ${res.label(existing)}`,
          dataJson: JSON.stringify(existing),
        },
      });
    }

    const data = JSON.parse(JSON.stringify(parsed.data));
    const updated = (await res.delegate().update({ where: { id }, data })) as Record<
      string,
      unknown
    >;
    const label = res.label(parsed.data as Record<string, unknown>);

    await logActivity(session.email, "update", model, id, label);
    refresh();

    return NextResponse.json({ ok: true, item: updated });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}

// ---------------- DELETE: hapus item ----------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ model: string; id: string }> }
) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const { model, id } = await params;
  const res = getResource(model);
  if (!res) {
    return NextResponse.json({ ok: false, error: "Model tidak dikenal" }, { status: 404 });
  }

  try {
    const existing = await res.delegate().findUnique({ where: { id } });
    if (existing) {
      await db.contentRevision.create({
        data: {
          entityType: model,
          entityId: id,
          label: `Hapus: ${res.label(existing as Record<string, unknown>)}`,
          dataJson: JSON.stringify(existing),
        },
      });
    }
    await res.delegate().delete({ where: { id } });
    await logActivity(
      session.email,
      "delete",
      model,
      id,
      existing ? res.label(existing as Record<string, unknown>) : id
    );
    refresh();

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
