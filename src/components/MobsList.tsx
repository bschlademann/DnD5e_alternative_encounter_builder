import { useContext, useState } from "react";
import { Creature } from "../5etools";
import {
  CreatureContext,
  CreaturesByIdContext,
  MobsContext,
} from "../contexts";
import { clampInt } from "../lib";

export type Mob = { creatureName: string; mobSize: number };

export const MobsList = (): JSX.Element => {
  const creatures = useContext(CreatureContext);
  const creaturesById = useContext(CreaturesByIdContext);
  const [mobs, setMobs] = useContext(MobsContext);

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

  const decrementMob = (creature: Creature): void => {
    setMobs((prevMobs) => {
      const { [creature.id]: mob, ...rest } = prevMobs;
      if (mob) {
        if (mob.mobSize === 1) {
          return rest;
        } else {
          return {
            ...rest,
            [creature.id]: {
              creatureName: creature.name,
              mobSize: mob.mobSize - 1,
            },
          };
        }
      }
      return prevMobs;
    });
  };

  const deleteMob = (creature: Creature): void => {
    setMobs((prevMobs) => {
      const { [creature.id]: mob, ...rest } = prevMobs;
      return rest;
    });
  };

  const mobIds = Object.keys(mobs).map((id) => parseInt(id));

  return (
    <div>
      <table className="mobs-list">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>name</th>
            <th>cr</th>
          </tr>
        </thead>
        <tbody>
          {mobIds.map((id) => {
            const creature = creaturesById[id];
            const mobSize = mobs[id].mobSize;
            return (
              <tr key={`${creature.name}-${creature.cr}-${id}`}>
                <td>{mobSize}</td>
                <td>
                  <button onClick={() => incrementMob({ ...creature, id })}>
                    +
                  </button>
                  <button onClick={() => decrementMob({ ...creature, id })}>
                    -
                  </button>
                </td>
                <td>{creature.name}</td>
                <td>{creature.cr}</td>
                <td>
                  <button onClick={() => deleteMob({ ...creature, id })}>
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
