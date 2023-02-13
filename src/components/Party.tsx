import React, { createContext, useContext } from "react";
import { getRange } from "../lib";

const Option = (props: { value: number }) => {
  const { value } = props;
  return <option value={value}>{value}</option>;
};
export type Party = { count: number; level: number };

export type PartyProps = {
  party: Party;
  setParty: React.Dispatch<React.SetStateAction<Party>>;
};

export const PartyContext = createContext<
  [Party, React.Dispatch<React.SetStateAction<Party>>]
>([{ count: 1, level: 1 }, () => undefined]);

export const Party = () => {
  const [party, setParty] = useContext(PartyContext);
  const onChangeCount = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParty((prevState) => {
        return { ...prevState, count: parseInt(e.target.value) };
      });
    },
    []
  );

  const onChangeLevel = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setParty((prevState) => {
        return { ...prevState, level: parseInt(e.target.value) };
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
          <Option value={value} key={`count-${value}`} />
        ))}
      </select>

      <label htmlFor="character-level">number of characters</label>
      <select id="character-count" value={party.level} onChange={onChangeLevel}>
        {validLevels.map((value) => (
          <Option value={value} key={`level-${value}`} />
        ))}
      </select>
    </div>
  );
};
