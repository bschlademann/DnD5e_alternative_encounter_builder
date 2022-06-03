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

const getCreatureCr = (creatureName: string, bestiaryJson: { monster: {name: string, cr: number}[] }) => {
const creatureStatblock = bestiaryJson.monster.find(statblock => statblock.name === creatureName)
const creatureCr = creatureStatblock?.cr;
return creatureCr;
};

const main = async () => {
  const creatureName = "Aarakocra";
  const filePath = "./bestiary-testfile.json";
  const bestiaryDataJson = await getJson(filePath);  
  const creatureCr = getCreatureCr(creatureName, bestiaryDataJson);
  console.log("creatureCr in main()", creatureCr);
};

main();