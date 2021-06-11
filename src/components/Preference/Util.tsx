import React, { Dispatch } from "react";
import { editorOptions } from "../Editor/TsEditor";

type param = Dispatch<React.SetStateAction<editorOptions>>;

export function fn_darkMode(opt: param) {
  let root = document.querySelector(":root");
  root.classList.toggle("dark");
  let label = localStorage.getItem("p5-darkMode");

  if (label && label == "false") {
    localStorage.setItem("p5-darkMode", "true");
  } else {
    localStorage.setItem("p5-darkMode", "false");
  }

  opt((prev) => {
    if (prev.theme == "light") {
      return {
        ...prev,
        theme: "dark",
      };
    } else {
      return {
        ...prev,
        theme: "light",
      };
    }
  });
}
export function fn_wordWrap(opt: param) {
  opt((prev) => {
    return prev.wordWrap == "on"
      ? {
          ...prev,
          wordWrap: "off",
        }
      : {
          ...prev,
          wordWrap: "on",
        };
  });
}
export function fn_hoverCards(opt: param) {
  opt((prev) => {
    return { ...prev, hover: { enabled: !prev.hover.enabled } };
  });
}
export function fn_minimap(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      minimap: {
        enabled: !prev.minimap.enabled,
      },
    };
  });
}
export function fn_lineNumbers(opt: param) {
  opt((prev) => {
    return prev.lineNumbers == "on"
      ? {
          ...prev,
          lineNumbers: "off",
        }
      : {
          ...prev,
          lineNumbers: "on",
        };
  });
}
export function fn_whiteSpace(opt: param) {
  opt((prev) => {
    return prev.renderWhiteSpace == "boundary"
      ? {
          ...prev,
          renderWhiteSpace: "none",
        }
      : {
          ...prev,
          renderWhiteSpace: "boundary",
        };
  });
}
export function fn_indentGuide(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      renderIndentGuides: !prev.renderIndentGuides,
    };
  });
}
export function fn_ligature(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      fontLigatures: !prev.fontLigatures,
    };
  });
}
export function fn_codeAction(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      lightbulb: {
        enabled: !prev.lightbulb.enabled,
      },
    };
  });
}
export function fn_autoRefresh(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      autoRefresh: {
        delay: prev.autoRefresh.delay,
        enabled: !prev.autoRefresh.enabled,
      },
    };
  });
}
export function fn_quickSuggestions(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      quickSuggestions: {
        enabled: !prev.quickSuggestions.enabled,
        delay: prev.quickSuggestions.delay,
      },
    };
  });
}
export function fn_insertSpace(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      insertSpaces: !prev.insertSpaces,
    };
  });
}
export function fn_typescript(opt: param) {
  opt((prev) => {
    return {
      ...prev,
      typescript: !prev.typescript,
    };
  });
}
export function fn_autoRefreshDelay(opt: param, value: number) {
  opt((prev) => {
    return {
      ...prev,
      autoRefresh: {
        enabled: prev.autoRefresh.enabled,
        delay: value,
      },
    };
  });
}
export function fn_quickSuggestionsDelay(opt: param, value: number) {
  opt((prev) => {
    return {
      ...prev,
      quickSuggestions: {
        enabled: prev.quickSuggestions.enabled,
        delay: value,
      },
    };
  });
}
export function fn_tabSize(opt: param, value: number) {
  opt((prev) => {
    return {
      ...prev,
      tabSize: value,
    };
  });
}
export function fn_fontSize(opt: param, value: number) {
  opt((prev) => {
    return {
      ...prev,
      fontSize: value,
    };
  });
}
