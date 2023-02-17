import * as z from "zod";

export const getJsonFromUrl = (repoUrl: string) => {
  return fetch(repoUrl).then((res) => res.json());
};

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

export const addIds = <T>(arr: T[]): T[] => {
  const newArr = arr.slice();
  for (let i = 0; i < arr.length; i++) {
    newArr[i] = { ...newArr[i], id: i };
  }
  return newArr;
};

export const stringToNumber = z.string().pipe(z.coerce.number());

export const fractionalString = z
  .string()
  .transform((s) => s.split("/"))
  .pipe(
    z.union([
      z.tuple([stringToNumber, stringToNumber]).transform(([a, b]) => a / b),
      z.tuple([stringToNumber]).transform(([a]) => a),
    ])
  );

export const getRange = (range: [number, number]) => {
  let arr = [];
  for (let i = Math.min(...range); i <= Math.max(...range); i++) {
    arr.push(i);
  }
  return arr;
};

export const clampInt = (n: number) =>
  n <= Number.MAX_SAFE_INTEGER ? n : Number.MAX_SAFE_INTEGER;
