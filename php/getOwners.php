<?php

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$owners = findOwnersSummaries($pdo);

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

function findOwnersSummaries($pdo) {
    $query = 
          "SELECT \n"
        . "	   ownera as name, \n"
        . "    COUNT(shipname) as ships, \n"
        . "    COUNT(voyageid) as voyages, \n"
        . "    SUM(crew) as crew, \n"
        . "    SUM(slaximp) as embarked,\n"
        . "    SUM(slamimp) as disembarked,\n"
        . "    SUM(slaximp)-SUM(slamimp) as died\n"
        . "\n"
        . "FROM voyages\n"
        . "WHERE ownera != ''\n"
        . "GROUP BY ownera";

    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

?>