<body>
<?php
    $this->load->view('Header');
    $this->load->view('voyages/VoyagesArticle');
    $this->load->view('Footer');
?>
<link rel="stylesheet" href="https://cdn.knightlab.com/libs/storymapjs/latest/css/storymap.css">
<script type="text/javascript" src="https://cdn.knightlab.com/libs/storymapjs/latest/js/storymap-min.js"></script>
<script src="<?=base_url();?>js/voyages.js"></script>
</body>
