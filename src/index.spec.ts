import { filterStuff } from "./index";
import * as t from "@jest/globals";

t.describe("index.filterStuff", () => {
  t.test("given an empty array, returns an empty array", () => {
    const result = filterStuff([]);
    t.expect(result).toEqual([]);
  });
  t.test("given reasonable inputs, returns expected output", () => {
    const result = filterStuff([{ monster: [{ cr: "14", name: "kobold" }] }]);
    t.expect(result).toEqual([{ cr: "14", name: "kobold" }]);
  });
});

