import {getCreatureDataForState} from "./index"

export type State = {
  name: string;
  cr: number;
}[];

// localStorage: bennis_app_lastUpdatedAt, bennis_app_data
// declare function getLastUpdatedAt(): Date | undefined;
// declare function setLastUpdatedAt(date: Date): void;
declare function saveState(state: State): void;
declare function loadState(): State;

export const setLocalStorageLastUpdatedAt = (date: number) => {
  localStorage.setItem(
    "5e_combat_difficulty_calculator",
    `{ "lastUpdatetAt": ${date} }`
  );
};

type ParsedLocalStorageData = { localStorageLastUpdatedAt: number };
export const getLocalStorageLastUpdatedAt = () => {
  const localStorageData = localStorage.getItem(
    "5e_combat_difficulty_calculator"
  );
  if (localStorageData) {
    const parsedLocalStorageData: ParsedLocalStorageData =
      JSON.parse(localStorageData);
    const localStorageLastUpdatedAt =
      parsedLocalStorageData.localStorageLastUpdatedAt;
    if (localStorageLastUpdatedAt) {
      return localStorageLastUpdatedAt;
    }
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
  new Date(commits[0].commit.committer.date);

export const parseDateToNumber = (date: Date) => Date.parse(date.toString());

export const getRepoLastUpdatedAt = () => {
  return fetch(
    "https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits"
  )
    .then((res) => res.json())
    .then(getLastCommitDate)
    .then(parseDateToNumber);
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