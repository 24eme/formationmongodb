for (var i=0; i<50000; i++) {
	db.fixtures.insert({"name": "Utilisateur"+i, "created_at": new Date()});
	if (i%2) {
		db.fixtures.update({"name": "Utilisateur"+i}, { $set: {"created_at": new Date(Date.now() - 86400000)}});
	}
	db.fixtures.remove({"name": "Utilisateur"+i});
}
