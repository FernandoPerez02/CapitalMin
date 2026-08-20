import { NextResponse } from "next/server";
import { loginFormSchema } from "@/lib/schemas/login-schema";
import { establishSession } from "@/lib/auth-session";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { email, password, remember } = parsed.data;

  const loginResponse = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!loginResponse.ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const tokens = (await loginResponse.json()) as { accessToken: string; refreshToken: string };
  return establishSession(tokens, remember ?? true);
}
