/** Currency: 2 decimals, half-up */
export function roundCurrency(value: number): number {
  const scaled = value * 100;
  const rounded =
    scaled >= 0
      ? Math.floor(scaled + 0.5)
      : Math.ceil(scaled - 0.5);
  return rounded / 100;
}
