<?php

include 'lib/classes/VoyagesDatabaseHelper.php';

function cityExistsAsDBPlace($city, $helper) {
    return $helper->placeExists($city);
}

function dbInsert($city, $latitude, $longitude) {
    $update = "UPDATE places SET latitude = $latitude, longitude=$longitude WHERE places.label=\'$city\'";
    //var_dump($update);
    //echo '<br/>';
    //echo (json_encode($line) . '<br/>');    
}

function csv2json($filename, $helper) {
    //Open our CSV file using the fopen function.
    $fh = fopen($filename, "r");

    //Setup a PHP array to hold our CSV rows.
    $csvData = array();

    //Loop through the rows in our CSV file and add them to
    //the PHP array that we created above.
    fgetcsv($fh, 10000, ",");
    while (($row = fgetcsv($fh, 1000, ",")) !== FALSE) {
        $helper->insertGeocoding($row[0], $row[1], $row[2], $row[3], $row[4], $row[5], $row[6]);
    }

    //Finally, encode our array into a JSON string format so that we can print it out.
    //return json_encode($csvData);
}
set_time_limit(0);

$helper = new VoyagesDatabaseHelper();
//csv2json('worldcities1.csv', $helper);
//csv2json('worldcities2.csv', $helper);
csv2json('worldcities3.csv', $helper);
csv2json('worldcities4.csv', $helper);
csv2json('worldcities5.csv', $helper);
csv2json('worldcities6.csv', $helper);
csv2json('worldcities7.csv', $helper);

header('Content-type:application/json;charset=utf-8');

//echo $myjson;
?>