var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var React = require("react");
var { renderToStaticMarkup } = require("react-dom/server");

var app = express();

// Custom JSX view engine — uses react-dom/server directly, no express-react-views.
// Babel registration happens in api/index.js before this file is loaded.
app.set("views", __dirname + "/views");
app.set("view engine", "jsx");
app.engine("jsx", function (filePath, options, callback) {
   try {
      delete require.cache[require.resolve(filePath)];
      var Component = require(filePath);
      if (Component.default) Component = Component.default;
      var html = renderToStaticMarkup(React.createElement(Component, options));
      callback(null, html);
   } catch (err) {
      callback(err);
   }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) =>
   res.status(400).json({
      status: 400,
      message: "missing_pageid",
      details: "pageId query parameter missing",
   })
);

app.all("/html-to-notion", require("./routes/htmlToNotion").index);
app.all("/:pageId", require("./routes").index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
   next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};

   // render the error page
   console.log(err);
   res.status(err.status || 500).send(`<pre>${err.stack}</pre>`);
});

module.exports = app;
