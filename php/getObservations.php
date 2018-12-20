<?php

ob_start("ob_gzhandler");
require_once 'utils.php';
require_once 'DBQueries.php';


$variables = getRequestParameter('variables');
$must_join = json_decode(getRequestParameter('join'));

$pdo = getPDO();
$observations = getObservations($pdo, $variables, $must_join);

header('Content-type:application/json;charset=utf-8');
echo json_encode($observations);

function getObservations($pdo, $variables, $must_join) {
    if($must_join) {
        $query = getQuery($variables);
    }
    else {
        $columns = implode(", ", $variables);
        $query = "SELECT $columns FROM voyages";
    }
    
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_NUM);
}






ob_end_flush();

?>