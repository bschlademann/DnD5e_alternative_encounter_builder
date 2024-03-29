import {
  powerLevelByCr,
  powerLevelByCharacterLevel,
} from "./power-level-data.js";
import { TParty } from "./components/Party.js";
import { useContext } from "react";
import { CreaturesByIdContext, MobsContext, PartyContext } from "./contexts.js";
import { MobsState } from "./App.js";
import { parseToTwoDecimals } from "./lib.js";
import { Creature } from "./5etools.js";
import { difficultyDescriptions } from "./difficulty-descriptions.js";

export const getPartyPowerLevel = (party: TParty): number => {
  return party.count * powerLevelByCharacterLevel[party.level];
};

export type CreaturesById = {
  [creatureId: string]: { name: string; cr: number };
};

export const getCreaturesById = (creatures: Creature[]) => {
  let creaturesById: {
    [creatureId: string]: { name: string; cr: number; powerLevel: number };
  } = {};
  creatures.forEach((creature) => {
    const { name, cr, powerLevel } = creature;
    creaturesById[creature.id] = { name, cr, powerLevel };
  });
  return creaturesById;
};

export const getCreaturePowerLevel = (creatureId: number): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creature = creaturesById[creatureId];
  return powerLevelByCr[creature.cr];
};

export const createGetPowerLevelByCr =
  (powerLevelByCr: Record<number, number>) => (cr: number) => {
    return powerLevelByCr[cr];
  };
export const getPowerLevelByCr = (cr: number) =>
  createGetPowerLevelByCr(powerLevelByCr)(cr);

const createGetPowerLevelByCharacterLevel =
  (powerLevelByCharacterLevel: Record<number, number>) => (level: number) => {
    return powerLevelByCharacterLevel[level];
  };
export const getPowerLevelByCharacterLevel = (level: number) =>
  createGetPowerLevelByCharacterLevel(powerLevelByCr)(level);

export const getAllMobsPowerLevel = (mobs: MobsState): number => {
  const creaturesById = useContext(CreaturesByIdContext);
  const creatureIds = Object.keys(mobs).map((str) => parseInt(str));
  return creatureIds.reduce((totalPowerLevel, id) => {
    const cr = creaturesById[id].cr;
    return totalPowerLevel + powerLevelByCr[cr] * mobs[id].mobSize;
  }, 0);
};

export type Difficulty = {
  partyPowerLevel: number;
  powerLevelTotalOfAllMobs: number;
  difficultyValue: number;
  description: string;
};

const getDifficultyDescription = (difficultyValue: number) => {
  const { none, easy, medium, hard, deadly, absurd } = difficultyDescriptions;
  if (difficultyValue === 0) {
    return none;
  }
  if (difficultyValue <= 0.4) {
    return easy;
  }
  if (difficultyValue <= 0.6) {
    return medium;
  }
  if (difficultyValue <= 0.8) {
    return hard;
  }
  if (difficultyValue <= 1) {
    return deadly;
  }
  if (difficultyValue > 1) {
    return absurd;
  }
  return "Unknown";
};

export const getDifficulty = () => {
  const [party] = useContext(PartyContext);
  const [mobs] = useContext(MobsContext);
  const powerLevelTotalOfAllMobs = getAllMobsPowerLevel(mobs);
  const partyPowerLevel = getPartyPowerLevel(party);
  const difficultyValue = powerLevelTotalOfAllMobs / partyPowerLevel;
  const description = getDifficultyDescription(difficultyValue);

  return {
    partyPowerLevel,
    powerLevelTotalOfAllMobs,
    difficultyValue,
    description,
  };
};

export const formatDifficultyOutput = (difficulty: Difficulty) => {
  const {
    partyPowerLevel,
    powerLevelTotalOfAllMobs,
    difficultyValue,
    description,
  } = difficulty;
  return {
    partyPowerLevel: parseToTwoDecimals(partyPowerLevel),
    powerLevelTotalOfAllMobs: parseToTwoDecimals(powerLevelTotalOfAllMobs),
    difficulty: `${description} (${parseToTwoDecimals(
      difficultyValue * 100
    )}%)`,
  };
};
