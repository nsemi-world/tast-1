<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

// MAIN

header('Content-type:application/json;charset=utf-8');

$authors = findAuthors();
echo json_encode($authors);

// end: MAIN

function findAuthors() {
    $pdo = getPDO();
    $query = "SELECT DISTINCT(author) FROM affiliate WHERE type='book'";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

ob_end_flush();
?>