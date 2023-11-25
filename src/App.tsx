// import "./App.css";
import styles from "./Layout.module.css";

import { Party } from "./components/Party";
import { MobsSelector, Mob } from "./components/MobsSelector";
import {
  CreatureContext,
  CreaturesByIdContext,
  MobsContext,
  PartyContext,
} from "./contexts";
import { Difficulty } from "./components/Difficulty";
import { MobsList } from "./components/MobsList";
import { useState, useEffect } from "react";
import { Creature } from "./5etools";
import { getCreaturesById } from "./domain";
import { getOrUpdateLocalStorage } from "./local-storage";

export type MobsState = { [creatureId: number]: Mob };

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});
  const [creaturesById, setCreaturesById] = useState({});
  // const [leveledNpcs, setLeveledNpcs] = useState<LeveledNpcs>([]);

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then((creatures) => {
      setCreatures(creatures);
      const creaturesById = getCreaturesById(creatures);
      setCreaturesById(creaturesById);
    });
  }, []);

  return (
    // <LeveledNpcsContext.Provider value={[leveledNpcs, setLeveledNpcs]}>
    <CreaturesByIdContext.Provider value={creaturesById}>
      <MobsContext.Provider value={[mobs, setMobs]}>
        <CreatureContext.Provider value={creatures}>
          <PartyContext.Provider value={[party, setParty]}>
            <div className={styles.container}>
              <div className={styles.left}>
                <MobsSelector />
              </div>
              <div className={styles.right}>
                <MobsList />
                <Party />
                <Difficulty />
              </div>
            </div>
          </PartyContext.Provider>
        </CreatureContext.Provider>
      </MobsContext.Provider>
    </CreaturesByIdContext.Provider>
    // </LeveledNpcsContext.Provider>
  );
}

export default App;
