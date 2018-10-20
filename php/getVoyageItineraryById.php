<?php
    
$host = 'us-cdbr-iron-east-01.cleardb.net';
$username = 'b0bd1223927bc6';
$password = '707fe6cf';
$dbname = 'heroku_1bca0db043051c1';
$pdo = new PDO("mysql:host=".$host."; dbname=".$dbname.'; charset=utf8', $username, $password);

// MAIN

$voyageid = 1;

if(isset($_GET['voyageid'])) {
    $voyageid = $_GET['voyageid'];
}

//-------------------------------------
// Prepare answer
//-------------------------------------
$vinfo = new VoyageInfo($voyageid, $pdo);

$result = [];
$result['itinerary'] = $vinfo->getStages();
$result['details']   = $vinfo->getDetails();
$result['summary']   = $vinfo->getSummary();

header('Content-type:application/json;charset=utf-8');

echo json_encode($result);


abstract class StageInfo {
    
    private $voyage;
    public $pdo;
    private $date;
    private $place;
    private $region;
    private $geo;
    private $narrative;
    private $stageName;
    
    
    // CONSTRUCTOR
    
    public function __construct($voyage, $pdo) {
        $this->voyage = $voyage;
        $this->pdo = $pdo;
        $this->initInfo();
    }
    
    private function initInfo() {
        $this->date = $this->createDate();
        $this->place = $this->createPlace();
        $this->region = $this->createRegion();
        $this->narrative = $this->createNarrative();
        $this->stageName = $this->createStageName();
        $this->geo = $this->createGeo();
    }
    
    // GETTERS
    
    public function getVoyage() {
        return $this->voyage;
    }
    
    // INFO
    
    public function getInfo() {
        return [
            "date"      => $this->date, 
            "place"     => $this->place, 
            "region"    => $this->region,
            "geo"       => $this->geo,
            "narrative" => $this->narrative,
            "stage"     => $this->stageName,
        ];
    }
    
    public function getDate() {
        return $this->date;
    }
    
    public function setDate($date) {
        $this->date = $date;
    }
    
    public function getPlace() {
        return $this->place;
    }
    
    public function setPlace($place) {
        $this->place = $place;
    }

    public function getRegion() {
        return $this->region;
    }
    
    public function setRegion($region) {
        $this->region = $region;
    }
    
    public function getGeo() {
        return $this->geo;
    }
    
    public function setGeo($geo) {
        $this->geo = $geo;
    }

    public function getNarrative() {
        return $this->narrative;
    }
    
    public function setNarrative($narrative){
        $this->narrative = $narrative;
    }
    
    public function getStageName() {
        return $this->stageName;
    }
    
    public function setStageName($stageName) {
        $this->stageName = $stageName;
    }
    
    public abstract function createDate();
    public abstract function createPlace();
    public abstract function createRegion();
    public abstract function createNarrative();
    public abstract function createStageName();
    
    public function createGeo() {
        return $this->findPlaceLatLong();
    }
    
    public function findPlaceLatLong() {
        $query = "SELECT latitude, longitude FROM places WHERE label=\"$this->place\"";
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);
    }
}
class VoyageInfo {
    
    private $voyageid;
    private $voyage;
    private $pdo;
    private $stages;
    private $details;
    private $summary;
    
    
    /**
     * Constructor of VoyageInfo objects
     * @param $voyageid: Voyage id in the database
     */
    public function __construct($voyageid, $pdo) {
        $this->voyageid = $voyageid;
        $this->pdo = $pdo;
        $this->voyage = $this->findItinerary($this->voyageid);
        $this->initDetails();
        $this->initStages();
        $this->initSummary();
    }
    
    public function getVoyageId() {
        return $this->voyageid;
    }
    public function getStages() {
        return $this->stages;
    }
    
    public function getDetails() {
        return $this->details;
    }
    
    public function getSummary() {
        return $this->summary;
    }
    
    private function initStages() {
        // the itinerary information
        $dInfo  = new DepartureInfo($this->voyage, $this->pdo);
        $pInfo1 = new PurchaseInfo(1, $this->voyage, $this->pdo);
        $pInfo2 = new PurchaseInfo(2, $this->voyage, $this->pdo);
        $pInfo3 = new PurchaseInfo(3, $this->voyage, $this->pdo);
        $oInfo  = new OutOfAfricaInfo($this->voyage, $this->pdo);
        $lInfo1 = new LandingInfo(1, $this->voyage, $this->pdo);
        $lInfo2 = new LandingInfo(2, $this->voyage, $this->pdo);
        $lInfo3 = new LandingInfo(3, $this->voyage, $this->pdo);
        $eInfo  = new EndInfo($this->voyage, $this->pdo);
        
        
        // Add incomplete data
        $oInfo->setPlace($pInfo3->getPlace() ?? $pInfo2->getPlace() ?? $pInfo1->getPlace());
        $oInfo->setGeo($pInfo3->getGeo() ?? $pInfo2->getGeo() ?? $pInfo1->getGeo());
        
        
        
        // stages
        $this->stages['departure'] = $dInfo->getInfo();
        
        $this->stages['purchase1'] = $pInfo1->getInfo();
        $this->stages['purchase2'] = $pInfo2->getInfo();
        $this->stages['purchase3'] = $pInfo3->getInfo();
        
        $this->stages['ooa']       = $oInfo->getInfo();
        
        $this->stages['landing1']  = $lInfo1->getInfo();
        $this->stages['landing2']  = $lInfo2->getInfo();
        $this->stages['landing3']  = $lInfo3->getInfo();
        
        $this->stages['end']       = $eInfo->getInfo();
    }
    
    //-------------------------------------
    // VOYAGE DETAILS
    //-------------------------------------
    private function initDetails() {
        $this->details['voyageid']  = $this->voyageid;
        $this->details['shipname']  = $this->voyage->shipname ?? 'Unknown';
        $this->details['owners']    = $this->getVoyageOwners() ?? 'Unknown';
        $this->details['captains']  =  $this->getVoyageCaptains() ?? 'Unknown';
        $this->details['flag']      = $this->voyage->national ?? $this->voyage->natinimp ?? 'Unknown';
        $this->details['fate'] = $this->voyage->fate;
        $this->details['fate2'] = $this->voyage->fate2;
        $this->details['fate3'] = $this->voyage->fate3;
        $this->details['fate4'] = $this->voyage->fate4;
        $this->details['resistance'] = $this->voyage->resistance;
        $this->details['slaves'] = [
            'embarked' => $this->voyage->slaximp,
            'disembarked' => $this->voyage->slamimp,
            'died' => $this->voyage->slaximp - $this->voyage->slamimp,
            'died_africa' => $this->voyage->sladafri,
            'died_voyage' => $this->voyage->sladvoy,
            'died_americas' => $this->voyage->sladamer
        ];
        $this->details['crew'] = [
            'crew' => $this->voyage->crew,
            'crew1' => $this->voyage->crew1,
            'crew2' => $this->voyage->crew2,
            'crew3' => $this->voyage->crew3,
            'crew4' => $this->voyage->crew4,
            'crew5' => $this->voyage->crew5
        ];
    }
    
    private function initSummary() {
        $this->summary = $this->findVoyageSummary($this->voyageid);
    }
    
    private function getVoyageOwners() {
        $result = [];
        if($this->voyage->ownera != null) {
            $result[] = $this->voyage->ownera;
        }
        if($this->voyage->ownerb != null) {
            $result[] = $this->voyage->ownerb;
        }
        if($this->voyage->ownerc != null) {
            $result[] = $this->voyage->ownerc;
        }
        if($this->voyage->ownerd != null) {
            $result[] = $this->voyage->ownerd;
        }
        if($this->voyage->ownere != null) {
            $result[] = $this->voyage->ownere;
        }
        if($this->voyage->ownerf != null) {
            $result[] = $this->voyage->ownerf;
        }
        return $result;

    }

    private function getVoyageCaptains() {
        $result = [];
        if($this->voyage->captaina != null) {
            $result[] = $this->voyage->captaina;
        }
        if($this->voyage->captainb != null) {
            $result[] = $this->voyage->captainb;
        }
        if($this->voyage->captainc != null) {
            $result[] = $this->voyage->captainc;
        }
        return $result;
    }
    
    public function findItinerary($voyageid) {
        $varnames = $this->findAllVariableNames();
        $variable_list = $this->createVariableList($varnames);

        $query = $this->queryByVariableList($voyageid, $variable_list);
        $erg = $this->pdo->query($query);
        return $erg->fetch(PDO::FETCH_OBJ);    
    }
    public function findAllVariableNames() {
        $erg = $this->pdo->query("SELECT name FROM variables");
        return $erg->fetchAll(PDO::FETCH_OBJ);
    }
    public function createVariableList($arr) {
        $result = [];
        foreach($arr as $key=>$value) {
            $result[] = $value->name;
        }
        return $result;
    }
    public function queryByVariableList($voyageid, $varlist) {
        $columns = [];
        $joins = [];
        
        foreach($varlist as $key => $value) {
            if($this->is_labelled($value)) {
                array_push($columns, "$value.label AS $value");
                array_push($joins, "LEFT JOIN $value $value ON v.`$value`=$value.value");
            }
            else if($this->is_place($value)) {
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
    public  function is_labelled($var) {
        return in_array($var, ['fate', 'fate2', 'fate3', 'fate4', 'natinimp', 'national', 'resistance', 'rig', 'tontype']);
    }
    
    public  function is_place($var) {
        $places = $this->getPlaces();
        return in_array($var, $places);
    }
    
    public function getPlaces() {
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

    public function findVoyageSummary($id) {
        $erg = $this->pdo->query($this->queryVoyageSummary($id));
        return $erg->fetch(PDO::FETCH_OBJ);
    }
    
    public function queryVoyageSummary($id) { 
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
}
class DepartureInfo extends StageInfo {
    
    public function __construct($voyage, $pdo) {
        parent::__construct($voyage, $pdo);
    }
    
    public function getInfo() {
        return parent::getInfo();
    }

    
    function createDate() {
        $voyage = $this->getVoyage();
        
        if($voyage->datedep != null) {
            return $voyage->datedep;
        }

        else if($voyage->datedepc != null 
           && $voyage->datedepb != null 
           && $voyage->datedepa != null) {
            return $voyage->datedepc . '-' . $voyage->datedepb . '-' . $voyage->datedepa;
        }
    
        else {
            return $voyage->yeardep;
        }
    }
    
    function createPlace() {
        $voyage = $this->getVoyage();
        return $voyage->portdep ?? $voyage->ptdepimp ?? null;
    }

    function createRegion() {
        $voyage = $this->getVoyage();
        return $voyage->deptregimp ?? '';
    }
    
    public function createStageName() {
        return 'Departure';
    }

    function createNarrative() {
        $voyage = $this->getVoyage();
        $narrative = '###DATE###: A new voyage is about to begin under the flag of ###FLAG###. Owned by ###OWNERS###, the ship ###SHIPNAME### crew is composed of ###CREW### members and captain(s) ###CAPTAINS###.';
        return $narrative;
    }
        
}
class PurchaseInfo extends StageInfo {
    
    private $step;
    
    public function __construct($step, $voyage, $pdo) {
        $this->step = $step;
        parent::__construct($voyage, $pdo);
    }

    public function getInfo() {
        return parent::getInfo();
    }

    //--------------------------------
    // DATES
    //--------------------------------
    public function createDate() {
        switch($this->step) {
            case 1: return $this->getFirstPurchaseDate();
            case 2: return $this->getSecondPurchaseDate();
            case 3: return $this->getThirdPurchaseDate();
        }
        return null;
    }
    
    private function getFirstPurchaseDate() {
        $voyage = $this->getVoyage();
        $result = '';
        if($voyage->d1slatrc != null && $voyage->d1slatrc != '') {
            $result .= $voyage->d1slatrc;
        }
        if($voyage->d1slatrb != null && $voyage->d1slatrb != '') {
            $result .= '-'.$voyage->d1slatrb;
        }
        if($voyage->d1slatra != null && $voyage->d1slatra != '') {
            $result .= '-'.$voyage->d1slatra;
        }
        return $voyage->datebuy ?? $result;
    }

    private function getSecondPurchaseDate() {
        return '';
    }
    
    private function getThirdPurchaseDate() {
        return '';
    }


    //--------------------------------
    // PLACES
    //--------------------------------
    public function createPlace() {
        switch($this->step) {
            case 1: return $this->getFirstPurchasePlace();
            case 2: return $this->getSecondPurchasePlace();
            case 3: return $this->getThirdPurchasePlace();
        }
        
        return null;
    }
    
    private function getFirstPurchasePlace() {
        $voyage = $this->getVoyage();
        return $voyage->plac1tra ?? $voyage->majbuypt ?? $voyage->mjbyptimp;
    }
    
    private function getSecondPurchasePlace() {
        $voyage = $this->getVoyage();
        return $voyage->plac2tra;
    }

    private function getThirdPurchasePlace() {
        $voyage = $this->getVoyage();
        return $voyage->plac3tra;
    }
    
    
    //--------------------------------
    // REGIONS
    //--------------------------------
    public function createRegion() {
        switch($this->step) {
            case 1: return $this->getFirstPurchaseRegion();
            case 2: return $this->getSecondPurchaseRegion();
            case 3: return $this->getThirdPurchaseRegion();
        }
        
        return null;
    }
    
    private function getFirstPurchaseRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regem1 ?? $voyage->majbyimp ?? $voyage->majbyimp1;
    }

    
    private function getSecondPurchaseRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regem2;
    }

    private function getThirdPurchaseRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regem3;
    }
    
    
    
    //--------------------------------
    // NARRATIVES
    //--------------------------------
    public function createNarrative() {
        
    }
    
    public function createStageName() {
        switch($this->step) {
            case 1: return "Principal Purchase Port";
            case 2: return "Second Purchase Port";
            case 3: return "Third Purchase Port";
        }
        
        return null;
    }
    
}
class OutOfAfricaInfo extends StageInfo {
    
    public function __construct($voyage, $pdo) {
        parent::__construct($voyage, $pdo);
    }

    public function getInfo() {
        return parent::getInfo();
    }

    public function createDate() {
        $voyage = $this->getVoyage();
        return $voyage->dateleftafr ?? (dlslatrc . '-' . dlslatrb . '-' . dlslatra);
    }
    
    public function createPlace() {
    }
    
    public function createRegion() {}
    
    public function createNarrative() {}
    
    public function createStageName() {
        return 'Middle Passage';
    }
    
    public function setPlace($place) {
        parent::setPlace($place);
    }
    
    public function setGeo($geo) {
        parent::setGeo($geo);
    }
}
class LandingInfo extends StageInfo {
    
    private $step;
    
    public function __construct($step, $voyage, $pdo) {
        $this->step = $step;
        parent::__construct($voyage, $pdo);
    }

    public function getInfo() {
        return parent::getInfo();
    }

    public function createDate() {
        switch($this->step) {
            case 1: return $this->getFirstLandingDate();
            case 2: return $this->getSecondLandingDate();
            case 3: return $this->getThirdLandingDate();
        }
        return null;
    }
    
    public function createPlace() {
        switch($this->step) {
            case 1: return $this->getFirstLandingPlace();
            case 2: return $this->getSecondLandingPlace();
            case 3: return $this->getThirdLandingPlace();
        }
        
        return null;
    }
    
    public function createRegion() {
        switch($this->step) {
            case 1: return $this->getFirstLandingRegion();
            case 2: return $this->getSecondLandingRegion();
            case 3: return $this->getThirdLandingRegion();
        }
        
        return null;
    }
    
    public function createNarrative() {}
    
    public function createStageName() {
        switch($this->step) {
            case 1: return "Principal Landing Port";
            case 2: return "Second Landing Port";
            case 3: return "Third Landing Port";
        }        
        return null;
    }
    

    private function getFirstLandingDate() {
        $voyage = $this->getVoyage();
        return $voyage->dateland1;
    }

    private function getFirstLandingPlace() {
        $voyage = $this->getVoyage();
        return $voyage->sla1port ?? $voyage->mjslptimp;
    }

    private function getFirstLandingRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regdis1 ?? $voyage->mjselimp;
    }


    private function getSecondLandingDate() {
        $voyage = $this->getVoyage();
        return $voyage->dateland2;
    }

    private function getSecondLandingPlace() {
        $voyage = $this->getVoyage();
        return $voyage->adpsale1;
    }

    private function getSecondLandingRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regdis2;
    }

    private function getThirdLandingDate() {
        $voyage = $this->getVoyage();
        return $voyage->dateland3;
    }

    private function getThirdLandingPlace() {
        $voyage = $this->getVoyage();
        return $voyage->adpsale2;
    }

    private function getThirdLandingRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regdis3;
    }
    

}
class EndInfo extends StageInfo {
    
    public function __construct($voyage, $pdo) {
        parent::__construct($voyage, $pdo);
    }

    public function getInfo() {
        return parent::getInfo();
    }

    public function createDate() {
        $voyage = $this->getVoyage();
        return $voyage->dateend;
    }

    public function createPlace() {
        $voyage = $this->getVoyage();
        return $voyage->portret;
    }
    
    public function createRegion() {
        $voyage = $this->getVoyage();
        return $voyage->regdis3;
    }

    public function createNarrative() {}
    
    public function createStageName() {
        return 'End';
    }
    
    
}


?>