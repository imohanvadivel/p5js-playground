import React from "react";
import { whiteSpace } from "../Editor/TsEditor";

interface Props {
  options: any;
  value: string;
  onChg: (type: whiteSpace) => void;
}

const SelectInput: React.FC<Props> = ({ options, value, onChg }) => {
  return (
    <div>
      {/* @ts-ignore */}
      <select value={value} onChange={(e) => onChg(e.target.value)}>
        {Object.keys(options).map((e) => (
          <option key={e} value={e}>
            {options[e]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectInput;
