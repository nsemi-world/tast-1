<?php
ob_start("ob_gzhandler");

require_once('./utils.php');
$pdo = getPDO();

$order = 'voyageid';
$filter = 'place';
$f = 'Lisbon';
$include_summary = false;

if(isset($_GET['filter'])) {
    $filter = $_GET['filter'];
}
if(isset($_GET['value'])) {
    $f = $_GET['value'];
}
if(isset($_GET['include_summary'])) {
    $include_summary = $_GET['include_summary'];
}


$db_ids = findFilteredVoyageIdsOrderBy($pdo, $order, $filter, $f);

$ids = [];
foreach($db_ids as $key => $value) {
    $ids[] = $value->voyageid;
}
$result['ids'] = $ids;

if(count($ids) > 0 && $include_summary) {
    $summary = findFilteredVoyagesSummary($pdo, $filter, $f);
    $result['summary'] = $summary;
}


header('Content-type:application/json;charset=utf-8');

echo json_encode($result);



function findFilteredVoyageIdsOrderBy($pdo, $order, $filter, $value) {
    $new_value = $value;
    if($filter == 'place') {
        $new_value = findPlaceNamed($pdo, $value)->value;
    }
    else if( $filter == 'country') {
        $new_value = findCountryNamed($pdo, $value)->value;
    }
    else if( $filter == 'fate') {
        $new_value = findFateNamed($pdo, $value)->value;
    }

    $erg = $pdo->query(queryFilteredVoyagesIdsOrderBy($order, $filter, $new_value));
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function findCountryNamed($pdo, $name) {
    $query = "SELECT * FROM national WHERE label = '$name' UNION SELECT * FROM natinimp WHERE label = '$name' ";
    $erg = $pdo->query($query);
    return $erg->fetch(PDO::FETCH_OBJ);
}
function findFateNamed($pdo, $name) {
    $query = "SELECT * FROM fate WHERE label = '$name' " .
        "UNION SELECT * FROM fate2 WHERE label = '$name' " .
        "UNION SELECT * FROM fate3 WHERE label = '$name' " .
        "UNION SELECT * FROM fate4 WHERE label = '$name'";
    $erg = $pdo->query($query);
    return $erg->fetch(PDO::FETCH_OBJ);
}




function findFilteredVoyagesSummary($pdo, $filter, $value) {
    $new_value = $value;

    if($filter == 'place') {
        $new_value = findPlaceNamed($pdo, $value)->value;
    }     

    $erg = $pdo->query(queryFilteredVoyagesSummary($filter, $new_value));
    return $erg->fetch(PDO::FETCH_OBJ);
}

function queryFilteredVoyagesSummary($filter, $value) {
    $columns = getColumns($filter);
    $conditions = [];
    foreach($columns as $column) {
        $conditions[] = "`" .$column. "`='$value'";
    }

    $condition = implode(" OR ", $conditions);
    $result =  "
            SELECT 
                MIN(YEAR(datedep)) as year_start, 
                MAX(YEAR(datedep)) as year_end, 
                COUNT(voyageid) as voyages, 
                COUNT(DISTINCT shipname) as ships, 
                COUNT(DISTINCT national) as n,  
                COUNT(DISTINCT natinimp) as m,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                SUM(slaximp)-SUM(slamimp) as died 
            FROM voyages 
            WHERE $condition
        ";
    return $result;
}

    
ob_end_flush();
?>