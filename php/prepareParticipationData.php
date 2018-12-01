<?php
set_time_limit(0);
ob_start("ob_gzhandler");

require_once 'utils.php';
require_once 'DBQueries.php';

$preprocess = true;

if($preprocess) {
    $pdo = getPDO();

    $total_voyages = getTotalVoyages($pdo);
    $first_voyage_date = getFirstVoyageDate($pdo);
    $last_voyage_date = getLastVoyageDate($pdo);
    $countries = getData($pdo);


    $data['all'] = [
        "total_voyages"         => $total_voyages,
        "first_voyage_date"     => $first_voyage_date,
        "last_voyage_date"      => $last_voyage_date,
        "countries"             => $countries
    ];

    $data['year'] = [];
    for($i = $first_voyage_date; $i<= $last_voyage_date; $i++) {
        $t = getTotalVoyagesForYear($pdo, $i);
        $f = $i;
        $l = $i;
        $c = getDataForYear($pdo, $i);
        $data['year'][] = 
            ["total_voyages"         => $t,
             "first_voyage_date"     => $f,
             "last_voyage_date"      => $l,
             "countries"             => $c];
    }

    file_put_contents('participation.json', json_encode($data));
}


echo file_get_contents('participation.json');
ob_end_flush();
?>