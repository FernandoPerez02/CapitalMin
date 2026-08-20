import "server-only";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, encodeSession, type Session } from "@/lib/session";
import { SESSION_MAX_AGE } from "@/lib/backend-client";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Común a /api/auth/login y /api/auth/register: ambos backends devuelven
 * solo los tokens, así que hay que resolver /auth/me para conocer la cuenta
 * antes de poder abrir sesión.
 */
export async function establishSession(
  tokens: AuthTokens,
  remember: boolean = true,
): Promise<NextResponse> {
  const meResponse = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${tokens.accessToken}` },
  });

  if (!meResponse.ok) {
    return NextResponse.json({ error: "No se pudo cargar la sesión" }, { status: 502 });
  }

  const me = (await meResponse.json()) as { email: string; accounts: { id: string }[] };
  const account = me.accounts[0];
  if (!account) {
    return NextResponse.json(
      { error: "El usuario no pertenece a ninguna cuenta" },
      { status: 500 },
    );
  }

  const session: Session = { email: me.email, accountId: account.id, ...tokens };
  const response = NextResponse.json({ email: me.email });
  response.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    // Sin "recordarme" la cookie muere al cerrar el navegador (sin maxAge).
    ...(remember ? { maxAge: SESSION_MAX_AGE } : {}),
  });
  return response;
}
