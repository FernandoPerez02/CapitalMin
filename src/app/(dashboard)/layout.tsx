import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession } from "@/lib/session";
import DashboardShell from "@/components/layout/dashboard-shell";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);

  return <DashboardShell user={session}>{children}</DashboardShell>;
}
