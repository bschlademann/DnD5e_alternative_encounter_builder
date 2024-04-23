import { useContext, useState } from "react";
import { MobsContext, PartyCustomCreaturesContext } from "../contexts";
import { BaseCr, Level, crFractionsByFloats } from "../domain";
import {
  powerLevelByCharacterLevel,
  powerLevelByCr,
} from "../power-level-data";
import { invertStringKeysAndValues } from "../lib";

export const CustomCreature = () => {
  const [name, setName] = useState("");
  const [level, setLevel] = useState<Level>(null);
  const [lastId, setId] = useState(0);
  const [mobs, setMobs] = useContext(MobsContext);
  const [partyCustomCreatures, setPartyCustomCreatures] = useContext(
    PartyCustomCreaturesContext
  );
  const [baseCr, setBaseCr] = useState<BaseCr>(null);

  const getLevelOptionValues = () => {
    return ["-", ...Object.keys(powerLevelByCharacterLevel)];
  };

  const crFloatsByFractions = invertStringKeysAndValues(crFractionsByFloats);

  const getCrOptionValues = () => {
    const integerCrValues = Object.keys(powerLevelByCr).filter(
      (cr) => parseFloat(cr) % 1 === 0
    );
    return ["-", ...Object.values(crFractionsByFloats), ...integerCrValues];
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
    const parsedValue = parseInt(e.target.value);
    const newLevel = isNaN(parsedValue) ? null : parsedValue;
    setLevel(newLevel);
  };

  const handleBaseCrChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parsedValue = parseFloat(e.target.value);
    const newBaseCr = isNaN(parsedValue) ? null : parsedValue;
    setBaseCr(newBaseCr);
  };

  const handelNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
  };

  const getNextCustomCreatureId = () => {
    const id = lastId + 1;
    setId(id);
    return `leveled-npc-${id}`;
  };

  const addToMobslist = () => {
    const id = getNextCustomCreatureId();
    setMobs((prevMobs) => ({
      ...prevMobs,
      [id]: { creatureName: name, mobSize: 1, level, baseCr },
    }));
  };

  const addToParty = () => {
    const id = getNextCustomCreatureId();
    setPartyCustomCreatures((prevPartyCustomCreatures) => ({
      ...prevPartyCustomCreatures,
      [id]: { creatureName: name, mobSize: 1, level, baseCr },
    }));
  };

  return (
    <>
      <h2>Add a custom Creature</h2>
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
        {getLevelOptionValues().map((level) => (
          <option value={level} key={`level-${level}`}>
            {level}
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
      <button onClick={addToMobslist}>add to Mobs List</button>

      <button onClick={addToParty}>add to Party</button>
    </>
  );
};
