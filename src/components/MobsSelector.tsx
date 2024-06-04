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
    rowHeights.current.clear(); // Clear heights when filtering
    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true); // Reset the list to recalculate row heights
    }
  };

  const getRowHeight = (index: number) => {
    return rowHeights.current.get(index) || 50;
  };

  type RowProps = { index: number; style: React.CSSProperties };
  const Row = ({ index, style }: RowProps) => {
    const creature = filteredCreatures[index];
    const rowRef = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
      if (rowRef.current) {
        const height = rowRef.current.getBoundingClientRect().height;
        rowHeights.current.set(index, height);
        if (listRef.current) {
          listRef.current.resetAfterIndex(index);
        }
      }
    }, [index]);

    return (
      <tr
        style={style}
        className={index % 2 ? "ListItemOdd" : "ListItemEven"}
        ref={rowRef}
        key={`${creature.name}-${creature.cr}-${creature.id}`}
      >
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


        <div style={{ height: "400px", width: "100%" }}>
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={listRef}
                height={height}
                itemCount={filteredCreatures.length}
                itemSize={getRowHeight}
                width={width}
              >
                {({ index, style }) => <Row index={index} style={style} />}
              </List>
            )}
          </AutoSizer>
        </div>

      </div>
    </div>
  );
};
