import "./MobsSelector.css";

import { useContext, useState, useRef, useEffect } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";
import { clampInt } from "../lib";
import { formatCrAsFraction, formatPowerLevelAsFraction } from "../domain";

import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export const MobsSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);

  const rowHeights = useRef(new Map<number, number>());
  const listRef = useRef<List>(null);

  const sortCreatures = (
    a: { cr: number; name: string },
    b: { cr: number; name: string }
  ) => {
    if (sortField === "cr") {
      if (a.cr === b.cr) {
        // Sub-sort by name if 'cr' is the same
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return sortDirection === "asc" ? a.cr - b.cr : b.cr - a.cr;
    }

    // Default to name sorting
    return sortDirection === "asc"
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  };

  const filteredCreatures = creatures
    .filter((creature) =>
      creature.name.toLowerCase().includes(filterQuery.toLowerCase())
    )
    .sort(sortCreatures);

  const addToMobsList = (creature: Creature) => {
    setMobs((prevMobs) => {
      const { name, id, cr } = creature;
      return {
        ...prevMobs,
        [id]: {
          baseCr: cr,
          level: null,
          creatureName: name,
          mobSize: !!prevMobs[id] ? clampInt(prevMobs[id].mobSize + 1) : 1,
        },
      };
    });
  };

  const filterCreatureNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(e.target.value);
  };


  return (
    <div className="mobs-selector">
      <h2>Creature Selector</h2>
      <input
        type="text"
        placeholder="search"
        value={filterQuery}
        onChange={filterCreatureNames}
        className="filter-input"
      />

      <div className="creatures-table">
        <div className="head row">
          <div className="datacell"></div>
          <div className="datacell">Name</div>
          <div className="datacell">CR</div>
          <div className="datacell">PEL</div>
        </div>
        {
        filteredCreatures.map((creature) => (
          <div
            className="row"
            key={`${creature.name}-${creature.cr}-${creature.id}`}
          >
            <div className="datacell">
              <button
                onClick={() => addToMobsList(creature)}
                className="increment-button"
              >
                +
              </button>
            </div>
            <div className="datacell name">{creature.name}</div>
            <div className="datacell">{formatCrAsFraction(creature.cr)}</div>
            <div className="datacell">
              {formatPowerLevelAsFraction(creature.cr)}
            </div>
          </div>
        ))
        }
       
      </div>
    </div>
  );
};
