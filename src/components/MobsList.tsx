import { useContext } from "react";
import { MobsContext } from "../contexts";
import { clampInt, truncateDecimals } from "../lib";
import { MobsState } from "../App";
import { getAllMobsPowerLevel, getMobTotalPowerLevel } from "../domain";

export type Mob = MobsState[0];

export const MobsList = (): JSX.Element => {
  const [mobs, setMobs] = useContext(MobsContext);

  const incrementMob = (mob: Mob, id: string) => {
    setMobs((prevMobs) => {
      const { creatureName, level, baseCr } = mob;
      return {
        ...prevMobs,
        [id]: {
          baseCr,
          creatureName,
          level,
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
      <h2>Mobs List</h2>
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
            const { creatureName, mobSize, level, baseCr } = mob;
            console.log({mob, totalPel: getMobTotalPowerLevel(mob)})
            const powerLevel = getMobTotalPowerLevel(mob);
            const truncatedPowerLevel = truncateDecimals(powerLevel);
            return (
              <tr key={`${mob.creatureName}-${id}`}>
                <td>{mobSize}</td>
                <td>
                  <button onClick={() => incrementMob(mob, id)}>+</button>
                  <button onClick={() => decrementMob(id)}>-</button>
                </td>
                <td>{creatureName}</td>
                
                {/* the values for powerLevels get displayed as decimals here instead of fractions
                fractions like 13/6  (1 1/2(lv2) + 2/3(cr 1/8) = 13/6) are not really readable 
                so I only use the fractions that are presend for standart CR values*/}
                <td>{truncatedPowerLevel}</td>
                <td>
                  <button onClick={() => deleteMob(id)}>X</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>Mobs total PEL: {getAllMobsPowerLevel(mobs)}</div>
    </div>
  );
};