<body>
<?php
    $this->load->view('Header');
    $this->load->view('participation/ParticipationArticle');
    $this->load->view('Footer');
?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.js" integrity="sha256-OztcN49BsVSoupBpIZaUwczM6+GLsXuA8IJF+W9SsBU=" crossorigin="anonymous"></script>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script src="https://d3js.org/d3-geo.v1.min.js"></script>
<script src="https://d3js.org/d3-geo-projection.v2.min.js"></script>
<script src="<?=base_url();?>js/ParticipationPlayer.js"></script>
<script src="<?=base_url();?>js/datamaps.world.min.js"></script>
<script src="<?=base_url();?>js/participation.js"></script>
</body>
