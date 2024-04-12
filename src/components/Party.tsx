import React, { useContext } from "react";
import { PartyContext } from "../contexts";
import { getRange } from "../lib";

const Option = (props: { value: number }) => {
  const { value } = props;
  return <option value={value}>{value}</option>;
};


// export type TLeveledNpc = { name: string; level: number };
// export type NpcById = { [id: string]: TLeveledNpc };
// export type LeveledNpcProps = {
//   id: string;
//   name: string;
//   level: number;
// };

export type CustomCreature = {level: number | "", cr: number | "", mobSize: number}

export type TParty = { count: number; level: number; customCreature: CustomCreature[]};

export const Party = () => {
  const [party, setParty] = useContext(PartyContext);
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

  const validCounts = getRange([1, 12]);
  const validLevels = getRange([1, 20]);
  return (
    <div className="party">
      <label htmlFor="character-count">number of characters</label>
      <select id="character-count" value={party.count} onChange={onChangeCount}>
        {validCounts.map((value) => (
          <Option value={value} key={`character-count-${value}`} />
        ))}
      </select>

      <label htmlFor="character-level">level</label>
      <select id="character-level" value={party.level} onChange={onChangeLevel}>
        {validLevels.map((value) => (
          <Option value={value} key={`character-level-${value}`} />
        ))}
      </select>
    </div>
  );
};
