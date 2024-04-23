import { createContext } from "react";
import { Creature } from "./5etools";
import { MobsState } from "./App";
import { TParty } from "./components/Party";
import { CreaturesById } from "./domain";

export const MobsContext = createContext<
  [MobsState, React.Dispatch<React.SetStateAction<MobsState>>]
>([{}, () => undefined]);

export const CreatureContext = createContext<Creature[]>([]);

export const PartyContext = createContext<
  [TParty, React.Dispatch<React.SetStateAction<TParty>>]
>([{ count: 1, level: 1}, () => undefined]);

export const PartyCustomCreaturesContext = createContext<
[MobsState, React.Dispatch<React.SetStateAction<MobsState>>]
>([{}, () => undefined]);;

export const CreaturesByIdContext = createContext<CreaturesById>({});