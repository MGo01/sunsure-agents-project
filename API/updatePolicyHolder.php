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
  $UpdatedSubDate = $inputFromJson['UpdatedSubDate'];

  $sql = "UPDATE Primary_PolicyHolders SET FirstName = IF(LENGTH('$FirstName')=0, FirstName, \"{$FirstName}\"), 
                                    LastName = IF(LENGTH('$LastName')=0, LastName, \"{$LastName}\"), 
                                    DateOfBirth = \"{$DateOfBirth}\", 
                                    SSN = IF(LENGTH('$SSN')=0, SSN, \"{$SSN}\"), 
                                    Phone = IF(LENGTH('$Phone')=0, Phone, \"{$Phone}\"), 
                                    Address = IF(LENGTH('$Address')=0, Address, \"{$Address}\"), 
                                    Second_Line_Address = IF(LENGTH('$Second_Line_Address')=0, Second_Line_Address, \"{$Second_Line_Address}\"), 
                                    City = IF(LENGTH('$City')=0, City, \"{$City}\"), 
                                    ZipCode = IF(LENGTH('$ZipCode')=0, ZipCode, \"{$ZipCode}\"), 
                                    State = \"{$State}\", 
                                    Email = IF(LENGTH('$Email')=0, Email, \"{$Email}\"), 
                                    NumOfDependents = IF(LENGTH('$NumOfDependents') = 0, NumOfDependents, \"{$NumOfDependents}\"),
                                    UpdatedSubDate = \"{$UpdatedSubDate}\", 
                                    Source = \"{$Source}\" 
                                    WHERE AgentID = '{$AgentID}' AND PolicyID = '{$PolicyID}'";

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