<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Explorer extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	public function index()
	{
		$this->participation();
	}
        
        public function participation() 
        {
		$this->load->view('participation/ParticipationPage');
        }
        
        public function voyages() 
        {
		$this->load->view('voyages/VoyagesPage');
        }
        
        public function database() 
        {
		$this->load->view('database/DatabasePage');
        }
        
        public function charts() 
        {
		$this->load->view('charts/ChartsPage');
        }
}
