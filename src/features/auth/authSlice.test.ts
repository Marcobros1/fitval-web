import { describe, expect, it } from "vitest";
import authReducer, { loggedIn, loggedOut } from "./authSlice";

describe("authSlice", () => {
  it("al entrar, guarda el token", () => {
    // estado de partida (nadie dentro) + la acción loggedIn
    const state = authReducer({ token: null }, loggedIn("abc"));

    expect(state.token).toBe("abc");
  });

  it("al salir, borra el token", () => {
    // parte de un estado con sesión y aplica loggedOut()
    const state = authReducer({ token: "abc" }, loggedOut());

    expect(state.token).toBeNull(); // toBeNull() comprueba que es null
  });
});
