<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DepartureInfo
 *
 * @author Alexandre Zua Caldeira<zuacaldeira at nsemi.org>
 */
class DepartureInfo extends StageInfo {
    
    public function __construct($voyage, $db) {
        parent::__construct($voyage, $db);
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
