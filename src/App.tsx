import React, { useState } from "react";
import Editor from "./components/Editor/Editor";
import Canvas from "./components/Canvas";

const App: React.FC = () => {
  const [sketchCode, setSketchCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [stopRender, setStopRender] = useState(false);

  return (
    <>
      <div id="wrapper">
        <Editor
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          setSketchCode={setSketchCode}
          stopRender={stopRender}
          setStopRender={setStopRender}
        />
        <Canvas sketchCode={isRunning ? sketchCode : ""} />
      </div>
      <div className="toast">
        <div className="msg"></div>
      </div>
    </>
  );
};

export default App;
