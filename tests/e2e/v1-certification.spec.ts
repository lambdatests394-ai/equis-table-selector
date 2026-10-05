import { expect, test } from "@playwright/test";

const BASE_URL = process.env.EQUIS_BASE_URL ?? "https://equis-table-selector.lambdatests394.workers.dev";

function monterreyDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Monterrey",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function nextFridayFrom(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const cursor = new Date(Date.UTC(year, month - 1, day));
  const daysUntilFriday = (5 - cursor.getUTCDay() + 7) % 7;
  cursor.setUTCDate(cursor.getUTCDate() + daysUntilFriday);
  return cursor.toISOString().slice(0, 10);
}

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await expect(page.getByText("Elige dónde vivir la noche")).toBeVisible();
  await expect(page.getByText(/de 96 disponibles/)).toBeVisible();
});

test("QA-V1-001 carga inicial y fecha dinámica", async ({ page }) => {
  const today = monterreyDateKey();
  const expectedFriday = nextFridayFrom(today);
  const dateInput = page.getByLabel("Fecha");
  await expect(dateInput).toHaveAttribute("min", today);
  await expect(dateInput).toHaveValue(expectedFriday);
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeDisabled();
});

test("QA-V1-002 hora y personas se reflejan en el resumen superior", async ({ page }) => {
  await page.getByLabel("Hora").selectOption("01:30");
  await page.getByLabel("Personas").selectOption("7");
  await expect(page.getByText("01:30", { exact: true }).last()).toBeVisible();
  await expect(page.getByText("7", { exact: true }).last()).toBeVisible();
});

test("QA-V1-003 lista contiene 96 mesas y filtros 61/35", async ({ page }) => {
  await page.getByRole("button", { name: "Lista" }).click();
  const rows = page.locator("button").filter({
    has: page.locator("strong", { hasText: /^Mesa / }),
  });
  await expect(rows).toHaveCount(96);

  await page.getByRole("button", { name: "Planta baja", exact: true }).click();
  await expect(rows).toHaveCount(61);

  await page.getByRole("button", { name: "Planta alta", exact: true }).click();
  await expect(rows).toHaveCount(35);
});

test("QA-V1-004 mesa ocupada está deshabilitada y una disponible se puede seleccionar", async ({ page }) => {
  await page.getByRole("button", { name: "Lista" }).click();
  const occupied = page.locator("button:disabled").filter({ hasText: "Ocupada" }).first();
  await expect(occupied).toBeVisible();

  const available = page.locator("button:not(:disabled)").filter({ hasText: "Disponible" }).first();
  await available.click();
  await expect(page.getByText(/Mesa seleccionada/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeEnabled();
});

test("QA-V1-005 flujo feliz selección → revisión → envío → volver", async ({ page }) => {
  await page.getByRole("button", { name: "Lista" }).click();
  const available = page.locator("button:not(:disabled)").filter({ hasText: "Disponible" }).first();
  const rowText = (await available.textContent()) ?? "";
  const match = rowText.match(/Mesa\s+([A-Z]+-?\d+)/);
  expect(match).not.toBeNull();
  const tableId = match![1];

  await available.click();
  await page.getByRole("button", { name: /Continuar/ }).click();

  await expect(page.getByRole("heading", { name: "Revisa tu selección" })).toBeVisible();
  await expect(page.getByText(tableId, { exact: true })).toBeVisible();
  await expect(page.getByText("Simulada", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: /Enviar solicitud de prueba/ }).click();
  await expect(page.getByRole("heading", { name: "Solicitud de prueba completada" })).toBeVisible();
  await expect(page.getByText(new RegExp(`Mesa ${tableId} conservada`))).toBeVisible();

  await page.getByRole("button", { name: /Volver al resumen/ }).click();
  await expect(page.getByRole("heading", { name: "Revisa tu selección" })).toBeVisible();
});

test("QA-V1-006 volver desde revisión conserva mesa y permite cambiarla", async ({ page }) => {
  await page.getByRole("button", { name: "Lista" }).click();
  const available = page.locator("button:not(:disabled)").filter({ hasText: "Disponible" }).first();
  await available.click();
  await page.getByRole("button", { name: /Continuar/ }).click();
  await page.getByRole("button", { name: /Volver y cambiar mesa/ }).click();
  await expect(page.getByText(/Mesa seleccionada/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Cambiar" })).toBeVisible();
});

test("QA-V1-007 estado error muestra mensaje y reintento", async ({ page }) => {
  await page.getByLabel("Estado de prueba").selectOption("error");
  await expect(page.getByText("No pudimos cargar la disponibilidad")).toBeVisible();
  await expect(page.getByRole("button", { name: /Reintentar/ })).toBeVisible();
});

test("QA-V1-008 estado sin disponibilidad bloquea selección", async ({ page }) => {
  await page.getByLabel("Estado de prueba").selectOption("empty");
  await expect(page.getByText("No hay mesas disponibles para esta fecha")).toBeVisible();
  await expect(page.getByText("0 de 96 disponibles")).toBeVisible();
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeDisabled();
});

test("QA-V1-009 selección perdida limpia selección y bloquea continuar", async ({ page }) => {
  await page.getByRole("button", { name: "Lista" }).click();
  const available = page.locator("button:not(:disabled)").filter({ hasText: "Disponible" }).first();
  await available.click();
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeEnabled();

  await page.getByLabel("Estado de prueba").selectOption("selection-lost");
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeDisabled();
  await expect(page.getByText(/dejó de estar disponible/)).toHaveCount(1);
});

test("QA-V1-010 vista móvil mantiene controles críticos accesibles", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByLabel("Fecha")).toBeVisible();
  await expect(page.getByRole("button", { name: "Plano" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Lista" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Continuar/ })).toBeVisible();
});
