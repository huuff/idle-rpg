export function choose<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}
