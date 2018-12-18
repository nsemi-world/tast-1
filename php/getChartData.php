<?php

ob_start("ob_gzhandler");
require_once 'utils.php';

$result = [];
$pdo = getPDO();
$select = getRequestParameter('select');
$groupBy = getRequestParameter('groupBy');

if($select != null && $groupBy != null) {
    $result = getChartData($pdo, $select, $groupBy);
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);


function getChartData($pdo, $select, $groupBy) {
    $query = "SELECT $groupBy, $select as value FROM voyages GROUP BY $groupBy ORDER BY $groupBy";
    
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_NUM);
}


ob_end_flush();
?>