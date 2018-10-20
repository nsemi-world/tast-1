<?php
    
include 'autoloader.php';;

// MAIN

$voyageid = 1;

if(isset($_GET['voyageid'])) {
    $voyageid = $_GET['voyageid'];
}

//-------------------------------------
// Prepare answer
//-------------------------------------
$helper = new db\VoyagesDatabaseHelper();
$vinfo = new info\VoyageInfo($voyageid, $helper);

$result = [];
$result['itinerary'] = $vinfo->getStages();
$result['details']   = $vinfo->getDetails();
$result['summary']   = $vinfo->getSummary();

header('Content-type:application/json;charset=utf-8');

echo json_encode($result);

?>