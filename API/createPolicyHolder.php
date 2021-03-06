<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  // Extract and place all JSON members
  // into separate variables.
  $AgentID = $inputFromJson['AgentID'];
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
  $SubmissionDate = $inputFromJson['SubmissionDate'];
  $Source = $inputFromJson['Source'];

  // Create a class capable of holding Dependent
  // information for search queries.
  class Dependent
  {
    public $FirstName = "";
    public $LastName = "";
    public $DateOfBirth = "";
    public $SSN = "";
    public $DependentID = "";
  }

  // Generate a random string based on last name
  // and date of birth of policyholder
  $PolicyID = uniqid($lastName . $dob, true);

  // Check for duplicates based on the last name
  // and date of birth of the primary policyholder.
  if (checkPrimaryPolicy($LastName, $DateOfBirth, $conn))
  {
    $sql = "INSERT INTO Primary_PolicyHolders (AgentID, FirstName, LastName, DateOfBirth, SSN, Phone, Address, Second_Line_Address, City, ZipCode, State, Email, NumOfDependents, SubmissionDate, Source)
    VALUES ('".$AgentID."','".$FirstName."','".$LastName."','".$DateOfBirth."', '".$SSN."',
            '".$Phone."','".$Address."','".$Second_Line_Address."', '".$City."', '".$ZipCode."',
            '".$State."','".$Email."', '".$NumOfDependents."', '".$SubmissionDate."', '".$Source."')";

    $getPolicysql = "SELECT * FROM Primary_PolicyHolders WHERE (LastName='$LastName' AND DateOfBirth='$DateOfBirth')";

    // Insert the primary policyholder before returning
    // the ID of the agent. 
    if (mysqli_query($conn, $sql))
    {
      // Create PrimaryPolicyHolder variable to store agent fields
      // in new variables below.
      $result = mysqli_query($conn, $getPolicysql);
      $PrimaryPolicyHolder = $result->fetch_assoc();

      $ID = $PrimaryPolicyHolder["PolicyID"];

      // Successfully inserted Primary Policyholder into DB message.
      returnInfo($ID);
    }

    else
    {
      returnError($conn->$error);
    }
  }

  else
  {
    returnInfo("Primary Policy Holder has already been inserted");
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

  // Returns False if a duplicate is found, otherwise
  // this function returns True.
  function checkPrimaryPolicy($lastName, $dob, $conn)
  {
    // Check if there is an agent with the same
    // Date of Birth and Last Name Within the Primary Policyholders Table.
    $sql_id = "SELECT * FROM Primary_PolicyHolders
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