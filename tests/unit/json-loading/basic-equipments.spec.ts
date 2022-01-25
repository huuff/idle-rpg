import { isEmpty } from "lodash";
import { basicEquipments } from "@/items/basic-equipments";

describe("Basic equipments load", () => {
  test("it's not empty", () => {
    expect(isEmpty(Object.keys(basicEquipments))).toBeFalse();
  });
});
