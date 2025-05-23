import { useContext } from "react";
import { MobsContext, PartyCustomCreaturesContext } from "../contexts";
import { clampInt, truncateDecimals } from "../lib";
import { MobsState } from "../App";
import { getAllMobsPowerLevel, getMobTotalPowerLevel } from "../domain";
import { DebounceInput } from "../lib/components";

import "./MobsList.css";

export type Mob = MobsState[0];
export type MobsListProps = {
  title: string;
  context: "PartyCustomCreatureContext" | "MobsContext";
};

export const contextMap = {
  PartyCustomCreatureContext: PartyCustomCreaturesContext,
  MobsContext: MobsContext,
};

export const MobsList = ({ title, context }: MobsListProps): JSX.Element => {
  const [mobs, setMobs] = useContext(contextMap[context]);

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
  const clearMobsList = () => {
    setMobs({});
  };

  const isInputElement = (e: HTMLElement | null): e is HTMLInputElement =>
    e !== null && e instanceof HTMLInputElement;

  const handleNameChange = (id: string) => (name: string) => {
    setMobs((prevMobs) => {
      const { mobSize, level, baseCr } = prevMobs[id];
      return {
        ...prevMobs,
        [id]: {
          creatureName: name,
          mobSize,
          level,
          baseCr,
        },
      };
    });
  };

  const hasEntries = Object.keys(mobs).length !== 0;

  const totalPowerLevelTitle =
    context === "MobsContext" ? "Mobs" : "Party Custom Creatures";

  const mobsTotalPowerLevel = truncateDecimals(getAllMobsPowerLevel(mobs));

  const ClearButton = () => {
    return (
      <>
        {hasEntries ? (
          <button onClick={() => clearMobsList()}>clear</button>
        ) : null}
      </>
    );
  };

  return (
    <div className="mobs-list">
      <div className="title-container">
        <h2>{title}</h2>
        <ClearButton />
      </div>

      <div className="table">
        <div className="head row">
          <div className="datacell">#</div>
          <div className="datacell"></div>
          <div className="datacell">name</div>
          <div className="datacell">PEL</div>
          <div className="datacell"></div>
        </div>
        <div className="table-body">
          {Object.entries(mobs).map((mobEntry) => {
            const id = mobEntry[0];
            const mob = mobEntry[1];
            const { creatureName, mobSize } = mob;
            const powerLevel = getMobTotalPowerLevel(mob);
            const truncatedPowerLevel = truncateDecimals(powerLevel);

            return (
              <div className="row" key={`name-${id}`}>
                <div className="datafield">{mobSize}</div>
                <div className="buttons-container datafield">
                  <button onClick={() => incrementMob(mob, id)}>+</button>
                  <button onClick={() => decrementMob(id)}>-</button>
                </div>
                <div className="datafield">
                  {context === "MobsContext" ? (
                    creatureName
                  ) : (
                    <DebounceInput
                      value={creatureName}
                      onChange={handleNameChange(id)}
                    />
                  )}
                </div>

                {/* the values for powerLevels get displayed as decimals here instead of fractions
                fractions like 13/6  (1 1/2(lv2) + 2/3(cr 1/8) = 13/6) are not really readable 
                so I only use the fractions that are presend for standart CR values*/}
                <div className="datafield">{truncatedPowerLevel}</div>
                <div className="datafield">
                  <button onClick={() => deleteMob(id)}>X</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        {totalPowerLevelTitle} total PEL: {mobsTotalPowerLevel}
      </div>
    </div>
  );
};
