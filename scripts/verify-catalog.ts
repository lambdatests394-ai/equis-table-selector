import { validateCatalog } from "../src/lib/tables.ts";

const result = validateCatalog();
const expected = {
  total: 96,
  unique: 96,
  track: 35,
  leftGround: 13,
  leftUpper: 13,
  rightGround: 13,
  rightUpper: 13,
  centerUpper: 9,
};

for (const [key, value] of Object.entries(expected)) {
  const actual = result[key as keyof typeof result];
  if (actual !== value) throw new Error(`${key}: esperado ${value}, recibido ${actual}`);
}

console.log("Catálogo verificado:", result);
