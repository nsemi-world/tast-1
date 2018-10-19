<?php 

namespace db;
use PDO;

//include 'VoyagesDatabaseQueries.php';

class VoyagesDatabaseHelper {
    
    /*
    private $url = 'mysql:host=localhost;dbname=tastdb;charset=utf8';
    private $username = 'root';
    private $password = '';
    */
    private $pdo;

    public function __construct() {
        //$url = 'mysql://b0bd1223927bc6:707fe6cf@us-cdbr-iron-east-01.cleardb.net/heroku_1bca0db043051c1?reconnect=true';
        $host = 'us-cdbr-iron-east-01.cleardb.net';
        $username = 'b0bd1223927bc6';
        $password = '707fe6cf';
        $dbname = 'heroku_1bca0db043051c1';
        $this->pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'?reconnect=true', $username, $password);
    }
    public function findAll() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAll());
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findAllByVariable($var) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAllByVariable($var));
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function findItinerary($voyageid) {
        $variable_list = $this->createVariableList($this->findAllVariableNames());

        $query = VoyagesDatabaseQueries::queryByVariableList($voyageid, $variable_list);

        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);    
    }
    public function findAllVariableNames() {
        $erg = $this->pdo->query(
            "SELECT `COLUMN_NAME` as name
                FROM `INFORMATION_SCHEMA`.`COLUMNS` 
                WHERE `TABLE_SCHEMA`='tastdb' 
                AND `TABLE_NAME`='voyages'");
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function createVariableList($arr) {
        $result = [];
        foreach($arr as $key=>$value) {
            $result[] = $value->name;
        }
        return $result;
    }


    public function findAllVoyageIds() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAllVoyagesIds());
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findAllVoyageIdsOrderBy($order) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAllVoyagesIdsOrderBy($order));
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findFilteredVoyageIdsOrderBy($order, $filter, $value) {
        $new_value = $value;
        if($filter == 'place') {
            $new_value = $this->findPlaceNamed($value)->value;
        }
        else if( $filter == 'country') {
            $new_value = $this->findCountryNamed($value)->value;
        }
        else if( $filter == 'fate') {
            $new_value = $this->findFateNamed($value)->value;
        }
        
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryFilteredVoyagesIdsOrderBy($order, $filter, $new_value));
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findVoyageById($id) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryByVoyageId($id));
        return $erg->fetch(PDO::FETCH_ASSOC);
    }

    public function findByVoyageId2($id, $fetch_mode) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryByVoyageId($id));
        return $erg->fetch($fetch_mode);
    }

    public function findByYear($y) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryByYear($y));
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }

    public function findSummaryByYear($y) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::querySummaryByYear($y));
        return $erg->fetch(PDO::FETCH_OBJ);
    }

    public function findSummariesByYear() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::querySummariesByYear());
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function findAllVoyagesSummary() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAllVoyagesSummary());
        return $erg->fetch(PDO::FETCH_OBJ);
    }

    public function findFilteredVoyagesSummary($filter, $value) {
        $new_value = $value;
        
        if($filter == 'place') {
            $new_value = $this->findPlaceNamed($value)->value;
        }     

        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryFilteredVoyagesSummary($filter, $new_value));
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    public function findVoyageSummary($id) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryVoyageSummary($id));
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    /** 
     * Helper methods to access the variables table.
     * TABLE: variables
     */
    public function findAllVariables() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryAllVariables());
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function findVariable($name) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryVariable($name));
        return $erg->fetch(PDO::FETCH_OBJ);
    }

    /** 
     * Helper methods to access the variables table.
     * TABLE: variables
     */
    public function findVariableDescription($name) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryVariableDescription($name));
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    /** 
     * Helper methods to access the variables table.
     * TABLE: variables
     */
    public function findVariableCompleteness($var) {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryVariableCompleteness($var));
        return $erg->fetch(PDO::FETCH_OBJ);
    }

    public function countVoyages() {
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryCountVoyages());
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    public function countTotalSlavesEmbarked(){
        $erg = $this->pdo->query(VoyagesDatabaseQueries::queryCountTotalSlavesEmbarked());
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    public function countVariables() {
        return count($this->findAllVariables());
    }
    
    public function findPlaces() {
        $query = "SELECT * FROM PLACES ORDER BY label";
        $erg = $this->pdo->query($query);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findPlaceNamed($name) {
        $query = "SELECT * FROM places WHERE label = '$name'";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    public function findCountryNamed($name) {
        $query = "SELECT * FROM national WHERE label = '$name' UNION SELECT * FROM natinimp WHERE label = '$name' ";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    public function findFateNamed($name) {
        $query = "SELECT * FROM fate WHERE label = '$name' " .
            "UNION SELECT * FROM fate2 WHERE label = '$name' " .
            "UNION SELECT * FROM fate3 WHERE label = '$name' " .
            "UNION SELECT * FROM fate4 WHERE label = '$name'";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    public function placeExists($city) {
        $query = "SELECT label FROM places WHERE label=\"$city\"";
        $erg = $this->pdo->query($query);
        
        $b = ($erg != false);
        
        
        if($b) {
            return true;
        }
        return false;
    }
    
    public function  updatePlace($city, $latitude, $longitude) {
        $query = "UPDATE places SET latitude = $latitude, longitude=$longitude WHERE places.label=\"$city\"";
        $erg = $this->pdo->query($query);
    }
    
    public function findLatLong($place) {
        $query = "SELECT Latitude, Longitude FROM geocoding WHERE AccentCity=\"$place\"";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    public function findPlaceLatLong($place) {
        $query = "SELECT latitude, longitude FROM places WHERE label=\"$place\"";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    
    public function findOwners() {
        $query = "
            SELECT ownera as name FROM voyages
            UNION
            SELECT ownerb as name FROM voyages
            UNION
            SELECT ownerc as name FROM voyages
            UNION
            SELECT ownerd as name FROM voyages
            UNION
            SELECT ownere as name FROM voyages
            UNION
            SELECT ownerf as name FROM voyages
            UNION
            SELECT ownerg as name FROM voyages
            UNION
            SELECT ownerh as name FROM voyages
            UNION
            SELECT owneri as name FROM voyages
            UNION
            SELECT ownerb as name FROM voyages
            UNION
            SELECT ownerj as name FROM voyages
            UNION
            SELECT ownerk as name FROM voyages
            UNION
            SELECT ownerl as name FROM voyages
            UNION
            SELECT ownerm as name FROM voyages
            UNION
            SELECT ownern as name FROM voyages
            UNION
            SELECT ownero as name FROM voyages 
            ORDER BY name";
        $erg = $this->pdo->query($query);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function findCaptains() {
        $query = "
            SELECT captaina as name FROM voyages
            UNION
            SELECT captainb as name FROM voyages
            UNION
            SELECT captainc as name FROM voyages
            ORDER BY name";
        $erg = $this->pdo->query($query);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }

    public function findShips() {
        $query = "SELECT DISTINCT(shipname) as shipname FROM voyages ORDER BY shipname";
        $erg = $this->pdo->query($query);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    
    public function findVoyageMedia($keyword) {
        $query = "SELECT * FROM media WHERE keywords LIKE \"%$keyword%\" ORDER BY RAND() LIMIT 1";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }

    public function findAllVoyageMedia() {
        $query = "SELECT * FROM media ORDER BY credits";
        $erg = $this->pdo->query($query);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }

    public function insertGeocoding($country, $city, $accentCity, $region, $population, $latitude, $longitude) {
        $query = "INSERT INTO geocoding (Country, City, AccentCity, Region, Population, Latitude, Longitude) VALUES (\"$country\", \"$city\", \"$accentCity\", \"$region\", $population, $latitude, $longitude)";
        $this->pdo->query($query);
    }

    
    public function findCountriesSummaries() {
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
        $erg = $this->pdo->query($sql);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    
    public function findCountriesSummariesForId($voyageid) {
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
            . "    WHERE v.voyageid=$voyageid\n"
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
            . "    WHERE v.voyageid=$voyageid\n"
            . "    GROUP BY n.iso3\n"
            . ") AS temp \n"
            . "GROUP BY iso3\n"
            . "ORDER BY total_embarked DESC";
        $erg = $this->pdo->query($sql);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }

    public function findCountriesSummariesForYear($year) {
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
        $erg = $this->pdo->query($sql);
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function findCitation() {
        $query = "SELECT * FROM citations";
        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result[array_rand($result)];
    }
    
    public function findAffiliateLinks($keyword, $value) {
        $query = "SELECT * FROM affiliate WHERE $keyword LIKE \"%$value%\"";
        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }
    
    
    public function findShipsSummaries() {
        $query = "SELECT shipname, COUNT(voyageid) as nvoyages, ownera, rig, SUM(slaximp) as embarked, SUM(slamimp) as disembarked,  SUM(slaximp) - SUM(slamimp) as died FROM voyages GROUP BY shipname ORDER BY embarked DESC";
        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }

    public function findOwnersSummaries() {
        $query = 
              "SELECT \n"
            . "	   ownera as name, \n"
            . "    COUNT(shipname) as ships, \n"
            . "    COUNT(voyageid) as voyages, \n"
            . "    SUM(crew) as crew, \n"
            . "    SUM(slaximp) as embarked,\n"
            . "    SUM(slamimp) as disembarked,\n"
            . "    SUM(slaximp)-SUM(slamimp) as died\n"
            . "\n"
            . "FROM voyages\n"
            . "WHERE ownera != ''\n"
            . "GROUP BY ownera";

        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }
    
    public function findCaptainsSummaries() {
        $query = 
              "SELECT \n"
            . "	   captaina as name, \n"
            . "    COUNT(shipname) as ships, \n"
            . "    COUNT(voyageid) as voyages, \n"
            . "    SUM(crew) as crew, \n"
            . "    SUM(slaximp) as embarked,\n"
            . "    SUM(slamimp) as disembarked,\n"
            . "    SUM(slaximp)-SUM(slamimp) as died\n"
            . "\n"
            . "FROM voyages\n"
            . "WHERE captaina != ''\n"
            . "GROUP BY captaina";
        //var_dump($query);
        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }
    
    public function findPlacesSummaries() {
        $query = "SELECT\n"
            . "	p.label as place, \n"
            . "    q.label as region, \n"
            . "    COUNT(shipname) as ships, \n"
            . "    COUNT(voyageid) as voyages, \n"
            . "    SUM(crew) as crew, \n"
            . "    SUM(slaximp) as embarked, \n"
            . "    SUM(slamimp) as disembarked, \n"
            . "    SUM(slaximp)-SUM(slamimp) as died \n"
            . "FROM voyages v \n"
            . "JOIN places p ON v.mjbyptimp=p.value \n"
            . "JOIN places q ON v.majbyimp=q.value \n"
            . "GROUP BY place";
        $erg = $this->pdo->query($query);
        $result =  $erg->fetchAll(PDO::FETCH_OBJ);
        return $result;
    }
}

?>
