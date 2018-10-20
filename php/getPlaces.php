<?php

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$places = findPlacesSummaries($pdo);

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


function findPlacesSummaries($pdo) {
    $query = "SELECT\n"
        . "	p.label as place, \n"
        . "    q.label as region, \n"
        . "    COUNT(shipname) as ships, \n"
        . "    COUNT(voyageid) as voyages, \n"
        . "    SUM(crew) as crew, \n"
        . "    SUM(slaximp) as embarked, \n"
        . "    SUM(slamimp) as disembarked, \n"
        . "    SUM(slaximp)-SUM(slamimp) as died \n"
        . "FROM voyages v \n"
        . "JOIN places p ON v.mjbyptimp=p.value \n"
        . "JOIN places q ON v.majbyimp=q.value \n"
        . "GROUP BY place";
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

?>