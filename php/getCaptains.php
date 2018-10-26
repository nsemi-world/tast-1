<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

$pdo = getPDO();

$captains = findCaptainsSummaries($pdo);

$res = [];

foreach($captains as $captain) {
    $s = [];
    $s[] = $captain->name;
    $s[] = $captain->ships;
    $s[] = $captain->voyages;
    $s[] = $captain->crew;
    $s[] = $captain->embarked;
    $s[] = $captain->disembarked;
    $s[] = $captain->died;
    $res[] = $s;
}
$result['data'] = $res;

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);

function findCaptainsSummaries($pdo) {
    $query = 
          "SELECT \n"
        . "	   captaina as name, \n"
        . "    COUNT(DISTINCT shipname) as ships, \n"
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
    

    
ob_end_flush();

?>