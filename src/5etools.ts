import * as z from "zod";
import { fractionalString as stringToFractionalNumber } from "./lib";

export type CreatureBase = { name: string; cr: number; id: string };

export const creatureDataSchema = z.object({
  cr: stringToFractionalNumber,
  name: z.string(),
  id: z.string(),
});

type RawCreature = {
  name: string;
  cr?: "Unknown" | number | Record<string, unknown>;
};

export type RawData = {
  monster: RawCreature[];
};

const rawDataSchema = z.object({
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

const isCreature = (input: RawCreature): input is CreatureBase =>
  typeof input.cr === "number";

const parseRawData = (rawData: unknown[]): RawData[] =>
  rawDataSchema.array().parse(rawData);

const filterCreatures = (parsedDataArray: RawData[]): CreatureBase[] =>
  parsedDataArray.flatMap((parsedData) =>
    parsedData.monster.filter(isCreature)
  );

const uniqueCreatures = (creatures: CreatureBase[]): CreatureBase[] => {
  return creatures.filter(
    (creature, index, self) =>
      index === self.findIndex((t) => t.name === creature.name)
  );
};

const addIdsAndPowerLevels = (creatures: CreatureBase[]) =>
  creatures.map((creature, index) => ({ ...creature, id: index.toString() }));

export type Creature = {
  name: string;
  cr: number;
  id: string;
};

const bestiaryPath = "/bestiaries";

const getLocalBestiaryFileNames = async (): Promise<string[]> => {
  return ["bestiary-mm.json", "bestiary-vgm.json", "bestiary-mtf.json"];
};

const fetchLocalRawData = async (fileNames: string[]): Promise<RawData[]> => {
  return Promise.all(
    fileNames.map(async (fileName) => {
      const res = await fetch(`${bestiaryPath}/${fileName}`);
      return (await res.json()) as RawData;
    })
  );
};

export const getCreatureData = (): Promise<Creature[]> => {
  return getLocalBestiaryFileNames()
    .then(fetchLocalRawData)
    .then(parseRawData)
    .then(filterCreatures)
    .then(uniqueCreatures)
    .then(addIdsAndPowerLevels);
};
