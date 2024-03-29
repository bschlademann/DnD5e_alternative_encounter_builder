import { createContext, useEffect, useState } from "react";
import { Creature } from "./5etools";
import { MobsState } from "./App";
import { LeveledNpcs } from "./components/LeveledNpcs";
import { Party } from "./components/Party";
import { getCreaturesById, CreaturesById } from "./domain";
import { getOrUpdateLocalStorage } from "./local-storage";

export const MobsContext = createContext<
  [MobsState, React.Dispatch<React.SetStateAction<MobsState>>]
>([[], () => undefined]);

export const CreatureContext = createContext<Creature[]>([]);

export const PartyContext = createContext<
  [Party, React.Dispatch<React.SetStateAction<Party>>]
>([{ count: 1, level: 1 }, () => undefined]);

// export const LeveledNpcsContext = createContext<
//   [LeveledNpcs, React.Dispatch<React.SetStateAction<LeveledNpcs>>]
// >([[], () => undefined]);

export const CreaturesByIdContext = createContext<CreaturesById>({});