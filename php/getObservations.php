<?php

ob_start("ob_gzhandler");
require_once 'utils.php';


$variables = getRequestParameter('variables');

$pdo = getPDO();
$observations = getObservations($pdo, $variables);

header('Content-type:application/json;charset=utf-8');
echo json_encode($observations);

function getObservations($pdo, $variables) {
    $columns = implode(", ", $variables);

    /*$where = [];
    foreach($variables as $variable) {
        $where[] = "($variable != '' AND $variable IS NOT NULL)";
    }
    $where = implode(" AND ", $where);
    */
    $query = "SELECT $columns FROM voyages";
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}






ob_end_flush();

?>