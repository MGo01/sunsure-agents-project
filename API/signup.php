<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $FirstName = $inputFromJson['FirstName'];
  $LastName = $inputFromJson['LastName'];
  $Password =  $inputFromJson['Password'];
  $Email = $inputFromJson['Email'];

  // Generate a random string based on unique Agent email
  $AgentID = md5(time().$Email);

  if (checkEmailUsed($Email, $conn))
  {
    $sql = "INSERT INTO Agents (Password, Email, FirstName, LastName, AgentID)
    VALUES ('".$Password."','".$Email."','".$FirstName."','".$LastName."', '".$AgentID."')";

    if (mysqli_query($conn, $sql))
    {
      // Successfully inserted Agent into DB.
      returnInfo("Agent has been inserted successfully!");
    }

    else
    {
      //echo "failed to insert records";
      returnError($conn->error);
    }
  }

  else
  {
    returnInfo("Email used");
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

  function checkEmailUsed($email, $conn)
  {
    $sql = "SELECT * FROM Agents WHERE Email = '$email'";
    $result = mysqli_query($conn, $sql);
    $rows = mysqli_num_rows($result);

    if ($rows > 0)
      return False;
    else
      return True;
  }
?>