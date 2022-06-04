import {
  powerlevelByCr,
  powerlevelByPlayerLevel,
  allBestiaryFileNames,
} from "./data.js";
import * as fs from "fs/promises";

type Party = {
  playerCharacters: string[];
  level: number;
};

type AllMobs = {
  name: string;
  mobSize: number;
}[];

type classLevelNPCs = {
  name: string;
  level: number;
}[];

type BestiaryFileName = typeof allBestiaryFileNames[number];

type BestiaryJson = { monster: { name: string; cr: string }[] };

type CreatureStatBlock = { name: string; cr: string };

// type creatureCr = keyof powerlevelByCr;
// type playerPowerlevel = (valueof?) powerlevelByPlayerLevel;

// const party = {
//   playerCharacters: ["Linea", "Nix", "Ninas_Char", "Fabians_Char", "Dörte"],
//   level: 4,
// };

// const allMobs = [
//   {
//     name: "kobold",
//     mobSize: 8,
//   },
//   {
//     name: "kobold sorcerer",
//     mobSize: 1,
//   },
//   {
//     name: "kobold inventor",
//     mobSize: 1,
//   },
// ];

// const getPartyPowerlevel = (party: Party) => {
//   const partySize: number = party.playerCharacters.length;
//   const partyLevel: number = party.level;
//   const powerLevelPerCharacter: number = powerlevelByPlayerLevel[partyLevel];
//   const partyPowerlevel: number = partySize * powerLevelPerCharacter;
//   return partyPowerlevel;
// };

// const getCreaturePowerlevel = (creatureName: string) => {
//   const creatureCr: number = getCreatureCr(creatureName);
//   const creaturePowerlevel: number = powerlevelByCr[creatureCr];
//   return creaturePowerlevel;
// };

// const getAllMobsPowerlevel = async (allMobs: AllMobs) => {
//   return allMobs.reduce((powerlevelTotalOfAllMobs, mob) => {
//     const creatureName = mob.name;
//     const mobSize = mob.mobSize;
//     const creaturePowerlevel = await getCreaturePowerlevel(creatureName);
//     const mobPowerlevel = mobSize * creaturePowerlevel;
//     return powerlevelTotalOfAllMobs + mobPowerlevel;
//   }, 0);
// };

// const renderDifficulty = async () => {
//   const powerlevelTotalOfAllMobs: number = await getAllMobsPowerlevel(allMobs);
//   const partyPowerlevel: number = getPartyPowerlevel(party);
//   const difficultyValue: number = powerlevelTotalOfAllMobs / partyPowerlevel;

//   let description = "";
//   if (difficultyValue <= 0.4) {
//     description = "easy";
//   } else if (difficultyValue <= 0.6) {
//     description = "medium";
//   } else if (difficultyValue <= 0.8) {
//     description = "hard";
//   } else if (difficultyValue <= 1) {
//     description = "deadly";
//   } else if (difficultyValue > 1) {
//     description = "absurd";
//   }
//   return `${description} (${difficultyValue * 100}%)`;
// };

// // does nothing yet!
// const mixedGroup = (allMobs: AllMobs, ...classLevelNPCs: classLevelNPCs) => {
//   // const allMobsPowerlevel = getAllMobsPowerlevel(allMobs);
//   // const allClassLevelNPCs = [...classLevelNPCs];
//   // iterate over allClassLevelNPCs and sum their powerlevels
//   // add this sum to allMobsPowerlevel and return
// };

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

// FIXME: cr type !== string -> write type cr = keyof powerlevelByCr
const getCreatureCr = async (creatureName: string) => {
  // iterate over files from allBestiaryFileNames[] in ./bestiary/*
  for (const bestiaryFileName of allBestiaryFileNames) {
    const filePath = `./bestiary/${bestiaryFileName}`;
    // read  file, parse to JSON
    const bestiaryJson = await getJson(filePath);
    // search if creature is in file, if yes, return cr and break loop
    const creatureStatblock = getCreatureStatBlock(creatureName, bestiaryJson);
    // if statblock is found in book, return its CR
    if (creatureStatblock) {
     return creatureStatblock.cr;
    }
  }
};

const main = async () => {
  const creatureName = "kobold";
  const creatureCr = await getCreatureCr(creatureName);
  console.log("creatureCr in main()", creatureCr);
};

main();
