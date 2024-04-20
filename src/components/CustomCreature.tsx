import { useContext, useState } from "react";
import { MobsContext, PartyContext } from "../contexts";
import {
  BaseCr,
  Level,
  crFractionsByFloats,
  getPowerLevelByCharacterLevel,
} from "../domain";
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
  const [party, setParty] = useContext(PartyContext);
  const [baseCr, setBaseCr] = useState<BaseCr>(null);

  
  const getLevelOptionValues = () => {
    return ["-", ...Object.keys(powerLevelByCharacterLevel)];
  };

  const crFloatsByFractions = invertStringKeysAndValues(crFractionsByFloats);

  // const getCrOptionValues = () => {
  //   const crOptionValues = Object.keys(powerLevelByCr).filter(
  //     (cr) => parseFloat(cr) % 1 === 0
  //   );
  //   crOptionValues.unshift("-");
  //   crOptionValues.splice(2, 0, ...Object.values(crFractionsByFloats));
  //   return crOptionValues;
  // };

  const getCrOptionValues = () => {
    const integerCrValues = Object.keys(powerLevelByCr)
      .filter(cr => parseFloat(cr) % 1 === 0);
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
    // const powerLevel = getPowerLevelByCharacterLevel(level);
    setMobs((prevMobs) => ({
      ...prevMobs,
      [id]: { creatureName: name, mobSize: 1, level, baseCr },
    }));
  };

  const addToParty = () => {

    // add NPC to Party
    type TParty = {
      count: number;
      level: number;
      customCreatures: {
        [creatureId: string]: {
          creatureName: string;
          mobSize: number;
          level: number| null;
          baseCr: number | null;
        };
      };
    }

    // FIXME: rename powerLevel in MobsState to PowerLevelFromCharacterLevel? or change the way it works?
    // is it better to have a level and a cr in there instead of a powerlevel?
    const id = getNextCustomCreatureId();
    // FIXME: the whole idea is that a custom creature can have only a cr, only a level or both -> level must be number | null
    // const powerLevel =
    // setParty(prevParty => ({...prevParty, customCreatures[id]: { creatureName: name, mobSize: 1, powerLevel, baseCr }}))
    
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

      <button onClick={addToParty}>
        <s>add to Party</s>
      </button>
    </>
  );
};
