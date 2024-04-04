import { useContext } from "react";
import { MobsContext } from "../contexts";
import { clampInt } from "../lib";
import { MobsState } from "../App";
import { getBaseCrPowerLevel } from "../domain";

export const MobsList = (): JSX.Element => {
  const [mobs, setMobs] = useContext(MobsContext);

  type Mob = MobsState[0];

  const incrementMob = (mob: Mob, id: string) => {
    setMobs((prevMobs) => {
      const { creatureName, powerLevel } = mob;
      return {
        ...prevMobs,
        [id]: {
          creatureName,
          powerLevel,
          mobSize: !!prevMobs[id] ? clampInt(prevMobs[id].mobSize + 1) : 1,
        },
      };
    });
  };

  const decrementMob = (id: string) => {
    setMobs((prevMobs) => {
      const { [id]: mob } = prevMobs;
      if (mob.mobSize === 1) {
        const { [id]: _, ...remainingMobs } = prevMobs;
        return remainingMobs;
      } else {
        return {
          ...prevMobs,
          [id]: {
            ...mob,
            mobSize: mob.mobSize - 1,
          },
        };
      }
    });
  };

  const deleteMob = (id: string): void => {
    setMobs((prevMobs) => {
      const { [id]: _, ...remainingMobs } = prevMobs;
      return remainingMobs;
    });
  };

  return (
    <div>
      <table className="mobs-list">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>name</th>
            <th>PEL</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(mobs).map((mobEntry) => {
            const id = mobEntry[0];
            const mob = mobEntry[1];

            const { creatureName, mobSize, powerLevel, baseCr } = mob;
            return (
              <tr key={`${mob.creatureName}-${id}`}>
                <td>{mobSize}</td>
                <td>
                  <button onClick={() => incrementMob(mob, id)}>+</button>
                  <button onClick={() => decrementMob(id)}>-</button>
                </td>
                <td>{creatureName}</td>
                <td>{powerLevel + getBaseCrPowerLevel(baseCr)}</td>
                <td>
                  <button onClick={() => deleteMob(id)}>X</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
