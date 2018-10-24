<?php

require_once('./utils.php');
$pdo = getPDO();

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
        . "    COUNT(DISTINCT shipname) as ships, \n"
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