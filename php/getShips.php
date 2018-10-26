<?php

require_once('./utils.php');
$pdo = getPDO();

$ships = findShipsSummaries($pdo);

$res = [];

foreach($ships as $ship) {
    $s = [];
    $s[] = $ship->shipname;
    $s[] = $ship->nvoyages;
    $s[] = $ship->ownera;
    $s[] = $ship->rig;
    $s[] = $ship->embarked;
    $s[] = $ship->disembarked;
    $s[] = $ship->died;
    $res[] = $s;
}
$result['data'] = $res;

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

function findShipsSummaries($pdo) {
    $query = "SELECT shipname, COUNT(voyageid) as nvoyages, ownera, rig, SUM(slaximp) as embarked, SUM(slamimp) as disembarked,  SUM(slaximp) - SUM(slamimp) as died FROM voyages GROUP BY shipname ORDER BY embarked DESC";
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}


?>