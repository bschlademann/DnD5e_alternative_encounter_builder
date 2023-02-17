import React, { useContext } from "react";
import { LeveledNpcsContext } from "../contexts";

import { getRange } from "../lib";

const Option = (props: { value: number }) => {
  const { value } = props;
  return <option value={value}>{value}</option>;
};
export type LeveledNpcs = { level: number }[];

export const LeveledNpcs = () => {
  const [leveledNpcs, setLeveledNpcs] = useContext(LeveledNpcsContext);

  const onChangeLevel = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setLeveledNpcs((prevLeveledNpcs) => {
        return { ...prevLeveledNpcs, level: parseInt(e.target.value) };
      });
    },
    []
  );

  const validLevels = getRange([1, 20]);
  return (
    <div className="leveled-npcs">
      <label htmlFor="leveled-npc-level">level of leveled NPC</label>
      <select id="leveled-npc-level" value={leveledNpcs} onChange={onChangeCount}>
        {validCounts.map((value) => (
          <Option value={value} key={`count-${value}`} />
        ))}
      </select>
    </div>
  );
};
