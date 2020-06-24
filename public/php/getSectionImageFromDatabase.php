<?php
ob_start("ob_gzhandler");

require_once('./utils.php');
header('Content-type:application/json;charset=utf-8');

$name = getRequestParameter('name');
print_r($name);

if($name) {
    $image = getImage($name);
    if($image) {
        echo json_encode(['url' => toDataUrl($image->data)]);
    }
}


function getImage($name) {
    $query = "SELECT * FROM images WHERE `name`='$name'";
    $pdo = getPDO();
    $erg = $pdo->query($query);
    $result = $erg->fetch(PDO::FETCH_OBJ);
    return $result;
}

function toDataUrl($blob) {
    return 'data:image/jpg;base64,' . base64_encode($blob);
}

ob_end_flush();
?>