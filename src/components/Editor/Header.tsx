import React, { Dispatch, useState } from "react";
import Preference from "../Preference/Preference";
import { editorOptions } from "./TsEditor";
import * as Icons from "../Preference/Icons";

interface Props {
  runCode: () => void;
  editorOptions: editorOptions;
  setEditorOptions: Dispatch<React.SetStateAction<editorOptions>>;
  isRunning: boolean;
  setIsRunning: Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<Props> = ({
  runCode,
  editorOptions,
  setEditorOptions,
  isRunning,
  setIsRunning,
}) => {
  const [prefActive, setPrefActive] = useState(false);

  return (
    <header className="flex-h center">
      <div className="lhs flex-h center">
        <div className="file-name flex-h center">
          {editorOptions.typescript
            ? Icons.typescrip_logo()
            : Icons.javascript_logo()}
          <span className="sketch hd">Sketch</span>
        </div>
      </div>

      <div className="rhs flex-h center">
        {/* ICON: Refresh -------------- */}
        {isRunning &&
          (!editorOptions.autoRefresh.enabled ? (
            <div title="Refresh Code" className="refresh icn" onClick={runCode}>
              {Icons.refresh()}
            </div>
          ) : (
            <div className="auto-refresh icn">{Icons.autoRefresh()}</div>
          ))}

        {/* ICON: Run -------------- */}
        <div
          className="run icn flex-h center"
          onClick={() => setIsRunning((prev) => !prev)}>
          {isRunning ? (
            <>
              {Icons.stop()}
              <span>Stop</span>
            </>
          ) : (
            <>
              {Icons.run()}
              <span>Run</span>
            </>
          )}
        </div>

        {/* ICON: More -------------- */}
        <div
          title="More Option"
          className={prefActive ? "more active icn" : "more icn"}
          onClick={() => setPrefActive((prev) => !prev)}>
          {Icons.more()}
        </div>
      </div>

      {prefActive && (
        <Preference
          setPrefActive={setPrefActive}
          editorOptions={editorOptions}
          setEditorOptions={setEditorOptions}
        />
      )}
    </header>
  );
};

export default Header;
