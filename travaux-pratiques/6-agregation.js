// Map/Reduce

var map = function() { emit(this.genre, 1); };

var reduce = function(key, values) { return Array.sum(values)};

var count = db.movies.mapReduce(map, reduce, {out: "movies_categories"});

db.movies_categories.find().sort({value: -1});

// Framework

// Par genre
db.movies.aggregate([
      {
        $group : {
           _id : "$genre",
           nb_movies: { $sum: 1 }
        }
      },
      {$sort: { nb_movies: -1 }}
]);

// Par year
db.movies.aggregate([
      {
        $group : {
           _id : "$year",
           nb_movies: { $sum: 1 }
        }
      },
      {$sort: { _id: -1 }}
]);

// Par genre filtre
db.movies.aggregate([
      {$match: {year: {$gte: 2000}}},
      {
        $group : {
           _id : "$genre",
           nb_movies: { $sum: 1 },
           films: { $push:  "$title"}
        }
      },
      {$sort: { nb_movies: -1 }}
]);

// Sauvegarde
// Par genre filtre
db.movies.aggregate([
      {$sort: {"year": -1}},
      {
        $group : {
           _id : "$genre",
           nb_movies: { $sum: 1 },
           films: { $push:  { _id: "$_id", title: "$title", year: "$year"}}
        }
      },
      { $out : "movies_categories" }
]);
