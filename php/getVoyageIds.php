<?php
    
$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);


$order = 'voyageid';
$include_summary = false;

if(isset($_GET['include_summary'])) {
    $include_summary = $_GET['include_summary'];
}


$db_ids = findAllVoyageIdsOrderBy($pdo, $order);

$ids = [];
foreach($db_ids as $key => $value) {
    $ids[] = $value->voyageid;
}
$result['ids'] = $ids;

if($include_summary) {
    $summary = findAllVoyagesSummary($pdo);
    $result['summary'] = $summary;
}



header('Content-type:application/json;charset=utf-8');

echo json_encode($result);



function findAllVoyageIdsOrderBy($pdo, $order) {
    $erg = $pdo->query(queryAllVoyagesIdsOrderBy($order));
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function queryAllVoyagesIdsOrderBy($order) {
    return "SELECT voyageid FROM voyages ORDER BY yeardep, datedep";
}

function findAllVoyagesSummary($pdo) {
    $erg = $pdo->query(queryAllVoyagesSummary());
    return $erg->fetch(PDO::FETCH_OBJ);
}

function queryAllVoyagesSummary() {
    return "
            SELECT 
                MIN(yeardep) as year_start,
                MAX(yeardep) as year_end, 
                COUNT(voyageid) as voyages, 
                COUNT(DISTINCT shipname) as ships, 
                COUNT(DISTINCT national) as n,  
                COUNT(DISTINCT natinimp) as m,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                SUM(slaximp)-SUM(slamimp) as died 
            FROM voyages 
        ";
}





?>