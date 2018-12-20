<?php

ob_start("ob_gzhandler");
require_once 'utils.php';
require_once 'DBQueries.php';

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
    $query = getQuery([$groupBy, $select.' as value ']) ;
    $query .= " GROUP BY $groupBy ORDER BY $groupBy DESC";
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_NUM);
}


ob_end_flush();
?>