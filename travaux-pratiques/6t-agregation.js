// import base parkings
// mongorestore --drop --gzip --dir /target/to/dump/dir/

$match (where)

$group (group by)

$sort (sort)

$lookup (left outer join = renvoie tts les docs et les correspondances si elles existente)

$project (select)

$skip, $limit (pagination limit + offset)

// OPTIONS

allowDiskUse : à "true", outre passe la limite des 100Mo de traitement en RAM (swap ds le dossier _tmp du dbpath)
cursor : configurer le premier batch size
maxTimeMS : temps limite d'execution
bypassDocumentValidation : si on sauvegarde le resultat ds une collection indexée (avec unique, ...) par ex
readConcern & writeConcern
collation : préciser les spécificité du langage utilisé (accents, caractères speciaux,...)
hint : definir l'index a utiliser
comment : utile pour flaguer et identifier des agg ds les logs par ex.

// PIPELINE

$match : filtrer un flux de document
$out : sauvegarde le resultat
$merge : (new 4.2) $out recursif 
$project : projection des champs en sorties
$group : regroupe les documents en entrée a partir d'une cle definie et applique des opérations accumulatrices
$limit : limit le nombre de documents d'une etape du pipeline
$count : compter les resultats, equivalent : db.collection.aggregate( [{ $group: { _id: null, myCount: { $sum: 1 } } },{ $project: { _id: 0 } }])
$skip : outre passer un nombre de document en entrée definit
$sort : ordonner le resultat en sortie
$unset : retire des champs des documents en sortie

$addFields : ($set : alias) ajouter des champs (de l'info) en sortie
$bucket : groupe en ensemble de document par rapport à un champ et un interval de valeur
$bucketAuto : $bucket automatique
$facet : combine plusieurs pipeline sur les memes donnes en entrées (un seul process)
$geoNear : organiser les resultats géographiquement (plus pres ou loin d'un point)
$graphLookup : un $lookup interne (relation à l'interieur d'un meme document)
$lookup : jointure (left outer join) sur une collection externe
$redact : !!!!!!!!!!!!
$replaceRoot : ($replaceWith : alias) equivalent d'un update sans $set : remplace le doc original par celui specifie
$sample : selection aleatoire de documents
$sortByCount : equivalent : { $group: { _id: <expression>, count: { $sum: 1 } } }, { $sort: { count: -1 } }
$unwind : explose un tableau de sous doc en document a part entiere

$collStats : statistiques d'une collection
$indexStats : statistiques d'utilisation d'un index 
$listSessions : liste toutes les sessions actives
$planCacheStats : statistiques du cache requetes


/******************
*
* NB PARKING PAR delegataire
*
*******************/

// Get tous les delegataires
db.parkings.distinct("delegataire");

// 1 - Nb parking par delegataire
// 2 - La liste des arrondissements dont le delegataire est present
db.parkings.aggregate([
      {$group : {
           _id : "$delegataire",
           nb: { $sum: 1 },
		   arrondissements: {$addToSet: "$arrondissement"} // /!\ $push
      }},
      {$sort: { nb: -1 }},
	  { $limit : 3 },
]);

// 1 - Nb parking par delegataire par arrondissement
// 2 - Ameliorer le resultat
db.parkings.aggregate([
      {$group : {
           _id : "$delegataire",
           nb: { $sum: 1 },
		   arrondissements: {$push: "$arrondissement"}
      }},
      {$sort: { nb: -1 }},
	  { $limit : 3 },
	  {$unwind : "$arrondissements"},
	  {$addFields: {"arrondissement": {$cond: { if: { $lte: [ "$arrondissements", 9 ] }, then: {$concat: ["7500","", {$convert: {input: "$arrondissements", to: "string"}}]}, else: {$concat: ["750","", {$convert: {input: "$arrondissements", to: "string"}}]} }} }},
	  {$group : {
           _id : {$concat: ["$_id","_", "$arrondissement"]}, // {delegataire: "$_id", arrondissement: "$arrondissement"},
           nbParking: { $sum: 1 }
      }},
	  { $addFields: { delegataire:  { $arrayElemAt: [ { $split: [ "$_id", "_" ] }, 0 ] }, arrondissement: { $arrayElemAt: [ { $split: [ "$_id", "_" ] } , 1 ] }} },
	  {$sort: { delegataire: 1, nbParking: -1 }}
]);
//---------------------------
db.parkings.aggregate([
	{$addFields: {
		"arrondissement_full": {
			$concat: [{
				$cond:{
					if: {$lt: ["$arrondissement", 10] }, 
					then: "7500" ,else: "750"
				}}, 
				{$convert: {input: "$arrondissement", to: 2} 
			}]
		}
	}}, 
	{$group: {_id: {delegataire:"$delegataire",arrondissement: "$arrondissement_full"}, nbParkings: {$sum: 1} }}, 
	{$sort: {nbParkings: -1}}, 
	{$project: {_id: {$concat: ["$_id.delegataire", "_","$_id.arrondissement"]}, nbParkings: "$nbParkings" }} ])

//---------------------------
db.parkings.aggregate(
    {$addFields:{"arrondissement": {$toString: {$add: [75000,"$arrondissement"]}}}},
    {$group: {"_id" : {$concat: ["$delegataire","_","$arrondissement"]},"nombre_parking": {$sum: 1}}},
	{$sort: { "nombre_parking": -1 }},
    {$limit: 3}
)
//----------------------------------
db.parkings.aggregate([
        {$group: {"_id": {"delegataire": "$delegataire","arrondissement": "$arrondissement"},"nbParkings": { $sum: 1 },}},
        {$sort: { "nbParkings": -1 }},
        {$project: {"_id": {$concat: ["$_id.delegataire", "_", { "$toString": { $add: [ 75000, "$_id.arrondissement" ] } }]},"nbParkings": 1}}]);

/******************
*
* NB STATIONNEMENT PAR parking
*
*******************/

// 1 - Affluence par parking
db.stationnements.aggregate([
      {$group : {
           _id : "$parking",
           nbStationnement: { $sum: 1 }
      }},
	  {$sort: { nbStationnement: 1 }}
]);
// 2 - TOP 5 / FLOP 5
// 3 - Ajouter les informations sur le parking 
// 4 - Ameliorer les informations

// $mergeObjects : combine plusieurs documents en un unique doc
db.stationnements.aggregate([
      {$group : {
           _id : "$parking",
           nbStationnement: { $sum: 1 }
      }},
	  {$facet: {
		"TOP5" : [
			{$sort: { nbStationnement: -1 }},
			{ $limit : 5 },
	  		{$lookup:{from: "parkings", localField: "_id", foreignField: "_id", as: "parkingInfos"}},
	  		{$project: { "nbStationnement": 1, "parkingInfos.delegataire": 1, "parkingInfos.arrondissement": 1, "parkingInfos.nom": 1} },
	  		{$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$parkingInfos", 0 ] }, "$$ROOT" ] } }},
	  		{$unset: "parkingInfos"}
		],
		"FLOP5" : [
			{$sort: { nbStationnement: 1 }},
			{ $limit : 5 },
	  		{$lookup:{from: "parkings", localField: "_id", foreignField: "_id", as: "parkingInfos"}},
	  		{$project: { "nbStationnement": 1, "parkingInfos.delegataire": 1, "parkingInfos.arrondissement": 1, "parkingInfos.nom": 1} },
	  		{$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$parkingInfos", 0 ] }, "$$ROOT" ] } }},
	  		{$unset: "parkingInfos"}
		]
	  }}
]).pretty();

//-------------------------

db.stationnements.aggregate([
      {$group : {
           _id : "$parking",
           nbStationnement: { $sum: 1 }
      }},
	  {$lookup:{from: "parkings", localField: "_id", foreignField: "_id", as: "parkingInfos"}},
	  {$project: { "nbStationnement": 1, "parkingInfos.delegataire": 1, "parkingInfos.arrondissement": 1, "parkingInfos.nom": 1} },
	  {$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$parkingInfos", 0 ] }, "$$ROOT" ] } }},
	  {$project: { parkingInfos: 0 }}, // {$unset: "parkingInfos"}
	  {$facet: {
		"TOP5" : [{$sort: { nbStationnement: -1 }},{ $limit : 5 }],
		"FLOP5" : [{$sort: { nbStationnement: 1 }},{ $limit : 5 }]
	  }}
]).pretty();

/******************
*
* NB STATIONNEMENT / PARKING PAR arrondissement
*
*******************/
db.stationnements.aggregate([
	  {$match: {parking: {"$in": parkingsIndigo }}} // 3 - Ameliorer le temps de reponse (2 req) + index sur parking
	  {$lookup:{from: "parkings", localField: "parking", foreignField: "_id", as: "parkingInfos"}},
	  {$project: {"parking": 1, "parkingInfos.delegataire": 1, "parkingInfos.arrondissement": 1}},
      {$replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$parkingInfos", 0 ] }, "$$ROOT" ] } }},
	  {$project: { parkingInfos: 0 }},
      {$match: {delegataire: "INDIGO"}}, // 2 - Filtrer par delegataire
      {$addFields: {"arrondissement": {$cond: { if: { $lte: [ "$arrondissement", 9 ] }, then: {$concat: ["7500","", {$convert: {input: "$arrondissement", to: "string"}}]}, else: {$concat: ["750","", {$convert: {input: "$arrondissement", to: "string"}}]} }} }},
	  {$group : {_id : "$arrondissement", nbParking: {$addToSet: "$parking"}, nbStationnement: {$addToSet: "$_id"}}},
	  {$project: { nbParking: {$size: "$nbParking"}, nbStationnement: {$size: "$nbStationnement"} }},
      {$sort: { _id: 1 }}
]).pretty();

// 3 - Ameliorer le temps de reponse (2 req)
var parkingsIndigo = db.parkings.distinct("_id", {delegataire: "INDIGO"});


/******************
*
* NB STATIONNEMENT par trimestre 2018
*
*******************/
db.stationnements.aggregate([
  {$match : { "entree": { $gte: new ISODate("2018-01-01"), $lte: new ISODate("2018-12-31") } }},
  {
    $bucket : {
       groupBy : { $dateToString: { format: "%Y%m", date: "$entree" } },
       boundaries: [ "201801", "201804", "201807", "201810"], // Par mois : boundaries: [ "201801", "201802", "201803", "201804", "201805", "201806", "201807", "201808", "201809", "201810", "201811", "201812"],
		default: "201812",
output: {
        "count": { $sum: 1 }
      }
    }
  }
 ])

db.stationnements.aggregate([
  {$match : { "entree": { $gte: new ISODate("2018-01-01"), $lte: new ISODate("2018-12-31") } }},
  {
    $bucketAuto : {
       groupBy : { $dateToString: { format: "%Y%m", date: "$entree" } },
       buckets: 5 // Par mois : 13
    }
  }
 ], {allowDiskUse:true})

// 2 - Depuis collection vehicule
db.vehicules.aggregate([
	{ $unwind : "$stationnements" },
    {$match : { "stationnements.entree": { $gte: new ISODate("2018-01-01"), $lte: new ISODate("2018-12-31") } }},
  {
    $bucketAuto : {
       groupBy : { $dateToString: { format: "%Y%m", date: "$stationnements.entree" } },
       buckets: 5
    }
  }
 ], {allowDiskUse:true})

/******************
*
* CA abonnement
*
*******************/

