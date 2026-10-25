import { db } from "@/lib/db";
import { verifySessionToken } from "@/lib/cms-auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Guard untuk API admin — memverifikasi session JWT dan mencatat aktivitas.
 * Dipakai oleh semua route /api/admin/* setelah middleware.
 */
export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get("jp_cms_session")?.value;
  const session = token ? await verifySessionToken(token) : null;
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { ok: false, error: "Tidak terautentikasi" },
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}

/** Catat aktivitas admin (audit trail) */
export async function logActivity(
  adminEmail: string,
  action: string,
  entityType: string,
  entityId = "",
  detail = ""
) {
  try {
    await db.activityLog.create({
      data: { adminEmail, action, entityType, entityId, detail },
    });
  } catch {
    /* logging tidak boleh menggagalkan request utama */
  }
}
