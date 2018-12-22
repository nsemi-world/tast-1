<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

// MAIN

header('Content-type:application/json;charset=utf-8');

$search = getRequestParameter('search');

if($search != null && $search != '') {
    $response = getWikipediaArticleIntro($search);
}

echo $response;
// end: MAIN


function getWikipediaArticleIntro($search) {
    $url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=".urlencode($search);
    return file_get_contents($url);
}

ob_end_flush();
?>
       

           
               
                   
                       
                           
                               
                                   
                                       
                                           
                                               
                                                   
                                                       
                                                               var wikipediaRequest = {
        url: 'https://en.wikipedia.org/w/api.php',
        format: 'json',
        action: 'query',
        prop: 'extracts&exintro&explaintext',
        redirects: 1,
        titles: author
    }
    var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=Frederick Douglass';
    
