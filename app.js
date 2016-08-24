'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");
// We only need the json parser for this project, ("body-parser").json
var jsonParser = require("body-parser").json;
var logger = require("morgan");

// Mount the logger middleware.
// Pretty logging.
app.use(logger("dev"));
// Mount the parser middleware.
// Accessible from the req.body property.
app.use(jsonParser());

var mongoose = require("mongoose");

// Using the mongodb protocol.
// Default port 27017.
// Database named "qa" for "question and answer database".
mongoose.connect("mongodb://localhost:27017/qa");

// Reference the database connection.
var db = mongoose.connection;

// Listen for db connection events.
db.on("error", function(err){
  console.log("Connection error:", err);
});

// Listen for this event until it fires one time.
// Mongoose will save queries for when the db is set up.
db.once("open", function(){
  console.log("Connection successful.");
  // All database communication goes here.
});

// Set this up only once to allow access from the browser.
// For Production:
// 1. User Authentication
// 2. User Authorization

app.use(function(req, res, next){
  // Allow CORS requests from any "*" domain.
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    return req.header("Access-Control-Allow-Mehods", "PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/questions", routes);

// Catch 404 and forward to error handler.
app.use(function(req, res, next){
  var err = new Error("Not Found");
  err.status = 404;
  // Calling next with a parameter signals the error handler.
  next(err);
});

// Error handler
// Error handlers have four parameters.
// The err param tells Express this is an error handler middleware.
app.use(function(err, req, res, next){
  // If undefined status set to 500 internal server error.
  res.status(err.status || 500);
  res.json({
    message: err.message
  });
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server is listening on port", port);
});
