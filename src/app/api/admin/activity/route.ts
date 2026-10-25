import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/cms-admin-guard";
import type { NextRequest } from "next/server";

/** Log aktivitas admin — audit trail transparan */
export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const logs = await db.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return NextResponse.json({ ok: true, logs });
}
