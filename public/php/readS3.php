<?php

require '../vendor/autoload.php';


use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

// Bucket name
$bucket = 'tastxplorer';
$bucket_url = "https://s3.eu-central-1.amazonaws.com/$bucket/";

// Instantiate a S3 client
$s3 = new S3Client([
    'version' => 'latest',
    'region'  => 'eu-central-1'
]);

// Read the first 1000 Objects from bucket
try {
    $objects = $s3->listObjects([
        'Bucket' => $bucket
    ]);
    
    foreach($objects['Contents'] as $object) {
        //echo json_encode($object);
        $key = $object['Key'];
        $src = $bucket_url . $key;
        
        /*$obj = $s3->getObject([
            'Bucket' => $bucket,
            'Key'   => $key
        ]);        
        $contentType = $obj['ContentType'];*/
        if($key != 'img/' && $key != 'atricles-img/') {
            echo "<img src='$src' style='height: 100px;' title='$key'/>";
        }
    }
    
} catch(S3Exception $e) {
    echo $e->getMessage() . PHP_EOL;
}

?>