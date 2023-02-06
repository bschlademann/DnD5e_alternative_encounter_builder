import * as repo from "./5etools-repository";
import * as ls from "./local-storage";
// import { pipe } from "fp-ts/lib/function";
// import { BestiaryJson } from "./5etools-repository";

const {
  getBestiaryFileNamesFromRepoUrl,
  fetchBestiaryData,
  filterBestiaryData,
  filterCreatureData,
  parseCreatureData,
  getSetArrayFromParsedCreatureData,
} = repo;

const { setLocalStorage } = ls;

export const getCreatureDataForLocalStorage = () => {
  return getBestiaryFileNamesFromRepoUrl()
    .then(fetchBestiaryData)
    .then(filterBestiaryData)
    .then(filterCreatureData)
    .then(parseCreatureData)
    .then(getSetArrayFromParsedCreatureData);
};

export const setInitialLocalState = () => {
// if (no stuff in localStorage)
// 1. fetch all data
getCreatureDataForLocalStorage()
// 2. persist in localStorage: `{lastUpdatedAt: new Date(), data: ...}`

// FIXME: getSetArrayFromParsedCreatureData returns cr: string
.then(setLocalStorage)

// then setState with data from localStorage

// if (stuff in localStorage)
// 1. /commits for this repository, get last commit
// https://api.github.com/repos/5etools-mirror-1/5etools-mirror-1.github.io/commits?since=... {Date}
// 2. localStorage.lastUpdatedAt < lastCommit.createdAt
// 2a: if true, fetch and regenerate localStorage
// 2b: if false, just use localStorage
// 3. calculate stuff, using state as input
// getDifficulty().then(formatDifficultyOutput).then(console.table);

}

// export const filterStuff = (
//   jsons: BestiaryJson[]
// ): { name: string; cr: string }[] =>
//   pipe(
//     jsons,
//     filterBestiaryJsons,
//     filterCreatureJsons,
//     parseCreatureJsons,
//     (parsedCreatureJsons) => {
//       const state = Array.from(new Set(parsedCreatureJsons));
//       // localStorage.setItem("_benni_creatureData", state.toString());
//       // console.log(state);
//       const kobolds = state.filter((entry) =>
//         entry.name.toLowerCase().includes("kobold")
//       );
//       return kobolds;
//     }
//   );

// filterStuff([]);
