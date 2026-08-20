import "server-only";
import { cookies } from "next/headers";
import { SESSION_COOKIE, decodeSession, encodeSession, type Session } from "@/lib/session";

const API_URL = process.env.API_URL ?? "http://localhost:3001";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return decodeSession(store.get(SESSION_COOKIE)?.value);
}

async function rawBackendFetch(path: string, accessToken: string, init?: RequestInit) {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...init?.headers,
    },
    cache: "no-store",
  });
}

async function refreshTokens(refreshToken: string) {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) return null;
  return (await response.json()) as { accessToken: string; refreshToken: string };
}

/**
 * En Server Components el middleware ya refresca el access token antes de
 * renderizar (Next no permite escribir cookies durante el render), así que
 * ahí se llama sin `persistRefresh`. En Route Handlers / Server Actions sí
 * se puede escribir la cookie, por eso las rutas proxy de creación activan
 * `persistRefresh` como red de seguridad si el token expiró justo entre medio.
 */
export async function backendFetch(
  session: Session,
  path: string,
  init?: RequestInit,
  options: { persistRefresh?: boolean } = {},
): Promise<Response> {
  let response = await rawBackendFetch(path, session.accessToken, init);

  if (response.status === 401 && options.persistRefresh) {
    const refreshed = await refreshTokens(session.refreshToken);
    if (refreshed) {
      const store = await cookies();
      const updated: Session = { ...session, ...refreshed };
      store.set(SESSION_COOKIE, encodeSession(updated), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
      response = await rawBackendFetch(path, refreshed.accessToken, init);
    }
  }

  return response;
}
