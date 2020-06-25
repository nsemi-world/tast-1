<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once 'MY_Model.php';
class ImagesModel extends MY_Model 
{
    
    public function __construct() 
    {
        parent::__construct('images');
    }

    
}