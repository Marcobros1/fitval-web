import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { store } from "../../app/store";
import { RegisterPage } from "./RegisterPage";

describe("RegisterPage", () => {
  it("con una contraseña corta, avisa sin enviar", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage />
        </MemoryRouter>
      </Provider>,
    );

    await user.type(screen.getByLabelText("Correo"), "nueva@correo.es");
    await user.type(screen.getByLabelText("Contraseña"), "123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    expect(
      await screen.findByText("La contraseña debe tener al menos 8 caracteres"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Cuenta creada/)).not.toBeInTheDocument();
  });
});
