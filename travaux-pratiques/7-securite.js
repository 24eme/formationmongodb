// use admin;

db.createUser({
  user: "admin",
  pwd: "admin",
  roles: [{ role: "userAdminAnyDatabase", db: "admin" }] // ou ["userAdminAnyDatabase"]
});

db.grantRolesToUser("admin", ["readWriteAnyDatabase"]);

// On lance une instance mongod en mode authentification
// mongod --auth

// On lance le client normalement
// mongo

use movies;

show collections;

db.auth("admin", "admin");

// Pas d'utilisateur definit dans la base movies

use admin;

db.auth("admin", "admin");

use movies;

show collections;

db.createUser({
  user: "moviesu",
  pwd: "moviesp",
  roles: ["readWrite"] // on peut ajouter aussi dbOwner
});

show users;

use admin;

db.getCollection("system.users").find();

// On lance le client connecté en tant que moviesu
// mongo -u moviesu -p moviesp --authenticationDatabase movies

use admin;

show collections;

use movies;

db.movies.count();

// Chiffrement
/*
cd /etc/ssl/formationmdb
openssl req -newkey rsa:4096 -new -x509 -days 365 -nodes -out mongodb-cert.crt -keyout mongodb-cert.key
cat mongodb-cert.key mongodb-cert.crt > mongodb.pem

mongod --auth --sslMode requireSSL --sslPEMKeyFile /etc/ssl/formationmdb/mongodb.pem
mongo --ssl --sslAllowInvalidCertificates -u admin -p admin --authenticationDatabase admin
*/
