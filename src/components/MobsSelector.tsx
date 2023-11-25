import { useContext, useState } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";
import { clampInt } from "../lib";

import "./MobsSelector.css";

export type Mob = { creatureName: string; mobSize: number };

export const MobsSelector = () => {
  // complete component rerenders when state changes
  // split into praten and multiple children, each managin one type of state
  // only child getse rerenderes on chang, but not the while parent
  // also virtualized tables
  const [filterQuery, setFilterQuery] = useState("");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(filterQuery)
  );

  const incrementMob = (creature: Creature) => {
    setMobs((prevMobs) => {
      return {
        ...prevMobs,
        [creature.id]: {
          creatureName: creature.name,
          mobSize: !!prevMobs[creature.id]
            ? clampInt(prevMobs[creature.id].mobSize + 1)
            : 1,
        },
      };
    });
  };

  const filterCreatureNames = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterQuery(e.target.value);

  return (
    <div className="mobs-selector">
      <input
        type="text"
        placeholder="enter creature name"
        value={filterQuery}
        onChange={filterCreatureNames}
      />
      <div className="table-head">
        <span>(empty space)</span>
        <button>name</button>
        <button>cr</button>
      </div>

      <div className="mobs-list">
        <div>
          {filteredCreatures.map((creature) => {
            return (
              <tr key={`${creature.name}-${creature.cr}-${creature.id}`}>
                <td>
                  <button onClick={() => incrementMob(creature)}>+</button>
                </td>
                <td>{creature.name}</td>
                <td>{creature.cr}</td>
              </tr>
            );
          })}
        </div>
      </div>
    </div>
  );
};
