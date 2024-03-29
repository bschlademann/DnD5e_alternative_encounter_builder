import { getCreatureData, Creature, getRepoLastUpdatedAt } from "./5etools";

export type ParsedLocalStorageData = {
  lastUpdatedAt: number;
  creatureData: Creature[];
};

export const parseLocalStorageData = (): ParsedLocalStorageData | undefined => {
  const localStorageData = localStorage.getItem(
    "5e_combat_difficulty_calculator"
  );
  if (localStorageData) {
    const parsedLocalStorageData: ParsedLocalStorageData =
      JSON.parse(localStorageData);
    return parsedLocalStorageData;
  } else {
    return undefined;
  }
};

export const updateLocalStorage = (creatureData: Creature[]) => {
  const date = Date.now();
  localStorage.setItem(
    "5e_combat_difficulty_calculator",
    JSON.stringify({ lastUpdatedAt: date, creatureData: creatureData })
  );
};

export const getOrUpdateLocalStorage = async (): Promise<Creature[]> => {
  const localStorageData = parseLocalStorageData();
  const repoLastUpdatedAt = await getRepoLastUpdatedAt();
  const repoHasUpdates =
    repoLastUpdatedAt > (localStorageData?.lastUpdatedAt || 0);

  if (localStorageData === undefined || repoHasUpdates) {
    console.log("updating local storage");
    const data = await getCreatureData();
    updateLocalStorage(data);
    return data;
  } else {
    return localStorageData.creatureData;
  }
};
