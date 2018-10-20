<?php

require_once('./utils.php');
$pdo = getPDO();

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