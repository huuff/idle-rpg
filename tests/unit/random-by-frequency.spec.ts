import {
  randomByNormalizedFrequency,
  normalizeFrequencies
} from "@/util/random";


const firstOption = "first";
const secondOption = "second";
const rareOption = "rare";

const testFrquencies: [string, number][] = [
  [firstOption, 50],
  [secondOption, 49],
  [rareOption, 1],
];

describe("Random by frequency", () => {
  const normalizedFrequencies = normalizeFrequencies(testFrquencies);
  test("first option appears if random rolls from 0 to 0.50", () => {
    for (let i = 0; i <= 0.50; i += 0.01) {
      Math.random = jest.fn(() => i);
      expect(randomByNormalizedFrequency(normalizedFrequencies)).toBe(firstOption)
    }
  });
  
  test("second option appears if random rolls from 0.51 to 0.99", () => {
    for (let i = 0.51; i <= 0.99; i += 0.01) {
      Math.random = jest.fn(() => i);
      expect(randomByNormalizedFrequency(normalizedFrequencies)).toBe(secondOption)
    }
  });

  test("rare option appears on a roll > 0.99", () => {
    Math.random = jest.fn(() => 0.991);

    expect(randomByNormalizedFrequency(normalizedFrequencies)).toBe(rareOption);
  });
});
