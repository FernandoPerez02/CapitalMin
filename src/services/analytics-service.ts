import "server-only";
import type { CategoryTrend } from "@/types/analytics";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getCategoryTrends(months?: number): Promise<CategoryTrend[]> {
  const session = await getSession();
  if (!session) return [];

  const query = months ? `?months=${months}` : "";
  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/analytics/category-trends${query}`,
  );
  if (!response.ok) return [];

  return response.json();
}
