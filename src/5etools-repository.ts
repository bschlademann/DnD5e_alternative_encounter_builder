// no stuff in localStorage
// 1. fetch all data
// 2. persist in localStorage: `{lastUpdatedAt: new Date(), data: ...}`
// https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits?since=... {Date}

// stuff in localStorage
// 1. /commits for this repository, get last commit
// 2. localStorage.lastUpdatedAt < lastCommit.createdAt
// 2a: if true, fetch and regenerate localStorage
// 2b: if false, just use localStorage
import * as z from "zod";
import { getJsonFromUrl } from "./lib";

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

type BestiaryJson = { monster: {}[] };
type CreatureJson = { name: string; cr: string };
type ParsedCreatureData = { name: string; cr: string };

export const bestiaryJsonSchema: z.ZodSchema<BestiaryJson> = z.object({
  monster: z.array(z.object({})),
});

export const isBestiaryJson = (u: unknown): u is BestiaryJson =>
  bestiaryJsonSchema.safeParse(u).success;

export const creatureJsonSchema: z.ZodSchema<CreatureJson> = z.object({
  cr: z.string(),
  name: z.string(),
});

export const isCreatureJson = (u: unknown): u is CreatureJson =>
  creatureJsonSchema.safeParse(u).success;

export const fetchBestiaryData = (bestiaryFileNames: BestiaryFileNames) => {
  return Promise.all(
    bestiaryFileNames.map((bestiaryFileName) =>
      fetch(
        `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
      )
        .then((res) => res.json())
        .then((promise: Promise<BestiaryJson>) => Promise.resolve(promise))
    )
  );
};

export const filterBestiaryJsons = (jsons: BestiaryJson[]) => {
  return jsons.filter(isBestiaryJson);
};

export const filterCreatureJsons = (bestiaryJsons: BestiaryJson[]) => {
  return bestiaryJsons
    .map((bestiaryJson) => bestiaryJson.monster.filter(isCreatureJson))
    .flat();
};

export const parseCreatureJsons = (creatureJsons: CreatureJson[]) => {
  return creatureJsons.map((creatureJson) => {
    const { name, cr } = creatureJson;
    return { name, cr };
  });
};
