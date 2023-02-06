import * as z from "zod";
import { getJsonFromUrl, getSetArray } from "./lib";

export type Json = {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
  }[];
};

export type BestiaryFileNames = string[];

export const findSubfolderUrl = (json: Json, subfolder: string) => {
  const subfolderObjArr = json.tree.filter((node) => node.path === subfolder);
  if (subfolderObjArr.length === 1) {
    return subfolderObjArr[0].url;
  } else {
    throw new Error(
      `json "${json}" constains multiple subfolders called "${subfolder}"`
    );
  }
};

export const getBestiaryFolderUrl = () => {
  const masterBranchUrl =
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/git/trees/master";
  return getJsonFromUrl(masterBranchUrl)
    .then((masterBranchObj) => findSubfolderUrl(masterBranchObj, "data"))
    .then(getJsonFromUrl)
    .then((dataFolderObj) => findSubfolderUrl(dataFolderObj, "bestiary"));
};

export const isBestiary = (filename: string) =>
  filename.includes("bestiary") && !filename.includes("fluff");

export const isOfficialContent = (filename: string) => !filename.includes("ua");

export const getBestiaryFileNames = (json: Json) => {
  return json.tree
    .filter((treeObj) => {
      const filename = treeObj.path;
      return isBestiary(filename) && isOfficialContent(filename);
    })
    .map((bestiaryObjectList) => bestiaryObjectList.path);
};

export const getBestiaryFileNamesFromRepoUrl =
  (): Promise<BestiaryFileNames> => {
    return getBestiaryFolderUrl()
      .then(getJsonFromUrl)
      .then(getBestiaryFileNames);
  };

export type BestiaryData = { monster: {}[] };
type CreatureData = { name: string; cr: string };
type ParsedCreatureData = { name: string; cr: number };

export const bestiaryJsonSchema: z.ZodSchema<BestiaryData> = z.object({
  monster: z.array(z.object({})),
});

export const isBestiaryData = (u: unknown): u is BestiaryData =>
  bestiaryJsonSchema.safeParse(u).success;

export const creatureJsonSchema: z.ZodSchema<CreatureData> = z.object({
  cr: z.string(),
  name: z.string(),
});

export const isCreatureData = (u: unknown): u is CreatureData =>
  creatureJsonSchema.safeParse(u).success;

export const fetchBestiaryData = (bestiaryFileNames: BestiaryFileNames) => {
  return Promise.all(
    bestiaryFileNames.map((bestiaryFileName) =>
      fetch(
        `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
      )
        .then((res) => res.json())
        .then((promise: Promise<BestiaryData>) => Promise.resolve(promise))
    )
  );
};

export const filterBestiaryData = (jsons: BestiaryData[]) => {
  return jsons.filter(isBestiaryData);
};

export const filterCreatureData = (bestiaryJsons: BestiaryData[]) => {
  return bestiaryJsons.flatMap((bestiaryJson) =>
    bestiaryJson.monster.filter(isCreatureData)
  );
};

export const parseCr = (crString: string): number => {
  const split = crString.split("/");
  const stringToNumber = z.string().regex(/^\d$/).transform(Number);
  const fraction = z.union([
    z.tuple([stringToNumber, stringToNumber]).transform(([a, b]) => a / b),
    z.tuple([stringToNumber]).transform(([a]) => a),
  ]);

  return fraction.parse(split);
};

export const parseCreatureData = (creatureJsons: CreatureData[]) => {
  return creatureJsons.map(({ name, cr }) => ({ name, cr: parseCr(cr) }));
  // return creatureJsons.map((creatureJson) => {
  //   const { name, cr } = creatureJson;
  //   return { name, cr };
  // });
};

export const getSetArrayFromParsedCreatureData = (parsedCreatureData: ParsedCreatureData[]):ParsedCreatureData[] => getSetArray(parsedCreatureData);

export const getCreatureDataForLocalStorage = () => {
  return getBestiaryFileNamesFromRepoUrl()
    .then(fetchBestiaryData)
    .then(filterBestiaryData)
    .then(filterCreatureData)
    .then(parseCreatureData)
    .then(getSetArrayFromParsedCreatureData);
};