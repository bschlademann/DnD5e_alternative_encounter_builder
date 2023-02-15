import * as z from "zod";
import {
  getJsonFromUrl,
  unique,
  fractionalString as stringToFractionalNumber,
  addIds,
} from "./lib";

type Parser<Output, Input = unknown> = z.ZodSchema<Output, z.ZodTypeDef, Input>;

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

export type Creature = { name: string; cr: number, id: number };

export const creatureDataSchema: Parser<Creature> = z.object({
  cr: stringToFractionalNumber,
  name: z.string(),
  id: z.number()
});

type RawCreature = {
  name: string;
  cr?: "Unknown" | number | Record<string, unknown>;
};

export type RawData = {
  monster: RawCreature[];
};

const rawDataSchema: Parser<RawData> = z.object({
  monster: z.array(
    z.object({
      cr: stringToFractionalNumber
        .or(z.literal("Unknown"))
        .or(z.undefined())
        .or(z.record(z.unknown())),
      name: z.string(),
    })
  ),
});

const isCreature = (input: RawCreature): input is Creature =>
  typeof input.cr === "number";

const findSubfolderUrl = (json: Json, subfolder: string) => {
  const subfolderObjArr = json.tree.filter((node) => node.path === subfolder);
  if (subfolderObjArr.length === 1) {
    return subfolderObjArr[0].url;
  } else {
    throw new Error(
      `json "${json}" constains multiple subfolders called "${subfolder}"`
    );
  }
};

const getBestiaryFolderUrl = () => {
  const masterBranchUrl =
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/git/trees/master";
  return getJsonFromUrl(masterBranchUrl)
    .then((masterBranchObj) => findSubfolderUrl(masterBranchObj, "data"))
    .then(getJsonFromUrl)
    .then((dataFolderObj) => findSubfolderUrl(dataFolderObj, "bestiary"));
};

const isBestiary = (filename: string) =>
  filename.includes("bestiary") && !filename.includes("fluff");

const isOfficialContent = (filename: string) => !filename.includes("ua");

const getBestiaryFileNames = (json: Json) => {
  return json.tree
    .filter((treeObj) => {
      const filename = treeObj.path;
      return isBestiary(filename) && isOfficialContent(filename);
    })
    .map((bestiaryObjectList) => bestiaryObjectList.path);
};

const getBestiaryFileNamesFromRepoUrl = (): Promise<BestiaryFileNames> => {
  return getBestiaryFolderUrl().then(getJsonFromUrl).then(getBestiaryFileNames);
};

const fetchRawData = (bestiaryFileNames: BestiaryFileNames) => {
  return Promise.all(
    bestiaryFileNames.map((bestiaryFileName) =>
      fetch(
        `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
      )
        .then((res) => res.json())
        .then((promise: Promise<RawData>) => Promise.resolve(promise))
    )
  );
};

const parseRawData = (rawData: unknown[]): RawData[] =>
  rawDataSchema.array().parse(rawData);

const filterCreatures = (parsedDataArray: RawData[]): Creature[] =>
  parsedDataArray.flatMap((parsedData) => parsedData.monster.filter(isCreature));

export const getCreatureData = (): Promise<Creature[]> => {
  return getBestiaryFileNamesFromRepoUrl()
    .then(fetchRawData)
    .then(parseRawData)
    .then(filterCreatures)
    .then(unique)
    .then(addIds);
};

type Commit = {
  commit: {
    committer: {
      date: string;
    };
  };
};

const getLastCommitDate = (commits: Commit[]) =>
  Date.parse(commits[0].commit.committer.date);

export const getRepoLastUpdatedAt = () => {
  return fetch(
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits"
  )
    .then((res) => res.json())
    .then(getLastCommitDate);
};
