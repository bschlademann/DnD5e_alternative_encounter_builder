import { createContext, useContext } from "react";
import { Creature } from "../5etools";

export const CreatureContext = createContext<Creature[]>([]);

export const CreatureSelector = () => {
  const creatures = useContext(CreatureContext);
  return (
    <div className="creature-selector">
      <input type="text" placeholder="enter creature name" value={0} />
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>cr</th>
          </tr>
        </thead>
        <tbody>
          {creatures.map((creature) => {
            return (
              <tr>
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
