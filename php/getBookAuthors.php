<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

// MAIN

header('Content-type:application/json;charset=utf-8');

$authors = findAuthors();
$authors = isolateSingleAuthors($authors);

echo json_encode($authors);

// end: MAIN

function findAuthors() {
    $pdo = getPDO();
    $query = "SELECT DISTINCT(author) as author FROM affiliate WHERE type='book' ORDER BY author";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function isolateSingleAuthors($authors) {
    $result = [];
    foreach($authors as $author) {
        $parts = explode(", ", $author->author);        
        foreach($parts as $part) {
            $result[] = $part;
        }
    }    
    return (array) array_unique($result);
}

ob_end_flush();
?>