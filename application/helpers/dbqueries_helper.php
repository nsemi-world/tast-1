<?php

/*
function findCountriesSummaries($pdo) {
    $sql = "SELECT \n"
        . "	label as name, \n"
        . "    value as id, \n"
        . "    iso3 as countryCode, \n"
        . "    iso2 as countryCode2, \n"
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
        . "        n.iso2,\n"
        . "    	   COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	   SUM(v.slamimp) as disembarked\n"
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
        . "        n.iso2,\n"
        . "    	   COUNT(DISTINCT shipname) as ships,\n"
        . "        SUM(v.slaximp) as embarked,\n"
        . "    	   SUM(v.slamimp) as disembarked    \n"
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
        . "    iso2 as countryCode2, \n"
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
        . "        n.iso2,\n"
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
        . "        n.iso2,\n"
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
function getQueryTopCountriesGroupByName($myvar, $limit) {
    $sql = "
        SELECT n.label as name, n.iso2 as iso2, SUM($myvar) as total 
        FROM voyages as v
            JOIN (SELECT * FROM national UNION SELECT * FROM natinimp) as n 
                ON (v.national=n.value OR v.natinimp=n.value)
        WHERE n.label != 'Other'
        GROUP BY n.label
        ORDER BY total DESC
    ";
    
    return $sql;
}
function getData($pdo) {
    $sql = "
        SELECT 
            MIN(fdate) as fdate,
            MAX(ldate) as ldate,
            (MAX(ldate) - MIN(fdate) + 1) as duration,
            name,
            iso2,
            iso3,
            SUM(nvoyages) as nvoyages,
            SUM(nships) as nships,
            SUM(embarked) as embarked,
            SUM(disembarked) as disembarked,
            SUM(died) as died
        FROM (
            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp = '')
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN natinimp as n 
                ON (n.value = v.natinimp)
            WHERE (v.national = '' AND v.natinimp != '')
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp != '')
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate, 
                MAX(v.yeardep) as ldate, 
                'Unknown' as name, 
                '??' as iso2, 
                '???' as iso3,
                COUNT(voyageid) as nvoyages, 
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                (SUM(slaximp)-SUM(slamimp)) as died 
            FROM voyages v 
            WHERE (v.national = '' AND v.natinimp = '')
            ) as all_data
        GROUP BY iso2
    ";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_ASSOC);    
}
function getTotalVoyages($pdo) {
    $sql = "SELECT COUNT(*) FROM voyages";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}
function getFirstVoyageDate($pdo) {
    $sql = "SELECT MIN(yeardep) FROM `voyages`";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}
function getLastVoyageDate($pdo) {
    $sql = "SELECT MAX(yeardep) FROM `voyages`";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}
function getDataForYear($pdo, $year) {
    $sql = "
        SELECT 
            MIN(fdate) as fdate,
            MAX(ldate) as ldate,
            (MAX(ldate) - MIN(fdate) + 1) as duration,
            name,
            iso2,
            iso3,
            SUM(nvoyages) as nvoyages,
            SUM(nships) as nships,
            SUM(embarked) as embarked,
            SUM(disembarked) as disembarked,
            SUM(died) as died
        FROM (
            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp = '' AND v.yeardep =$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN natinimp as n 
                ON (n.value = v.natinimp)
            WHERE (v.national = '' AND v.natinimp != '' AND v.yeardep =$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp != '' AND v.yeardep =$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate, 
                MAX(v.yeardep) as ldate, 
                'Unknown' as name, 
                '??' as iso2, 
                '???' as iso3,
                COUNT(voyageid) as nvoyages, 
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                (SUM(slaximp)-SUM(slamimp)) as died 
            FROM voyages v 
            WHERE (v.national = '' AND v.natinimp = '' AND v.yeardep=$year)
            ) as all_data
            WHERE iso2 != ''
        GROUP BY iso2
    ";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_ASSOC);    
}
function getTotalVoyagesForYear($pdo, $year) {
    $sql = "SELECT COUNT(*) FROM voyages WHERE yeardep=$year";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}
function getDataFromToYear($pdo, $begin, $year) {
    $sql = "
        SELECT 
            MIN(fdate) as fdate,
            MAX(ldate) as ldate,
            (MAX(ldate) - MIN(fdate) + 1) as duration,
            name,
            iso2,
            iso3,
            SUM(nvoyages) as nvoyages,
            SUM(nships) as nships,
            SUM(embarked) as embarked,
            SUM(disembarked) as disembarked,
            SUM(died) as died
        FROM (
            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp = '' AND yeardep IS NOT NULL AND yeardep>=$begin AND yeardep<=$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN natinimp as n 
                ON (n.value = v.natinimp)
            WHERE (v.national = '' AND v.natinimp != '' AND yeardep IS NOT NULL AND yeardep>=$begin AND yeardep<=$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate,
                MAX(v.yeardep) as ldate,
                n.label as name,
                n.iso2 as iso2,
                n.iso3 as iso3,
                COUNT(voyageid) as nvoyages,
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked,
                SUM(slamimp) as disembarked,
                (SUM(slaximp)-SUM(slamimp)) as died
            FROM voyages v
                LEFT JOIN national as n 
                ON (n.value = v.national)
            WHERE (v.national != '' AND v.natinimp != '' AND yeardep IS NOT NULL AND  yeardep>=$begin AND yeardep<=$year)
            GROUP BY n.iso2

            UNION

            SELECT 
                MIN(v.yeardep) as fdate, 
                MAX(v.yeardep) as ldate, 
                'Unknown' as name, 
                '??' as iso2, 
                '???' as iso3,
                COUNT(voyageid) as nvoyages, 
                COUNT(DISTINCT shipname) as nships,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                (SUM(slaximp)-SUM(slamimp)) as died 
            FROM voyages v 
            WHERE (v.national = '' AND v.natinimp = '' AND yeardep IS NOT NULL AND  yeardep>=$begin AND yeardep<=$year)
            ) as all_data
        WHERE fdate IS NOT NULL
        GROUP BY iso2
    ";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_ASSOC);    
}
function getTotalVoyagesFromToYear($pdo, $begin, $year) {
    $sql = "SELECT COUNT(*) FROM voyages WHERE yeardep>=$begin AND yeardep<=$year";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM)[0];
}
*/

function getQuery($variables) {
    $columns = [];
    $joins = [];

    foreach($variables as $key => $value) {
        if(is_labelled($value)) {
            array_push($columns, "$value.label AS $value");
            array_push($joins, "LEFT JOIN $value $value ON v.`$value`=$value.value");
        }
        else if(is_place($value)) {
            array_push($columns, "$value.label AS $value");
            array_push($joins, "LEFT JOIN places $value ON v.`$value`=$value.value");
        }

        else if($value == 'xmimpflag') {
            array_push($columns, "CONCAT($value.flag, ' ', $value.period) as grouping");
            array_push($joins, "JOIN $value $value ON v.`$value`=$value.value");
        }
        else {
            array_push($columns, $value);
        }
    }

    $select = "SELECT ";
    $select .= implode(", ", $columns);
    $select .= " FROM voyages v ";
    $select .= implode(" ", $joins);

    //var_dump($select);

    return $select;
}
function is_labelled($var) {
    return in_array($var, ['fate', 'fate2', 'fate3', 'fate4', 'natinimp', 'national', 'resistance', 'rig', 'tontype']);
}
function is_place($var) {
    return in_array($var, [
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
    ]);
}

function findTopCountriesBy($myvar, $limit) {
    return getQueryTopCountriesGroupByCode($myvar, $limit);
}
function getQueryTopCountriesGroupByCode($myvar, $limit) {
    $sql = "
        SELECT n.label as name, n.iso2 as iso2, SUM($myvar) as total 
        FROM voyages as v
            JOIN (SELECT * FROM national UNION SELECT * FROM natinimp) as n 
                ON (v.national=n.value OR v.natinimp=n.value)
        WHERE n.label != 'Other' AND n.label != ''
        GROUP BY n.iso2
        ORDER BY total DESC
    ";
    
    return $sql;
}

function getChartDataQuery($select, $groupBy, $orderByVariable, $orderByDirection) {
    $query = getQuery([$groupBy, $select.' as value ']) ;
    $query = $query . " GROUP BY $groupBy ORDER BY $orderByVariable $orderByDirection";
    return $query;
}


?>