import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, logActivity } from "@/lib/cms-admin-guard";
import { getResource } from "@/lib/cms-resource-registry";
import type { NextRequest } from "next/server";

function refresh() {
  revalidatePath("/");
}

// ---------------- GET: daftar semua item ----------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const { model } = await params;
  const res = getResource(model);
  if (!res) {
    return NextResponse.json({ ok: false, error: "Model tidak dikenal" }, { status: 404 });
  }
  const items = await res
    .delegate()
    .findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json({ ok: true, items });
}

// ---------------- POST: buat item baru ----------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ model: string }> }
) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const { model } = await params;
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

    // Sanitasi: simpan hanya field yang tervalidasi
    const data = JSON.parse(JSON.stringify(parsed.data));
    const created = (await res.delegate().create({ data })) as Record<string, unknown>;
    const label = res.label(parsed.data as Record<string, unknown>);

    await db.contentRevision.create({
      data: {
        entityType: model,
        entityId: String(created.id ?? ""),
        label: `Buat: ${label}`,
        dataJson: JSON.stringify(created),
      },
    });
    await logActivity(session.email, "create", model, String(created.id ?? ""), label);
    refresh();

    return NextResponse.json({ ok: true, item: created });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Gagal membuat data" },
      { status: 500 }
    );
  }
}
