<?php
    
//include 'autoloader.php';;

$order = 'voyageid';
$include_summary = false;

if(isset($_GET['include_summary'])) {
    $include_summary = $_GET['include_summary'];
}

$helper = new VoyagesDatabaseHelper();
$db_ids = $helper->findAllVoyageIdsOrderBy($order);

$ids = [];
foreach($db_ids as $key => $value) {
    $ids[] = $value->voyageid;
}
$result['ids'] = $ids;

if($include_summary) {
    $summary = $helper->findAllVoyagesSummary();
    $result['summary'] = $summary;
}



header('Content-type:application/json;charset=utf-8');

echo json_encode($result);

?>