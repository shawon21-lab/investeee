export function isNumber(value: number) {
  return typeof value === "number" && Number.isFinite(value);
}
