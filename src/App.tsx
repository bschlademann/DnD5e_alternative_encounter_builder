import { useEffect, useState, createContext } from "react";
import { getOrUpdateLocalStorage } from "./local-storage";
import "./App.css";
import type { Creature } from "./5etools";

import { Party, PartyContext } from "./components/Party";

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);

  useEffect(() => {
    localStorage.clear();
    getOrUpdateLocalStorage().then(setCreatures);
  }, []);

  return (
    <PartyContext.Provider value={[party, setParty]}>
      <div className="App">
        <Party />
      </div>
    </PartyContext.Provider>
  );
}

export default App;
