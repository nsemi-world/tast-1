<?php


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


function findTopCountriesBy($pdo, $myvar) {
    $erg = $pdo->query(getQueryTopCountriesGroupByCountryCode($myvar));
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function getQueryTopCountriesGroupByName($myvar) {
    $sql = "
        SELECT n.label as name, n.iso2 as iso2, SUM($myvar) as total 
        FROM voyages as v
            LEFT JOIN (SELECT * FROM national UNION SELECT * FROM natinimp) as n 
                ON (v.national=n.value OR v.natinimp=n.value)
        GROUP BY n.label
        ORDER BY total DESC
    ";
    
    return $sql;
}

function getQueryTopCountriesGroupByCountryCode($myvar) {
    $sql = "
        SELECT n.label as name, n.iso2 as iso2, SUM($myvar) as total 
        FROM voyages as v
            LEFT JOIN (SELECT * FROM national UNION SELECT * FROM natinimp) as n 
                ON (v.national=n.value OR v.natinimp=n.value)
        GROUP BY n.iso2
        ORDER BY total DESC
    ";
    
    return $sql;
}

?>