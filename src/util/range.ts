export function range(end: number): number[] {
  return Array.from(Array(end).keys());
}

// For "natural range" aka using "natural numbers"
// aka not including 0 (by my definition of natural numbers)
export function nrange(end: number): number[] {
  const range: number[] = [];
  for (let i = 1; i <= end; i++)
    range.push(i);
  return range;
}
