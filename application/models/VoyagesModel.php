<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once 'MY_Model.php';
class VoyagesModel extends MY_Model 
{
    
    public function __construct() 
    {
        parent::__construct('voyages');
    }
    
    public function get_all_ids() {
        $this->db->select('voyageid');
        $query = $this->db->get('voyages');
        return $query->result_array();
    }
    
    public function findAllVoyagesSummary() {
        $sql = "
                MIN(yeardep) as year_start,
                MAX(yeardep) as year_end, 
                COUNT(voyageid) as voyages, 
                COUNT(DISTINCT shipname) as ships, 
                COUNT(DISTINCT national) as n,  
                COUNT(DISTINCT natinimp) as m,
                SUM(slaximp) as embarked, 
                SUM(slamimp) as disembarked, 
                SUM(slaximp)-SUM(slamimp) as died 
        ";
        $this->db->select($sql);
        $this->db->from('voyages');
        $query = $this->db->get();
        return $query->result_array();
    }

    
}