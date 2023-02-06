import * as z from "zod";
import { getJsonFromUrl, getSetArray } from "./lib";

type Parser<Output, Input = unknown> = z.ZodSchema<Output, z.ZodTypeDef, Input>

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
export type BestiaryData = { monster: {}[] };
export type CreatureData = { name: string; cr: number };

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

export const bestiaryJsonSchema: Parser<BestiaryData> = z.object({
  monster: z.array(z.object({})),
});

export const isBestiaryData = (u: unknown): u is BestiaryData =>
  bestiaryJsonSchema.safeParse(u).success;


const stringToNumber = z.string().pipe(z.coerce.number());

export const fractionalString = z.string().transform(s => s.split("/")).pipe(
  z.union([
    z.tuple([stringToNumber, stringToNumber]).transform(([a, b]) => a / b),
    z.tuple([stringToNumber]).transform(([a]) => a),
  ])
);

export const creatureJsonSchema: Parser<CreatureData> = z.object({
  cr: fractionalString,
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

export const parseCreatureData = (creatureJsons: CreatureData[]): CreatureData[] => {
  return creatureJsons.map(({ name, cr }) => ({ name, cr }));
};

export const getSetArrayFromParsedCreatureData = (
  parsedCreatureData: CreatureData[]
): CreatureData[] => getSetArray(parsedCreatureData);

export const getCreatureData = () => {
  return getBestiaryFileNamesFromRepoUrl()
    .then(fetchBestiaryData)
    .then(filterBestiaryData)
    .then(filterCreatureData)
    .then(parseCreatureData)
    .then(getSetArrayFromParsedCreatureData);
};

type Commit = {
  commit: {
    committer: {
      date: string;
    };
  };
};
export const getLastCommitDate = (commits: Commit[]) =>
  Date.parse(commits[0].commit.committer.date);

export const getRepoLastUpdatedAt = () => {
  return fetch(
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits"
  )
    .then((res) => res.json())
    .then(getLastCommitDate);
};