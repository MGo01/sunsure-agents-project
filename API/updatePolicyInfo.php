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

  $sql = "UPDATE Policy_Info SET ApplicationID = '" . $ApplicationID . "', PolicyType = '" . $PolicyType . "', AncillaryType = '" . $AncillaryType . "', Carrier = '" . $Carrier . "', EffectiveDate = '" . $EffectiveDate . "', AmbassadorName = '" . $AmbassadorName . "', Notes = '" . $Notes . "' WHERE PolicyInfoID = '" . $PolicyInfoID . "'";

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