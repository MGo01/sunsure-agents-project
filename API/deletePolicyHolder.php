<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $PolicyID = $inputFromJson['PolicyID'];

  $sql_policyInfo = "DELETE FROM Policy_Info 
                      WHERE PolicyInfoID = '$PolicyID'";

  $sql_dependents = "DELETE FROM Dependents 
                      WHERE DependentID = '$PolicyID'";

  $sql_policyHolders = "DELETE FROM Primary_PolicyHolders 
                        WHERE PolicyID = '$PolicyID'"; 

  // SQL Commands must be executed in THIS ORDER otherwise, foreign key constraints errors
  // will be thrown. 
  if (mysqli_query($conn, $sql_policyInfo) && mysqli_query($conn, $sql_dependents) && mysqli_query($conn, $sql_policyHolders))
  {
    // Successfully inserted Agent into DB message.
    returnInfo("Primary PolicyHolder has been deleted successfully!");
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