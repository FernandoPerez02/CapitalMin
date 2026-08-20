import "server-only";
import type { Debt } from "@/types/debt";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getDebts(): Promise<Debt[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/debts`);
  if (!response.ok) return [];

  return response.json();
}
