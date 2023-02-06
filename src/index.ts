import * as repo from "./5etools-repository";
import * as ls from "./local-storage";
// import { pipe } from "fp-ts/lib/function";
// import { BestiaryJson } from "./5etools-repository";

const { keepLocalStorageUpToDate } = ls;





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
