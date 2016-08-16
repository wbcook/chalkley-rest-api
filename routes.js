'use strict';

var express = require("express");
var router = express.Router();

// GET /questions
// route for questions collection
// this is our route handler
// it recieves a request and response object
router.get("/", function(req, res){
  // return all the questions
  // hard coded responses until we set up a database
  // this will take care o the json and serializing before sending it out
  res.json({response: "You sent me a GET request"});
});

// POST /questions
// route for creating questions
// this is our route handler
router.post("/", function(req, res){
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});

// GET /questions/:id
// route for a specific question
router.get("/:id", function(req, res){
  res.json({
    response: "You sent me a GET request for ID " + req.params.id
  });
});

module.exports = router;

// TODO: Add logging functionality.

// TODO: Build and test the rest of the routes.
