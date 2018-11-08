<?php
ob_start("ob_gzhandler");

$template = file_get_contents('./templates/template.html');

$head           = file_get_contents('./templates/head.html');
$header         = file_get_contents('./templates/header.html');
$content        = file_get_contents('./templates/privacy.html');
$footer         = file_get_contents('./templates/footer.html');

$my_scripts = '
    <script src="js/privacy.js"></script>
';
$head = str_replace('###MY_SCRIPTS###', $my_scripts, $head);
$content = str_replace('tastXplorer', '<span class="logo"><span>tast</span><span class="loading">X</span><span>plorer</span></span>', $content);

$template = str_replace('###HEAD###', $head, $template);
$template = str_replace('###HEADER###', $header, $template);
$template = str_replace('###CONTENT###', $content, $template);
$template = str_replace('###FOOTER###', $footer, $template);


echo $template;

ob_end_flush();
?>