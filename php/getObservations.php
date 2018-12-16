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


function getQuery($variables) {
    $columns = [];
    $joins = [];

    foreach($variables as $key => $value) {
        if(is_labelled($value)) {
            array_push($columns, "$value.label AS $value");
            array_push($joins, "LEFT JOIN $value $value ON v.`$value`=$value.value");
        }
        else if(is_place($value)) {
            array_push($columns, "$value.label AS $value");
            array_push($joins, "LEFT JOIN places $value ON v.`$value`=$value.value");
        }

        else if($value == 'xmimpflag') {
            array_push($columns, "CONCAT($value.flag, ' ', $value.period) as grouping");
            array_push($joins, "JOIN $value $value ON v.`$value`=$value.value");
        }
        else {
            array_push($columns, $value);
        }
    }

    $select = "SELECT ";
    $select .= implode(", ", $columns);
    $select .= " FROM voyages v ";
    $select .= implode(" ", $joins);

    //var_dump($select);

    return $select;
}




ob_end_flush();

?>