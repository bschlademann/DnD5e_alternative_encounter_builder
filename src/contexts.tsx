import { createContext, useEffect, useState } from "react";
import { Creature } from "./5etools";
import { MobsState } from "./App";
import { LeveledNpcs } from "./components/LeveledNpcs";
import { Party } from "./components/Party";
import { createCreaturesById, CreaturesById } from "./domain";
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

export const Contexts:React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});
  const [creaturesById, setCreaturesById] = useState({});
  // const [leveledNpcs, setLeveledNpcs] = useState<LeveledNpcs>([]);

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then((creatures) => {
      setCreatures(creatures);
      const creaturesById = createCreaturesById(creatures);
      setCreaturesById(creaturesById);
    });
  }, []);

  return (
    // <LeveledNpcsContext.Provider value={[leveledNpcs, setLeveledNpcs]}>
    <CreaturesByIdContext.Provider value={creaturesById}>
      <MobsContext.Provider value={[mobs, setMobs]}>
        <CreatureContext.Provider value={creatures}>
          <PartyContext.Provider value={[party, setParty]}>
            {children}
          </PartyContext.Provider>
        </CreatureContext.Provider>
      </MobsContext.Provider>
    </CreaturesByIdContext.Provider>
    // </LeveledNpcsContext.Provider>
  );
}
