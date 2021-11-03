<?php

  // Connect to database.
  require 'db_conn.php';

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $checkToken = $inputFromJson['resetToken'];
  $newPassword = $inputFromJson['newPassword'];

  // Check if the token references any User in the database.
  $sql = "UPDATE Agents SET Password = '$newPassword' WHERE passwordToken = '$checkToken'";
  
  // Clear expired reset tokens
  $clear_sql = "DELETE FROM Agents WHERE Expires < NOW()";
  mysqli_query($conn, $clear_sql);

  if (mysqli_query($conn, $sql))
  {
    returnInfo("Password has successfully been reset.");
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
    
    outputJson($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
      'msg' => $info
    ];

    outputJson($retval);
  }
  
  function outputJson ($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>