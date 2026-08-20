import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tablet, { type TableColumn } from "./tablet";

interface Row {
  date: string;
  amount: number;
}

const columns: TableColumn<Row>[] = [
  { key: "date", header: "Fecha", accessor: "date" },
  { key: "amount", header: "Monto", render: (row) => `$${row.amount}` },
];

describe("Tablet", () => {
  it("muestra el estado vacío con ícono cuando no hay filas", () => {
    render(<Tablet tableTitle="Movimientos" columns={columns} rows={[]} />);
    expect(screen.getAllByText("No hay registros para mostrar").length).toBeGreaterThan(0);
  });

  it("renderiza una fila por cada registro, usando accessor y render", () => {
    render(
      <Tablet
        tableTitle="Movimientos"
        columns={columns}
        rows={[
          { date: "2026-01-01", amount: 100 },
          { date: "2026-01-02", amount: 200 },
        ]}
      />,
    );
    expect(screen.getAllByText("2026-01-01").length).toBeGreaterThan(0);
    expect(screen.getAllByText("$100").length).toBeGreaterThan(0);
    expect(screen.queryByText("No hay registros para mostrar")).not.toBeInTheDocument();
  });

  it("usa colSpan igual a la cantidad de columnas en el estado vacío", () => {
    render(<Tablet tableTitle="Movimientos" columns={columns} rows={[]} />);
    const emptyCell = document.querySelector("td[colspan]");
    expect(emptyCell).toHaveAttribute("colspan", String(columns.length));
  });

  it("no muestra el toggle 'Ver más' cuando no se pasa initialRowsToShow", () => {
    render(
      <Tablet
        tableTitle="Movimientos"
        columns={columns}
        rows={[
          { date: "2026-01-01", amount: 100 },
          { date: "2026-01-02", amount: 200 },
        ]}
      />,
    );
    expect(screen.queryByRole("button", { name: /Ver más/ })).not.toBeInTheDocument();
  });

  it("trunca las filas y permite expandir/contraer con initialRowsToShow", async () => {
    render(
      <Tablet
        tableTitle="Movimientos"
        columns={columns}
        rows={[
          { date: "2026-01-01", amount: 100 },
          { date: "2026-01-02", amount: 200 },
          { date: "2026-01-03", amount: 300 },
        ]}
        initialRowsToShow={2}
      />,
    );
    expect(screen.getAllByText("2026-01-01").length).toBeGreaterThan(0);
    expect(screen.queryByText("2026-01-03")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Ver más" }));
    expect(screen.getAllByText("2026-01-03").length).toBeGreaterThan(0);

    await userEvent.click(screen.getByRole("button", { name: "Ver menos" }));
    expect(screen.queryByText("2026-01-03")).not.toBeInTheDocument();
  });
});
