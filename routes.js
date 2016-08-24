'use strict';

var express = require("express");
var router = express.Router();
var Question = require("./models").Question;

// Preload document queries to keep handlers DRY.
// The param takes to parameters.
// The name of the route as a string and a callback.
router.param("qID", function(req, res, next, id){
  Question.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc){
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    next();
  });
});

router.param("aID", function(req, res, next, id){
  req.answers = req.questions.answers.id();
  if(!req.answer){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

// GET /questions
// Route for questions collection.
// This is our route handler matching URL's after /questions e.g. "/" or "/:id"
// It recieves a request and response object.
router.get("/", function(req, res, next){
  // Return all the questions.
  // Hard coded responses until we set up a database.
  // This will take care of the json and serializing before sending it out.
  // null is the projection parameter.
  // sort by createdAt date.
  // Mongoose exec() query builder - Mongoose documentation on queries http://mongoosejs.com/docs/queries.html
  Question.find({})
                .sort({createdAt: -1})
                .exec(function(err, questions){
                    if(err) return next(err);
                    res.json(questions);
                  });
});

// POST /questions
// Route for creating questions.
router.post("/", function(req, res, next){
  var question = new Question(req.body);
  question.save(function(err, question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// GET /questions/:qID
// Route for a specific question.
router.get("/:qID", function(req, res, next){
  res.json(req.question);
});

// POST /questions/:qID/answers
// Route for creating an answer.
router.post("/:qID/answers", function(req, res, next){
  req.question.answers.push(req.body);
  req.question.save(function(err, question){
    if(err) return next(err);
    res.status(201);
    res.json(question);
  });
});

// PUT /questions/:qID/answers/:aID
// Edit a specific answer.
router.put("/:qID/answers/:aID", function(req, res){
  // Mongoose update method.
  req.answers.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});

// DELETE /questions/:qID/answers/:aID
// Delete a specific answer.
router.delete("/:qID/answers/:aID", function(req, res){
  // Mongoose remove method.
  req.answers.remove(function(err){
    req.question.save(function(err, question){
      if(err) return next(err);
      res.json(question);
    });
  });
});

// POST /questions/:qID/answers/:aID/vote-up
// POST /questions/:qID/answers/:aID/down-up
// Vote on a specific answer.
// Reject all strings other than up or down.
// Call one or many middleware callbacks on a request. In this case, two.
router.post("/:qID/answers/:aID/vote-:dir", function(req, res, next){
  // Use a regex /.../ to check for only up or down, up|down.
  // ^(...)$ signals no other values allowed.
  if(req.params.dir.search(/^(up|down)$/) === -1){
    var err = new Error("Not Found");
    err.status = 404;
    // Pass in err to next to signal the error handler.
    next(err);
  } else {
    req.vote = req.params.dir;
    // Proceed without error to the next middleware right below this one.
    next();
  }
}, function(req, res, next){
  req.answers.vote(req.vote, function(err, question){
    if(err) return next(err);
    res.json(question);
  });
});

module.exports = router;

// DONE: Add logging functionality with Morgan.

// DONE: Build and test the rest of the routes.

// TODO: Connect our routes to a DB. In this case MongoDB with Mongoose.

// Question
/*
{
  text: String,
  createdAt: Date,
  answers: [
    {
      text: String,
      createdAt: Date,
      updatedAt: Date,
      votes: Integer
    }
  ]
}
*/
