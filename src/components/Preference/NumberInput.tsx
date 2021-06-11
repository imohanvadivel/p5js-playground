import React from "react";

interface Props {
  min: number;
  max: number;
  step: number;
  value: number;
  onInput: (t: number) => void;
}

const NumberInput: React.FC<Props> = ({ min, value, max, step, onInput }) => {
  return (
    <div className="num-input">
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          onInput(+e.target.value);
        }}
      />
    </div>
  );
};

export default NumberInput;
