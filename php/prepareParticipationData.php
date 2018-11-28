<?php
ob_start("ob_gzhandler");

require_once 'utils.php';

$pdo = getPDO();
$countries = getCountries($pdo);
foreach($countries as $k => $c) {
    $countries[$k]['first_voyage'] = getFirstVoyageDateForCountry($pdo, $c['value']);
    $countries[$k]['last_voyage'] = getLastVoyageDateForCountry($pdo, $c['value']);
}

$data = [
    "total_voyages"         => getTotalVoyages($pdo),
    "first_voyage_date"     => getFirstVoyageDate($pdo),
    "last_voyage_date"      => getLastVoyageDate($pdo),
    "countries"             => $countries,
    "first_timeline"        => getFirstTimelineData($pdo),
    "last_timeline"         => getLastTimelineData($pdo)
];

file_put_contents('participation.json', json_encode($data));

ob_end_flush();


function getTotalVoyages($pdo) {
    $sql = "SELECT COUNT(*) FROM voyages";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}

function getCountries($pdo) {
    $sql = "
        SELECT * FROM national UNION SELECT * FROM natinimp ORDER BY label ASC 
    ";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_ASSOC);
}

function getFirstVoyageDate($pdo) {
    $sql = "
        SELECT MIN(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != ''
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != ''
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != ''
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != ''
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != ''
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != ''
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != ''
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != ''
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != ''
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}

function getLastVoyageDate($pdo) {
    $sql = "
        SELECT MAX(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != ''
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != ''
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != ''
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != ''
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != ''
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != ''
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != ''
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != ''
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != ''
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}

function getFirstVoyageDateForCountry($pdo, $id) {
    $sql = "
        SELECT MIN(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != '' AND (national=$id OR natinimp=$id)
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}

function getLastVoyageDateForCountry($pdo, $id) {
    $sql = "
        SELECT MAX(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != '' AND (national=$id OR natinimp=$id)
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != '' AND (national=$id OR natinimp=$id)
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}

function getFirstTimelineData($pdo) {
    return 'first';
}

function getLastTimelineData($pdo) {
    return 'last';
}

?>