import { createContext } from "react";
import { Creature } from "./5etools";
import { Party } from "./components/Party";
import { Mob } from "./domain";

export const MobsContext = createContext<
  [Mob[], React.Dispatch<React.SetStateAction<Mob[]>>]
>([[], () => undefined]);

export const CreatureContext = createContext<Creature[]>([]);

export const PartyContext = createContext<
  [Party, React.Dispatch<React.SetStateAction<Party>>]
>([{ count: 1, level: 1 }, () => undefined]);

