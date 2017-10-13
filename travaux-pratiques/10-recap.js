//Exo Recap
// Supprimer les bases existantes
use base
db.dropDatabase();

// Restaurer la base movies en cinema.films
mongorestore -d cinema -c films /../movies.bson

// Créer un utilisateur administrateur dans la base admin avec les droits dbAdminAnyDatabase et userAdminAnyDatabase 
use admin
db.createUser({
  user: "administrateur",
  pwd: "admin",
  roles: ["dbAdminAnyDatabase", "userAdminAnyDatabase"]
});
// activer l'auth et se connecter en tant que administrateur
// Créer un utilisateur lecteur sur la base cinema avec le droit read
use cinema
db.createUser({
  user: "lecteur",
  pwd: "lecteur",
  roles: ["read"]
});

// *** Créer une instance mongod pour repliquer les données

// Modifier le pays USA par US
// Update multi document
db.movies.update( { country: "USA" }, { $set: { country: "US" } }, { multi: 1 });

// Créer un index fulltext sur tous les champs textes en précisant la langue française et en affectant un poid de 3 sur le title et 2 sur le summary en nommant l'index 'recherche_fulltext'
db.etablissements.createIndex({ "$**": "text"}, {name: "recherche_fulltext", default_language: "french", weights: {"title": 3, "summary": 2} });

// Ecrire une statistique : le nombre de film americain par genre ainsi que l'année moyenne de parution en précisant le nom des films en résultat et trié par anné decroissante. Stocker dans une collection
db.movies.aggregate([
      {$match: {country: "US"}},
      {
        $group : {
           _id : "$genre",
           sum_film: { $sum: 1 },
           avg_annee: { $avg: "$year" },
           films: { $push:  "$title"}
        }
      },
      {$sort: { avg_annee: -1 }},
	  { $out : "categories_films_us" }
]);

// Faire une sauvegarde csv, json et bson de la base
