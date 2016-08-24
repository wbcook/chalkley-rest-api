'use strict';
var mongoose = require("mongoose");

// Using the mongodb protocol.
// Default port 27017.
// Database named "sandbox".
mongoose.connect("mongodb://localhost:27017/sandbox");

// Reference the database connection.
var db = mongoose.connection;

// Listen for db connection events.
db.on("error", function(err){
  console.log("Connection error:", err);
});

// Listen for this event until it fires one time.
db.once("open", function(){
  console.log("Connection successful.");
  // All database communication goes here.
  var Schema = mongoose.Schema;
  var AnimalSchema = new Schema({
    type: {type: String, default: "goldfish" },
    size: String,
    color: {type: String, default: "golden" },
    mass: {type: Number, default: 0.0007 },
    name: {type: String, default: "Angela" }
  });

  // Mongoose middleware pre and post hooks.
  // Run any code before a save.
  AnimalSchema.pre("save", function(next){
    if(this.mass >= 100){
      this.size = "big";
    } else if (this.mass >= 5 && this.mass < 100) {
      this.size = "medium";
    } else {
      this.size = "small";
    }
    next();
  });

  AnimalSchema.methods.findSameColor = function(callback) {
    // this == document
    return this.model("Animal").find({color: this.color}, callback);
  }

  AnimalSchema.statics.findSize = function(size, callback){
    // this == Animal
    return this.find({size: size}, callback);
  }

  // Mongoose will create a collection named Animals based on the 1st parameter.
  // Pass in the singular name and schema type.
  var Animal = mongoose.model("Animal", AnimalSchema);

  // Fill the constructor function with all of the elements a animal needs.
  var elephant = new Animal({
    type: "elephant",
    color: "gray",
    mass: 6000,
    name: "Lawrence"
  });

  // Empty animal entry with default values.
  var animal = new Animal({}); // Goldfish.

  var whale = new Animal({
    type: "whale",
    mass: 190500,
    name: "Fig"
  });

  var animalData = [
    {
      type: "mouse",
      color: "gray",
      mass: 0.035,
      name: "Marvin"
    },
    {
      type: "nutria",
      color: "brown",
      mass: 6.36,
      name: "Gretchen"
    },
    {
      type: "wolf",
      color: "gray",
      mass: 45,
      name: "Iris"
    },
    elephant,
    animal,
    whale
  ];

  // WARNING: Pyramid of Doom ahead.
  Animal.remove({}, function(err){
    if(err) console.error(err);
    // Save the elephant object.
    // Call the close function inside the save callback so it closes after saving.
    // The save function takes a error parameter in case it fails.
    Animal.create(animalData, function(err, animals){
      if(err) console.error(err);
      Animal.findOne({type: "elephant"}, function(err, elephant){
        elephant.findSameColor(function(err, animals) {
          if(err) console.error(err);
          animals.forEach(function(animal){
            console.log(animal.name + " the " + animal.color + " " + animal.type + " is a " + animal.size + "-ed animal.");
          });
          // When we're done communicating we can close the connection.
          // close can take a callback to tell us that the connection closed.
          db.close(function(){
            console.log("DB connection closed.");
          });
        });
      });
    });
  });


});

// MongoDB Installation Notes

// The Homebrew installation of mongo includes SSL.
// su to admin
// sudo mkdir -p /data/db
// sudo chmod 777 /data/db
// sudo chown -R 'youruserid' /data/db
// mongod
// control-C twice to exit mongod

// mongod // The mongo daemon.
// mongo // The mongo cli
// run both

// show dbs // Show the available databases
// use mongoBasics // Make mongoBasics the working databases
// Add data before mongoBasics will show up on dbs. We'll use insert().
// Insert a document into my post collection. Insert() takes a json object.
// db.post.insert({title: "post inserted in the post collection"})
// show collections // Shows my collections in my database.
// db.post.find() // Find documents in my post collection.

// Using this database:

// mongod
// mongo
// show dbs
// >> local        0.000GB
// >> mongoBasics  0.000GB
// >> sandbox      0.000GB
// use sandbox
// >> switched to db sandbox
// db.getCollectionNames()
// >> [ "animals" ]
// db.animals.find()
// >> { "_id" : ObjectId("57b48e02d576b5c1150ecf48"), "type" : "elephant", "size" : "big", "color" : "gray", "mass" : 6000, "name" : "Lawrence", "__v" : 0 }
