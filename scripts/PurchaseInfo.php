<?php 



class PurchaseInfo extends StageInfo {
    
    private $step;
    
    public function __construct($step, $voyage, $helper) {
        $this->step = $step;
        parent::__construct($voyage, $helper);
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


?>