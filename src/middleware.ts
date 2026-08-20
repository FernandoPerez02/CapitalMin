import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, decodeSession, encodeSession, type Session } from "@/lib/session";

const PROTECTED_PATHS = [
  "/home",
  "/budget",
  "/movements",
  "/balance",
  "/history",
  "/wallets",
  "/obligations",
  "/cards",
  "/debts",
];
const API_URL = process.env.API_URL ?? "http://localhost:3001";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;
const REFRESH_BUFFER_MS = 30_000;

function decodeJwtExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(atob(payload)) as { exp?: number };
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

async function refreshSession(session: Session): Promise<Session | null> {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    if (!response.ok) return null;
    const tokens = (await response.json()) as { accessToken: string; refreshToken: string };
    return { ...session, ...tokens };
  } catch {
    return null;
  }
}

function withSessionCookie(response: NextResponse, session: Session): NextResponse {
  response.cookies.set(SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  if (isProtected && !session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  if (session && isProtected) {
    const expiresAt = decodeJwtExpiry(session.accessToken);
    if (expiresAt !== null && expiresAt - Date.now() < REFRESH_BUFFER_MS) {
      const refreshed = await refreshSession(session);
      if (!refreshed) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete(SESSION_COOKIE);
        return response;
      }
      return withSessionCookie(NextResponse.next(), refreshed);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
