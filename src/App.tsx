import { useEffect, useState } from "react";
import { getOrUpdateLocalStorage } from "./local-storage";
// import "./App.css";
import type { Creature } from "./5etools";

import { Party } from "./components/Party";
import { CreatureSelector, Mob } from "./components/CreatureSelector";
import { CreatureContext, MobsContext, PartyContext } from "./contexts";

export type MobsState = { [creatureId: number]: Mob };

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then(setCreatures);
  }, []);

  return (
    <MobsContext.Provider value={[mobs, setMobs]}>
      <CreatureContext.Provider value={creatures}>
        <PartyContext.Provider value={[party, setParty]}>
          <div className="App">
            <div>mobs: {JSON.stringify(mobs)}</div>
            <Party />
            <CreatureSelector />
          </div>
        </PartyContext.Provider>
      </CreatureContext.Provider>
    </MobsContext.Provider>
  );
}

export default App;
