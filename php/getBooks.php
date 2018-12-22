<?php
ob_start("ob_gzhandler");

require_once('./utils.php');

$pdo = getPDO();

$orderBy = getRequestParameter('orderBy');
$books = findBooks($pdo, getInternalOrderBy($orderBy));

header('Content-type:application/json;charset=utf-8');
echo json_encode($books);


function findBooks($pdo, $orderBy) {
    $query = "SELECT * FROM affiliate WHERE type='book' ORDER BY $orderBy";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function getInternalOrderBy($orderBy) {
    if($orderBy == null || $orderBy == '') {
        return 'title';
    }
    
    switch($orderBy) {
        case 'author': return 'author';
        default: return 'title';
    }
}

ob_end_flush();
?>