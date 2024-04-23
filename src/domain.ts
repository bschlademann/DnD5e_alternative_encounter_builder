import {
  powerLevelByCr,
  powerLevelByCharacterLevel,
} from "./power-level-data.js";
import { TParty } from "./components/Party.js";
import { useContext } from "react";
import { MobsContext, PartyContext, PartyCustomCreaturesContext } from "./contexts.js";
import { MobsState } from "./App.js";
import { truncateDecimals } from "./lib.js";
import { Creature } from "./5etools.js";
import { difficultyDescriptions } from "./difficulty-descriptions.js";
import { Mob } from "./components/MobsList.js";

export const getPartyPowerLevel = (): number => {
  const [party] = useContext(PartyContext);
  const [partyCustomCreatures] = useContext(PartyCustomCreaturesContext)
  const playerCharactersPowerLevel = party.count * powerLevelByCharacterLevel[party.level];
  const customCreaturePowerLevel = getAllMobsPowerLevel(partyCustomCreatures);
  return playerCharactersPowerLevel + customCreaturePowerLevel;
};

export type CreaturesById = {
  [creatureId: string]: { name: string; cr: number };
};

export const getCreaturesById = (creatures: Creature[]) => {
  let creaturesById: {
    [creatureId: string]: {
      name: string;
      cr: number;
    };
  } = {};
  creatures.forEach((creature) => {
    const {
      name,
      cr,
    } = creature;
    creaturesById[creature.id] = {
      name,
      cr,
    };
  });
  return creaturesById;
};

export const createGetPowerLevelByCr =
  (powerLevelByCr: Record<number, number>) => (cr: number) => {
    return powerLevelByCr[cr];
  };
export const getPowerLevelByCr = (cr: number) =>
  createGetPowerLevelByCr(powerLevelByCr)(cr);

export type Level = number | null;

export const createGetPowerLevelByCharacterLevel =
  (powerLevelByCharacterLevel: Record<number, number>) => (level: Level) =>
    level === null ? 0 : powerLevelByCharacterLevel[level];

export const getPowerLevelByCharacterLevel = (level: Level) =>
  createGetPowerLevelByCharacterLevel(powerLevelByCharacterLevel)(level);

export type BaseCr = number | null;

export const getBaseCrPowerLevel = (baseCr: BaseCr) => {
  return baseCr === null ? 0 : getPowerLevelByCr(baseCr);
};

export const getMobTotalPowerLevel = (mob: Mob) => {
  const { level, baseCr } = mob;
  return getPowerLevelByCharacterLevel(level) + getBaseCrPowerLevel(baseCr);
};

export const getAllMobsPowerLevel = (mobs: MobsState): number =>
  Object.values(mobs).reduce((totalPowerLevel, mob) => {
    const { mobSize } = mob;
    const powerLevel = getMobTotalPowerLevel(mob);
    return totalPowerLevel + mobSize * powerLevel;
  }, 0);

export type PowerLevelFractionsByCrFloats = {
  [powerLevelFraction: number]: string;
};
const powerLevelFloatsByCr: PowerLevelFractionsByCrFloats = {
  0: "1/3",
  0.125: "2/3",
  0.5: "1 1/2",
};
export const formatPowerLevelAsFraction = (cr: number) => {
  return powerLevelFloatsByCr[cr]
    ? powerLevelFloatsByCr[cr]
    : powerLevelByCr[cr].toString();
};

export type CrFractionsByFloats = { [crFloat: number]: string };
export const crFractionsByFloats: CrFractionsByFloats = {
  0.125: "1/8",
  0.25: "1/4",
  0.5: "1/2",
};

export const formatCrAsFraction = (cr: number) => {
  return crFractionsByFloats[cr] ? crFractionsByFloats[cr] : cr;
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
  const partyPowerLevel = getPartyPowerLevel();
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
    partyPowerLevel,
    powerLevelTotalOfAllMobs,
    difficulty: `${description} (${truncateDecimals(difficultyValue * 100)}%)`,
  };
};
