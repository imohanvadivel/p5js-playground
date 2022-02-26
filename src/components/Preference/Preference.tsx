import React, { Dispatch, useEffect } from "react";
import { editorOptions } from "../Editor/TsEditor";
import * as Icons from "./Icons";
import NumberInput from "./NumberInput";
import Switch from "./Switch";
import {
  fn_autoRefresh,
  fn_autoRefreshDelay,
  fn_codeAction,
  fn_darkMode,
  fn_fontSize,
  fn_hoverCards,
  fn_indentGuide,
  fn_minimap,
  fn_tabSize,
  fn_whiteSpace,
  fn_wordWrap,
  fn_typescript,
  fn_lineNumbers,
  fn_quickSuggestions,
  fn_quickSuggestionsDelay,
  fn_insertSpace,
  fn_ligature,
} from "./Util";

interface Props {
  editorOptions: editorOptions;
  setEditorOptions: Dispatch<React.SetStateAction<editorOptions>>;
  setPrefActive: Dispatch<React.SetStateAction<boolean>>;
}

const Preference: React.FC<Props> = ({
  editorOptions,
  setEditorOptions,
  setPrefActive,
}) => {
  useEffect(() => {
    // iframe prevents mouseDown event

    let rhs = document.querySelector("#rhs");
    // @ts-ignore
    if (rhs) rhs.style.pointerEvents = "none";
    window.addEventListener("mousedown", listenForClick);

    function listenForClick(event) {
      if (!event.target.closest("#preference")) {
        setPrefActive(false);
      }
    }

    return () => {
      window.removeEventListener("mousedown", listenForClick);

      let rhs = document.querySelector("#rhs");
      // @ts-ignore
      if (rhs) rhs.style.pointerEvents = "unset";
    };
  }, []);

  return (
    <section
      id="preference"
      className={
        editorOptions.theme == "dark"
          ? "hide-scrollbar depth2"
          : "hide-scrollbar"
      }>
      <div>
        {/* Dark Mode------------------ */}
        <section className="darkMode pref-el">
          <div className="icon">{Icons.darkMode()}</div>
          <header>Dark mode</header>
          <Switch
            val={editorOptions.theme}
            onToggle={() => fn_darkMode(setEditorOptions)}
          />
        </section>
        {/* Typescript------------------ */}
        <section className="typescript pref-el">
          <div className="icon">{Icons.typescript()}</div>
          <header>Typescript</header>
          <Switch
            val={editorOptions.typescript}
            onToggle={() => fn_typescript(setEditorOptions)}
          />
        </section>
        {/* Auto Refresh------------------ */}
        <section className="darkMode pref-el">
          <div className="icon">{Icons.autoRefresh()}</div>
          <header>Auto refresh</header>
          <Switch
            val={editorOptions.autoRefresh.enabled}
            onToggle={() => fn_autoRefresh(setEditorOptions)}
          />
        </section>
        {/* AutoRefresh: Delay------------------ */}
        {editorOptions.autoRefresh.enabled && (
          <section className="auto-refresh-delay ind-1 pref-el">
            <header>
              Delay <span className="opacity5">(ms)</span>
            </header>
            <NumberInput
              min={0}
              max={9999}
              step={1}
              value={editorOptions.autoRefresh.delay}
              onInput={(val) => fn_autoRefreshDelay(setEditorOptions, val)}
            />
          </section>
        )}
        {/* Word Wrap------------------ */}
        <section className="WordWrap pref-el">
          <div className="icon">{Icons.wordWrap()}</div>
          <header>Word wrap</header>
          <Switch
            val={editorOptions.wordWrap}
            onToggle={() => fn_wordWrap(setEditorOptions)}
          />
        </section>
        {/* Font Size------------------ */}
        <section className="fontSize pref-el">
          <div className="icon">{Icons.fontSize()}</div>
          <header>
            Font size <span className="opacity5">(px)</span>
          </header>
          <NumberInput
            min={8}
            max={32}
            step={1}
            value={editorOptions.fontSize}
            onInput={(val) => fn_fontSize(setEditorOptions, val)}
          />
        </section>

        {/* Font Ligature------------------ */}
        {/* <section className="ligature pref-el">
          <div className="icon">{Icons.ligature()}</div>
          <header>Font ligature</header>
          <Switch
            val={editorOptions.fontLigatures}
            onToggle={() => fn_ligature(setEditorOptions)}
          />
        </section> */}
        {/* Tab insert space------------------ */}
        <section className="quick-suggestion pref-el">
          <div className="icon">{Icons.insertSpace()}</div>
          <header>TAB inserts space</header>
          <Switch
            val={editorOptions.insertSpaces}
            onToggle={() => fn_insertSpace(setEditorOptions)}
          />
        </section>
        {/* Tab Size------------------ */}
        <section className="tabSize pref-el">
          <div className="icon">{Icons.tabSize()}</div>
          <header>Tab size</header>
          <NumberInput
            min={1}
            max={8}
            step={1}
            value={editorOptions.tabSize}
            onInput={(val) => fn_tabSize(setEditorOptions, val)}
          />
        </section>

        {/* Quick Suggestion------------------ */}
        <section className="quick-suggestion pref-el">
          <div className="icon">{Icons.quickSuggestions()}</div>
          <header>Quick suggestions</header>
          <Switch
            val={editorOptions.quickSuggestions.enabled}
            onToggle={() => fn_quickSuggestions(setEditorOptions)}
          />
        </section>
        {/* QuickSuggestion: Delay------------------ */}
        {editorOptions.quickSuggestions.enabled && (
          <section className="quick-suggestion-delay ind-1 pref-el">
            <header>
              Delay <span className="opacity5">(ms)</span>
            </header>
            <NumberInput
              min={0}
              max={9999}
              step={1}
              value={editorOptions.quickSuggestions.delay}
              onInput={(val) => fn_quickSuggestionsDelay(setEditorOptions, val)}
            />
          </section>
        )}
        {/* LineNumber------------------ */}
        <section className="lineNumber pref-el">
          <div className="icon">{Icons.lineNumber()}</div>
          <header>Line numbers</header>
          <Switch
            val={editorOptions.lineNumbers}
            onToggle={() => fn_lineNumbers(setEditorOptions)}
          />
        </section>

        {/* Minimap------------------ */}
        <section className="minimap pref-el">
          <div className="icon">{Icons.minimap()}</div>
          <header>Minimap</header>
          <Switch
            val={editorOptions.minimap.enabled}
            onToggle={() => fn_minimap(setEditorOptions)}
          />
        </section>
        {/* Hover Cards------------------ */}
        <section className="hoverCards pref-el">
          <div className="icon">{Icons.hoverCards()}</div>
          <header>Hover cards</header>
          <Switch
            val={editorOptions.hover.enabled}
            onToggle={() => fn_hoverCards(setEditorOptions)}
          />
        </section>
        {/* Show White Space------------------ */}
        <section className="whiteSpace pref-el">
          <div className="icon">{Icons.whiteSpace()}</div>
          <header>Show white space</header>
          <Switch
            val={editorOptions.renderWhiteSpace}
            onToggle={() => fn_whiteSpace(setEditorOptions)}
          />
        </section>
        {/* Indentation Guide------------------ */}
        <section className="indentGuide pref-el">
          <div className="icon">{Icons.indentGuide()}</div>
          <header>Indentation guide</header>
          <Switch
            val={editorOptions.renderIndentGuides}
            onToggle={() => fn_indentGuide(setEditorOptions)}
          />
        </section>
        {/* Code action lightbulb------------------ */}
        <section className="codeAction pref-el">
          <div className="icon">{Icons.codeAction()}</div>
          <header>CodeAction lightbulb</header>
          <Switch
            val={editorOptions.lightbulb.enabled}
            onToggle={() => fn_codeAction(setEditorOptions)}
          />
        </section>
      </div>

      <footer className="flex-h center">
        <span>
          Built by&nbsp;
          <a
            href="https://twitter.com/imohanvadivel"
            target="_blank"
            className="twitter plain">
            Mohan Vadivel
          </a>
        </span>
        <a
          target="_blank"
          href="https://github.com/imohanvadivel/p5js-typescript-playground"
          className="plain github flex">
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.00005 1.00004C6.33819 1.00027 4.73062 1.59173 3.4649 2.66864C2.19918 3.74555 1.35788 5.23764 1.0915 6.87801C0.825123 8.51838 1.15104 10.2 2.01095 11.6221C2.87085 13.0442 4.20866 14.114 5.78505 14.64C6.13505 14.705 6.28505 14.49 6.28505 14.305C6.28505 14.12 6.28505 13.7 6.28505 13.115C4.34005 13.535 3.93005 12.175 3.93005 12.175C3.79328 11.7465 3.50541 11.3822 3.12005 11.15C2.48505 10.72 3.17005 10.725 3.17005 10.725C3.39185 10.7564 3.60356 10.838 3.78901 10.9636C3.97445 11.0893 4.12873 11.2557 4.24005 11.45C4.43372 11.7974 4.75742 12.0536 5.13997 12.1624C5.52251 12.2712 5.9326 12.2236 6.28005 12.03C6.30828 11.6753 6.46468 11.3429 6.72005 11.095C5.17005 10.915 3.53505 10.315 3.53505 7.63504C3.52371 6.93899 3.78166 6.26546 4.25505 5.75504C4.04078 5.15214 4.06583 4.49003 4.32505 3.90504C4.32505 3.90504 4.91005 3.71504 6.25005 4.62004C7.39579 4.30752 8.60431 4.30752 9.75005 4.62004C11.085 3.71504 11.67 3.90504 11.67 3.90504C11.9293 4.49003 11.9543 5.15214 11.74 5.75504C12.2134 6.26546 12.4714 6.93899 12.46 7.63504C12.46 10.325 10.825 10.915 9.26505 11.09C9.43216 11.2594 9.56102 11.4627 9.64296 11.686C9.7249 11.9094 9.758 12.1478 9.74005 12.385C9.74005 13.32 9.74005 14.075 9.74005 14.305C9.74005 14.535 9.86505 14.71 10.24 14.64C11.8185 14.1133 13.1577 13.0415 14.0175 11.6168C14.8773 10.1921 15.2014 8.50767 14.9317 6.86563C14.662 5.2236 13.8162 3.73133 12.546 2.65643C11.2757 1.58152 9.66407 0.994293 8.00005 1.00004V1.00004Z"
            />
          </svg>
        </a>
      </footer>
    </section>
  );
};

export default Preference;
