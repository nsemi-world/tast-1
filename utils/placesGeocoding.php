<?php

include 'lib/classes/VoyagesDatabaseHelper.php';

function cityExistsAsDBPlace($city, $helper) {
    return $helper->placeExists($city);
}

function dbUpdate($helper, $city, $latitude, $longitude) {
    $erg = $helper->updatePlace($city, $latitude, $longitude);
}

set_time_limit(0);
header('Content-type:application/json;charset=utf-8');

$helper = new VoyagesDatabaseHelper();
$places = $helper->findPlaces();
//echo json_encode($places);

// Update all lat long values to null
foreach($places as $place) {
    $geo = $helper->findLatLong($place->label);
    if($geo) {
        dbUpdate($helper, $place->label, $geo->Latitude, $geo->Longitude);
    }
}


$places = $helper->findPlaces();
//echo json_encode($places);


?>