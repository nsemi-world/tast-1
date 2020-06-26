<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of LandingInfo
 *
 * @author Alexandre Zua Caldeira<zuacaldeira at nsemi.org>
 */
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
