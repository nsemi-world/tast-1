<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ClientApi extends CI_Controller {

	/**
	 * Index Page for this controller.
         * NO semantics for index method.
	 */
	public function index()
	{
            show_404();
	}
        
        public function getSectionImageFromDatabase($name) 
        {
            if($name) {
                $image = $this->getImage($name);
                if($image) {
                    $data = json_encode(['url' => $this->toDataUrl($image['data'])]);
                    $this->createResponse($data);
                }
            }
        }      
                
        private function getImage($name) 
        {
            $this->load->model('ImagesModel');
            $image = $this->ImagesModel->get_where_single(array('name' => $name));
            return $image;
        }

        private function toDataUrl($blob) 
        {
            return 'data:image/jpg;base64,' . base64_encode($blob);
        }        

        public function data($filename) {
            $data = file_get_contents(base_url().'json/'.$filename);
            $this->createResponse(json_decode($data));
        }
        
        public function getVoyageIds($include_summary=false)
        {
            $this->load->model('VoyagesModel');
            $voyages = $this->VoyagesModel->get_all_ids();
 
            $result = array(
                'ids' => array(),
                'summary' => ""
            );
            
            foreach($voyages as $id) {
                $result['ids'][] = $id['voyageid'];
            }
            
            
            if($include_summary) {
                $summary = $this->VoyagesModel->findAllVoyagesSummary();
                $result['summary'] = $summary;
            }
            
            $this->createResponse($result);
        }
        
        public function getVoyageItineraryById($voyageid)
        {
            $this->load->model('VoyageItineraryModel');
            $vinfo = $this->VoyageItineraryModel->getItinerary($voyageid);
            $this->createResponse($vinfo);
        }
        
        public function getFilteredVoyageIds() {
            $filter = $this->input->post('filter');
            $value = $this->input->post('value');
            $include_summary = $this->input->post('include_summary');
            
            $this->load->model('VoyagesModel');
            $voyages = $this->VoyagesModel->get_all_ids_filtered($filter, $value);
            
            $result = array(
                'ids' => array(),
                'summary' => ""
            );
            
            foreach($voyages as $id) {
                $result['ids'][] = intval($id['voyageid']);
            }
            
            
            if($include_summary) {
                $summary = $this->VoyagesModel->findAllVoyagesSummary();
                $result['summary'] = $summary;
            }
            
            $this->createResponse($result);
        }
        
        public function getObservations() {
            $variables  = $this->input->post('variables');
            $join       = $this->input->post('join');
            
            $this->load->model('ObservationsModel');
            $data = $this->ObservationsModel->getObservations($variables, $join);
            $this->createResponse($data);
        }
        
        public function getTops() {
            $min        = $this->input->post('min');
            $type       = $this->input->post('type');
            $criteria   = $this->input->post('criteria');
            
            $this->load->model('QuizzModel');
            $data = $this->QuizzModel->getTops($min, $type, $criteria);
            $this->createResponse($data);
        }

        public function getChartData() {
            $select        = $this->input->post('select');
            $groupBy       = $this->input->post('groupBy');
            $orderBy       = $this->input->post('orderBy');
            
            $this->load->model('ChartsModel');
            $data = $this->ChartsModel->getChartsData($select, $groupBy, $orderBy);
            $this->createResponse($data);
        }

        private function createResponse($data, $status = 200) 
        {
            return $this->output
                ->set_content_type('application/json')
                ->set_status_header($status) // Return status
                ->set_output(json_encode($data));
        } 

}
