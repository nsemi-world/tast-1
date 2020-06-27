<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class QuizzModel extends CI_Model {

    function getTops($min, $type, $criteria) {
        $this->load->helper('dbqueries');
        $sql = findTopCountriesBy('slaximp', $min);
        $query = $this->db->query($sql);
        return $query->result_array();
    }

}