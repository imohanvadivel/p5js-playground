import React from "react";

interface Props {
  sketchCode: string;
}

const Canvas: React.FC<Props> = ({ sketchCode }) => {
  // Return the iframe content
  function getPage(code: string) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Sketch</title>
      <script src="https://unpkg.com/p5@1.3.1/lib/p5.min.js">
      </script> 
      <style>
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        canvas {
          display: block;
        }
    </style>
        <script>
        (function(){
          let error = [];
          let tempConsoleLog = console.log;
          console.log = function(msg){
            tempConsoleLog(msg);
            window.parent.postMessage({
              source: 'consoleMessages',
              message: msg
            });
          }
          let tempConsoleInfo = console.info;
          console.info = function(msg){
            tempConsoleInfo(msg);
            window.parent.postMessage({
              source: 'consoleMessages',
              message: msg
            });
          }
          let tempConsoleWarn = console.warn;
          console.warn = function(msg){
            tempConsoleWarn(msg);
            window.parent.postMessage({
              source: 'consoleMessages',
              message: msg
            });
          }
          window.onerror = function (message, url, lineNumber, columnNo, error) {
            window.parent.postMessage({
              source: 'defaultErrors',
              message,
              url,
              lineNumber,
              columnNo,
              error
            })
          }
          window.onunhandledrejection = function(ev){
            if(event.reason && event.reason.message && event.reason.stack){
              let errMessage = ev.reason.message;
              let lineNumber = ev.reason.stack.split("about:srcdoc:")[1].split(":")[0];
              let errorType = ev.reason.stack.split(":")[0]
              window.parent.postMessage({
                source: "promiseRejection",
                lineNumber,
                message: errorType+": "+errMessage,
              })
            }
          }
        })()        
        </script>
    </head>
    <body>
    <script>${code}</script>
    </body>
    </html>
    `;
  }

  return (
    <div id="rhs">
      <iframe
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        id="iframe"
        srcDoc={getPage(sketchCode)}></iframe>
    </div>
  );
};

export default Canvas;
