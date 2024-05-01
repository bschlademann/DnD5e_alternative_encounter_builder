import { useState } from "react";
import useDebounce from "react-use/lib/useDebounce";

export const Input = ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const [internalValue, setInternalValue] = useState<string>(value);
  
    const [] = useDebounce(() => onChange(value), 150, [value]);
    return (
      <input
        value={internalValue}
        type="text"
        onChange={(event) => setInternalValue(event.target.value)}
      />
    );
  };