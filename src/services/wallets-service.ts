import "server-only";
import type { Wallet } from "@/types/wallet";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function getWallets(): Promise<Wallet[]> {
  const session = await getSession();
  if (!session) return [];

  const response = await backendFetch(session, `/accounts/${session.accountId}/wallets`);
  if (!response.ok) return [];

  return response.json();
}
