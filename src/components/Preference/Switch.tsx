import React from "react";

interface Props {
  val: crazy;
  onToggle: () => void;
}

type crazy = boolean | "light" | "dark" | "on" | "off" | "boundary" | "none";

const Switch: React.FC<Props> = ({ val, onToggle }) => {
  let value: boolean;

  if (val === true || val === false) {
    value = val;
  } else {
    if (val === "dark" || val === "boundary" || val === "on") {
      value = true;
    } else {
      value = false;
    }
  }

  return (
    <div className={value ? "active switch" : " switch"}>
      <input type="checkbox" defaultChecked={value} onChange={onToggle} />
      <div className="thumb"></div>
    </div>
  );
};

export default Switch;
