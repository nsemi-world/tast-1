<?php
set_time_limit(0);
ob_start("ob_gzhandler");

require_once('./utils.php');
require '../vendor/autoload.php';

/*
$image = new Imagick();
$image->newImage(1, 1, new ImagickPixel('#ffffff'));
$image->setImageFormat('png');
$pngData = $image->getImagesBlob();
echo strpos($pngData, "\x89PNG\r\n\x1a\n") === 0 ? 'Ok' : 'Failed'; 
*/
echo "<h1> Using imagick to create responsive images</h1>";

// Read all jpegs
$all_files = glob("./test/images/original/*.jpg");
foreach ($all_files as $key => $filename) {
    processSingleFile($filename);
}



function processSingleFile($name) {
    $sizes = [
        [320, 240],         
        [640, 480], 
        [800, 600], 
        [1024, 768],
        [1920, 1080]
    ];
    $srcset = [];
    $media_sizes = [];
    foreach($sizes as $key => $size) {
        resize($name, $size[1], $size[0]);
    }
    //file_put_contents("$name".'.txt', htmlspecialchars($img));
}

function getFilename($relativename) {
    $filename = realpath($relativename);
    return $filename;
}


function resize($fname, $width, $height) {
    
    $filename = getFilename($fname);
    
    $im = new Imagick($filename);
    $im->optimizeImageLayers();

    // Compression and quality
    $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    $im->setImageCompressionQuality(75);
    $im->cropThumbnailImage($width, $height);
    
    $filename_out = null;
    $simple_name = str_replace('./test/images/original/', '', $fname);
    $simple_name = explode('.jpg', $simple_name)[0];
    $filename_out =         "C:/xampp/htdocs/websites/tast/php/test/images/processed/$width"
        .'x'
        ."$height/$simple_name.jpg";
    
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


ob_end_flush();
?>