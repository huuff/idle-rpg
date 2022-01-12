export function chooseRandom<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function randomBetween(min: number, max: number): number {
  return min + (Math.random() * (max - min));
}
