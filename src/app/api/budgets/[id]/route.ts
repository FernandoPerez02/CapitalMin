import { NextResponse } from "next/server";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/budgets/${id}`,
    { method: "DELETE" },
    { persistRefresh: true },
  );

  return new NextResponse(null, { status: response.status });
}
