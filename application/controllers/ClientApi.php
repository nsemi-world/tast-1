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
                    $data = json_encode(['url' => $this->toDataUrl($image->data)]);
                    $this->createResponse($data);
                }
            }
        }
                
        
        private function getImage($name) {
            $this->load->model('ImagesModel');
            $image = $this->ImagesModel->get_where_single(array('name' => $name));
            return $image;
        }

        private function toDataUrl($blob) {
            return 'data:image/jpg;base64,' . base64_encode($blob);
        }        
        
        private function createResponse($data, $status = 200) 
        {
            return $this->output
                ->set_content_type('application/json')
                ->set_status_header($status) // Return status
                ->set_output(json_encode($data));
        } 

}
