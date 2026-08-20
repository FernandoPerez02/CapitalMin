import "server-only";
import type { Obligation, ObligationStatus } from "@/types/obligation";
import { getSession, backendFetch } from "@/lib/backend-client";

export interface ObligationFilters {
  status?: ObligationStatus;
}

export async function getObligations(filters?: ObligationFilters): Promise<Obligation[]> {
  const session = await getSession();
  if (!session) return [];

  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/obligations${query ? `?${query}` : ""}`,
  );
  if (!response.ok) return [];

  return response.json();
}
