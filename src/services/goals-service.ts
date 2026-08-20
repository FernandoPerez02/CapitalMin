import "server-only";
import type { Goal } from "@/types/goal";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getGoals(): Promise<Goal[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/goals`);
  if (!response.ok) return [];

  return response.json();
}
