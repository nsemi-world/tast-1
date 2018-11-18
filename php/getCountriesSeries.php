<?php
ob_start("ob_gzhandler");

require_once('./utils.php');
require_once('./DBQueries.php');

$pdo = getPDO();

$year = 0;
if(isset($_GET['year'])) {
    $year = $_GET['year'];
}

if($year == 0) {
    $result = findCountriesSummaries($pdo);
}
else {
    $result = findCountriesSummariesForYear($pdo, $year);
}

$series = [];
foreach($result as $key => $value) {
    if($value->total_embarked > 0) {
        $series[] = [
            $value->name, 
            $value->id, 
            $value->countryCode, 
            $value->total_embarked, 
            $value->total_disembarked, 
            $value->total_died];
    }
}

header('Content-type:application/json;charset=utf-8');
echo json_encode($series);
ob_end_flush();


?>
