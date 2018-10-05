db.movies.createIndex({title: 1, year: 1})

db.movies.find({year : {$gte: 1997, $lte : 2000}}).sort({title: 1}).explain("executionStats")

db.movies.createIndex({year: 1, title: 1})

db.movies.find({year : {$gte: 1997, $lte : 2000}}).sort({title: 1}).explain("executionStats")

/* Utilisation de la base sirenes ++ */

// import de la base : mongoimport -d sirenes -c etablissements --file /../../sirenes.utf8.json --jsonArray

// Base query
db.etablissements.find({siren: "810720557"});

db.etablissements.find({siren: "810720557"}).explain("executionStats");

// Recherche sur Id du resultat
db.etablissements.find({_id: ObjectId("...")});

db.etablissements.getIndexes();

// Création index
db.etablissements.createIndex({siren: 1});

//Suppression index
db.etablissements.dropIndex("siren_1");

// Création index avec options
db.etablissements.createIndex({siren: 1, nic: 1}, {sparse: true, unique: true, background: true});

// Test après index
db.etablissements.find({siren: "810720557", nic: "00026"}).explain("executionStats");


db.etablissements.createIndex({"entreprise.nomen_long": 1});

db.etablissements.find({"entreprise.nomen_long": "24EME"});

db.etablissements.find({"entreprise.nomen_long": /24eme/i}); // Recherche par regexp lente => solution fulltext

// FullText index
db.etablissements.createIndex({ "entreprise.nomen_long": "text", "caracteristiques_economiques.libapen": "text"}, {default_language: "french", weights: {"entreprise.nomen_long": 2} });

db.etablissements.find({$text: { $search: "24eme" }});

// FullText et langues
// Traductions dans le doc
/*
{
   _id: 1,
   tweet: "C'est mon premier tweet",
   translation:
     [
        {
           language: "spanish",
           tweet: "Este es mi primer tweet"
        },
        {
           language: "english",
           tweet: "This is my first tweet"
        }
    ]
}
*/
db.tweets.createIndex({ tweet: "text", "translation.tweet": "text" }, {default_language: "french"});

// Traductions dans differents docs
/*
{ _id: 1, langue: "french", tweet: "C'est mon premier tweet"}
{ _id: 2, langue: "spanish", tweet: "Este es mi primer tweet"}
{ _id: 3, langue: "english", tweet: "This is my first tweet"}
*/
db.tweets.createIndex({ tweet : "text" }, { language_override: "langue" });

// Recherche
db.tweets.find({$text: { $search: "...",  $language: "..." }});

// +++++++++ Geospatial index

db.etablissements.createIndex({ localisation : "2dsphere" })

// https://api-adresse.data.gouv.fr/search/?q=11 Rue du Faubourg Poissonnière 75009 Paris
// [2.3478, 48.871762]

// Etablissements à 10 metres de Pythagore
db.etablissements.find({localisation: {$near : {$geometry: {type: "Point",  coordinates: [2.3478, 48.871762] }, $maxDistance: 10}}})

// Code APE restaurants : 5610A, 5610B, 5610C
db.etablissements.createIndex({ localisation : "2dsphere", "caracteristiques_economiques.apet700" : 1 }, {sparse: true})

// Restaurants dans les 100 metres 
db.etablissements.find({ $and: [{localisation: {$near : {$geometry: {type: "Point",  coordinates: [2.3478, 48.871762] }, $maxDistance: 100}}}, {"caracteristiques_economiques.apet700": {$in: ['5610A', '5610B', '5610C']}}] })

// http://geojson.io/#map
