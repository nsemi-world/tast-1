<?php

ob_start("ob_gzhandler");

require_once('./utils.php');
$pdo = getPDO();


$article = null;
if(isset($_POST['article'])) {
    $article = $_POST['article'];
    saveArticle($pdo, $article);
}
else {
    
}

header('Content-type:application/json;charset=utf-8');
echo json_encode(['status' => true]);


function saveArticle($pdo, $article) {
    $image = $article['image'];
    $title = $article['title'];
    $author = $article['author'];
    $location = $article['location'];
    $date = date_create('now')->format('Y-m-d H:i:s');
    $content = $article['content'];
    $paragraphs = getParagraphs($content);
    $description = $paragraphs[0];
    
    $sql = "INSERT INTO article (title, author, location, date, description, content, image) VALUES('$title', '$author', '$location', '$date', '$description', '$content', '$image')";
    
    $erg = $pdo->query($sql);
    //var_dump($erg);
    return true;
}

function getParagraphs($text) {
    $parts = preg_split('/\r\n|\r|\n/', $text);
    return $parts;
}
ob_end_flush();
?>