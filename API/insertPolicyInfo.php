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

  if (checkPolicyInfo($PolicyInfoID, $conn))
  {
    if (mysqli_query($conn, $policy_sql))
    {
      // Successfully inserted Policy Information into DB message.
      returnInfo("Successfully inserted Policy Information");
    }

    else
    {
      returnError($conn->$error);
    }
  }

  else
  {
    returnError("Policy Information has already been inserted.");
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
  
  function checkPolicyInfo($PolicyInfoID, $conn)
  {
    // Check if there is some policy information with the same
    // ID within the Policy_Info table.
    $sql_id = "SELECT * FROM Policy_Info
                WHERE PolicyInfoID = '$PolicyInfoID'";

    $result = mysqli_query($conn, $sql_id);
    $rows = mysqli_num_rows($result);

    if ($rows > 0)
      return False;
    else
      return True;
  }
?>