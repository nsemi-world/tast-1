<?php

include 'autoloader.php';;

$helper = new db\VoyagesDatabaseHelper();
$citation = $helper->findCitation();

header('Content-type:application/json;charset=utf-8');
echo json_encode($citation);




?>