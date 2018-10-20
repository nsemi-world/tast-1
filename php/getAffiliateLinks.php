<?php

require_once('./utils.php');
$pdo = getPDO();

$keyword = 'title';
$value = 'slave';

if(isset($_GET['keyword'])) {
    $keyword = $_GET['keyword'];
}

if(isset($_GET['value'])) {
    $value = $_GET['value'];
}

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