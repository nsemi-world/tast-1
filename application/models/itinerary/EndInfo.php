<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of EndInfo
 *
 * @author Alexandre Zua Caldeira<zuacaldeira at nsemi.org>
 */
class EndInfo extends StageInfo {
    
    public function __construct($voyage, $db) {
        parent::__construct($voyage, $db);
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
