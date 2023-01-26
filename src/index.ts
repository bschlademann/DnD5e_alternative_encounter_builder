import {
  powerlevelByCr,
  powerlevelByPlayerLevel,
  allBestiaryFileNames,
} from "./data.js";
import * as z from "zod";
import { getBestiaryFileNamesFromRepoUrl } from "./5etools-repository";

// lib: general code, has nothing to do with your app (string manipulation, object transformations, array stuff)
// infrastructure: concrete database connection, request stuff from apis, code for reading 5e tools data, etc
// entry points: index.ts(x) / cli.ts, this is "first" file that runs (e.g. via vite, via node, etc)
// "domain" -> starts as one file, then lots of sub-folders

// const party2: Party2 = {
//   PLAYER_CHARACTERS_FINAL: "Player_1, Player_2, Player_3",
//   level: 3,
// };

// api.ts OR api/5e-tools.ts
// const get5eDataFromApi = async () => {
//  const data: Party2 = await getStuffFrom5e();
//  const myDomainData = parse5eData(data);
// }

// main.ts / index.ts / cli.ts
// const main = async () => {
//   const domainData = await get5eDataFromApi();
//   const coolStuff = calculateWithDomainData(domainData);
// }

// the evil outside world
// ----------- infrastructure -------------
// ^ the boundary of your app
// [ domain ]

// Party.ts / domain.ts / domain/Party.ts
// type Party

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

type BestiaryJson = { monster: {}[] };
const bestiaryJsonSchema: z.ZodSchema<BestiaryJson> = z.object({
  monster: z.array(z.object({})),
});
const isBestiaryJson = (u: unknown): u is BestiaryJson =>
  bestiaryJsonSchema.safeParse(u).success;

type CreatureJson = { name: string; cr: string };
const creatureJsonSchema: z.ZodSchema<CreatureJson> = z.object({
  cr: z.string(),
  name: z.string(),
});
const isCreatureJson = (u: unknown): u is CreatureJson =>
  creatureJsonSchema.safeParse(u).success;

type BestiaryFileNames = string[];
type BestiaryData = { monster: { name: string; cr: string }[] }[];
const fetchBestiaryData = (
  bestiaryFileNames: BestiaryFileNames
)=> {
  return bestiaryFileNames.map((bestiaryFileName) =>
    fetch(
      `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
    ).then((res) => res.json())
  );
};

const filterBestiaryJsons = (bestiaryData: BestiaryData) =>
  bestiaryData.filter(isBestiaryJson);

const filterCreatureJsons = (bestiaryJsons: BestiaryJson[]) => {
  return bestiaryJsons
    .map((bestiaryJson) => bestiaryJson.monster.filter(isCreatureJson))
    .flat();
};

type ParsedCreatureData = { name: string; cr: string }[];
const parseCreatureJsons = (
  creatureJsons: CreatureJson[]
): ParsedCreatureData => {
  return creatureJsons.map((creatureJson) => {
    const { name, cr } = creatureJson;
    return { name, cr };
  });
};

// const parseBestiaryJson = (u: unknown): BestiaryJson =>
//   bestiaryJsonSchema.parse(u);

// const getJson = (filePath: string): Promise<unknown> => {
//   return fs.readFile(filePath, { encoding: "utf-8" }).then((jsonString) => {
//     return JSON.parse(jsonString);
//     // return parseBestiaryJson(JSON.parse(jsonString));
//   });
// };

type CreatureStatBlock = { name: string; cr: string };
const getCreatureStatBlock = (
  creatureName: string,
  bestiaryJson: BestiaryJson
): false | { name: string; cr: string } => {
  const creatureStatBlock = bestiaryJson.monster.find(
    (statBlock: CreatureStatBlock) =>
      statBlock.name.toLowerCase() === creatureName.toLowerCase()
  );
  if (creatureStatBlock === undefined) {
    return false;
  } else return creatureStatBlock;
};

const parseCr = (crString: string): number => {
  const split = crString.split("/");
  const stringToNumber = z.string().regex(/^\d$/).transform(Number);
  const fraction = z.union([
    z.tuple([stringToNumber, stringToNumber]).transform(([a, b]) => a / b),
    z.tuple([stringToNumber]).transform(([a]) => a),
  ]);

  return fraction.parse(split);
};

async function* readFiles(
  creatureName: string
): AsyncGenerator<BestiaryJson, void, unknown> {
  for (const bestiaryFileName of allBestiaryFileNames) {
    const filePath = `./bestiary/${bestiaryFileName}`;
    yield await getJson(filePath);
  }
}

const getCreatureCr = async (creatureName: string): Promise<number> => {
  for await (const bestiaryJson of readFiles(creatureName)) {
    const creatureStatblock = getCreatureStatBlock(creatureName, bestiaryJson);
    if (creatureStatblock) {
      const parsedCr = parseCr(creatureStatblock.cr);
      return parsedCr;
    }
  }
  throw new Error(`"${creatureName}" not found in any book`);
};

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

// main();
