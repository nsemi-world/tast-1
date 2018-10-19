<?php 

namespace db;

class VoyagesDatabaseQueries {
    
    public static function queryAll() {
        return 'SELECT * FROM voyages';
    }
    
    public static function queryAllByVariable($var) {
        switch($var) {
            case 'fate':
            case 'fate2':
            case 'fate3':
            case 'fate4':
            case 'natinimp':
            case 'national':
            case 'resistance':
            case 'rig':
            case 'tontype':
                return "SELECT voyageid, f.label as name FROM voyages v JOIN $var f ON v.$var=f.value";
            case 'placcons':
            case 'placreg':
            case 'portdep':
            case 'ptdepimp':
            case 'embport':
            case 'embport2':
            case 'plac1tra':
            case 'plac2tra':
            case 'plac3tra':
            case 'majbuypt':
            case 'mjbyptimp':
            case 'npafttra':
            case 'arrport':
            case 'arrport2':
            case 'sla1port':
            case 'adpsale1':
            case 'adpsale2':
            case 'majselpt':
            case 'mjslptimp':
            case 'constreg':
            case 'regisreg':
            case 'deptregimp':
            case 'deptregimp1':
            case 'embreg':
            case 'embreg2':
            case 'regem1':
            case 'regem2':
            case 'regem3':
            case 'majbyimp':
            case 'majbyimp1':
            case 'regarr':
            case 'regarr2':
            case 'regdis1':
            case 'regdis2':
            case 'regdis3':
            case 'mjselimp':
            case 'mjselimp1':
                return "SELECT voyageid, f.label as name FROM voyages v JOIN places f ON v.$var=f.value";
            case 'xmimpflag':
                return "SELECT voyageid, CONCAT(f.flag, ' ', f.period) as name FROM voyages v JOIN $var f ON v.$var=f.value";
            default: 
                return "SELECT voyageid, $var AS name FROM voyages WHERE $var != ''";
        }
    }

    public static function queryAllByVariableList($varlist) {
        $columns = [];
        $joins = [];
        
        foreach($varlist as $key => $value) {
            if(VoyagesDatabaseQueries::is_labelled($value)) {
                array_push($columns, "$value.label AS $value");
                array_push($joins, "LEFT JOIN $value $value ON v.`$value`=$value.value");
            }
            else if(VoyagesDatabaseQueries::is_place($value)) {
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
    
    public static function queryByVariableList($voyageid, $varlist) {
        $columns = [];
        $joins = [];
        
        foreach($varlist as $key => $value) {
            if(VoyagesDatabaseQueries::is_labelled($value)) {
                array_push($columns, "$value.label AS $value");
                array_push($joins, "LEFT JOIN $value $value ON v.`$value`=$value.value");
            }
            else if(VoyagesDatabaseQueries::is_place($value)) {
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
        $select .= " WHERE voyageid=$voyageid";
        
        //var_dump($select);
        
        return $select;
    }
    
    public static function is_labelled($var) {
        return in_array($var, ['fate', 'fate2', 'fate3', 'fate4', 'natinimp', 'national', 'resistance', 'rig', 'tontype']);
    }
    
    public static function is_place($var) {
        $places = self::getPlaces();
        return in_array($var, $places);
    }
    
    public static  function getPlaces() {
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
    
    public static function queryAllByVariableGroup($variable_list) {
        $select = "SELECT " . $variable_list . " FROM voyages";
        return $select;
    }
    
    public static function queryGroup($group) {
        return "SELECT LCASE(value) as name FROM `group-$group`";
    }

    public static function queryAllVoyagesIds() {
        return 'SELECT voyageid FROM voyages';
    }
    
    public static function queryAllVoyagesIdsOrderBy($order) {
        return "SELECT voyageid FROM voyages ORDER BY yeardep, datedep";
    }

    public static function queryFilteredVoyagesIdsOrderBy($order, $filter, $value) {
        if($filter == 'date') {
            return self::queryDatedVoyages($order, $filter, $value);
        }
        else if($filter == 'embarked' || $filter == 'disembarked' || $filter == 'died') {
            return self::queryEnsalavedVoyages($order, $filter, $value);
        }
        else {
            return self::queryOtherVoyages($order, $filter, $value);
        }
    }
    
    private static function queryDatedVoyages($order, $filter, $value) {
        $columns = self::getColumns($filter);
        $conditions = [];
        
        $value = self::getNewValue($filter, $value);
        
        foreach($columns as $column) {
            $conditions[] = "(`" .$column. "`$value"." AND `".$column. "`!=''"." AND `".$column. "`!='0000-00-00')";
        }
        
        $condition = implode(" OR ", $conditions);
        
        $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";
        
        //var_dump($select);
        
        return $select;
    }
    
    private static function queryEnsalavedVoyages($order, $filter, $value) {
        $value = self::getNewValue($filter, $value);
        
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
    
    private static function queryOtherVoyages($order, $filter, $value) {
        $columns = self::getColumns($filter);
        $conditions = [];
        
        $value = self::getNewValue($filter, $value);
        
        foreach($columns as $column) {
            $conditions[] = "`" .$column. "`='$value'";
        }
        
        $condition = implode(" OR ", $conditions);
        
        $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";
        
        //var_dump($select);
        
        return $select;
    }

    private static function getNewValue($filter, $value) {
        if(substr($value, 0, 2) == '<=' || substr($value, 0, 2) == '>=') {
            if($filter == 'date') {
                return substr($value, 0, 2) . self::wrap(substr($value, 2));
            }
            else return $value;
        }
        if($value[0] == '<' || $value[0] == '>') {
            if($filter == 'date') {
                return $value[0] . self::wrap(substr($value, 1));
            }
            else {
                return $value;
            }
        }
        else {
            return $value;
        }
    }
    
    private static function wrap($value) {
        return "'".$value."'";
    }
    
    public static function getColumns($filter) {
        switch($filter) {
            case 'place': return self::getPlaces();
            case 'country': return self::getCountries();
            case 'shipname': return self::getShipname();
            case 'owner': return self::getOwners();
            case 'captain': return self::getCaptains();
            case 'fate': return self::getFate();
            case 'embarked': return ['slaximp'];
            case 'disembarked': return ['slamimp'];
            case 'died': return ['slaximp', 'slamimp'];
            case 'date': return self::getDate();
            default: return []; 
        }
    }
    
    public static function getOwners() {
        return [
            'ownera', 'ownerb', 'ownerc', 'ownerd', 'ownere', 'ownerf', 'ownerg', 'ownerh', 'owneri', 'ownerj', 'ownerk', 'ownerl', 'ownerm', 'ownern', 'ownero', 'ownerp'
        ];
    }
    
    public static function getCaptains() {
        return [
            'captaina', 'captainb', 'captainc'
        ];
    }
    
    public static function getFate() {
        return ['fate', 'fate2', 'fate3', 'fate4'];
    }
    
    
    public static function getShipname() {
        return ['shipname'];
    }
    
    public static function getCountries() {
        return ['natinimp', 'national'];
    }
    
    public static function getDate() {
        return [
            'yearaf',
            'yearam',
            'yeardep'
        ];    
    }
    
    public static function queryByVoyageId($id) {
        return "SELECT * FROM voyages WHERE voyageid=$id";
    }
    
    public static function queryByYear($y) {
        return "SELECT * FROM voyages WHERE YEAR(datedep) <= $y AND YEAR(datedep) != 0";
    }
    
    public static function querySummaryByYear($y) { 
        return "SELECT 
                    MAX(yeardep) as year,
                    COUNT(voyageid) as voyages,
                    COUNT(DISTINCT shipname) as ships,
                    SUM(slaximp) as embarked,
                    SUM(slamimp) as disembarked,
                    SUM(slaximp)-SUM(slamimp) as died
                FROM voyages
                WHERE YEAR(datedep) <= $y AND YEAR(datedep) != 0";
    }
    
    public static function querySummariesByYear() {
        return "SELECT 
                    yeardep as year, 
                    COUNT(voyageid) as voyages,
                    COUNT(DISTINCT shipname) as ships, 
                    SUM(slaximp) as embarked, 
                    SUM(slamimp) as disembarked,
                    SUM(slaximp)-SUM(slamimp) as died
                FROM voyages 
                GROUP BY year
            ";
    }
    
    public static function queryAllVoyagesSummary() {
        return "
                SELECT 
                    MIN(yeardep) as year_start,
                    MAX(yeardep) as year_end, 
                    COUNT(voyageid) as voyages, 
                    COUNT(DISTINCT shipname) as ships, 
                    COUNT(DISTINCT national) as n,  
                    COUNT(DISTINCT natinimp) as m,
                    SUM(slaximp) as embarked, 
                    SUM(slamimp) as disembarked, 
                    SUM(slaximp)-SUM(slamimp) as died 
                FROM voyages 
            ";
    }
    
    public static function queryFilteredVoyagesSummary($filter, $value) {
        $columns = self::getColumns($filter);
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
    
    public static function queryVoyageSummary($id) { 
        return "SELECT 
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
                WHERE voyageid=$id";
    }

    
    public static function queryAllVariables() {
        return "SELECT name, description FROM variables";
    }
    
    public static function queryAllVariableNames() {
        return "SELECT name FROM variables";
    }

    public static function queryVariable($name) {
        return "SELECT name, description FROM variables WHERE name='$name'";
    }
    public static function queryVariableDescription($name) {
        return "SELECT description FROM variables WHERE name='$name'";
    }
    
    public static function queryVariableCompleteness($var) {
        return "SELECT COUNT($var) as completeness FROM voyages WHERE $var != ''";
    }
    
    public static function queryCountVoyages() {
        return "SELECT COUNT(voyageid) as n FROM voyages";
    }
    
    public static function queryCountTotalSlavesEmbarked() {
        return "SELECT SUM(slaximp) as n FROM voyages";
    }
}





?>