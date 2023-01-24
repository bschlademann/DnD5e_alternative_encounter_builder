import {
  powerlevelByCr,
  powerlevelByPlayerLevel,
  allBestiaryFileNames,
} from "./data.js";
import * as fs from "fs/promises";
import * as z from "zod";
import { getBestiaryFileNamesFromRepoUrl } from "./domain";



export type BestiaryFileNames = string[];

const fetchBestiaryData = (bestiaryFileNames: BestiaryFileNames) => {
  bestiaryFileNames.map((bestiaryFileName) => {
    fetch(
      `https://raw.githubusercontent.com/5etools-mirror-1/5etools-mirror-1.github.io/master/data/bestiary/${bestiaryFileName}`
    )
      .then((res) => res.json())
      .then((bestiaryJson) => bestiaryJson);
  });
};


type Party = { playerCharacters: string[]; level: number };
type Mob = { creatureName: string; mobSize: number };
type LeveledNPC = { name: string; level: number };
type BestiaryJson = { monster: { name: string; cr: string }[] };
type CreatureStatBlock = { name: string; cr: string };

const party: Party = {
  playerCharacters: ["Player_1", "Player_2", "Player_3"],
  level: 3,
};

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

const allLeveledNPCs: LeveledNPC[] = [
  // { name: "NPC_1", level: 3 },
];

const getPartyPowerlevel = (party: Party): number => {
  const partySize = party.playerCharacters.length;
  const powerLevelPerCharacter = powerlevelByPlayerLevel[party.level];
  const partyPowerlevel = partySize * powerLevelPerCharacter;
  return partyPowerlevel;
};

const bestiaryJsonSchema: z.ZodSchema<BestiaryJson> = z.object({
  monster: z.array(
    z.object({
      cr: z.string(),
      name: z.string(),
    })
  ),
});

const isBestiaryJson = (u: unknown): u is BestiaryJson =>
  bestiaryJsonSchema.safeParse(u).success;

const parseBestiaryJson = (u: unknown): BestiaryJson =>
  bestiaryJsonSchema.parse(u);

const getJson = (filePath: string): Promise<BestiaryJson> => {
  return fs.readFile(filePath, { encoding: "utf-8" }).then((jsonString) => {
    return JSON.parse(jsonString);
    // return parseBestiaryJson(JSON.parse(jsonString));
  });
};

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
  const stringToNumber = z.string().regex(/^\d+$/).transform(Number);
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

const difficulty = async (): Promise<Difficulty> => {
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

const parseToTwoDecimals = (n: number) =>  parseFloat(n.toFixed(2))

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
        difficulty: `${description} (${parseToTwoDecimals(difficultyValue * 100)}%)`,
      };
};

const main = () => {
  difficulty()
  .then(formatDifficultyOutput)
  .then(console.table)
};
 
main();