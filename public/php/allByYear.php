<?php
ob_start("ob_gzhandler");

require_once('./utils.php');
$pdo = getPDO();

$result   = findSummariesByYear($pdo);

header('Content-type:application/json; charset=utf-8');
echo json_encode($result);

function findSummariesByYear($pdo) {
    $query = querySummariesByYear();
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}
function querySummariesByYear() {
    return "SELECT 
                yeardep as year, 
                COUNT(voyageid) as voyages,
                COUNT(DISTINCT shipname) as ships, 
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked,
                SUM(slaximp)-SUM(slamimp) as died
            FROM voyages 
            GROUP BY year
        ";
}



ob_end_flush();
?>