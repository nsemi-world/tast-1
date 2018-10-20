<?php
//include 'autoloader.php';;
$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

$year = 0;
if(isset($_GET['year'])) {
    $year = $_GET['year'];
}

if($year == 0) {
    $result = findCountriesSummaries($pdo);
}
else {
    $result = findCountriesSummariesForYear($pdo, $year);
}

$series = [];
foreach($result as $key => $value) {
    if($value->total_embarked > 0) {
        $series[] = [
            $value->name, 
            $value->id, 
            $value->countryCode, 
            $value->total_embarked, 
            $value->total_disembarked, 
            $value->total_died];
    }
}
header('Content-type:application/json;charset=utf-8');

echo json_encode($series);


function findCountriesSummaries($pdo) {
    $sql = "SELECT \n"
        . "	label as name, \n"
        . "    value as id, \n"
        . "    iso3 as countryCode, \n"
        . "    ships,\n"
        . "    SUM(embarked) as total_embarked,\n"
        . "    SUM(disembarked) as total_disembarked,\n"
        . "    SUM(embarked)-SUM(disembarked) as total_died\n"
        . "	    \n"
        . "FROM\n"
        . "(\n"
        . "    SELECT \n"
        . "        n.label,\n"
        . "        n.value,\n"
        . "        n.iso3,\n"
        . "    	COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	SUM(v.slamimp) as disembarked\n"
        . "    FROM `voyages` as v\n"
        . "    JOIN `natinimp` as n ON n.value=v.natinimp\n"
        . "    GROUP BY n.iso3\n"
        . "\n"
        . "    UNION\n"
        . "\n"
        . "    SELECT \n"
        . "        n.label,\n"
        . "        n.value,\n"
        . "        n.iso3,\n"
        . "    	COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	SUM(v.slamimp) as disembarked    \n"
        . "    FROM `voyages` as v\n"
        . "    JOIN `national` as n ON n.value=v.national\n"
        . "    GROUP BY n.iso3\n"
        . ") AS temp \n"
        . "GROUP BY iso3\n"
        . "ORDER BY total_embarked DESC";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function findCountriesSummariesForYear($pdo, $year) {
    $sql = "SELECT \n"
        . "	label as name, \n"
        . "    value as id, \n"
        . "    iso3 as countryCode, \n"
        . "    ships,\n"
        . "    SUM(embarked) as total_embarked,\n"
        . "    SUM(disembarked) as total_disembarked,\n"
        . "    SUM(embarked)-SUM(disembarked) as total_died\n"
        . "	    \n"
        . "FROM\n"
        . "(\n"
        . "    SELECT \n"
        . "        n.label,\n"
        . "        n.value,\n"
        . "        n.iso3,\n"
        . "    	COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	SUM(v.slamimp) as disembarked\n"
        . "    FROM `voyages` as v\n"
        . "    JOIN `natinimp` as n ON n.value=v.natinimp\n"
        . "    WHERE v.yeardep=$year\n"
        . "    GROUP BY n.iso3\n"
        . "\n"
        . "    UNION\n"
        . "\n"
        . "    SELECT \n"
        . "        n.label,\n"
        . "        n.value,\n"
        . "        n.iso3,\n"
        . "    	COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	SUM(v.slamimp) as disembarked    \n"
        . "    FROM `voyages` as v\n"
        . "    JOIN `national` as n ON n.value=v.national\n"
        . "    WHERE v.yeardep=$year\n"
        . "    GROUP BY n.iso3\n"
        . ") AS temp \n"
        . "GROUP BY iso3\n"
        . "ORDER BY total_embarked DESC";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}


?>
