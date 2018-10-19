<?php

include '../lib/classes/autoloader.php';

$helper = new \db\VoyagesDatabaseHelper();
$ships = $helper->findShipsSummaries();

$result = [];

foreach($ships as $ship) {
    $s = [];
    $s[] = $ship->shipname;
    $s[] = $ship->nvoyages;
    $s[] = $ship->ownera;
    $s[] = $ship->rig;
    $s[] = $ship->embarked;
    $s[] = $ship->disembarked;
    $s[] = $ship->died;
    $result[] = $s;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

?>