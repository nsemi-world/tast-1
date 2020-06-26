<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of VoyageInfo
 *
 * @author Alexandre Zua Caldeira<zuacaldeira at nsemi.org>
 */
class VoyageInfo {
    
    private $voyageid;
    private $voyage;
    private $db; 
    private $stages;
    private $details;
    private $summary;
    
    
    /**
     * Constructor of VoyageInfo objects
     * @param $voyageid: Voyage id in the database
     */
    public function __construct($voyageid, $db) {
        $this->db = $db;
        $this->voyageid = $voyageid;
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
        $dInfo  = new DepartureInfo($this->voyage, $this->db);
        $pInfo1 = new PurchaseInfo(1, $this->voyage, $this->db);
        $pInfo2 = new PurchaseInfo(2, $this->voyage, $this->db);
        $pInfo3 = new PurchaseInfo(3, $this->voyage, $this->db);
        $oInfo  = new OutOfAfricaInfo($this->voyage, $this->db);
        $lInfo1 = new LandingInfo(1, $this->voyage, $this->db);
        $lInfo2 = new LandingInfo(2, $this->voyage, $this->db);
        $lInfo3 = new LandingInfo(3, $this->voyage, $this->db);
        $eInfo  = new EndInfo($this->voyage, $this->db);
        
        
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
        $this->details['voyageid']      = $this->voyageid;
        $this->details['shipname']      = $this->voyage->shipname ?? 'Unknown';
        $this->details['owners']        = $this->getVoyageOwners() ?? 'Unknown';
        $this->details['captains']      =  $this->getVoyageCaptains() ?? 'Unknown';
        $this->details['flag']          = $this->voyage->national ?? $this->voyage->natinimp ?? 'Unknown';
        $this->details['fate']          = $this->voyage->fate;
        $this->details['fate2']         = $this->voyage->fate2;
        $this->details['fate3']         = $this->voyage->fate3;
        $this->details['fate4']         = $this->voyage->fate4;
        $this->details['resistance']    = $this->voyage->resistance;
        $this->details['slaves']        = [ 'embarked' => $this->voyage->slaximp,
                                            'disembarked' => $this->voyage->slamimp,
                                            'died' => $this->voyage->slaximp - $this->voyage->slamimp,
                                            'died_africa' => $this->voyage->sladafri,
                                            'died_voyage' => $this->voyage->sladvoy,
                                            'died_americas' => $this->voyage->sladamer];
        $this->details['crew']          = [ 'crew' => $this->voyage->crew,
                                            'crew1' => $this->voyage->crew1,
                                            'crew2' => $this->voyage->crew2,
                                            'crew3' => $this->voyage->crew3,
                                            'crew4' => $this->voyage->crew4,
                                            'crew5' => $this->voyage->crew5 ];
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
        $erg = $this->db->query($query);
        return $erg->result_array();    
    }
    public function findAllVariableNames() {
        $erg = $this->db->query("SELECT name FROM variables");
        return $erg->result_array();
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
        $erg = $this->query($this->queryVoyageSummary($id));
        return $erg->result_array();
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
