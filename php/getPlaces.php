<?php

require_once('./utils.php');
$pdo = getPDO();

$places = findPlacesSummaries($pdo);

$res = [];

foreach($places as $place) {
    $s = [];
    $s[] = $place->place;
    $s[] = $place->region;
    $s[] = $place->voyages;
    $s[] = $place->embarked;
    $s[] = $place->disembarked;
    $s[] = $place->died;
    $res[] = $s;
}
$result['data'] = $res;

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