import { useEffect, useState, createContext } from "react";
import { getOrUpdateLocalStorage } from "./local-storage";
import "./App.css";
import { Creature } from "./5etools";

export const CreatureContext = createContext<Creature[]>([]);

const Creature = ({ cr }: Creature) => {
  return <div>{cr}</div>;
};

const Creatures = () => {
  return (
    <CreatureContext.Consumer>
      {(creatureData) =>
        creatureData.map((creature, i) => <Creature key={i} {...creature} />)
      }
    </CreatureContext.Consumer>
  );
};

function App() {
  const [creatures, setCreatures] = useState<Creature[]>([]);
  useEffect(() => {
    localStorage.clear();
    getOrUpdateLocalStorage().then(setCreatures);
  }, []);

  return (
    <CreatureContext.Provider value={creatures}>
      <div className="App">
        <Creatures />
        <form action="">
          <div className="party">
            <label htmlFor="party-number">party-number</label>
            <input type="number" id="party-number" />
            <label htmlFor="party-level">party-average-level</label>
            <input type="number" id="party-level" />
          </div>

          <div className="creature">
            <label htmlFor="creature-name">creature-name</label>
            <input type="text" id="creature-name" />
            <label htmlFor="creature-number">creature-number</label>
            <input type="number" id="creature-number" />
          </div>

          <div className="named-npcs">
            <label htmlFor="named-npcs-number">named-npcs-number</label>
            <input type="number" id="named-npcs-number" />
            <label htmlFor="named-npcs-level">named-npcs-level</label>
            <input type="number" id="named-npcs-level" />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </CreatureContext.Provider>
  );
}

export default App;
