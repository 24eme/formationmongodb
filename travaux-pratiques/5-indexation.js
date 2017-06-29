/* Utilisation de la base sirenes */

// Base query
db.etablissements.find({siret: "81072055700026"});

db.etablissements.find({siret: "81072055700026"}).explain("executionStats");

// Recherche sur Id du resultat
db.etablissements.find({_id: ObjectId("...")});

db.etablissements.getIndexes();

// Création index
db.etablissements.createIndex({siret: 1});

//Suppression index
db.etablissements.dropIndex("siret_1");

// Création index avec options
db.etablissements.createIndex({siret: 1}, {sparse: true, unique: true});

// Test après index
db.etablissements.find({siret: "81072055700026"}).explain("executionStats");

db.etablissements.createIndex({siren: 1, nic: 1}, {sparse: true, unique: true});

db.etablissements.createIndex({"entreprise.nomen_long": 1}, {sparse: true});

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
           quote: "Este es mi primer tweet"
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
