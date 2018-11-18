<?php

ob_start("ob_gzhandler");

require_once('./utils.php');
require_once('./DBQueries.php');
//header('Content-type:application/json;charset=utf-8');


$min = getRequestParameter('min');
$level = getRequestParameter('level');
$type = getRequestParameter('type');
$criteria = getRequestParameter('criteria');

$pdo = getPDO();
$summaries = null;

$summaries = findTopCountriesBy($pdo, 'slaximp');

echo json_encode($summaries);

/*
$partials = prepareResult($summaries, $min, $min + $level);
echo json_encode($partials);
*/


function prepareResult($summaries, $min, $max) {
    $truePositives = [];
    
    $i = 0;
    for($i=0; $i < $min; $i++) {
        $truePositives[] = $summaries[$i];
    }
    
    $falsePositives = [];
    for(; $i < $max; $i++) {
        $k = rand($min, count($summaries)-1);
        echo $k . '<br/>';
        $falsePositives[] = $summaries[$k];
    }
    
    return $truePositive . $falsePositives;
}


ob_end_flush();
?>