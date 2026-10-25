import { cookies } from "next/headers";
import { AdminShell } from "@/components/admin/admin-shell";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/cms-auth";

/**
 * LAYOUT ADMIN — jika ada session valid, bungkus dengan AdminShell.
 * Halaman /admin/login (tanpa session) dirender polos.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell adminName={session.name} adminEmail={session.email}>
      {children}
    </AdminShell>
  );
}
