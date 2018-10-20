<?php
namespace app\php;

spl_autoload_extensions('.php');

spl_autoload_register(function($name) {
    if($name != 'db\PDO') {
        //echo '<h2>Autoloader: '.$name.'</h2>';
        spl_autoload($name);
    }
});