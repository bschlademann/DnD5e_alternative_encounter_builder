import { useContext, useState } from "react";
import { MobsContext, PartyCustomCreaturesContext } from "../contexts";
import { BaseCr, Level, crFractionsByFloats } from "../domain";
import {
  powerLevelByCharacterLevel,
  powerLevelByCr,
} from "../power-level-data";
import { invertStringKeysAndValues } from "../lib";

import "./CustomCreature.css";

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
    <div className="custom-creature">
      <h2>Add a custom Creature</h2>
      <div className="wrapper">
        <label htmlFor="leveled-npc-name">name</label>
        <input
          type="text"
          name="leveled-npc-name"
          id="leveled-npc-name"
          placeholder="name your creature"
          value={name}
          onChange={handelNameChange}
        />
      </div>
      <div className="wrapper">
        <label htmlFor="custom-creature-level">level</label>
        <select id="custom-creature-level" onChange={handleLevelChange}>
          {getLevelOptionValues().map((level) => (
            <option value={level} key={`level-${level}`}>
              {level}
            </option>
          ))}
        </select>
      </div>

      <div className="wrapper">
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
      </div>

      <div className="add-to-list-buttons wrapper">
        <div className="button left-shield" onClick={addToMobslist}>
          <p className="overlay-text">add to Creatures</p>
          <img src={`${import.meta.env.BASE_URL}png/shield_left.png`} alt="" />
        </div>
        <div className="button right-shield" onClick={addToParty}>
          <p className="overlay-text">add to Party</p>
          <img src={`${import.meta.env.BASE_URL}png/shield_right.png`} alt="" />
        </div>
      </div>
    </div>
  );
};
