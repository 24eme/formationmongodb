// Création des dossiers
/*
mkdir /data/n1;
mkdir /data/n2;
mkdir /data/n3;
*/

// Création des instances
/*
mongod --port 27017 --replSet formationmdb --dbpath /data/n1
mongod --port 27018 --replSet formationmdb --dbpath /data/n2
mongod --port 27019 --replSet formationmdb --dbpath /data/n3
*/

// Connexion au serveur 27017
// mongo --port 27017

// Initialisation de la replication
rs.initiate();

// Check
rs.isMaster();

// Ajout des noeuds
rs.add("nom_machine:27018");
rs.add("nom_machine:27019");

// Check complet
rs.status();

// Test
use formationmdb;

db.rstest.insert ({"title": "Formation MongoDB", "summary": "Test des replica set"});

db.rstest.find();

// Test sur n2
// mongo --port 27018
use formationmdb;

db.rstest.find();

rs.slaveOk();

db.rstest.find();

db.rstest.insert ({"title": "Formation MongoDB", "summary": "Test ecriture n2"});

// Interruption n1
// mongo --port 27018
rs.status();

// Interruption n2
// mongo --port 27019
rs.status();

// On redemarre les 3 instances
// On ajoute un arbitre
// mkdir /data/arbitre;
// mongod --port 27020 --replSet formationmdb --dbpath /data/arbitre
rs.add("nom_machine:27020", true);
