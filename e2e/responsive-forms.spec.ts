import { test, expect } from "@playwright/test";

// Los tests arrancan ya autenticados vía el storageState global (ver
// playwright.config.ts / e2e/global-setup.ts).

test.describe("Formularios responsive", () => {
  test("móvil (375px): la barra de acciones no se superpone con el bottom nav", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/movements");

    const groupBtnBox = await page.locator('[data-slot="form-actions"]').boundingBox();
    const bottomNavBox = await page
      .getByRole("navigation", { name: "Navegación principal" })
      .boundingBox();

    expect(groupBtnBox).not.toBeNull();
    expect(bottomNavBox).not.toBeNull();
    expect(groupBtnBox!.y + groupBtnBox!.height).toBeLessThanOrEqual(bottomNavBox!.y);
  });

  test("móvil (375px): los inputs son fluidos, no de 200px fijos", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/movements");

    // exact: true — la tabla de movimientos (con filas ya sembradas) tiene
    // celdas editables aria-label="Editar monto", que sin exact matchean
    // por substring contra "Monto".
    const amountBox = await page.getByLabel("Monto", { exact: true }).boundingBox();
    expect(amountBox).not.toBeNull();
    expect(amountBox!.width).toBeGreaterThan(250);
  });

  test("móvil (375px): completa y envía el formulario de movimientos de punta a punta", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/movements");

    await page.getByLabel("Fecha", { exact: true }).fill("2026-02-10");
    await page.getByLabel("Cuenta", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Tipo", { exact: true }).selectOption("Ingreso");
    await page.getByLabel("Estado", { exact: true }).selectOption("Confirmado");
    await page.getByLabel("Categoría", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Monto", { exact: true }).fill("300");
    await page.getByLabel("Descripción", { exact: true }).fill("Prueba responsive móvil");

    await page.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Movimiento guardado.")).toBeVisible();

    await page.screenshot({
      path: "test-results/movements-form-mobile-375.png",
      fullPage: true,
    });
  });

  test("móvil (375px): el formulario de presupuesto también es fluido", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/budget");

    const amountBox = await page.getByLabel("Monto", { exact: true }).boundingBox();
    expect(amountBox).not.toBeNull();
    expect(amountBox!.width).toBeGreaterThan(250);

    const groupBtnBox = await page.locator('[data-slot="form-actions"]').boundingBox();
    const bottomNavBox = await page
      .getByRole("navigation", { name: "Navegación principal" })
      .boundingBox();
    expect(groupBtnBox!.y + groupBtnBox!.height).toBeLessThanOrEqual(bottomNavBox!.y);
  });
});
