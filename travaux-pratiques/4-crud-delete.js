// Supprimer document
db.movies.remove({title: "Alien"});

// Supprimer collection
db.movies.drop();

// Supprimer tous les docs d'un collection => plus lent que drop
db.movies.remove();
