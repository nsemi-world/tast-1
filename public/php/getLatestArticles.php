<?php

ob_start("ob_gzhandler");

require_once('./utils.php');
$pdo = getPDO();

$MAX_ARTICLES = 100;
$articles = [];
$articleid = null;

if(isset($_GET['articleid'])) {
   $articleid = $_GET['articleid'];
   $articles = getArticle($pdo, $articleid);
}

else {
    $articles = getLatestArticles($pdo, $MAX_ARTICLES);
}

header('Content-type:application/json;charset=utf-8');

echo json_encode($articles);
ob_end_flush();



function getLatestArticles($pdo, $quantity) {
    $sql = "SELECT * FROM article ORDER BY date DESC LIMIT $quantity";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function getArticle($pdo, $articleid) {
    $sql = "SELECT * FROM article WHERE articleid=$articleid";
    //var_dump($sql);
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}
?>