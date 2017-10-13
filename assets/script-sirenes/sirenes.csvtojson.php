<?php

function getLocalisation($adresse) {
	$param = http_build_query([
	 'q' => $adresse,
	 'scrape' => true,
	 'method' => 'get'
	]);
	$http = 'https://api-adresse.data.gouv.fr/search/?'.$param;
	$curl = curl_init($http);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_COOKIESESSION, true);
	$data = json_decode(curl_exec($curl), true);
	curl_close($curl);
	$coordonnees = null;
	if (isset($data['features'])) {
		if ($point = current($data['features'])) {
			if (isset($point['geometry'])) {
				if (isset($point['geometry']['type']) && $point['geometry']['type'] == 'Point') {
					$coordonnees = $point['geometry']['coordinates'];
				}
			}
		}
	}
	return $coordonnees;
}

$csv = '/.../.../sirenes.utf8.csv';
$first = true;
$cacheAdresse = array();
if (($handle = fopen($csv, "r")) !== false) {
	$entetes = null;
	echo "[\n";
    while (($data = fgetcsv($handle, 4096, ";")) !== false) {
		if (!isset($data[0]) || !$data[0] || !isset($data[1])) {
			continue;
		}
		if (!$entetes) {
			$entetes = array_map('strtolower', $data);
			continue;
		}
		$json = array($entetes[0] => $data[0], $entetes[1] => $data[1]);
		for($i=35;$i<=39;$i++) {
			if (!isset($data[$i]))
				continue;
			$adresse[$entetes[$i]] = $data[$i];
		}
		$adresse = array();
		$adresseGeo = array();
		$localisationGeo = array();
		$caracteristiquesEco = array();
		$entreprise = array();
		$societe = array();
		for($i=2;$i<=8;$i++) {
			if (!isset($data[$i]))
				continue;
			$adresse[$entetes[$i]] = $data[$i];
		}
		for($i=16;$i<=21;$i++) {
			if (!isset($data[$i]))
				continue;
			$adresseGeo[$entetes[$i]] = $data[$i];
		}
		for($i=22;$i<=34;$i++) {
			if (!isset($data[$i]))
				continue;
			$localisationGeo[$entetes[$i]] = $data[$i];
		}
		for($i=40;$i<=59;$i++) {
			if (!isset($data[$i]))
				continue;
			$caracteristiquesEco[$entetes[$i]] = $data[$i];
		}
		for($i=60;$i<=65;$i++) {
			if (!isset($data[$i]))
				continue;
			$entreprise[$entetes[$i]] = $data[$i];
		}
		for($i=66;$i<=94;$i++) {
			if (!isset($data[$i]))
				continue;
			$societe[$entetes[$i]] = $data[$i];
		}
		$json['adresse'] = $adresse;
		$json['adresse_geographique'] = $adresseGeo;
		$json['localisation_geographique'] = $localisationGeo;
		$json['caracteristiques_economiques'] = $caracteristiquesEco;
		$json['entreprise'] = $entreprise;
		$json['societe'] = $societe;
		if (isset($data[20]) && $data[20] == 75009) {
			if (isset($data[5]) && isset($data[7]) && isset($data[8])) {
				$adr = $data[5].' '.$data[7].' '.$data[8];
				if (!isset($cacheAdresse[$adr])) {
					if ($coord = getLocalisation($adr)) {
						$cacheAdresse[$adr] = array('type' => "Point", 'coordinates' => $coord);
					}
				}
				if (isset($cacheAdresse[$adr])) {
					$json['localisation'] = $cacheAdresse[$adr];
				}
			}
		}
		if (!$first) {
			echo ",\n";
		}
		echo json_encode($json, JSON_UNESCAPED_UNICODE);
		$first = false;
    }
	echo "\n]";
    fclose($handle);
}
