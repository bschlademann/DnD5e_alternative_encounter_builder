// import "./App.css";
import styles from "./Layout.module.css";

import { MobsSelector, Mob } from "./components/MobsSelector";
import {
  CreatureContext,
  CreaturesByIdContext,
  LeveledNpcListContext,
  MobsContext,
  PartyContext,
} from "./contexts";
import { Difficulty } from "./components/Difficulty";
import { MobsList } from "./components/MobsList";
import { useState, useEffect } from "react";
import { Creature } from "./5etools";
import { CreaturesById, getCreaturesById } from "./domain";
import { getOrUpdateLocalStorage } from "./local-storage";
import { LeveledNpcList } from "./components/LeveledNpcList";
import { TLeveledNpc } from "./components/LeveledNpc";
import { Party } from "./components/Party";

export type MobsState = { [creatureId: string]: Mob };

function App() {
  const [party, setParty] = useState({ count: 1, level: 1 });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});
  const [creaturesById, setCreaturesById] = useState<CreaturesById>({});
  const [leveledNpcList, setLeveledNpcList] = useState<TLeveledNpc[]>([]);

  useEffect(() => {
    // localStorage.clear();
    getOrUpdateLocalStorage().then((creatures) => {
      setCreatures(creatures);
      const creaturesById = getCreaturesById(creatures);
      setCreaturesById(creaturesById);
    });
  }, []);

  return (
    <LeveledNpcListContext.Provider value={[leveledNpcList, setLeveledNpcList]}>
      <CreaturesByIdContext.Provider value={creaturesById}>
        <MobsContext.Provider value={[mobs, setMobs]}>
          <CreatureContext.Provider value={creatures}>
            <PartyContext.Provider value={[party, setParty]}>
              <div className={styles.container}>
                <div className={styles.left}>
                  <MobsSelector />
                </div>
                <div className={styles.right}>
                  <LeveledNpcList />
                  <MobsList />
                  <Party />
                  <Difficulty />
                </div>
              </div>
            </PartyContext.Provider>
          </CreatureContext.Provider>
        </MobsContext.Provider>
      </CreaturesByIdContext.Provider>
    </LeveledNpcListContext.Provider>
  );
}

export default App;
