<?php

ob_start("ob_gzhandler");

require_once('./utils.php');
$pdo = getPDO();

$articles = getLatestArticles($pdo, 1);

header('Content-type:application/json;charset=utf-8');

echo json_encode($articles);
ob_end_flush();



function getLatestArticles($pdo, $quantity) {
    $sql = "SELECT * FROM article ORDER BY date LIMIT $quantity";
    //var_dump($sql);
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}
?>