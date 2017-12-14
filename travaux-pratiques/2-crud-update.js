// Modification de l'année => Oups document vidé !
db.movies.update({title: "Vertigo"}, {year: "1959"});

// Correction update pour modification de champ
db.movies.update({title: "Vertigo"}, { $set: {year: "1959"}});

// Création document si il n'existe pas
db.movies.update( { title: "Alien" }, { $set: { year: 79, country: "USA", genre: ["Science fiction"], director: {last_name: "Scott", first_name: "Ridley", birth_date: "1937-11-30", nationality: "GB​"}}}, { upsert: 1 });

// Update multi document
db.movies.update( { country: "USA" }, { $set: { oscars: 1 } }, { multi: 1 });

// Incremente valeur
db.movies.update( { country: "USA" }, { $inc: { oscars: 4 } }, { multi: 1 });

// Decremente valeur
db.movies.update( { country: "USA" }, { $inc: { oscars: -4 } }, { multi: 1 });

// Suppression champ
db.movies.update( { country: "USA" }, { $unset: { oscars: "" } });

// Ajout tableau
db.movies.update( { title: "Alien" }, { $set: { actors: [] } });
db.movies.update( { title: "Alien" }, { $push: { actors: {first_name: "Sigourney", last_name: "Weaver", birth_date: "1949-10-08", nationality: "GB", role: "Ellen L. Ripley"}}});

/* addToSet au lieu de push pour des valeurs uniques */

// Modifier valeur tableau
db.movies.update( { title: "Alien" }, { $set: { "actors.0.nationality": "USA" } });

// Ajouter plusieurs valeurs tableau
db.movies.update( { title: "Alien" }, { $push: { actors: { $each: [{first_name: "Tom", last_name: "Skerritt", birth_date: "1933-08-25", nationality: "USA", role: "A. J. Dallas"}, {first_name: "John", last_name: "Hurt", birth_date: "1940-01-22", death_date: "2017-01-25", nationality: "GB", role: "G. W. Kane"}]}}});

// Supprimer la derniere valeur d'un tableau (-1 pour la premiere valeur)
db.movies.update( { title: "Alien"}, { $pop: { actors : 1 } });

// Supprimer valeur specifique
db.movies.update( { title: "Alien" }, { $pull: { "actors" : {"last_name": "Skerritt" }}});

db.movies.update( { title: "Vertigo" }, { $pull: { "genre" : "Romance" }});
