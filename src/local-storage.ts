import { getCreatureDataForLocalStorage } from "./index";

type CreatureData = { name: string; cr: number };
type State = {
  lastUpdatedAt: number;
  creatureData: CreatureData[];
};

// localStorage: bennis_app_lastUpdatedAt, bennis_app_data
// declare function getLastUpdatedAt(): Date | undefined;
// declare function setLastUpdatedAt(date: Date): void;
declare function saveState(state: State): void;
declare function loadState(): State;

// type ParsedLocalStorageData = { localStorageLastUpdatedAt: number };
export const getLocalStorageLastUpdatedAt = () => {
  const localStorageState = localStorage.getItem(
    "5e_combat_difficulty_calculator"
  );
  if (localStorageState) {
    const parsedLocalStorageState: State = JSON.parse(localStorageState);
    return parsedLocalStorageState.lastUpdatedAt;
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

export const setLocalStorage = (creatureData: CreatureData[]) => {
  const date = Date.now()
  localStorage.setItem(
    "5e_combat_difficulty_calculator",
    `{ "lastUpdatetAt": ${date}, "creatureData": ${creatureData.toString()} }`
  );
};

// FIXME: refactor into more logical succession
// export const localStorageUpdateNeeded = () => {
//   return getRepoLastUpdatedAt().then((repoLastUpdatedAt) => {
//     const localStorageLastUpdatedAt = getLocalStorageLastUpdatedAt();
//     if (!localStorageLastUpdatedAt) {
//       return true;
//     } else {return repoLastUpdatedAt > localStorageLastUpdatedAt}
//   });
// };

// const updateLocalStorage = (localStorageUpdateNeeded: boolean) => {
//   if (localStorageUpdateNeeded) {
//     return getCreatureDataForState()
//   };
// };

// const manageLocalStorage = () => {
//   localStorageUpdateNeeded()
//   .then(updateLocalStorage);
// }
