<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

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
  $PolicyInfoID = $inputFromJson['PolicyInfoID'];
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

  if (checkPrimaryPolicy($LastName, $DateOfBirth, $conn))
  {
    $sql = "INSERT INTO Primary_PolicyHolders (AgentID, FirstName, LastName, DateOfBirth, SSN, Phone, Address, Second_Line_Address, City, ZipCode, State, Email, NumOfDependents, PolicyInfoID, Source)
    VALUES ('".$AgentID."','".$FirstName."','".$LastName."','".$DateOfBirth."', '".$SSN."',
            '".$Phone."','".$Address."','".$Second_Line_Address."', '".$City."', '".$ZipCode."',
            '".$State."','".$Email."', '".$NumOfDependents."', '".$PolicyInfoID."', '".$Source."')";

    if (mysqli_query($conn, $sql))
    {

      // Query to DB to retrieve most recently inserted record's ID
      $sql = "SELECT SCOPE_IDENTITY()";
      $result = mysqli_query($conn, $sql);

      // Create Agent object to store agent fields
      // in new variables below.
      $PrimaryPolicyHolder = $result->fetch_assoc();

      $ID = $PrimaryPolicyHolder["PolicyID"];

      // Successfully inserted Primary Policyholder into DB message.
      returnInfo($ID);
    }

    else
    {
      // echo "failed to insert records";
      returnError($conn->error);
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
    
    outputJson($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
    'msg' => $info
    ];

    outputJson($retval);
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }

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