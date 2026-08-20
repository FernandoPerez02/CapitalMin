import { test, expect } from "@playwright/test";

// Los tests arrancan ya autenticados vía el storageState global (ver
// playwright.config.ts / e2e/global-setup.ts).

test.describe("Dashboard home", () => {
  test("desktop: muestra los KPIs y oculta las piezas solo-móvil", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/home");

    await expect(page.getByText("Saldo Disponible")).toBeVisible();
    await expect(page.getByText("Ingresos Mes")).toBeVisible();
    await expect(page.getByText("Egresos Mes")).toBeVisible();
    await expect(page.getByText("Salud financiera")).toBeVisible();
    // .first() — "Metas" aparece dos veces: el título de la card y la
    // leyenda de MoneyDistributionBar (ambigüedad preexistente, no
    // relacionada con wallets).
    await expect(page.getByText("Metas").first()).toBeVisible();
    await expect(page.getByText("Próximos pagos")).toBeVisible();
    await expect(page.getByText("Patrimonio neto")).toBeVisible();

    await expect(page.locator('[data-slot="mobile-hero-kpi"]')).toBeHidden();
    await expect(page.locator('[data-slot="quick-actions-grid"]')).toBeHidden();
    await expect(page.locator('[data-slot="mobile-resource-links"]')).toBeHidden();
  });

  test("móvil: muestra el hero KPI y el grid de acciones rápidas", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto("/home");

    await expect(page.locator('[data-slot="mobile-hero-kpi"]')).toBeVisible();
    await expect(page.locator('[data-slot="quick-actions-grid"]')).toBeVisible();
    await expect(
      page
        .locator('[data-slot="quick-actions-grid"]')
        .getByRole("link", { name: /Nuevo movimiento/ }),
    ).toHaveAttribute("href", "/movements");
    await expect(page.locator('[data-slot="mobile-resource-links"]')).toBeVisible();
  });

  test("las metas de ejemplo se muestran con su porcentaje de avance", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/home");

    await expect(page.getByText("Viaje a Cartagena")).toBeVisible();
  });
});
