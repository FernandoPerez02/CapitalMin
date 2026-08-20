import "server-only";
import type { Movement, MovementStatus, MovementType } from "@/types/movement";
import { getSession, backendFetch } from "@/lib/backend-client";

interface BackendMovement {
  id: string;
  date: string;
  typeMovement: Movement["typeMovement"];
  description: string;
  amount: number;
  status: Movement["status"];
  categoryId: string | null;
  category: { id: string; name: string } | null;
  walletId: string | null;
  cardId: string | null;
}

export interface MovementFilters {
  dateFrom?: string;
  dateTo?: string;
  status?: MovementStatus;
  typeMovement?: MovementType;
}

export async function getMovements(filters?: MovementFilters): Promise<Movement[]> {
  const session = await getSession();
  if (!session) return [];

  const params = new URLSearchParams();
  if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.set("dateTo", filters.dateTo);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.typeMovement) params.set("typeMovement", filters.typeMovement);
  const query = params.toString();

  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/movements${query ? `?${query}` : ""}`,
  );
  if (!response.ok) return [];

  const movements = (await response.json()) as BackendMovement[];

  return movements.map((movement) => ({
    id: movement.id,
    date: movement.date.slice(0, 10),
    typeMovement: movement.typeMovement,
    description: movement.description,
    amount: movement.amount,
    status: movement.status,
    categoryId: movement.categoryId,
    category: movement.category,
    walletId: movement.walletId,
    cardId: movement.cardId,
  }));
}
