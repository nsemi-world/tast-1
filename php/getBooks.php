<?php
ob_start("ob_gzhandler");

require_once('./utils.php');

$pdo = getPDO();

$author = getRequestParameter('author');

$extract = getWikipediaArticleIntro($author);
$books   = findBooksFromAuthor($pdo, $author);

$result = [];
$result['author'] = $author;
$result['wikipedia'] = $extract;
$result['books'] = $books;

header('Content-type:application/json;charset=utf-8');
echo json_encode($result);


function getWikipediaArticleIntro($search) {
    $url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=".urlencode($search);
    return json_decode(file_get_contents($url));
}

function findBooksFromAuthor($pdo, $author) {
    $query = "SELECT * FROM affiliate WHERE type='book' AND author='$author'";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

ob_end_flush();
?>