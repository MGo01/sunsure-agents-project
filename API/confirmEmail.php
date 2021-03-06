<?php

  // Connect to database.
  require 'db_conn.php';

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $checkToken = $inputFromJson['emailToken'];

  // Check if the token references any User in the database.
  $sql = "UPDATE Agents SET isVerified = 'Y' WHERE AgentToken = '$checkToken'";

  if (mysqli_query($conn, $sql))
  {
    returnInfo("User has been verified");
  }

  else
  {
    returnError("Token may have expired or was not sent properly.");
  }

  mysqli_close($conn);


  function returnError($error)
  {
    $retval = (object) [
      'msg' => $error
    ];
    
    outputJSON($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
      'msg' => $info
    ];

    outputJSON($retval);
  }

  function outputJSON($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }

?>