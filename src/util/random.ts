export function chooseRandom<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function randomBetween(min: number, max: number): number {
  return min + (Math.random() * (max - min));
}

export function randomInt(max: number): number {
  return Math.ceil(Math.random() * max);
}

// Takes a random number and goes through an array of
// options to frequencies that is both normalized and sorted,
// adding up the frequencies in the process and returning the first
// element for which the accummulated frequency is larger or equal
// to the random number.
// Check the tests if you ever forget how this works
export function randomByNormalizedSortedFrequency<T>(optionsToFrequencies: [T, number][]): T {
  const target = Math.random();

  let accummulatedFrequency = 0;
  for (const [option, freq] of optionsToFrequencies) {
    accummulatedFrequency += freq;
    if (accummulatedFrequency >= target) {
      return option;
    }
  }

  throw new Error("Exited randomByFrequency without finding an option");
}

// TODO: Test it
// Makes an array of options to frequencies normalized
// And sorts it in decreasing order so it can be searched
// for a random match
export function normalizeAndSortFrequencies<T>(optionsToFrequency: [T, number][]): [T, number][] {
  const totalFrequency = optionsToFrequency.reduce((acc, [_, freq]) => acc + freq, 0);
  return optionsToFrequency
    .map(([option, freq]) => [option, freq/totalFrequency] as [T, number])
    .sort(([_1, a], [_2, b]) => a - b)
    ;
}
