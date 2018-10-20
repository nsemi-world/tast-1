<?php

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$ships = findShipsSummaries($pdo);

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

function findShipsSummaries($pdo) {
    $query = "SELECT shipname, COUNT(voyageid) as nvoyages, ownera, rig, SUM(slaximp) as embarked, SUM(slamimp) as disembarked,  SUM(slaximp) - SUM(slamimp) as died FROM voyages GROUP BY shipname ORDER BY embarked DESC";
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}


?>