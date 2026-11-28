import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { PlanCard } from "./PlanCard";

describe("PlanCard", () => {
  it("muestra el nombre y el precio", () => {
    // Lleva un Link: necesita un router alrededor
    render(
      <MemoryRouter>
        <PlanCard plan={{ id: "1", name: "Básico", monthlyPrice: 29.9 }} />
      </MemoryRouter>,
    );

    expect(screen.getByText("Básico")).toBeInTheDocument();
    // Entre el número y el € va un espacio especial: se busca solo "29,90"
    expect(screen.getByText(/29,90/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver clases" })).toHaveAttribute("href", "/classes");
  });
});
