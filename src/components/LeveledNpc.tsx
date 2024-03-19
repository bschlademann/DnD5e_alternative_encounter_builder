import { useState } from "react";
import { getRange } from "../lib";

export type TLeveledNpc = { id: string; name: string; level: number };
export type LeveledNpcProps = {
  id: string;
  name: string;
  level: number;
};

export const LeveledNpc = ({ id, name, level }: LeveledNpcProps) => {
  const [leveledNpc, setLeveledNpc] = useState<TLeveledNpc>({
    id: `leveled-npc-${id}`,
    name,
    level,
  });

  const validLevels = getRange([1, 20]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = parseInt(e.target.value);
    setLeveledNpc((prevLeveledNpc) => {
      return { ...prevLeveledNpc, level: newLevel };
    });
  };

  const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setLeveledNpc((prevLeveledNpc) => {
      return { ...prevLeveledNpc, name: newName };
    });
  };

  const addToMobslist = (e: React.MouseEvent<HTMLButtonElement>) => {
    // add NPC to MobList
  };

  const addToParty = (e: React.MouseEvent<HTMLButtonElement>) => {
    // add NPC to Party
  };

  return (
    <>
      <label htmlFor="leveled-npc-name">name</label>
      <input
        type="text"
        name="leveled-npc-name"
        id="leveled-npc-name"
        value={leveledNpc.name}
        onChange={handelNameChange}
      />

      <label htmlFor="leveled-npc-level">level</label>
      <select id="leveled-npc-level" onChange={handleLevelChange}>
        {validLevels.map((validLevel) => (
          <option value={validLevel} key={`level-${validLevel}`}>
            {validLevel}
          </option>
        ))}
      </select>

      <button onClick={addToMobslist}>
        <s>add to Mobslist</s>
      </button>

      <button onClick={addToParty}>
        <s>add to Party</s>
      </button>
    </>
  );
};
