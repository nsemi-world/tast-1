<?php

require_once('./utils.php');
require '../vendor/autoload.php';

use Aws\Credentials\CredentialProvider;
use Aws\S3\S3Client;


$AWS_ENDPOINT = 'https://s3.eu-central-1.amazonaws.com';
$AWS_BUCKET = 'tastxplorer';
$AWS_IMG = $AWS_ENDPOINT . '/' . $AWS_BUCKET . '/' . 'img/';


echo '<p>' . $AWS_ENDPOINT . '</p>';
echo '<p>' . $AWS_BUCKET . '</p>';
echo '<p>' . $AWS_IMG . '</p>';


// Read Credentials
$provider = CredentialProvider::env();

$s3 = new S3Client([
    'version' => 'latest',
    'region'  => 'eu-central-1',
    'provider' => $provider
]);


$bucketList = readBucketList($s3);

echo 'Bucket list: <pre>' . $bucketList . "</pre>\n";
echo 'Bucket Owner: <pre>' . $bucketList['Owner']['ID'] . '</pre>';
echo 'Bucket Metadata: <pre>' . $bucketList['@metadata']['statusCode'] . '</pre>';

foreach($bucketList['Buckets'] as $bucket) {
    echo 'Bucket name: <pre>' . $bucket['Name'] . '</pre>';
}


// Create 

function readBucketList($s3) {
    return $s3->listBuckets();
}

?>
