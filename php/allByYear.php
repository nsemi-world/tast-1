<?php

header('Content-type:application/json; charset=utf-8');

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$result   = findSummariesByYear($pdo);
echo json_encode($result);



function findSummariesByYear($pdo) {
    $query = querySummariesByYear();
    $erg = $pdo->query($query);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}
function querySummariesByYear() {
    return "SELECT 
                yeardep as year, 
                COUNT(voyageid) as voyages,
                COUNT(DISTINCT shipname) as ships, 
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked,
                SUM(slaximp)-SUM(slamimp) as died
            FROM voyages 
            GROUP BY year
        ";
}



?>