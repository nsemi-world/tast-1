<?php
set_time_limit(0);
ob_start("ob_gzhandler");

require_once('./utils.php');
require '../vendor/autoload.php';



echo "<h1> Using imagick to create responsive images</h1>";


$all_files = glob("./test/images/*.jpg");
foreach ($all_files as $key => $filename) {
    $img = produceImgTag(getSimpleName($filename));
    echo $img . '</br>';
}




function produceImgTag($simple_name) {
    $sizes = [200,600,1000,1400,1800];
    $srcset = [];
    $media_sizes = [];
    foreach($sizes as $key => $size) {
        $name = "./test/images/$size/$simple_name";
        $srcset[] = "$name " . $size . "w";
        $media_sizes[] = "(max-width: $size". "px) $size" . "px";
    }

    $img = '<img ';
    $img .= 'srcset="' . implode(", ", $srcset) . '" ';
    $img .= 'sizes="'  . implode(", ", $media_sizes) . '" ';
    $img .= 'src="' . "$name" .'"';
    $img .= 'style="width: 50%; margin: 0 auto;">';

    return  $img;
}

function getSimpleName($fname) {
    $simple_name = str_replace("./test/images/", '', $fname);
    return $simple_name;
}

ob_end_flush();
?>