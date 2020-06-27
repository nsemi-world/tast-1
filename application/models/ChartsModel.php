<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ChartsModel extends CI_Model {
    
    
    public function getChartsData($select, $groupBy, $orderBy=NULL) {
        $this->load->helper('dbqueries');
        if($orderBy !== NULL && $orderBy != '' ) {
            $sql = getChartDataQuery($select, $groupBy, $orderBy['variable'], $orderBy['direction']);
        } 
        else  {
            $sql  = getChartDataQuery($select, $groupBy, $groupBy, 'ASC');
        }

        log_message('debug', '*******************************************');
        log_message('debug', $sql);
        log_message('debug', '*******************************************');
        
        $query =  $this->db->query($sql);
        return $query->result_array();
    }
}