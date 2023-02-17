import { useContext, useState } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";

// import "./CreatureSelector.css"

export type Mob = { creatureName: string; mobSize: number };

export const CreatureSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(filterQuery)
  );

  const existsAsMob = (creature: Creature): boolean => !!mobs[creature.id];

  const incrementMob = (creature: Creature) => {
    setMobs((prevMobs) => {
      return {
        ...prevMobs,
        [creature.id]: {
          creatureName: creature.name,
          mobSize: existsAsMob(creature) ? mobs[creature.id].mobSize + 1 : 1,
        },
      };
    });
  };

  // FIXME: handle click on decrement-button for elements that are not present in state
  const decrementMob = (creature: Creature) => {
    const decrementedMobSize = mobs[creature.id].mobSize - 1;
    if (decrementedMobSize <= 0) {
      setMobs((prevMobs) => {
        const { [creature.id]: creatureIdToRemove, ...restMobs } = prevMobs;
        return restMobs;
      });
    } else {
      setMobs((prevMobs) => {
        return {
          ...prevMobs,
          [creature.id]: {
            creatureName: creature.name,
            mobSize: decrementedMobSize,
          },
        };
      });
    }
  };

  const filterCreatureNames = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterQuery(e.target.value);

  return (
    <div className="creature-selector">
      <input
        type="text"
        placeholder="enter creature name"
        value={filterQuery}
        onChange={filterCreatureNames}
      />
      <div className="creature-list">
        <table>
          <thead>
            <tr>
              <th>in-/decrease mob size</th>
              <th>name</th>
              <th>cr</th>
            </tr>
          </thead>
          <tbody>
            {filteredCreatures.map((creature) => {
              return (
                <tr key={`${creature.name}-${creature.cr}-${creature.id}`}>
                  <button onClick={() => incrementMob(creature)}>+</button>
                  <button onClick={async () => decrementMob(creature)}>
                    -
                  </button>
                  <td>{creature.name}</td>
                  <td>{creature.cr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
