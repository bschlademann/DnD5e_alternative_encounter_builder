import { fractionalString } from "./lib";
import * as t from "@jest/globals";

t.describe("fractionalString", () => {
  t.test("when passing a fractional number", () => {
    t.expect(fractionalString.parse("1/2")).toEqual(0.5);
    t.expect(fractionalString.parse("3/4")).toEqual(0.75);
  });
  t.test("when passing simple number", () => {
    t.expect(fractionalString.parse("1")).toEqual(1);
    t.expect(fractionalString.parse("9")).toEqual(9);
  });
  t.test("when passing invalid data", () => {
    t.expect(() => fractionalString.parse("foo")).toThrow();
    t.expect(() => fractionalString.parse(new Date())).toThrow();
    t.expect(() => fractionalString.parse(5)).toThrow();
    t.expect(() => fractionalString.parse("Unknown")).toThrow();
    t.expect(() => fractionalString.parse({})).toThrow();
  });
});
