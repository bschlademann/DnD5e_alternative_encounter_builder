import { useEffect, useState } from "react";
import { getOrUpdateLocalStorage } from "./local-storage";
// import "./App.css";
import type { Creature } from "./5etools";

import { Party } from "./components/Party";
import { MobsSelector, Mob } from "./components/MobsSelector";
import {
  CreatureContext,
  // LeveledNpcsContext,
  MobsContext,
  PartyContext,
} from "./contexts";
import { LeveledNpcs } from "./components/LeveledNpcs";
import { Difficulty } from "./components/Difficulty";

export type MobsState = { [creatureId: number]: Mob };

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});
  // const [leveledNpcs, setLeveledNpcs] = useState<LeveledNpcs>([]);

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then(setCreatures);
  }, []);

  return (
    // <LeveledNpcsContext.Provider value={[leveledNpcs, setLeveledNpcs]}>
      <MobsContext.Provider value={[mobs, setMobs]}>
        <CreatureContext.Provider value={creatures}>
          <PartyContext.Provider value={[party, setParty]}>
            <div className="App">
              <div>mobs: {JSON.stringify(mobs)}</div>
              <Difficulty/>
              <Party />
              <MobsSelector />
            </div>
          </PartyContext.Provider>
        </CreatureContext.Provider>
      </MobsContext.Provider>
    // </LeveledNpcsContext.Provider>
  );
}

export default App;
