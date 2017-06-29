var doc =
{
"title": "Vertigo",
"year": 1958,
"genre": ["Drame", "Thriller", "Romance"],
"summary": "Scottie Ferguson, ancien inspecteur de police, est sujet au vertige depuis qu'il a vu mourir son collègue. Elster, son ami, le charge de surveiller sa femme, Madeleine, ayant des tendances suicidaires. Amoureux de la jeune femme Scottie ne remarque pas le piège qui se trame autour de lui et dont il va être la victime.",
"country": "USA",
"director": {
	"last_name": "Hitchcock",
	"first_name": "Alfred",
	"birth_date": "1899-08-13",
	"death_date": "1980-04-29",
	"nationality": "GB​"
},
"actors": [
	{
		"first_name": "James",
		"last_name": "Stewart",
		"birth_date": "1908-05-20",
		"death_date": "1997-07-02",
		"nationality": "USA",
		"role": "John Ferguson"
	},
	{
		"first_name": "Kim",
		"last_name": "Novak",
		"birth_date": "1933-02-13",
		"nationality": "USA",
		"role": "Madeleine Elster"
	}
]
};
db.movies.insert(doc);
