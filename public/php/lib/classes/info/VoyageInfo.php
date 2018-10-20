<?php 

namespace info;

class VoyageInfo {
    
    private $voyageid;
    private $voyage;
    private $helper;
    private $stages;
    private $details;
    private $summary;
    
    
    /**
     * Constructor of VoyageInfo objects
     * @param $voyageid: Voyage id in the database
     */
    public function __construct($voyageid, $helper) {
        $this->voyageid = $voyageid;
        $this->helper = new \db\VoyagesDatabaseHelper();
        $this->voyage = $this->helper->findItinerary($this->voyageid);
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
        $dInfo  = new DepartureInfo($this->voyage, $this->helper);
        $pInfo1 = new PurchaseInfo(1, $this->voyage, $this->helper);
        $pInfo2 = new PurchaseInfo(2, $this->voyage, $this->helper);
        $pInfo3 = new PurchaseInfo(3, $this->voyage, $this->helper);
        $oInfo  = new OutOfAfricaInfo($this->voyage, $this->helper);
        $lInfo1 = new LandingInfo(1, $this->voyage, $this->helper);
        $lInfo2 = new LandingInfo(2, $this->voyage, $this->helper);
        $lInfo3 = new LandingInfo(3, $this->voyage, $this->helper);
        $eInfo  = new EndInfo($this->voyage, $this->helper);
        
        
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
        $this->summary = $this->helper->findVoyageSummary($this->voyageid);
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
    
}



?>