<?php
ob_start("ob_gzhandler");

require_once('./utils.php');

$pdo = getPDO();

$author = getRequestParameter('author');
if($author != null && $author != '') {
    $extract = getWikipediaArticleIntro($author);
    $books   = findBooksFromAuthor($pdo, $author);

    $result = [];
    $result['author'] = $author;
    $result['wikipedia'] = $extract;
    $result['books'] = $books;
}

else {
    $result = getAllBooks($pdo);
}


header('Content-type:application/json;charset=utf-8');
echo json_encode($result);


function getWikipediaArticleIntro($search) {
    $url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=".urlencode($search);
    return json_decode(file_get_contents($url));
}

function findBooksFromAuthor($pdo, $author) {
    $query = "SELECT * FROM affiliate WHERE type='book' AND author LIKE '%{$author}%'";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function getAllBooks($pdo) {
    $query = "SELECT * FROM affiliate WHERE type='book' ORDER BY title ASC";
    $erg = $pdo->query($query);
    $result = $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

ob_end_flush();
?>