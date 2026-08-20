import { NextResponse } from "next/server";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/cards/${id}/pay`,
    { method: "POST", body: JSON.stringify(body) },
    { persistRefresh: true },
  );

  const data = await response.json().catch(() => null);
  return NextResponse.json(data, { status: response.status });
}
