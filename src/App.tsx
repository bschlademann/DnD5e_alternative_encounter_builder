import "./App.css";
import layout from "./Layout.module.css";

import { MobsSelector } from "./components/MobsSelector";
import {
  CreatureContext,
  CreaturesByIdContext,
  MobsContext,
  PartyContext,
  PartyCustomCreaturesContext,
} from "./contexts";
import { Difficulty } from "./components/Difficulty";
import { MobsList } from "./components/MobsList";
import { useState, useEffect } from "react";
import { Creature } from "./5etools";
import { CreaturesById, getCreaturesById } from "./domain";
import { getOrUpdateLocalStorage } from "./local-storage";
import { CustomCreature } from "./components/CustomCreature";
import { Party, TParty } from "./components/Party";
import {
  BorderDecoration,
  BorderElements,
} from "./components/BorderDecoration";

export type MobsState = {
  [creatureId: string]: {
    creatureName: string;
    mobSize: number;
    level: number | null;
    baseCr: number | null;
  };
};

export type PartyCustomCreatureState = MobsState;

function App() {
  const [party, setParty] = useState<TParty>({
    count: 1,
    level: 1,
  });
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [mobs, setMobs] = useState<MobsState>({});
  const [partyCustomCreatures, setPartyCustomCreatures] =
    useState<PartyCustomCreatureState>({});
  const [creaturesById, setCreaturesById] = useState<CreaturesById>({});

  useEffect(() => {
    getOrUpdateLocalStorage().then((creatures) => {
      setCreatures(creatures);
      const creaturesById = getCreaturesById(creatures);
      setCreaturesById(creaturesById);
    });
  }, []);

  type BorderStylingImages = {
    [component: string]: BorderElements;
  };

  const borderStylingImages: BorderStylingImages = {
    mobsList: {
      upperLeftCorner: "corner_1",
      upperRightCorner: "corner_1",
      lowerLeftCorner: "corner_1",
      lowerRightCorner: "corner_1",
      upperEdge: "border_1_top-bottom",
      lowerEdge: "border_1_top-bottom",
      leftEdge: "border_1_side",
      rightEdge: "border_1_side",
    },
  };

  return (
    <PartyCustomCreaturesContext.Provider
      value={[partyCustomCreatures, setPartyCustomCreatures]}
    >
      <CreaturesByIdContext.Provider value={creaturesById}>
        <MobsContext.Provider value={[mobs, setMobs]}>
          <CreatureContext.Provider value={creatures}>
            <PartyContext.Provider value={[party, setParty]}>
              <div className={layout.container}>
                <div className={layout["mobs-selector"]}>
                  <MobsSelector />
                </div>
                <div className={layout.difficulty}>
                  <Difficulty />
                </div>
                <div className={layout["mobs-list"]}>
                  <BorderDecoration borderStyles={borderStylingImages.mobsList}>
                    <MobsList title={"Mobs List"} context={"MobsContext"} />
                  </BorderDecoration>
                </div>
                <div className={layout["custom-creature"]}>
                  <CustomCreature />
                </div>
                <div className={layout.party}>
                  <Party />
                </div>
              </div>
            </PartyContext.Provider>
          </CreatureContext.Provider>
        </MobsContext.Provider>
      </CreaturesByIdContext.Provider>
    </PartyCustomCreaturesContext.Provider>
  );
}

export default App;
