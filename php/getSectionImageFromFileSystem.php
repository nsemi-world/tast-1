<?php
ob_start("ob_gzhandler");

require_once('./utils.php');

$name = getRequestParameter('name');
$width = getRequestParameter('width');
$height = getRequestParameter('height');

$image = null;

$input = realpath("../php/test/images/original/$name");

$name_no_ext = str_replace('.jpg', '', $name);
$output = "./test/images/processed/$name_no_ext-$width-$height.jpg";

if(!existsImage($output)) {
    $im = resizeImage($name_no_ext, $width, $height);
    $output = storeImageInFileSystem($im, $width, $height, '../php/test/images/processed', $name_no_ext);
}





header('Content-type:application/json;charset=utf-8');
echo json_encode(['url' => "php/test/images/processed/$name_no_ext-$width-$height.jpg"]);




function getRequestParameter($param) {
    if(isset($_REQUEST[$param])) {
        return $_REQUEST[$param];
    }
}

function existsImage($output) {
    return file_exists($output);
}

function readImage($filename, $width, $height){
    $fcontent = file_get_contents($filename);
    return $fcontent;
}

function resizeImage($name, $width, $height) {
    $input = realpath("./test/images/original/$name.jpg");
    
    $im = new Imagick($input);
    $im->optimizeImageLayers();

    // Compression and quality
    $im->setImageCompression(Imagick::COMPRESSION_JPEG);
    $im->setImageCompressionQuality(85);
    $im->cropThumbnailImage($width, $height);
    
    return $im;
}

function storeImageInFileSystem($im, $width, $height, $dir, $name) {
    $output = realpath($dir);
    $output .= "/$name-$width-$height.jpg";
    $im->writeImages($output, true);
    $im->destroy();
    return $output;
}

ob_end_flush();
?>