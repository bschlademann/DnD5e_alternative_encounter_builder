// import "./App.css";

import { Party } from "./components/Party";
import { MobsSelector, Mob } from "./components/MobsSelector";
import { Contexts } from "./contexts";
import { Difficulty } from "./components/Difficulty";

export type MobsState = { [creatureId: number]: Mob };

function App() {
  return (
    <Contexts>
      <Difficulty />
      <Party />
      <MobsSelector />
    </Contexts>
  );
}

export default App;
