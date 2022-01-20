<?php

  // Connect to database.
  require 'db_conn.php';

  // Load in pepper configurations
  $configs = include('config.php');

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $checkToken = $inputFromJson['resetToken'];
  $newPassword = $inputFromJson['newPassword'];

  $pepper = $configs["pepper"];

  // Pepper and hash the input password
  // $pwd_peppered = hash_hmac("sha256", $newPassword, $pepper);
  $pwd_hashed = password_hash($newPassword, PASSWORD_ARGON2ID);

  // Check if the token references any User in the database.
  $sql = "UPDATE Agents SET Password = '$pwd_hashed' WHERE passwordToken = '$checkToken'";
  
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