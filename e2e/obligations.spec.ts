import { test, expect, type Locator } from "@playwright/test";

// Arranca ya autenticado vía el storageState global (ver
// playwright.config.ts / e2e/global-setup.ts).

/**
 * El campo "Fecha de vencimiento" es un <input> que empieza type="text" y
 * pasa a type="date" en el evento focus (truco sin librería de date-picker,
 * ver obligation-form.tsx). En este formulario específico (a diferencia de
 * movements/budget/transfer, donde la fecha es el PRIMER campo) rellenar
 * Nombre/Tipo/Monto antes provoca un re-render que React usa para reafirmar
 * el type="text" literal del JSX, pisando el cambio imperativo del onFocus
 * justo cuando Playwright intenta escribir — el valor se pierde en
 * automatización aunque un click real de usuario no tiene ese problema
 * (vuelve a disparar focus después de que el render ya se asentó). Se
 * evita la carrera fijando type + value directamente vía evaluate.
 */
async function fillDateField(field: Locator, value: string) {
  await field.evaluate((el: HTMLInputElement, v: string) => {
    el.type = "date";
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
    setter.call(el, v);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, value);
}

test.describe("Obligaciones", () => {
  test("crea una obligación puntual, la lista y la marca como pagada", async ({ page }) => {
    const uniqueName = `Obligación e2e ${Date.now()}`;

    await page.goto("/obligations");

    await page.getByLabel("Nombre", { exact: true }).fill(uniqueName);
    await page.getByLabel("Tipo", { exact: true }).selectOption("Egreso");
    await page.getByLabel("Monto", { exact: true }).fill("45000");
    await fillDateField(page.getByLabel("Fecha de vencimiento", { exact: true }), "2026-12-15");

    await page.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Obligación guardada.")).toBeVisible();

    const row = page.locator("tr", { hasText: uniqueName }).first();
    await expect(row).toBeVisible();
    await expect(row.locator('[data-slot="badge"]')).toHaveText(/Pendiente/);

    await row.getByRole("button", { name: "Pagar" }).click();
    await expect(row.locator('[data-slot="badge"]')).toHaveText(/Pagada/, {
      timeout: 15000,
    });
  });

  test("el toggle de recurrencia cambia el campo de fecha por día del mes", async ({ page }) => {
    await page.goto("/obligations");

    await expect(page.getByLabel("Fecha de vencimiento", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Día del mes", { exact: true })).toHaveCount(0);

    await page.getByLabel("Es recurrente (se repite cada mes)").check();

    await expect(page.getByLabel("Día del mes", { exact: true })).toBeVisible();
    await expect(page.getByLabel("Fecha de vencimiento", { exact: true })).toHaveCount(0);
  });
});
