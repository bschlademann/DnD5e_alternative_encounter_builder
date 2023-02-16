import { useContext, useState } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";

// import "./CreatureSelector.css"

// click on button
// get creature
// setMobs(prevMobs => ...prevMobs, {creatureName: creature.name, mobSize: })
// type Mob = {
//   creatureName: string;
//   mobSize: number;
// }
// const incrementAbilityScore = (ability: Domain.Ability) => {
//   setState((prevState: Domain.State) => {
//     return {
//       ...prevState,
//       abilitiesByValue: {
//         ...prevState.abilitiesByValue,
//         [ability]: prevState.abilitiesByValue[ability] + 1,
//       },
//     };
//   });
// };

export type Mob = { creatureName: string; creatureId: number; mobSize: number };

export const CreatureSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(filterQuery)
  );

  const existsAsMob = (creature: Creature): boolean =>
    !!mobs.find((mob) => mob.creatureId === creature.id);

  const incrementMob = (creature: Creature): void => {
    // if creature exists in mobs
    if (existsAsMob(creature)) {
      // mobsize++
      const creatureInMobs = mobs.find(
        (mob: Mob) => mob.creatureId === creature.id
      );
      const indexCreatureInMobs = mobs.indexOf(creatureInMobs);
      setMobs((prevMobs) => {
        console.log("increase mobSize by 1");
        return [
          ...prevMobs,
          (prevMobs[indexCreatureInMobs].mobSize =
            parseInt(prevMobs[indexCreatureInMobs].mobSize) + 1),
        ];
      });
      // if creature does not exist in mobs yet
    } else {
      // add creature to mobs
      // set mobSize=1
      setMobs((prevMobs) => {
        return [
          ...prevMobs,
          { creatureName: creature.name, creatureId: creature.id, mobSize: 1 },
        ];
      });
    }
  };

  // const decrementMob = (e: React.ChangeEvent<HTMLInputElement>): void => {}

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
                  <button>-</button>
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
