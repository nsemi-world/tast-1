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
    
    $filename =  str_replace('.jpg', '_' . rand(1000, 9999) . '.jpg', $article['imageName']);
    $filename = saveImageToAWS($filename, $article['image']);
    saveArticle($pdo, $article, $filename);
}



function saveImageToAWS($filename, $image) {
    $provider = CredentialProvider::env();
    
    $s3 = new S3Client([
        'version' => 'latest',
        'region'  => 'eu-central-1',
        'provider' => $provider
    ]);
    
    try {
        // Decode the image
        $image_decoded = base64_decode(getImageData($image));
        $im = optimazeImage($image_decoded);
        
        $result = $s3->putObject([
            'Bucket' => 'tastxplorer',
            'Key'    => 'atricles-img/min/' . $filename,
            //'ContentEncoding' => 'base64',
            'ContentType' => 'image/' . $image_optimized->getImageFormat(),
            'Body'   => $image_optimized->getImageBlob(),
            'ACL'   => 'public-read'
        ]);

        // Print the URL to the object.
        $b =  $result['ObjectURL'] . PHP_EOL;
        return $b;
    } catch (S3Exception $e) {
        echo 'S3 Exception' . $e->getMessage() . PHP_EOL;
    }        
}

function optimizeImage($image_decoded) {
    $im = new Imagick();
    $im->readImageBlob($image_decoded);
    // Optimize the image layers
    $im->optimizeImageLayers();

    // Compression and quality
    $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    $im->setImageCompressionQuality($cquality);

    $im->minifyImage();
    return $im;
}

function getImageData($image) {
    $parts = explode('base64,', $image);
    return $parts[1];
}

function saveArticle($pdo, $article, $imageS3Url) {
    $title = $article['title'];
    $author = $article['author'];
    $location = $article['location'];
    $date = date_create('now')->format('Y-m-d H:i:s');
    $description = $article['abstract'];
    $content = $article['content'];
    
    $sql = "INSERT INTO article (title, author, location, date, description, content, imageUrl) VALUES('$title', '$author', '$location', '$date', '$description', '$content', '$imageS3Url')";
    
    $erg = $pdo->query($sql);
    return true;
}


ob_end_flush();
?>