# Formation MongoDB

Contenu de la formation MongoDB, les contenus sont réutilisables sous license CC-BY-SA

## Installation

La documentation MongoDB offre un bon guide d'installation de MongoDB sous Debian dans sa version 3.

[Install MongoDB 3.2 on Debian](https://docs.mongodb.com/v3.2/tutorial/install-mongodb-on-debian/)
[Install MongoDB 3.4 on Debian](https://docs.mongodb.com/v3.4/tutorial/install-mongodb-on-debian/)

## Présentation

Les slides sont découpés en 3 parties :

* La théorie, présentant l'historique et l'intérêt du projet MongoDB
* La pratique, présentant les fonctionnalités d'utilisation de la base MongoDB
* L'administration, présentant les outils d'administration de MongoDB

Cette présentation est sous format HTML, réalisée avec le framework reveal.js, disponible dans le dossier [slides](slides/)

## Pratique

Les travaux pratiques sont divisés par type de fonctionnalité et regroupés dans le dossier [travaux pratiques](travaux-pratiques/)

## Jeux de données

La formation utilise 2 bases de données différentes :

* La base movies, disponible dans le dossier [assets/base-movies](assets/base-movies/) et importable via la commande : mongorestore -d 'nom_base' /target/to/bson
* La base sirenes (base stock et non mise à jour quotidienne), base de données des entreprises française mise à disposition par le gouvernement [data.gouv.fr](http://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/)

## Ressources intéressantes

* [Documentation officielle MongoDB 3.2](https://docs.mongodb.com/v3.2/reference/)
* [Documentation officielle MongoDB 3.4](https://docs.mongodb.com/v3.4/reference/)
* [Outils disponible pour MongoDB](http://mongodb-tools.com/)
* [Documentation de la base sirenes](http://sirene.fr/sirene/public/static/contenu-fichiers)
