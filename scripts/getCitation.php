<?php

include 'autoloader.php';


$helper = new VoyagesDatabaseHelper();
$citation = $helper->findCitation();

header('Content-type:application/json;charset=utf-8');
echo json_encode($citation);




?>