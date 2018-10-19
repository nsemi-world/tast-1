<?php
include 'classes/autoloader.php';

$year = 0;
if(isset($_GET['year'])) {
    $year = $_GET['year'];
}

$helper = new \db\VoyagesDatabaseHelper();
if($year == 0) {
    $result = $helper->findCountriesSummaries();
}
else {
    $result = $helper->findCountriesSummariesForYear($year);
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

?>
