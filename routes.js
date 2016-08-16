'use strict';

var express = require("express");
var router = express.Router();

// GET /questions
// Route for questions collection.
// This is our route handler matching URL's after /questions e.g. "/" or "/:id"
// It recieves a request and response object.
router.get("/", function(req, res){
  // Return all the questions.
  // Hard coded responses until we set up a database.
  // This will take care of the json and serializing before sending it out.
  res.json({response: "You sent me a GET request"});
});

// POST /questions
// Route for creating questions.
router.post("/", function(req, res){
  res.json({
    response: "You sent me a POST request",
    body: req.body
  });
});

// GET /questions/:id
// Route for a specific question.
router.get("/:id", function(req, res){
  res.json({
    response: "You sent me a GET request for ID " + req.params.id
  });
});

module.exports = router;

// TODO: Add logging functionality.

// TODO: Build and test the rest of the routes.
