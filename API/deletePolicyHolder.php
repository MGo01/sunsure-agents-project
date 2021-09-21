<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $AgentID = $inputFromJson['AgentID'];
  $PolicyID = $inputFromJson['PolicyID'];

  $sql_dependents = "DELETE FROM Dependents 
                      WHERE DependentID = '$PolicyID'";

  $sql_policyHolders = "DELETE * FROM Primary_PolicyHolders 
                        WHERE AgentID = '$AgentID'"; 

  if (mysqli_query($conn, $sql_dependents) && mysqli_query($conn, $sql_policyHolders))
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
?>