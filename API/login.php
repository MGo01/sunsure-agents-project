<?php

  require 'db_conn.php';

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $Email = $inputFromJson['Email'];
  $Password = $inputFromJson['Password'];

  // Query to DB
  $sql = "SELECT * FROM Agents WHERE (Email='$Email' AND Password='$Password')"; 
  $result = mysqli_query($conn, $sql);
  $numRows = mysqli_num_rows($result);

  // Check if User exists.
  if ($numRows > 0)
  {
    // Create Agent object to store agent fields
    // in new variables below.
    $Agent = $result->fetch_assoc();

    $ID = $Agent["AgentID"];
    $FirstName = $Agent["FirstName"];
    $LastName = $Agent["LastName"];
    $Email = $Agent["Email"];
    
    // Returns User information to be stored 
    // on the Front-End (FE).
    returnUser($ID, $FirstName, $LastName, $RSO, $Email);
  }
  
  // User was not found.
  else
  {
    returnError("Email or password is incorrect");
  }

  $conn->close();

  // Return DB Query Error
  function returnError($error)
  {
    $retval = (object) [
      'msg' => $error
    ];

    outputJSON($retval);
  }

  // This takes the user to the landing page.
  // It will also send the user info to the landing page
  function returnUser($ID, $FirstName, $LastName, $Email)
  {
    $retval = (object) [
      'ID' => $ID
      'FirstName' => $FirstName,
      'LastName' => $LastName,
      'Email' => $Email
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
