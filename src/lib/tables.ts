export type Floor = "planta-baja" | "planta-alta";

export type Zone =
  | "Pista"
  | "Lateral izquierdo"
  | "Lateral derecho"
  | "Centro detrás de barra";

export type TablePosition = { x: number; y: number };

export type ClubTable = {
  id: string;
  floor: Floor;
  zone: Zone;
  position: TablePosition;
  capacity: "Por confirmar";
  minimumSpend: "Por confirmar";
};

export type Availability = Record<string, "available" | "occupied">;

const TABLE_SIZE = 56;
const leftY = Array.from({ length: 13 }, (_, index) => 140 + index * 92);
const rightUpperSlots = Array.from({ length: 14 }, (_, index) =>
  Math.round(140 + index * (1104 / 13)),
);

function createSeries(
  count: number,
  prefix: string,
  floor: Floor,
  zone: Zone,
  positions: TablePosition[],
): ClubTable[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${String(index + 1).padStart(2, "0")}`,
    floor,
    zone,
    position: positions[index],
    capacity: "Por confirmar",
    minimumSpend: "Por confirmar",
  }));
}

const trackPositions = Array.from({ length: 7 }, (_, row) =>
  Array.from({ length: 5 }, (_, column) => ({
    x: 300 + column * 120,
    y: 180 + row * 140,
  })),
).flat();

const centerUpperPositions = Array.from({ length: 9 }, (_, index) => ({
  x: 228 + index * 78,
  y: 1244,
}));

const rightUpperY = [
  ...rightUpperSlots.slice(0, 7),
  ...rightUpperSlots.slice(8),
];

export const TABLE_CATALOG: ClubTable[] = [
  ...createSeries(35, "P", "planta-baja", "Pista", trackPositions),
  ...createSeries(
    13,
    "PB-I",
    "planta-baja",
    "Lateral izquierdo",
    leftY.map((y) => ({ x: 102, y })),
  ),
  ...createSeries(
    13,
    "PA-I",
    "planta-alta",
    "Lateral izquierdo",
    leftY.map((y) => ({ x: 26, y })),
  ),
  ...createSeries(
    13,
    "PB-D",
    "planta-baja",
    "Lateral derecho",
    leftY.map((y) => ({ x: 922, y })),
  ),
  ...createSeries(
    13,
    "PA-D",
    "planta-alta",
    "Lateral derecho",
    rightUpperY.map((y) => ({ x: 998, y })),
  ),
  ...createSeries(
    9,
    "PA-C",
    "planta-alta",
    "Centro detrás de barra",
    centerUpperPositions,
  ),
];

export const CANVAS = { width: 1080, height: 1360, tableSize: TABLE_SIZE };
export const CLOSED_SPACE = {
  x: 992,
  y: rightUpperSlots[7] - 7,
  width: 68,
  height: 70,
};

function hash(value: string) {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return Math.abs(result);
}

export function availabilityForDate(date: string): Availability {
  return Object.fromEntries(
    TABLE_CATALOG.map((table) => [
      table.id,
      hash(`${date}:${table.id}`) % 6 === 0 ? "occupied" : "available",
    ]),
  );
}

export function floorLabel(floor: Floor) {
  return floor === "planta-baja" ? "Planta baja" : "Planta alta";
}

export function validateCatalog() {
  const ids = new Set(TABLE_CATALOG.map((table) => table.id));
  const count = (prefix: string) =>
    TABLE_CATALOG.filter((table) => table.id.startsWith(prefix)).length;
  return {
    total: TABLE_CATALOG.length,
    unique: ids.size,
    track: count("P-"),
    leftGround: count("PB-I-"),
    leftUpper: count("PA-I-"),
    rightGround: count("PB-D-"),
    rightUpper: count("PA-D-"),
    centerUpper: count("PA-C-"),
  };
}

