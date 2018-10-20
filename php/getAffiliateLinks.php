<?php

include 'autoloader.php';;

$keyword = 'title';
$value = 'slave';

if(isset($_GET['keyword'])) {
    $keyword = $_GET['keyword'];
}

if(isset($_GET['value'])) {
    $value = $_GET['value'];
}

$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$links = findAffiliateLinks($pdo, $keyword, $value);

header('Content-type:application/json;charset=utf-8');
echo json_encode($links);


function findAffiliateLinks($pdo, $keyword, $value) {
    $query = "SELECT * FROM affiliate WHERE $keyword LIKE \"%$value%\"";
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}
    

?>