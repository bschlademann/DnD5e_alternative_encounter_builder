import { createContext, useContext, useState } from "react";
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
  const validCounts = getRange([1, 12]);
  const validLevels = getRange([1, 20]);
  return (
    <div className="party">
      <label htmlFor="character-count">number of characters</label>
      <select
        id="character-count"
        value={party.count}
        onChange={(e) =>
          setParty((prevState) => {
            return { ...prevState, count: parseInt(e.target.value) };
          })
        }
      >
        {validCounts.map((value) => (
          <Option value={value} key={value} />
        ))}
      </select>

      <label htmlFor="character-level">number of characters</label>
      <select
        id="character-count"
        value={party.level}
        onChange={(e) =>
          setParty((prevState) => {
            return { ...prevState, level: parseInt(e.target.value) };
          })
        }
      >
        {validLevels.map((value) => (
          <Option value={value} key={value} />
        ))}
      </select>
    </div>
  );
};
