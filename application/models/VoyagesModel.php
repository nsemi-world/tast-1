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
    
    public function get_all_ids_filtered($filter, $value) {
        $sql = $this->queryFilteredVoyagesIds($filter, $value);
        $query = $this->db->query($sql);
        $result = $query->result_array();
        return $result;
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
    
    

    private function queryFilteredVoyagesIds($filter, $value) {
        if($filter === 'date') {
            return $this->queryDatedVoyages($filter, $value);
        }
        else if($filter === 'embarked' || $filter === 'disembarked' || $filter === 'died') {
            return $this->queryEnsalavedVoyages($filter, $value);
        }
        else {
            log_message('debug', $filter);
            return $this->queryOtherVoyages($filter, $value);
        }
    }
    private function queryDatedVoyages($filter, $value) {
        $columns = $this->getColumns($filter);
        $conditions = [];

        $new_value = $this->getNewValue($filter, $value);
        foreach($columns as $column) {
            $conditions[] = "(`$column`=$new_value AND `$column`!='' AND `$column`!='0000-00-00')";
        }

        $condition = implode(" OR ", $conditions);
        $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";

        return $select;
    }
    private function queryEnsalavedVoyages($filter, $value) {
        $new_value = $this->getNewValue($filter, $value);

        if($filter == 'embarked') {
            $condition = "(`slaximp`=$new_value AND slaximp!='' AND slaximp!=0) ";
            $select =  "SELECT voyageid FROM voyages WHERE " .
                        $condition .
                        "ORDER BY yeardep, datedep";
        }
        else if($filter == 'disembarked') {
            $condition = "(`slamimp`=$new_value AND slamimp!='' AND slamimp!=0) ";
            $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";
        }
        else {
            $select = "SELECT voyageid FROM (SELECT voyageid, (`slaximp`-`slamimp`) as died FROM voyages ORDER BY yeardep, datedep) as temp WHERE died=$new_value";
        }


        //var_dump($select);

        return $select;
    }
    private function queryOtherVoyages($filter, $value) {
        $columns = $this->getColumns($filter);
        $conditions = [];

        $new_value = $this->getNewValue($filter, $value);

        foreach($columns as $column) {
            $conditions[] = "`$column`='$new_value'";
        }

        $condition = implode(" OR ", $conditions);

        $select =  "SELECT voyageid FROM voyages WHERE $condition ORDER BY yeardep, datedep";

        //var_dump($select);

        return $select;
    }

    private function getNewValue($filter, $value) {
        if(substr($value, 0, 2) == '<=' || substr($value, 0, 2) == '>=') {
            if($filter == 'date') {
                return substr($value, 0, 2) . $this->wrap(substr($value, 2));
            }
            else {
                return $value;
            }
        }
        if($value[0] == '<' || $value[0] == '>') {
            if($filter == 'date') {
                return $value[0] . $this->wrap(substr($value, 1));
            }
            else {
                return $value;
            }
        }
        if($filter === 'place') {
            $place = $this->findPlaceNamed($value);
            return $place->value;
        }
        if($filter === 'country') {
            $country= $this->findCountryNamed($value);
            return $country->value;
        }
        if($filter === 'fate') {
            $fate= $this->findFateNamed($value);
            return $fate->value;
        }
        

        return $value;
    }
    private function wrap($value) {
        return "'".$value."'";
    }
    private function getColumns($filter) {
        switch($filter) {
            case 'place': return $this->getPlaces();
            case 'country': return $this->getCountries();
            case 'shipname': return $this->getShipname();
            case 'owner': return $this->getOwners();
            case 'captain': return $this->getCaptains();
            case 'fate': return $this->getFate();
            case 'embarked': return ['slaximp'];
            case 'disembarked': return ['slamimp'];
            case 'died': return ['slaximp', 'slamimp'];
            case 'date': return $this->getDateNames();
            default: return []; 
        }
    }
    private function getPlaces() {
        return ['placcons',  'placreg',  'portdep',  'ptdepimp',   'embport',     'embport2', 
                'plac1tra',  'plac2tra', 'plac3tra', 'majbuypt',   'mjbyptimp',   'npafttra', 
                'arrport',   'arrport2', 'sla1port', 'adpsale1',   'adpsale2',    'majselpt', 
                'mjslptimp', 'constreg', 'regisreg', 'deptregimp', 'deptregimp1', 'embreg',
                'embreg2',   'regem1',   'regem2',   'regem3',     'majbyimp',    'majbyimp1', 'regarr',
                'regarr2',   'regdis1',  'regdis2',  'regdis3',    'mjselimp',    'mjselimp1',
                'portret'
        ];
    }
    private function getOwners() {
        return [
            'ownera', 'ownerb', 'ownerc', 'ownerd', 'ownere', 'ownerf', 'ownerg', 'ownerh', 'owneri', 'ownerj', 'ownerk', 'ownerl', 'ownerm', 'ownern', 'ownero', 'ownerp'
        ];
    }
    private function getCaptains() {
        return [
            'captaina', 'captainb', 'captainc'
        ];
    }
    private function getFate() {
        return ['fate', 'fate2', 'fate3', 'fate4'];
    }
    private function getShipname() {
        return ['shipname'];
    }
    private function getCountries() {
        return ['natinimp', 'national'];
    }
    private function getDateNames() {
        return [
            'yearaf',
            'yearam',
            'yeardep'
        ];    
    }


    private function findPlaceNamed($name) {
        $query = "SELECT * FROM places WHERE label = '$name'";
        $erg = $this->db->query($query);
        return $erg->result()[0];
    }
    private function findCountryNamed($name) {
        $query = "SELECT * FROM national WHERE label = '$name' UNION SELECT * FROM natinimp WHERE label = '$name' ";
        $erg = $this->db->query($query);
        return $erg->result()[0];
    }
    private function findFateNamed($name) {
        $query = "SELECT * FROM fate WHERE label = '$name' " .
            "UNION SELECT * FROM fate2 WHERE label = '$name' " .
            "UNION SELECT * FROM fate3 WHERE label = '$name' " .
            "UNION SELECT * FROM fate4 WHERE label = '$name'";
        $erg = $this->db->query($query);
        return $erg->result()[0];
    }

    
}