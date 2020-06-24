<?php
set_time_limit(0);
ob_start("ob_gzhandler");

require_once('./utils.php');
require '../vendor/autoload.php';

echo "<h1> Using imagick to create responsive images</h1>";


// Read all jpegs
$all_files = glob("./test/images/*.jpg");
foreach ($all_files as $key => $filename) {
    $img = processSingleFile($filename);
    echo '</br>'.htmlspecialchars($img).'</br>';
}

/*

// Create new imagick object
$dir = "./test/images";
$fname = "myimage.jpg";
*/



function processSingleFile($name) {
    $sizes = [
        [320,568],
        [360,640], 
        [360,740], 
        [360,740], 
        [375,667],
        [375,812],
        [412,732], 
        [412, 847], 
        [412, 824], 
        [414,736],
        [414,896],
        [480, 853], 
        [600,960], 
        [768,1024], 
        [800, 1280], 
        [1280, 850]
    ];
    
    
    $srcset = [];
    $media_sizes = [];
    foreach($sizes as $key => $size) {
        $srcset[] = "$name " . $size[0] . "w";
        $media_sizes[] = "(max-width: $size[0]". "px) $size[0]" . "px";
    }

    $img = '<img ';
    $img .= 'srcset="' . implode(", ", $srcset) . '" ';
    $img .= 'sizes="'  . implode(", ", $media_sizes) . '" ';
    $img .= 'src="' . "$name" .'"';
    $img .= 'style="width: 100%;">';
    
    return $img;
}
