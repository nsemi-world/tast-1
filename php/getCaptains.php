<?php

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$captains = findCaptainsSummaries($pdo);

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

function findCaptainsSummaries($pdo) {
    $query = 
          "SELECT \n"
        . "	   captaina as name, \n"
        . "    COUNT(shipname) as ships, \n"
        . "    COUNT(voyageid) as voyages, \n"
        . "    SUM(crew) as crew, \n"
        . "    SUM(slaximp) as embarked,\n"
        . "    SUM(slamimp) as disembarked,\n"
        . "    SUM(slaximp)-SUM(slamimp) as died\n"
        . "\n"
        . "FROM voyages\n"
        . "WHERE captaina != ''\n"
        . "GROUP BY captaina";
    //var_dump($query);
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}
    


?>