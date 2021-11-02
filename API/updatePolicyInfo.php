<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $ApplicationID = $inputFromJson['ApplicationID'];
  $PolicyType = $inputFromJson['PolicyType'];

  $AncillaryType = $inputFromJson['AncillaryType'];
  $Carrier = $inputFromJson['Carrier'];

  $EffectiveDate = $inputFromJson['EffectiveDate'];
  $AmbassadorName = $inputFromJson['AmbassadorName'];
  $Notes = $inputFromJson['Notes'];

  $PolicyInfoID = $inputFromJson['PolicyInfoID'];

  $sql = "UPDATE Policy_Info SET ApplicationID = IF(LENGTH('$ApplicationID')=0, ApplicationID, \"{$ApplicationID}\"), 
                  PolicyType = IF(LENGTH('$PolicyType')=0, PolicyType, \"{$PolicyType}\"), 
                  AncillaryType = IF(LENGTH('$AncillaryType')=0, AncillaryType, \"{$AncillaryType}\"), 
                  Carrier = IF(LENGTH('$Carrier')=0, Carrier, \"{$Carrier}\"), 
                  EffectiveDate = IF(LENGTH('$EffectiveDate')=0, EffectiveDate, \"{$EffectiveDate}\"), 
                  AmbassadorName = IF(LENGTH('$AmbassadorName')=0, AmbassadorName, \"{$AmbassadorName}\"), 
                  Notes = IF(LENGTH('$Notes')=0, Notes, \"{$Notes}\") WHERE PolicyInfoID = '{$PolicyInfoID}'";

  if (mysqli_query($conn, $sql))
  {
    // Successfully inserted Agent into DB message.
    returnInfo("Policy Information has been updated successfully!");
  }

  else
  {
    // echo "failed to insert records";
    returnError($conn->error);
  }

  mysqli_close($conn);

  function returnError($error)
  {
    $retval = (object) [
      'msg' => $error
    ];
    
    outputJson($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
      'msg' => $info
    ];

    outputJson($retval);
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>