import "./MobsSelector.css";

import { useContext, useState } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";
import { clampInt } from "../lib";
import { formatCrAsFraction, formatPowerLevelAsFraction } from "../domain";

import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export const MobsSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);

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
type RowProps = {index: number, style: React.CSSProperties}
  const Row = ({ index, style }: RowProps) => {
    const creature = filteredCreatures[index];
    return (
      <div style={style}>
        <tr key={`${creature.name}-${creature.cr}-${creature.id}`}>
          <td>
            <button
              onClick={() => addToMobsList(creature)}
              className="increment-button"
            >
              +
            </button>
          </td>
          <td>{creature.name}</td>
          <td>{formatCrAsFraction(creature.cr)}</td>
          <td>{formatPowerLevelAsFraction(creature.cr)}</td>
        </tr>
      </div>
    );
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
      <div className="table-container">
        <table className="creatures-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>CR</th>
              <th>PEL</th>
            </tr>
          </thead>
        </table>
        <div style={{ height: '400px', width: '100%' }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={filteredCreatures.length}
                itemSize={35}
                width={width}
              >
                {({ index, style }) => (
                  <table className="creatures-table" style={{ width: '100%' }}>
                    <tbody>
                      <Row index={index} style={style} />
                    </tbody>
                  </table>
                )}
              </List>
            )}
          </AutoSizer>
        </div>
      </div>
    </div>
  );
};
