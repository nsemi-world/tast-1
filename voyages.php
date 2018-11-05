<?php
ob_start("ob_gzhandler");

$template = file_get_contents('./templates/template.html');

$head           = file_get_contents('./templates/head.html');
$header         = file_get_contents('./templates/header.html');
$content        = file_get_contents('./templates/voyages.html');
$footer         = file_get_contents('./templates/footer.html');

$my_scripts = '
    <script src="https://cdn.knightlab.com/libs/storymapjs/latest/js/storymap-min.js"></script>
    <script src="js/voyages.js"></script>
';
$head = str_replace('###MY_SCRIPTS###', $my_scripts, $head);

$template = str_replace('###HEAD###', $head, $template);
$template = str_replace('###HEADER###', $header, $template);
$template = str_replace('###CONTENT###', $content, $template);
$template = str_replace('###FOOTER###', $footer, $template);


echo $template;

ob_end_flush();
?>