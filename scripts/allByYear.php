<?php

include 'autoloader.php';
header('Content-type:application/json; charset=utf-8');

$helper = new VoyagesDatabaseHelper();
$result   = $helper->findSummariesByYear();
echo json_encode($result);


?>