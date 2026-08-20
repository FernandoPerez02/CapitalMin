import "server-only";
import type { Card } from "@/types/card";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getCards(): Promise<Card[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/cards`);
  if (!response.ok) return [];

  return response.json();
}
