<?php

ob_start("ob_gzhandler");

require_once('./utils.php');
require '../vendor/autoload.php';

use Aws\Credentials\CredentialProvider;
use Aws\S3\S3Client;


//////////////////////////////////////////
// TEST ZONE
//echo json_encode(getenv());
//saveImageToAWS("test-file.txt", "bla");
//////////////////////////////////////////



$AWS_IMG = 'https://s3.eu-central-1.amazonaws.com/tastxplorer/img/';
$pdo = getPDO();


$article = null;
if(isset($_POST['article'])) {
    $article = $_POST['article'];
    
    $filename = $article['imageName'];
    saveImageToAWS($filename, $article['image']);
    saveArticle($pdo, $article, $AWS_IMG . $filename);
}



function saveImageToAWS($filename, $image) {
    $provider = CredentialProvider::env();
    
    $s3 = new S3Client([
        'version' => 'latest',
        'region'  => 'eu-central-1',
        'provider' => $provider
    ]);
    
    $result = $s3->putObject([
        'Bucket' => 'tastxplorer',
        'Key'    => $filename,
        'Body'   => $image
    ]);
}

function saveArticle($pdo, $article, $imageS3Url) {
    $title = $article['title'];
    $author = $article['author'];
    $location = $article['location'];
    $date = date_create('now')->format('Y-m-d H:i:s');
    $content = $article['content'];
    $paragraphs = getParagraphs($content);
    $description = $paragraphs[0];
    
    $sql = "INSERT INTO article (title, author, location, date, description, content, imageUrl) VALUES('$title', '$author', '$location', '$date', '$description', '$content', '$imageS3Url')";
    
    $erg = $pdo->query($sql);
    return true;
}

function getParagraphs($text) {
    $parts = preg_split('/\r\n|\r|\n/', $text);
    return $parts;
}
ob_end_flush();
?>