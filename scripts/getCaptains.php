<?php

include 'autoloader.php';


$helper = new VoyagesDatabaseHelper();
$captains = $helper->findCaptainsSummaries();

$result = [];

foreach($captains as $captain) {
    $s = [];
    $s[] = $captain->name;
    $s[] = $captain->ships;
    $s[] = $captain->voyages;
    $s[] = $captain->crew;
    $s[] = $captain->embarked;
    $s[] = $captain->disembarked;
    $s[] = $captain->died;
    $result[] = $s;
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

?>