<?php
ob_start("ob_gzhandler");

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

$links = findAllAffiliatedLinks($pdo);

header('Content-type:application/json;charset=utf-8');
echo json_encode($links);


function findAffiliatedLinks($pdo, $keyword, $value) {
    $query = "SELECT * FROM affiliate WHERE $keyword LIKE \"%$value%\"";
    $erg = $pdo->query($query);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function findAllAffiliatedLinks($pdo) {
    $result = [];
    $authors = findAllAuthors($pdo);
    foreach($authors as $author) {
        $name = $author->author;
        $books = findAllBooksFrom($pdo, $name);
        $citation = findCitationFrom($pdo, $name);
        $result[$name] = ['citation' => $citation, 'books' => $books];
    }    
    return $result;
}

function findAllAuthors($pdo) {
    $sql = "SELECT DISTINCT(author) FROM affiliate";
    $erg = $pdo->query($sql);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function findAllBooksFrom($pdo, $authorName) {
    $sql = "SELECT * FROM affiliate WHERE author LIKE \"%$authorName%\"";
    
    $erg = $pdo->query($sql);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

function findCitationFrom($pdo, $name) {
    $sql = "SELECT quote FROM citations WHERE author LIKE \"%$name%\"";
    
    $erg = $pdo->query($sql);
    $result =  $erg->fetchAll(PDO::FETCH_OBJ);
    return $result;
}

    
ob_end_flush();
?>