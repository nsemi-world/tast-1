<?php
ob_start("ob_gzhandler");

require_once 'php/utils.php';



$template = file_get_contents('./templates/template.html');

$head           = file_get_contents('./templates/head.html');
$header         = file_get_contents('./templates/header.html');
$content        = file_get_contents('./templates/participation.html');
$footer         = file_get_contents('./templates/footer.html');

$my_scripts = '
    <script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.5.3/d3.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/topojson/1.6.9/topojson.min.js"></script>
    <script src="js/datamaps.world.min.js"></script>
    <script src="js/participation.js"></script>
';


$head = str_replace('###MY_SCRIPTS###', $my_scripts, $head);

$template = str_replace('###HEAD###', $head, $template);
$template = str_replace('###HEADER###', $header, $template);
$template = str_replace('###CONTENT###', $content, $template);
$template = str_replace('###FOOTER###', $footer, $template);


echo $template;

ob_end_flush();


function getTotalVoyages($pdo) {
    $sql = "SELECT COUNT(*) FROM voyages";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM);
}

function getCountriesNames($pdo) {
    $sql = "
        SELECT name 
        FROM (
            SELECT DISTINCT(label) as name FROM national
            UNION
            SELECT DISTINCT(label) as name FROM natinimp
        ) as names
        ORDER BY name ASC
    ";
    $erg = $pdo->query($sql);
    return $erg->fetchAll(PDO::FETCH_OBJ);
}

function getFirstVoyageDate($pdo) {
    $sql = "
        SELECT MIN(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != ''
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != ''
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != ''
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != ''
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != ''
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != ''
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != ''
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != ''
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != ''
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM);
}

function getLastVoyageDate($pdo) {
    $sql = "
        SELECT MAX(date)
        FROM 
        (
            SELECT YEAR(datedep) as date FROM voyages WHERE datedep != ''
            UNION
            SELECT datedepc as date FROM voyages WHERE datedepc != ''
            UNION
            SELECT d1slatrc as date FROM voyages WHERE d1slatrc != ''
            UNION
            SELECT dlslatrc as date FROM voyages WHERE dlslatrc != ''
            UNION
            SELECT datarr34 as date FROM voyages WHERE datarr34 != ''
            UNION
            SELECT datarr38 as date FROM voyages WHERE datarr38 != ''
            UNION
            SELECT datarr41 as date FROM voyages WHERE datarr41 != ''
            UNION
            SELECT ddepamc as date FROM voyages WHERE ddepamc != ''
            UNION
            SELECT datarr45 as date FROM voyages WHERE datarr45 != ''
        ) as result
        ";
    $erg = $pdo->query($sql);
    return $erg->fetch(PDO::FETCH_NUM);
}

function countriesToHtmlList($countries) {
    $ul = '<div class="card-columns">';
    foreach($countries as $country) {
        $li = '<div class="text-truncate">' . $country->name . '</div>';
        $ul .= $li;
    }
    
    $ul .= '</div>';
    return $ul;
}

?>