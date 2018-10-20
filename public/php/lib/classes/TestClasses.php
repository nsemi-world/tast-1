<?php

include 'autoloader.php';

echo 'Hello';

use \db as db;
use \info as info;

$voyage_info = new info\VoyageInfo(1);
$stages = $voyage_info->getStages();

echo json_encode($stages);



?>