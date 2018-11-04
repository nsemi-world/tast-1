<?php
ob_start("ob_gzhandler");

$template = file_get_contents('./templates/template.html');

$head           = file_get_contents('./templates/head.html');
$header         = file_get_contents('./templates/header.html');
$content        = file_get_contents('./templates/participation.html');
$footer         = file_get_contents('./templates/footer.html');

$head .= '<script src="js/datamaps.world.min.js"></script>';
$head .= '<script src="js/participation.js"></script>';

$template = str_replace('###HEAD###', $head, $template);
$template = str_replace('###HEADER###', $header, $template);
$template = str_replace('###CONTENT###', $content, $template);
$template = str_replace('###FOOTER###', $footer, $template);


echo $template;

ob_end_flush();
?>