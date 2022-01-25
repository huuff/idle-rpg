import { basicItems } from "@/items/basic-items";
import { isEmpty } from "lodash";

describe("Loading basic items", () => {
  test("the object is not empty", () => {
    expect(isEmpty(Object.keys(basicItems))).toBeFalse();
  });
})
