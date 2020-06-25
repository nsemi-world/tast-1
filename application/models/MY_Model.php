<?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
abstract class MY_Model extends CI_Model {

    private $table;

    public function __construct($table) {
        parent::__construct();
        $this->table = $table;
    }
    
    public function count_all(){
        $query = $this->db->get($this->table);
        $result = $query->result_array();
        return count($result);
    }

    public function count_all_where($fields){
        $query = $this->db->get_where($this->table, $fields);
        $result = $query->result_array();
        return count($result);
    }

    public function exists($fields){
        return $this->count_all_where($fields) > 0;
    }
    
    public function get_everything() {
        return $this->get_all($this->count_all());
    }
       
    public function get_all($limit = 24) {
        //$this->db->limit($limit);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }
    
    public function get_latest($limit = 24) {
        $this->db->limit($limit);
        $this->db->order_by('updated_at', 'DESC');
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    public function get_latest_where($where, $limit = 24) {
        $this->db->order_by('created_at', 'DESC');
        $query = $this->db->get_where($this->table, $where, $limit);
        return $query->row_array();
    }

    public function get_random() {
        $this->db->order_by('id', 'random');
        $query = $this->db->get($this->table);
        return $query->row_array();
    }

    public function get_randoms($limit = 5) {
        $this->db->order_by('id', 'random');
        $this->db->limit($limit);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    public function get_random_where($where) {
        $this->db->order_by('id', 'random');
        $query = $this->db->get_where($this->table, $where);
        return $query->row_array();
    }

    public function get_where($data) {
        $query = $this->db->get_where($this->table, $data);
        return $query->result_array();
    }

    public function get_like($data) {
        $this->db->like($data);
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    public function get_where_single($data) {
        $query = $this->db->get_where($this->table, $data);
        return $query->row_array();
    }

    public function add($data) {
        $this->db->set('created_at', 'NOW()', FALSE);
        $this->db->set('updated_at', 'NOW()', FALSE);
        return $this->db->insert($this->table, $data);
    }
    
    public function update_where($fields, $data) {
        $this->db->where($fields);
        return $this->db->update($this->table, $data);
    }
    
    public function delete_where($data) {
        return $this->db->delete($this->table, $data);
    }
    
    public function deleteTruncate() {
        return $this->db->truncate($this->table);
    }
}