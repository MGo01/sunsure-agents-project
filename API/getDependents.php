<?php
  // File to connect to DB
  require 'db_conn.php';

  // Receive JSON payload from search.js file.
  $inputFromJson = json_decode(file_get_contents('php://input'), true);

  $DependentID = $inputFromJson["DependentID"];

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

  // Create an Array of Policyholders.
  $dependentsArray[] = array();

  // Check if the input string has an empty space at the beginning of the array.
  if (strpos($Input, ' ') > 0)
  {
    $names = explode(" ", $Input);

    $sql_check = "SELECT * from Dependents WHERE (DependentID = $DependentID)";

    $result = mysqli_query($conn, $sql_check);

    if (mysqli_query($conn, $sql_check))
    {
      // Retrieve search results via getPolicyHolders()
      // and store them in "searchResults"
      $searchResults = getDependents($result);

      if (is_null($searchResults))
        returnInfo("No valid Dependents were found");
      else
        returnInfo($searchResults);
    }

    else
    {
      // echo "failed to search records";
      returnError($conn->error);
    }
  }

  else
  {
    // Retrieve ALL dependents that correspond to the DependentID
    $sql = "SELECT * FROM Dependents WHERE (DependentID = $DependentID)";

    $result = mysqli_query($conn, $sql);

    if (mysqli_query($conn, $sql))
    {
      // Retrieve search results via getPolicyHolders()
      // and store them in "searchResults"
      $searchResults = getDependents($result, $conn);

      if (is_null($searchResults))
        returnError("No valid Dependents were found");
      else
        returnInfo($searchResults);
    }

    else
    {
      // echo "failed to search records";
      returnError($conn->error);
    }
  }

  mysqli_close($conn);

  function returnError($error)
  {
    $retval = (object) [
      'results' => $error
    ];

    outputJson($retval);
  }

  function returnInfo($info)
  {
    $retval = (object) [
    'results' => $info
    ];

    outputJson($retval);
  }

  function getDependents($result, $conn)
  {
    while ($dep_row = mysqli_fetch_array($result))
    {
      $newDependent = new Dependent();

      $newDependent->FirstName = $dep_row['FirstName'];
      $newDependent->LastName = $dep_row['LastName'];
      $newDependent->DateOfBirth = $dep_row['DateOfBirth'];
      $newDependent->SSN = $dep_row['SSN'];
      $newDependent->DependentID = $dep_row['DependentID'];

      $dependentsArray[] = $newDependent;
    }

    return $dependentsArray;
  }

  function outputJson($file)
  {
    header("Content-type:application/json");
    $jsonObj = json_encode($file);
    echo $jsonObj;
  }
?>