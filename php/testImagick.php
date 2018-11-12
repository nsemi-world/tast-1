<?php

require_once('./utils.php');
require '../vendor/autoload.php';

use Aws\Credentials\CredentialProvider;
use Aws\S3\S3Client;

$AWS_IMG = 'https://s3.eu-central-1.amazonaws.com/tastxplorer/img/';

/*
$image = new Imagick();
$image->newImage(1, 1, new ImagickPixel('#ffffff'));
$image->setImageFormat('png');
$pngData = $image->getImagesBlob();
echo strpos($pngData, "\x89PNG\r\n\x1a\n") === 0 ? 'Ok' : 'Failed'; 
*/

// Create new imagick object
$relativename = "./test/images/myimage.jpg";
$filename = getFilename($relativename);


$im = compress($filename, 50, true);
saveImageToAws("test", $im);

//resize($filename, 400, 300);


function getFilename($relativename) {
    $filename = realpath($relativename);
    echo "Filename is " . $filename;
    return $filename;
}

function compress($filename, $cquality, $minify) {
    $im = new Imagick($filename);

    // Optimize the image layers
    $im->optimizeImageLayers();

    // Compression and quality
    $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    $im->setImageCompressionQuality($cquality);

    /* Write the image back
    $filename_out = "C:/xampp/htdocs/websites/tast/php/test/images/myimage$cquality.jpg";
    $im->writeImages($filename_out, true);
    */

    if($minify) {
        $im->minifyImage();
        /* Write the image back
        $filename_out_min = "C:/xampp/htdocs/websites/tast/php/test/images/myimage25-min.jpg";
        $im->writeImages($filename_out, true);
        */
    }
    return $im;
}

function resize($filename, $width, $height) {
    $im = new Imagick($filename);
    $im->optimizeImageLayers();
    
    $filename_out = "C:/xampp/htdocs/websites/tast/php/test/images/myimage$width-$height.jpg";
    $im->writeImages($filename_out, true);
    return $im;
}

function saveImageToAWS($filename, $image) {
    $provider = CredentialProvider::env();
    
    $s3 = new S3Client([
        'version' => 'latest',
        'region'  => 'eu-central-1',
        'provider' => $provider
    ]);
    
    try {
        
        $result = $s3->putObject([
            'Bucket' => 'tastxplorer',
            'Key'    => 'atricles-img/min/' . $filename,
            //'ContentEncoding' => 'base64',
            'ContentType' => 'image/' . $image->getImageFormat(),
            'Body'   => $image->getImageBlob(),
            'ACL'   => 'public-read'
        ]);

        // Print the URL to the object.
        $b =  $result['ObjectURL'] . PHP_EOL;
        echo $b;
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


?>