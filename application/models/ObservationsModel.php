<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ObservationsModel extends CI_Model {

    function getObservations($variables, $must_join) {
        $this->load->helper('dbqueries');
        if($must_join) {
            $query = getQuery($variables);
        }
        else {
            $columns = implode(", ", $variables);
            $query = "SELECT $columns FROM voyages";
        }

        $erg = $this->db->query($query);
        return $erg->result_array();
    }

}