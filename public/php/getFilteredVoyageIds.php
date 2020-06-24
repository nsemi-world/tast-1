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

function findPlaceNamed($pdo, $name) {
    $query = "SELECT * FROM places WHERE label = '$name'";
    $erg = $pdo->query($query);
    return $erg->fetch(PDO::FETCH_OBJ);
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


function queryFilteredVoyagesIdsOrderBy($order, $filter, $value) {
    if($filter == 'date') {
        return queryDatedVoyages($order, $filter, $value);
    }
    else if($filter == 'embarked' || $filter == 'disembarked' || $filter == 'died') {
        return queryEnsalavedVoyages($order, $filter, $value);
    }
    else {
        return queryOtherVoyages($order, $filter, $value);
    }
}
function queryDatedVoyages($order, $filter, $value) {
    $columns = getColumns($filter);
    $conditions = [];

    $value = getNewValue($filter, $value);

    foreach($columns as $column) {
        $conditions[] = "(`" .$column. "`$value"." AND `".$column. "`!=''"." AND `".$column. "`!='0000-00-00')";
    }

    $condition = implode(" OR ", $conditions);

    $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";

    //var_dump($select);

    return $select;
}
function queryEnsalavedVoyages($order, $filter, $value) {
    $value = getNewValue($filter, $value);

    if($filter == 'embarked') {
        $condition = "(`slaximp`$value"." AND slaximp!=''"." AND slaximp!=0) ";
        $select =  "SELECT voyageid FROM voyages WHERE " .
                    $condition .
                    "ORDER BY yeardep, datedep";
    }
    else if($filter == 'disembarked') {
        $condition = "(`slamimp`$value"." AND slamimp!=''"." AND slamimp!=0) ";
        $select =  "SELECT voyageid FROM voyages WHERE " .
                    $condition .
                    "ORDER BY yeardep, datedep";
    }
    else {
        $select = "SELECT voyageid FROM (SELECT voyageid, (`slaximp`-`slamimp`) as died FROM voyages ORDER BY yeardep, datedep) as temp WHERE died$value";
    }


    //var_dump($select);

    return $select;
}
function queryOtherVoyages($order, $filter, $value) {
    $columns = getColumns($filter);
    $conditions = [];

    $value = getNewValue($filter, $value);

    foreach($columns as $column) {
        $conditions[] = "`" .$column. "`='$value'";
    }

    $condition = implode(" OR ", $conditions);

    $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";

    //var_dump($select);

    return $select;
}
function getNewValue($filter, $value) {
    if(substr($value, 0, 2) == '<=' || substr($value, 0, 2) == '>=') {
        if($filter == 'date') {
            return substr($value, 0, 2) . wrap(substr($value, 2));
        }
        else return $value;
    }
    if($value[0] == '<' || $value[0] == '>') {
        if($filter == 'date') {
            return $value[0] . wrap(substr($value, 1));
        }
        else {
            return $value;
        }
    }
    else {
        return $value;
    }
}
function wrap($value) {
    return "'".$value."'";
}
function getColumns($filter) {
    switch($filter) {
        case 'place': return getPlaces();
        case 'country': return getCountries();
        case 'shipname': return getShipname();
        case 'owner': return getOwners();
        case 'captain': return getCaptains();
        case 'fate': return getFate();
        case 'embarked': return ['slaximp'];
        case 'disembarked': return ['slamimp'];
        case 'died': return ['slaximp', 'slamimp'];
        case 'date': return getDateNames();
        default: return []; 
    }
}
function getPlaces() {
    return [
         'placcons', 
         'placreg', 
         'portdep', 
         'ptdepimp', 
         'embport', 
         'embport2', 
         'plac1tra', 
         'plac2tra', 
         'plac3tra', 
         'majbuypt', 
         'mjbyptimp', 
         'npafttra', 
         'arrport', 
         'arrport2', 
         'sla1port', 
         'adpsale1', 
         'adpsale2', 
         'majselpt', 
         'mjslptimp', 
         'constreg', 
         'regisreg', 
         'deptregimp',
         'deptregimp1',
         'embreg',
         'embreg2',
         'regem1',
         'regem2',
         'regem3',
         'majbyimp',
         'majbyimp1',
         'regarr',
         'regarr2',
         'regdis1',
         'regdis2',
         'regdis3',
         'mjselimp',
         'mjselimp1',
         'portret'
    ];
}
function getOwners() {
    return [
        'ownera', 'ownerb', 'ownerc', 'ownerd', 'ownere', 'ownerf', 'ownerg', 'ownerh', 'owneri', 'ownerj', 'ownerk', 'ownerl', 'ownerm', 'ownern', 'ownero', 'ownerp'
    ];
}
function getCaptains() {
    return [
        'captaina', 'captainb', 'captainc'
    ];
}
function getFate() {
    return ['fate', 'fate2', 'fate3', 'fate4'];
}
function getShipname() {
    return ['shipname'];
}
function getCountries() {
    return ['natinimp', 'national'];
}
function getDateNames() {
    return [
        'yearaf',
        'yearam',
        'yeardep'
    ];    
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