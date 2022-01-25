import { isEmpty } from "lodash";
import { basicSpecies } from "@/creatures/basic-species";

describe("Basic species load", () => {
  test("it's not empty", () => {
    expect(isEmpty(Object.keys(basicSpecies))).toBeFalse();
  });
});
