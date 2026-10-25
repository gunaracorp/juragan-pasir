import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/cms-admin-guard";
import type { NextRequest } from "next/server";

/** Statistik dashboard admin: leads, konten, aktivitas */
export async function GET(request: NextRequest) {
  const { session, response } = await requireAdmin(request);
  if (!session) return response;

  const [
    totalLeads,
    newLeads,
    wonLeads,
    totalProducts,
    visibleSections,
    totalSections,
    totalTestimonials,
    totalFaqs,
    recentLeads,
    leadsByStatus,
    leadsByDay,
  ] = await Promise.all([
    db.quoteRequest.count(),
    db.quoteRequest.count({ where: { status: "BARU" } }),
    db.quoteRequest.count({ where: { status: "DEAL" } }),
    db.product.count(),
    db.section.count({ where: { visible: true } }),
    db.section.count(),
    db.testimonial.count(),
    db.faq.count(),
    db.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    db.quoteRequest.groupBy({ by: ["status"], _count: { _all: true } }),
    db.$queryRaw<{ d: string; c: number }[]>`
      SELECT substr(createdAt, 1, 10) as d, COUNT(*) as c
      FROM QuoteRequest
      WHERE createdAt >= datetime('now', '-13 days')
      GROUP BY substr(createdAt, 1, 10)
      ORDER BY d ASC`,
  ]);

  return NextResponse.json({
    ok: true,
    admin: { name: session.name, email: session.email },
    stats: {
      totalLeads,
      newLeads,
      wonLeads,
      totalProducts,
      visibleSections,
      totalSections,
      totalTestimonials,
      totalFaqs,
    },
    recentLeads,
    leadsByStatus: leadsByStatus.map((g) => ({ status: g.status, count: g._count._all })),
    leadsByDay,
  });
}
