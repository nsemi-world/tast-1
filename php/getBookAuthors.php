<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

// MAIN

header('Content-type:application/json;charset=utf-8');

$authors = findAuthors();
$authors = isolateSingleAuthors($authors);

$result = [];
foreach($authors as $author) {
    $result[] = [
        'name' => $author, 
        'wikipedia' => getWikipediaArticleIntro($author)
    ];
}

echo json_encode($result);

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
            $result[] = trim($part);
        }
    }    
    return (array) array_unique($result);
}

function getWikipediaArticleIntro($search) {
    $url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=".urlencode($search);
    return json_decode(file_get_contents($url));
}


ob_end_flush();
?>