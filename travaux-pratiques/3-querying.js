/* Utilisation de la base movies */

// import de la base movies : mongorestore -d formation -c movies  /../../movies.bson

// Base query
db.movies.find({title: "Vertigo"});

// Projection
db.movies.find({year: 1997});

db.movies.find({year: 1997}, {title: 1});

db.movies.find({year: 1997}, {title: 1, _id: 0}).sort({title: 1});

// Recherche avec opérateurs logiques et de comparaison
db.movies.find({$or: [{year: 1997}, {year: 1998}, {year: 1999}, {year: 2000}]}, {title: 1, _id: 0}).sort({year: 1});

db.movies.find({ year: {$in: [1997, 1998, 1999, 2000]} }, {title: 1, _id: 0}).sort({year: 1});

db.movies.find({ year: {$gte: 1997, $lte: 2000} }, {year: 1, title: 1, _id: 0}).sort({year: -1, title: 1});

db.movies.find({$and: [{year: {$gte: 1997, $lte: 2000}}, {genre: "drama"}]}, {title: 1, _id: 0});

db.movies.find({ year: {$not: {$lte: 2000}}}, {year: 1, title: 1, _id: 0});

// Recherche sur tableau
db.movies.find({$and: [{"actors.last_name": "Willis"}, {"actors.first_name": "Bruce"}]}, {year: 1, title: 1, _id: 0});

db.movies.find({ actors: {$elemMatch: { last_name: "Willis", first_name: "Bruce" }}}, {year: 1, title: 1, _id: 0});

db.movies.find({ actors: { $size: 6 }}, {year: 1, title: 1, _id: 0});

// Existance
db.movies.find({ "actors.role": {$exists: false}}, {year: 1, title: 1, _id: 0});

// En supprimant le champ summary d'un doc
db.movies.find({ "summary": null}, {year: 1, title: 1, _id: 0});

db.movies.update({ title: "..." }, { $unset: { summary: 1 }});

db.movies.find({ "summary": {$eq: null, $exists: true}}, {year: 1, title: 1, _id: 0});

// Regexp
db.movies.find({title: /matrix/i }, {year: 1, title: 1, _id: 0});

db.movies.find({title: {$regex: /matri*/, $options: 'i' }}, {year: 1, title: 1, _id: 0});

// $where Query
db.movies.find({"$where" : function() { for (actor in this['actors']) { if (this['director']['birth_date'] == this['actors'][actor]['birth_date']) { return true; }} }}, {title: 1}).pretty();

db.movies.find({"$where" : function() { for (actor in this.actors) { if (this.director.birth_date == this.actors[actor].birth_date) { return true; } } }}, {title: 1}).pretty();

// Explain
db.movies.find().explain("executionStats");

db.movies.find().limit(5).explain("executionStats")

