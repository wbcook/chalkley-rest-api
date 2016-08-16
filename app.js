'use strict';

var express = require("express");
var app = express();
var routes = require("./routes");
// We only need the json parser for this project, ("body-parser").json
var jsonParser = require("body-parser").json;

// Mount the parser middleware.
// Accessible from the req.body property.
app.use(jsonParser());

app.use("/questions", routes);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("Express server is listening on port", port);
});
