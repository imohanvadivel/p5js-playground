import React, { Dispatch, useEffect, useRef, useState } from "react";
import TsEditor, { dimension, editorOptions } from "./TsEditor";
import Console from "./Console";
import Header from "./Header";

interface Props {
  setSketchCode: Dispatch<React.SetStateAction<string>>;
  stopRender: boolean;
  isRunning: boolean;
  setIsRunning: Dispatch<React.SetStateAction<boolean>>;
  setStopRender: Dispatch<React.SetStateAction<boolean>>;
}

const Editor: React.FC<Props> = ({
  setSketchCode,
  isRunning,
  setIsRunning,
}) => {
  const col_resizer = useRef<HTMLDivElement>();
  const row_resizer = useRef<HTMLDivElement>();
  const [editorOptions, setEditorOptions] = useState<editorOptions>(
    defaultEditorOptions()
  );
  const [editorDimension, setEditorDimension] = useState<dimension>({
    width: getInitialEditorWidth(),
    height: getEditorHeight({ initialHeight: true }) - 2,
  });
  const [error, setError] = useState<consoleError | null>();
  const [runId, setRunId] = useState(1);

  const runCode = () => {
    setSketchCode("");
    setRunId((prevId) => prevId + 1);
    setError(null);
  };

  function getEditorHeight(opt?: { initialHeight: boolean }) {
    let defaultFontSize = +getComputedStyle(
      document.querySelector("html")
    ).fontSize.replace("px", "");
    let consoleHeight: number;

    if (opt && "initialHeight" in opt && opt.initialHeight) {
      consoleHeight = 2.5 * defaultFontSize;
    } else {
      consoleHeight = +document
        .querySelector("body")
        .style.getPropertyValue("--consoleHeight")
        .replace("px", "");
    }

    return window.innerHeight - (4 * defaultFontSize + consoleHeight);
  }

  function getInitialEditorWidth() {
    let vw = window.innerWidth;
    return vw > 550 ? 550 : vw;
  }

  // Setting initial editor Dimension
  useEffect(() => {
    let height = getEditorHeight({ initialHeight: true });
    let width = getInitialEditorWidth();

    setEditorDimension(() => {
      return {
        height,
        width,
      };
    });
  }, []);

  // Resizing Column
  useEffect(() => {
    if (!col_resizer.current) return;
    col_resizer.current.addEventListener("mousedown", handleMouseDrag);
    col_resizer.current.addEventListener("mouseenter", addColHover);
    col_resizer.current.addEventListener("mouseleave", removeColHover);

    let editorHeight: number;

    function handleMouseDrag(mouseDownEvent) {
      mouseDownEvent.preventDefault();

      // iframe prevents mousemove event
      // @ts-ignore
      document.querySelector("#rhs").style.pointerEvents = "none";
      const { height } = document
        .querySelector("#ts-editor")
        .getBoundingClientRect();
      editorHeight = height;

      window.addEventListener("mouseup", stopListener);
      window.addEventListener("mousemove", handleDrage);
    }

    function handleDrage(e) {
      e.preventDefault();
      document
        .querySelector("body")
        .style.setProperty("--editorWidth", `${e.clientX}px`);
      setEditorDimension((prev) => {
        return {
          width: e.clientX,
          height: editorHeight,
        };
      });
    }

    function stopListener() {
      window.removeEventListener("mousemove", handleDrage);
      window.removeEventListener("mouseup", stopListener);
      // @ts-ignore
      document.querySelector("#rhs").style.pointerEvents = "auto";
    }

    function addColHover() {
      document.querySelector("#editor").classList.add("resize");
    }
    function removeColHover() {
      document.querySelector("#editor").classList.remove("resize");
    }

    return () => {
      col_resizer.current.removeEventListener("mousedown", handleMouseDrag);
      col_resizer.current.removeEventListener("mouseenter", addColHover);
      col_resizer.current.removeEventListener("mouseleave", removeColHover);
    };
  }, []);

  // Resizing Row
  useEffect(() => {
    if (!row_resizer.current) return;
    row_resizer.current.addEventListener("mousedown", handleMouseDrag);
    row_resizer.current.addEventListener("mouseenter", addRowHover);
    row_resizer.current.addEventListener("mouseleave", removeRowHover);

    let editorWidth: number;
    let headerHeight: number;
    let vh: number;
    let body = document.querySelector("body");

    function handleMouseDrag(mouseDownEvent) {
      mouseDownEvent.preventDefault();
      vh = window.innerHeight;
      const { width } = document
        .querySelector("#ts-editor")
        .getBoundingClientRect();
      const { height } = document
        .querySelector("#editor header")
        .getBoundingClientRect();
      editorWidth = width;
      headerHeight = height;

      window.addEventListener("mouseup", stopListener);
      window.addEventListener("mousemove", handleDrage);
    }

    function handleDrage(e) {
      e.preventDefault();

      let consoleHeight = vh - e.clientY;

      if (consoleHeight > 30 && consoleHeight < 350) {
        setEditorDimension((prev) => {
          return {
            width: editorWidth,
            height: e.clientY - headerHeight,
          };
        });
      }

      if (consoleHeight < 30) consoleHeight = 30;
      if (consoleHeight > 350) consoleHeight = 350;

      body.style.setProperty("--consoleHeight", `${consoleHeight}px`);
    }

    function stopListener() {
      window.removeEventListener("mousemove", handleDrage);
      window.removeEventListener("mouseup", stopListener);
    }

    function addRowHover() {
      document.querySelector("#ts-editor").classList.add("resize");
    }

    function removeRowHover() {
      document.querySelector("#ts-editor").classList.remove("resize");
    }

    return () => {
      row_resizer.current.removeEventListener("mousedown", handleMouseDrag);
      row_resizer.current.removeEventListener("mouseenter", addRowHover);
      row_resizer.current.removeEventListener("mouseleave", removeRowHover);
    };
  }, []);

  // Viewport resize handling
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    let temp: number;

    function handleResize(e) {
      e.preventDefault();

      // Vertical Viewport Resize
      if (!temp) {
        temp = window.innerHeight;
      } else {
        if (temp !== window.innerHeight) {
          temp = window.innerHeight;
          let height = getEditorHeight();
          setEditorDimension((prev) => {
            return {
              width: prev.width,
              height,
            };
          });
        }
      }
    }

    return () => document.removeEventListener("resize", handleResize);
  }, []);

  // Handling Dark mode
  useEffect(() => {
    let label = localStorage.getItem("p5-darkMode");
    if (label && label == "false") {
      document.querySelector(":root").classList.remove("dark");
      setEditorOptions((prev) => {
        return {
          ...prev,
          theme: "light",
        };
      });
    } else if (label == "true") {
      document.querySelector(":root").classList.add("dark");
      setEditorOptions((prev) => {
        return {
          ...prev,
          theme: "dark",
        };
      });
    } else {
      localStorage.setItem("p5-darkMode", "false");
    }
  }, []);

  return (
    <section id={"editor"}>
      <Header
        runCode={runCode}
        editorOptions={editorOptions}
        setEditorOptions={setEditorOptions}
        isRunning={isRunning}
        setIsRunning={setIsRunning}
      />

      <TsEditor
        isRunning={isRunning}
        setIsRunning={setIsRunning}
        editorOptions={editorOptions}
        setError={setError}
        editorDimension={editorDimension}
        setSketchCode={setSketchCode}
        runId={runId}
        runCode={runCode}
      />

      <Console setIsRunning={setIsRunning} error={error} setError={setError} />

      <div className="column-resizer" ref={col_resizer}></div>
      <div className="row-resizer" ref={row_resizer}></div>
    </section>
  );
};

export default Editor;

function defaultEditorOptions() {
  let opt: editorOptions = {
    fontSize: 12,
    fontLigatures: true,
    formatOnPaste: true,
    lineNumbers: "on",
    autoRefresh: {
      enabled: false,
      delay: 800,
    },
    typescript: true,
    hover: {
      enabled: true,
    },
    lightbulb: {
      enabled: true,
    },
    insertSpaces: false,
    theme: "light",
    wordWrap: "on",
    minimap: {
      enabled: false,
    },
    quickSuggestions: {
      enabled: true,
      delay: 100,
    },
    renderIndentGuides: true,
    renderWhiteSpace: "boundary",
    tabSize: 2,
  };

  return opt;
}

export type consoleError = {
  message: string;
};
