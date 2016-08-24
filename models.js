'use strict';
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Compare answers by vote count, then by timestamp in milliseconds.
var sortAnswers = function(a, b) {
  if(a.votes === b.votes){
    return b.updatedAt - a.updatedAt;
  }
  return b.votes - a.votes;
}

var AnswerSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now},
  votes: {type: Number, default: 0}
});

// method("method", function)
AnswerSchema.method("update", function(updates, callback){
  // this == document
  Object.assign(this, updates, {updatedAt: new Date()});
  // save the parent document, the Question associated w the Answer.
  this.parent().save(callback);
});

AnswerSchema.method("vote", function(vote, callback){
  if(vote === "up"){
    this.votes += 1;
  } else {
    this.votes -= 1;
  }
  this.parent().save(callback);
});


var QuestionSchema = new Schema({
  text: String,
  createdAt: {type: Date, default: Date.now},
  answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next){
  this.answers.sort(sortAnswers); // Pass in a compare function to the sort. MDR Array.sort
  next();
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports.Question = Question;
