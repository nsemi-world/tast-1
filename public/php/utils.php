<?php
header('Cache-Control: max-age=84600');

function getPDO() {
    
    $ini = parse_ini_file('tast.ini');
    
    // p[0]: mysql://b0bd1223927bc6:707fe6cf
    // p[1]: us-cdbr-iron-east-01.cleardb.net/heroku_1bca0db043051c1?reconnect=true
    
    $host       = $ini['host'];
    $dbname     = $ini['dbname'];
    $username   = $ini['user'];
    $password   = $ini['password'];
    
    $pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);
    return $pdo;
}

function getRequestParameter($param) {
    if(isset($_REQUEST[$param])) {
        return $_REQUEST[$param];
    }
}

