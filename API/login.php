<?php

  require 'db_conn.php';

  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $Email = $inputFromJson['Email'];
  $Password = $inputFromJson['Password'];

  // Query to DB
  $sql = "SELECT * FROM Agents WHERE (Email='$Email')";
  $result = mysqli_query($conn, $sql);

  // Retrieve the number of rows
  // to check if an account with the input email exists
  $numRows = mysqli_num_rows($result);

  // Check if User exists.
  if ($numRows > 0)
  {
    // Create Agent object to store agent fields
    // in new variables below.
    $Agent = $result->fetch_assoc();

    // Load Agent data into variables
    // for sending back to client-side later.
    $ID = $Agent["AgentID"];
    $FirstName = $Agent["FirstName"];
    $LastName = $Agent["LastName"];
    $Check_Password = $Agent['Password'];
    $Email = $Agent["Email"];
    $Role = $Agent["Role"];
    $isVerified = $Agent['isVerified'];

    // Retrieve pepper from configuration file
    $pepper = $configs["pepper"];

    // Set up parameters for password hashing options
    $cost = 10;

    // Pepper and hash the input password
    // $pwd_peppered = hash_hmac("sha256", $Password, $pepper);
    $pwd_hashed = $Check_Password;

    if (password_verify($Password, $pwd_hashed)) 
    {
      // Ensure that the user is verified before
      // logging them in
      if ($isVerified == 'Y')
      {
        // Returns User information to be stored
        // on the Front-End (FE).
        returnUser($ID, $FirstName, $LastName, $Email, $Role);
      }

      else
      {
        returnError("User is not verified");
      }
    }

    else
    {
      returnError("Email or password is incorrect");
    }
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
      'ID' => $ID,
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