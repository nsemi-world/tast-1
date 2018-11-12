<?php

require_once('./utils.php');
require '../vendor/autoload.php';

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


compress($filename, 50, true);
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

    // Write the image back
    $filename_out = "C:/xampp/htdocs/websites/tast/php/test/images/myimage$cquality.jpg";
    $im->writeImages($filename_out, true);


    if($minify) {
        $im->minifyImage();
        // Write the image back
        $filename_out_min = "C:/xampp/htdocs/websites/tast/php/test/images/myimage25-min.jpg";
        $im->writeImages($filename_out, true);
    }

}

function resize($filename, $width, $height) {
    $im = new Imagick($filename);
    $im->optimizeImageLayers();
    
    $filename_out = "C:/xampp/htdocs/websites/tast/php/test/images/myimage$width-$height.jpg";
    $im->writeImages($filename_out, true);
    
}

?>