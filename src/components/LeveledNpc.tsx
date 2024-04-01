import { useContext, useState } from "react";
import { getRange } from "../lib";
import { MobsContext } from "../contexts";
import { getPowerLevelByCharacterLevel, getPowerLevelByCr } from "../domain";

export type TLeveledNpc = { name: string; level: number };
export type NpcById = { [id: string]: TLeveledNpc };
export type LeveledNpcProps = {
  id: string;
  name: string;
  level: number;
};

export const LeveledNpc = () => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(1);
  const [lastId, setId] = useState(0);
  const [mobs, setMobs] = useContext(MobsContext);

  const validLevels = getRange([1, 20]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = parseInt(e.target.value);
    setLevel(newLevel);
  };

  const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
  };

  const getNextLeveledNpcId = () => {
    const id = lastId + 1;
    setId(id);
    return `leveled-npc-${id}`;
  };

  const addToMobslist = () => {
    const id = getNextLeveledNpcId();
    const powerLevel = getPowerLevelByCharacterLevel(level);
    setMobs((prevMobs) => ({
      ...prevMobs,
      [id]: { creatureName: name, mobSize: 1, powerLevel },
    }));
  };

  const addToParty = () => {
    // add NPC to Party
  };

  return (
    <>
      <label htmlFor="leveled-npc-name">name</label>
      <input
        type="text"
        name="leveled-npc-name"
        id="leveled-npc-name"
        value={name}
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

      <button onClick={addToMobslist}>add to Mobslist</button>

      <button onClick={addToParty}>
        <s>add to Party</s>
      </button>
    </>
  );
};
