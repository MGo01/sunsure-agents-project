<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $FirstName = $inputFromJson['FirstName'];
  $LastName = $inputFromJson['LastName'];
  $DateOfBirth = $inputFromJson['DateOfBirth'];
  $SSN = $inputFromJson['SSN'];
  $DependentID = $inputFromJson['DependentID'];

  if (checkDependent($LastName, $DateOfBirth, $conn))
  {
    $sql = "INSERT INTO Dependents (FirstName, LastName, DateOfBirth, SSN, DependentID)
    VALUES ('".$FirstName."','".$LastName."','".$DateOfBirth."', '".$SSN."',
            '".$DependentID."')";

    if (mysqli_query($conn, $sql))
    {
      // Successfully inserted Dependent into DB message.
      returnInfo("Dependent has been inserted successfully!");
    }

    else
    {
      // echo "failed to insert records";
      returnError($conn->error);
    }
  }

  else
  {
    returnInfo("Dependent has already been inserted");
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

  function checkDependent($lastName, $dob, $conn)
  {
    // Check if there is an agent with the same 
    // Date of Birth and Last Name Within the Dependents Table.
    $sql_id = "SELECT * FROM Dependents 
                WHERE LastName = '$lastName'
                AND DateOfBirth = '$dob'"; 

    $result = mysqli_query($conn, $sql_id);
    $rows = mysqli_num_rows($result);

    if ($rows > 0)
      return False;
    else
      return True;
  }
?>