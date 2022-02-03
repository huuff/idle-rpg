import findLastIndex from "lodash/findLastIndex";
import {accumulate} from "./accumulate";

export function chooseRandom<T>(options: readonly T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

export function variabilityRandom(base: number, variability: number) {
  return randomBetween(base - (base*variability), base + (base*variability));
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
export function randomByNormalizedFrequency<T>(optionsToFrequencies: readonly [T, number][]): T {
  const accumulatedFrequencies = accumulate(
    optionsToFrequencies, 
    opt => opt[1],
    (opt, freq) => [opt[0], freq] as [T, number],
  );

  const target = Math.random();
  const matchIndex = findLastIndex(accumulatedFrequencies, opt => target >= opt[1]);

  return accumulatedFrequencies[matchIndex+1][0];
}

// Makes an array of options to frequencies normalized
// And sorts it in decreasing order so it can be searched
// for a random match
export function normalizeFrequencies<T>(optionsToFrequency: readonly [T, number][]): [T, number][] {
  const totalFrequency = optionsToFrequency.reduce((acc, [_, freq]) => acc + freq, 0);
  return optionsToFrequency
    .map<[T, number]>(([option, freq]) => [option, freq/totalFrequency])
    .sort(([_1, a], [_2, b]) => b - a)
    ;
}
