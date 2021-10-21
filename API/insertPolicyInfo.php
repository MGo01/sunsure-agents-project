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

  $policy_sql = "INSERT INTO Policy_Info (ApplicationID, PolicyType, AncillaryType, Carrier, EffectiveDate, AmbassadorName, Notes, PolicyInfoID)
                 VALUES (\"{$ApplicationID}\", \"{$PolicyType}\", \"{$AncillaryType}\", \"{$Carrier}\", \"{$EffectiveDate}\", \"{$AmbassadorName}\", \"{$Notes}\", \"{$PolicyInfoID}\")";

  if (mysqli_query($conn, $policy_sql))
  {
    // Successfully inserted Policy Information into DB message.
    returnInfo("Successfully inserted Policy Information");
  }

  else
  {
    returnError($conn->$error);
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