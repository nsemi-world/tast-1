<?php 

namespace info;

abstract class StageInfo {
    
    private $voyage;
    private $helper;
    private $date;
    private $place;
    private $region;
    private $geo;
    private $narrative;
    private $stageName;
    
    
    // CONSTRUCTOR
    
    public function __construct($voyage, $helper) {
        $this->voyage = $voyage;
        $this->helper = $helper;
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
    
    public function getHelper() {
        return $this->helper;
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
        return $this->helper->findPlaceLatLong($this->place);
    }

}





?>