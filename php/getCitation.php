<?php

//include 'autoloader.php';;
$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$citation = findCitation($pdo);

header('Content-type:application/json;charset=utf-8');
echo json_encode($citation);



function findCitation($pdo) {
    $query = "SELECT * FROM citations";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result[array_rand($result)];
}

?>