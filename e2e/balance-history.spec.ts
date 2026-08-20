import { test, expect } from "@playwright/test";

// Los tests arrancan ya autenticados vía el storageState global (ver
// playwright.config.ts / e2e/global-setup.ts).

test.describe("Balance", () => {
  test("muestra los KPIs y el tab de rango 'Mes' activo por defecto", async ({ page }) => {
    await page.goto("/balance");

    await expect(page.getByText("Balance total")).toBeVisible();
    await expect(page.getByText(/Ingresos \(Mes\)/)).toBeVisible();
    await expect(page.getByText(/Egresos \(Mes\)/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Mes" })).toHaveAttribute("aria-current", "page");
  });

  test("cambiar de rango actualiza los KPIs visibles", async ({ page }) => {
    await page.goto("/balance");

    await page.getByRole("link", { name: "Año" }).click();
    await expect(page).toHaveURL(/range=year/);
    await expect(page.getByRole("link", { name: "Año" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByText(/Ingresos \(Año\)/)).toBeVisible();
  });
});

test.describe("Historial", () => {
  test("muestra el formulario de filtros y la tabla de movimientos", async ({ page }) => {
    await page.goto("/history");

    await expect(page.getByLabel("Desde")).toBeVisible();
    await expect(page.getByLabel("Hasta")).toBeVisible();
    await expect(page.getByText("Historial de movimientos")).toBeVisible();
  });

  test("filtrar por tipo Ingreso solo muestra movimientos de ingreso", async ({ page }) => {
    await page.goto("/history");

    await page.getByLabel("Tipo").selectOption("Ingreso");
    await page.getByRole("button", { name: "Filtrar" }).click();

    await expect(page).toHaveURL(/typeMovement=Ingreso/);
    // No debería quedar ningún badge "Egreso" en la tabla filtrada (se
    // busca por data-slot="badge", no por texto plano, para no matchear
    // la propia <option value="Egreso"> del filtro).
    await expect(page.locator('[data-slot="badge"]', { hasText: "Egreso" })).toHaveCount(0);
  });

  test("un filtro sin resultados muestra el estado vacío", async ({ page }) => {
    await page.goto("/history?dateFrom=2099-01-01&dateTo=2099-01-02");

    // Tablet renderiza el estado vacío tanto en la vista de tabla como en
    // la de tarjetas (una queda oculta por CSS según el viewport) — se usa
    // .first() para no chocar con el modo estricto de Playwright.
    await expect(
      page.getByText("No hay movimientos para el filtro seleccionado.").first(),
    ).toBeVisible();
  });
});
