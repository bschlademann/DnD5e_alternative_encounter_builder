import React, { useContext } from "react";
import { PartyContext, PartyCustomCreaturesContext } from "../contexts";
import { getRange } from "../lib";
import { getPartyPowerLevel } from "../domain";
import { MobsList } from "./MobsList";

export type TParty = {
  count: number;
  level: number;
};

export const Party = () => {
  const [party, setParty] = useContext(PartyContext);
  const [partyCustomCreatures] = useContext(PartyCustomCreaturesContext);
  const onChangeCount = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParty((prevParty) => {
        return { ...prevParty, count: parseInt(e.target.value) };
      });
    },
    []
  );

  const onChangeLevel = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParty((prevParty) => {
        return { ...prevParty, level: parseInt(e.target.value) };
      });
    },
    []
  );

  const partyHasCustomCreatures =
    Object.keys(partyCustomCreatures).length !== 0;

  const validCounts = getRange([1, 12]);
  const validLevels = getRange([1, 20]);
  return (
    <div className="party">
      <h2>Party</h2>
      <label htmlFor="character-count">number of characters</label>
      <select id="character-count" value={party.count} onChange={onChangeCount}>
        {validCounts.map((value) => (
          <option value={value} key={`character-count-${value}`}>
            {value}
          </option>
        ))}
      </select>

      <label htmlFor="character-level">level</label>
      <select id="character-level" value={party.level} onChange={onChangeLevel}>
        {validLevels.map((value) => (
          <option value={value} key={`character-level-${value}`}>
            {value}
          </option>
        ))}
      </select>

      {partyHasCustomCreatures ? (
        <MobsList
          title={"Custom Creatures in Party"}
          context={"PartyCustomCreatureContext"}
        />
      ) : null}

      <div>Party total PEL: {getPartyPowerLevel()}</div>
    </div>
  );
};
