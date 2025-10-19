export function formatNumber(n: number, digits = 1) {
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: digits });
  return Number(n.toFixed(digits)).toString();
}
