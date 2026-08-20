import { NextResponse } from "next/server";
import { registerFormSchema } from "@/lib/schemas/register-schema";
import { establishSession } from "@/lib/auth-session";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const registerResponse = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (registerResponse.status === 409) {
    return NextResponse.json({ error: "Ya existe una cuenta con este correo" }, { status: 409 });
  }

  if (!registerResponse.ok) {
    return NextResponse.json({ error: "No pudimos crear tu cuenta" }, { status: 400 });
  }

  const tokens = (await registerResponse.json()) as { accessToken: string; refreshToken: string };
  return establishSession(tokens);
}
