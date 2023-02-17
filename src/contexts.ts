import { createContext } from "react";
import { Creature } from "./5etools";
import { MobsState } from "./App";
import { Party } from "./components/Party";



export const MobsContext = createContext<
  [MobsState, React.Dispatch<React.SetStateAction<MobsState>>]
>([[], () => undefined]);

export const CreatureContext = createContext<Creature[]>([]);

export const PartyContext = createContext<
  [Party, React.Dispatch<React.SetStateAction<Party>>]
>([{ count: 1, level: 1 }, () => undefined]);

