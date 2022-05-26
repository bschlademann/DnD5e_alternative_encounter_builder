import { powerlevelByCr, powerlevelByPlayerLevel } from "./data.js";

type allMobs = {
  name: string;
  mobSize: number;
}[];

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
const getPowerlevelTotalOfAllMobs = (allMobs: allMobs) => {
  allMobs.reduce((powerlevelTotalOfAllMobs, mob) => {
    const creatureName = mob.name;
    const mobSize = mob.mobSize;
    const creaturePowerlevel = getCreaturePowerlevel(creatureName);
    const mobPowerlevel = mobSize * creaturePowerlevel;
    return powerlevelTotalOfAllMobs + mobPowerlevel;
  }, 0);
};


/**
 * players and partyLevel are pretty much the {state} of this thing
 */
const allPlayers = ["Linea", "Dörte", "Ninas_char", "Player_1", "Player_2"];
// Beachte für typing von partylevel: Object keys sind strings, keine numbers!;
const partylevel = 4; 


const getPowerlevelTotalOfAllPlayers = (
  allPlayers: string[],
  partyLevel: number
) => {
  const powerlevelTotalOfAllPlayers =
    powerlevelByPlayerLevel[partyLevel] * allPlayers.length;
  return powerlevelTotalOfAllPlayers;
};

const powerlevelTotalOfAllMobs = getPowerlevelTotalOfAllMobs(allMobs);
const powerlevelTotalOfAllPlayers = getPowerlevelTotalOfAllPlayers(allPlayers, partylevel);
const getDifficultyValue = (powerlevelTotalOfAllMobs: number, powerlevelTotalOfAllPlayers: number) => {
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
