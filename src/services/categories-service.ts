import "server-only";
import type { Category } from "@/types/category";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getCategories(): Promise<Category[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/categories`);
  if (!response.ok) return [];

  return response.json();
}
