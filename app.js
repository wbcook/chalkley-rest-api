'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");
// we only need the json parser for this project ("body-parser").json
var jsonParser = require("body-parser").json;

// mount the parser middleware
// accessible from the req body property
app.use(jsonParser());

app.use("/questions", routes);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server is listening on port", port);
});
