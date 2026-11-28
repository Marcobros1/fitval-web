import { describe, expect, it } from "vitest";
import { getErrorMessage } from "./apiError";

describe("getErrorMessage", () => {
  it("une los mensajes de un array con punto", () => {
    expect(getErrorMessage({ data: { message: ["a", "b"] } })).toBe("a. b");
  });

  it("devuelve el mensaje cuando es un texto", () => {
    expect(getErrorMessage({ data: { message: "Clase con reservas" } })).toBe("Clase con reservas");
  });

  it("con cualquier otra cosa, avisa de que no conecta", () => {
    expect(getErrorMessage(new Error("x"))).toBe("No se ha podido conectar con la API.");
    expect(getErrorMessage(null)).toBe("No se ha podido conectar con la API.");
  });
});
