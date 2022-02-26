import React, { Dispatch, useEffect, useState } from "react";
import { consoleError } from "./Editor";

interface Props {
  error: consoleError;
  setError: Dispatch<React.SetStateAction<consoleError>>;
  setIsRunning: Dispatch<React.SetStateAction<boolean>>;
}

const Console: React.FC<Props> = ({ error, setError, setIsRunning }) => {
  const [consoleMsg, setConsoleMsg] = useState([]);

  // Service worker thing
    useEffect(() => {
    if (!window.BroadcastChannel) return;
    let channel = new BroadcastChannel("p5-refresh");
    channel.onmessage = function (e) {
      // @ts-ignore
      if ((e.data = "refresh")) {
        let initial = localStorage.getItem("p5-initial");
        if (!initial) {
          localStorage.setItem("p5-initial", "true");
        } else {
          useToast("Refresh the page for new updates to take effect", 8000);
        }
      }
    };
  }, []);

  // Listening for error message from iframe
  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (["defaultErrors", "promiseRejection"].includes(event.data.source)) {
        setError({
          message: `[Line: ${event.data.lineNumber - 73}]   ${
            event.data.message
          }`,
        });
        setIsRunning(false);
      }
    });
    // listening for console.log from iframe
    window.addEventListener("message", (event) => {
      if (event.data.source == "consoleMessages") {
        setConsoleMsg((prev) => [...prev, event.data.message]);
      }
    });
  }, []);

  return (
    <div id="console">
      <header>
        <div className="hd">Console</div>
        {error && <div className="tp-msg">{error.message}</div>}

        {(error || consoleMsg.length > 0) && (
          <div
            className="clear"
            onClick={() => {
              setError(null);
              setConsoleMsg([]);
            }}>
            Clear
          </div>
        )}
      </header>
      {consoleMsg.length > 0 && (
        <div className="msg">
          {consoleMsg.map((e, i) => (
            <div key={i}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Console;
