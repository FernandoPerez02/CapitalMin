export const SESSION_COOKIE = "cm_session";

export interface Session {
  email: string;
  accountId: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * La cookie es solo el transporte (httpOnly la protege de JS/red); la
 * autenticación real la valida el backend al verificar accessToken/refreshToken.
 */
export function encodeSession(session: Session): string {
  return btoa(JSON.stringify(session));
}

export function decodeSession(value: string | undefined | null): Session | null {
  if (!value) return null;
  try {
    return JSON.parse(atob(value)) as Session;
  } catch {
    return null;
  }
}
