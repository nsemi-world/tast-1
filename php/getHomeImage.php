<?php
ob_start("ob_gzhandler");

$name = '../img/African_woman_slave_trade.jpg';
$result = fopen($name, 'rb');

header('Content-type:image/jpeg');
header("Content-Length: " . filesize($name));

fpassthru($fp);

ob_end_flush();
?>