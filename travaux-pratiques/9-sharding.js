// Création des dossiers
/*
mkdir /data/confserv;
mkdir /data/n1;
mkdir /data/n2;
mkdir /data/n3;
*/

// Création des instances
/*
mongod --port 27001  --configsvr --dbpath /data/confserv

mongod --port 27018 --shardsvr --dbpath /data/n1
mongod --port 27019 --shardsvr --dbpath /data/n2
mongod --port 27020 --shardsvr --dbpath /data/n3
*/

// Connexion au mongos
// mongos --configdb jb-laptop:27001 --chunkSize 1

// Ajout des shards
// mongo --host jb-laptop --port 27017
sh.addShard("jb-laptop:27018");
sh.addShard("jb-laptop:27019");
sh.addShard("jb-laptop:27020");

// Ajout des donnees test
use testsh
for (var i=0; i<100000; i++) {
  db.users.insert({"name": "Utilisateur"+i, "created_at": new Date()});
}

// Check
sh.status();

// Activation du sharding sur la base
sh.enableSharding("testsh");

// Check
sh.status();

// Preparation au shardingUtilisateur52368
db.users.createIndex({ name: "hashed" });

// On active le sharding pour la collection users
sh.shardCollection("testsh.users", { name : "hashed" });

// Check
sh.status();

// Test query
db.users.find({name: "Utilisateur52368"});

db.users.find({name: "Utilisateur52368"}).explain();
