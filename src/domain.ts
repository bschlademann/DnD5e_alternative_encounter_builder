import { powerlevelByCr, powerlevelByPlayerLevel } from "./powerlevel-data.js";
import { Party } from "./components/Party.js";
import { useContext } from "react";
import { CreatureContext, MobsContext, PartyContext } from "./contexts.js";
import { MobsState } from "./App.js";
import { parseToTwoDecimals } from "./lib.js";

export const getPartyPowerlevel = (party: Party): number => {  
  return party.count * powerlevelByPlayerLevel[party.level];
};

export const getCreaturePowerlevel = (creatureId: number): number => {
  const creatures = useContext(CreatureContext);
  const creature = creatures.filter(
    (creature) => creature.id === creatureId
  )[0];
  return powerlevelByCr[creature.cr];
  // FIXME:
  // doing it like this means iterating over all creatures until creature with id is found
  // hastable for creature would be much faster
  // reactor state[creatures] from Array to Object
};

export const getAllMobsPowerlevel = (mobs: MobsState) => {
  const creatures = useContext(CreatureContext);
  const creatureIds = Object.keys(mobs).map((str) => parseInt(str));
  return creatureIds.reduce((totalPowerlevel, creatureId) => {
    return (totalPowerlevel += getCreaturePowerlevel(creatureId));
  }, 0);
};

// export const getAllLeveledNPCsPowerlevel = (
//   allLeveledNPCs: LeveledNPC[]
// ): number => {
//   return allLeveledNPCs.reduce((allLeveledNPCsPowerlevel, leveledNPC) => {
//     const powerlevel = powerlevelByPlayerLevel[leveledNPC.level];
//     return (allLeveledNPCsPowerlevel += powerlevel);
//   }, 0);
// };

export type Difficulty = {
  partyPowerlevel: number;
  powerlevelTotalOfAllMobs: number;
  // allLeveledNPCsPowerlevel: number;
  difficultyValue: number;
  description: string;
};

export const getDifficulty = () => {
  const [party] = useContext(PartyContext);
  const [mobs] = useContext(MobsContext);
  const powerlevelTotalOfAllMobs = getAllMobsPowerlevel(mobs);
  // const allLeveledNPCsPowerlevel = getAllLeveledNPCsPowerlevel(allLeveledNPCs);
  const partyPowerlevel = getPartyPowerlevel(party);
  const difficultyValue = powerlevelTotalOfAllMobs / partyPowerlevel;
    // (powerlevelTotalOfAllMobs + allLeveledNPCsPowerlevel) / partyPowerlevel;

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
    // allLeveledNPCsPowerlevel,
    difficultyValue,
    description,
  };
};

export const formatDifficultyOutput = (difficulty: Difficulty) => {
  const {
    partyPowerlevel,
    powerlevelTotalOfAllMobs,
    // allLeveledNPCsPowerlevel,
    difficultyValue,
    description,
  } = difficulty;
  return {
    partyPowerlevel: parseToTwoDecimals(partyPowerlevel),
    powerlevelTotalOfAllMobs: parseToTwoDecimals(powerlevelTotalOfAllMobs),
    // allLeveledNPCsPowerlevel: parseToTwoDecimals(allLeveledNPCsPowerlevel),
    difficulty: `${description} (${parseToTwoDecimals(
      difficultyValue * 100
    )}%)`,
  };
};
