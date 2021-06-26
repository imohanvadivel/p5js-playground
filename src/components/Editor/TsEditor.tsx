import React, { Dispatch, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { type } from "./p5Types";
import { consoleError } from "./Editor";
import useToast from "../useToast";

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === "typescript" || label === "javascript") {
      return "./dist/ts.worker.js";
    }
    return "./dist/editor.worker.js";
  },
};

interface Props {
  setSketchCode: (code: string) => void;
  editorOptions: editorOptions;
  editorDimension: dimension;
  runId: number;
  runCode: () => void;
  isRunning: boolean;
  setIsRunning: Dispatch<React.SetStateAction<boolean>>;
  setError: Dispatch<React.SetStateAction<consoleError>>;
}

const TsEditor: React.FC<Props> = ({
  setSketchCode,
  editorOptions,
  editorDimension,
  runId,
  runCode,
  isRunning,
  setIsRunning,
  setError,
}) => {
  let editor = useRef<monaco.editor.IStandaloneCodeEditor>();
  let container = useRef<HTMLDivElement>(null);
  let [changeId, setChangeId] = useState(1);
  let localRunId = useRef(1);
  let localCode = useRef("");

  // Creating a Typescript Editor
  useEffect(() => {
    if (!container.current) return;

    let p5type =
      monaco.languages.typescript.typescriptDefaults.addExtraLib(type);

    // Light Theme
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [{ token: "", foreground: "000000", background: "ffffff" }],
      colors: {
        ["editor.background"]: "#ffffff",
        ["editor.foreground"]: "#000000",
        ["editorLineNumber.foreground"]: "#00000050",
        ["editor.lineHighlightBorder"]: "#00000000",
        ["editorBracketMatch.border"]: "#00000000",
        ["editorBracketMatch.background"]: "#1871E940",
      },
    });

    // Dark Theme
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "", foreground: "DDDDDD", background: "191919" }],
      colors: {
        ["editor.background"]: "#191919",
        ["editor.foreground"]: "#DDDDDD",
        ["editorLineNumber.foreground"]: "#ffffff50",
        ["editor.lineHighlightBorder"]: "#00000000",
        ["editorBracketMatch.border"]: "#00000000",
        ["editorBracketMatch.background"]: "#12C05B50",
      },
    });

    editor.current = monaco.editor.create(container.current, {
      value: `let x = 0;
let y = 0;
let spacing = 20;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  stroke(255);
  if (random(1) < 0.5) {
    line(x, y, x + spacing, y + spacing);
  } else {
    line(x, y + spacing, x + spacing, y);
  }
  x = x + spacing;
  if (x > width) {
    x = 0;
    y = y + spacing;
  }
}

`,
      language: "javascript",
      scrollbar: {
        verticalScrollbarSize: 5,
        horizontalScrollbarSize: 5,
      },
      fontWeight: "400",
      fontFamily:
        "SF Mono,Roboto Mono var, Roboto Mono, melano, Monaco, monospace",
    });

    editor.current.getModel().onDidChangeContent(() => {
      localCode.current = editor.current.getModel().getValue();
      setChangeId((prev) => prev + 1);
    });

    editor.current.setPosition({ lineNumber: 10, column: 17 });

    return () => {
      editor.current.dispose();
      p5type.dispose();
    };
  }, []);

  // Switching Language
  useEffect(() => {
    let model = editor.current.getModel();
    let language = editorOptions.typescript ? "typescript" : "javascript";
    monaco.editor.setModelLanguage(model, language);
  }, [editorOptions.typescript]);

  // Running code when clicking run & Refresh Icon
  useEffect(() => {
    if (runId !== localRunId.current) {
      localRunId.current = runId;
      execute();
      return;
    }
    if (isRunning) execute();

    function execute() {
      if (editorOptions.typescript) {
        let model = editor.current.getModel();

        monaco.languages.typescript.getTypeScriptWorker().then((worker) => {
          worker(model.uri).then((client) => {
            client.getEmitOutput(model.uri.toString()).then((js) => {
              setError(null);
              setSketchCode(js.outputFiles[0].text);
            });
          });
        });
      } else {
        setError(null);
        setSketchCode(localCode.current);
      }
    }
  }, [isRunning, runId]);

  // AutoRefresh handling
  useEffect(() => {
    if (!editorOptions.autoRefresh.enabled) return;
    if (!isRunning) return;

    let timeOutId = setTimeout(
      () => runCode(),
      editorOptions.autoRefresh.delay
    );

    return () => {
      clearTimeout(timeOutId);
    };
  }, [changeId]);

  // Updating Editor Dimension
  useEffect(() => {
    editor.current.layout({
      width: editorDimension.width - 3,
      height: editorDimension.height - 2,
    });
  }, [editorDimension]);

  // Updating Editor options
  useEffect(() => {
    editor.current.updateOptions({
      lineNumbersMinChars: 3,
      lineDecorationsWidth: 0,
      showDeprecated: true,
      multiCursorModifier: "ctrlCmd",
      minimap: {
        enabled: editorOptions.minimap.enabled,
      },
      theme: editorOptions.theme,
      insertSpaces: editorOptions.insertSpaces,
      fontLigatures: editorOptions.fontLigatures,
      lineNumbers: editorOptions.lineNumbers,
      wordWrap: editorOptions.wordWrap,
      renderIndentGuides: editorOptions.renderIndentGuides,
      renderWhitespace: editorOptions.renderWhiteSpace,
      fontSize: editorOptions.fontSize,
      tabSize: editorOptions.tabSize,
      hover: {
        enabled: editorOptions.hover.enabled,
      },
      lightbulb: {
        enabled: editorOptions.lightbulb.enabled,
      },
      formatOnPaste: editorOptions.formatOnPaste,
      quickSuggestions: editorOptions.quickSuggestions.enabled,
      quickSuggestionsDelay: editorOptions.quickSuggestions.delay,
    });
  }, [editorOptions]);

  // Drag & Drop Functionality
  useEffect(() => {
    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragleave", handleDragLeave);
    document.addEventListener("drop", handleDrop);

    function handleDragOver(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    function handleDragLeave(event) {
      event.preventDefault();
      event.stopPropagation();
    }

    function handleDrop(event) {
      event.preventDefault();
      event.stopPropagation();

      let file = event.dataTransfer.files[0];
      let name = file.name;

      if (!/.*?.(js|ts)/.test(name)) {
        useToast(`Only &nbsp;.js  &nbsp;.ts files are supported`);
        return;
      }
      let reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        setIsRunning(false);
        // @ts-ignore
        editor.current.setValue(reader.result);
        // setLocalCode(reader.result);
      };
    }

    return () => {
      document.removeEventListener("drop", handleDrop);
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  // Listening keyboard events to
  // prevent cmd+S save, new functionality
  // can be extended inside keyEvent function
  useEffect(() => {
    window.addEventListener("keydown", keyEvent);
    function keyEvent(e: KeyboardEvent) {
      if (e.keyCode === 83) {
        if (e.ctrlKey || e.metaKey) e.preventDefault();
      }
    }
    return () => window.removeEventListener("keydown", keyEvent);
  }, []);

  return <div id="ts-editor" ref={container}></div>;
};

export default TsEditor;

export type whiteSpace = "none" | "boundary";

export type editorOptions = {
  lineNumbers: "on" | "off";
  minimap: {
    enabled: boolean;
  };
  renderIndentGuides: boolean;
  renderWhiteSpace: whiteSpace;
  fontSize: number;
  fontLigatures: boolean;
  tabSize: number;
  autoRefresh: {
    enabled: boolean;
    delay: number;
  };
  hover: {
    enabled: boolean;
  };
  lightbulb: {
    enabled: boolean;
  };
  quickSuggestions: {
    enabled: boolean;
    delay: number;
  };
  insertSpaces: boolean;
  typescript: boolean;
  wordWrap: "on" | "off";
  theme: "light" | "dark";
  formatOnPaste: boolean;
};
export type dimension = {
  width: number;
  height: number;
};
