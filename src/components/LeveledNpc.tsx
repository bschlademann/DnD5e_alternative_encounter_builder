import { useContext, useState } from "react";
import { MobsContext } from "../contexts";
import { BaseCr, crFractionsByFloats, getPowerLevelByCharacterLevel } from "../domain";
import {
  powerLevelByCharacterLevel,
  powerLevelByCr,
} from "../power-level-data";
import { invertStringKeysAndValues } from "../lib";

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
  const [baseCr, setBaseCr] = useState<BaseCr>(null);

  const validLevels = Object.keys(powerLevelByCharacterLevel).map((cr) =>
    parseFloat(cr)
  );

  const crFloatsByFractions = invertStringKeysAndValues(crFractionsByFloats);

  const getCrOptionValues = () => {
    const crOptionValues = Object.keys(powerLevelByCr).filter(
      (cr) => parseFloat(cr) % 1 === 0
    );
    crOptionValues.unshift("-");
    crOptionValues.splice(2, 0, ...Object.values(crFractionsByFloats));
    return crOptionValues;
  };

  const getValidCrSelectValue = (validCr: string | number): string => {
    if (validCr === "-") return "";

    const floatStr =
      typeof validCr === "string"
        ? crFloatsByFractions[validCr] || validCr
        : validCr.toString();

    return !isNaN(parseFloat(floatStr)) ? floatStr : "";
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLevel = parseInt(e.target.value);
    setLevel(newLevel);
  };

  const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
  };

  const handleBaseCrChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parsedValue = parseFloat(e.target.value);
    const newBaseCr = isNaN(parsedValue) ? null : parsedValue;
    setBaseCr(newBaseCr);
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
      [id]: { creatureName: name, mobSize: 1, powerLevel, baseCr },
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

      <label htmlFor="leveled-npc-base-creature-cr">base creature CR</label>
      <select
        name=""
        id="leveled-npc-base-creature-cr"
        onChange={handleBaseCrChange}
      >
        {getCrOptionValues().map((validCr) => (
          <option
            value={getValidCrSelectValue(validCr)}
            key={`valid-cr-${validCr}`}
          >
            {validCr}
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
