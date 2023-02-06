import keepLocalStorageUpToDate from "./local-storage";

export const main = () => {
  // keepLocalStorageUpToDate();
  // save localStorage to State
  // calc difficulty with entered userdata
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
