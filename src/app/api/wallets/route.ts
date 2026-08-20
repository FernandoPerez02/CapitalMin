import { NextResponse } from "next/server";
import { getSession, backendFetch } from "@/lib/backend-client";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const response = await backendFetch(
    session,
    `/accounts/${session.accountId}/wallets`,
    { method: "POST", body: JSON.stringify(body) },
    { persistRefresh: true },
  );

  const data = await response.json().catch(() => null);
  return NextResponse.json(data, { status: response.status });
}
