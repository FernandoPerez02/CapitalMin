import { describe, expect, it } from "vitest";
import { decodeSession, encodeSession } from "./session";

describe("session", () => {
  it("recupera la misma sesión que se codificó", () => {
    const session = {
      email: "demo@capitalmin.com",
      accountId: "acc-1",
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };
    const encoded = encodeSession(session);
    expect(decodeSession(encoded)).toEqual(session);
  });

  it("devuelve null cuando no hay cookie", () => {
    expect(decodeSession(undefined)).toBeNull();
    expect(decodeSession(null)).toBeNull();
  });

  it("devuelve null cuando la cookie no es un valor de sesión válido", () => {
    expect(decodeSession("no-es-base64-valido-!!")).toBeNull();
  });
});
