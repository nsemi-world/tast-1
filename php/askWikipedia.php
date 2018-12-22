<?php
ob_start("ob_gzhandler");
require_once('./utils.php');

// MAIN

header('Content-type:application/json;charset=utf-8');


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
    
