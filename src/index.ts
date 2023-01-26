import { powerlevelByCr, powerlevelByPlayerLevel } from "./data.js";
import * as z from "zod";
import { getBestiaryFileNamesFromRepoUrl } from "./5etools-repository";

type BestiaryFileNames = string[];
type BestiaryJson = { monster: {}[] };
type CreatureJson = { name: string; cr: string };
type ParsedCreatureData = { name: string; cr: string };

const bestiaryJsonSchema: z.ZodSchema<BestiaryJson> = z.object({
  monster: z.array(z.object({})),
});

const isBestiaryJson = (u: unknown): u is BestiaryJson =>
  bestiaryJsonSchema.safeParse(u).success;

const creatureJsonSchema: z.ZodSchema<CreatureJson> = z.object({
  cr: z.string(),
  name: z.string(),
});

const isCreatureJson = (u: unknown): u is CreatureJson =>
  creatureJsonSchema.safeParse(u).success;

const fetchBestiaryData = (bestiaryFileNames: BestiaryFileNames) => {
  return Promise.all(bestiaryFileNames.map((bestiaryFileName) =>
    fetch(
      `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
    )
      .then((res) => res.json())
      .then((promise: Promise<BestiaryJson>) => Promise.resolve(promise))
  ));
};

const filterBestiaryJsons = (jsons: BestiaryJson[]) => {
  return jsons.filter(isBestiaryJson);
};

const filterCreatureJsons = (bestiaryJsons: BestiaryJson[]) => {
  return bestiaryJsons
    .map((bestiaryJson) => bestiaryJson.monster.filter(isCreatureJson))
    .flat();
};

const parseCreatureJsons = (creatureJsons: CreatureJson[]) => {
  return creatureJsons.map((creatureJson) => {
    const { name, cr } = creatureJson;
    return { name, cr };
  });
};

const main = () => {
  // 1. fetch data, parse into domain types
  getBestiaryFileNamesFromRepoUrl()
    .then(fetchBestiaryData)
    .then(filterBestiaryJsons)
    .then(filterCreatureJsons)
    .then(parseCreatureJsons);
  // 2. put that stuff into a variable _here_, called state (later localStorage / useState)
  // 3. calculate stuff, using state as input
  // getDifficulty().then(formatDifficultyOutput).then(console.table);
};

main();

type Party = { playerCharacters: string[]; level: number };
const party: Party = {
  playerCharacters: ["Player_1", "Player_2", "Player_3"],
  level: 3,
};
const getPartyPowerlevel = (party: Party): number => {
  const partySize = party.playerCharacters.length;
  const powerLevelPerCharacter = powerlevelByPlayerLevel[party.level];
  const partyPowerlevel = partySize * powerLevelPerCharacter;
  return partyPowerlevel;
};

type Mob = { creatureName: string; mobSize: number };
const allMobs: Mob[] = [
  {
    creatureName: "harengon brigand",
    mobSize: 4,
  },
  {
    creatureName: "harengon sniper",
    mobSize: 2,
  },
];

type LeveledNPC = { name: string; level: number };
const allLeveledNPCs: LeveledNPC[] = [
  // { name: "NPC_1", level: 3 },
];

// const parseBestiaryJson = (u: unknown): BestiaryJson =>
//   bestiaryJsonSchema.parse(u);

// const getJson = (filePath: string): Promise<unknown> => {
//   return fs.readFile(filePath, { encoding: "utf-8" }).then((jsonString) => {
//     return JSON.parse(jsonString);
//     // return parseBestiaryJson(JSON.parse(jsonString));
//   });
// };

// const getCreatureStatBlock = (
//   creatureName: string,
//   bestiaryJson: BestiaryJson
// ): false | { name: string; cr: string } => {
//   const creatureStatBlock = bestiaryJson.monster.find(
//     (statBlock: CreatureStatBlock) =>
//       statBlock.name.toLowerCase() === creatureName.toLowerCase()
//   );
//   if (creatureStatBlock === undefined) {
//     return false;
//   } else return creatureStatBlock;
// };

const parseCr = (crString: string): number => {
  const split = crString.split("/");
  const stringToNumber = z.string().regex(/^\d$/).transform(Number);
  const fraction = z.union([
    z.tuple([stringToNumber, stringToNumber]).transform(([a, b]) => a / b),
    z.tuple([stringToNumber]).transform(([a]) => a),
  ]);

  return fraction.parse(split);
};

// async function* readFiles(
//   creatureName: string
// ): AsyncGenerator<BestiaryJson, void, unknown> {
//   for (const bestiaryFileName of allBestiaryFileNames) {
//     const filePath = `./bestiary/${bestiaryFileName}`;
//     yield await getJson(filePath);
//   }
// }

// const getCreatureCr = async (creatureName: string): Promise<number> => {
//   for await (const bestiaryJson of readFiles(creatureName)) {
//     const creatureStatblock = getCreatureStatBlock(creatureName, bestiaryJson);
//     if (creatureStatblock) {
//       const parsedCr = parseCr(creatureStatblock.cr);
//       return parsedCr;
//     }
//   }
//   throw new Error(`"${creatureName}" not found in any book`);
// };

const getCreature = (creatureName: string) => {
  // FIXME: .find(creatureObj => creatureObj.name === creatureName) creature in localstorage
};
const getCreatureCr = (parsedCreatureData: ParsedCreatureData) =>
  parseCr(parsedCreatureData.cr);

const getCreaturePowerlevel = async (creatureName: string): Promise<number> => {
  const creatureCr = await getCreatureCr(creatureName);
  const creaturePowerlevel: number = powerlevelByCr[creatureCr];
  return creaturePowerlevel;
};

const getAllMobsPowerlevel = async (allMobs: Mob[]): Promise<number> => {
  let powerlevelTotalOfAllMobs = 0;
  for (const mob of allMobs) {
    const { creatureName, mobSize } = mob;
    const creaturePowerlevel = await getCreaturePowerlevel(creatureName);
    const mobPowerlevel = mobSize * creaturePowerlevel;
    powerlevelTotalOfAllMobs += mobPowerlevel;
  }
  return powerlevelTotalOfAllMobs;
};

const getAllLeveledNPCsPowerlevel = (allLeveledNPCs: LeveledNPC[]): number => {
  return allLeveledNPCs.reduce((allLeveledNPCsPowerlevel, leveledNPC) => {
    const powerlevel = powerlevelByPlayerLevel[leveledNPC.level];
    return (allLeveledNPCsPowerlevel += powerlevel);
  }, 0);
};

type Difficulty = {
  partyPowerlevel: number;
  powerlevelTotalOfAllMobs: number;
  allLeveledNPCsPowerlevel: number;
  difficultyValue: number;
  description: string;
};
const getDifficulty = async (): Promise<Difficulty> => {
  const powerlevelTotalOfAllMobs = await getAllMobsPowerlevel(allMobs);
  const allLeveledNPCsPowerlevel = getAllLeveledNPCsPowerlevel(allLeveledNPCs);
  const partyPowerlevel: number = getPartyPowerlevel(party);
  const difficultyValue: number =
    (powerlevelTotalOfAllMobs + allLeveledNPCsPowerlevel) / partyPowerlevel;

  let description = "";
  if (difficultyValue <= 0.4) {
    description = "easy";
  } else if (difficultyValue <= 0.6) {
    description = "medium";
  } else if (difficultyValue <= 0.8) {
    description = "hard";
  } else if (difficultyValue <= 1) {
    description = "deadly";
  } else if (difficultyValue > 1) {
    description = "absurd";
  }

  return {
    partyPowerlevel,
    powerlevelTotalOfAllMobs,
    allLeveledNPCsPowerlevel,
    difficultyValue,
    description,
  };
};

const parseToTwoDecimals = (n: number) => parseFloat(n.toFixed(2));

const formatDifficultyOutput = (difficulty: Difficulty) => {
  const {
    partyPowerlevel,
    powerlevelTotalOfAllMobs,
    allLeveledNPCsPowerlevel,
    difficultyValue,
    description,
  } = difficulty;
  return {
    partyPowerlevel: parseToTwoDecimals(partyPowerlevel),
    powerlevelTotalOfAllMobs: parseToTwoDecimals(powerlevelTotalOfAllMobs),
    allLeveledNPCsPowerlevel: parseToTwoDecimals(allLeveledNPCsPowerlevel),
    difficulty: `${description} (${parseToTwoDecimals(
      difficultyValue * 100
    )}%)`,
  };
};
