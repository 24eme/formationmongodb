<?php

$pythagore = array(
	'type' => "Feature",
	'properties' => array('marker-color' => "#1cbd39", 'libelle' => "Pythagore FD - Centre de formation"),
	'geometry' => array('type' => "Point", 'coordinates' => array(2.3478, 48.871762))
);
$file = '/.../.../sirenes.restaurants.json';
$result = array();
$result[] = $pythagore;
if (($handle = fopen($file, "r")) !== false) {
	while (($data = fgets($handle, 4096)) !== false) {
		$item = json_decode(str_replace(array('ObjectId(', ')'), '', $data), true);
		$result[] = array(
			'type' => "Feature",
			'properties' => array('libelle' => $item['entreprise']['nomen_long'].' - '.$item['caracteristiques_economiques']['libapet']),
			'geometry' => array('type' => "Point", 'coordinates' => array($item['localisation']['coordinates'][0], $item['localisation']['coordinates'][1]))
		);
	}
	fclose($handle);
}
$json = array(
"type" => "FeatureCollection",
"features" => $result
);
echo json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
