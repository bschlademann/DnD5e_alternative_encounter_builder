import { useEffect, useState } from "react";
import {
  keepLocalStorageUpToDate,
  getCreatureDataFromLocalStorage,
} from "./local-storage";
import "./App.css";

function App() {
  const [creatureData, setCreatureData] = useState({});

  useEffect(() => {
    
    // localStorage.clear();

    keepLocalStorageUpToDate().then(() => {
      const creatureData = getCreatureDataFromLocalStorage();
      console.log({creatureData});
      setCreatureData(creatureData);
      
    });
  }, []);

  return (
    <div className="App">
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
  );
}

export default App;
