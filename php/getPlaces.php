<?php

//include 'autoloader.php';;

$helper = new VoyagesDatabaseHelper();
$places = $helper->findPlacesSummaries();

$result = [];

foreach($places as $place) {
    $s = [];
    $s[] = $place->place;
    $s[] = $place->region;
    $s[] = $place->voyages;
    $s[] = $place->embarked;
    $s[] = $place->disembarked;
    $s[] = $place->died;
    $result[] = $s;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

?>