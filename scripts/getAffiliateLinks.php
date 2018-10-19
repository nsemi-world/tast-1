<?php

include '../lib/classes/autoloader.php';

$keyword = 'title';
$value = 'slave';

if(isset($_GET['keyword'])) {
    $keyword = $_GET['keyword'];
}

if(isset($_GET['value'])) {
    $value = $_GET['value'];
}

$helper = new db\VoyagesDatabaseHelper();
$links = $helper->findAffiliateLinks($keyword, $value);

header('Content-type:application/json;charset=utf-8');
echo json_encode($links);

?>