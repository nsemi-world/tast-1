<?php

require_once('./utils.php');
require '../vendor/autoload.php';



// Create new imagick object
$im = new Imagick("test/images/myimage.jpg");

// Optimize the image layers
$im->optimizeImageLayers();

// Compression and quality
$im->setImageCompression(Imagick::COMPRESSION_JPEG);
$im->setImageCompressionQuality(25);

// Write the image back
$im->writeImages("test/images/myimage25.jpg", true);




?>