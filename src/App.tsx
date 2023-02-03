import { useState } from "react";
import { setLocalStorage } from "./lib";
import "./App.css";

function App() {
  const [state, setState] = useState({});

  type State = { name: string; cr: number }[];
  const setStateToLocalStorageKey = setLocalStorage(state);

  return <div className="App"></div>;
}

export default App;
