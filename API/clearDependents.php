<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive and decode JSON payload from signup.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $DependentID = $inputFromJson['DependentID'];

  $delete_sql = "DELETE FROM Dependents WHERE DependentID = '$DependentID'";

  if (mysqli_query($conn, $delete_sql))
  {
    // Successfully inserted Agent into DB message.
    returnInfo("Dependents have been cleared");
  }

  else
  {
    // There was likely an error in the request or 
    // the dependentID does not exist within the Dependents table.
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

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>