import { getCreatureDataForLocalStorage } from "./5etools-repository";

type CreatureData = { name: string; cr: number };
type State = {
  lastUpdatedAt: number;
  creatureData: CreatureData[];
};

export const getLocalStorageLastUpdatedAt = () => {
  const localStorageData = localStorage.getItem(
    "5e_combat_difficulty_calculator"
  );
  if (localStorageData) {
    const parsedLocalStorageData: State = JSON.parse(localStorageData);
    return parsedLocalStorageData.lastUpdatedAt;
  }
};

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

const compareWitchLocalStorageLastUpdatedAt = () => (repoLastUpdatedAt: number) => {
  const localStorageLastUpdatedAt = getLocalStorageLastUpdatedAt();
  // localstorage empty
  if (!localStorageLastUpdatedAt) {
    return true;
    // localstorage outdated?
  } else {
    return repoLastUpdatedAt > localStorageLastUpdatedAt;
  }
};

export const localStorageUpdateNeeded = () => {
  return getRepoLastUpdatedAt().then(compareWitchLocalStorageLastUpdatedAt);
};

export const updateLocalStorage = (creatureData: CreatureData[]) => {
  const date = Date.now();
  localStorage.setItem(
    "5e_combat_difficulty_calculator",
    `{ "lastUpdatetAt": ${date}, "creatureData": ${creatureData.toString()} }`
  );
};

export const keepLocalStorageUpToDate = async () => {
  if (await localStorageUpdateNeeded()) {
    console.log("updating local storage");
    getCreatureDataForLocalStorage()
    .then(updateLocalStorage);
  }
};
export default keepLocalStorageUpToDate;