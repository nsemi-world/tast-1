<?php

include '../lib/classes/autoloader.php';

$helper = new db\VoyagesDatabaseHelper();
$owners = $helper->findOwnersSummaries();

$result = [];

foreach($owners as $owner) {
    $s = [];
    $s[] = $owner->name;
    $s[] = $owner->ships;
    $s[] = $owner->voyages;
    $s[] = $owner->crew;
    $s[] = $owner->embarked;
    $s[] = $owner->disembarked;
    $s[] = $owner->died;
    $result[] = $s;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

?>