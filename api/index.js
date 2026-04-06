// Register Babel to handle JSX before loading the app.
// We own these packages explicitly in package.json — no hidden resolution.
require("@babel/register")({
   presets: [
      "@babel/preset-react",
      ["@babel/preset-env", { targets: { node: "current" } }],
   ],
   extensions: [".jsx"],
   cache: false,
});

const app = require("../app");
module.exports = app;
