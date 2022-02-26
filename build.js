const esbuild = require("esbuild");

esbuild.build({
  entryPoints: {
    app: "src/index.tsx",
    "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
    "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
    style: "src/style.css",
  },
  outdir: "dist",
  bundle: true,
  minify: true,
  define: {
    "process.env.NODE_ENV": '"development"',
  },
  external: [
    "/fonts/inter/*.woff2",
    "/fonts/inter/*.woff",
    "/fonts/jetBrainsMono/*.woff2",
    "/fonts/jetBrainsMono/*.woff",
    "/fonts/jetBrainsMono/*.ttf",
    "/fonts/robotoMono/*.ttf",
    "*.woff",
    "*.woff2",
  ],
  loader: {
    ".ttf": "file",
  },
  // watch: true,
  // sourcemap: true,
});
