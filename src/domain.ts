import { powerlevelByCr, powerlevelByPlayerLevel } from "./power-level-data.js";
import { TParty } from "./components/Party.js";
import { useContext } from "react";
import {
  CreaturesByIdContext,
  MobsContext,
  PartyContext,
} from "./contexts.js";
import { MobsState } from "./App.js";
import { parseToTwoDecimals } from "./lib.js";
import { Creature } from "./5etools.js";
import {difficultyDescriptions} from "./difficulty-descriptions.js";

export const getPartyPowerlevel = (party: TParty): number => {
  return party.count * powerlevelByPlayerLevel[party.level];
};

export type CreaturesById = {
  [creatureId: string]: { name: string; cr: number };
};

export const getCreaturesById = (creatures: Creature[]) => {
  let creaturesById: {[creatureId: string]: { name: string; cr: number, powerlevel: number }} = {};
  creatures.forEach((creature) => {
    const { name, cr, powerlevel } = creature;
    creaturesById[creature.id] = { name, cr, powerlevel };
  });
  return creaturesById;
};

export const getCreaturePowerlevel = (creatureId: number): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creature = creaturesById[creatureId];
  return powerlevelByCr[creature.cr];
};

export const createGetPowerlevelByCr = (powerlevelByCr: Record<number, number>) => (cr:number) => {
  return powerlevelByCr[cr];
}
export const getPowerlevelByCr = (cr: number) => createGetPowerlevelByCr(powerlevelByCr)(cr);


export const getAllMobsPowerlevel = (mobs: MobsState): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creatureIds = Object.keys(mobs).map((str) => parseInt(str));
  return creatureIds.reduce((totalPowerLevel, id) => {
    const cr = creaturesById[id].cr;
    return totalPowerLevel + powerlevelByCr[cr] * mobs[id].mobSize;
  }, 0);
};

export type Difficulty = {
  partyPowerlevel: number;
  powerlevelTotalOfAllMobs: number;
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
  return "Unknown";
};

export const getDifficulty = () => {
  const [party] = useContext(PartyContext);
  const [mobs] = useContext(MobsContext);
  const powerlevelTotalOfAllMobs = getAllMobsPowerlevel(mobs);
  const partyPowerlevel = getPartyPowerlevel(party);
  const difficultyValue = powerlevelTotalOfAllMobs / partyPowerlevel;
  const description = getDifficultyDescription(difficultyValue);

  return {
    partyPowerlevel,
    powerlevelTotalOfAllMobs,
    difficultyValue,
    description,
  };
};

export const formatDifficultyOutput = (difficulty: Difficulty) => {
  const {
    partyPowerlevel,
    powerlevelTotalOfAllMobs,
    difficultyValue,
    description,
  } = difficulty;
  return {
    partyPowerlevel: parseToTwoDecimals(partyPowerlevel),
    powerlevelTotalOfAllMobs: parseToTwoDecimals(powerlevelTotalOfAllMobs),
    difficulty: `${description} (${parseToTwoDecimals(
      difficultyValue * 100
    )}%)`,
  };
};
