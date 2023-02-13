import { useEffect, useState } from "react";
import { getOrUpdateLocalStorage } from "./local-storage";
import "./App.css";
import type { Creature } from "./5etools";

import { Party, PartyContext } from "./components/Party";
import { CreatureContext, CreatureSelector } from "./components/CreatureSelector";

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then(setCreatures);
  }, []);

  return (
    <CreatureContext.Provider value={creatures}>
      <PartyContext.Provider value={[party, setParty]}>
        <div className="App">
          <Party />
          <CreatureSelector />
        </div>
      </PartyContext.Provider>
    </CreatureContext.Provider>
  );
}

export default App;
