<?php

ob_start("ob_gzhandler");
require_once 'utils.php';

$pdo = getPDO();
$variables = getVariables($pdo);

foreach($variables as $variable) {
    $variable->coverage = findVariableCoverage($pdo, $variable->name)->coverage;
}

file_put_contents('variables.json', json_encode($variables));

/*header('Content-type:application/json;charset=utf-8');
echo json_encode($variables);
*/
function getVariables($pdo) {
    $query = "SELECT name, description FROM variables";
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function findVariableCoverage($pdo, $var) {
    $erg = $pdo->query(queryVariableCoverage($var));
    return $erg->fetch(PDO::FETCH_OBJ);
}

function queryVariableCoverage($var) {
    return "SELECT COUNT($var) as coverage FROM voyages WHERE $var != ''";
}



ob_end_flush();

?>