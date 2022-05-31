import { powerlevelByCr, powerlevelByPlayerLevel } from "./data.js";

type partyProps = {
  playerCharacters: string[];
  level: number;
};

type allMobsProps = {
  name: string;
  mobSize: number;
}[];

const party = {
  playerCharacters: ["Linea", "Nix", "Ninas_Char", "Fabians_Char", "Dörte"],
  level: 4,
};

const getPartyPowerlevel = (party: partyProps) => {
  const partySize: number = party.playerCharacters.length;
  const partyLevel: number = party.level;
  const powerLevelPerCharacter: number = powerlevelByPlayerLevel[partyLevel];
  const partyPowerlevel: number = partySize * powerLevelPerCharacter;
  return partyPowerlevel;
};

console.log(getPartyPowerlevel(party));


const allMobs = [
  {
    name: "kobold",
    mobSize: 8,
  },
  {
    name: "kobold sorcerer",
    mobSize: 1,
  },
  {
    name: "kobold inventor",
    mobSize: 1,
  },
];

// does nothing yet!
// iteration over books should happen in here
const getCreaturePowerlevel = (creatureName: string) => {
  // itterate over books to get creature CR
  // get powerlevel equivalent to CR from {powerlevelByCr}
  // return powerlevel;
  const creaturePowerlevel = 0;
  return creaturePowerlevel;
};
const getAllMobsPowerlevel = (allMobs: allMobsProps) => {
  return allMobs.reduce((powerlevelTotalOfAllMobs, mob) => {
    const creatureName = mob.name;
    const mobSize = mob.mobSize;
    const creaturePowerlevel = getCreaturePowerlevel(creatureName);
    const mobPowerlevel = mobSize * creaturePowerlevel;
    return powerlevelTotalOfAllMobs + mobPowerlevel;
  }, 0);
};

const powerlevelTotalOfAllMobs = getAllMobsPowerlevel(allMobs);

const getDifficultyValue = (
  powerlevelTotalOfAllMobs: number,
  powerlevelTotalOfAllPlayers: number
) => {
  return powerlevelTotalOfAllMobs / powerlevelTotalOfAllPlayers;
};

// const difficulty = (totalPlayerPowerlevel, totalMonsterPowerlevel) => {
//   const percentage = totalMonsterPowerlevel / totalPlayerPowerlevel;
//   let description = "";
//   if (percentage <= 0.4) {
//     description = "easy";
//   } else if (percentage <= 0.6) {
//     description = "medium";
//   } else if (percentage <= 0.8) {
//     description = "hard";
//   } else if (percentage <= 1) {
//     description = "deadly";
//   } else if (percentage > 1) {
//     description = "absurd";
//   }
//   return `${description} (${percentage * 100}%)`;
// };

// console.log(
//   difficulty(
//     totalPlayerPowerlevel,
//     totalMonsterPowerlevel(creatureNumbersAndCrs)
//   )
// );
