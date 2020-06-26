<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once 'MY_Model.php';
class VoyageItineraryModel extends MY_Model 
{
    
    public function __construct() 
    {
        parent::__construct('voyages');
    }
    
    public function getItinerary($voyageid) {
        $vinfo = new VoyageInfo($voyageid, $this->db);
        return $vinfo;
    }
    
}