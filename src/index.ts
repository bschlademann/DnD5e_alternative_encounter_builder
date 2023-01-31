import * as repo from "./5etools-repository";

export const main = () => {
  const {
    getBestiaryFileNamesFromRepoUrl,
    fetchBestiaryData,
    filterBestiaryJsons,
    filterCreatureJsons,
    parseCreatureJsons,
  } = repo;
  // 1. fetch data, parse into domain types
  getBestiaryFileNamesFromRepoUrl()
    .then(fetchBestiaryData)
    .then(filterBestiaryJsons)
    .then(filterCreatureJsons)
    .then(parseCreatureJsons)
    // 2. put that stuff into a variable _here_, called state (later localStorage / useState)
    .then((parsedCreatureJsons) => {
      const state = Array.from(new Set(parsedCreatureJsons));
      // localStorage.setItem("_benni_creatureData", state.toString());
      // console.log(state);+
      const kobolds = state.filter(entry => entry.name.toLowerCase().includes("kobold"))
      console.log(kobolds);
      
      
      // 
    });
  // 3. calculate stuff, using state as input
  // getDifficulty().then(formatDifficultyOutput).then(console.table);
};
