import { useState } from "react";
import useDebounce from "react-use/lib/useDebounce";

export const DebounceInput = ({
    value,
    onChange,
    delay = 150,
  }: {
    value: string;
    onChange: (value: string) => void;
    delay?: number
  }) => {
    const [internalValue, setInternalValue] = useState<string>(value);
  
    const [] = useDebounce(() => onChange(value), delay, [value]);
    return (
      <input
        value={internalValue}
        type="text"
        onChange={(event) => setInternalValue(event.target.value)}
      />
    );
  };