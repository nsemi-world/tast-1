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







ob_end_flush();

?>