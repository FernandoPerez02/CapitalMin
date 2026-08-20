import { test, expect } from "@playwright/test";

test.describe("Autenticación y movimientos", () => {
  // Este spec prueba el flujo de login real (no debe arrancar pre-autenticado
  // como el resto de los specs vía el storageState global).
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirige a /login cuando no hay sesión", async ({ page }) => {
    await page.goto("/movements");
    await expect(page).toHaveURL(/\/login/);
  });

  test("permite iniciar sesión y crear un movimiento válido", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Correo").fill("e2e@capitalmin.com");
    // exact: true — "Contraseña" sin exact matchea también el botón
    // "Mostrar contraseña" (Playwright hace substring match por defecto).
    await page.getByLabel("Contraseña", { exact: true }).fill("e2eTest1234");
    await page.getByRole("button", { name: "Ingresar" }).click();

    await expect(page).toHaveURL(/\/home/);

    await page.goto("/movements");
    await expect(page).toHaveURL(/\/movements/);

    // Envío vacío: deben aparecer errores de validación.
    await page.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("La fecha es obligatoria")).toBeVisible();

    // Completa el formulario con datos válidos. exact: true en todos los
    // campos — la tabla de movimientos al lado tiene celdas editables con
    // aria-label="Editar <campo>", que sin exact matchean por substring
    // (ver fix de "Contraseña" más arriba, mismo problema).
    await page.getByLabel("Fecha", { exact: true }).fill("2026-01-20");
    await page.getByLabel("Cuenta", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Tipo", { exact: true }).selectOption("Ingreso");
    await page.getByLabel("Estado", { exact: true }).selectOption("Confirmado");
    await page.getByLabel("Categoría", { exact: true }).selectOption({ index: 1 });
    await page.getByLabel("Monto", { exact: true }).fill("250");
    await page.getByLabel("Descripción", { exact: true }).fill("Pago de prueba e2e");

    await page.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Movimiento guardado.")).toBeVisible();
  });
});
