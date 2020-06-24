<?php
ob_start("ob_gzhandler");

require_once 'utils.php';
require_once 'DBQueries.php';

$year = getRequestParameter('year');
$data = [];


$pdo = getPDO();

$data[0] = [
    "total_voyages"         => getTotalVoyagesForYear($pdo, $year),
    "first_voyage_date"     => $year,
    "last_voyage_date"      => $year,
    "countries"             => getDataForYear($pdo, $year)
];

$data[1] = [
    "total_voyages"         => getTotalVoyagesFromToYear($pdo, 1514, $year),
    "first_voyage_date"     => 1514,
    "last_voyage_date"      => $year,
    "countries"             => getDataFromToYear($pdo, 1514, $year)
];

//file_put_contents("json/participation-$year.json", json_encode($data));

header('Content-Type:application/json; charset:utf8');
echo json_encode($data);

ob_end_flush();


?>