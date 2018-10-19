<?php 

namespace info;

class EndInfo extends StageInfo {
    
    public function __construct($voyage, $helper) {
        parent::__construct($voyage, $helper);
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