<?php
    
//include 'autoloader.php';;

$order = 'voyageid';
$filter = 'place';
$f = 'Lisbon';
$include_summary = false;

if(isset($_GET['filter'])) {
    $filter = $_GET['filter'];
}
if(isset($_GET['value'])) {
    $f = $_GET['value'];
}
if(isset($_GET['include_summary'])) {
    $include_summary = $_GET['include_summary'];
}


$helper = new VoyagesDatabaseHelper();
$db_ids = $helper->findFilteredVoyageIdsOrderBy($order, $filter, $f);

$ids = [];
foreach($db_ids as $key => $value) {
    $ids[] = $value->voyageid;
}
$result['ids'] = $ids;

if(count($ids) > 0 && $include_summary) {
    $summary = $helper->findFilteredVoyagesSummary($filter, $f);
    $result['summary'] = $summary;
}


header('Content-type:application/json;charset=utf-8');

echo json_encode($result);

?>