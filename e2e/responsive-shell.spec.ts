import { test, expect } from "@playwright/test";

// Los tests arrancan ya autenticados vía el storageState global (ver
// playwright.config.ts / e2e/global-setup.ts).

test.describe("Shell responsive", () => {
  test("móvil (375x812): bottom nav visible, sidebar oculto", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/home");

    await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeVisible();
    await expect(page.locator('[data-slot="sidebar-nav"]')).toBeHidden();

    // Wallets/Obligaciones/Tarjetas/Deudas no están en el bottom-nav de 5
    // ítems (ver nav-items.ts) — en mobile se llega desde este grid en /home.
    const resourceLinks = page.locator('[data-slot="mobile-resource-links"]');
    await expect(resourceLinks).toBeVisible();
    await expect(resourceLinks.getByRole("link", { name: "Tarjetas" })).toBeVisible();
    await expect(resourceLinks.getByRole("link", { name: "Deudas" })).toBeVisible();

    await page.screenshot({ path: "test-results/shell-mobile-375.png", fullPage: true });
  });

  test("desktop (1280x800): sidebar visible, bottom nav oculto", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/home");

    const sidebar = page.locator('[data-slot="sidebar-nav"]');
    await expect(sidebar).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Navegación principal" })).toBeHidden();

    // Los recursos que no entran en el bottom-nav mobile sí viven en el
    // sidebar de escritorio, sin la restricción de espacio de 360px.
    await expect(sidebar.getByRole("link", { name: "Cuentas" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Obligaciones" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Tarjetas" })).toBeVisible();
    await expect(sidebar.getByRole("link", { name: "Deudas" })).toBeVisible();

    await page.screenshot({ path: "test-results/shell-desktop-1280.png", fullPage: true });
  });

  test("la navegación inferior permite moverse entre secciones en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/home");

    const bottomNav = page.getByRole("navigation", { name: "Navegación principal" });
    await bottomNav.getByRole("link", { name: "Movimientos" }).click();
    await expect(page).toHaveURL(/\/movements/);
    await expect(bottomNav.getByRole("link", { name: "Movimientos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
