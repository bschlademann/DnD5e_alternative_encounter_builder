import * as z from "zod";

export const getJsonFromUrl = (repoUrl: string) => {
  return fetch(repoUrl).then((res) => res.json());
};

export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr));

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