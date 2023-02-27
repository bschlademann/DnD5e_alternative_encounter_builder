import { powerlevelByCr, powerlevelByPlayerLevel } from "./powerlevel-data.js";
import { Party } from "./components/Party.js";
import { useContext } from "react";
import {
  CreatureContext,
  CreaturesByIdContext,
  MobsContext,
  PartyContext,
} from "./contexts.js";
import { MobsState } from "./App.js";
import { parseToTwoDecimals } from "./lib.js";
import { Creature } from "./5etools.js";
import {difficultyDescriptions} from "./difficultyDescriptions";

export const getPartyPowerlevel = (party: Party): number => {
  return party.count * powerlevelByPlayerLevel[party.level];
};

export type CreaturesById = {
  [creatureId: number]: { name: string; cr: number };
};

export const createCreaturesById = (creatures: Creature[]): CreaturesById => {
  let creaturesById: { [creatureId: number]: { name: string; cr: number } } =
    {};
  creatures.forEach((creature) => {
    const { name, cr } = creature;
    creaturesById[creature.id] = { name, cr };
  });
  return creaturesById;
};

export const getCreaturePowerlevel = (creatureId: number): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creature = creaturesById[creatureId];
  return powerlevelByCr[creature.cr];
};

export const getAllMobsPowerlevel = (mobs: MobsState): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creatureIds = Object.keys(mobs).map((str) => parseInt(str));
  return creatureIds.reduce((totalPowerLevel, id) => {
    const cr = creaturesById[id].cr;
    return totalPowerLevel + powerlevelByCr[cr] * mobs[id].mobSize;
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

const getDifficultyDescription = (difficultyValue: number) => {
  const { none, easy, medium, hard, deadly, absurd } = difficultyDescriptions;
  if(difficultyValue === 0 ) {return none}
  if (difficultyValue <= 0.4) {
    return easy;
  } if (difficultyValue <= 0.6) {
    return medium;
  } if (difficultyValue <= 0.8) {
    return hard;
  } if (difficultyValue <= 1) {
    return deadly;
  } if (difficultyValue > 1) {
    return absurd;
  }
};

export const getDifficulty = () => {
  const [party] = useContext(PartyContext);
  const [mobs] = useContext(MobsContext);
  const powerlevelTotalOfAllMobs = getAllMobsPowerlevel(mobs);
  // const allLeveledNPCsPowerlevel = getAllLeveledNPCsPowerlevel(allLeveledNPCs);
  const partyPowerlevel = getPartyPowerlevel(party);
  const difficultyValue = powerlevelTotalOfAllMobs / partyPowerlevel;
  console.log({difficultyValue});
  
  // (powerlevelTotalOfAllMobs + allLeveledNPCsPowerlevel) / partyPowerlevel;

  const description = getDifficultyDescription(difficultyValue);

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
