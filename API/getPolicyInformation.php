<?php

  require 'db_conn.php';

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $PolicyInfoID = $inputFromJson['PolicyInfoID'];

  // Query to DB
  $sql = "SELECT * FROM Policy_Info WHERE (PolicyInfoID ='$PolicyInfoID')";
  $result = mysqli_query($conn, $sql);
  $numRows = mysqli_num_rows($result);

  // Check if User exists.
  if ($numRows > 0)
  {
    // Create Agent object to store agent fields
    // in new variables below.
    $PolicyInfo = $result->fetch_assoc();

    $ApplicationID = $PolicyInfo['ApplicationID'];
    $PolicyType = $PolicyInfo['PolicyType'];
  
    $AncillaryType = $PolicyInfo['AncillaryType'];
    $Carrier = $PolicyInfo['Carrier'];
  
    $EffectiveDate = $PolicyInfo['EffectiveDate'];
    $AmbassadorName = $PolicyInfo['AmbassadorName'];
    $Notes = $PolicyInfo['Notes'];

    // Returns User information to be stored
    // on the Front-End (FE).
    returnUser($ApplicationID, $PolicyType, $AncillaryType, $Carrier, $EffectiveDate, $AmbassadorName, $Notes);
  }

  // User was not found.
  else
  {
    returnError("Policy Information associated with given ID does not exist.");
  }

  $conn->close();

  // Return DB Query Error.
  function returnError($error)
  {
    $retval = (object) [
      'msg' => $error
    ];

    outputJSON($retval);
  }

  // This takes the user to the landing page.
  // It will also send the user info to the landing page
  function returnUser($ApplicationID, $PolicyType, $AncillaryType, $Carrier, $EffectiveDate, $AmbassadorName, $Notes)
  {
    $retval = (object) [
      'ApplicationID' => $ApplicationID,
      'PolicyType' => $PolicyType,
      'AncillaryType' => $AncillaryType,
      'Carrier' => $Carrier,
      'EffectiveDate' => $EffectiveDate,
      'AmbassadorName' => $AmbassadorName,
      'Notes' => $Notes,
      ];

    outputJSON($retval);
  }

  // This return JSON files to the Front-End.
  function outputJSON($file)
  {
    header('Content-type: application/json');

    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>