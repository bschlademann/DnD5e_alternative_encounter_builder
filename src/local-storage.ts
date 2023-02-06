import { getCreatureData, CreatureData } from "./5etools-repository";

export type ParsedLocalStorageData = {
  lastUpdatedAt: number;
  creatureData: CreatureData[];
};

export const parseLocalStorageData = () => {
  const localStorageData = localStorage.getItem(
    "5e_combat_difficulty_calculator"
  );
  if (localStorageData) {
    const parsedLocalStorageData: ParsedLocalStorageData = JSON.parse(localStorageData);
    return parsedLocalStorageData;
  } else {
    throw new Error("localStorage is empty")
  }
};

export const getLocalStorageLastUpdatedAt = () => parseLocalStorageData().lastUpdatedAt;

export const getCreatureDataFromLocalStorage = () => parseLocalStorageData().creatureData;

type Commit = {
  commit: {
    committer: {
      date: string;
    };
  };
};
export const getLastCommitDate = (commits: Commit[]) =>
  Date.parse(commits[0].commit.committer.date);

export const getRepoLastUpdatedAt = () => {
  return fetch(
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits"
  )
    .then((res) => res.json())
    .then(getLastCommitDate);
};

export const localStorageIsEmpty = () => {
  return getLocalStorageLastUpdatedAt() === undefined;
};

const compareWithLocalStorageLastUpdatedAt = () => (repoLastUpdatedAt: number) => {
  const localStorageLastUpdatedAt = getLocalStorageLastUpdatedAt();
  // localstorage empty
  if (localStorageIsEmpty()) {
    return true;
    // localstorage outdated?
  } else {
    return repoLastUpdatedAt > localStorageLastUpdatedAt;
  }
};

export const localStorageUpdateNeeded = () => {
  return getRepoLastUpdatedAt().then(compareWithLocalStorageLastUpdatedAt);
};

export const updateLocalStorage = (creatureData: CreatureData[]) => {
  const date = Date.now();
  localStorage.setItem(
    "5e_combat_difficulty_calculator", JSON.stringify({lastUpdatedAt: date, creatureData: creatureData})
  );
};

export const keepLocalStorageUpToDate = async () => {
  if (await localStorageUpdateNeeded()) {
    console.log("updating local storage");
    return getCreatureData()
    .then(updateLocalStorage);
  }
};

