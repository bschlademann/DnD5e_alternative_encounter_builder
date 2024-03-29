import { useContext, useState } from "react";
import { Creature } from "../5etools";
import { CreatureContext, MobsContext } from "../contexts";
import { clampInt } from "../lib";

export const MobsSelector = () => {
  const [filterQuery, setFilterQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const creatures = useContext(CreatureContext);
  const [mobs, setMobs] = useContext(MobsContext);

  const sortCreatures = (a: { cr: number; name: string; }, b: { cr: number; name: string; }) => {
    if (sortField === 'cr') {
      if (a.cr === b.cr) {
        // Sub-sort by name if 'cr' is the same
        return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDirection === 'asc' ? a.cr - b.cr : b.cr - a.cr;
    }

    // Default to name sorting
    return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
  };

  const filteredCreatures = creatures
    .filter((creature) => creature.name.toLowerCase().includes(filterQuery.toLowerCase()))
    .sort(sortCreatures);

  const addToMobsList = (creature: Creature) => {
    setMobs((prevMobs) => ({
      ...prevMobs,
      [creature.id]: {
        creatureName: creature.name,
        mobSize: !!prevMobs[creature.id]
          ? clampInt(prevMobs[creature.id].mobSize + 1)
          : 1,
      },
    }));
  };

  const filterCreatureNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterQuery(e.target.value);
  };

  const handleSort = (field: string) => {
    const isSameField = sortField === field;
    const newDirection = isSameField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const renderSortIndicator = (field: string) => {
    return sortField === field ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
  };

  return (
    <div className="mobs-selector">
      <input
        type="text"
        placeholder="Enter creature name"
        value={filterQuery}
        onChange={filterCreatureNames}
        className="filter-input"
      />
      <table className="creatures-table">
        <thead>
          <tr>
            <th></th>
            <th>
              <button onClick={() => handleSort('name')} className="sort-button">
                Name{renderSortIndicator('name')}
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('cr')} className="sort-button">
                CR{renderSortIndicator('cr')}
              </button>
            </th>
            <th>
              PEL
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredCreatures.map((creature) => (
            <tr key={`${creature.name}-${creature.cr}-${creature.id}`}>
              <td>
                <button onClick={() => addToMobsList(creature)} className="increment-button">+</button>
              </td>
              <td>{creature.name}</td>
              <td>{creature.cr}</td>
              <td>{creature.powerLevel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
