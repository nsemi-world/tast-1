<?php 

//namespace info;

class OutOfAfricaInfo extends StageInfo {
    
    public function __construct($voyage, $helper) {
        parent::__construct($voyage, $helper);
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




?>