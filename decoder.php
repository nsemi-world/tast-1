<?php
ob_start('base64_encode');

include 'php/utils.php';

$articleid = null;
$pdo = null;


if(isset($_GET['articleid'])) {
    $articleid = $_GET['articleid'];
    //var_dump($articleid);
    
    $pdo = getPDO();
    $article = getArticle($pdo, $articleid);

    if($article != null) {
        $image = null;
        if($article->imageUrl != null) {
            $image = $article->imageUrl;
        }
        else {
            $image = $article->image;
        }
        
        
        echo base64_decode($image);
    }
}

function getArticle($pdo, $articleid) {
    $sql = "SELECT * FROM article WHERE articleid=$articleid";
    $erg = $pdo->query($sql);
    $result = $erg->fetch(PDO::FETCH_OBJ);
    return $result;
}

// Load image from article with the given article id
    //echo base64_decode($_GET['data']);
ob_end_flush();
?>
