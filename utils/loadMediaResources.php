<?php

include 'lib/classes/VoyagesDatabaseHelper.php';
header('Content-type:application/json;charset=utf-8');


$helper = new VoyagesDatabaseHelper();
$media = $helper->findAllVoyageMedia();

echo json_encode($media);


?>