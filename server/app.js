var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
var apiRouter = require("./routes/api");
var adminRouter = require("./routes/admin");
var instagramRouter = require("./routes/instagram");
var twitterRouter = require("./routes/twitter");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.use(logger("dev"));
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/", express.static(__dirname + "/dist/spa"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/api", apiRouter);
app.use("/admin", adminRouter);
app.use("/twitter", twitterRouter);
app.use("/instagram", instagramRouter);

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
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
