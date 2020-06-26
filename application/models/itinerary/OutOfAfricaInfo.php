<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of OutOfAfricaInfo
 *
 * @author Alexandre Zua Caldeira<zuacaldeira at nsemi.org>
 */
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
