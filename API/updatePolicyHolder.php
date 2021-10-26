<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $AgentID = $inputFromJson['AgentID'];
  $PolicyID = $inputFromJson['PolicyID'];
  $FirstName = $inputFromJson['FirstName'];
  $LastName = $inputFromJson['LastName'];
  $DateOfBirth = $inputFromJson['DateOfBirth'];
  $SSN = $inputFromJson['SSN'];
  $Phone = $inputFromJson['Phone'];
  $Address = $inputFromJson['Address'];
  $Second_Line_Address = $inputFromJson['Second_Line_Address'];
  $City = $inputFromJson['City'];
  $ZipCode = $inputFromJson['ZipCode'];
  $State =  $inputFromJson['State'];
  $Email = $inputFromJson['Email'];
  $NumOfDependents = $inputFromJson['NumOfDependents'];
  $Source = $inputFromJson['Source'];

  $sql = "UPDATE Primary_PolicyHolders SET FirstName = '" . $FirstName . "', LastName = '" . $LastName . "', DateOfBirth = '" . $DateOfBirth . "', SSN = '" . $SSN . "', Phone = '" . $Phone . "', Address = '" . $Address . "', Second_Line_Address = '" . $Second_Line_Address . "', City = '" . $City . "', ZipCode = '" . $ZipCode . "', State = '" . $State . "', Email = '" . $Email . "', NumOfDependents = '" . $NumOfDependents . "', Source = '" . $Source . "' WHERE AgentID = '" . $AgentID . "' AND PolicyID = '" . $PolicyID . "'";

  if (mysqli_query($conn, $sql))
  {
    // Successfully inserted Agent into DB message.
    returnInfo("Primary PolicyHolder has been updated successfully!");
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

  function showToken($token)
  {
    outputJson($retval);
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>