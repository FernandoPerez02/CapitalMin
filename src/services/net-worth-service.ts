import "server-only";
import type { NetWorth } from "@/types/net-worth";
import { getSession, backendFetch } from "@/lib/backend-client";
import { emptyNetWorth } from "@/lib/net-worth-defaults";

export async function getNetWorth(): Promise<NetWorth> {
  const session = await getSession();
  if (!session) return emptyNetWorth();

  const response = await backendFetch(session, `/accounts/${session.accountId}/net-worth`);
  if (!response.ok) return emptyNetWorth();

  return response.json();
}
