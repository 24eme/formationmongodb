// +++++++++ Backups

// oplog pour assurer la cohérence durant le traitement du dump
mongodump  --oplog --out /dump_location/
mongorestore --drop --oplogReplay --dir /dump_location/

mongodump  --gzip --out /dump_location/
mongorestore --drop --gzip --dir /dump_location/

// query.json => {year: "1999"} /!\ mettre guillemets autours du nom du champs.
mongodump -d cinema -c movies --queryFile query.json


db.copyDatabase(fromdb, todb, fromhost, username (definit dans fromdb), password, mechanism(SCRAM-SHA-1, MONGODB-CR))
/*
Rebuild les indexes
Pas possible sur du sharding
Pas de lock, données non cohérentes
*/

// +++++++++ Profiler

// Base à étudier

use sirenes 

// Activation du profiler sur les queries > 100ms	
db.setProfilingLevel(1, 100);
db.getProfilingStatus() // check statut

// find en collscan
db.etablissements.find({siren: "810720557"}).hint({$natural : 1})

// Affichage des opérations capturées
db.system.profil.find().pretty();

/*
client : IP client
appName : application cliente
user : l'utilisateur connecté

millis : le temps total d'execution de l'opération
ns : namespace d'execution de l'opération
commande : l'opération détaillée
*/
db.system.profile.stats()
/*
capped : true => collection plafonnée
maxSize : 1 Mo
*/

// On peut élargir la taille : 100mo
db.setProfilingLevel(0);
db.createCollection('system.profile', {capped: true, size: 104857600}) // octet binaire
db.setProfilingLevel(1, 100);

// +++++++++ CurrentOp

// Ouvrir 2 clients
use sirenes
db.etablissements.find({siren: "810720557"}).hint({$natural : 1})
// Dans le 2eme client
db.currentOp()
/*
opid : identifiant de l'opération
secs_running / microsecs_running : durée d'execution en cours
op: type d'opération (query, insert, update,..)
*/
db.killOp(opid)

// préciser le currentOp 

db.currentOp({"active" : true, "secs_running" : { "$gt" : 2 }, "ns" : "sirenes.etablissements"})

// +++++++++ I/O usages

db.serverStatus(); // https://docs.mongodb.com/manual/reference/command/serverStatus/

/*
"extra_info" : {
	"page_faults" : xxx // nombre de défauts de page (si il augmente dans le temps => manque de RAM, lecture sur disque)
}
"wiredTiger" : {
	"cache": {
		"bytes currently in the cache": xxx // quantité de données présentes en cache (WT 50%)
		"pages read into cache": xxx // nb doc en cache WS
	}
}

*/
db.etablissements.find({siren: "810720557"}).hint({$natural : 1})
mongotop 2

// +++++++++ mongostat

use mongostat
load('mongostat.js')

// Dans le 2eme client
mongostat
/*
insert, query, update, delete : nb d'opération par seconde
getmore : nb curseur
command
flushes : point de controle, journalisation
dirty : 
used : utilisation du cache WT
vsize, res : quantite de memoire utilisé par le process
qr, qw : longueur d'attente (queue)
ar, aw : nb client ecriture / lecture
*/

// Depuis la 3.4
mongostat -o 'host,time,metrics.document.inserted=nb_inserted'
// On peut definir tous les champs de serverStatus et utiliser rate() pour gerer la periode

mongostat --json // sortie json
