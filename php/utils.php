<?php
header('Cache-Control: max-age=84600');

function getPDO() {
    $cleardb_url = getEnv("CLEARDB_DATABASE_URL");
    
    // p[0]: mysql://b0bd1223927bc6:707fe6cf
    // p[1]: us-cdbr-iron-east-01.cleardb.net/heroku_1bca0db043051c1?reconnect=true
    
    $parts = getDatabaseUrlParts($cleardb_url);
    $host = $parts['host'];
    $dbname = $parts['dbname'];
    $username = $parts['username'];
    $password = $parts['password'];
    
    $pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);
    return $pdo;
}
function getDatabaseUrlParts($url) {
    $p = explode("@", $url);
    
    $user_pass = explode("//", $p[0])[1];
    $username = explode(":", $user_pass)[0];
    $password = explode(":", $user_pass)[1];
    
    $host_dbname = explode("/", $p[1]);
    $host = $host_dbname[0];
    $dbname = explode("?", $host_dbname[1])[0];
    
    return ['host' => $host, 
            'dbname' => $dbname, 
            'username' => $username, 
            'password' => $password];
}
function getRequestParameter($param) {
    if(isset($_REQUEST[$param])) {
        return $_REQUEST[$param];
    }
}

