import { useContext, useState } from "react";
import { CreatureContext, MobsContext } from "../contexts";


export const CreatureSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);
  const filteredCreatures = creatures.filter((creature) =>
    creature.name.toLowerCase().includes(filterQuery)
  );
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
      <table>
        <thead>
          <tr>
            <th></th>
            <th>name</th>
            <th>cr</th>
          </tr>
        </thead>
        <tbody>
          {filteredCreatures.map((creature) => {
            return (
              <tr>
                <button>+</button>
                <button>-</button>
                <td>{creature.name}</td>
                <td>{creature.cr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
