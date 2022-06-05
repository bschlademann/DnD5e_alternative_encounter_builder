import {
  powerlevelByCr,
  powerlevelByPlayerLevel,
  allBestiaryFileNames,
} from "./data.js";
import * as fs from "fs/promises";
import { stringify } from "querystring";

type Party = {
  playerCharacters: string[];
  level: number;
};

type Mob = { creatureName: string; mobSize: number };

type AllMobs = Mob[];

type classLevelNPCs = {
  name: string;
  level: number;
}[];

type BestiaryFileName = typeof allBestiaryFileNames[number];

type BestiaryJson = { monster: { name: string; cr: string }[] };

type CreatureStatBlock = { name: string; cr: string };

// type creatureCr = keyof powerlevelByCr;
// type playerPowerlevel = (valueof?) powerlevelByPlayerLevel;

const party = {
  playerCharacters: ["Linea", "Nix", "Ninas_Char", "Fabians_Char", "Dörte"],
  level: 4,
};

const allMobs = [
  {
    creatureName: "kobold",
    mobSize: 8,
  },
  {
    creatureName: "kobold scale sorcerer",
    mobSize: 1,
  },
  {
    creatureName: "kobold inventor",
    mobSize: 1,
  },
];

const getPartyPowerlevel = (party: Party) => {
  const partySize: number = party.playerCharacters.length;
  const partyLevel: number = party.level;
  const powerLevelPerCharacter: number = powerlevelByPlayerLevel[partyLevel];
  const partyPowerlevel: number = partySize * powerLevelPerCharacter;
  return partyPowerlevel;
};

const getCreaturePowerlevel = async (creatureName: string) => {
  const creatureCr = await getCreatureCr(creatureName);
  const creaturePowerlevel: number = powerlevelByCr[creatureCr];
  return creaturePowerlevel;
};

const getAllMobsPowerlevel = async (allMobs: AllMobs) => {
  let powerlevelTotalOfAllMobs = 0;
  for (const mob of allMobs) {
    const { creatureName, mobSize } = mob;
    const creaturePowerlevel = await getCreaturePowerlevel(creatureName);
    const mobPowerlevel = mobSize * creaturePowerlevel;
    powerlevelTotalOfAllMobs += mobPowerlevel;
    // console.log(`
    // creatureName:${creatureName}
    // mobSize:${mobSize}
    // creaturePowerlevel:${creaturePowerlevel}
    // mobPowerlevel:${mobPowerlevel}
    // new total: ${powerlevelTotalOfAllMobs}
    // `);
  };  
  return powerlevelTotalOfAllMobs;
};

// does nothing yet!
const mixedGroup = (allMobs: AllMobs, ...classLevelNPCs: classLevelNPCs) => {
  // const allMobsPowerlevel = getAllMobsPowerlevel(allMobs);
  // const allClassLevelNPCs = [...classLevelNPCs];
  // iterate over allClassLevelNPCs and sum their powerlevels
  // add this sum to allMobsPowerlevel and return
};

const getJson = (filePath: string) => {
  return fs.readFile(filePath, { encoding: "utf-8" }).then((jsonString) => {
    return JSON.parse(jsonString);
  });
};

const getCreatureStatBlock = (
  creatureName: string,
  bestiaryJson: BestiaryJson
) => {
  const creatureStatBlock = bestiaryJson.monster.find(
    (statBlock: CreatureStatBlock) =>
      statBlock.name.toLocaleLowerCase() === creatureName.toLocaleLowerCase()
  );
  if (creatureStatBlock === undefined) {
    return false;
  } else return creatureStatBlock;
};

const parseCr = (crString: string) => {
  // crString is either a stringified whole number or fraction
  const isFraction = crString.includes("/");
  if (isFraction) {
    const split = crString.split("");
    const onlystringifiedNumbers = split.filter(
      (stringifiedNumber) => stringifiedNumber !== "/"
    );
    const parsedNumbers = onlystringifiedNumbers.map((stringifiedNumber) =>
      parseInt(stringifiedNumber)
    );
    const parsedCr = parsedNumbers[0] / parsedNumbers[1];
    return parsedCr;
  } else {
    const parsedCr = parseInt(crString);
    return parsedCr;
  }
};

const getCreatureCr = async (creatureName: string) => {
  // iterate over files from allBestiaryFileNames[] in ./bestiary/*
  for (const bestiaryFileName of allBestiaryFileNames) {
    const filePath = `./bestiary/${bestiaryFileName}`;
    // read file, parse to JSON
    const bestiaryJson = await getJson(filePath);
    // search if creature is in file, if yes, return cr and break loop
    const creatureStatblock = getCreatureStatBlock(creatureName, bestiaryJson);
    // if statblock is found in book, return its CR
    if (creatureStatblock) {
      const parsedCr = parseCr(creatureStatblock.cr);
      return parsedCr;
    }
  }
  throw new Error(`ERROR: "${creatureName}" not found in any book`);
};

// const main = async () => {
//   try{
//   const creatureName = "alvnwl";
//   const creatureCr = await getCreatureCr(creatureName);
//   console.log("creatureCr in main()", creatureCr);}
//   catch(err) {console.log(err);
//   }
// };

// main();

const difficulty = async () => {
  const powerlevelTotalOfAllMobs: number = await getAllMobsPowerlevel(allMobs);
  const partyPowerlevel: number = getPartyPowerlevel(party);
  const difficultyValue: number = powerlevelTotalOfAllMobs / partyPowerlevel;

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
  return `${description} (${difficultyValue * 100}%)`;
};

const main = async () => {
  const result = await difficulty();
  console.log(result);
};

main();

// const main = async () => {
//   const diff = await difficulty()
//   console.log(diff);
// };

// main()
