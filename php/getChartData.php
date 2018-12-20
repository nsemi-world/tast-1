<?php

ob_start("ob_gzhandler");
require_once 'utils.php';
require_once 'DBQueries.php';

$result = [];
$pdo = getPDO();
$select = getRequestParameter('select');
$groupBy = getRequestParameter('groupBy');
$orderBy = getRequestParameter('orderBy');

if($select != null && $groupBy != null) {
    if($orderBy != null && $orderBy != '' ) {
        $result = getChartData(
            $pdo, 
            $select, 
            $groupBy, 
            $orderBy['variable'], 
            $orderBy['direction']
        );
    } 
    else  {
        $result = getChartData(
            $pdo, 
            $select, 
            $groupBy, 
            $groupBy, 
            'ASC'
        );
    }
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);


function getChartData($pdo, $select, $groupBy, $orderByVariable, $orderByDirection) {
    $query = getQuery([$groupBy, $select.' as value ']) ;
    $query .= " GROUP BY $groupBy ORDER BY $orderByVariable $orderByDirection";
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_NUM);
}


ob_end_flush();
?>